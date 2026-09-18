/**
 * NPA-T RMS:9 — Take Control & Human Manager Handoff tests.
 * Does not start RMS:10. One active manager authority.
 */

import assert from "node:assert/strict";
import test from "node:test";

import { NMI_FOUNDATION_CONTRACT } from "@/app/lib/nmi/nmiContract.ts";
import { VAI_CAUSAL_SAFETY_BOUNDARY } from "@/app/lib/vai/vaiCausalContract.ts";
import { RMS_4_BOUNDARY } from "./rmsManagerContract.ts";
import { RMS_8_BOUNDARY } from "./rmsWatchContract.ts";
import { RMS_9_BOUNDARY } from "./rmsHandoffContract.ts";
import { startRmsWatchSession, restartRmsWatch, switchRmsWatchScenario, getRmsWatchRuntime } from "./rmsWatchSession.ts";
import {
  requestRmsTakeControl,
  restoreRmsTakeControl,
  speakAsRmsHumanManager,
  pauseRmsTakeControlSimulation,
  resumeRmsTakeControlSimulation,
  stepRmsTakeControlSimulation,
  verifyRmsTakeControl,
  flushRmsScheduledManagerAgentTurns,
} from "./rmsHandoffRuntime.ts";
import {
  getRmsActiveManagerAuthority,
  inspectRmsGroundTruth,
  inspectRmsHandoffTrace,
  inspectRmsOperatorLedger,
  runRmsManagerConversationTurn,
  scheduleRmsManagerAgentTurn,
  setRmsManagerTurnInFlight,
  beginRmsTakeControlRequest,
  createRmsFoundationSession,
} from "./rmsSession.ts";
import { RMS_SCENARIO_MANAGER_ACTOR, RMS_SCENARIO_OBSERVER_ACTOR, RMS_SCENARIO_RUN_ACTORS } from "./rmsScenarioRunner.ts";
import { createNorthstarManufacturingWorld } from "./rmsWorldFixtures.ts";
import { RMS_REAL_CONVERSATION_ENTRY_NAME } from "./rmsManagerCc5Adapter.ts";

const observer = RMS_SCENARIO_OBSERVER_ACTOR;
const agent = RMS_SCENARIO_MANAGER_ACTOR;
const LEAK = /machineAvailability|evt:demand|evt:machine|Ground Truth|MACHINE_FAILURE|OPERATOR_ERROR|\bCC:5\b/;

test("1–12 TAKE_CONTROL lifecycle, same run, CC:5/Stage/Data continuity", () => {
  assert.equal(verifyRmsTakeControl().ok, true);
  assert.equal(RMS_9_BOUNDARY.conversationEntry, RMS_REAL_CONVERSATION_ENTRY_NAME);
  assert.equal(RMS_8_BOUNDARY.startsRms9, false);
  const watch = startRmsWatchSession({ scenarioId: "manufacturing-capacity-pressure", runId: "tc-mfg-1" });
  const runtime = getRmsWatchRuntime(watch.watchSessionId);
  const worldBefore = inspectRmsGroundTruth(runtime, observer);
  const pubsBefore = inspectRmsOperatorLedger(runtime, observer).publications.length;
  const stageBefore = watch.presentation.stage.focusedSubjectId;
  assert.throws(() => speakAsRmsHumanManager(watch.watchSessionId, "Show me the evidence."));
  const take = requestRmsTakeControl(watch.watchSessionId);
  assert.equal(take.phase, "TAKE_CONTROL");
  assert.equal(take.activeManagerAuthority, "HUMAN_MANAGER");
  assert.equal(take.handoff?.runId, watch.runId);
  assert.equal(take.handoff?.simulationId, watch.simulationId);
  assert.equal(take.handoff?.scenarioId, watch.scenarioId);
  const worldAfter = inspectRmsGroundTruth(runtime, observer);
  assert.equal(worldAfter.worldId, worldBefore.worldId);
  assert.equal(worldAfter.clock.tick, worldBefore.clock.tick);
  assert.equal(inspectRmsOperatorLedger(runtime, observer).publications.length, pubsBefore);
  assert.equal(watch.presentation.stage.focusedSubjectId, stageBefore);
  assert.equal(getRmsActiveManagerAuthority(runtime), "HUMAN_MANAGER");
  assert.match(take.summary, /taking over|active manager|Your turn/i);
  assert.doesNotMatch(take.summary, LEAK);
});

