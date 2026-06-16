/**
 * MRP:4:8 — Operational workspace runtime state store.
 */

import type {
  OperationalActivityLevel,
  OperationalStatus,
} from "./operationalWorkspaceContract.ts";
import {
  DEFAULT_OPERATIONAL_ACTIVITY_LEVEL,
  DEFAULT_OPERATIONAL_FOCUS,
  DEFAULT_OPERATIONAL_NOTES,
  DEFAULT_OPERATIONAL_READY_STATE,
  DEFAULT_OPERATIONAL_STATUS,
  OPERATIONAL_EMPTY_DETAIL,
  OPERATIONAL_EMPTY_HEADLINE,
  OPERATIONAL_LOADING_DETAIL,
  OPERATIONAL_LOADING_HEADLINE,
  OPERATIONAL_RUNTIME_TAG,
  OPERATIONAL_STATE_TAG,
  type OperationalFieldSnapshot,
  type OperationalWorkspaceState,
  type OperationalWorkspaceStatePhase,
  type OperationalWorkspaceStatePublishResult,
} from "./operationalWorkspaceStateContract.ts";
import {
  DEFAULT_OPERATIONAL_OBJECT_CONTEXT,
  type OperationalObjectContext,
} from "./operationalObjectContextContract.ts";
import {
  buildOperationalObjectContextSignature,
} from "./operationalObjectContextResolver.ts";

const listeners = new Set<() => void>();
const loggedRuntimeKeys = new Set<string>();
const loggedStateKeys = new Set<string>();

let revision = 0;
let lastSignature: string | null = null;
let publishCount = 0;
let loopGuardWindowStart = 0;
let loopGuardPublishCount = 0;

let state: OperationalWorkspaceState = createOperationalLoadingState(0);

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
  value: OperationalFieldSnapshot | undefined,
  fallback: OperationalFieldSnapshot
): OperationalFieldSnapshot {
  return Object.freeze({
    headline: normalizeText(value?.headline, fallback.headline),
    detail: normalizeText(value?.detail, fallback.detail),
  });
}

function normalizeOperationalStatus(value: unknown): OperationalStatus {
  if (value === "healthy" || value === "warning" || value === "critical") {
    return value;
  }
  return DEFAULT_OPERATIONAL_STATUS;
}

function normalizeActivityLevel(value: unknown): OperationalActivityLevel {
  if (value === "low" || value === "medium" || value === "high") {
    return value;
  }
  return DEFAULT_OPERATIONAL_ACTIVITY_LEVEL;
}

function normalizePhase(value: unknown): OperationalWorkspaceStatePhase {
  if (value === "loading" || value === "ready" || value === "empty") {
    return value;
  }
  return "ready";
}

export function buildOperationalWorkspaceStateSignature(input: {
  phase: OperationalWorkspaceStatePhase;
  operationalStatus: OperationalStatus;
  activityLevel: OperationalActivityLevel;
  operationalFocus: OperationalFieldSnapshot;
  operationalNotes: OperationalFieldSnapshot;
  objectContext: OperationalObjectContext;
}): string {
  return JSON.stringify({
    phase: input.phase,
    operationalStatus: input.operationalStatus,
    activityLevel: input.activityLevel,
    operationalFocus: input.operationalFocus,
    operationalNotes: input.operationalNotes,
    objectContext: buildOperationalObjectContextSignature(input.objectContext),
  });
}

function normalizeObjectContext(
  value: OperationalObjectContext | undefined,
  fallback: OperationalObjectContext
): OperationalObjectContext {
  if (!value) return fallback;
  return Object.freeze({
    selectedObjectId: value.selectedObjectId?.trim() || null,
    selectedObject: normalizeText(value.selectedObject, fallback.selectedObject),
    objectOperationalStatus: normalizeText(
      value.objectOperationalStatus,
      fallback.objectOperationalStatus
    ),
    objectActivityLevel: normalizeText(
      value.objectActivityLevel,
      fallback.objectActivityLevel
    ),
    objectAttentionPriority: normalizeText(
      value.objectAttentionPriority,
      fallback.objectAttentionPriority
    ),
    hasSelection: value.hasSelection === true,
  });
}

export function createOperationalLoadingState(rev = 0): OperationalWorkspaceState {
  const loadingField = Object.freeze({
    headline: OPERATIONAL_LOADING_HEADLINE,
    detail: OPERATIONAL_LOADING_DETAIL,
  });
  const signature = buildOperationalWorkspaceStateSignature({
    phase: "loading",
    operationalStatus: DEFAULT_OPERATIONAL_STATUS,
    activityLevel: DEFAULT_OPERATIONAL_ACTIVITY_LEVEL,
    operationalFocus: loadingField,
    operationalNotes: loadingField,
    objectContext: DEFAULT_OPERATIONAL_OBJECT_CONTEXT,
  });
  return Object.freeze({
    phase: "loading",
    operationalStatus: DEFAULT_OPERATIONAL_STATUS,
    activityLevel: DEFAULT_OPERATIONAL_ACTIVITY_LEVEL,
    operationalFocus: loadingField,
    operationalNotes: loadingField,
    objectContext: DEFAULT_OPERATIONAL_OBJECT_CONTEXT,
    revision: rev,
    signature,
  });
}

