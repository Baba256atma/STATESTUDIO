/**
 * MRP:4D:1 / 4D:2 — Timeline workspace runtime state store.
 */

import {
  DEFAULT_DECISION_HISTORY,
  DEFAULT_IMPORTANT_CHANGES,
  DEFAULT_RECENT_EVENTS,
  DEFAULT_RISK_EVOLUTION,
  DEFAULT_TIMELINE_READY_STATE,
  DEFAULT_TIMELINE_SUMMARY,
  TIMELINE_EMPTY_DETAIL,
  TIMELINE_EMPTY_HEADLINE,
  TIMELINE_LOADING_DETAIL,
  TIMELINE_LOADING_HEADLINE,
  TIMELINE_RUNTIME_TAG,
  TIMELINE_STATE_TAG,
  type TimelineFieldSnapshot,
  type TimelineWorkspaceState,
  type TimelineWorkspaceStatePhase,
  type TimelineWorkspaceStatePublishResult,
} from "./timelineWorkspaceStateContract.ts";
import { DEFAULT_TIMELINE_WORKSPACE_METRICS } from "./timelineWorkspaceMetricsContract.ts";
import {
  DEFAULT_TIMELINE_OBJECT_CONTEXT,
  type TimelineObjectContext,
} from "./timelineObjectContextContract.ts";
import {
  DEFAULT_TIMELINE_SCENE_COVERAGE,
  type TimelineSceneCoverage,
} from "./timelineSceneAwarenessContract.ts";
import { buildTimelineObjectContextSignature } from "./timelineObjectContextResolver.ts";
import type {
  TimelineDecisionHistoryRow,
  TimelineRecentEventRow,
} from "./timelineVisualSurfaceContract.ts";

const listeners = new Set<() => void>();
const loggedRuntimeKeys = new Set<string>();
const loggedStateKeys = new Set<string>();

let revision = 0;
let lastSignature: string | null = null;
let publishCount = 0;
let loopGuardWindowStart = 0;
let loopGuardPublishCount = 0;

let state: TimelineWorkspaceState = createTimelineLoadingState(0);

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

function normalizeCount(value: unknown, fallback = 0): number {
  if (typeof value !== "number" || !Number.isFinite(value)) return fallback;
  return Math.max(0, Math.floor(value));
}

function normalizeTimestamp(value: unknown, fallback = 0): number {
  if (typeof value !== "number" || !Number.isFinite(value)) return fallback;
  return Math.max(0, Math.floor(value));
}

function normalizeField(
  value: TimelineFieldSnapshot | undefined,
  fallback: TimelineFieldSnapshot
): TimelineFieldSnapshot {
  return Object.freeze({
    headline: normalizeText(value?.headline, fallback.headline),
    detail: normalizeText(value?.detail, fallback.detail),
  });
}

function normalizePhase(value: unknown): TimelineWorkspaceStatePhase {
  if (value === "loading" || value === "ready" || value === "empty") {
    return value;
  }
  return "ready";
}

function normalizeMetrics(
  input: Partial<TimelineWorkspaceState> | undefined,
  fallback: TimelineWorkspaceState
): Pick<
  TimelineWorkspaceState,
  | "selectedObjectId"
  | "totalEvents"
  | "recentEventCount"
  | "decisionEventCount"
  | "riskEventCount"
  | "lastEventAt"
> {
  const selectedObjectId =
    input?.selectedObjectId !== undefined
      ? input.selectedObjectId?.trim() || null
      : fallback.selectedObjectId;
  return Object.freeze({
    selectedObjectId,
    totalEvents: normalizeCount(input?.totalEvents, fallback.totalEvents),
    recentEventCount: normalizeCount(input?.recentEventCount, fallback.recentEventCount),
    decisionEventCount: normalizeCount(input?.decisionEventCount, fallback.decisionEventCount),
    riskEventCount: normalizeCount(input?.riskEventCount, fallback.riskEventCount),
    lastEventAt: normalizeTimestamp(input?.lastEventAt, fallback.lastEventAt),
  });
}

function normalizeObjectContext(
  value: TimelineObjectContext | undefined,
  fallback: TimelineObjectContext
): TimelineObjectContext {
  if (!value) return fallback;
  return Object.freeze({
    selectedObjectId: value.selectedObjectId?.trim() || null,
    selectedObject: normalizeText(value.selectedObject, fallback.selectedObject),
    lastActivity: normalizeText(value.lastActivity, fallback.lastActivity),
    lastChange: normalizeText(value.lastChange, fallback.lastChange),
    recentEventsCount: normalizeText(value.recentEventsCount, fallback.recentEventsCount),
    hasSelection: Boolean(value.hasSelection),
  });
}

