/**
 * E2:95 — Executive scenario playback store (module-level transport + timeline sync).
 */

import { focusObject } from "../sceneNavigationContract";
import {
  selectTimelineSpatialEvent,
  setTimelineScenarioStepIndex,
} from "../timeline/spatialTimeIntelligenceStore";
import {
  logE295PlaybackCompleted,
  logE295PlaybackStarted,
  logE295PlaybackStep,
} from "./executiveScenarioPlaybackDiagnostics";
import {
  buildExecutiveScenarioPlaybackState,
  buildScenarioCompletionSummary,
  resolvePlaybackStepDuration,
  resolveTimelineEventIdForStep,
} from "./executiveScenarioPlaybackRuntime";
import { resolveScenarioPropagationView } from "./executiveScenarioPropagationRuntime";
import type {
  ExecutiveScenarioPlaybackSequence,
  ExecutiveScenarioPlaybackState,
  ScenarioPlaybackSpeed,
} from "./executiveScenarioPlaybackTypes";

type PlaybackListener = () => void;

let state = buildExecutiveScenarioPlaybackState({ sequence: null });
const listeners = new Set<PlaybackListener>();
let tickTimer: ReturnType<typeof setInterval> | null = null;
let lastStepSignature: string | null = null;
let lastCameraSignature: string | null = null;

function notify(): void {
  listeners.forEach((listener) => listener());
}

function stopTickTimer(): void {
  if (tickTimer != null) {
    clearInterval(tickTimer);
    tickTimer = null;
  }
}

function syncTimelineForStep(stepIndex: number): void {
  const sequence = state.sequence;
  if (!sequence) return;
  setTimelineScenarioStepIndex(stepIndex);
  const eventId = resolveTimelineEventIdForStep(sequence, stepIndex);
  const view = resolveScenarioPropagationView({ sequence, stepIndex });
  if (eventId) {
    selectTimelineSpatialEvent(eventId, {
      focusObjectId: state.cameraFollowEnabled && !state.userCameraOverride ? view.focusObjectId : null,
      source: "scenario_playback",
    });
  }
}

function maybeFollowCamera(stepIndex: number): void {
  if (!state.cameraFollowEnabled || state.userCameraOverride || !state.sequence) return;
  const view = resolveScenarioPropagationView({ sequence: state.sequence, stepIndex });
  const focusId = view.focusObjectId;
  if (!focusId) return;
  const signature = `${stepIndex}:${focusId}`;
  if (lastCameraSignature === signature) return;
  lastCameraSignature = signature;
  focusObject(focusId, "timeline", { animate: true });
}

function applyStep(stepIndex: number, source: string): void {
  const sequence = state.sequence;
  if (!sequence || sequence.steps.length === 0) return;
  const clamped = Math.max(0, Math.min(sequence.steps.length - 1, stepIndex));
  const step = sequence.steps[clamped];
  const signature = `${sequence.signature}:${clamped}:${step?.stepId ?? "none"}`;
  if (lastStepSignature === signature && source !== "force") return;
  lastStepSignature = signature;

  state = buildExecutiveScenarioPlaybackState({
    sequence,
    stepIndex: clamped,
    status: state.status,
    speed: state.speed,
    cameraFollowEnabled: state.cameraFollowEnabled,
    userCameraOverride: state.userCameraOverride,
  });

  logE295PlaybackStep(signature, {
    stepIndex: clamped,
    stepId: step?.stepId,
    title: step?.title,
    source,
  });

  syncTimelineForStep(clamped);
  maybeFollowCamera(clamped);
  notify();
}

function completePlayback(): void {
  stopTickTimer();
  const sequence = state.sequence;
  if (!sequence) return;
  const completionSummary = buildScenarioCompletionSummary(sequence);
  state = {
    ...buildExecutiveScenarioPlaybackState({
      sequence,
      stepIndex: sequence.steps.length - 1,
      status: "completed",
      speed: state.speed,
      cameraFollowEnabled: state.cameraFollowEnabled,
      userCameraOverride: state.userCameraOverride,
    }),
    completionSummary,
  };
  logE295PlaybackCompleted(sequence.signature, {
    scenarioId: sequence.scenarioId,
    stepCount: sequence.steps.length,
    affectedObjects: completionSummary.affectedObjectIds.length,
  });
  notify();
}

function startTickTimer(): void {
  stopTickTimer();
  tickTimer = setInterval(() => {
    if (state.status !== "playing" || !state.sequence) return;
    const nextIndex = state.currentStepIndex + 1;
    if (nextIndex >= state.sequence.steps.length) {
      completePlayback();
      return;
    }
    applyStep(nextIndex, "auto");
  }, resolvePlaybackStepDuration(state.speed));
}

export function getExecutiveScenarioPlaybackState(): ExecutiveScenarioPlaybackState {
  return state;
}

