/**
 * APP-12:2 — Executive Recommendation Generation Engine immutable registry.
 */

import {
  EXECUTIVE_RECOMMENDATION_GENERATION_ENGINE_CONTRACT_VERSION,
  EXECUTIVE_RECOMMENDATION_GENERATION_ENGINE_LIMITS,
} from "./executiveRecommendationGenerationEngineConstants.ts";
import type {
  RecommendationCandidate,
  RecommendationGenerationEngineResult,
  RecommendationId,
  RecommendationRegistrySnapshot,
  RecommendationWorkspaceId,
} from "./executiveRecommendationGenerationEngineTypes.ts";
import { validateRecommendationCandidate } from "./executiveRecommendationGenerationEngineValidation.ts";

const candidateRegistry = new Map<RecommendationId, RecommendationCandidate>();
const workspaceIndex = new Map<RecommendationWorkspaceId, Set<RecommendationId>>();

function indexCandidate(candidate: RecommendationCandidate): void {
  const ids = workspaceIndex.get(candidate.provenance.workspaceId) ?? new Set<RecommendationId>();
  ids.add(candidate.recommendationId);
  workspaceIndex.set(candidate.provenance.workspaceId, ids);
}

function unindexCandidate(candidate: RecommendationCandidate): void {
  const ids = workspaceIndex.get(candidate.provenance.workspaceId);
  if (!ids) {
    return;
  }
  ids.delete(candidate.recommendationId);
  if (ids.size === 0) {
    workspaceIndex.delete(candidate.provenance.workspaceId);
  }
}

export function resetExecutiveRecommendationGenerationEngineRegistryForTests(): void {
  candidateRegistry.clear();
  workspaceIndex.clear();
}

export function recommendationCandidateExists(recommendationId: RecommendationId): boolean {
  return candidateRegistry.has(recommendationId);
}

export function registerRecommendationCandidate(
  candidate: RecommendationCandidate
): RecommendationGenerationEngineResult<RecommendationCandidate> {
  const validation = validateRecommendationCandidate(candidate);
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
  if (candidateRegistry.has(candidate.recommendationId)) {
    return Object.freeze({
      success: false,
      reason: `Duplicate recommendation id: ${candidate.recommendationId}.`,
      data: null,
      error: Object.freeze({
        code: "duplicate_candidate",
        message: "Duplicate recommendation id.",
        field: "recommendationId",
        readOnly: true as const,
      }),
      readOnly: true as const,
    });
  }
  if (candidateRegistry.size >= EXECUTIVE_RECOMMENDATION_GENERATION_ENGINE_LIMITS.maxRegisteredCandidates) {
    return Object.freeze({
      success: false,
      reason: "Recommendation candidate registry is full.",
      data: null,
      error: Object.freeze({
        code: "registry_full",
        message: "Recommendation candidate registry is full.",
        readOnly: true as const,
      }),
      readOnly: true as const,
    });
  }
  candidateRegistry.set(candidate.recommendationId, candidate);
  indexCandidate(candidate);
  return Object.freeze({
    success: true,
    reason: "Recommendation candidate registered.",
    data: candidate,
    error: null,
    readOnly: true as const,
  });
}

export function unregisterRecommendationCandidate(
  recommendationId: RecommendationId
): RecommendationGenerationEngineResult<RecommendationId> {
  const existing = candidateRegistry.get(recommendationId);
  if (!existing) {
    return Object.freeze({
      success: false,
      reason: `Recommendation candidate not found: ${recommendationId}.`,
      data: null,
      error: Object.freeze({
        code: "not_found",
        message: "Recommendation candidate not found.",
        field: "recommendationId",
        readOnly: true as const,
      }),
      readOnly: true as const,
    });
  }
  candidateRegistry.delete(recommendationId);
  unindexCandidate(existing);
  return Object.freeze({
    success: true,
    reason: "Recommendation candidate unregistered.",
    data: recommendationId,
    error: null,
    readOnly: true as const,
  });
}

export function getRecommendationCandidate(recommendationId: RecommendationId): RecommendationCandidate | null {
  return candidateRegistry.get(recommendationId) ?? null;
}

export function getRecommendationCandidates(
  workspaceId?: RecommendationWorkspaceId
): readonly RecommendationCandidate[] {
  if (!workspaceId) {
    return Object.freeze(
      [...candidateRegistry.values()].sort((left, right) =>
        left.recommendationId.localeCompare(right.recommendationId)
      )
    );
  }
  const ids = workspaceIndex.get(workspaceId);
  if (!ids) {
    return Object.freeze([]);
  }
  return Object.freeze(
    [...ids]
      .map((recommendationId) => candidateRegistry.get(recommendationId))
      .filter((entry): entry is RecommendationCandidate => entry !== undefined)
      .sort((left, right) => left.recommendationId.localeCompare(right.recommendationId))
  );
}

export function getRecommendationRegistrySnapshot(): RecommendationRegistrySnapshot {
  const recommendationIds = Object.freeze([...candidateRegistry.keys()].sort());
  return Object.freeze({
    registryVersion: EXECUTIVE_RECOMMENDATION_GENERATION_ENGINE_CONTRACT_VERSION,
    candidateCount: candidateRegistry.size,
    recommendationIds,
    readOnly: true as const,
  });
}

export const ExecutiveRecommendationGenerationEngineRegistry = Object.freeze({
  resetExecutiveRecommendationGenerationEngineRegistryForTests,
  recommendationCandidateExists,
  registerRecommendationCandidate,
  unregisterRecommendationCandidate,
  getRecommendationCandidate,
  getRecommendationCandidates,
  getRecommendationRegistrySnapshot,
});
