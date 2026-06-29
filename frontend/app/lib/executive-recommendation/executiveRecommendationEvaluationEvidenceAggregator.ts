/**
 * APP-12:3 — Executive Recommendation Evaluation evidence aggregator.
 */

import type {
  EvaluationDimension,
  EvaluationEvidence,
} from "./executiveRecommendationEvaluationEngineTypes.ts";
import type { RecommendationCandidate } from "./executiveRecommendationGenerationEngineTypes.ts";

export function aggregateEvaluationEvidence(
  candidate: RecommendationCandidate,
  dimensions: readonly EvaluationDimension[]
): readonly EvaluationEvidence[] {
  const evidence: EvaluationEvidence[] = dimensions.map((dimension) =>
    Object.freeze({
      evidenceId: `evaluation-evidence-${dimension.dimensionKey}-${candidate.recommendationId}`,
      dimensionKey: dimension.dimensionKey,
      signal: `dimension_${dimension.readiness}`,
      rationale: dimension.rationale,
      readOnly: true as const,
    })
  );

  evidence.push(
    Object.freeze({
      evidenceId: `evaluation-evidence-candidate-${candidate.recommendationId}`,
      dimensionKey: "governance_readiness" as const,
      signal: "candidate_reference",
      rationale: `Evaluation derived from recommendation candidate ${candidate.recommendationId}.`,
      readOnly: true as const,
    })
  );

  return Object.freeze(evidence);
}

export const ExecutiveRecommendationEvaluationEvidenceAggregator = Object.freeze({
  aggregateEvaluationEvidence,
});
