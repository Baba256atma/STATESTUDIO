/**
 * APP-12:7 — Executive Recommendation Delivery presentation profile builder.
 */

import {
  EXECUTIVE_RECOMMENDATION_DELIVERY_CONSUMER_LABELS,
  EXECUTIVE_RECOMMENDATION_DELIVERY_CONSUMER_TARGETS,
} from "./executiveRecommendationDeliveryEngineConstants.ts";
import type {
  DeliveryConsumerTarget,
  DeliveryPriorityLevel,
  DeliveryVisibilityScope,
  RecommendationPresentationProfile,
} from "./executiveRecommendationDeliveryEngineTypes.ts";
import type { RecommendationOptimization } from "./executiveRecommendationOptimizationEngineTypes.ts";

function derivePriorityLevel(optimization: RecommendationOptimization): DeliveryPriorityLevel {
  if (optimization.summary.overallImprovementLevel === "improved") {
    return "high";
  }
  if (optimization.summary.overallImprovementLevel === "maintained") {
    return "medium";
  }
  return "standard";
}

function deriveVisibilityScope(optimization: RecommendationOptimization): DeliveryVisibilityScope {
  const strategic = optimization.dimensions.find((entry) => entry.dimensionKey === "strategic_improvement");
  if (strategic?.improvementLevel === "improved") {
    return "executive";
  }
  return "leadership";
}

function buildConsumerPresentationHints(
  optimization: RecommendationOptimization
): Readonly<Record<DeliveryConsumerTarget, string>> {
  const hints: Record<DeliveryConsumerTarget, string> = {
    workspace: "",
    dashboard: "",
    assistant: "",
    report: "",
  };
  for (const consumer of EXECUTIVE_RECOMMENDATION_DELIVERY_CONSUMER_TARGETS) {
    hints[consumer] =
      `${EXECUTIVE_RECOMMENDATION_DELIVERY_CONSUMER_LABELS[consumer]} presentation for ${optimization.recommendationId}: ${optimization.summary.narrative}`;
  }
  return Object.freeze(hints);
}

export function buildDeliveryId(recommendationId: string): string {
  return `recommendation-delivery-${recommendationId}`;
}

export function buildRecommendationPresentationProfile(
  optimization: RecommendationOptimization
): RecommendationPresentationProfile {
  return Object.freeze({
    profileId: `presentation-profile-${optimization.recommendationId}`,
    recommendationId: optimization.recommendationId,
    optimizationId: optimization.optimizationId,
    displayTitle: `Executive Recommendation: ${optimization.recommendationId}`,
    displaySummary: optimization.summary.narrative,
    priorityLevel: derivePriorityLevel(optimization),
    visibilityScope: deriveVisibilityScope(optimization),
    consumerPresentationHints: buildConsumerPresentationHints(optimization),
    readOnly: true as const,
  });
}

export const ExecutiveRecommendationDeliveryPresentationBuilder = Object.freeze({
  buildRecommendationPresentationProfile,
  buildDeliveryId,
});
