/**
 * APP-12:6 — Executive Recommendation Optimization Engine immutable registry.
 */

import {
  EXECUTIVE_RECOMMENDATION_OPTIMIZATION_ENGINE_CONTRACT_VERSION,
  EXECUTIVE_RECOMMENDATION_OPTIMIZATION_ENGINE_LIMITS,
} from "./executiveRecommendationOptimizationEngineConstants.ts";
import type {
  OptimizationId,
  RecommendationOptimization,
  RecommendationOptimizationEngineResult,
  RecommendationOptimizationRegistrySnapshot,
  RecommendationWorkspaceId,
} from "./executiveRecommendationOptimizationEngineTypes.ts";
import { validateRecommendationOptimizationRecord } from "./executiveRecommendationOptimizationEngineValidation.ts";

const optimizationRegistry = new Map<OptimizationId, RecommendationOptimization>();
const workspaceIndex = new Map<RecommendationWorkspaceId, Set<OptimizationId>>();

function indexOptimization(optimization: RecommendationOptimization): void {
  const ids = workspaceIndex.get(optimization.provenance.workspaceId) ?? new Set<OptimizationId>();
  ids.add(optimization.optimizationId);
  workspaceIndex.set(optimization.provenance.workspaceId, ids);
}

function unindexOptimization(optimization: RecommendationOptimization): void {
  const ids = workspaceIndex.get(optimization.provenance.workspaceId);
  if (!ids) {
    return;
  }
  ids.delete(optimization.optimizationId);
  if (ids.size === 0) {
    workspaceIndex.delete(optimization.provenance.workspaceId);
  }
}

export function resetExecutiveRecommendationOptimizationEngineRegistryForTests(): void {
  optimizationRegistry.clear();
  workspaceIndex.clear();
}

export function recommendationOptimizationExists(optimizationId: OptimizationId): boolean {
  return optimizationRegistry.has(optimizationId);
}

export function registerRecommendationOptimization(
  optimization: RecommendationOptimization
): RecommendationOptimizationEngineResult<RecommendationOptimization> {
  const validation = validateRecommendationOptimizationRecord(optimization);
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
  if (optimizationRegistry.has(optimization.optimizationId)) {
    return Object.freeze({
      success: false,
      reason: `Duplicate optimization id: ${optimization.optimizationId}.`,
      data: null,
      error: Object.freeze({
        code: "duplicate_optimization",
        message: "Duplicate optimization id.",
        field: "optimizationId",
        readOnly: true as const,
      }),
      readOnly: true as const,
    });
  }
  if (optimizationRegistry.size >= EXECUTIVE_RECOMMENDATION_OPTIMIZATION_ENGINE_LIMITS.maxRegisteredOptimizations) {
    return Object.freeze({
      success: false,
      reason: "Recommendation optimization registry is full.",
      data: null,
      error: Object.freeze({
        code: "registry_full",
        message: "Recommendation optimization registry is full.",
        readOnly: true as const,
      }),
      readOnly: true as const,
    });
  }
  optimizationRegistry.set(optimization.optimizationId, optimization);
  indexOptimization(optimization);
  return Object.freeze({
    success: true,
    reason: "Recommendation optimization registered.",
    data: optimization,
    error: null,
    readOnly: true as const,
  });
}

export function unregisterRecommendationOptimization(
  optimizationId: OptimizationId
): RecommendationOptimizationEngineResult<OptimizationId> {
  const existing = optimizationRegistry.get(optimizationId);
  if (!existing) {
    return Object.freeze({
      success: false,
      reason: `Recommendation optimization not found: ${optimizationId}.`,
      data: null,
      error: Object.freeze({
        code: "not_found",
        message: "Recommendation optimization not found.",
        field: "optimizationId",
        readOnly: true as const,
      }),
      readOnly: true as const,
    });
  }
  optimizationRegistry.delete(optimizationId);
  unindexOptimization(existing);
  return Object.freeze({
    success: true,
    reason: "Recommendation optimization unregistered.",
    data: optimizationId,
    error: null,
    readOnly: true as const,
  });
}

export function getRecommendationOptimization(optimizationId: OptimizationId): RecommendationOptimization | null {
  return optimizationRegistry.get(optimizationId) ?? null;
}

export function getRecommendationOptimizations(
  workspaceId?: RecommendationWorkspaceId
): readonly RecommendationOptimization[] {
  if (!workspaceId) {
    return Object.freeze(
      [...optimizationRegistry.values()].sort((left, right) =>
        left.optimizationId.localeCompare(right.optimizationId)
      )
    );
  }
  const ids = workspaceIndex.get(workspaceId);
  if (!ids) {
    return Object.freeze([]);
  }
  return Object.freeze(
    [...ids]
      .map((optimizationId) => optimizationRegistry.get(optimizationId))
      .filter((entry): entry is RecommendationOptimization => entry !== undefined)
      .sort((left, right) => left.optimizationId.localeCompare(right.optimizationId))
  );
}

export function getRecommendationOptimizationRegistrySnapshot(): RecommendationOptimizationRegistrySnapshot {
  const optimizationIds = Object.freeze([...optimizationRegistry.keys()].sort());
  return Object.freeze({
    registryVersion: EXECUTIVE_RECOMMENDATION_OPTIMIZATION_ENGINE_CONTRACT_VERSION,
    optimizationCount: optimizationRegistry.size,
    optimizationIds,
    readOnly: true as const,
  });
}

export const ExecutiveRecommendationOptimizationEngineRegistry = Object.freeze({
  resetExecutiveRecommendationOptimizationEngineRegistryForTests,
  recommendationOptimizationExists,
  registerRecommendationOptimization,
  unregisterRecommendationOptimization,
  getRecommendationOptimization,
  getRecommendationOptimizations,
  getRecommendationOptimizationRegistrySnapshot,
});
