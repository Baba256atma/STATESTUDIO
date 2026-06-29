/**
 * APP-10:3 — Similarity Engine deterministic scoring rules.
 */

import { buildStrategySignature } from "./patternExtractionNormalizer.ts";
import type { ExecutivePattern } from "./patternExtractionEngineTypes.ts";
import {
  SIMILARITY_DIMENSION_LABELS,
  SIMILARITY_DIMENSION_WEIGHTS,
  SIMILARITY_ENGINE_LIMITS,
  SIMILARITY_SCORING_METHOD,
} from "./similarityEngineConstants.ts";
import type {
  ScenarioSimilarityProfile,
  SimilarityDimension,
  SimilarityDimensionId,
  SimilarityScoreBreakdown,
} from "./similarityEngineTypes.ts";

function normalizeValue(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function normalizeList(values: readonly string[]): readonly string[] {
  return Object.freeze([...new Set(values.map((value) => normalizeValue(value)).filter(Boolean))].sort());
}

function compareExact(left: string, right: string): boolean {
  return normalizeValue(left) === normalizeValue(right);
}

function compareStrategyChain(
  left: readonly string[],
  right: readonly string[]
): { matched: boolean; contributionRatio: number; queryValue: string; matchedValue: string } {
  const leftSignature = buildStrategySignature(left);
  const rightSignature = buildStrategySignature(right);
  if (leftSignature === rightSignature) {
    return {
      matched: true,
      contributionRatio: 1,
      queryValue: leftSignature,
      matchedValue: rightSignature,
    };
  }
  const leftSteps = left.map((step) => normalizeValue(step));
  const rightSteps = right.map((step) => normalizeValue(step));
  const maxSteps = Math.max(leftSteps.length, rightSteps.length, 1);
  const matchingSteps = leftSteps.filter((step, index) => rightSteps[index] === step).length;
  const ratio = matchingSteps / maxSteps;
  return {
    matched: ratio > 0,
    contributionRatio: ratio,
    queryValue: leftSignature,
    matchedValue: rightSignature,
  };
}

function compareObjectTypes(left: readonly string[], right: readonly string[]): boolean {
  const leftSet = normalizeList(left);
  const rightSet = normalizeList(right);
  if (leftSet.length === 0 || rightSet.length === 0) {
    return false;
  }
  return leftSet.some((value) => rightSet.includes(value));
}

function buildDimension(
  dimensionId: SimilarityDimensionId,
  matched: boolean,
  weight: number,
  contributionRatio: number,
  queryValue: string,
  matchedValue: string
): SimilarityDimension {
  const weightedContribution = matched ? Math.round(weight * contributionRatio) : 0;
  return Object.freeze({
    dimensionId,
    label: SIMILARITY_DIMENSION_LABELS[dimensionId],
    matched: matched && weightedContribution > 0,
    weight,
    weightedContribution,
    queryValue,
    matchedValue,
    readOnly: true as const,
  });
}

export function scoreScenarioProfiles(
  query: ScenarioSimilarityProfile,
  candidate: ScenarioSimilarityProfile
): SimilarityScoreBreakdown {
  const strategy = compareStrategyChain(query.strategyChain, candidate.strategyChain);
  const dimensions: SimilarityDimension[] = [
    buildDimension(
      "strategy_chain",
      strategy.matched,
      SIMILARITY_DIMENSION_WEIGHTS.strategy_chain,
      strategy.contributionRatio,
      strategy.queryValue,
      strategy.matchedValue
    ),
    buildDimension(
      "kpi_direction",
      compareExact(query.kpiDirection, candidate.kpiDirection),
      SIMILARITY_DIMENSION_WEIGHTS.kpi_direction,
      1,
      query.kpiDirection,
      candidate.kpiDirection
    ),
    buildDimension(
      "risk_profile",
      compareExact(query.riskProfile, candidate.riskProfile),
      SIMILARITY_DIMENSION_WEIGHTS.risk_profile,
      1,
      query.riskProfile,
      candidate.riskProfile
    ),
    buildDimension(
      "business_goal",
      compareExact(query.businessGoal, candidate.businessGoal),
      SIMILARITY_DIMENSION_WEIGHTS.business_goal,
      1,
      query.businessGoal,
      candidate.businessGoal
    ),
    buildDimension(
      "timeline_phase",
      compareExact(query.timelinePhase, candidate.timelinePhase),
      SIMILARITY_DIMENSION_WEIGHTS.timeline_phase,
      1,
      query.timelinePhase,
      candidate.timelinePhase
    ),
    buildDimension(
      "workspace_domain",
      compareExact(query.workspaceDomain, candidate.workspaceDomain),
      SIMILARITY_DIMENSION_WEIGHTS.workspace_domain,
      1,
      query.workspaceDomain,
      candidate.workspaceDomain
    ),
    buildDimension(
      "object_types",
      compareObjectTypes(query.objectTypes, candidate.objectTypes),
      SIMILARITY_DIMENSION_WEIGHTS.object_types,
      1,
      normalizeList(query.objectTypes).join(","),
      normalizeList(candidate.objectTypes).join(",")
    ),
    buildDimension(
      "decision_type",
      compareExact(query.decisionType, candidate.decisionType),
      SIMILARITY_DIMENSION_WEIGHTS.decision_type,
      1,
      query.decisionType,
      candidate.decisionType
    ),
    buildDimension(
      "outcome_type",
      compareExact(query.outcomeType, candidate.outcomeType),
      SIMILARITY_DIMENSION_WEIGHTS.outcome_type,
      1,
      query.outcomeType,
      candidate.outcomeType
    ),
    buildDimension(
      "pattern_category",
      compareExact(query.patternCategory, candidate.patternCategory),
      SIMILARITY_DIMENSION_WEIGHTS.pattern_category,
      1,
      query.patternCategory,
      candidate.patternCategory
    ),
  ];

  const totalScore = Math.min(
    SIMILARITY_ENGINE_LIMITS.maxScore,
    dimensions.reduce((sum, dimension) => sum + dimension.weightedContribution, 0)
  );

  return Object.freeze({
    dimensions: Object.freeze(dimensions),
    totalScore,
    readOnly: true as const,
  });
}

export function extractStrategyChainFromPattern(pattern: ExecutivePattern): readonly string[] {
  const segments = pattern.executiveSummary.split(": ");
  const chainPart = segments[segments.length - 1] ?? "";
  return Object.freeze(
    chainPart
      .split(/\s→\s/)
      .map((step) => step.trim())
      .filter(Boolean)
  );
}

export function buildPatternSimilarityProfile(pattern: ExecutivePattern): ScenarioSimilarityProfile {
  const strategyChain = extractStrategyChainFromPattern(pattern);
  return Object.freeze({
    scenarioId: pattern.sourceScenarioIds[0] ?? pattern.patternId,
    workspaceId: pattern.workspaceId,
    businessGoal: pattern.patternName,
    strategyChain,
    objectTypes: Object.freeze([]),
    kpiDirection: "increase",
    riskProfile: pattern.outcomeSummary.toLowerCase().includes("stable") ? "stable" : "medium",
    decisionType: "executive",
    timelinePhase: "completed",
    outcomeType: pattern.outcomeSummary.split(";")[0]?.trim() ?? pattern.outcomeSummary,
    patternCategory: pattern.patternCategory,
    workspaceDomain: pattern.workspaceId,
    readOnly: true as const,
  });
}

export function scoreScenarioAgainstPattern(
  query: ScenarioSimilarityProfile,
  pattern: ExecutivePattern
): SimilarityScoreBreakdown {
  return scoreScenarioProfiles(query, buildPatternSimilarityProfile(pattern));
}

export const SimilarityEngineScoring = Object.freeze({
  scoreScenarioProfiles,
  scoreScenarioAgainstPattern,
  buildPatternSimilarityProfile,
  extractStrategyChainFromPattern,
  scoringMethod: SIMILARITY_SCORING_METHOD,
});
