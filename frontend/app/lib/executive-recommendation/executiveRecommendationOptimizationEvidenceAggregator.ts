/**
 * APP-12:6 — Executive Recommendation Optimization evidence aggregator.
 */

import type {
  OptimizationDimension,
  OptimizationEvidence,
} from "./executiveRecommendationOptimizationEngineTypes.ts";
import type { RecommendationGovernance } from "./executiveRecommendationGovernanceEngineTypes.ts";

export function aggregateOptimizationEvidence(
  governance: RecommendationGovernance,
  dimensions: readonly OptimizationDimension[]
): readonly OptimizationEvidence[] {
  const evidence: OptimizationEvidence[] = dimensions.map((dimension) =>
    Object.freeze({
      evidenceId: `optimization-evidence-${dimension.dimensionKey}-${governance.recommendationId}`,
      dimensionKey: dimension.dimensionKey,
      signal: `optimization_${dimension.improvementLevel}`,
      rationale: dimension.rationale,
      readOnly: true as const,
    })
  );

  evidence.push(
    Object.freeze({
      evidenceId: `optimization-evidence-governance-${governance.recommendationId}`,
      dimensionKey: "governance_preservation" as const,
      signal: "governance_reference",
      rationale: `Optimization derived from governance record ${governance.governanceId} without modifying original.`,
      readOnly: true as const,
    })
  );

  return Object.freeze(evidence);
}

export const ExecutiveRecommendationOptimizationEvidenceAggregator = Object.freeze({
  aggregateOptimizationEvidence,
});
