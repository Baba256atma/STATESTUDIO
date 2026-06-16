/**
 * MRP:4C:1 / 4C:2 — Risk workspace runtime state store.
 */

import {
  DEFAULT_RECOMMENDED_MONITORING,
  DEFAULT_RISK_DRIVERS,
  DEFAULT_RISK_READY_STATE,
  DEFAULT_RISK_SUMMARY,
  DEFAULT_TOP_RISKS,
  RISK_EMPTY_DETAIL,
  RISK_EMPTY_HEADLINE,
  RISK_LOADING_DETAIL,
  RISK_LOADING_HEADLINE,
  RISK_RUNTIME_TAG,
  RISK_STATE_TAG,
  type RiskFieldSnapshot,
  type RiskWorkspaceState,
  type RiskWorkspaceStatePhase,
  type RiskWorkspaceStatePublishResult,
} from "./riskWorkspaceStateContract.ts";
import { DEFAULT_RISK_WORKSPACE_METRICS } from "./riskWorkspaceMetricsContract.ts";
import {
  DEFAULT_RISK_OBJECT_CONTEXT,
  type RiskObjectContext,
} from "./riskObjectContextContract.ts";
import { buildRiskObjectContextSignature } from "./riskObjectContextResolver.ts";
import type { RiskTopRiskRow } from "./riskVisualSurfaceContract.ts";
import {
  DEFAULT_RISK_SCENE_COVERAGE,
  type RiskSceneCoverage,
} from "./riskSceneAwarenessContract.ts";

const listeners = new Set<() => void>();
const loggedRuntimeKeys = new Set<string>();
const loggedStateKeys = new Set<string>();

let revision = 0;
let lastSignature: string | null = null;
let publishCount = 0;
let loopGuardWindowStart = 0;
let loopGuardPublishCount = 0;

let state: RiskWorkspaceState = createRiskLoadingState(0);

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
  value: RiskFieldSnapshot | undefined,
  fallback: RiskFieldSnapshot
): RiskFieldSnapshot {
  return Object.freeze({
    headline: normalizeText(value?.headline, fallback.headline),
    detail: normalizeText(value?.detail, fallback.detail),
  });
}

function normalizePhase(value: unknown): RiskWorkspaceStatePhase {
  if (value === "loading" || value === "ready" || value === "empty") {
    return value;
  }
  return "ready";
}

function normalizeMetrics(
  input: Partial<RiskWorkspaceState> | undefined,
  fallback: RiskWorkspaceState
): Pick<
  RiskWorkspaceState,
  | "selectedObjectId"
  | "riskCount"
  | "elevatedRiskCount"
  | "criticalRiskCount"
  | "dominantRiskCategory"
  | "lastUpdatedAt"
> {
  const selectedObjectId =
    input?.selectedObjectId !== undefined
      ? input.selectedObjectId?.trim() || null
      : fallback.selectedObjectId;
  return Object.freeze({
    selectedObjectId,
    riskCount: normalizeCount(input?.riskCount, fallback.riskCount),
    elevatedRiskCount: normalizeCount(input?.elevatedRiskCount, fallback.elevatedRiskCount),
    criticalRiskCount: normalizeCount(input?.criticalRiskCount, fallback.criticalRiskCount),
    dominantRiskCategory: normalizeText(
      input?.dominantRiskCategory,
      fallback.dominantRiskCategory
    ),
    lastUpdatedAt: normalizeTimestamp(input?.lastUpdatedAt, fallback.lastUpdatedAt),
  });
}

function normalizeObjectContext(
  value: RiskObjectContext | undefined,
  fallback: RiskObjectContext
): RiskObjectContext {
  if (!value) return fallback;
  return Object.freeze({
    selectedObjectId: value.selectedObjectId?.trim() || null,
    selectedObject: normalizeText(value.selectedObject, fallback.selectedObject),
    riskStatus: normalizeText(value.riskStatus, fallback.riskStatus),
    impact: normalizeText(value.impact, fallback.impact),
    confidence: normalizeText(value.confidence, fallback.confidence),
    hasSelection: Boolean(value.hasSelection),
  });
}

