/**
 * MRP:4E:1 — Scenario workspace runtime state store.
 */

import {
  DEFAULT_FUTURE_PROJECTION,
  DEFAULT_SCENARIO_COMPARISON,
  DEFAULT_SCENARIO_LIST,
  DEFAULT_SCENARIO_READY_STATE,
  DEFAULT_SCENARIO_SUMMARY,
  SCENARIO_EMPTY_DETAIL,
  SCENARIO_EMPTY_HEADLINE,
  SCENARIO_LOADING_DETAIL,
  SCENARIO_LOADING_HEADLINE,
  SCENARIO_RUNTIME_TAG,
  SCENARIO_STATE_TAG,
  type ScenarioFieldSnapshot,
  type ScenarioWorkspaceState,
  type ScenarioWorkspaceStatePhase,
  type ScenarioWorkspaceStatePublishResult,
} from "./scenarioWorkspaceStateContract.ts";
import type { GeneratedScenario, GeneratedScenarioId } from "./scenarioGenerationContract.ts";
import type { ScenarioCommitPackage } from "./scenarioHandoffContract.ts";
import { buildScenarioCommitPackageSignature } from "./scenarioHandoffResolver.ts";
import type { ScenarioComparisonMatrix } from "./scenarioComparisonContract.ts";
import { DEFAULT_SCENARIO_COMPARISON_MATRIX } from "./scenarioComparisonContract.ts";
import type { ScenarioProjectionLayer } from "./scenarioProjectionContract.ts";
import { DEFAULT_SCENARIO_PROJECTION_LAYER } from "./scenarioProjectionContract.ts";
import { buildScenarioComparisonSignature } from "./scenarioComparisonResolver.ts";
import { buildScenarioProjectionSignature } from "./scenarioProjectionResolver.ts";
import {
  DEFAULT_SCENARIO_WORKSPACE_CONTEXT,
  type ScenarioWorkspaceContext,
} from "./scenarioWorkspaceContextContract.ts";
import { buildScenarioWorkspaceContextSignature } from "./scenarioWorkspaceContextResolver.ts";

const listeners = new Set<() => void>();
const loggedRuntimeKeys = new Set<string>();
const loggedStateKeys = new Set<string>();

let revision = 0;
let lastSignature: string | null = null;
let publishCount = 0;
let loopGuardWindowStart = 0;
let loopGuardPublishCount = 0;

let state: ScenarioWorkspaceState = createScenarioLoadingState(0);

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
  value: ScenarioFieldSnapshot | undefined,
  fallback: ScenarioFieldSnapshot
): ScenarioFieldSnapshot {
  return Object.freeze({
    headline: normalizeText(value?.headline, fallback.headline),
    detail: normalizeText(value?.detail, fallback.detail),
  });
}

function normalizePhase(value: unknown): ScenarioWorkspaceStatePhase {
  if (value === "loading" || value === "ready" || value === "empty") {
    return value;
  }
  return "ready";
}

function normalizeWorkspaceContext(
  value: ScenarioWorkspaceContext | undefined,
  fallback: ScenarioWorkspaceContext
): ScenarioWorkspaceContext {
  if (!value) return fallback;
  return Object.freeze({
    selectedObjectId: value.selectedObjectId?.trim() || null,
    selectedObject: normalizeText(value.selectedObject, fallback.selectedObject),
    explorationScope: normalizeText(value.explorationScope, fallback.explorationScope),
    comparisonMode: normalizeText(value.comparisonMode, fallback.comparisonMode),
    projectionHorizon: normalizeText(value.projectionHorizon, fallback.projectionHorizon),
    hasSelection: value.hasSelection === true,
  });
}

function normalizeGeneratedScenarios(
  value: readonly GeneratedScenario[] | undefined,
  fallback: readonly GeneratedScenario[]
): readonly GeneratedScenario[] {
  if (!value?.length) return fallback;
  return Object.freeze(
    value.map((row) =>
      Object.freeze({
        id: row.id,
        title: normalizeText(row.title, row.id),
        probability: normalizeText(row.probability, "—"),
        impact: normalizeText(row.impact, "—"),
        confidence: normalizeText(row.confidence, "—"),
      })
    )
  );
}

function normalizeComparisonMatrix(
  value: ScenarioComparisonMatrix | undefined,
  fallback: ScenarioComparisonMatrix
): ScenarioComparisonMatrix {
  if (!value) return fallback;
  return Object.freeze({
    columns: Object.freeze([...value.columns]),
    rows: Object.freeze([...value.rows]),
    readOnly: true as const,
  });
}

