/**
 * APP-12:3 — Executive Recommendation Evaluation Engine immutable registry.
 */

import {
  EXECUTIVE_RECOMMENDATION_EVALUATION_ENGINE_CONTRACT_VERSION,
  EXECUTIVE_RECOMMENDATION_EVALUATION_ENGINE_LIMITS,
} from "./executiveRecommendationEvaluationEngineConstants.ts";
import type {
  EvaluationId,
  RecommendationEvaluation,
  RecommendationEvaluationEngineResult,
  RecommendationEvaluationRegistrySnapshot,
  RecommendationWorkspaceId,
} from "./executiveRecommendationEvaluationEngineTypes.ts";
import { validateRecommendationEvaluationRecord } from "./executiveRecommendationEvaluationEngineValidation.ts";

const evaluationRegistry = new Map<EvaluationId, RecommendationEvaluation>();
const workspaceIndex = new Map<RecommendationWorkspaceId, Set<EvaluationId>>();

function indexEvaluation(evaluation: RecommendationEvaluation): void {
  const ids = workspaceIndex.get(evaluation.provenance.workspaceId) ?? new Set<EvaluationId>();
  ids.add(evaluation.evaluationId);
  workspaceIndex.set(evaluation.provenance.workspaceId, ids);
}

function unindexEvaluation(evaluation: RecommendationEvaluation): void {
  const ids = workspaceIndex.get(evaluation.provenance.workspaceId);
  if (!ids) {
    return;
  }
  ids.delete(evaluation.evaluationId);
  if (ids.size === 0) {
    workspaceIndex.delete(evaluation.provenance.workspaceId);
  }
}

export function resetExecutiveRecommendationEvaluationEngineRegistryForTests(): void {
  evaluationRegistry.clear();
  workspaceIndex.clear();
}

export function recommendationEvaluationExists(evaluationId: EvaluationId): boolean {
  return evaluationRegistry.has(evaluationId);
}

export function registerRecommendationEvaluation(
  evaluation: RecommendationEvaluation
): RecommendationEvaluationEngineResult<RecommendationEvaluation> {
  const validation = validateRecommendationEvaluationRecord(evaluation);
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
  if (evaluationRegistry.has(evaluation.evaluationId)) {
    return Object.freeze({
      success: false,
      reason: `Duplicate evaluation id: ${evaluation.evaluationId}.`,
      data: null,
      error: Object.freeze({
        code: "duplicate_evaluation",
        message: "Duplicate evaluation id.",
        field: "evaluationId",
        readOnly: true as const,
      }),
      readOnly: true as const,
    });
  }
  if (evaluationRegistry.size >= EXECUTIVE_RECOMMENDATION_EVALUATION_ENGINE_LIMITS.maxRegisteredEvaluations) {
    return Object.freeze({
      success: false,
      reason: "Recommendation evaluation registry is full.",
      data: null,
      error: Object.freeze({
        code: "registry_full",
        message: "Recommendation evaluation registry is full.",
        readOnly: true as const,
      }),
      readOnly: true as const,
    });
  }
  evaluationRegistry.set(evaluation.evaluationId, evaluation);
  indexEvaluation(evaluation);
  return Object.freeze({
    success: true,
    reason: "Recommendation evaluation registered.",
    data: evaluation,
    error: null,
    readOnly: true as const,
  });
}

export function unregisterRecommendationEvaluation(
  evaluationId: EvaluationId
): RecommendationEvaluationEngineResult<EvaluationId> {
  const existing = evaluationRegistry.get(evaluationId);
  if (!existing) {
    return Object.freeze({
      success: false,
      reason: `Recommendation evaluation not found: ${evaluationId}.`,
      data: null,
      error: Object.freeze({
        code: "not_found",
        message: "Recommendation evaluation not found.",
        field: "evaluationId",
        readOnly: true as const,
      }),
      readOnly: true as const,
    });
  }
  evaluationRegistry.delete(evaluationId);
  unindexEvaluation(existing);
  return Object.freeze({
    success: true,
    reason: "Recommendation evaluation unregistered.",
    data: evaluationId,
    error: null,
    readOnly: true as const,
  });
}

export function getRecommendationEvaluation(evaluationId: EvaluationId): RecommendationEvaluation | null {
  return evaluationRegistry.get(evaluationId) ?? null;
}

export function getRecommendationEvaluations(
  workspaceId?: RecommendationWorkspaceId
): readonly RecommendationEvaluation[] {
  if (!workspaceId) {
    return Object.freeze(
      [...evaluationRegistry.values()].sort((left, right) =>
        left.evaluationId.localeCompare(right.evaluationId)
      )
    );
  }
  const ids = workspaceIndex.get(workspaceId);
  if (!ids) {
    return Object.freeze([]);
  }
  return Object.freeze(
    [...ids]
      .map((evaluationId) => evaluationRegistry.get(evaluationId))
      .filter((entry): entry is RecommendationEvaluation => entry !== undefined)
      .sort((left, right) => left.evaluationId.localeCompare(right.evaluationId))
  );
}

export function getRecommendationEvaluationRegistrySnapshot(): RecommendationEvaluationRegistrySnapshot {
  const evaluationIds = Object.freeze([...evaluationRegistry.keys()].sort());
  return Object.freeze({
    registryVersion: EXECUTIVE_RECOMMENDATION_EVALUATION_ENGINE_CONTRACT_VERSION,
    evaluationCount: evaluationRegistry.size,
    evaluationIds,
    readOnly: true as const,
  });
}

export const ExecutiveRecommendationEvaluationEngineRegistry = Object.freeze({
  resetExecutiveRecommendationEvaluationEngineRegistryForTests,
  recommendationEvaluationExists,
  registerRecommendationEvaluation,
  unregisterRecommendationEvaluation,
  getRecommendationEvaluation,
  getRecommendationEvaluations,
  getRecommendationEvaluationRegistrySnapshot,
});
