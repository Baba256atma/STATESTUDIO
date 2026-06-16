/**
 * MRP:4F:1 / 4F:2 — War Room workspace runtime state store.
 */

import { hydrateWarRoomStateOnMount } from "./warRoomStateRuntime.ts";

import {
  DEFAULT_ACTION_PLAN,
  DEFAULT_ACTIVE_DECISION,
  DEFAULT_DECISION_STATUS,
  DEFAULT_STRATEGY_SUMMARY,
  DEFAULT_WATCH_LIST,
  DEFAULT_WAR_ROOM_READY_STATE,
  WAR_ROOM_EMPTY_DETAIL,
  WAR_ROOM_EMPTY_HEADLINE,
  WAR_ROOM_LOADING_DETAIL,
  WAR_ROOM_LOADING_HEADLINE,
  WAR_ROOM_RUNTIME_TAG,
  WAR_ROOM_STATE_TAG,
  type WarRoomFieldSnapshot,
  type WarRoomWorkspaceState,
  type WarRoomWorkspaceStatePhase,
  type WarRoomWorkspaceStatePublishResult,
} from "./warRoomWorkspaceStateContract.ts";
import {
  DEFAULT_WAR_ROOM_ACTION_PLAN_LAYER,
  type WarRoomActionPlanLayer,
} from "./warRoomActionPlanContract.ts";
import { buildWarRoomActionPlanSignature } from "./warRoomActionPlanResolver.ts";
import {
  DEFAULT_WAR_ROOM_MONITORING_LAYER,
  type WarRoomMonitoringLayer,
} from "./warRoomMonitoringContract.ts";
import { buildWarRoomMonitoringSignature } from "./warRoomMonitoringResolver.ts";
import {
  DEFAULT_WAR_ROOM_WORKSPACE_CONTEXT,
  type WarRoomWorkspaceContext,
} from "./warRoomWorkspaceContextContract.ts";
import { buildWarRoomWorkspaceContextSignature } from "./warRoomWorkspaceContextResolver.ts";

const listeners = new Set<() => void>();
const loggedRuntimeKeys = new Set<string>();
const loggedStateKeys = new Set<string>();

let revision = 0;
let lastSignature: string | null = null;
let publishCount = 0;
let loopGuardWindowStart = 0;
let loopGuardPublishCount = 0;

let state: WarRoomWorkspaceState = createWarRoomLoadingState(0);

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
  value: WarRoomFieldSnapshot | undefined,
  fallback: WarRoomFieldSnapshot
): WarRoomFieldSnapshot {
  return Object.freeze({
    headline: normalizeText(value?.headline, fallback.headline),
    detail: normalizeText(value?.detail, fallback.detail),
  });
}

function normalizePhase(value: unknown): WarRoomWorkspaceStatePhase {
  if (value === "loading" || value === "ready" || value === "empty") {
    return value;
  }
  return "ready";
}

function normalizeWorkspaceContext(
  value: WarRoomWorkspaceContext | undefined,
  fallback: WarRoomWorkspaceContext
): WarRoomWorkspaceContext {
  if (!value) return fallback;
  return Object.freeze({
    selectedObjectId: value.selectedObjectId?.trim() || null,
    selectedObject: normalizeText(value.selectedObject, fallback.selectedObject),
    strategyFocus: normalizeText(value.strategyFocus, fallback.strategyFocus),
    activeDecision: normalizeText(value.activeDecision, fallback.activeDecision),
    commitmentStatus: normalizeText(value.commitmentStatus, fallback.commitmentStatus),
    hasSelection: value.hasSelection === true,
  });
}

function normalizeActionPlanLayer(
  value: WarRoomActionPlanLayer | undefined,
  fallback: WarRoomActionPlanLayer
): WarRoomActionPlanLayer {
  if (!value) return fallback;
  return Object.freeze({
    sections: Object.freeze([...value.sections]),
    executionPlanningOwned: true as const,
  });
}

function normalizeMonitoringLayer(
  value: WarRoomMonitoringLayer | undefined,
  fallback: WarRoomMonitoringLayer
): WarRoomMonitoringLayer {
  if (!value) return fallback;
  return Object.freeze({
    watchItems: Object.freeze([...value.watchItems]),
    alerts: Object.freeze([...value.alerts]),
    decisionHealth: Object.freeze([...value.decisionHealth]),
    escalationIndicators: Object.freeze([...value.escalationIndicators]),
    executionTrackingOwned: true as const,
  });
}

