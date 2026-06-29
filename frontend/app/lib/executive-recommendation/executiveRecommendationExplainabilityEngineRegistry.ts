/**
 * APP-12:4 — Executive Recommendation Explainability Engine immutable registry.
 */

import {
  EXECUTIVE_RECOMMENDATION_EXPLAINABILITY_ENGINE_CONTRACT_VERSION,
  EXECUTIVE_RECOMMENDATION_EXPLAINABILITY_ENGINE_LIMITS,
} from "./executiveRecommendationExplainabilityEngineConstants.ts";
import type {
  ExplanationId,
  RecommendationExplanation,
  RecommendationExplainabilityEngineResult,
  RecommendationExplanationRegistrySnapshot,
  RecommendationWorkspaceId,
} from "./executiveRecommendationExplainabilityEngineTypes.ts";
import { validateRecommendationExplanationRecord } from "./executiveRecommendationExplainabilityEngineValidation.ts";

const explanationRegistry = new Map<ExplanationId, RecommendationExplanation>();
const workspaceIndex = new Map<RecommendationWorkspaceId, Set<ExplanationId>>();

function indexExplanation(explanation: RecommendationExplanation): void {
  const ids = workspaceIndex.get(explanation.provenance.workspaceId) ?? new Set<ExplanationId>();
  ids.add(explanation.explanationId);
  workspaceIndex.set(explanation.provenance.workspaceId, ids);
}

function unindexExplanation(explanation: RecommendationExplanation): void {
  const ids = workspaceIndex.get(explanation.provenance.workspaceId);
  if (!ids) {
    return;
  }
  ids.delete(explanation.explanationId);
  if (ids.size === 0) {
    workspaceIndex.delete(explanation.provenance.workspaceId);
  }
}

export function resetExecutiveRecommendationExplainabilityEngineRegistryForTests(): void {
  explanationRegistry.clear();
  workspaceIndex.clear();
}

export function recommendationExplanationExists(explanationId: ExplanationId): boolean {
  return explanationRegistry.has(explanationId);
}

export function registerRecommendationExplanation(
  explanation: RecommendationExplanation
): RecommendationExplainabilityEngineResult<RecommendationExplanation> {
  const validation = validateRecommendationExplanationRecord(explanation);
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
  if (explanationRegistry.has(explanation.explanationId)) {
    return Object.freeze({
      success: false,
      reason: `Duplicate explanation id: ${explanation.explanationId}.`,
      data: null,
      error: Object.freeze({
        code: "duplicate_explanation",
        message: "Duplicate explanation id.",
        field: "explanationId",
        readOnly: true as const,
      }),
      readOnly: true as const,
    });
  }
  if (explanationRegistry.size >= EXECUTIVE_RECOMMENDATION_EXPLAINABILITY_ENGINE_LIMITS.maxRegisteredExplanations) {
    return Object.freeze({
      success: false,
      reason: "Recommendation explanation registry is full.",
      data: null,
      error: Object.freeze({
        code: "registry_full",
        message: "Recommendation explanation registry is full.",
        readOnly: true as const,
      }),
      readOnly: true as const,
    });
  }
  explanationRegistry.set(explanation.explanationId, explanation);
  indexExplanation(explanation);
  return Object.freeze({
    success: true,
    reason: "Recommendation explanation registered.",
    data: explanation,
    error: null,
    readOnly: true as const,
  });
}

export function unregisterRecommendationExplanation(
  explanationId: ExplanationId
): RecommendationExplainabilityEngineResult<ExplanationId> {
  const existing = explanationRegistry.get(explanationId);
  if (!existing) {
    return Object.freeze({
      success: false,
      reason: `Recommendation explanation not found: ${explanationId}.`,
      data: null,
      error: Object.freeze({
        code: "not_found",
        message: "Recommendation explanation not found.",
        field: "explanationId",
        readOnly: true as const,
      }),
      readOnly: true as const,
    });
  }
  explanationRegistry.delete(explanationId);
  unindexExplanation(existing);
  return Object.freeze({
    success: true,
    reason: "Recommendation explanation unregistered.",
    data: explanationId,
    error: null,
    readOnly: true as const,
  });
}

export function getRecommendationExplanation(explanationId: ExplanationId): RecommendationExplanation | null {
  return explanationRegistry.get(explanationId) ?? null;
}

export function getRecommendationExplanations(
  workspaceId?: RecommendationWorkspaceId
): readonly RecommendationExplanation[] {
  if (!workspaceId) {
    return Object.freeze(
      [...explanationRegistry.values()].sort((left, right) =>
        left.explanationId.localeCompare(right.explanationId)
      )
    );
  }
  const ids = workspaceIndex.get(workspaceId);
  if (!ids) {
    return Object.freeze([]);
  }
  return Object.freeze(
    [...ids]
      .map((explanationId) => explanationRegistry.get(explanationId))
      .filter((entry): entry is RecommendationExplanation => entry !== undefined)
      .sort((left, right) => left.explanationId.localeCompare(right.explanationId))
  );
}

export function getRecommendationExplanationRegistrySnapshot(): RecommendationExplanationRegistrySnapshot {
  const explanationIds = Object.freeze([...explanationRegistry.keys()].sort());
  return Object.freeze({
    registryVersion: EXECUTIVE_RECOMMENDATION_EXPLAINABILITY_ENGINE_CONTRACT_VERSION,
    explanationCount: explanationRegistry.size,
    explanationIds,
    readOnly: true as const,
  });
}

export const ExecutiveRecommendationExplainabilityEngineRegistry = Object.freeze({
  resetExecutiveRecommendationExplainabilityEngineRegistryForTests,
  recommendationExplanationExists,
  registerRecommendationExplanation,
  unregisterRecommendationExplanation,
  getRecommendationExplanation,
  getRecommendationExplanations,
  getRecommendationExplanationRegistrySnapshot,
});
