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
import { devLogThrottled } from "../../runtime/diagnosticThrottle.ts";
import type {
  BuildExecutiveIntelligenceRefreshInput,
  ExecutiveIntelligenceState,
} from "./executiveIntelligenceTypes.ts";

type IntelligenceListener = () => void;

let state: ExecutiveIntelligenceState | null = null;
let lastInputSignature: string | null = null;
let refreshInFlight = false;
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
  if (refreshInFlight) {
    devLogThrottled({
      key: `advisor-reentrancy-block:store:${input.selectedObjectId ?? "none"}`,
      label: "[NEXORA_ADVISOR_REENTRANCY_BLOCK]",
      scope: "runtimeAudit",
      intervalMs: 1000,
      payload: {
        source: "refreshExecutiveIntelligence",
        target: "refreshExecutiveIntelligence",
        depth: 1,
        cycleDetected: true,
        selectedObjectId: input.selectedObjectId ?? null,
      },
    });
    return state;
  }
  const sceneReady = isExecutiveIntelligenceSceneReady(input);
  if (!sceneReady) {
    return state;
  }

  const nextSignature = buildExecutiveIntelligenceInputSignature(input);
  if (state && lastInputSignature === nextSignature) return state;

  refreshInFlight = true;
  try {
    lastInputSignature = nextSignature;
    devLogThrottled({
      key: `advisor-refresh-graph:store:${input.selectedObjectId ?? "none"}:${nextSignature.length}`,
      label: "[NEXORA_ADVISOR_REFRESH_GRAPH]",
      scope: "runtimeAudit",
      intervalMs: 1000,
      payload: {
        source: "HomeScreen",
        target: "refreshExecutiveIntelligence",
        depth: 0,
        cycleDetected: false,
        selectedObjectId: input.selectedObjectId ?? null,
      },
    });
    refreshExecutiveIntelligenceCascade(input);
    state = buildExecutiveIntelligenceState(input);
    notify();
    return state;
  } finally {
    refreshInFlight = false;
  }
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
  refreshInFlight = false;
  listeners.clear();
  resetExecutiveIntelligenceRuntimeCacheForTests();
}
