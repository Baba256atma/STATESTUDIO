/**
 * APP-12:6 — Executive Recommendation Optimization variant builder.
 */

import type {
  RecommendationOptimizationVariant,
  VariantId,
} from "./executiveRecommendationOptimizationEngineTypes.ts";
import type { RecommendationGovernance } from "./executiveRecommendationGovernanceEngineTypes.ts";

export function buildVariantId(recommendationId: string): VariantId {
  return `recommendation-variant-${recommendationId}-001`;
}

export function buildOptimizationVariant(
  governance: RecommendationGovernance
): RecommendationOptimizationVariant {
  const adjustments: string[] = [
    "Preserve original recommendation intent without mutation.",
    "Refine risk posture within governance-compliant bounds.",
    "Align timeline dependencies for improved consistency.",
    "Optimize resource references while maintaining compliance.",
  ];
  if (governance.summary.overallCompliance === "partial") {
    adjustments.push("Address partial governance dimensions in variant proposal.");
  }
  return Object.freeze({
    variantId: buildVariantId(governance.recommendationId),
    recommendationId: governance.recommendationId,
    governanceId: governance.governanceId,
    intentPreserved: true as const,
    proposedAdjustments: Object.freeze(adjustments),
    governancePreserved: true as const,
    readOnly: true as const,
  });
}

export const ExecutiveRecommendationOptimizationVariantBuilder = Object.freeze({
  buildOptimizationVariant,
  buildVariantId,
});
