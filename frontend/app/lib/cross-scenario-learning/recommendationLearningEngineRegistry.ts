/**
 * APP-10:7 — Recommendation Learning Engine immutable registry.
 */

import {
  RECOMMENDATION_LEARNING_ENGINE_CONTRACT_VERSION,
  RECOMMENDATION_LEARNING_ENGINE_LIMITS,
} from "./recommendationLearningEngineConstants.ts";
import type {
  ExecutiveRecommendationHistory,
  RecommendationEngineResult,
  RecommendationId,
  RecommendationRegistrySnapshot,
  RecommendationWorkspaceId,
} from "./recommendationLearningEngineTypes.ts";
import { validateExecutiveRecommendationHistory } from "./recommendationLearningEngineValidation.ts";

const recommendationRegistry = new Map<RecommendationId, ExecutiveRecommendationHistory>();
const workspaceIndex = new Map<RecommendationWorkspaceId, Set<RecommendationId>>();

function indexProfile(history: ExecutiveRecommendationHistory): void {
  const ids = workspaceIndex.get(history.profile.workspaceId) ?? new Set<RecommendationId>();
  ids.add(history.profile.recommendationId);
  workspaceIndex.set(history.profile.workspaceId, ids);
}

function unindexProfile(history: ExecutiveRecommendationHistory): void {
  const ids = workspaceIndex.get(history.profile.workspaceId);
  if (!ids) {
    return;
  }
  ids.delete(history.profile.recommendationId);
  if (ids.size === 0) {
    workspaceIndex.delete(history.profile.workspaceId);
  }
}

export function clearRecommendationLearningRegistryForTests(): void {
  recommendationRegistry.clear();
  workspaceIndex.clear();
}

export function recommendationProfileExists(recommendationId: RecommendationId): boolean {
  return recommendationRegistry.has(recommendationId);
}

export function registerRecommendationProfile(
  history: ExecutiveRecommendationHistory
): RecommendationEngineResult<ExecutiveRecommendationHistory> {
  const validation = validateExecutiveRecommendationHistory(history);
  if (!validation.valid) {
    return Object.freeze({
      success: false,
      reason: validation.issues.map((entry) => entry.message).join("; "),
      data: null,
      error: validation.issues[0] ?? null,
      readOnly: true as const,
    });
  }
  if (recommendationRegistry.has(history.profile.recommendationId)) {
    return Object.freeze({
      success: false,
      reason: `Duplicate recommendation id: ${history.profile.recommendationId}.`,
      data: null,
      error: Object.freeze({
        code: "duplicate_recommendation",
        message: "Duplicate recommendation id.",
        field: "recommendationId",
        readOnly: true as const,
      }),
      readOnly: true as const,
    });
  }
  if (recommendationRegistry.size >= RECOMMENDATION_LEARNING_ENGINE_LIMITS.maxRegisteredProfiles) {
    return Object.freeze({
      success: false,
      reason: "Recommendation registry is full.",
      data: null,
      error: Object.freeze({
        code: "registry_full",
        message: "Recommendation registry is full.",
        readOnly: true as const,
      }),
      readOnly: true as const,
    });
  }
  recommendationRegistry.set(history.profile.recommendationId, history);
  indexProfile(history);
  return Object.freeze({
    success: true,
    reason: "Recommendation profile registered.",
    data: history,
    error: null,
    readOnly: true as const,
  });
}

export function unregisterRecommendationProfile(
  recommendationId: RecommendationId
): RecommendationEngineResult<RecommendationId> {
  const existing = recommendationRegistry.get(recommendationId);
  if (!existing) {
    return Object.freeze({
      success: false,
      reason: `Recommendation profile not found: ${recommendationId}.`,
      data: null,
      error: Object.freeze({
        code: "recommendation_not_found",
        message: "Recommendation profile not found.",
        field: "recommendationId",
        readOnly: true as const,
      }),
      readOnly: true as const,
    });
  }
  recommendationRegistry.delete(recommendationId);
  unindexProfile(existing);
  return Object.freeze({
    success: true,
    reason: "Recommendation profile unregistered.",
    data: recommendationId,
    error: null,
    readOnly: true as const,
  });
}

export function getRecommendationProfile(recommendationId: RecommendationId): ExecutiveRecommendationHistory | null {
  return recommendationRegistry.get(recommendationId) ?? null;
}

export function getRecommendationProfiles(
  workspaceId?: RecommendationWorkspaceId
): readonly ExecutiveRecommendationHistory[] {
  if (!workspaceId) {
    return Object.freeze(
      [...recommendationRegistry.values()].sort((left, right) =>
        left.profile.recommendationId.localeCompare(right.profile.recommendationId)
      )
    );
  }
  const ids = workspaceIndex.get(workspaceId);
  if (!ids) {
    return Object.freeze([]);
  }
  return Object.freeze(
    [...ids]
      .map((id) => recommendationRegistry.get(id))
      .filter((entry): entry is ExecutiveRecommendationHistory => entry !== undefined)
      .sort((left, right) => left.profile.recommendationId.localeCompare(right.profile.recommendationId))
  );
}

export function getRecommendationRegistrySnapshot(): RecommendationRegistrySnapshot {
  return Object.freeze({
    registryVersion: RECOMMENDATION_LEARNING_ENGINE_CONTRACT_VERSION,
    profileCount: recommendationRegistry.size,
    recommendationIds: Object.freeze([...recommendationRegistry.keys()].sort()),
    readOnly: true as const,
  });
}

export const RecommendationLearningEngineRegistry = Object.freeze({
  clearRecommendationLearningRegistryForTests,
  recommendationProfileExists,
  registerRecommendationProfile,
  unregisterRecommendationProfile,
  getRecommendationProfile,
  getRecommendationProfiles,
  getRecommendationRegistrySnapshot,
});
