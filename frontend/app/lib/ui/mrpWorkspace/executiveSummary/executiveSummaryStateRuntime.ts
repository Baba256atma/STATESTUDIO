/**
 * MRP:4:2 — Executive Summary runtime state store.
 */

import {
  DEFAULT_EXECUTIVE_SUMMARY_READY_STATE,
  DEFAULT_EXECUTIVE_SUMMARY_RECOMMENDED_ATTENTION,
  DEFAULT_EXECUTIVE_SUMMARY_SYSTEM_STATUS,
  DEFAULT_EXECUTIVE_SUMMARY_TOP_OPPORTUNITY,
  DEFAULT_EXECUTIVE_SUMMARY_TOP_RISK,
  EXEC_SUMMARY_RUNTIME_TAG,
  EXEC_SUMMARY_STATE_TAG,
  EXECUTIVE_SUMMARY_EMPTY_DETAIL,
  EXECUTIVE_SUMMARY_EMPTY_HEADLINE,
  EXECUTIVE_SUMMARY_LOADING_DETAIL,
  EXECUTIVE_SUMMARY_LOADING_HEADLINE,
  type ExecutiveSummaryFieldSnapshot,
  type ExecutiveSummaryState,
  type ExecutiveSummaryStatePhase,
  type ExecutiveSummaryStatePublishResult,
} from "./executiveSummaryStateContract.ts";
import {
  DEFAULT_EXECUTIVE_SUMMARY_OBJECT_CONTEXT,
  type ExecutiveSummaryObjectContext,
} from "./executiveSummaryObjectContextContract.ts";
import {
  buildExecutiveSummaryObjectContextSignature,
} from "./executiveSummaryObjectContextResolver.ts";
import type { ExecutiveSummarySystemStatus } from "./executiveSummaryWorkspaceContract.ts";

const listeners = new Set<() => void>();
const loggedRuntimeKeys = new Set<string>();
const loggedStateKeys = new Set<string>();

let revision = 0;
let lastSignature: string | null = null;
let publishCount = 0;
let loopGuardWindowStart = 0;
let loopGuardPublishCount = 0;

let state: ExecutiveSummaryState = createExecutiveSummaryLoadingState(0);

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

function normalizeField(
  value: ExecutiveSummaryFieldSnapshot | undefined,
  fallback: ExecutiveSummaryFieldSnapshot
): ExecutiveSummaryFieldSnapshot {
  return Object.freeze({
    headline: normalizeText(value?.headline, fallback.headline),
    detail: normalizeText(value?.detail, fallback.detail),
  });
}

function normalizeSystemStatus(value: unknown): ExecutiveSummarySystemStatus {
  if (value === "healthy" || value === "warning" || value === "critical") {
    return value;
  }
  return DEFAULT_EXECUTIVE_SUMMARY_SYSTEM_STATUS;
}

function normalizePhase(value: unknown): ExecutiveSummaryStatePhase {
  if (value === "loading" || value === "ready" || value === "empty") {
    return value;
  }
  return "ready";
}

export function buildExecutiveSummaryStateSignature(input: {
  phase: ExecutiveSummaryStatePhase;
  systemStatus: ExecutiveSummarySystemStatus;
  topRisk: ExecutiveSummaryFieldSnapshot;
  topOpportunity: ExecutiveSummaryFieldSnapshot;
  recommendedAttention: ExecutiveSummaryFieldSnapshot;
  objectContext: ExecutiveSummaryObjectContext;
}): string {
  return JSON.stringify({
    phase: input.phase,
    systemStatus: input.systemStatus,
    topRisk: input.topRisk,
    topOpportunity: input.topOpportunity,
    recommendedAttention: input.recommendedAttention,
    objectContext: buildExecutiveSummaryObjectContextSignature(input.objectContext),
  });
}

function normalizeObjectContext(
  value: ExecutiveSummaryObjectContext | undefined,
  fallback: ExecutiveSummaryObjectContext
): ExecutiveSummaryObjectContext {
  if (!value) return fallback;
  return Object.freeze({
    selectedObjectId: value.selectedObjectId?.trim() || null,
    selectedObject: normalizeText(value.selectedObject, fallback.selectedObject),
    objectStatus: normalizeText(value.objectStatus, fallback.objectStatus),
    objectPriority: normalizeText(value.objectPriority, fallback.objectPriority),
    objectAttentionLevel: normalizeText(
      value.objectAttentionLevel,
      fallback.objectAttentionLevel
    ),
    hasSelection: value.hasSelection === true,
  });
}

