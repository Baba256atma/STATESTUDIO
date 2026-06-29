/**
 * APP-12:7 — Executive Recommendation Delivery Engine deterministic pipeline.
 */

import { EXECUTIVE_RECOMMENDATION_DELIVERY_PIPELINE_STAGES } from "./executiveRecommendationDeliveryEngineConstants.ts";
import { buildExecutiveRecommendationDeliveriesFromOptimizations } from "./executiveRecommendationDeliveryPackageBuilder.ts";
import { registerRecommendationDelivery } from "./executiveRecommendationDeliveryEngineRegistry.ts";
import type {
  ExecutiveRecommendationDelivery,
  ExecutiveRecommendationDeliveryRequest,
  RecommendationDeliveryPackage,
  RecommendationDeliveryResult,
} from "./executiveRecommendationDeliveryEngineTypes.ts";
import type { RecommendationOptimization } from "./executiveRecommendationOptimizationEngineTypes.ts";
import {
  isOptimizationEligibleForDelivery,
  validateDeliveryDependencies,
  validateExecutiveRecommendationDeliveryRecord,
  validateExecutiveRecommendationDeliveryRequest,
} from "./executiveRecommendationDeliveryEngineValidation.ts";

function emptyResult(
  request: ExecutiveRecommendationDeliveryRequest,
  reason: string,
  deliveryTimestamp: string
): RecommendationDeliveryResult {
  return Object.freeze({
    success: false,
    reason,
    workspaceId: request.workspaceId,
    sessionId: request.sessionId,
    deliveries: Object.freeze([]),
    packages: Object.freeze([]),
    registeredDeliveryIds: Object.freeze([]),
    skippedOptimizations: 0,
    pipelineStages: EXECUTIVE_RECOMMENDATION_DELIVERY_PIPELINE_STAGES,
    deliveryTimestamp,
    readOnly: true as const,
  });
}

function sortOptimizationsDeterministically(
  request: ExecutiveRecommendationDeliveryRequest
): readonly RecommendationOptimization[] {
  return Object.freeze(
    [...request.optimizations].sort((left, right) => left.recommendationId.localeCompare(right.recommendationId))
  );
}

export function buildRecommendationDeliveryPackages(
  request: ExecutiveRecommendationDeliveryRequest
): readonly RecommendationDeliveryPackage[] {
  const deliveryTimestamp = request.deliveryTimestamp ?? new Date(0).toISOString();
  const sorted = sortOptimizationsDeterministically(request);
  const deliveries = buildExecutiveRecommendationDeliveriesFromOptimizations(sorted, deliveryTimestamp);
  return Object.freeze(deliveries.map((entry) => entry.package));
}

export function prepareExecutiveRecommendationDelivery(
  request: ExecutiveRecommendationDeliveryRequest
): RecommendationDeliveryResult {
  const deliveryTimestamp = request.deliveryTimestamp ?? new Date(0).toISOString();

  const requestValidation = validateExecutiveRecommendationDeliveryRequest(request);
  if (!requestValidation.valid) {
    return emptyResult(
      request,
      requestValidation.issues.map((issue) => issue.message).join("; "),
      deliveryTimestamp
    );
  }

  const dependencyValidation = validateDeliveryDependencies();
  if (!dependencyValidation.valid) {
    return emptyResult(
      request,
      dependencyValidation.issues.map((issue) => issue.message).join("; "),
      deliveryTimestamp
    );
  }

  const sorted = sortOptimizationsDeterministically(request);
  const eligible = sorted.filter((entry) => isOptimizationEligibleForDelivery(entry));
  let skippedOptimizations = sorted.length - eligible.length;
  const deliveries = buildExecutiveRecommendationDeliveriesFromOptimizations(eligible, deliveryTimestamp);
  const registeredDeliveryIds: string[] = [];

  for (const delivery of deliveries) {
    const deliveryValidation = validateExecutiveRecommendationDeliveryRecord(delivery);
    if (!deliveryValidation.valid) {
      return emptyResult(
        request,
        `Delivery validation failed: ${deliveryValidation.issues.map((issue) => issue.message).join("; ")}`,
        deliveryTimestamp
      );
    }
    const registration = registerRecommendationDelivery(delivery);
    if (!registration.success) {
      if (registration.error?.code === "duplicate_delivery") {
        skippedOptimizations += 1;
        continue;
      }
      return emptyResult(request, registration.reason, deliveryTimestamp);
    }
    registeredDeliveryIds.push(delivery.deliveryId);
  }

  const registeredDeliveries = Object.freeze(
    registeredDeliveryIds
      .map((deliveryId) => deliveries.find((entry) => entry.deliveryId === deliveryId))
      .filter((entry): entry is ExecutiveRecommendationDelivery => entry !== undefined)
      .sort((left, right) => left.deliveryId.localeCompare(right.deliveryId))
  );

  const packages = Object.freeze(registeredDeliveries.map((entry) => entry.package));

  return Object.freeze({
    success: registeredDeliveries.length > 0,
    reason:
      registeredDeliveries.length > 0
        ? `Prepared ${registeredDeliveries.length} executive recommendation delivery package(s) for consumer modules.`
        : "No recommendation deliveries were registered.",
    workspaceId: request.workspaceId,
    sessionId: request.sessionId,
    deliveries: registeredDeliveries,
    packages,
    registeredDeliveryIds: Object.freeze(registeredDeliveryIds),
    skippedOptimizations,
    pipelineStages: EXECUTIVE_RECOMMENDATION_DELIVERY_PIPELINE_STAGES,
    deliveryTimestamp,
    readOnly: true as const,
  });
}

export const ExecutiveRecommendationDeliveryPipeline = Object.freeze({
  prepareExecutiveRecommendationDelivery,
  buildRecommendationDeliveryPackages,
  stages: EXECUTIVE_RECOMMENDATION_DELIVERY_PIPELINE_STAGES,
});