function normalizeProjectionLayer(
  value: ScenarioProjectionLayer | undefined,
  fallback: ScenarioProjectionLayer
): ScenarioProjectionLayer {
  if (!value) return fallback;
  return Object.freeze({
    horizon: normalizeText(value.horizon, fallback.horizon),
    trends: Object.freeze([...value.trends]),
    sections: Object.freeze([...value.sections]),
    readOnly: true as const,
  });
}

function normalizeScenarioId(
  value: GeneratedScenarioId | null | undefined,
  fallback: GeneratedScenarioId | null
): GeneratedScenarioId | null {
  if (value === "best_case" || value === "expected_case" || value === "worst_case") {
    return value;
  }
  return fallback;
}

function normalizeCommitPackage(
  value: ScenarioCommitPackage | null | undefined,
  fallback: ScenarioCommitPackage | null
): ScenarioCommitPackage | null {
  if (!value) return fallback;
  return Object.freeze({
    scenarioId: normalizeScenarioId(value.scenarioId, null) ?? "expected_case",
    title: normalizeText(value.title, value.scenarioId),
    probability: normalizeText(value.probability, "—"),
    impact: normalizeText(value.impact, "—"),
    confidence: normalizeText(value.confidence, "—"),
    selectedObjectId: value.selectedObjectId?.trim() || null,
    createdAt: normalizeText(value.createdAt, new Date(0).toISOString()),
  });
}

export function buildScenarioWorkspaceStateSignature(input: {
  phase: ScenarioWorkspaceStatePhase;
  workspaceContext: ScenarioWorkspaceContext;
  generatedScenarios: readonly GeneratedScenario[];
  comparisonMatrix: ScenarioComparisonMatrix;
  projectionLayer: ScenarioProjectionLayer;
  activeScenarioId: GeneratedScenarioId | null;
  selectedScenarioId: GeneratedScenarioId | null;
  pendingCommitPackage: ScenarioCommitPackage | null;
  handoffReady: boolean;
  scenarioSummary: ScenarioFieldSnapshot;
  scenarioList: ScenarioFieldSnapshot;
  scenarioComparison: ScenarioFieldSnapshot;
  futureProjection: ScenarioFieldSnapshot;
}): string {
  return JSON.stringify({
    phase: input.phase,
    workspaceContext: buildScenarioWorkspaceContextSignature(input.workspaceContext),
    generatedScenarios: input.generatedScenarios,
    comparisonMatrix: buildScenarioComparisonSignature(input.comparisonMatrix),
    projectionLayer: buildScenarioProjectionSignature(input.projectionLayer),
    activeScenarioId: input.activeScenarioId,
    selectedScenarioId: input.selectedScenarioId,
    pendingCommitPackage: input.pendingCommitPackage
      ? buildScenarioCommitPackageSignature(input.pendingCommitPackage)
      : null,
    handoffReady: input.handoffReady,
    scenarioSummary: input.scenarioSummary,
    scenarioList: input.scenarioList,
    scenarioComparison: input.scenarioComparison,
    futureProjection: input.futureProjection,
  });
}

export function createScenarioLoadingState(rev = 0): ScenarioWorkspaceState {
  const loadingField = Object.freeze({
    headline: SCENARIO_LOADING_HEADLINE,
    detail: SCENARIO_LOADING_DETAIL,
  });
  const signature = buildScenarioWorkspaceStateSignature({
    phase: "loading",
    workspaceContext: DEFAULT_SCENARIO_WORKSPACE_CONTEXT,
    generatedScenarios: Object.freeze([]),
    comparisonMatrix: DEFAULT_SCENARIO_COMPARISON_MATRIX,
    projectionLayer: DEFAULT_SCENARIO_PROJECTION_LAYER,
    activeScenarioId: null,
    selectedScenarioId: null,
    pendingCommitPackage: null,
    handoffReady: false,
    scenarioSummary: loadingField,
    scenarioList: loadingField,
    scenarioComparison: loadingField,
    futureProjection: loadingField,
  });
  return Object.freeze({
    phase: "loading",
    workspaceContext: DEFAULT_SCENARIO_WORKSPACE_CONTEXT,
    generatedScenarios: Object.freeze([]),
    generationReadOnly: true,
    comparisonMatrix: DEFAULT_SCENARIO_COMPARISON_MATRIX,
    comparisonReadOnly: true,
    projectionLayer: DEFAULT_SCENARIO_PROJECTION_LAYER,
    projectionReadOnly: true,
    activeScenarioId: null,
    selectedScenarioId: null,
    pendingCommitPackage: null,
    handoffReady: false,
    scenarioSummary: loadingField,
    scenarioList: loadingField,
    scenarioComparison: loadingField,
    futureProjection: loadingField,
    revision: rev,
    signature,
  });
}

