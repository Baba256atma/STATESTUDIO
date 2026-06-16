/**
 * MRP:5A:1 / 5A:2 — Advisory workspace runtime state store.
 */

import {
  DEFAULT_ADVISORY_EXPLAINABILITY_LAYER,
  DEFAULT_ADVISORY_EXPLAINABILITY_SURFACE,
  type AdvisoryExplainabilityLayer,
  type AdvisoryExplainabilitySurface,
} from "./advisoryExplainabilityContract.ts";
import { buildAdvisoryExplainabilitySignature } from "./advisoryExplainabilityResolver.ts";
import type { RecommendationPackage } from "./advisoryHandoffContract.ts";
import { buildRecommendationPackageSignature } from "./advisoryHandoffResolver.ts";
import {
  DEFAULT_ADVISORY_RECOMMENDATION_LAYER,
  DEFAULT_ADVISORY_RECOMMENDATION_SURFACE,
  type AdvisoryRecommendationLayer,
  type AdvisoryRecommendationSurface,
} from "./advisoryRecommendationContract.ts";
import { buildAdvisoryRecommendationSignature } from "./advisoryRecommendationResolver.ts";
import {
  DEFAULT_ADVISORY_RECOMMENDATION_RUNTIME,
  type AdvisoryConfidenceLevel,
} from "./advisoryStateContract.ts";
import { buildAdvisoryRecommendationRuntimeSignature } from "./advisoryStateContextResolver.ts";
import { hydrateAdvisoryStateOnMount } from "./advisoryStateRuntime.ts";
import {
  DEFAULT_ADVISORY_READY_STATE,
  DEFAULT_ALTERNATIVE_RECOMMENDATIONS,
  DEFAULT_ASSUMPTIONS,
  DEFAULT_CONFIDENCE_SUMMARY,
  DEFAULT_EXECUTIVE_RECOMMENDATION,
  DEFAULT_RECOMMENDATION_DRIVERS,
  ADVISORY_LOADING_DETAIL,
  ADVISORY_LOADING_HEADLINE,
  ADVISORY_RUNTIME_TAG,
  ADVISORY_STATE_TAG,
  type AdvisoryFieldSnapshot,
  type AdvisoryWorkspaceState,
  type AdvisoryWorkspaceStatePhase,
  type AdvisoryWorkspaceStatePublishResult,
} from "./advisoryWorkspaceStateContract.ts";
import {
  DEFAULT_ADVISORY_WORKSPACE_CONTEXT,
  type AdvisoryWorkspaceContext,
} from "./advisoryWorkspaceContextContract.ts";
import { buildAdvisoryWorkspaceContextSignature } from "./advisoryWorkspaceContextResolver.ts";

const listeners = new Set<() => void>();
const loggedRuntimeKeys = new Set<string>();
const loggedStateKeys = new Set<string>();

let revision = 0;
let lastSignature: string | null = null;
let publishCount = 0;
let loopGuardWindowStart = 0;
let loopGuardPublishCount = 0;

let state: AdvisoryWorkspaceState = createAdvisoryLoadingState(0);

function isDev(): boolean {
  return typeof process === "undefined" || process.env.NODE_ENV !== "production";
}

function notifyListeners(): void {
  for (const listener of listeners) listener();
}

function normalizeText(value: unknown, fallback: string): string {
  if (typeof value !== "string") return fallback;
  const trimmed = value.trim();
  return trimmed || fallback;
}

function normalizeNullableText(value: unknown, fallback: string | null): string | null {
  if (value === null) return null;
  if (typeof value !== "string") return fallback;
  const trimmed = value.trim();
  return trimmed || fallback;
}

function normalizeField(
  value: AdvisoryFieldSnapshot | undefined,
  fallback: AdvisoryFieldSnapshot
): AdvisoryFieldSnapshot {
  return Object.freeze({
    headline: normalizeText(value?.headline, fallback.headline),
    detail: normalizeText(value?.detail, fallback.detail),
  });
}

function normalizePhase(value: unknown): AdvisoryWorkspaceStatePhase {
  if (value === "loading" || value === "ready" || value === "empty") {
    return value;
  }
  return "ready";
}

function normalizeConfidence(value: unknown, fallback: AdvisoryConfidenceLevel): AdvisoryConfidenceLevel {
  if (
    value === "unknown" ||
    value === "low" ||
    value === "moderate" ||
    value === "high" ||
    value === "very_high"
  ) {
    return value;
  }
  return fallback;
}

