/**
 * APP-12:7 — Executive Recommendation Delivery package builder.
 */

import { EXECUTIVE_RECOMMENDATION_DELIVERY_CONSUMER_TARGETS } from "./executiveRecommendationDeliveryEngineConstants.ts";
import { EXECUTIVE_RECOMMENDATION_DELIVERY_ENGINE_CONTRACT_VERSION } from "./executiveRecommendationDeliveryEngineConstants.ts";
import {
  aggregateDeliveryEvidence,
  buildEvidenceReferences,
} from "./executiveRecommendationDeliveryEvidenceAggregator.ts";
import {
  buildDeliveryId,
  buildRecommendationPresentationProfile,
} from "./executiveRecommendationDeliveryPresentationBuilder.ts";
import { buildRecommendationInteractionProfile } from "./executiveRecommendationDeliveryInteractionBuilder.ts";
import type {
  DeliverySummary,
  ExecutiveRecommendationDelivery,
  RecommendationDeliveryPackage,
  RecommendationDeliveryProvenance,
} from "./executiveRecommendationDeliveryEngineTypes.ts";
import type { RecommendationOptimization } from "./executiveRecommendationOptimizationEngineTypes.ts";

export function buildRecommendationDeliveryProvenance(
  optimization: RecommendationOptimization
): RecommendationDeliveryProvenance {
  return Object.freeze({
    recommendationId: optimization.recommendationId,
    optimizationId: optimization.optimizationId,
    governanceId: optimization.provenance.governanceId,
    evaluationId: optimization.provenance.evaluationId,
    explanationId: optimization.provenance.explanationId,
    workspaceId: optimization.provenance.workspaceId,
    sourcePlatforms: optimization.provenance.sourcePlatforms,
    dependencyVersions: Object.freeze({
      ...optimization.provenance.dependencyVersions,
      "APP-12/7": "APP-12/7/certified",
    }),
    generationVersion: "APP-12/2" as const,
    evaluationVersion: "APP-12/3" as const,
    explanationVersion: "APP-12/4" as const,
    governanceVersion: "APP-12/5" as const,
    optimizationVersion: "APP-12/6" as const,
    deliveryVersion: EXECUTIVE_RECOMMENDATION_DELIVERY_ENGINE_CONTRACT_VERSION,
    engineVersion: EXECUTIVE_RECOMMENDATION_DELIVERY_ENGINE_CONTRACT_VERSION,
    foundationVersion: "APP-12/1" as const,
    readOnly: true as const,
  });
}

export function buildExecutiveSummary(optimization: RecommendationOptimization): string {
  return `Executive delivery package for ${optimization.recommendationId}. Presents optimization variant ${optimization.variant.variantId} with ${optimization.improvements.length} improvement(s). Original recommendation not modified. Consumer metadata only.`;
}

export function buildDeliverySummary(
  optimization: RecommendationOptimization,
  evidenceReferences: readonly string[],
  interactionProfile: ReturnType<typeof buildRecommendationInteractionProfile>
): DeliverySummary {
  return Object.freeze({
    summaryId: `delivery-summary-${optimization.recommendationId}`,
    consumerTargetCount: EXECUTIVE_RECOMMENDATION_DELIVERY_CONSUMER_TARGETS.length,
    capabilityCount: interactionProfile.capabilities.length,
    evidenceReferenceCount: evidenceReferences.length,
    narrative: `Deterministic delivery package for ${optimization.recommendationId}. Prepared for ${EXECUTIVE_RECOMMENDATION_DELIVERY_CONSUMER_TARGETS.length} consumer targets. No execution performed.`,
    readOnly: true as const,
  });
}

export function buildRecommendationDeliveryPackage(
  optimization: RecommendationOptimization,
  deliveryTimestamp: string
): RecommendationDeliveryPackage {
  const deliveryId = buildDeliveryId(optimization.recommendationId);
  const presentationProfile = buildRecommendationPresentationProfile(optimization);
  const interactionProfile = buildRecommendationInteractionProfile(optimization);
  const evidenceReferences = buildEvidenceReferences(optimization);
  const provenance = buildRecommendationDeliveryProvenance(optimization);

  return Object.freeze({
    packageId: `delivery-package-${optimization.recommendationId}`,
    deliveryId,
    recommendationId: optimization.recommendationId,
    optimizationId: optimization.optimizationId,
    presentationProfile,
    interactionProfile,
    consumerTargets: EXECUTIVE_RECOMMENDATION_DELIVERY_CONSUMER_TARGETS,
    executiveSummary: buildExecutiveSummary(optimization),
    evidenceReferences,
    provenance,
    deliveryTimestamp,
    engineVersion: EXECUTIVE_RECOMMENDATION_DELIVERY_ENGINE_CONTRACT_VERSION,
    readOnly: true as const,
  });
}

export function buildExecutiveRecommendationDeliveryFromOptimization(
  optimization: RecommendationOptimization,
  deliveryTimestamp: string
): ExecutiveRecommendationDelivery {
  const deliveryPackage = buildRecommendationDeliveryPackage(optimization, deliveryTimestamp);
  const deliveryEvidence = aggregateDeliveryEvidence(optimization);
  const summary = buildDeliverySummary(
    optimization,
    deliveryPackage.evidenceReferences,
    deliveryPackage.interactionProfile
  );

  return Object.freeze({
    deliveryId: deliveryPackage.deliveryId,
    recommendationId: optimization.recommendationId,
    optimizationId: optimization.optimizationId,
    package: deliveryPackage,
    summary,
    deliveryEvidence,
    provenance: deliveryPackage.provenance,
    deliveryTimestamp,
    engineVersion: EXECUTIVE_RECOMMENDATION_DELIVERY_ENGINE_CONTRACT_VERSION,
    version: EXECUTIVE_RECOMMENDATION_DELIVERY_ENGINE_CONTRACT_VERSION,
    readOnly: true as const,
  });
}

export function buildExecutiveRecommendationDeliveriesFromOptimizations(
  optimizations: readonly RecommendationOptimization[],
  deliveryTimestamp: string
): readonly ExecutiveRecommendationDelivery[] {
  return Object.freeze(
    optimizations.map((entry) => buildExecutiveRecommendationDeliveryFromOptimization(entry, deliveryTimestamp))
  );
}

export const ExecutiveRecommendationDeliveryPackageBuilder = Object.freeze({
  buildExecutiveRecommendationDeliveryFromOptimization,
  buildExecutiveRecommendationDeliveriesFromOptimizations,
  buildRecommendationDeliveryPackage,
});