export function createScenarioEmptyState(rev = 0): ScenarioWorkspaceState {
  const emptyField = Object.freeze({
    headline: SCENARIO_EMPTY_HEADLINE,
    detail: SCENARIO_EMPTY_DETAIL,
  });
  const signature = buildScenarioWorkspaceStateSignature({
    phase: "empty",
    workspaceContext: DEFAULT_SCENARIO_WORKSPACE_CONTEXT,
    generatedScenarios: Object.freeze([]),
    comparisonMatrix: DEFAULT_SCENARIO_COMPARISON_MATRIX,
    projectionLayer: DEFAULT_SCENARIO_PROJECTION_LAYER,
    activeScenarioId: null,
    selectedScenarioId: null,
    pendingCommitPackage: null,
    handoffReady: false,
    scenarioSummary: emptyField,
    scenarioList: emptyField,
    scenarioComparison: emptyField,
    futureProjection: emptyField,
  });
  return Object.freeze({
    phase: "empty",
    workspaceContext: DEFAULT_SCENARIO_WORKSPACE_CONTEXT,
    generatedScenarios: Object.freeze([]),
    generationReadOnly: true,
    comparisonMatrix: DEFAULT_SCENARIO_COMPARISON_MATRIX,
    comparisonReadOnly: true,
    projectionLayer: DEFAULT_SCENARIO_PROJECTION_LAYER,
    projectionReadOnly: true,
    activeScenarioId: null,
    selectedScenarioId: null,
    pendingCommitPackage: null,
    handoffReady: false,
    scenarioSummary: emptyField,
    scenarioList: emptyField,
    scenarioComparison: emptyField,
    futureProjection: emptyField,
    revision: rev,
    signature,
  });
}

export function createScenarioDefaultReadyState(rev = 0): ScenarioWorkspaceState {
  return Object.freeze({
    ...DEFAULT_SCENARIO_READY_STATE,
    generationReadOnly: true,
    comparisonReadOnly: true,
    projectionReadOnly: true,
    revision: rev,
    signature: buildScenarioWorkspaceStateSignature({
      phase: "ready",
      workspaceContext: DEFAULT_SCENARIO_READY_STATE.workspaceContext,
      generatedScenarios: DEFAULT_SCENARIO_READY_STATE.generatedScenarios,
      comparisonMatrix: DEFAULT_SCENARIO_READY_STATE.comparisonMatrix,
      projectionLayer: DEFAULT_SCENARIO_READY_STATE.projectionLayer,
      activeScenarioId: DEFAULT_SCENARIO_READY_STATE.activeScenarioId,
      selectedScenarioId: DEFAULT_SCENARIO_READY_STATE.selectedScenarioId,
      pendingCommitPackage: DEFAULT_SCENARIO_READY_STATE.pendingCommitPackage,
      handoffReady: DEFAULT_SCENARIO_READY_STATE.handoffReady,
      scenarioSummary: DEFAULT_SCENARIO_READY_STATE.scenarioSummary,
      scenarioList: DEFAULT_SCENARIO_READY_STATE.scenarioList,
      scenarioComparison: DEFAULT_SCENARIO_READY_STATE.scenarioComparison,
      futureProjection: DEFAULT_SCENARIO_READY_STATE.futureProjection,
    }),
  });
}

function logStateOnce(key: string, detail: Readonly<Record<string, unknown>>): void {
  if (!isDev()) return;
  if (loggedStateKeys.has(key)) return;
  loggedStateKeys.add(key);
  globalThis.console?.debug?.(SCENARIO_STATE_TAG, detail);
}