function normalizeWorkspaceContext(
  value: AdvisoryWorkspaceContext | undefined,
  fallback: AdvisoryWorkspaceContext
): AdvisoryWorkspaceContext {
  if (!value) return fallback;
  return Object.freeze({
    selectedObjectId: value.selectedObjectId?.trim() || null,
    selectedObject: normalizeText(value.selectedObject, fallback.selectedObject),
    recommendationFocus: normalizeText(value.recommendationFocus, fallback.recommendationFocus),
    confidenceLevel: normalizeText(value.confidenceLevel, fallback.confidenceLevel),
    reviewScope: normalizeText(value.reviewScope, fallback.reviewScope),
    hasSelection: value.hasSelection === true,
  });
}

export function buildAdvisoryWorkspaceStateSignature(input: {
  phase: AdvisoryWorkspaceStatePhase;
  workspaceContext: AdvisoryWorkspaceContext;
  recommendationId: string | null;
  recommendationTitle: string | null;
  confidence: AdvisoryConfidenceLevel;
  rationale: string | null;
  selectedObjectId: string | null;
  sourceScenarioId: string | null;
  sourceDecisionId: string | null;
  recommendationLayer: AdvisoryRecommendationLayer;
  recommendationSurface: AdvisoryRecommendationSurface;
  explainabilityLayer: AdvisoryExplainabilityLayer;
  explainabilitySurface: AdvisoryExplainabilitySurface;
  pendingRecommendationPackage: RecommendationPackage | null;
  handoffReady: boolean;
  executiveRecommendation: AdvisoryFieldSnapshot;
  recommendationDrivers: AdvisoryFieldSnapshot;
  confidenceSummary: AdvisoryFieldSnapshot;
  assumptions: AdvisoryFieldSnapshot;
  alternativeRecommendations: AdvisoryFieldSnapshot;
}): string {
  return JSON.stringify({
    phase: input.phase,
    workspaceContext: buildAdvisoryWorkspaceContextSignature(input.workspaceContext),
    recommendationRuntime: buildAdvisoryRecommendationRuntimeSignature({
      recommendationId: input.recommendationId,
      recommendationTitle: input.recommendationTitle,
      confidence: input.confidence,
      rationale: input.rationale,
      selectedObjectId: input.selectedObjectId,
      sourceScenarioId: input.sourceScenarioId,
      sourceDecisionId: input.sourceDecisionId,
    }),
    recommendationLayer: buildAdvisoryRecommendationSignature(input.recommendationLayer),
    explainabilityLayer: buildAdvisoryExplainabilitySignature(input.explainabilityLayer),
    pendingRecommendationPackage: input.pendingRecommendationPackage
      ? buildRecommendationPackageSignature(input.pendingRecommendationPackage)
      : null,
    handoffReady: input.handoffReady,
    executiveRecommendation: input.executiveRecommendation,
    recommendationDrivers: input.recommendationDrivers,
    confidenceSummary: input.confidenceSummary,
    assumptions: input.assumptions,
    alternativeRecommendations: input.alternativeRecommendations,
  });
}

export function createAdvisoryLoadingState(rev = 0): AdvisoryWorkspaceState {
  const loadingField = Object.freeze({
    headline: ADVISORY_LOADING_HEADLINE,
    detail: ADVISORY_LOADING_DETAIL,
  });
  const signature = buildAdvisoryWorkspaceStateSignature({
    phase: "loading",
    workspaceContext: DEFAULT_ADVISORY_WORKSPACE_CONTEXT,
    ...DEFAULT_ADVISORY_RECOMMENDATION_RUNTIME,
    recommendationLayer: DEFAULT_ADVISORY_RECOMMENDATION_LAYER,
    recommendationSurface: DEFAULT_ADVISORY_RECOMMENDATION_SURFACE,
    explainabilityLayer: DEFAULT_ADVISORY_EXPLAINABILITY_LAYER,
    explainabilitySurface: DEFAULT_ADVISORY_EXPLAINABILITY_SURFACE,
    pendingRecommendationPackage: null,
    handoffReady: false,
    executiveRecommendation: loadingField,
    recommendationDrivers: loadingField,
    confidenceSummary: loadingField,
    assumptions: loadingField,
    alternativeRecommendations: loadingField,
  });
  return Object.freeze({
    phase: "loading",
    workspaceContext: DEFAULT_ADVISORY_WORKSPACE_CONTEXT,
    ...DEFAULT_ADVISORY_RECOMMENDATION_RUNTIME,
    recommendationLayer: DEFAULT_ADVISORY_RECOMMENDATION_LAYER,
    recommendationReadOnly: true,
    recommendationSurface: DEFAULT_ADVISORY_RECOMMENDATION_SURFACE,
    recommendationOwned: true,
    explainabilityLayer: DEFAULT_ADVISORY_EXPLAINABILITY_LAYER,
    explainabilityReadOnly: true,
    explainabilitySurface: DEFAULT_ADVISORY_EXPLAINABILITY_SURFACE,
    pendingRecommendationPackage: null,
    handoffReady: false,
    executiveRecommendation: loadingField,
    recommendationDrivers: loadingField,
    confidenceSummary: loadingField,
    assumptions: loadingField,
    alternativeRecommendations: loadingField,
    revision: rev,
    signature,
  });
}