export function buildWarRoomWorkspaceStateSignature(input: {
  phase: WarRoomWorkspaceStatePhase;
  workspaceContext: WarRoomWorkspaceContext;
  actionPlanLayer: WarRoomActionPlanLayer;
  monitoringLayer: WarRoomMonitoringLayer;
  strategySummary: WarRoomFieldSnapshot;
  activeDecision: WarRoomFieldSnapshot;
  actionPlan: WarRoomFieldSnapshot;
  watchList: WarRoomFieldSnapshot;
  decisionStatus: WarRoomFieldSnapshot;
}): string {
  return JSON.stringify({
    phase: input.phase,
    workspaceContext: buildWarRoomWorkspaceContextSignature(input.workspaceContext),
    actionPlanLayer: buildWarRoomActionPlanSignature(input.actionPlanLayer),
    monitoringLayer: buildWarRoomMonitoringSignature(input.monitoringLayer),
    strategySummary: input.strategySummary,
    activeDecision: input.activeDecision,
    actionPlan: input.actionPlan,
    watchList: input.watchList,
    decisionStatus: input.decisionStatus,
  });
}

export function createWarRoomLoadingState(rev = 0): WarRoomWorkspaceState {
  const loadingField = Object.freeze({
    headline: WAR_ROOM_LOADING_HEADLINE,
    detail: WAR_ROOM_LOADING_DETAIL,
  });
  const signature = buildWarRoomWorkspaceStateSignature({
    phase: "loading",
    workspaceContext: DEFAULT_WAR_ROOM_WORKSPACE_CONTEXT,
    actionPlanLayer: DEFAULT_WAR_ROOM_ACTION_PLAN_LAYER,
    monitoringLayer: DEFAULT_WAR_ROOM_MONITORING_LAYER,
    strategySummary: loadingField,
    activeDecision: loadingField,
    actionPlan: loadingField,
    watchList: loadingField,
    decisionStatus: loadingField,
  });
  return Object.freeze({
    phase: "loading",
    workspaceContext: DEFAULT_WAR_ROOM_WORKSPACE_CONTEXT,
    actionPlanLayer: DEFAULT_WAR_ROOM_ACTION_PLAN_LAYER,
    actionPlanExecutionOwned: true,
    monitoringLayer: DEFAULT_WAR_ROOM_MONITORING_LAYER,
    monitoringExecutionTracked: true,
    strategySummary: loadingField,
    activeDecision: loadingField,
    actionPlan: loadingField,
    watchList: loadingField,
    decisionStatus: loadingField,
    revision: rev,
    signature,
  });
}

export function createWarRoomEmptyState(rev = 0): WarRoomWorkspaceState {
  const emptyField = Object.freeze({
    headline: WAR_ROOM_EMPTY_HEADLINE,
    detail: WAR_ROOM_EMPTY_DETAIL,
  });
  const signature = buildWarRoomWorkspaceStateSignature({
    phase: "empty",
    workspaceContext: DEFAULT_WAR_ROOM_WORKSPACE_CONTEXT,
    actionPlanLayer: DEFAULT_WAR_ROOM_ACTION_PLAN_LAYER,
    monitoringLayer: DEFAULT_WAR_ROOM_MONITORING_LAYER,
    strategySummary: emptyField,
    activeDecision: emptyField,
    actionPlan: emptyField,
    watchList: emptyField,
    decisionStatus: emptyField,
  });
  return Object.freeze({
    phase: "empty",
    workspaceContext: DEFAULT_WAR_ROOM_WORKSPACE_CONTEXT,
    actionPlanLayer: DEFAULT_WAR_ROOM_ACTION_PLAN_LAYER,
    actionPlanExecutionOwned: true,
    monitoringLayer: DEFAULT_WAR_ROOM_MONITORING_LAYER,
    monitoringExecutionTracked: true,
    strategySummary: emptyField,
    activeDecision: emptyField,
    actionPlan: emptyField,
    watchList: emptyField,
    decisionStatus: emptyField,
    revision: rev,
    signature,
  });
}

function logStateOnce(key: string, detail: Readonly<Record<string, unknown>>): void {
  if (!isDev()) return;
  if (loggedStateKeys.has(key)) return;
  loggedStateKeys.add(key);
  globalThis.console?.debug?.(WAR_ROOM_STATE_TAG, detail);
}

