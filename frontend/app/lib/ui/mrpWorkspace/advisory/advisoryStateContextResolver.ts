/**
 * MRP:5A:2 — Pure resolver for Advisory recommendation runtime state.
 *
 * Consumes workspace context only — no Scenario, War Room, or Scene store reads.
 */

import type { AdvisoryWorkspaceContext } from "./advisoryWorkspaceContextContract.ts";
import {
  DEFAULT_ADVISORY_RECOMMENDATION_RUNTIME,
  type AdvisoryConfidenceLevel,
  type AdvisoryRecommendationRuntime,
} from "./advisoryStateContract.ts";

export type AdvisoryStateContextInput = Readonly<{
  workspaceContext: AdvisoryWorkspaceContext;
  sourceScenarioId?: string | null;
  sourceDecisionId?: string | null;
}>;

function normalizeConfidence(value: unknown): AdvisoryConfidenceLevel {
  if (typeof value !== "string") return "unknown";
  const normalized = value.trim().toLowerCase().replace(/\s+/g, "_");
  if (normalized === "very_high" || normalized === "veryhigh") return "very_high";
  if (
    normalized === "low" ||
    normalized === "moderate" ||
    normalized === "high" ||
    normalized === "very_high"
  ) {
    return normalized;
  }
  return "unknown";
}

function resolveObjectId(context: AdvisoryWorkspaceContext): string | null {
  return context.selectedObjectId?.trim() || null;
}

function resolveRecommendationId(objectId: string | null): string | null {
  if (!objectId) return null;
  return `recommendation:${objectId}`;
}

function resolveRecommendationTitle(context: AdvisoryWorkspaceContext): string | null {
  if (!context.hasSelection) return null;
  return context.recommendationFocus.trim() || "Executive recommendation pending";
}

function resolveRationale(context: AdvisoryWorkspaceContext): string | null {
  if (!context.hasSelection) return null;
  return `Advisory recommendation scoped to ${context.selectedObject} — ${context.reviewScope}. Rule #14: recommendation only, no commitment or approval.`;
}

function resolveSourceScenarioId(
  objectId: string | null,
  override?: string | null
): string | null {
  const explicit = override?.trim();
  if (explicit) return explicit;
  if (!objectId) return null;
  return `scenario:${objectId}:expected_case`;
}

function resolveSourceDecisionId(
  objectId: string | null,
  override?: string | null
): string | null {
  const explicit = override?.trim();
  if (explicit) return explicit;
  if (!objectId) return null;
  return null;
}

export function resolveAdvisoryRecommendationRuntimeFromContext(
  input: AdvisoryStateContextInput
): AdvisoryRecommendationRuntime {
  const { workspaceContext } = input;

  if (!workspaceContext.hasSelection) {
    return DEFAULT_ADVISORY_RECOMMENDATION_RUNTIME;
  }

  const selectedObjectId = resolveObjectId(workspaceContext);

  return Object.freeze({
    recommendationId: resolveRecommendationId(selectedObjectId),
    recommendationTitle: resolveRecommendationTitle(workspaceContext),
    confidence: normalizeConfidence(workspaceContext.confidenceLevel),
    rationale: resolveRationale(workspaceContext),
    selectedObjectId,
    sourceScenarioId: resolveSourceScenarioId(selectedObjectId, input.sourceScenarioId),
    sourceDecisionId: resolveSourceDecisionId(selectedObjectId, input.sourceDecisionId),
  });
}

export function buildAdvisoryRecommendationRuntimeSignature(
  runtime: AdvisoryRecommendationRuntime
): string {
  return JSON.stringify({
    recommendationId: runtime.recommendationId,
    recommendationTitle: runtime.recommendationTitle,
    confidence: runtime.confidence,
    rationale: runtime.rationale,
    selectedObjectId: runtime.selectedObjectId,
    sourceScenarioId: runtime.sourceScenarioId,
    sourceDecisionId: runtime.sourceDecisionId,
  });
}
