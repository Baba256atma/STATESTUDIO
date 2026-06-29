/**
 * APP-12:3 — Executive Recommendation Evaluation profile builder.
 */

import { EXECUTIVE_RECOMMENDATION_EVALUATION_ENGINE_CONTRACT_VERSION } from "./executiveRecommendationEvaluationEngineConstants.ts";
import { aggregateEvaluationEvidence } from "./executiveRecommendationEvaluationEvidenceAggregator.ts";
import { evaluateAllRecommendationDimensions } from "./executiveRecommendationEvaluationDimensionEvaluator.ts";
import type {
  EvaluationDimension,
  EvaluationReadiness,
  EvaluationSummary,
  RecommendationEvaluation,
  RecommendationEvaluationProfile,
  RecommendationEvaluationProvenance,
} from "./executiveRecommendationEvaluationEngineTypes.ts";
import type { RecommendationCandidate } from "./executiveRecommendationGenerationEngineTypes.ts";

export function buildEvaluationId(recommendationId: string): string {
  return `recommendation-evaluation-${recommendationId}`;
}

function countByReadiness(
  dimensions: readonly EvaluationDimension[],
  readiness: EvaluationReadiness
): number {
  return dimensions.filter((entry) => entry.readiness === readiness).length;
}

function deriveOverallReadiness(dimensions: readonly EvaluationDimension[]): EvaluationReadiness {
  const insufficient = countByReadiness(dimensions, "insufficient");
  const partial = countByReadiness(dimensions, "partial");
  if (insufficient > 0) {
    return "insufficient";
  }
  if (partial > 0) {
    return "partial";
  }
  return "complete";
}

export function buildEvaluationSummary(
  candidate: RecommendationCandidate,
  dimensions: readonly EvaluationDimension[]
): EvaluationSummary {
  const overallReadiness = deriveOverallReadiness(dimensions);
  const completeCount = countByReadiness(dimensions, "complete");
  const partialCount = countByReadiness(dimensions, "partial");
  const insufficientCount = countByReadiness(dimensions, "insufficient");

  return Object.freeze({
    summaryId: `evaluation-summary-${candidate.recommendationId}`,
    overallReadiness,
    completeDimensionCount: completeCount,
    partialDimensionCount: partialCount,
    insufficientDimensionCount: insufficientCount,
    narrative: `Evaluated ${dimensions.length} dimensions: ${completeCount} complete, ${partialCount} partial, ${insufficientCount} insufficient. Overall readiness: ${overallReadiness}.`,
    readOnly: true as const,
  });
}

export function buildRecommendationEvaluationProvenance(
  candidate: RecommendationCandidate
): RecommendationEvaluationProvenance {
  return Object.freeze({
    recommendationId: candidate.recommendationId,
    originatingPlatforms: candidate.provenance.originatingPlatforms,
    workspaceId: candidate.provenance.workspaceId,
    dependencyVersions: Object.freeze({
      ...candidate.provenance.dependencyVersions,
      "APP-12/2": "APP-12/2/certified",
      "APP-12/3": "APP-12/3/certified",
    }),
    generationVersion: "APP-12/2" as const,
    evaluationVersion: EXECUTIVE_RECOMMENDATION_EVALUATION_ENGINE_CONTRACT_VERSION,
    engineVersion: EXECUTIVE_RECOMMENDATION_EVALUATION_ENGINE_CONTRACT_VERSION,
    foundationVersion: "APP-12/1" as const,
    readOnly: true as const,
  });
}

export function buildRecommendationEvaluationProfile(
  candidate: RecommendationCandidate,
  dimensions: readonly EvaluationDimension[]
): RecommendationEvaluationProfile {
  return Object.freeze({
    profileId: `evaluation-profile-${candidate.recommendationId}`,
    recommendationId: candidate.recommendationId,
    dimensions,
    summary: buildEvaluationSummary(candidate, dimensions),
    readOnly: true as const,
  });
}

export function buildEvaluationNotes(
  candidate: RecommendationCandidate,
  dimensions: readonly EvaluationDimension[]
): readonly string[] {
  const notes = [
    `Evaluated recommendation candidate ${candidate.recommendationId} without ranking or comparison.`,
    `Category: ${candidate.category}. Engine: ${EXECUTIVE_RECOMMENDATION_EVALUATION_ENGINE_CONTRACT_VERSION}.`,
  ];
  for (const dimension of dimensions.filter((entry) => entry.readiness !== "complete")) {
    notes.push(`${dimension.label}: ${dimension.readiness} — ${dimension.rationale}`);
  }
  return Object.freeze(notes);
}

export function buildRecommendationEvaluationFromCandidate(
  candidate: RecommendationCandidate,
  evaluationTimestamp: string
): RecommendationEvaluation {
  const dimensions = evaluateAllRecommendationDimensions(candidate);
  const supportingEvidence = aggregateEvaluationEvidence(candidate, dimensions);
  const profile = buildRecommendationEvaluationProfile(candidate, dimensions);
  const provenance = buildRecommendationEvaluationProvenance(candidate);
  const evaluationId = buildEvaluationId(candidate.recommendationId);

  return Object.freeze({
    evaluationId,
    recommendationId: candidate.recommendationId,
    summary: profile.summary,
    dimensions,
    supportingEvidence,
    evaluationNotes: buildEvaluationNotes(candidate, dimensions),
    profile,
    provenance,
    evaluationTimestamp,
    engineVersion: EXECUTIVE_RECOMMENDATION_EVALUATION_ENGINE_CONTRACT_VERSION,
    version: EXECUTIVE_RECOMMENDATION_EVALUATION_ENGINE_CONTRACT_VERSION,
    readOnly: true as const,
  });
}

export function buildRecommendationEvaluationsFromCandidates(
  candidates: readonly RecommendationCandidate[],
  evaluationTimestamp: string
): readonly RecommendationEvaluation[] {
  return Object.freeze(
    candidates.map((candidate) => buildRecommendationEvaluationFromCandidate(candidate, evaluationTimestamp))
  );
}

export const ExecutiveRecommendationEvaluationProfileBuilder = Object.freeze({
  buildRecommendationEvaluationFromCandidate,
  buildRecommendationEvaluationsFromCandidates,
  buildRecommendationEvaluationProfile,
});
