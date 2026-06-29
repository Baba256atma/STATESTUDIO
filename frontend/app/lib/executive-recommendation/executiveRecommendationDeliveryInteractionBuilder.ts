/**
 * APP-12:7 — Executive Recommendation Delivery interaction profile builder.
 */

import {
  EXECUTIVE_RECOMMENDATION_DELIVERY_INTERACTION_CAPABILITY_KEYS,
  EXECUTIVE_RECOMMENDATION_DELIVERY_INTERACTION_CAPABILITY_LABELS,
} from "./executiveRecommendationDeliveryEngineConstants.ts";
import type {
  InteractionCapabilityKey,
  RecommendationInteractionCapability,
  RecommendationInteractionProfile,
} from "./executiveRecommendationDeliveryEngineTypes.ts";
import type { RecommendationOptimization } from "./executiveRecommendationOptimizationEngineTypes.ts";

function buildCapabilityRationale(
  capabilityKey: InteractionCapabilityKey,
  optimization: RecommendationOptimization
): string {
  switch (capabilityKey) {
    case "view_recommendation":
      return `Metadata capability to view recommendation ${optimization.recommendationId}. No runtime action performed.`;
    case "view_explanation":
      return `Metadata capability to view explanation ${optimization.provenance.explanationId}. Consumer-driven display only.`;
    case "view_evidence":
      return `Metadata capability to view ${optimization.optimizationEvidence.length} evidence item(s). Consumer-driven display only.`;
    case "view_governance":
      return `Metadata capability to view governance ${optimization.provenance.governanceId}. Consumer-driven display only.`;
    case "view_optimization_variant":
      return `Metadata capability to view variant ${optimization.variant.variantId}. Consumer-driven display only.`;
    case "compare_variant":
      return `Metadata capability to compare variant ${optimization.variant.variantId} against original. Consumer-driven display only.`;
    case "export":
      return `Metadata capability to export delivery package for ${optimization.recommendationId}. Consumer-driven action only.`;
    case "archive":
      return `Metadata capability to archive delivery record for ${optimization.recommendationId}. Consumer-driven action only.`;
  }
}

function buildInteractionCapability(
  capabilityKey: InteractionCapabilityKey,
  optimization: RecommendationOptimization
): RecommendationInteractionCapability {
  return Object.freeze({
    capabilityKey,
    label: EXECUTIVE_RECOMMENDATION_DELIVERY_INTERACTION_CAPABILITY_LABELS[capabilityKey],
    enabled: true as const,
    rationale: buildCapabilityRationale(capabilityKey, optimization),
    readOnly: true as const,
  });
}

export function buildRecommendationInteractionProfile(
  optimization: RecommendationOptimization
): RecommendationInteractionProfile {
  const capabilities = Object.freeze(
    EXECUTIVE_RECOMMENDATION_DELIVERY_INTERACTION_CAPABILITY_KEYS.map((capabilityKey) =>
      buildInteractionCapability(capabilityKey, optimization)
    )
  );
  return Object.freeze({
    profileId: `interaction-profile-${optimization.recommendationId}`,
    recommendationId: optimization.recommendationId,
    optimizationId: optimization.optimizationId,
    capabilities,
    readOnly: true as const,
  });
}

export const ExecutiveRecommendationDeliveryInteractionBuilder = Object.freeze({
  buildRecommendationInteractionProfile,
});
