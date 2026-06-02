/**
 * E2:94 — Timeline spatial interaction store (module-level, signature-gated side effects).
 */

import { focusObject } from "../sceneNavigationContract";
import {
  logE294ScenarioStep,
  logE294TimelineFocus,
} from "./spatialTimeIntelligenceDiagnostics";
import type { TimelineSpatialInteractionState } from "./spatialTimeIntelligenceTypes";

type TimelineSpatialListener = () => void;

let state: TimelineSpatialInteractionState = {
  selectedEventId: null,
  hoveredEventId: null,
  focusModeEventId: null,
  scenarioStepIndex: null,
};

const listeners = new Set<TimelineSpatialListener>();
let lastFocusSignature: string | null = null;

function notify(): void {
  listeners.forEach((listener) => listener());
}

export function getTimelineSpatialInteractionState(): TimelineSpatialInteractionState {
  return state;
}

export function subscribeTimelineSpatialInteraction(listener: TimelineSpatialListener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getTimelineSpatialInteractionServerSnapshot(): TimelineSpatialInteractionState {
  return state;
}

export function selectTimelineSpatialEvent(
  eventId: string | null,
  options?: { focusObjectId?: string | null; source?: string }
): TimelineSpatialInteractionState {
  const nextSelected = eventId?.trim() || null;
  if (state.selectedEventId === nextSelected && state.focusModeEventId == null) return state;
  state = { ...state, selectedEventId: nextSelected };
  notify();

  const focusId = options?.focusObjectId?.trim() || null;
  if (focusId) {
    const signature = `${nextSelected ?? "none"}:${focusId}:${options?.source ?? "timeline"}`;
    if (lastFocusSignature !== signature) {
      lastFocusSignature = signature;
      logE294TimelineFocus(signature, {
        eventId: nextSelected,
        objectId: focusId,
        source: options?.source ?? "timeline",
      });
      focusObject(focusId, "timeline", { animate: true });
    }
  }
  return state;
}

export function hoverTimelineSpatialEvent(eventId: string | null): TimelineSpatialInteractionState {
  const nextHovered = eventId?.trim() || null;
  if (state.hoveredEventId === nextHovered) return state;
  state = { ...state, hoveredEventId: nextHovered };
  notify();
  return state;
}

export function enterTimelineSpatialFocusMode(eventId: string): TimelineSpatialInteractionState {
  const next = eventId.trim();
  if (!next) return state;
  state = {
    ...state,
    selectedEventId: next,
    focusModeEventId: next,
  };
  notify();
  return state;
}

export function exitTimelineSpatialFocusMode(): TimelineSpatialInteractionState {
  if (!state.focusModeEventId) return state;
  state = { ...state, focusModeEventId: null };
  notify();
  return state;
}

export function setTimelineScenarioStepIndex(stepIndex: number | null): TimelineSpatialInteractionState {
  if (state.scenarioStepIndex === stepIndex) return state;
  state = { ...state, scenarioStepIndex: stepIndex };
  logE294ScenarioStep(String(stepIndex ?? "none"), { stepIndex });
  notify();
  return state;
}

export function resetTimelineSpatialInteractionForTests(): void {
  state = {
    selectedEventId: null,
    hoveredEventId: null,
    focusModeEventId: null,
    scenarioStepIndex: null,
  };
  lastFocusSignature = null;
  listeners.clear();
}
