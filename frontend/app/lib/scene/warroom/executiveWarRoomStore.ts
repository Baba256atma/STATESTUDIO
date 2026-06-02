/**
 * E2:97 — Executive War Room store (module-level, event-driven).
 */

import { focusObject } from "../sceneNavigationContract";
import {
  buildExecutiveWarRoomState,
  resolveWarRoomIncidentFocusObjectId,
} from "./executiveWarRoomRuntime.ts";
import type {
  BuildExecutiveWarRoomInput,
  ExecutiveWarRoomCommandId,
  ExecutiveWarRoomFocusMode,
  ExecutiveWarRoomState,
} from "./executiveWarRoomTypes.ts";

type WarRoomListener = () => void;

let state: ExecutiveWarRoomState | null = null;
let focusModeOverride: ExecutiveWarRoomFocusMode | null = null;
let lastInputSignature: string | null = null;
let lastIncidentFocusSignature: string | null = null;
const listeners = new Set<WarRoomListener>();

function notify(): void {
  listeners.forEach((listener) => listener());
}

function inputSignature(input: BuildExecutiveWarRoomInput): string {
  return [
    input.selectedObjectId ?? "none",
    input.selectedTimelineEventId ?? "none",
    input.activeSimulation?.scenarioId ?? "none",
    input.scenarioUniverse?.signature ?? "none",
    input.playbackStatus ?? "idle",
    input.playbackProgressPercent ?? "none",
    input.scenarioComparison?.id ?? "none",
    input.decisionRecommendation?.recommendedScenarioId ?? "none",
    input.executionState?.status ?? "none",
    (input.alerts ?? []).map((alert) => `${alert.id}:${alert.acknowledged}`).join("|") || "none",
    input.cognitiveTwin?.signature ?? "none",
    input.executiveAdvisor?.signature ?? "none",
  ].join("::");
}

export function getExecutiveWarRoomState(): ExecutiveWarRoomState | null {
  return state;
}

export function getExecutiveWarRoomServerSnapshot(): ExecutiveWarRoomState | null {
  return state;
}

export function subscribeExecutiveWarRoom(listener: WarRoomListener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function refreshExecutiveWarRoom(input: BuildExecutiveWarRoomInput): ExecutiveWarRoomState {
  const nextInputSignature = inputSignature(input);
  if (state && lastInputSignature === nextInputSignature && focusModeOverride === state.mission.focusMode) {
    return state;
  }
  lastInputSignature = nextInputSignature;
  state = buildExecutiveWarRoomState(input, focusModeOverride);
  notify();
  return state;
}

export function clearExecutiveWarRoom(): void {
  if (!state) return;
  state = null;
  focusModeOverride = null;
  lastInputSignature = null;
  lastIncidentFocusSignature = null;
  notify();
}

export function setExecutiveWarRoomFocusMode(mode: ExecutiveWarRoomFocusMode): ExecutiveWarRoomState | null {
  if (!state || focusModeOverride === mode) return state;
  focusModeOverride = mode;
  state = {
    ...state,
    mission: {
      ...state.mission,
      focusMode: mode,
    },
    signature: `${state.signature}|focus:${mode}`,
    hud: {
      ...state.hud,
      mission: {
        ...state.hud.mission,
        focusMode: mode,
      },
    },
  };
  notify();
  return state;
}

export function focusExecutiveWarRoomIncident(options?: { animate?: boolean }): string | null {
  if (!state) return null;
  const objectId = resolveWarRoomIncidentFocusObjectId(state);
  if (!objectId) return null;
  const signature = `${state.signature}:${objectId}`;
  if (lastIncidentFocusSignature === signature) return objectId;
  lastIncidentFocusSignature = signature;
  focusObject(objectId, "panel", { animate: options?.animate !== false });
  return objectId;
}

export function dispatchExecutiveWarRoomCommand(commandId: ExecutiveWarRoomCommandId): ExecutiveWarRoomCommandId {
  if (!state) return commandId;
  if (commandId === "show_risks") {
    setExecutiveWarRoomFocusMode("risk");
    focusExecutiveWarRoomIncident();
  }
  if (commandId === "compare_scenarios" || commandId === "run_simulation") {
    setExecutiveWarRoomFocusMode("scenario");
  }
  if (commandId === "strategic_recommendation") {
    setExecutiveWarRoomFocusMode("strategic");
  }
  if (commandId === "analyze_system") {
    setExecutiveWarRoomFocusMode("operations");
  }
  return commandId;
}

export function resetExecutiveWarRoomForTests(): void {
  state = null;
  focusModeOverride = null;
  lastInputSignature = null;
  lastIncidentFocusSignature = null;
  listeners.clear();
}