function normalizeTopRiskRows(
  value: readonly RiskTopRiskRow[] | undefined,
  fallback: readonly RiskTopRiskRow[]
): readonly RiskTopRiskRow[] {
  if (!value) return fallback;
  return Object.freeze(
    value.map((row) =>
      Object.freeze({
        risk: normalizeText(row.risk, "Unknown risk"),
        severity: normalizeText(row.severity, "Unknown"),
        impact: normalizeText(row.impact, "Local scope"),
      })
    )
  );
}

function normalizeSceneCoverage(
  value: RiskSceneCoverage | undefined,
  fallback: RiskSceneCoverage
): RiskSceneCoverage {
  if (!value) return fallback;
  return Object.freeze({
    objectsMonitored: normalizeCount(value.objectsMonitored, fallback.objectsMonitored),
    objectsWithRisk: normalizeCount(value.objectsWithRisk, fallback.objectsWithRisk),
    criticalObjects: normalizeCount(value.criticalObjects, fallback.criticalObjects),
  });
}

export function buildRiskWorkspaceStateSignature(input: {
  phase: RiskWorkspaceStatePhase;
  selectedObjectId: string | null;
  riskCount: number;
  elevatedRiskCount: number;
  criticalRiskCount: number;
  dominantRiskCategory: string;
  lastUpdatedAt: number;
  topRiskRows: readonly RiskTopRiskRow[];
  sceneCoverage: RiskSceneCoverage;
  sceneAwarenessReadOnly: true;
  objectContext: RiskObjectContext;
  riskSummary: RiskFieldSnapshot;
  topRisks: RiskFieldSnapshot;
  riskDrivers: RiskFieldSnapshot;
  recommendedMonitoring: RiskFieldSnapshot;
}): string {
  return JSON.stringify({
    phase: input.phase,
    selectedObjectId: input.selectedObjectId,
    riskCount: input.riskCount,
    elevatedRiskCount: input.elevatedRiskCount,
    criticalRiskCount: input.criticalRiskCount,
    dominantRiskCategory: input.dominantRiskCategory,
    lastUpdatedAt: input.lastUpdatedAt,
    topRiskRows: input.topRiskRows,
    sceneCoverage: input.sceneCoverage,
    sceneAwarenessReadOnly: input.sceneAwarenessReadOnly,
    objectContext: buildRiskObjectContextSignature(input.objectContext),
    riskSummary: input.riskSummary,
    topRisks: input.topRisks,
    riskDrivers: input.riskDrivers,
    recommendedMonitoring: input.recommendedMonitoring,
  });
}

export function createRiskLoadingState(rev = 0): RiskWorkspaceState {
  const loadingField = Object.freeze({
    headline: RISK_LOADING_HEADLINE,
    detail: RISK_LOADING_DETAIL,
  });
  const metrics = Object.freeze({
    ...DEFAULT_RISK_WORKSPACE_METRICS,
    lastUpdatedAt: 0,
  });
  const signature = buildRiskWorkspaceStateSignature({
    phase: "loading",
    ...metrics,
    topRiskRows: Object.freeze([]),
    sceneCoverage: DEFAULT_RISK_SCENE_COVERAGE,
    sceneAwarenessReadOnly: true,
    objectContext: DEFAULT_RISK_OBJECT_CONTEXT,
    riskSummary: loadingField,
    topRisks: loadingField,
    riskDrivers: loadingField,
    recommendedMonitoring: loadingField,
  });
  return Object.freeze({
    phase: "loading",
    ...metrics,
    topRiskRows: Object.freeze([]),
    sceneCoverage: DEFAULT_RISK_SCENE_COVERAGE,
    sceneAwarenessReadOnly: true,
    objectContext: DEFAULT_RISK_OBJECT_CONTEXT,
    riskSummary: loadingField,
    topRisks: loadingField,
    riskDrivers: loadingField,
    recommendedMonitoring: loadingField,
    revision: rev,
    signature,
  });
}