function normalizeRecentEventRows(
  value: readonly TimelineRecentEventRow[] | undefined,
  fallback: readonly TimelineRecentEventRow[]
): readonly TimelineRecentEventRow[] {
  if (!value) return fallback;
  return Object.freeze(
    value.map((row) =>
      Object.freeze({
        time: normalizeText(row.time, "—"),
        event: normalizeText(row.event, "Timeline event"),
        category: normalizeText(row.category, "Workspace"),
      })
    )
  );
}

function normalizeDecisionHistoryRows(
  value: readonly TimelineDecisionHistoryRow[] | undefined,
  fallback: readonly TimelineDecisionHistoryRow[]
): readonly TimelineDecisionHistoryRow[] {
  if (!value) return fallback;
  return Object.freeze(
    value.map((row) =>
      Object.freeze({
        decision: normalizeText(row.decision, "Decision checkpoint"),
        date: normalizeText(row.date, "—"),
        status: normalizeText(row.status, "Recorded"),
      })
    )
  );
}

function normalizeSceneCoverage(
  value: TimelineSceneCoverage | undefined,
  fallback: TimelineSceneCoverage
): TimelineSceneCoverage {
  if (!value) return fallback;
  return Object.freeze({
    objectsTracked: normalizeCount(value.objectsTracked, fallback.objectsTracked),
    objectsWithEvents: normalizeCount(value.objectsWithEvents, fallback.objectsWithEvents),
    recentEvents: normalizeCount(value.recentEvents, fallback.recentEvents),
  });
}

export function buildTimelineWorkspaceStateSignature(input: {
  phase: TimelineWorkspaceStatePhase;
  selectedObjectId: string | null;
  totalEvents: number;
  recentEventCount: number;
  decisionEventCount: number;
  riskEventCount: number;
  lastEventAt: number;
  objectContext: TimelineObjectContext;
  recentEventRows: readonly TimelineRecentEventRow[];
  decisionHistoryRows: readonly TimelineDecisionHistoryRow[];
  sceneCoverage: TimelineSceneCoverage;
  sceneAwarenessReadOnly: true;
  timelineSummary: TimelineFieldSnapshot;
  recentEvents: TimelineFieldSnapshot;
  importantChanges: TimelineFieldSnapshot;
  decisionHistory: TimelineFieldSnapshot;
  riskEvolution: TimelineFieldSnapshot;
}): string {
  return JSON.stringify({
    phase: input.phase,
    selectedObjectId: input.selectedObjectId,
    totalEvents: input.totalEvents,
    recentEventCount: input.recentEventCount,
    decisionEventCount: input.decisionEventCount,
    riskEventCount: input.riskEventCount,
    lastEventAt: input.lastEventAt,
    objectContext: buildTimelineObjectContextSignature(input.objectContext),
    recentEventRows: input.recentEventRows,
    decisionHistoryRows: input.decisionHistoryRows,
    sceneCoverage: input.sceneCoverage,
    sceneAwarenessReadOnly: input.sceneAwarenessReadOnly,
    timelineSummary: input.timelineSummary,
    recentEvents: input.recentEvents,
    importantChanges: input.importantChanges,
    decisionHistory: input.decisionHistory,
    riskEvolution: input.riskEvolution,
  });
}

export function createTimelineLoadingState(rev = 0): TimelineWorkspaceState {
  const loadingField = Object.freeze({
    headline: TIMELINE_LOADING_HEADLINE,
    detail: TIMELINE_LOADING_DETAIL,
  });
  const metrics = Object.freeze({
    ...DEFAULT_TIMELINE_WORKSPACE_METRICS,
    lastEventAt: 0,
  });
  const signature = buildTimelineWorkspaceStateSignature({
    phase: "loading",
    ...metrics,
    objectContext: DEFAULT_TIMELINE_OBJECT_CONTEXT,
    recentEventRows: Object.freeze([]),
    decisionHistoryRows: Object.freeze([]),
    sceneCoverage: DEFAULT_TIMELINE_SCENE_COVERAGE,
    sceneAwarenessReadOnly: true,
    timelineSummary: loadingField,
    recentEvents: loadingField,
    importantChanges: loadingField,
    decisionHistory: loadingField,
    riskEvolution: loadingField,
  });
  return Object.freeze({
    phase: "loading",
    ...metrics,
    objectContext: DEFAULT_TIMELINE_OBJECT_CONTEXT,
    recentEventRows: Object.freeze([]),
    decisionHistoryRows: Object.freeze([]),
    sceneCoverage: DEFAULT_TIMELINE_SCENE_COVERAGE,
    sceneAwarenessReadOnly: true,
    timelineSummary: loadingField,
    recentEvents: loadingField,
    importantChanges: loadingField,
    decisionHistory: loadingField,
    riskEvolution: loadingField,
    revision: rev,
    signature,
  });
}