export function createExecutiveSummaryLoadingState(rev = 0): ExecutiveSummaryState {
  const loadingField = Object.freeze({
    headline: EXECUTIVE_SUMMARY_LOADING_HEADLINE,
    detail: EXECUTIVE_SUMMARY_LOADING_DETAIL,
  });
  const signature = buildExecutiveSummaryStateSignature({
    phase: "loading",
    systemStatus: DEFAULT_EXECUTIVE_SUMMARY_SYSTEM_STATUS,
    topRisk: loadingField,
    topOpportunity: loadingField,
    recommendedAttention: loadingField,
    objectContext: DEFAULT_EXECUTIVE_SUMMARY_OBJECT_CONTEXT,
  });
  return Object.freeze({
    phase: "loading",
    systemStatus: DEFAULT_EXECUTIVE_SUMMARY_SYSTEM_STATUS,
    topRisk: loadingField,
    topOpportunity: loadingField,
    recommendedAttention: loadingField,
    objectContext: DEFAULT_EXECUTIVE_SUMMARY_OBJECT_CONTEXT,
    revision: rev,
    signature,
  });
}

export function createExecutiveSummaryEmptyState(rev = 0): ExecutiveSummaryState {
  const emptyField = Object.freeze({
    headline: EXECUTIVE_SUMMARY_EMPTY_HEADLINE,
    detail: EXECUTIVE_SUMMARY_EMPTY_DETAIL,
  });
  const signature = buildExecutiveSummaryStateSignature({
    phase: "empty",
    systemStatus: DEFAULT_EXECUTIVE_SUMMARY_SYSTEM_STATUS,
    topRisk: emptyField,
    topOpportunity: emptyField,
    recommendedAttention: emptyField,
    objectContext: DEFAULT_EXECUTIVE_SUMMARY_OBJECT_CONTEXT,
  });
  return Object.freeze({
    phase: "empty",
    systemStatus: DEFAULT_EXECUTIVE_SUMMARY_SYSTEM_STATUS,
    topRisk: emptyField,
    topOpportunity: emptyField,
    recommendedAttention: emptyField,
    objectContext: DEFAULT_EXECUTIVE_SUMMARY_OBJECT_CONTEXT,
    revision: rev,
    signature,
  });
}

export function createExecutiveSummaryDefaultReadyState(rev = 0): ExecutiveSummaryState {
  return Object.freeze({
    ...DEFAULT_EXECUTIVE_SUMMARY_READY_STATE,
    revision: rev,
    signature: buildExecutiveSummaryStateSignature({
      phase: "ready",
      systemStatus: DEFAULT_EXECUTIVE_SUMMARY_READY_STATE.systemStatus,
      topRisk: DEFAULT_EXECUTIVE_SUMMARY_READY_STATE.topRisk,
      topOpportunity: DEFAULT_EXECUTIVE_SUMMARY_READY_STATE.topOpportunity,
      recommendedAttention: DEFAULT_EXECUTIVE_SUMMARY_READY_STATE.recommendedAttention,
      objectContext: DEFAULT_EXECUTIVE_SUMMARY_READY_STATE.objectContext,
    }),
  });
}

function logStateOnce(key: string, detail: Readonly<Record<string, unknown>>): void {
  if (!isDev()) return;
  if (loggedStateKeys.has(key)) return;
  loggedStateKeys.add(key);
  globalThis.console?.debug?.(EXEC_SUMMARY_STATE_TAG, detail);
}

