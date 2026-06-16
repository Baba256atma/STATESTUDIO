/**
 * MRP:5A:2 — Advisory recommendation runtime state store.
 */

import {
  ADVISORY_CONFIDENCE_LEVELS,
  DEFAULT_ADVISORY_RECOMMENDATION_RUNTIME,
  MRP_ADVISORY_RUNTIME_TAG,
  type AdvisoryConfidenceLevel,
  type AdvisoryRecommendationRuntime,
} from "./advisoryStateContract.ts";
import {
  buildAdvisoryRecommendationRuntimeSignature,
  resolveAdvisoryRecommendationRuntimeFromContext,
  type AdvisoryStateContextInput,
} from "./advisoryStateContextResolver.ts";
import { buildAdvisoryWorkspaceSnapshotsFromRuntime } from "./advisoryStateWorkspaceSync.ts";
import {
  getAdvisoryWorkspaceState,
  publishAdvisoryWorkspaceState,
} from "./advisoryWorkspaceStateRuntime.ts";

const loggedRuntimeKeys = new Set<string>();

function isDev(): boolean {
  return typeof process === "undefined" || process.env.NODE_ENV !== "production";
}

function logRuntimeOnce(key: string, detail: Readonly<Record<string, unknown>>): void {
  if (!isDev()) return;
  if (loggedRuntimeKeys.has(key)) return;
  loggedRuntimeKeys.add(key);
  globalThis.console?.debug?.(MRP_ADVISORY_RUNTIME_TAG, detail);
}

function normalizeText(value: unknown, fallback: string | null): string | null {
  if (value === null) return null;
  if (typeof value !== "string") return fallback;
  const trimmed = value.trim();
  return trimmed || fallback;
}

function normalizeConfidence(value: unknown, fallback: AdvisoryConfidenceLevel): AdvisoryConfidenceLevel {
  if (
    typeof value === "string" &&
    (ADVISORY_CONFIDENCE_LEVELS as readonly string[]).includes(value)
  ) {
    return value as AdvisoryConfidenceLevel;
  }
  return fallback;
}

function syncAdvisoryWorkspaceFromRuntime(runtime: AdvisoryRecommendationRuntime): void {
  const workspaceState = getAdvisoryWorkspaceState();
  const snapshots = buildAdvisoryWorkspaceSnapshotsFromRuntime({
    ...workspaceState,
    ...runtime,
  });

  publishAdvisoryWorkspaceState({
    phase: workspaceState.phase === "loading" ? "ready" : workspaceState.phase,
    ...runtime,
    ...snapshots,
  });
}

export function buildAdvisoryStateContextInputFromStores(
  overrides?: Partial<AdvisoryStateContextInput>
): AdvisoryStateContextInput {
  return Object.freeze({
    workspaceContext: overrides?.workspaceContext ?? getAdvisoryWorkspaceState().workspaceContext,
    sourceScenarioId:
      overrides?.sourceScenarioId !== undefined
        ? overrides.sourceScenarioId
        : getAdvisoryWorkspaceState().sourceScenarioId,
    sourceDecisionId:
      overrides?.sourceDecisionId !== undefined
        ? overrides.sourceDecisionId
        : getAdvisoryWorkspaceState().sourceDecisionId,
  });
}

export function publishAdvisoryRecommendationRuntime(
  input: Partial<AdvisoryRecommendationRuntime>
): AdvisoryRecommendationRuntime {
  const current = getAdvisoryWorkspaceState();
  const next = Object.freeze({
    recommendationId: normalizeText(input.recommendationId, current.recommendationId),
    recommendationTitle: normalizeText(input.recommendationTitle, current.recommendationTitle),
    confidence: normalizeConfidence(input.confidence, current.confidence),
    rationale: normalizeText(input.rationale, current.rationale),
    selectedObjectId: normalizeText(input.selectedObjectId, current.selectedObjectId),
    sourceScenarioId: normalizeText(input.sourceScenarioId, current.sourceScenarioId),
    sourceDecisionId: normalizeText(input.sourceDecisionId, current.sourceDecisionId),
  });

  syncAdvisoryWorkspaceFromRuntime(next);

  logRuntimeOnce(buildAdvisoryRecommendationRuntimeSignature(next), {
    action: "advisory_recommendation_runtime_published",
    recommendationId: next.recommendationId,
    confidence: next.confidence,
  });

  return next;
}

export function syncAdvisoryStateFromContext(
  input?: Partial<AdvisoryStateContextInput>
): AdvisoryRecommendationRuntime {
  const base = buildAdvisoryStateContextInputFromStores(input);
  const resolved = resolveAdvisoryRecommendationRuntimeFromContext(base);
  publishAdvisoryRecommendationRuntime(resolved);
  return resolved;
}

export function hydrateAdvisoryStateOnMount(mountKey: string): AdvisoryRecommendationRuntime {
  const runtime = syncAdvisoryStateFromContext();
  logRuntimeOnce(`hydrate:${mountKey}`, {
    action: "advisory_state_hydrated",
    mountKey,
    recommendationId: runtime.recommendationId,
    selectedObjectId: runtime.selectedObjectId,
  });
  return runtime;
}

export function traceAdvisoryRuntimeOnce(mountKey?: string | null): void {
  const state = getAdvisoryWorkspaceState();
  logRuntimeOnce(`trace:${mountKey ?? "default"}`, {
    action: "advisory_runtime_active",
    mountKey: mountKey ?? null,
    recommendationId: state.recommendationId,
    confidence: state.confidence,
  });
}

export function resetAdvisoryStateRuntimeForTests(): void {
  loggedRuntimeKeys.clear();
}
