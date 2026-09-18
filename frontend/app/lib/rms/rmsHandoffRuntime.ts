/**
 * NPA-T RMS:9 — Take Control on an existing RMS:8 WATCH run.
 * Does not restart the Scenario. Does not create a second Nexora.
 */

import { RMS_4_BOUNDARY } from "./rmsManagerContract.ts";
import { RMS_9_BOUNDARY, type RmsManagerHandoff, type RmsTakeControlView } from "./rmsHandoffContract.ts";
import {
  beginRmsTakeControlRequest,
  flushRmsScheduledManagerAgentTurns,
  getRmsActiveManagerAuthority,
  getRmsHandoffPhase,
  inspectRmsGroundTruth,
  inspectRmsHandoffTrace,
  pauseRmsGroundTruth,
  runRmsHumanManagerTurn,
  runRmsOperatorObservation,
  stepRmsEventSchedule,
  publishRmsOperatorObservableData,
} from "./rmsSession.ts";
import { getRmsWatchRuntime, getRmsWatchSession, hasRmsWatchRuntime, pauseRmsWatch } from "./rmsWatchSession.ts";
import { RMS_SCENARIO_OBSERVER_ACTOR, RMS_SCENARIO_OPERATOR_ACTOR, RMS_SCENARIO_RUN_ACTORS } from "./rmsScenarioRunner.ts";
import { assertRmsWatchCustomerSafe } from "./rmsWatchProjection.ts";

import { setRmsTakeControlView, getStoredRmsTakeControlView, deleteRmsTakeControlView } from "./rmsHandoffStore.ts";

const human = RMS_SCENARIO_RUN_ACTORS.find((actor) => actor.kind === "REAL_MANAGER")!;
const operator = RMS_SCENARIO_OPERATOR_ACTOR;
const observer = RMS_SCENARIO_OBSERVER_ACTOR;

function viewOf(watchSessionId: string, extras: Partial<RmsTakeControlView> & Pick<RmsTakeControlView, "phase" | "activeManagerAuthority">): RmsTakeControlView {
  const previous = getStoredRmsTakeControlView(watchSessionId);
  const next: RmsTakeControlView = Object.freeze({
    watchSessionId,
    phase: extras.phase,
    activeManagerAuthority: extras.activeManagerAuthority,
    handoff: extras.handoff ?? previous?.handoff ?? null,
    humanTurns: extras.humanTurns ?? previous?.humanTurns ?? Object.freeze([]),
    summary: extras.summary ?? previous?.summary ?? "",
    simulationPaused: extras.simulationPaused ?? previous?.simulationPaused ?? true,
    takeControlImplemented: true,
    forkCompatible: true,
  });
  return setRmsTakeControlView(next);
}

function customerSummary(watchSessionId: string): string {
  const watch = getRmsWatchSession(watchSessionId);
  const lastSimulated = [...watch.presentation.conversation].reverse().find((item) => item.speaker === "SIMULATED_MANAGER");
  const focus = watch.presentation.stage.focusedSubjectLabel;
  const summary = [
    "You are taking over this management situation.",
    watch.presentation.whatChanged,
    lastSimulated ? `Last Simulated Manager question: “${lastSimulated.text}”` : "The Simulated Manager has not asked a question yet.",
    focus ? `Nexora is currently focused on ${focus}.` : "Nexora has the current conversation context.",
    "Your turn. Ask Nexora what you want to investigate next.",
  ].join(" ");
  assertRmsWatchCustomerSafe({ summary });
  return summary;
}

export function requestRmsTakeControl(watchSessionId: string): RmsTakeControlView {
  if (RMS_9_BOUNDARY.restartsScenarioOnHandoff) throw new Error("RMS:9 must not restart the Scenario");
  if (RMS_9_BOUNDARY.parallelNexora) throw new Error("RMS:9 must not create a second Nexora");
  const existing = getStoredRmsTakeControlView(watchSessionId);
  if (existing?.phase === "TAKE_CONTROL" && existing.activeManagerAuthority === "HUMAN_MANAGER") {
    return existing;
  }
  try {
    pauseRmsWatch(watchSessionId);
  } catch {
    return viewOf(watchSessionId, {
      phase: "HANDOFF_FAILED",
      activeManagerAuthority: "MANAGER_AGENT",
      handoff: null,
      summary: "Take Control could not finish. You remain in Watch.",
    });
  }
  if (!hasRmsWatchRuntime(watchSessionId)) {
    return viewOf(watchSessionId, {
      phase: "HANDOFF_FAILED",
      activeManagerAuthority: "MANAGER_AGENT",
      handoff: null,
      summary: "Take Control could not finish. You remain in Watch.",
    });
  }
  const watch = getRmsWatchSession(watchSessionId);
  const runtime = getRmsWatchRuntime(watchSessionId);
  const draft: RmsManagerHandoff = Object.freeze({
    handoffId: `${watch.runId}:handoff`,
    scenarioId: watch.scenarioId,
    version: watch.version,
    simulationId: watch.simulationId,
    runId: watch.runId,
    watchSessionId,
    requestedAtTick: inspectRmsGroundTruth(runtime, observer).clock.tick,
    effectiveAtTick: null,
    previousManagerAuthority: "MANAGER_AGENT",
    nextManagerAuthority: "HUMAN_MANAGER",
    conversationRef: "executeNexoraConversationalExperience",
    stageRef: "Nexora Stage",
    dataRealityRef: "P0:1/NexoraDataRealityFoundation",
    playbackCursor: watch.cursor,
    status: "HANDOFF_PENDING",
    failureReason: null,
    customerMessage: "You are taking over this management situation.",
  });
  const handoff = beginRmsTakeControlRequest(runtime, draft);
  if (handoff.status === "TAKE_CONTROL") {
    pauseRmsGroundTruth(runtime, operator, true);
  }
  const summary = handoff.status === "HANDOFF_FAILED" ? handoff.customerMessage ?? "Take Control could not finish." : customerSummary(watchSessionId);
  if (handoff.status === "TAKE_CONTROL") assertRmsWatchCustomerSafe({ summary, handoffStatus: handoff.status });
  return viewOf(watchSessionId, {
    phase: handoff.status,
    activeManagerAuthority: getRmsActiveManagerAuthority(runtime),
    handoff,
    humanTurns: inspectRmsHandoffTrace(runtime, observer).humanTurns,
    summary,
    simulationPaused: true,
  });
}