function logStateOnce(key: string, detail: Readonly<Record<string, unknown>>): void {
  if (!isDev()) return;
  if (loggedStateKeys.has(key)) return;
  loggedStateKeys.add(key);
  globalThis.console?.debug?.(RISK_STATE_TAG, detail);
}

function logRuntimeOnce(key: string, detail: Readonly<Record<string, unknown>>): void {
  if (!isDev()) return;
  if (loggedRuntimeKeys.has(key)) return;
  loggedRuntimeKeys.add(key);
  globalThis.console?.debug?.(RISK_RUNTIME_TAG, detail);
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

export function getRiskWorkspaceState(): RiskWorkspaceState {
  return state;
}

export function getRiskWorkspaceStateServerSnapshot(): RiskWorkspaceState {
  return createRiskLoadingState(0);
}

export function subscribeRiskWorkspaceState(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function publishRiskWorkspaceState(
  input: Partial<Omit<RiskWorkspaceState, "revision" | "signature">> & {
    phase?: RiskWorkspaceStatePhase;
  }
): RiskWorkspaceStatePublishResult {
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
    topRiskRows: normalizeTopRiskRows(input.topRiskRows, state.topRiskRows),
    sceneCoverage: normalizeSceneCoverage(input.sceneCoverage, state.sceneCoverage),
    sceneAwarenessReadOnly: true,
    objectContext: normalizeObjectContext(input.objectContext, state.objectContext),
    riskSummary: normalizeField(input.riskSummary, state.riskSummary),
    topRisks: normalizeField(input.topRisks, state.topRisks),
    riskDrivers: normalizeField(input.riskDrivers, state.riskDrivers),
    recommendedMonitoring: normalizeField(
      input.recommendedMonitoring,
      state.recommendedMonitoring
    ),
  });

  const signature = buildRiskWorkspaceStateSignature(nextCandidate);
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
    riskCount: state.riskCount,
    selectedObjectId: state.selectedObjectId,
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

export function hydrateRiskWorkspaceStateOnMount(mountKey: string): void {
  publishRiskWorkspaceState({
    phase: "loading",
    riskSummary: Object.freeze({
      headline: RISK_LOADING_HEADLINE,
      detail: RISK_LOADING_DETAIL,
    }),
    topRisks: Object.freeze({
      headline: RISK_LOADING_HEADLINE,
      detail: RISK_LOADING_DETAIL,
    }),
    riskDrivers: Object.freeze({
      headline: RISK_LOADING_HEADLINE,
      detail: RISK_LOADING_DETAIL,
    }),
    recommendedMonitoring: Object.freeze({
      headline: RISK_LOADING_HEADLINE,
      detail: RISK_LOADING_DETAIL,
    }),
  });
  publishRiskWorkspaceState({
    phase: "ready",
    ...DEFAULT_RISK_WORKSPACE_METRICS,
    topRiskRows: Object.freeze([]),
    sceneCoverage: DEFAULT_RISK_SCENE_COVERAGE,
    sceneAwarenessReadOnly: true,
    objectContext: DEFAULT_RISK_OBJECT_CONTEXT,
    riskSummary: DEFAULT_RISK_SUMMARY,
    topRisks: DEFAULT_TOP_RISKS,
    riskDrivers: DEFAULT_RISK_DRIVERS,
    recommendedMonitoring: DEFAULT_RECOMMENDED_MONITORING,
  });
  logRuntimeOnce(`hydrate:${mountKey}`, {
    action: "workspace_state_hydrated",
    mountKey,
    phase: state.phase,
  });
}

export function getRiskWorkspaceStatePublishCountForTests(): number {
  return publishCount;
}

export function resetRiskWorkspaceStateRuntimeForTests(): void {
  revision = 0;
  lastSignature = null;
  publishCount = 0;
  loopGuardWindowStart = 0;
  loopGuardPublishCount = 0;
  loggedRuntimeKeys.clear();
  loggedStateKeys.clear();
  state = createRiskLoadingState(0);
  notifyListeners();
}