function logRuntimeOnce(key: string, detail: Readonly<Record<string, unknown>>): void {
  if (!isDev()) return;
  if (loggedRuntimeKeys.has(key)) return;
  loggedRuntimeKeys.add(key);
  globalThis.console?.debug?.(WAR_ROOM_RUNTIME_TAG, detail);
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

function validateState(next: WarRoomWorkspaceState): string | null {
  const fields = [
    next.strategySummary,
    next.activeDecision,
    next.actionPlan,
    next.watchList,
    next.decisionStatus,
  ];
  for (const field of fields) {
    if (!field.headline.trim()) return "empty_field_headline";
    if (!field.detail.trim()) return "empty_field_detail";
  }
  if (!next.workspaceContext.selectedObject.trim()) return "empty_selected_object";
  if (!next.workspaceContext.strategyFocus.trim()) return "empty_strategy_focus";
  if (!next.workspaceContext.activeDecision.trim()) return "empty_active_decision";
  if (!next.workspaceContext.commitmentStatus.trim()) return "empty_commitment_status";
  return null;
}

export function getWarRoomWorkspaceState(): WarRoomWorkspaceState {
  return state;
}

export function getWarRoomWorkspaceStateServerSnapshot(): WarRoomWorkspaceState {
  return createWarRoomLoadingState(0);
}

export function subscribeWarRoomWorkspaceState(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function publishWarRoomWorkspaceState(
  input: Partial<Omit<WarRoomWorkspaceState, "revision" | "signature">> & {
    phase?: WarRoomWorkspaceStatePhase;
  }
): WarRoomWorkspaceStatePublishResult {
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
    actionPlanLayer: normalizeActionPlanLayer(input.actionPlanLayer, state.actionPlanLayer),
    actionPlanExecutionOwned: true as const,
    monitoringLayer: normalizeMonitoringLayer(input.monitoringLayer, state.monitoringLayer),
    monitoringExecutionTracked: true as const,
    strategySummary: normalizeField(input.strategySummary, state.strategySummary),
    activeDecision: normalizeField(input.activeDecision, state.activeDecision),
    actionPlan: normalizeField(input.actionPlan, state.actionPlan),
    watchList: normalizeField(input.watchList, state.watchList),
    decisionStatus: normalizeField(input.decisionStatus, state.decisionStatus),
  });

  const signature = buildWarRoomWorkspaceStateSignature(nextCandidate);
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

export function hydrateWarRoomWorkspaceStateOnMount(mountKey: string): void {
  publishWarRoomWorkspaceState({
    phase: "loading",
    strategySummary: Object.freeze({
      headline: WAR_ROOM_LOADING_HEADLINE,
      detail: WAR_ROOM_LOADING_DETAIL,
    }),
    activeDecision: Object.freeze({
      headline: WAR_ROOM_LOADING_HEADLINE,
      detail: WAR_ROOM_LOADING_DETAIL,
    }),
    actionPlan: Object.freeze({
      headline: WAR_ROOM_LOADING_HEADLINE,
      detail: WAR_ROOM_LOADING_DETAIL,
    }),
    watchList: Object.freeze({
      headline: WAR_ROOM_LOADING_HEADLINE,
      detail: WAR_ROOM_LOADING_DETAIL,
    }),
    decisionStatus: Object.freeze({
      headline: WAR_ROOM_LOADING_HEADLINE,
      detail: WAR_ROOM_LOADING_DETAIL,
    }),
  });
  hydrateWarRoomStateOnMount(mountKey);
  logRuntimeOnce(`hydrate:${mountKey}`, {
    action: "workspace_state_hydrated",
    mountKey,
    phase: state.phase,
  });
}

export function resetWarRoomWorkspaceStateRuntimeForTests(): void {
  revision = 0;
  lastSignature = null;
  publishCount = 0;
  loopGuardWindowStart = 0;
  loopGuardPublishCount = 0;
  loggedRuntimeKeys.clear();
  loggedStateKeys.clear();
  state = createWarRoomLoadingState(0);
  notifyListeners();
}

/** @internal */
export function getWarRoomWorkspaceStatePublishCountForTests(): number {
  return publishCount;
}

/** @internal */
export function getWarRoomDefaultReadyStateForTests(): WarRoomWorkspaceState {
  return Object.freeze({
    ...DEFAULT_WAR_ROOM_READY_STATE,
    revision: 0,
    signature: buildWarRoomWorkspaceStateSignature({
      phase: "ready",
      workspaceContext: DEFAULT_WAR_ROOM_READY_STATE.workspaceContext,
      actionPlanLayer: DEFAULT_WAR_ROOM_READY_STATE.actionPlanLayer,
      monitoringLayer: DEFAULT_WAR_ROOM_READY_STATE.monitoringLayer,
      strategySummary: DEFAULT_WAR_ROOM_READY_STATE.strategySummary,
      activeDecision: DEFAULT_WAR_ROOM_READY_STATE.activeDecision,
      actionPlan: DEFAULT_WAR_ROOM_READY_STATE.actionPlan,
      watchList: DEFAULT_WAR_ROOM_READY_STATE.watchList,
      decisionStatus: DEFAULT_WAR_ROOM_READY_STATE.decisionStatus,
    }),
  });
}