export function getRmsTakeControlView(watchSessionId: string): RmsTakeControlView | null {
  return getStoredRmsTakeControlView(watchSessionId);
}

export function restoreRmsTakeControl(watchSessionId: string): RmsTakeControlView | null {
  if (!hasRmsWatchRuntime(watchSessionId)) return getStoredRmsTakeControlView(watchSessionId);
  const runtime = getRmsWatchRuntime(watchSessionId);
  const phase = getRmsHandoffPhase(runtime);
  const authority = getRmsActiveManagerAuthority(runtime);
  return viewOf(watchSessionId, {
    phase,
    activeManagerAuthority: authority,
    handoff: inspectRmsHandoffTrace(runtime, observer).handoff,
    humanTurns: inspectRmsHandoffTrace(runtime, observer).humanTurns,
    simulationPaused: inspectRmsGroundTruth(runtime, observer).paused,
  });
}

export function speakAsRmsHumanManager(watchSessionId: string, utterance: string) {
  const runtime = getRmsWatchRuntime(watchSessionId);
  if (getRmsHandoffPhase(runtime) !== "TAKE_CONTROL" || getRmsActiveManagerAuthority(runtime) !== "HUMAN_MANAGER") {
    throw new Error("RMS:9 Human Manager cannot submit before successful handoff");
  }
  if (RMS_4_BOUNDARY.confirmationBypass || RMS_9_BOUNDARY.mutationBypass) {
    throw new Error("RMS:9 must not bypass mutation safety");
  }
  const previous = getStoredRmsTakeControlView(watchSessionId);
  runRmsHumanManagerTurn(runtime, human, utterance);
  return viewOf(watchSessionId, {
    phase: "TAKE_CONTROL",
    activeManagerAuthority: "HUMAN_MANAGER",
    humanTurns: inspectRmsHandoffTrace(runtime, observer).humanTurns,
    summary: previous?.summary ?? "",
  });
}

export function pauseRmsTakeControlSimulation(watchSessionId: string): RmsTakeControlView {
  const runtime = getRmsWatchRuntime(watchSessionId);
  pauseRmsGroundTruth(runtime, operator, true);
  return viewOf(watchSessionId, {
    phase: getRmsHandoffPhase(runtime),
    activeManagerAuthority: getRmsActiveManagerAuthority(runtime),
    simulationPaused: true,
  });
}

export function resumeRmsTakeControlSimulation(watchSessionId: string): RmsTakeControlView {
  const runtime = getRmsWatchRuntime(watchSessionId);
  pauseRmsGroundTruth(runtime, operator, false);
  return viewOf(watchSessionId, {
    phase: getRmsHandoffPhase(runtime),
    activeManagerAuthority: getRmsActiveManagerAuthority(runtime),
    simulationPaused: false,
  });
}

export function stepRmsTakeControlSimulation(watchSessionId: string): RmsTakeControlView {
  const runtime = getRmsWatchRuntime(watchSessionId);
  pauseRmsGroundTruth(runtime, operator, false);
  const tick = inspectRmsGroundTruth(runtime, observer).clock.tick;
  stepRmsEventSchedule(runtime, operator, tick + 1);
  const records = runRmsOperatorObservation(runtime, operator);
  publishRmsOperatorObservableData(runtime, operator, records);
  return viewOf(watchSessionId, {
    phase: getRmsHandoffPhase(runtime),
    activeManagerAuthority: getRmsActiveManagerAuthority(runtime),
    simulationPaused: false,
  });
}

export function closeRmsTakeControl(watchSessionId: string): void {
  deleteRmsTakeControlView(watchSessionId);
}

export function verifyRmsTakeControl(): { readonly ok: true } {
  if (RMS_9_BOUNDARY.ownsStage || RMS_9_BOUNDARY.ownsAdvisor) throw new Error("RMS:9 must not own Stage/Advisor");
  if (RMS_9_BOUNDARY.startsRms10) throw new Error("RMS:9 must not start RMS:10");
  if (RMS_9_BOUNDARY.ownsDecision || RMS_9_BOUNDARY.ownsExecution) throw new Error("RMS:9 must not own Decision/Execution");
  return Object.freeze({ ok: true as const });
}

export { flushRmsScheduledManagerAgentTurns, human as RMS_HUMAN_MANAGER_ACTOR };
