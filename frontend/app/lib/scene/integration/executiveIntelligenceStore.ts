/**
 * E2:100 — Executive Intelligence store (module-level, event-driven).
 */

import {
  buildExecutiveIntelligenceInputSignature,
  buildExecutiveIntelligenceState,
  clearExecutiveIntelligenceCascade,
  isExecutiveIntelligenceSceneReady,
  refreshExecutiveIntelligenceCascade,
  resetExecutiveIntelligenceRuntimeCacheForTests,
} from "./executiveIntelligenceRuntime.ts";
import type {
  BuildExecutiveIntelligenceRefreshInput,
  ExecutiveIntelligenceState,
} from "./executiveIntelligenceTypes.ts";

type IntelligenceListener = () => void;

let state: ExecutiveIntelligenceState | null = null;
let lastInputSignature: string | null = null;
const listeners = new Set<IntelligenceListener>();

function notify(): void {
  listeners.forEach((listener) => listener());
}

export function getExecutiveIntelligenceState(): ExecutiveIntelligenceState | null {
  return state;
}

export function getExecutiveIntelligenceServerSnapshot(): ExecutiveIntelligenceState | null {
  return state;
}

export function subscribeExecutiveIntelligence(listener: IntelligenceListener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function refreshExecutiveIntelligence(
  input: BuildExecutiveIntelligenceRefreshInput
): ExecutiveIntelligenceState | null {
  const sceneReady = isExecutiveIntelligenceSceneReady(input);
  if (!sceneReady) {
    return state;
  }

  const nextSignature = buildExecutiveIntelligenceInputSignature(input);
  if (state && lastInputSignature === nextSignature) return state;

  lastInputSignature = nextSignature;
  refreshExecutiveIntelligenceCascade(input);
  state = buildExecutiveIntelligenceState(input);
  notify();
  return state;
}

export function clearExecutiveIntelligence(): void {
  if (!state) {
    clearExecutiveIntelligenceCascade();
    return;
  }
  clearExecutiveIntelligenceCascade();
  state = null;
  lastInputSignature = null;
  notify();
}

export function resetExecutiveIntelligenceForTests(): void {
  state = null;
  lastInputSignature = null;
  listeners.clear();
  resetExecutiveIntelligenceRuntimeCacheForTests();
}