function logRuntimeOnce(key: string, detail: Readonly<Record<string, unknown>>): void {
  if (!isDev()) return;
  if (loggedRuntimeKeys.has(key)) return;
  loggedRuntimeKeys.add(key);
  globalThis.console?.debug?.(SCENARIO_RUNTIME_TAG, detail);
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

function validateState(next: ScenarioWorkspaceState): string | null {
  const fields = [
    next.scenarioSummary,
    next.scenarioList,
    next.scenarioComparison,
    next.futureProjection,
  ];
  for (const field of fields) {
    if (!field.headline.trim()) return "empty_field_headline";
    if (!field.detail.trim()) return "empty_field_detail";
  }
  if (!next.workspaceContext.selectedObject.trim()) return "empty_selected_object";
  if (!next.workspaceContext.explorationScope.trim()) return "empty_exploration_scope";
  if (!next.workspaceContext.comparisonMode.trim()) return "empty_comparison_mode";
  if (!next.workspaceContext.projectionHorizon.trim()) return "empty_projection_horizon";
  return null;
}

export function getScenarioWorkspaceState(): ScenarioWorkspaceState {
  return state;
}

export function getScenarioWorkspaceStateServerSnapshot(): ScenarioWorkspaceState {
  return createScenarioLoadingState(0);
}

export function subscribeScenarioWorkspaceState(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function publishScenarioWorkspaceState(
  input: Partial<Omit<ScenarioWorkspaceState, "revision" | "signature">> & {
    phase?: ScenarioWorkspaceStatePhase;
  }
): ScenarioWorkspaceStatePublishResult {
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
    workspaceContext: normalizeWorkspaceContext(
      input.workspaceContext,
      state.workspaceContext
    ),
    generatedScenarios: normalizeGeneratedScenarios(
      input.generatedScenarios,
      state.generatedScenarios
    ),
    generationReadOnly: true as const,
    comparisonMatrix: normalizeComparisonMatrix(
      input.comparisonMatrix,
      state.comparisonMatrix
    ),
    comparisonReadOnly: true as const,
    projectionLayer: normalizeProjectionLayer(
      input.projectionLayer,
      state.projectionLayer
    ),
    projectionReadOnly: true as const,
    activeScenarioId: normalizeScenarioId(
      input.activeScenarioId,
      state.activeScenarioId
    ),
    selectedScenarioId: normalizeScenarioId(
      input.selectedScenarioId,
      state.selectedScenarioId
    ),
    pendingCommitPackage: normalizeCommitPackage(
      input.pendingCommitPackage,
      state.pendingCommitPackage
    ),
    handoffReady: input.handoffReady ?? state.handoffReady,
    scenarioSummary: normalizeField(input.scenarioSummary, state.scenarioSummary),
    scenarioList: normalizeField(input.scenarioList, state.scenarioList),
    scenarioComparison: normalizeField(
      input.scenarioComparison,
      state.scenarioComparison
    ),
    futureProjection: normalizeField(input.futureProjection, state.futureProjection),
  });

  const signature = buildScenarioWorkspaceStateSignature(nextCandidate);
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

export function hydrateScenarioWorkspaceStateOnMount(mountKey: string): void {
  publishScenarioWorkspaceState({
    phase: "loading",
    scenarioSummary: Object.freeze({
      headline: SCENARIO_LOADING_HEADLINE,
      detail: SCENARIO_LOADING_DETAIL,
    }),
    scenarioList: Object.freeze({
      headline: SCENARIO_LOADING_HEADLINE,
      detail: SCENARIO_LOADING_DETAIL,
    }),
    scenarioComparison: Object.freeze({
      headline: SCENARIO_LOADING_HEADLINE,
      detail: SCENARIO_LOADING_DETAIL,
    }),
    futureProjection: Object.freeze({
      headline: SCENARIO_LOADING_HEADLINE,
      detail: SCENARIO_LOADING_DETAIL,
    }),
  });
  publishScenarioWorkspaceState({
    phase: "ready",
    generatedScenarios: Object.freeze([]),
    generationReadOnly: true,
    comparisonMatrix: DEFAULT_SCENARIO_COMPARISON_MATRIX,
    comparisonReadOnly: true,
    projectionLayer: DEFAULT_SCENARIO_PROJECTION_LAYER,
    projectionReadOnly: true,
    activeScenarioId: null,
    selectedScenarioId: null,
    pendingCommitPackage: null,
    handoffReady: false,
    scenarioSummary: DEFAULT_SCENARIO_SUMMARY,
    scenarioList: DEFAULT_SCENARIO_LIST,
    scenarioComparison: DEFAULT_SCENARIO_COMPARISON,
    futureProjection: DEFAULT_FUTURE_PROJECTION,
    workspaceContext: state.workspaceContext,
  });
  logRuntimeOnce(`hydrate:${mountKey}`, {
    action: "workspace_state_hydrated",
    mountKey,
    phase: state.phase,
  });
}

export function resetScenarioWorkspaceStateRuntimeForTests(): void {
  revision = 0;
  lastSignature = null;
  publishCount = 0;
  loopGuardWindowStart = 0;
  loopGuardPublishCount = 0;
  loggedRuntimeKeys.clear();
  loggedStateKeys.clear();
  state = createScenarioLoadingState(0);
  notifyListeners();
}

/** @internal */
export function getScenarioWorkspaceStatePublishCountForTests(): number {
  return publishCount;
}