function logStateOnce(key: string, detail: Readonly<Record<string, unknown>>): void {
  if (!isDev()) return;
  if (loggedStateKeys.has(key)) return;
  loggedStateKeys.add(key);
  globalThis.console?.debug?.(TIMELINE_STATE_TAG, detail);
}

function logRuntimeOnce(key: string, detail: Readonly<Record<string, unknown>>): void {
  if (!isDev()) return;
  if (loggedRuntimeKeys.has(key)) return;
  loggedRuntimeKeys.add(key);
  globalThis.console?.debug?.(TIMELINE_RUNTIME_TAG, detail);
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

export function getTimelineWorkspaceState(): TimelineWorkspaceState {
  return state;
}

export function getTimelineWorkspaceStateServerSnapshot(): TimelineWorkspaceState {
  return createTimelineLoadingState(0);
}

export function subscribeTimelineWorkspaceState(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function publishTimelineWorkspaceState(
  input: Partial<Omit<TimelineWorkspaceState, "revision" | "signature">> & {
    phase?: TimelineWorkspaceStatePhase;
  }
): TimelineWorkspaceStatePublishResult {
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

  const metrics = normalizeMetrics(input, state);
  const nextCandidate = Object.freeze({
    phase: normalizePhase(input.phase ?? state.phase),
    ...metrics,
    objectContext: normalizeObjectContext(input.objectContext, state.objectContext),
    recentEventRows: normalizeRecentEventRows(input.recentEventRows, state.recentEventRows),
    decisionHistoryRows: normalizeDecisionHistoryRows(
      input.decisionHistoryRows,
      state.decisionHistoryRows
    ),
    sceneCoverage: normalizeSceneCoverage(input.sceneCoverage, state.sceneCoverage),
    sceneAwarenessReadOnly: true,
    timelineSummary: normalizeField(input.timelineSummary, state.timelineSummary),
    recentEvents: normalizeField(input.recentEvents, state.recentEvents),
    importantChanges: normalizeField(input.importantChanges, state.importantChanges),
    decisionHistory: normalizeField(input.decisionHistory, state.decisionHistory),
    riskEvolution: normalizeField(input.riskEvolution, state.riskEvolution),
  });

  const signature = buildTimelineWorkspaceStateSignature(nextCandidate);
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

  logStateOnce(signature, { phase: state.phase, revision: nextRevision });
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

export function hydrateTimelineWorkspaceStateOnMount(mountKey: string): void {
  const loadingField = Object.freeze({
    headline: TIMELINE_LOADING_HEADLINE,
    detail: TIMELINE_LOADING_DETAIL,
  });
  publishTimelineWorkspaceState({
    phase: "loading",
    timelineSummary: loadingField,
    recentEvents: loadingField,
    importantChanges: loadingField,
    decisionHistory: loadingField,
    riskEvolution: loadingField,
  });
  publishTimelineWorkspaceState({
    phase: "ready",
    timelineSummary: DEFAULT_TIMELINE_SUMMARY,
    recentEvents: DEFAULT_RECENT_EVENTS,
    importantChanges: DEFAULT_IMPORTANT_CHANGES,
    decisionHistory: DEFAULT_DECISION_HISTORY,
    riskEvolution: DEFAULT_RISK_EVOLUTION,
  });
  logRuntimeOnce(`hydrate:${mountKey}`, {
    action: "workspace_state_hydrated",
    mountKey,
    phase: state.phase,
  });
}

export function getTimelineWorkspaceStatePublishCountForTests(): number {
  return publishCount;
}

export function resetTimelineWorkspaceStateRuntimeForTests(): void {
  revision = 0;
  lastSignature = null;
  publishCount = 0;
  loopGuardWindowStart = 0;
  loopGuardPublishCount = 0;
  loggedRuntimeKeys.clear();
  loggedStateKeys.clear();
  state = createTimelineLoadingState(0);
  notifyListeners();
}