function logStateOnce(key: string, detail: Readonly<Record<string, unknown>>): void {
  if (!isDev()) return;
  if (loggedStateKeys.has(key)) return;
  loggedStateKeys.add(key);
  globalThis.console?.debug?.(ADVISORY_STATE_TAG, detail);
}

function logRuntimeOnce(key: string, detail: Readonly<Record<string, unknown>>): void {
  if (!isDev()) return;
  if (loggedRuntimeKeys.has(key)) return;
  loggedRuntimeKeys.add(key);
  globalThis.console?.debug?.(ADVISORY_RUNTIME_TAG, detail);
}

function detectRenderLoop(): boolean {
  const now = Date.now();
  if (now - loopGuardWindowStart > 1000) {
    loopGuardWindowStart = now;
    loopGuardPublishCount = 0;
  }
  loopGuardPublishCount += 1;
  return loopGuardPublishCount > 30;
}

export function getAdvisoryWorkspaceState(): AdvisoryWorkspaceState {
  return state;
}

export function getAdvisoryWorkspaceStateServerSnapshot(): AdvisoryWorkspaceState {
  return createAdvisoryLoadingState(0);
}

export function subscribeAdvisoryWorkspaceState(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function publishAdvisoryWorkspaceState(
  input: Partial<Omit<AdvisoryWorkspaceState, "revision" | "signature">> & {
    phase?: AdvisoryWorkspaceStatePhase;
  }
): AdvisoryWorkspaceStatePublishResult {
  publishCount += 1;

  if (detectRenderLoop()) {
    logRuntimeOnce("render_loop", { reason: "publish_rate_exceeded" });
    return Object.freeze({
      changed: false,
      state,
      revision: state.revision,
      guarded: true,
      guardReason: "render_loop",
    });
  }

  const nextCandidate = Object.freeze({
    phase: normalizePhase(input.phase ?? state.phase),
    workspaceContext: normalizeWorkspaceContext(input.workspaceContext, state.workspaceContext),
    recommendationId: normalizeNullableText(input.recommendationId, state.recommendationId),
    recommendationTitle: normalizeNullableText(
      input.recommendationTitle,
      state.recommendationTitle
    ),
    confidence: normalizeConfidence(input.confidence, state.confidence),
    rationale: normalizeNullableText(input.rationale, state.rationale),
    selectedObjectId: normalizeNullableText(input.selectedObjectId, state.selectedObjectId),
    sourceScenarioId: normalizeNullableText(input.sourceScenarioId, state.sourceScenarioId),
    sourceDecisionId: normalizeNullableText(input.sourceDecisionId, state.sourceDecisionId),
    recommendationLayer: input.recommendationLayer ?? state.recommendationLayer,
    recommendationReadOnly: true as const,
    recommendationSurface: input.recommendationSurface ?? state.recommendationSurface,
    recommendationOwned: true as const,
    explainabilityLayer: input.explainabilityLayer ?? state.explainabilityLayer,
    explainabilityReadOnly: true as const,
    explainabilitySurface: input.explainabilitySurface ?? state.explainabilitySurface,
    pendingRecommendationPackage:
      input.pendingRecommendationPackage !== undefined
        ? input.pendingRecommendationPackage
        : state.pendingRecommendationPackage,
    handoffReady: input.handoffReady ?? state.handoffReady,
    executiveRecommendation: normalizeField(
      input.executiveRecommendation,
      state.executiveRecommendation
    ),
    recommendationDrivers: normalizeField(
      input.recommendationDrivers,
      state.recommendationDrivers
    ),
    confidenceSummary: normalizeField(input.confidenceSummary, state.confidenceSummary),
    assumptions: normalizeField(input.assumptions, state.assumptions),
    alternativeRecommendations: normalizeField(
      input.alternativeRecommendations,
      state.alternativeRecommendations
    ),
  });

  const signature = buildAdvisoryWorkspaceStateSignature(nextCandidate);
  if (signature === lastSignature) {
    return Object.freeze({
      changed: false,
      state,
      revision: state.revision,
      guarded: false,
    });
  }

  const nextRevision = revision + 1;
  const nextState = Object.freeze({
    ...nextCandidate,
    revision: nextRevision,
    signature,
  });

  revision = nextRevision;
  lastSignature = signature;
  state = nextState;

  logStateOnce(signature, {
    phase: state.phase,
    revision: nextRevision,
    recommendationId: state.recommendationId,
  });
  logRuntimeOnce(`${state.phase}:${signature}`, {
    action: "state_published",
    revision: nextRevision,
  });

  notifyListeners();

  return Object.freeze({
    changed: true,
    state,
    revision: nextRevision,
    guarded: false,
  });
}

export function hydrateAdvisoryWorkspaceStateOnMount(mountKey: string): void {
  publishAdvisoryWorkspaceState({
    phase: "loading",
    executiveRecommendation: Object.freeze({
      headline: ADVISORY_LOADING_HEADLINE,
      detail: ADVISORY_LOADING_DETAIL,
    }),
    recommendationDrivers: Object.freeze({
      headline: ADVISORY_LOADING_HEADLINE,
      detail: ADVISORY_LOADING_DETAIL,
    }),
    confidenceSummary: Object.freeze({
      headline: ADVISORY_LOADING_HEADLINE,
      detail: ADVISORY_LOADING_DETAIL,
    }),
    assumptions: Object.freeze({
      headline: ADVISORY_LOADING_HEADLINE,
      detail: ADVISORY_LOADING_DETAIL,
    }),
    alternativeRecommendations: Object.freeze({
      headline: ADVISORY_LOADING_HEADLINE,
      detail: ADVISORY_LOADING_DETAIL,
    }),
  });

  hydrateAdvisoryStateOnMount(mountKey);

  logRuntimeOnce(`hydrate:${mountKey}`, {
    action: "workspace_state_hydrated",
    mountKey,
    phase: state.phase,
    recommendationId: state.recommendationId,
  });
}

export function resetAdvisoryWorkspaceStateRuntimeForTests(): void {
  revision = 0;
  lastSignature = null;
  publishCount = 0;
  loopGuardWindowStart = 0;
  loopGuardPublishCount = 0;
  loggedRuntimeKeys.clear();
  loggedStateKeys.clear();
  state = createAdvisoryLoadingState(0);
  notifyListeners();
}

/** @internal */
export function getAdvisoryDefaultReadyStateForTests(): AdvisoryWorkspaceState {
  return Object.freeze({
    ...DEFAULT_ADVISORY_READY_STATE,
    revision: 0,
    signature: buildAdvisoryWorkspaceStateSignature({
      phase: "ready",
      workspaceContext: DEFAULT_ADVISORY_READY_STATE.workspaceContext,
      recommendationId: DEFAULT_ADVISORY_READY_STATE.recommendationId,
      recommendationTitle: DEFAULT_ADVISORY_READY_STATE.recommendationTitle,
      confidence: DEFAULT_ADVISORY_READY_STATE.confidence,
      rationale: DEFAULT_ADVISORY_READY_STATE.rationale,
      selectedObjectId: DEFAULT_ADVISORY_READY_STATE.selectedObjectId,
      sourceScenarioId: DEFAULT_ADVISORY_READY_STATE.sourceScenarioId,
      sourceDecisionId: DEFAULT_ADVISORY_READY_STATE.sourceDecisionId,
      recommendationLayer: DEFAULT_ADVISORY_READY_STATE.recommendationLayer,
      recommendationSurface: DEFAULT_ADVISORY_READY_STATE.recommendationSurface,
      explainabilityLayer: DEFAULT_ADVISORY_READY_STATE.explainabilityLayer,
      explainabilitySurface: DEFAULT_ADVISORY_READY_STATE.explainabilitySurface,
      pendingRecommendationPackage: DEFAULT_ADVISORY_READY_STATE.pendingRecommendationPackage,
      handoffReady: DEFAULT_ADVISORY_READY_STATE.handoffReady,
      executiveRecommendation: DEFAULT_ADVISORY_READY_STATE.executiveRecommendation,
      recommendationDrivers: DEFAULT_ADVISORY_READY_STATE.recommendationDrivers,
      confidenceSummary: DEFAULT_ADVISORY_READY_STATE.confidenceSummary,
      assumptions: DEFAULT_ADVISORY_READY_STATE.assumptions,
      alternativeRecommendations: DEFAULT_ADVISORY_READY_STATE.alternativeRecommendations,
    }),
  });
}