function logRuntimeOnce(key: string, detail: Readonly<Record<string, unknown>>): void {
  if (!isDev()) return;
  if (loggedRuntimeKeys.has(key)) return;
  loggedRuntimeKeys.add(key);
  globalThis.console?.debug?.(EXEC_SUMMARY_RUNTIME_TAG, detail);
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

function validateState(next: ExecutiveSummaryState): string | null {
  const fields = [
    next.topRisk,
    next.topOpportunity,
    next.recommendedAttention,
  ];
  for (const field of fields) {
    if (!field.headline.trim()) return "empty_field_headline";
    if (!field.detail.trim()) return "empty_field_detail";
  }
  if (!next.objectContext.selectedObject.trim()) return "empty_selected_object";
  if (!next.objectContext.objectStatus.trim()) return "empty_object_status";
  if (!next.objectContext.objectPriority.trim()) return "empty_object_priority";
  if (!next.objectContext.objectAttentionLevel.trim()) {
    return "empty_object_attention_level";
  }
  return null;
}

export function getExecutiveSummaryState(): ExecutiveSummaryState {
  return state;
}

export function getExecutiveSummaryStateServerSnapshot(): ExecutiveSummaryState {
  return createExecutiveSummaryLoadingState(0);
}

export function subscribeExecutiveSummaryState(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function publishExecutiveSummaryState(
  input: Partial<Omit<ExecutiveSummaryState, "revision" | "signature">> & {
    phase?: ExecutiveSummaryStatePhase;
  }
): ExecutiveSummaryStatePublishResult {
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
    systemStatus: normalizeSystemStatus(input.systemStatus ?? state.systemStatus),
    topRisk: normalizeField(input.topRisk, state.topRisk),
    topOpportunity: normalizeField(input.topOpportunity, state.topOpportunity),
    recommendedAttention: normalizeField(
      input.recommendedAttention,
      state.recommendedAttention
    ),
    objectContext: normalizeObjectContext(input.objectContext, state.objectContext),
  });

  const signature = buildExecutiveSummaryStateSignature(nextCandidate);
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

  const guardReason = validateState(nextState);
  if (guardReason) {
    logRuntimeOnce(`invalid:${guardReason}`, { signature });
    return Object.freeze({
      changed: false,
      state,
      revision: state.revision,
      guarded: true,
      guardReason,
    });
  }

  revision = nextRevision;
  lastSignature = signature;
  state = nextState;

  logStateOnce(signature, {
    phase: state.phase,
    systemStatus: state.systemStatus,
    revision: nextRevision,
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

export function hydrateExecutiveSummaryStateOnMount(mountKey: string): void {
  publishExecutiveSummaryState({
    phase: "loading",
    topRisk: Object.freeze({
      headline: EXECUTIVE_SUMMARY_LOADING_HEADLINE,
      detail: EXECUTIVE_SUMMARY_LOADING_DETAIL,
    }),
    topOpportunity: Object.freeze({
      headline: EXECUTIVE_SUMMARY_LOADING_HEADLINE,
      detail: EXECUTIVE_SUMMARY_LOADING_DETAIL,
    }),
    recommendedAttention: Object.freeze({
      headline: EXECUTIVE_SUMMARY_LOADING_HEADLINE,
      detail: EXECUTIVE_SUMMARY_LOADING_DETAIL,
    }),
  });
  publishExecutiveSummaryState({
    phase: "ready",
    systemStatus: DEFAULT_EXECUTIVE_SUMMARY_SYSTEM_STATUS,
    topRisk: DEFAULT_EXECUTIVE_SUMMARY_TOP_RISK,
    topOpportunity: DEFAULT_EXECUTIVE_SUMMARY_TOP_OPPORTUNITY,
    recommendedAttention: DEFAULT_EXECUTIVE_SUMMARY_RECOMMENDED_ATTENTION,
    objectContext: state.objectContext,
  });
  logRuntimeOnce(`hydrate:${mountKey}`, {
    action: "workspace_state_hydrated",
    mountKey,
    phase: state.phase,
  });
}

export function resetExecutiveSummaryStateRuntimeForTests(): void {
  revision = 0;
  lastSignature = null;
  publishCount = 0;
  loopGuardWindowStart = 0;
  loopGuardPublishCount = 0;
  loggedRuntimeKeys.clear();
  loggedStateKeys.clear();
  state = createExecutiveSummaryLoadingState(0);
  notifyListeners();
}

/** @internal */
export function getExecutiveSummaryStatePublishCountForTests(): number {
  return publishCount;
}
