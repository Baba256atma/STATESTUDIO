/**
 * E2:98 — Executive Cognitive Twin store (module-level, event-driven).
 */

import { buildExecutiveCognitiveTwinState } from "./executiveCognitiveTwinRuntime.ts";
import type {
  BuildExecutiveCognitiveTwinInput,
  ExecutiveCognitiveTwinState,
} from "./executiveCognitiveTwinTypes.ts";

type TwinListener = () => void;

let state: ExecutiveCognitiveTwinState | null = null;
let lastInputSignature: string | null = null;
const listeners = new Set<TwinListener>();

function notify(): void {
  listeners.forEach((listener) => listener());
}

function inputSignature(input: BuildExecutiveCognitiveTwinInput): string {
  return [
    (input.sceneObjectIds ?? []).join("|") || "none",
    input.selectedObjectId ?? "none",
    input.activeSimulation?.scenarioId ?? "none",
    input.scenarioUniverse?.signature ?? "none",
    input.scenarioComparison?.id ?? "none",
    input.executionState?.status ?? "none",
    (input.alerts ?? []).map((alert) => `${alert.id}:${alert.acknowledged}`).join("|") || "none",
    input.memoryState?.entries.length ?? 0,
    input.warRoomSignature ?? "none",
  ].join("::");
}

export function getExecutiveCognitiveTwinState(): ExecutiveCognitiveTwinState | null {
  return state;
}

export function getExecutiveCognitiveTwinServerSnapshot(): ExecutiveCognitiveTwinState | null {
  return state;
}

export function subscribeExecutiveCognitiveTwin(listener: TwinListener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function refreshExecutiveCognitiveTwin(input: BuildExecutiveCognitiveTwinInput): ExecutiveCognitiveTwinState | null {
  if (!(input.sceneObjectIds?.length || input.sceneObjectMeta?.length)) {
    clearExecutiveCognitiveTwin();
    return null;
  }
  const nextSignature = inputSignature(input);
  if (state && lastInputSignature === nextSignature) return state;
  lastInputSignature = nextSignature;
  state = buildExecutiveCognitiveTwinState(input);
  notify();
  return state;
}

export function clearExecutiveCognitiveTwin(): void {
  if (!state) return;
  state = null;
  lastInputSignature = null;
  notify();
}

export function resetExecutiveCognitiveTwinForTests(): void {
  state = null;
  lastInputSignature = null;
  listeners.clear();
}
