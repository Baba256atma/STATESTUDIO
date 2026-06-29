/**
 * APP-12:7 — Executive Recommendation Delivery Engine immutable registry.
 */

import {
  EXECUTIVE_RECOMMENDATION_DELIVERY_ENGINE_CONTRACT_VERSION,
  EXECUTIVE_RECOMMENDATION_DELIVERY_ENGINE_LIMITS,
} from "./executiveRecommendationDeliveryEngineConstants.ts";
import type {
  DeliveryId,
  ExecutiveRecommendationDelivery,
  RecommendationDeliveryEngineResult,
  RecommendationDeliveryRegistrySnapshot,
  RecommendationWorkspaceId,
} from "./executiveRecommendationDeliveryEngineTypes.ts";
import { validateExecutiveRecommendationDeliveryRecord } from "./executiveRecommendationDeliveryEngineValidation.ts";

const deliveryRegistry = new Map<DeliveryId, ExecutiveRecommendationDelivery>();
const workspaceIndex = new Map<RecommendationWorkspaceId, Set<DeliveryId>>();

function indexDelivery(delivery: ExecutiveRecommendationDelivery): void {
  const ids = workspaceIndex.get(delivery.provenance.workspaceId) ?? new Set<DeliveryId>();
  ids.add(delivery.deliveryId);
  workspaceIndex.set(delivery.provenance.workspaceId, ids);
}

function unindexDelivery(delivery: ExecutiveRecommendationDelivery): void {
  const ids = workspaceIndex.get(delivery.provenance.workspaceId);
  if (!ids) {
    return;
  }
  ids.delete(delivery.deliveryId);
  if (ids.size === 0) {
    workspaceIndex.delete(delivery.provenance.workspaceId);
  }
}

export function resetExecutiveRecommendationDeliveryEngineRegistryForTests(): void {
  deliveryRegistry.clear();
  workspaceIndex.clear();
}

export function recommendationDeliveryExists(deliveryId: DeliveryId): boolean {
  return deliveryRegistry.has(deliveryId);
}

export function registerRecommendationDelivery(
  delivery: ExecutiveRecommendationDelivery
): RecommendationDeliveryEngineResult<ExecutiveRecommendationDelivery> {
  const validation = validateExecutiveRecommendationDeliveryRecord(delivery);
  if (!validation.valid) {
    return Object.freeze({
      success: false,
      reason: validation.issues.map((entry) => entry.message).join("; "),
      data: null,
      error: Object.freeze({
        code: "validation_failure",
        message: validation.issues.map((entry) => entry.message).join("; "),
        readOnly: true as const,
      }),
      readOnly: true as const,
    });
  }
  if (deliveryRegistry.has(delivery.deliveryId)) {
    return Object.freeze({
      success: false,
      reason: `Duplicate delivery id: ${delivery.deliveryId}.`,
      data: null,
      error: Object.freeze({
        code: "duplicate_delivery",
        message: "Duplicate delivery id.",
        field: "deliveryId",
        readOnly: true as const,
      }),
      readOnly: true as const,
    });
  }
  if (deliveryRegistry.size >= EXECUTIVE_RECOMMENDATION_DELIVERY_ENGINE_LIMITS.maxRegisteredDeliveries) {
    return Object.freeze({
      success: false,
      reason: "Recommendation delivery registry is full.",
      data: null,
      error: Object.freeze({
        code: "registry_full",
        message: "Recommendation delivery registry is full.",
        readOnly: true as const,
      }),
      readOnly: true as const,
    });
  }
  deliveryRegistry.set(delivery.deliveryId, delivery);
  indexDelivery(delivery);
  return Object.freeze({
    success: true,
    reason: "Recommendation delivery registered.",
    data: delivery,
    error: null,
    readOnly: true as const,
  });
}

export function unregisterRecommendationDelivery(
  deliveryId: DeliveryId
): RecommendationDeliveryEngineResult<DeliveryId> {
  const existing = deliveryRegistry.get(deliveryId);
  if (!existing) {
    return Object.freeze({
      success: false,
      reason: `Recommendation delivery not found: ${deliveryId}.`,
      data: null,
      error: Object.freeze({
        code: "not_found",
        message: "Recommendation delivery not found.",
        field: "deliveryId",
        readOnly: true as const,
      }),
      readOnly: true as const,
    });
  }
  deliveryRegistry.delete(deliveryId);
  unindexDelivery(existing);
  return Object.freeze({
    success: true,
    reason: "Recommendation delivery unregistered.",
    data: deliveryId,
    error: null,
    readOnly: true as const,
  });
}

export function getRecommendationDelivery(deliveryId: DeliveryId): ExecutiveRecommendationDelivery | null {
  return deliveryRegistry.get(deliveryId) ?? null;
}

export function getRecommendationDeliveries(
  workspaceId?: RecommendationWorkspaceId
): readonly ExecutiveRecommendationDelivery[] {
  if (!workspaceId) {
    return Object.freeze(
      [...deliveryRegistry.values()].sort((left, right) => left.deliveryId.localeCompare(right.deliveryId))
    );
  }
  const ids = workspaceIndex.get(workspaceId);
  if (!ids) {
    return Object.freeze([]);
  }
  return Object.freeze(
    [...ids]
      .map((deliveryId) => deliveryRegistry.get(deliveryId))
      .filter((entry): entry is ExecutiveRecommendationDelivery => entry !== undefined)
      .sort((left, right) => left.deliveryId.localeCompare(right.deliveryId))
  );
}

export function getRecommendationDeliveryRegistrySnapshot(): RecommendationDeliveryRegistrySnapshot {
  const deliveryIds = Object.freeze([...deliveryRegistry.keys()].sort());
  return Object.freeze({
    registryVersion: EXECUTIVE_RECOMMENDATION_DELIVERY_ENGINE_CONTRACT_VERSION,
    deliveryCount: deliveryRegistry.size,
    deliveryIds,
    readOnly: true as const,
  });
}

export const ExecutiveRecommendationDeliveryEngineRegistry = Object.freeze({
  resetExecutiveRecommendationDeliveryEngineRegistryForTests,
  recommendationDeliveryExists,
  registerRecommendationDelivery,
  unregisterRecommendationDelivery,
  getRecommendationDelivery,
  getRecommendationDeliveries,
  getRecommendationDeliveryRegistrySnapshot,
});