export function createOperationalEmptyState(rev = 0): OperationalWorkspaceState {
  const emptyField = Object.freeze({
    headline: OPERATIONAL_EMPTY_HEADLINE,
    detail: OPERATIONAL_EMPTY_DETAIL,
  });
  const signature = buildOperationalWorkspaceStateSignature({
    phase: "empty",
    operationalStatus: DEFAULT_OPERATIONAL_STATUS,
    activityLevel: DEFAULT_OPERATIONAL_ACTIVITY_LEVEL,
    operationalFocus: emptyField,
    operationalNotes: emptyField,
    objectContext: DEFAULT_OPERATIONAL_OBJECT_CONTEXT,
  });
  return Object.freeze({
    phase: "empty",
    operationalStatus: DEFAULT_OPERATIONAL_STATUS,
    activityLevel: DEFAULT_OPERATIONAL_ACTIVITY_LEVEL,
    operationalFocus: emptyField,
    operationalNotes: emptyField,
    objectContext: DEFAULT_OPERATIONAL_OBJECT_CONTEXT,
    revision: rev,
    signature,
  });
}

export function createOperationalDefaultReadyState(rev = 0): OperationalWorkspaceState {
  return Object.freeze({
    ...DEFAULT_OPERATIONAL_READY_STATE,
    revision: rev,
    signature: buildOperationalWorkspaceStateSignature({
      phase: "ready",
      operationalStatus: DEFAULT_OPERATIONAL_READY_STATE.operationalStatus,
      activityLevel: DEFAULT_OPERATIONAL_READY_STATE.activityLevel,
      operationalFocus: DEFAULT_OPERATIONAL_READY_STATE.operationalFocus,
      operationalNotes: DEFAULT_OPERATIONAL_READY_STATE.operationalNotes,
      objectContext: DEFAULT_OPERATIONAL_READY_STATE.objectContext,
    }),
  });
}

function logStateOnce(key: string, detail: Readonly<Record<string, unknown>>): void {
  if (!isDev()) return;
  if (loggedStateKeys.has(key)) return;
  loggedStateKeys.add(key);
  globalThis.console?.debug?.(OPERATIONAL_STATE_TAG, detail);
}

function logRuntimeOnce(key: string, detail: Readonly<Record<string, unknown>>): void {
  if (!isDev()) return;
  if (loggedRuntimeKeys.has(key)) return;
  loggedRuntimeKeys.add(key);
  globalThis.console?.debug?.(OPERATIONAL_RUNTIME_TAG, detail);
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

function validateState(next: OperationalWorkspaceState): string | null {
  const fields = [next.operationalFocus, next.operationalNotes];
  for (const field of fields) {
    if (!field.headline.trim()) return "empty_field_headline";
    if (!field.detail.trim()) return "empty_field_detail";
  }
  if (!next.objectContext.selectedObject.trim()) return "empty_selected_object";
  if (!next.objectContext.objectOperationalStatus.trim()) {
    return "empty_object_operational_status";
  }
  if (!next.objectContext.objectActivityLevel.trim()) return "empty_object_activity_level";
  if (!next.objectContext.objectAttentionPriority.trim()) {
    return "empty_object_attention_priority";
  }
  return null;
}

export function getOperationalWorkspaceState(): OperationalWorkspaceState {
  return state;
}

export function getOperationalWorkspaceStateServerSnapshot(): OperationalWorkspaceState {
  return createOperationalLoadingState(0);
}

export function subscribeOperationalWorkspaceState(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function publishOperationalWorkspaceState(
  input: Partial<Omit<OperationalWorkspaceState, "revision" | "signature">> & {
    phase?: OperationalWorkspaceStatePhase;
  }
): OperationalWorkspaceStatePublishResult {
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
    operationalStatus: normalizeOperationalStatus(
      input.operationalStatus ?? state.operationalStatus
    ),
    activityLevel: normalizeActivityLevel(input.activityLevel ?? state.activityLevel),
    operationalFocus: normalizeField(input.operationalFocus, state.operationalFocus),
    operationalNotes: normalizeField(input.operationalNotes, state.operationalNotes),
    objectContext: normalizeObjectContext(input.objectContext, state.objectContext),
  });

  const signature = buildOperationalWorkspaceStateSignature(nextCandidate);
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
    operationalStatus: state.operationalStatus,
    activityLevel: state.activityLevel,
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

export function hydrateOperationalWorkspaceStateOnMount(mountKey: string): void {
  publishOperationalWorkspaceState({
    phase: "loading",
    operationalFocus: Object.freeze({
      headline: OPERATIONAL_LOADING_HEADLINE,
      detail: OPERATIONAL_LOADING_DETAIL,
    }),
    operationalNotes: Object.freeze({
      headline: OPERATIONAL_LOADING_HEADLINE,
      detail: OPERATIONAL_LOADING_DETAIL,
    }),
  });
  publishOperationalWorkspaceState({
    phase: "ready",
    operationalStatus: DEFAULT_OPERATIONAL_STATUS,
    activityLevel: DEFAULT_OPERATIONAL_ACTIVITY_LEVEL,
    operationalFocus: DEFAULT_OPERATIONAL_FOCUS,
    operationalNotes: DEFAULT_OPERATIONAL_NOTES,
    objectContext: state.objectContext,
  });
  logRuntimeOnce(`hydrate:${mountKey}`, {
    action: "workspace_state_hydrated",
    mountKey,
    phase: state.phase,
  });
}

export function resetOperationalWorkspaceStateRuntimeForTests(): void {
  revision = 0;
  lastSignature = null;
  publishCount = 0;
  loopGuardWindowStart = 0;
  loopGuardPublishCount = 0;
  loggedRuntimeKeys.clear();
  loggedStateKeys.clear();
  state = createOperationalLoadingState(0);
  notifyListeners();
}

/** @internal */
export function getOperationalWorkspaceStatePublishCountForTests(): number {
  return publishCount;
}
