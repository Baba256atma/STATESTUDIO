/**
 * APP-10:3 — Similarity Engine comparison and explanation builder.
 */

import type { ExecutivePattern } from "./patternExtractionEngineTypes.ts";
import {
  SIMILARITY_DIMENSION_WEIGHTS,
  SIMILARITY_ENGINE_CONTRACT_VERSION,
  SIMILARITY_SCORING_METHOD,
} from "./similarityEngineConstants.ts";
import { scoreScenarioAgainstPattern, scoreScenarioProfiles } from "./similarityEngineScoring.ts";
import type {
  PatternSimilarityResult,
  ScenarioSimilarityProfile,
  ScenarioSimilarityResult,
  SimilarityDimensionId,
  SimilarityEvidence,
  SimilarityExplanation,
  SimilarityScoreBreakdown,
} from "./similarityEngineTypes.ts";

function buildSimilarityResultId(
  queryScenarioId: string,
  targetId: string,
  comparisonType: "scenario_to_scenario" | "scenario_to_pattern"
): string {
  return `similarity-result-${comparisonType}-${queryScenarioId}-${targetId}`.replace(/[^a-zA-Z0-9_-]/g, "-");
}

function buildExplanation(
  breakdown: SimilarityScoreBreakdown,
  contributingScenarioIds: readonly string[],
  contributingPatternIds: readonly string[],
  targetLabel: string
): SimilarityExplanation {
  const matchedDimensions = breakdown.dimensions
    .filter((dimension) => dimension.matched && dimension.weight > 0)
    .map((dimension) => dimension.dimensionId);
  const weightedDimensionIds = (Object.keys(SIMILARITY_DIMENSION_WEIGHTS) as SimilarityDimensionId[]).filter(
    (dimensionId) => SIMILARITY_DIMENSION_WEIGHTS[dimensionId] > 0
  );
  const unmatchedDimensions = weightedDimensionIds.filter((dimensionId) => !matchedDimensions.includes(dimensionId));
  const matchedLabels = breakdown.dimensions
    .filter((dimension) => dimension.matched && dimension.weight > 0)
    .map((dimension) => dimension.label)
    .join(", ");
  const unmatchedLabels = breakdown.dimensions
    .filter((dimension) => !dimension.matched && dimension.weight > 0)
    .map((dimension) => dimension.label)
    .join(", ");

  return Object.freeze({
    summary: `Deterministic similarity score ${breakdown.totalScore}/100 for ${targetLabel}. Matched: ${matchedLabels || "none"}. Unmatched: ${unmatchedLabels || "none"}.`,
    matchedDimensions: Object.freeze(matchedDimensions),
    unmatchedDimensions: Object.freeze(unmatchedDimensions),
    contributingScenarioIds: Object.freeze([...contributingScenarioIds]),
    contributingPatternIds: Object.freeze([...contributingPatternIds]),
    finalScore: breakdown.totalScore,
    scoringMethod: SIMILARITY_SCORING_METHOD,
    readOnly: true as const,
  });
}

function buildEvidenceFromBreakdown(
  breakdown: SimilarityScoreBreakdown,
  referenceId: string,
  sourceType: "scenario" | "pattern"
): readonly SimilarityEvidence[] {
  const dimensionEvidence = breakdown.dimensions
    .filter((dimension) => dimension.weight > 0)
    .map((dimension) =>
      Object.freeze({
        evidenceId: `evidence-${sourceType}-${referenceId}-${dimension.dimensionId}`,
        sourceType: "dimension" as const,
        referenceId,
        description: `${dimension.label}: ${dimension.matched ? "matched" : "not matched"} (${dimension.weightedContribution}/${dimension.weight}).`,
        readOnly: true as const,
      })
    );
  return Object.freeze([
    Object.freeze({
      evidenceId: `evidence-${sourceType}-${referenceId}-target`,
      sourceType,
      referenceId,
      description: `${sourceType} reference ${referenceId} contributed to deterministic similarity scoring.`,
      readOnly: true as const,
    }),
    ...dimensionEvidence,
  ]);
}

export function compareScenarioPair(
  query: ScenarioSimilarityProfile,
  candidate: ScenarioSimilarityProfile,
  comparedAt: string
): ScenarioSimilarityResult {
  const breakdown = scoreScenarioProfiles(query, candidate);
  const explanation = buildExplanation(breakdown, Object.freeze([candidate.scenarioId]), Object.freeze([]), candidate.scenarioId);
  return Object.freeze({
    similarityResultId: buildSimilarityResultId(query.scenarioId, candidate.scenarioId, "scenario_to_scenario"),
    queryScenarioId: query.scenarioId,
    matchedScenarioId: candidate.scenarioId,
    workspaceId: query.workspaceId,
    comparisonType: "scenario_to_scenario",
    score: breakdown.totalScore,
    dimensions: breakdown.dimensions,
    evidence: buildEvidenceFromBreakdown(breakdown, candidate.scenarioId, "scenario"),
    explanation,
    comparedAt,
    version: SIMILARITY_ENGINE_CONTRACT_VERSION,
    readOnly: true as const,
  });
}

export function compareScenarioToPatternPair(
  query: ScenarioSimilarityProfile,
  pattern: ExecutivePattern,
  comparedAt: string
): PatternSimilarityResult {
  const breakdown = scoreScenarioAgainstPattern(query, pattern);
  const explanation = buildExplanation(
    breakdown,
    Object.freeze([...pattern.sourceScenarioIds]),
    Object.freeze([pattern.patternId]),
    pattern.patternName
  );
  return Object.freeze({
    similarityResultId: buildSimilarityResultId(query.scenarioId, pattern.patternId, "scenario_to_pattern"),
    queryScenarioId: query.scenarioId,
    matchedPatternId: pattern.patternId,
    workspaceId: query.workspaceId,
    comparisonType: "scenario_to_pattern",
    score: breakdown.totalScore,
    dimensions: breakdown.dimensions,
    evidence: buildEvidenceFromBreakdown(breakdown, pattern.patternId, "pattern"),
    explanation,
    comparedAt,
    version: SIMILARITY_ENGINE_CONTRACT_VERSION,
    readOnly: true as const,
  });
}

export function compareScenarioSimilarityProfiles(
  query: ScenarioSimilarityProfile,
  historicalScenarios: readonly ScenarioSimilarityProfile[],
  comparedAt: string,
  minScore: number = 0
): readonly ScenarioSimilarityResult[] {
  return Object.freeze(
    historicalScenarios
      .map((candidate) => compareScenarioPair(query, candidate, comparedAt))
      .filter((result) => result.score >= minScore)
      .sort((left, right) =>
        right.score === left.score
          ? left.matchedScenarioId.localeCompare(right.matchedScenarioId)
          : right.score - left.score
      )
  );
}

export function compareScenarioToPatternProfiles(
  query: ScenarioSimilarityProfile,
  patterns: readonly ExecutivePattern[],
  comparedAt: string,
  minScore: number = 0
): readonly PatternSimilarityResult[] {
  return Object.freeze(
    patterns
      .map((pattern) => compareScenarioToPatternPair(query, pattern, comparedAt))
      .filter((result) => result.score >= minScore)
      .sort((left, right) =>
        right.score === left.score
          ? left.matchedPatternId.localeCompare(right.matchedPatternId)
          : right.score - left.score
      )
  );
}

export const SimilarityEngineComparison = Object.freeze({
  compareScenarioPair,
  compareScenarioToPatternPair,
  compareScenarioSimilarityProfiles,
  compareScenarioToPatternProfiles,
});
