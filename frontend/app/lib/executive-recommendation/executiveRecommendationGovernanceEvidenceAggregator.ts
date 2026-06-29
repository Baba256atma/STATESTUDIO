/**
 * APP-12:5 — Executive Recommendation Governance evidence aggregator.
 */

import type {
  GovernanceDimension,
  GovernanceEvidence,
} from "./executiveRecommendationGovernanceEngineTypes.ts";
import type { RecommendationExplanation } from "./executiveRecommendationExplainabilityEngineTypes.ts";

export function aggregateGovernanceEvidence(
  explanation: RecommendationExplanation,
  dimensions: readonly GovernanceDimension[]
): readonly GovernanceEvidence[] {
  const evidence: GovernanceEvidence[] = dimensions.map((dimension) =>
    Object.freeze({
      evidenceId: `governance-evidence-${dimension.dimensionKey}-${explanation.recommendationId}`,
      dimensionKey: dimension.dimensionKey,
      signal: `governance_${dimension.compliance}`,
      rationale: dimension.rationale,
      readOnly: true as const,
    })
  );

  evidence.push(
    Object.freeze({
      evidenceId: `governance-evidence-explanation-${explanation.recommendationId}`,
      dimensionKey: "governance_completeness" as const,
      signal: "explanation_reference",
      rationale: `Governance validation derived from explanation ${explanation.explanationId} without modification.`,
      readOnly: true as const,
    })
  );

  return Object.freeze(evidence);
}

export const ExecutiveRecommendationGovernanceEvidenceAggregator = Object.freeze({
  aggregateGovernanceEvidence,
});
