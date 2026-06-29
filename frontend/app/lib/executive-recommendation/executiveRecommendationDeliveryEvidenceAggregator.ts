/**
 * APP-12:7 — Executive Recommendation Delivery evidence aggregator.
 */

import type { DeliveryEvidence } from "./executiveRecommendationDeliveryEngineTypes.ts";
import type { RecommendationOptimization } from "./executiveRecommendationOptimizationEngineTypes.ts";

export function aggregateDeliveryEvidence(
  optimization: RecommendationOptimization
): readonly DeliveryEvidence[] {
  const evidence: DeliveryEvidence[] = [
    Object.freeze({
      evidenceId: `delivery-evidence-optimization-${optimization.recommendationId}`,
      referenceType: "optimization" as const,
      referenceId: optimization.optimizationId,
      signal: "optimization_ready",
      rationale: `Optimization ${optimization.optimizationId} is packaged for consumer delivery.`,
      readOnly: true as const,
    }),
    Object.freeze({
      evidenceId: `delivery-evidence-governance-${optimization.recommendationId}`,
      referenceType: "governance" as const,
      referenceId: optimization.provenance.governanceId,
      signal: "governance_preserved",
      rationale: `Governance ${optimization.provenance.governanceId} preserved in delivery package.`,
      readOnly: true as const,
    }),
    Object.freeze({
      evidenceId: `delivery-evidence-explanation-${optimization.recommendationId}`,
      referenceType: "explanation" as const,
      referenceId: optimization.provenance.explanationId,
      signal: "explanation_available",
      rationale: `Explanation ${optimization.provenance.explanationId} referenced for consumer display.`,
      readOnly: true as const,
    }),
    Object.freeze({
      evidenceId: `delivery-evidence-evaluation-${optimization.recommendationId}`,
      referenceType: "evaluation" as const,
      referenceId: optimization.provenance.evaluationId,
      signal: "evaluation_available",
      rationale: `Evaluation ${optimization.provenance.evaluationId} referenced for consumer display.`,
      readOnly: true as const,
    }),
    Object.freeze({
      evidenceId: `delivery-evidence-delivery-${optimization.recommendationId}`,
      referenceType: "delivery" as const,
      referenceId: `recommendation-delivery-${optimization.recommendationId}`,
      signal: "delivery_prepared",
      rationale: "Delivery package prepared for consumer modules. No execution performed.",
      readOnly: true as const,
    }),
  ];
  return Object.freeze(evidence);
}

export function buildEvidenceReferences(optimization: RecommendationOptimization): readonly string[] {
  const references = [
    optimization.optimizationId,
    optimization.provenance.governanceId,
    optimization.provenance.explanationId,
    optimization.provenance.evaluationId,
    ...optimization.optimizationEvidence.map((entry) => entry.evidenceId),
  ];
  return Object.freeze([...new Set(references)].sort());
}

export const ExecutiveRecommendationDeliveryEvidenceAggregator = Object.freeze({
  aggregateDeliveryEvidence,
  buildEvidenceReferences,
});