test("13–23 labels, freeze, stale turns, in-flight, idempotency, human CC:5", () => {
  const watch = startRmsWatchSession({ scenarioId: "manufacturing-capacity-pressure", runId: "tc-mfg-2" });
  const runtime = getRmsWatchRuntime(watch.watchSessionId);
  assert.ok(watch.presentation.conversation.some((item) => item.speaker === "SIMULATED_MANAGER"));
  scheduleRmsManagerAgentTurn(runtime);
  const take = requestRmsTakeControl(watch.watchSessionId);
  assert.equal(take.phase, "TAKE_CONTROL");
  assert.throws(() => runRmsManagerConversationTurn(runtime, agent));
  assert.equal(flushRmsScheduledManagerAgentTurns(runtime, agent), 0);
  const again = requestRmsTakeControl(watch.watchSessionId);
  assert.equal(again.handoff?.handoffId, take.handoff?.handoffId);
  const first = speakAsRmsHumanManager(watch.watchSessionId, "Show me the evidence.");
  assert.equal(first.humanTurns[0]?.label, "You");
  assert.equal(first.humanTurns[0]?.rewritten, false);
  const second = speakAsRmsHumanManager(watch.watchSessionId, "What can I change?");
  assert.equal(second.humanTurns.length, 2);
  assert.equal(second.humanTurns[1]?.text, "What can I change?");
  const pendingWatch = startRmsWatchSession({ scenarioId: "logistics-delivery-pressure", runId: "tc-pending" });
  const pendingRuntime = getRmsWatchRuntime(pendingWatch.watchSessionId);
  setRmsManagerTurnInFlight(pendingRuntime, true);
  const pending = requestRmsTakeControl(pendingWatch.watchSessionId);
  assert.equal(pending.phase, "HANDOFF_PENDING");
  assert.equal(getRmsActiveManagerAuthority(pendingRuntime), "MANAGER_AGENT");
  assert.throws(() => speakAsRmsHumanManager(pendingWatch.watchSessionId, "too early"));
  assert.throws(() => runRmsManagerConversationTurn(pendingRuntime, agent));
  setRmsManagerTurnInFlight(pendingRuntime, false);
  assert.equal(getRmsActiveManagerAuthority(pendingRuntime), "HUMAN_MANAGER");
  const failed = requestRmsTakeControl("missing-watch");
  assert.equal(failed.phase, "HANDOFF_FAILED");
  const unbound = createRmsFoundationSession({
    simulationId: "rms-9-fail",
    simulationType: "handoff",
    sessionId: "rms-9-fail",
    runId: "fail-run",
    host: { hostKind: "BUSINESS", hostId: "x" },
    actors: RMS_SCENARIO_RUN_ACTORS,
    groundTruth: createNorthstarManufacturingWorld(),
  });
  const failedBind = beginRmsTakeControlRequest(unbound, {
    handoffId: "h-fail",
    scenarioId: "manufacturing-capacity-pressure",
    version: "1.0",
    simulationId: "rms-9-fail",
    runId: "fail-run",
    watchSessionId: "none",
    requestedAtTick: 0,
    effectiveAtTick: null,
    previousManagerAuthority: "MANAGER_AGENT",
    nextManagerAuthority: "HUMAN_MANAGER",
    conversationRef: "executeNexoraConversationalExperience",
    stageRef: "Nexora Stage",
    dataRealityRef: "P0:1/NexoraDataRealityFoundation",
    playbackCursor: 0,
    status: "HANDOFF_PENDING",
    failureReason: null,
    customerMessage: null,
  });
  assert.equal(failedBind.status, "HANDOFF_FAILED");
  assert.equal(getRmsActiveManagerAuthority(unbound), "MANAGER_AGENT");
});

