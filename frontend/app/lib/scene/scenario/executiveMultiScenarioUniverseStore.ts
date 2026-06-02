/**
 * E2:96 — Multi-scenario universe store (module-level, event-driven).
 */

import { focusObject } from "../sceneNavigationContract";
import { pauseExecutiveScenarioPlayback } from "./executiveScenarioPlaybackStore";
import { logE296ComparisonCompleted } from "./executiveMultiScenarioUniverseDiagnostics";
import {
  buildExecutiveScenarioUniverse,
  resolveActiveUniverseSimulation,
} from "./executiveMultiScenarioUniverseRuntime";
import type {
  BuildExecutiveScenarioUniverseInput,
  ExecutiveScenarioUniverseState,
  ScenarioComparisonMode,
  ScenarioUniverseLayoutMode,
} from "./executiveMultiScenarioUniverseTypes";

type UniverseListener = () => void;

let state: ExecutiveScenarioUniverseState | null = null;
const listeners = new Set<UniverseListener>();
let lastFocusSignature: string | null = null;

function notify(): void {
  listeners.forEach((listener) => listener());
}

function maybeFocusActiveScenario(): void {
  if (!state) return;
  const simulation = resolveActiveUniverseSimulation(state);
  const focusId = simulation?.propagationPaths[0]?.from ?? simulation?.affectedObjectIds[0] ?? null;
  if (!focusId) return;
  const signature = `${state.activeScenarioId}:${focusId}`;
  if (lastFocusSignature === signature) return;
  lastFocusSignature = signature;
  focusObject(focusId, "panel", { animate: true });
}

export function getExecutiveScenarioUniverseState(): ExecutiveScenarioUniverseState | null {
  return state;
}

export function getExecutiveScenarioUniverseServerSnapshot(): ExecutiveScenarioUniverseState | null {
  return state;
}

export function subscribeExecutiveScenarioUniverse(listener: UniverseListener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function loadExecutiveScenarioUniverse(input: BuildExecutiveScenarioUniverseInput): ExecutiveScenarioUniverseState | null {
  if (!input.comparison.rows.length) {
    clearExecutiveScenarioUniverse();
    return null;
  }
  state = buildExecutiveScenarioUniverse(input);
  notify();
  return state;
}

export function clearExecutiveScenarioUniverse(): void {
  if (!state) return;
  pauseExecutiveScenarioPlayback();
  state = null;
  lastFocusSignature = null;
  notify();
}

export function setActiveScenarioLayer(scenarioId: string, options?: { focusCamera?: boolean }): ExecutiveScenarioUniverseState | null {
  if (!state) return null;
  const trimmed = scenarioId.trim();
  if (!trimmed || state.activeScenarioId === trimmed) return state;
  const exists = state.layers.some((layer) => layer.metadata.id === trimmed);
  if (!exists) return state;

  state = {
    ...state,
    activeScenarioId: trimmed,
    signature: `${state.signature}|active:${trimmed}`,
  };
  if (options?.focusCamera !== false) maybeFocusActiveScenario();
  notify();
  return state;
}

export function setScenarioLayerVisibility(scenarioId: string, visible: boolean): ExecutiveScenarioUniverseState | null {
  if (!state) return null;
  const layers = state.layers.map((layer) =>
    layer.metadata.id === scenarioId ? { ...layer, visible } : layer
  );
  const visibleLayerIds = layers.filter((layer) => layer.visible).map((layer) => layer.metadata.id);
  state = {
    ...state,
    layers,
    visibleLayerIds,
    signature: `${state.signature}|vis:${visibleLayerIds.join(",")}`,
  };
  notify();
  return state;
}

export function isolateScenarioLayer(scenarioId: string): ExecutiveScenarioUniverseState | null {
  if (!state) return null;
  const layers = state.layers.map((layer) => ({
    ...layer,
    visible: layer.metadata.id === scenarioId || layer.metadata.id === state!.baselineScenarioId,
    ghostProjection: layer.metadata.id !== scenarioId,
  }));
  state = {
    ...state,
    layers,
    activeScenarioId: scenarioId,
    visibleLayerIds: layers.filter((layer) => layer.visible).map((layer) => layer.metadata.id),
    signature: `${state.signature}|isolate:${scenarioId}`,
  };
  notify();
  return state;
}

export function setScenarioComparisonMode(mode: ScenarioComparisonMode): ExecutiveScenarioUniverseState | null {
  if (!state || state.comparisonMode === mode) return state;
  state = { ...state, comparisonMode: mode, signature: `${state.signature}|mode:${mode}` };
  notify();
  return state;
}

export function setScenarioUniverseLayoutMode(mode: ScenarioUniverseLayoutMode): ExecutiveScenarioUniverseState | null {
  if (!state || state.layoutMode === mode) return state;
  const layers = state.layers.map((layer) => ({
    ...layer,
    ghostProjection: mode === "ghost" && layer.metadata.id !== state!.activeScenarioId && layer.metadata.role === "alternative",
  }));
  state = { ...state, layoutMode: mode, layers, signature: `${state.signature}|layout:${mode}` };
  notify();
  return state;
}

export function completeExecutiveScenarioComparison(): ExecutiveScenarioUniverseState | null {
  if (!state) return null;
  logE296ComparisonCompleted(state.signature, {
    comparisonId: state.comparisonId,
    recommendedScenarioId: state.recommendation?.recommendedScenarioId ?? null,
    rankings: state.rankings.map((entry) => ({ id: entry.scenarioId, rank: entry.rank })),
  });
  return state;
}

export function resetExecutiveScenarioUniverseForTests(): void {
  state = null;
  lastFocusSignature = null;
  listeners.clear();
}