export function getExecutiveScenarioPlaybackServerSnapshot(): ExecutiveScenarioPlaybackState {
  return state;
}

export function subscribeExecutiveScenarioPlayback(listener: PlaybackListener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function loadExecutiveScenarioPlaybackSequence(sequence: ExecutiveScenarioPlaybackSequence | null): ExecutiveScenarioPlaybackState {
  stopTickTimer();
  lastStepSignature = null;
  lastCameraSignature = null;
  state = buildExecutiveScenarioPlaybackState({
    sequence,
    stepIndex: 0,
    status: "idle",
    speed: state.speed,
    cameraFollowEnabled: state.cameraFollowEnabled,
    userCameraOverride: false,
  });
  notify();
  return state;
}

export function playExecutiveScenarioPlayback(): ExecutiveScenarioPlaybackState {
  const sequence = state.sequence;
  if (!sequence || sequence.steps.length === 0) return state;
  if (state.status === "completed") {
    state = buildExecutiveScenarioPlaybackState({
      sequence,
      stepIndex: 0,
      status: "playing",
      speed: state.speed,
      cameraFollowEnabled: state.cameraFollowEnabled,
      userCameraOverride: state.userCameraOverride,
    });
    applyStep(0, "restart_play");
  } else {
    state = { ...state, status: "playing", userCameraOverride: state.userCameraOverride };
    if (state.currentStepIndex <= 0) applyStep(0, "play");
  }
  logE295PlaybackStarted(sequence.signature, {
    scenarioId: sequence.scenarioId,
    stepCount: sequence.steps.length,
    speed: state.speed,
  });
  startTickTimer();
  notify();
  return state;
}

export function pauseExecutiveScenarioPlayback(): ExecutiveScenarioPlaybackState {
  stopTickTimer();
  if (state.status !== "playing") return state;
  state = { ...state, status: "paused" };
  notify();
  return state;
}

export function stopExecutiveScenarioPlayback(): ExecutiveScenarioPlaybackState {
  stopTickTimer();
  lastStepSignature = null;
  state = buildExecutiveScenarioPlaybackState({
    sequence: state.sequence,
    stepIndex: 0,
    status: "idle",
    speed: state.speed,
    cameraFollowEnabled: state.cameraFollowEnabled,
    userCameraOverride: false,
  });
  setTimelineScenarioStepIndex(null);
  notify();
  return state;
}

export function restartExecutiveScenarioPlayback(): ExecutiveScenarioPlaybackState {
  stopTickTimer();
  lastStepSignature = null;
  lastCameraSignature = null;
  state = buildExecutiveScenarioPlaybackState({
    sequence: state.sequence,
    stepIndex: 0,
    status: "idle",
    speed: state.speed,
    cameraFollowEnabled: state.cameraFollowEnabled,
    userCameraOverride: false,
  });
  applyStep(0, "restart");
  notify();
  return state;
}

export function nextExecutiveScenarioPlaybackStep(): ExecutiveScenarioPlaybackState {
  if (!state.sequence) return state;
  const next = Math.min(state.sequence.steps.length - 1, state.currentStepIndex + 1);
  applyStep(next, "next");
  if (state.status === "playing") startTickTimer();
  return state;
}

export function previousExecutiveScenarioPlaybackStep(): ExecutiveScenarioPlaybackState {
  if (!state.sequence) return state;
  const prev = Math.max(0, state.currentStepIndex - 1);
  applyStep(prev, "previous");
  if (state.status === "playing") startTickTimer();
  return state;
}

export function jumpExecutiveScenarioPlaybackToStep(stepIndex: number): ExecutiveScenarioPlaybackState {
  if (!state.sequence) return state;
  applyStep(stepIndex, "jump");
  if (state.status === "playing") startTickTimer();
  return state;
}

export function setExecutiveScenarioPlaybackSpeed(speed: ScenarioPlaybackSpeed): ExecutiveScenarioPlaybackState {
  if (state.speed === speed) return state;
  state = { ...state, speed };
  if (state.status === "playing") startTickTimer();
  notify();
  return state;
}

export function setExecutiveScenarioPlaybackCameraOverride(userCameraOverride: boolean): ExecutiveScenarioPlaybackState {
  if (state.userCameraOverride === userCameraOverride) return state;
  state = { ...state, userCameraOverride };
  notify();
  return state;
}

export function syncExecutiveScenarioPlaybackToTimelineStep(stepIndex: number): ExecutiveScenarioPlaybackState {
  if (!state.sequence) return state;
  applyStep(stepIndex, "timeline_sync");
  return state;
}

export function resetExecutiveScenarioPlaybackForTests(): void {
  stopTickTimer();
  lastStepSignature = null;
  lastCameraSignature = null;
  state = buildExecutiveScenarioPlaybackState({ sequence: null });
  listeners.clear();
}