test("24–35 deictic/topic, mutation/decision bounds, privacy, observer, clock, operator", () => {
  const watch = startRmsWatchSession({ scenarioId: "manufacturing-capacity-pressure", runId: "tc-mfg-3" });
  const runtime = getRmsWatchRuntime(watch.watchSessionId);
  requestRmsTakeControl(watch.watchSessionId);
  const deictic = speakAsRmsHumanManager(watch.watchSessionId, "Tell me more about it.");
  assert.ok(deictic.humanTurns[0]?.nexoraResponse);
  speakAsRmsHumanManager(watch.watchSessionId, "Show me the project risks.");
  const approve = speakAsRmsHumanManager(watch.watchSessionId, "Approve it.");
  assert.equal(approve.humanTurns.at(-1)?.rewritten, false);
  assert.equal(RMS_4_BOUNDARY.autoApproveDecision, false);
  assert.equal(RMS_9_BOUNDARY.ownsDecision, false);
  assert.equal(RMS_9_BOUNDARY.decisionAuthority, "CC:10");
  assert.equal(RMS_9_BOUNDARY.executionAuthority, "CC:11");
  assert.equal(watch.presentation.data.every((item) => item.semanticConfirmed === false), true);
  const view = restoreRmsTakeControl(watch.watchSessionId);
  assert.doesNotMatch(JSON.stringify(view), LEAK);
  const trace = inspectRmsHandoffTrace(runtime, observer);
  assert.ok(trace.trace.some((item) => item.kind === "AUTHORITY_CHANGED"));
  assert.ok(trace.trace.some((item) => item.kind === "HUMAN_TURN"));
  assert.equal(trace.managerAgentFrozen, true);
  assert.throws(() => inspectRmsHandoffTrace(runtime, agent));
  pauseRmsTakeControlSimulation(watch.watchSessionId);
  assert.equal(inspectRmsGroundTruth(runtime, observer).paused, true);
  resumeRmsTakeControlSimulation(watch.watchSessionId);
  const pubs = inspectRmsOperatorLedger(runtime, observer).publications.length;
  stepRmsTakeControlSimulation(watch.watchSessionId);
  assert.ok(inspectRmsOperatorLedger(runtime, observer).publications.length >= pubs);
});

test("36–44 journeys, parity, switch, restart, restore, fork boundary", () => {
  const manufacturing = startRmsWatchSession({ scenarioId: "manufacturing-capacity-pressure", runId: "tc-journey-mfg" });
  requestRmsTakeControl(manufacturing.watchSessionId);
  speakAsRmsHumanManager(manufacturing.watchSessionId, "Show me the evidence.");
  const project = startRmsWatchSession({ scenarioId: "project-delivery-pressure", runId: "tc-journey-prj" });
  requestRmsTakeControl(project.watchSessionId);
  speakAsRmsHumanManager(project.watchSessionId, "Why are we behind?");
  speakAsRmsHumanManager(project.watchSessionId, "What should I investigate first?");
  const logistics = startRmsWatchSession({ scenarioId: "logistics-delivery-pressure", runId: "tc-log" });
  assert.equal(requestRmsTakeControl(logistics.watchSessionId).phase, "TAKE_CONTROL");
  const service = startRmsWatchSession({ scenarioId: "service-capacity-pressure", runId: "tc-svc" });
  assert.equal(requestRmsTakeControl(service.watchSessionId).phase, "TAKE_CONTROL");
  const switched = switchRmsWatchScenario({ fromWatchSessionId: manufacturing.watchSessionId, scenarioId: "project-delivery-pressure" });
  assert.equal(restoreRmsTakeControl(manufacturing.watchSessionId), null);
  assert.equal(getRmsActiveManagerAuthority(getRmsWatchRuntime(switched.watchSessionId)), "MANAGER_AGENT");
  const owned = startRmsWatchSession({ scenarioId: "service-capacity-pressure", runId: "tc-restart" });
  requestRmsTakeControl(owned.watchSessionId);
  const restarted = restartRmsWatch(owned.watchSessionId);
  assert.equal(getRmsActiveManagerAuthority(getRmsWatchRuntime(restarted.watchSessionId)), "MANAGER_AGENT");
  assert.equal(restoreRmsTakeControl(owned.watchSessionId)?.phase !== "TAKE_CONTROL", true);
  const restoreWatch = startRmsWatchSession({ scenarioId: "logistics-delivery-pressure", runId: "tc-restore" });
  requestRmsTakeControl(restoreWatch.watchSessionId);
  const restored = restoreRmsTakeControl(restoreWatch.watchSessionId);
  assert.equal(restored?.activeManagerAuthority, "HUMAN_MANAGER");
  assert.equal(RMS_9_BOUNDARY.forkCompatible, true);
  assert.equal(RMS_9_BOUNDARY.startsRms10, false);
  assert.equal(NMI_FOUNDATION_CONTRACT.copiesCanonicalEntities, false);
  assert.equal(VAI_CAUSAL_SAFETY_BOUNDARY.parallelCausalTruthStore, false);
});
