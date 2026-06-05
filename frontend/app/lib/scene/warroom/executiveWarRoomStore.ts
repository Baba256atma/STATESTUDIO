/**
 * E2:97 — Executive War Room store (module-level, event-driven).
 */

import { focusObject } from "../sceneNavigationContract";
import { devLogThrottled } from "../../runtime/diagnosticThrottle.ts";
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
const MAX_WAR_ROOM_SIGNATURE_LENGTH = 4096;
const MAX_WAR_ROOM_PART_LENGTH = 320;
const MAX_WAR_ROOM_ALERT_ITEMS = 80;

function notify(): void {
  listeners.forEach((listener) => listener());
}

function safeSignaturePart(value: unknown, fallback = "none", maxLength = MAX_WAR_ROOM_PART_LENGTH): string {
  const text = value == null ? fallback : String(value);
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}…#${text.length}`;
}

function boundedSignatureJoin(parts: readonly string[]): { signature: string; guardActivated: boolean; originalLength: number } {
  let signature = "";
  let guardActivated = false;
  const originalLength = parts.reduce((sum, part) => sum + part.length + 2, 0);
  for (const part of parts) {
    const next = signature ? `${signature}::${part}` : part;
    if (next.length > MAX_WAR_ROOM_SIGNATURE_LENGTH) {
      signature = `${signature}${signature ? "::" : ""}${part}`.slice(0, MAX_WAR_ROOM_SIGNATURE_LENGTH);
      guardActivated = true;
      break;
    }
    signature = next;
  }
  return { signature: signature || "none", guardActivated, originalLength };
}

function inputSignature(input: BuildExecutiveWarRoomInput): string {
  const alerts = input.alerts ?? [];
  const alertParts = alerts.slice(0, MAX_WAR_ROOM_ALERT_ITEMS).map((alert) =>
    `${safeSignaturePart(alert?.id, "alert", 160)}:${Boolean(alert?.acknowledged)}`
  );
  const alertSignature = alertParts.join("|") || "none";
  const result = boundedSignatureJoin([
    safeSignaturePart(input.selectedObjectId),
    safeSignaturePart(input.selectedTimelineEventId),
    safeSignaturePart(input.activeSimulation?.scenarioId),
    safeSignaturePart(input.scenarioUniverse?.signature),
    safeSignaturePart(input.playbackStatus, "idle"),
    safeSignaturePart(input.playbackProgressPercent),
    safeSignaturePart(input.scenarioComparison?.id),
    safeSignaturePart(input.decisionRecommendation?.recommendedScenarioId),
    safeSignaturePart(input.executionState?.status),
    safeSignaturePart(alertSignature, "none", 2048),
    safeSignaturePart(input.cognitiveTwin?.signature),
    safeSignaturePart(input.executiveAdvisor?.signature),
  ]);
  const guardActivated =
    result.guardActivated ||
    alerts.length > MAX_WAR_ROOM_ALERT_ITEMS ||
    result.originalLength > MAX_WAR_ROOM_SIGNATURE_LENGTH;
  if (guardActivated) {
    devLogThrottled({
      key: `war-room-signature-guard:${result.originalLength}:${result.signature.length}:${alerts.length}`,
      label: "[NEXORA_ADVISOR_SIGNATURE_GUARD]",
      scope: "runtimeAudit",
      intervalMs: 2000,
      payload: {
        owner: "ExecutiveWarRoomStore",
        originalLength: result.originalLength,
        truncatedLength: result.signature.length,
        guardActivated: true,
        alertCount: alerts.length,
        recommendationCount: input.executiveAdvisor?.recommendations.length ?? 0,
      },
    });
  }
  return result.signature;
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
