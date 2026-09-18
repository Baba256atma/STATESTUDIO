/**
 * NPA-T RMS:10 — Experiment, Fork & comparison tests.
 * Does not start RMS:11. Simulation Outcome ≠ real-world prediction.
 */

import assert from "node:assert/strict";
import test from "node:test";

import { NMI_FOUNDATION_CONTRACT } from "@/app/lib/nmi/nmiContract.ts";
import { VAI_CAUSAL_SAFETY_BOUNDARY } from "@/app/lib/vai/vaiCausalContract.ts";
import { RMS_4_BOUNDARY } from "./rmsManagerContract.ts";
import { RMS_8_BOUNDARY } from "./rmsWatchContract.ts";
import { RMS_9_BOUNDARY } from "./rmsHandoffContract.ts";
import { RMS_10_BOUNDARY, RMS_SIMULATION_REAL_WORLD_NOTICE } from "./rmsExperimentContract.ts";
import { RMS_REAL_CONVERSATION_ENTRY_NAME } from "./rmsManagerCc5Adapter.ts";
import { startRmsWatchSession, getRmsWatchRuntime, restartRmsWatch } from "./rmsWatchSession.ts";
import { requestRmsTakeControl } from "./rmsHandoffRuntime.ts";
import {
  compareRmsExperiment,
  createRmsExperimentBranch,
  getRmsExperimentBranchSession,
  getRmsExperimentParentSession,
  requestRmsBranchSimulationAction,
  restartRmsExperimentBranch,
  selectRmsExperimentBranch,
  speakOnRmsExperimentBranch,
  startRmsExperiment,
  stepRmsExperimentBranch,
  verifyRmsExperiment,
} from "./rmsExperimentRuntime.ts";
import {
  inspectRmsEventSchedule,
  inspectRmsExperimentTrace,
  inspectRmsGroundTruth,
  inspectRmsHandoffTrace,
  isRmsManagerTurnInFlight,
  setRmsManagerTurnInFlight,
} from "./rmsSession.ts";
import { RMS_SCENARIO_OBSERVER_ACTOR } from "./rmsScenarioRunner.ts";
import { listRmsScenarioActionModels } from "./rmsSimulationActionModels.ts";

const observer = RMS_SCENARIO_OBSERVER_ACTOR;
const LEAK = /machineAvailability|evt:demand|evt:machine|Ground Truth|MACHINE_FAILURE|OPERATOR_ERROR|\bCC:5\b|Observer diagnostics/;

function values(session: Parameters<typeof inspectRmsGroundTruth>[0]) {
  return Object.fromEntries(inspectRmsGroundTruth(session, observer).variables.map((item) => [item.key, item.value]));
}

function takeControl(scenarioId: string, runId: string) {
  const watch = startRmsWatchSession({ scenarioId, runId });
  const control = requestRmsTakeControl(watch.watchSessionId);
  assert.equal(control.phase, "TAKE_CONTROL");
  return watch;
}

test("1–20 EXPERIMENT fork isolation, parent preserved, inherited events", () => {
  assert.equal(verifyRmsExperiment().ok, true);
  assert.equal(RMS_10_BOUNDARY.interactionMode, "EXPERIMENT");
  assert.equal(RMS_10_BOUNDARY.conversationEntry, RMS_REAL_CONVERSATION_ENTRY_NAME);
  assert.equal(RMS_9_BOUNDARY.startsRms10, false);
  const watch = takeControl("manufacturing-capacity-pressure", "exp-mfg-1");
  const parent = getRmsWatchRuntime(watch.watchSessionId);
  setRmsManagerTurnInFlight(parent, true);
  assert.equal(isRmsManagerTurnInFlight(parent), true);
  assert.throws(() => startRmsExperiment(watch.watchSessionId));
  setRmsManagerTurnInFlight(parent, false);
  const parentWorld = inspectRmsGroundTruth(parent, observer);
  const parentTick = parentWorld.clock.tick;
  const parentCapacity = values(parent).availableCapacity;
  const experiment = startRmsExperiment(watch.watchSessionId);
  assert.equal(experiment.experiment.lifecycle, "FORKED");
  assert.equal(experiment.pausedAtFork, true);
  assert.equal(experiment.experiment.scenarioId, watch.scenarioId);
  assert.equal(experiment.experiment.version, watch.version);
  assert.equal(experiment.experiment.parentRunId, watch.runId);
  assert.equal(experiment.forkPoint.tick, parentTick);
  const again = startRmsExperiment(watch.watchSessionId);
  assert.equal(again.experiment.experimentId, experiment.experiment.experimentId);
  createRmsExperimentBranch(experiment.experiment.experimentId, { label: "Temporary Capacity" });
  const external = createRmsExperimentBranch(experiment.experiment.experimentId, { label: "External Production" });
  assert.equal(external.branches.length, 3);
  assert.throws(() => createRmsExperimentBranch(experiment.experiment.experimentId, { label: "Fourth" }));
  const [baseline, pathB, pathC] = external.branches;
  assert.ok(baseline && pathB && pathC);
  assert.equal(baseline.label, "No New Intervention");
  assert.notEqual(baseline.runId, pathB.runId);
  assert.notEqual(baseline.worldId, pathB.worldId);
  const sessionA = getRmsExperimentBranchSession(experiment.experiment.experimentId, baseline.branchId);
  const sessionB = getRmsExperimentBranchSession(experiment.experiment.experimentId, pathB.branchId);
  assert.deepEqual(values(sessionA), values(sessionB));
  assert.equal(inspectRmsGroundTruth(sessionA, observer).clock.tick, inspectRmsGroundTruth(sessionB, observer).clock.tick);
  const eventsA = inspectRmsEventSchedule(sessionA, observer).runtime?.schedule.map((item) => item.eventId);
  const eventsB = inspectRmsEventSchedule(sessionB, observer).runtime?.schedule.map((item) => item.eventId);
  assert.deepEqual(eventsA, eventsB);
  requestRmsBranchSimulationAction({
    experimentId: experiment.experiment.experimentId,
    branchId: pathB.branchId,
    actionType: "TEMP_EXTERNAL_CAPACITY",
    sourceManagementActionRef: "human:capacity",
  });
  stepRmsExperimentBranch(experiment.experiment.experimentId, baseline.branchId, 2);
  stepRmsExperimentBranch(experiment.experiment.experimentId, pathB.branchId, 2);
  const afterA = values(getRmsExperimentBranchSession(experiment.experiment.experimentId, baseline.branchId));
  const afterB = values(getRmsExperimentBranchSession(experiment.experiment.experimentId, pathB.branchId));
  assert.equal(afterB.availableCapacity, (afterA.availableCapacity as number) + 20);
  const parentAfter = getRmsExperimentParentSession(experiment.experiment.experimentId);
  assert.equal(inspectRmsGroundTruth(parentAfter, observer).clock.tick, parentTick);
  assert.equal(values(parentAfter).availableCapacity, parentCapacity);
  assert.notEqual(sessionA.identity.runId, sessionB.identity.runId);
  assert.notEqual(inspectRmsGroundTruth(sessionA, observer).worldId, inspectRmsGroundTruth(sessionB, observer).worldId);
});

test("21–35 human CC:5, action provenance, replay, switch, conversation isolation", () => {
  const watch = takeControl("manufacturing-capacity-pressure", "exp-mfg-2");
  const experiment = startRmsExperiment(watch.watchSessionId);
  const added = createRmsExperimentBranch(experiment.experiment.experimentId, { label: "Temporary Capacity" });
  const branchB = added.branches.find((item) => item.kind === "INTERVENTION")!;
  const baseline = added.experiment.baselineBranchId;
  const spoken = speakOnRmsExperimentBranch(experiment.experiment.experimentId, branchB.branchId, "Approve temporary capacity.");
  assert.equal(spoken.rewritten, false);
  assert.equal(spoken.createdDecision, false);
  assert.equal(spoken.startedExecution, false);
  assert.equal(RMS_4_BOUNDARY.autoApproveDecision, false);
  assert.equal(RMS_10_BOUNDARY.decisionAuthority, "CC:10");
  assert.equal(RMS_10_BOUNDARY.executionAuthority, "CC:11");
  const action = requestRmsBranchSimulationAction({
    experimentId: experiment.experiment.experimentId,
    branchId: branchB.branchId,
    actionType: "TEMP_EXTERNAL_CAPACITY",
    sourceManagementActionRef: spoken.turn.turnIndex.toString(),
  });
  assert.equal(action.provenance, "management-action");
  assert.equal(action.vaiProvenCausality, false);
  assert.equal(listRmsScenarioActionModels("manufacturing-capacity-pressure")[0]?.delta, 20);
  const unsupported = requestRmsBranchSimulationAction({
    experimentId: experiment.experiment.experimentId,
    branchId: branchB.branchId,
    actionType: "HIRE_UNMODELED_FLEET",
    sourceManagementActionRef: "human:unmodeled",
  });
  assert.equal(unsupported.status, "UNSUPPORTED");
  const beforeUnsupported = values(getRmsExperimentBranchSession(experiment.experiment.experimentId, branchB.branchId));
  assert.equal(unsupported.delta, 0);
  stepRmsExperimentBranch(experiment.experiment.experimentId, branchB.branchId, 2);
  const after = values(getRmsExperimentBranchSession(experiment.experiment.experimentId, branchB.branchId));
  assert.equal(after.availableCapacity, (beforeUnsupported.availableCapacity as number) + 20);
  const replayValues = { ...after };
  restartRmsExperimentBranch(experiment.experiment.experimentId, branchB.branchId);
  requestRmsBranchSimulationAction({
    experimentId: experiment.experiment.experimentId,
    branchId: branchB.branchId,
    actionType: "TEMP_EXTERNAL_CAPACITY",
    sourceManagementActionRef: "human:capacity-replay",
  });
  stepRmsExperimentBranch(experiment.experiment.experimentId, branchB.branchId, 2);
  assert.deepEqual(values(getRmsExperimentBranchSession(experiment.experiment.experimentId, branchB.branchId)).availableCapacity, replayValues.availableCapacity);
  speakOnRmsExperimentBranch(experiment.experiment.experimentId, branchB.branchId, "Stay on capacity.");
  speakOnRmsExperimentBranch(experiment.experiment.experimentId, baseline, "Stay on the current path.");
  const switched = selectRmsExperimentBranch(experiment.experiment.experimentId, branchB.branchId);
  assert.equal(switched.experiment.selectedBranchId, branchB.branchId);
  const turnsB = inspectRmsHandoffTrace(getRmsExperimentBranchSession(experiment.experiment.experimentId, branchB.branchId), observer).humanTurns.map((item) => item.text);
  const turnsA = inspectRmsHandoffTrace(getRmsExperimentBranchSession(experiment.experiment.experimentId, baseline), observer).humanTurns.map((item) => item.text);
  assert.equal(turnsB.includes("Stay on the current path."), false);
  assert.equal(turnsA.includes("Stay on capacity."), false);
  assert.ok(switched.branches.find((item) => item.branchId === branchB.branchId)?.inheritedTurnCount);
  assert.equal(RMS_10_BOUNDARY.ownsVai, false);
  assert.equal(RMS_10_BOUNDARY.ownsNps, false);
  assert.equal(VAI_CAUSAL_SAFETY_BOUNDARY.parallelCausalTruthStore, false);
});

test("36–40 comparison, privacy, no winner, no Outcome/Learning", () => {
  const watch = takeControl("manufacturing-capacity-pressure", "exp-mfg-3");
  const experiment = startRmsExperiment(watch.watchSessionId);
  const compared = compareRmsExperiment(experiment.experiment.experimentId);
  assert.equal(compared.comparison?.winner, null);
  assert.equal(compared.comparison?.bestPath, null);
  assert.equal(compared.comparison?.canonicalOutcome, false);
  assert.equal(compared.comparison?.durableLearning, false);
  assert.equal(compared.comparison?.observerDiagnostics, false);
  assert.equal(compared.customerNotice, RMS_SIMULATION_REAL_WORLD_NOTICE);
  assert.match(compared.comparison?.explanation.join(" ") ?? "", /simulated consequences|not predictions/i);
  assert.doesNotMatch(JSON.stringify(compared.comparison), LEAK);
  assert.equal(compared.comparison?.rows.every((row) => row.experimentId === experiment.experiment.experimentId && row.branchId && row.runId), true);
  assert.equal(RMS_10_BOUNDARY.writesCanonicalOutcome, false);
  assert.equal(RMS_10_BOUNDARY.writesDurableLearning, false);
});

test("41–50 manufacturing/project/logistics/service, restart, parent, trace, RMS:1–9 boundary", () => {
  const manufacturing = takeControl("manufacturing-capacity-pressure", "exp-mfg-4");
  const live = startRmsExperiment(manufacturing.watchSessionId);
  createRmsExperimentBranch(live.experiment.experimentId, { label: "Temporary Capacity" });
  const live3 = createRmsExperimentBranch(live.experiment.experimentId, { label: "External Production" });
  const b = live3.branches;
  requestRmsBranchSimulationAction({
    experimentId: live.experiment.experimentId,
    branchId: b[1]!.branchId,
    actionType: "TEMP_EXTERNAL_CAPACITY",
    sourceManagementActionRef: "mfg-b",
  });
  requestRmsBranchSimulationAction({
    experimentId: live.experiment.experimentId,
    branchId: b[2]!.branchId,
    actionType: "EXTERNAL_PRODUCTION",
    sourceManagementActionRef: "mfg-c",
  });
  stepRmsExperimentBranch(live.experiment.experimentId, b[0]!.branchId, 3);
  stepRmsExperimentBranch(live.experiment.experimentId, b[1]!.branchId, 3);
  stepRmsExperimentBranch(live.experiment.experimentId, b[2]!.branchId, 3);
  const table = compareRmsExperiment(live.experiment.experimentId);
  assert.equal(table.branches.length, 3);
  assert.equal(table.comparison?.winner, null);
  const projectWatch = takeControl("project-delivery-pressure", "exp-prj");
  const project = startRmsExperiment(projectWatch.watchSessionId);
  const add = createRmsExperimentBranch(project.experiment.experimentId, { label: "Add Resource" });
  requestRmsBranchSimulationAction({
    experimentId: project.experiment.experimentId,
    branchId: add.branches[1]!.branchId,
    actionType: "ADD_PROJECT_RESOURCE",
    sourceManagementActionRef: "prj-resource",
  });
  stepRmsExperimentBranch(project.experiment.experimentId, add.branches[0]!.branchId, 1);
  stepRmsExperimentBranch(project.experiment.experimentId, add.branches[1]!.branchId, 1);
  assert.equal(
    values(getRmsExperimentBranchSession(project.experiment.experimentId, add.branches[1]!.branchId)).staffAvailable,
    (values(getRmsExperimentBranchSession(project.experiment.experimentId, add.branches[0]!.branchId)).staffAvailable as number) + 3,
  );
  const logistics = takeControl("logistics-delivery-pressure", "exp-log");
  const logExp = startRmsExperiment(logistics.watchSessionId);
  const logBranch = createRmsExperimentBranch(logExp.experiment.experimentId, { label: "Expedite inbound" });
  requestRmsBranchSimulationAction({
    experimentId: logExp.experiment.experimentId,
    branchId: logBranch.branches[1]!.branchId,
    actionType: "EXPEDITE_INBOUND",
    sourceManagementActionRef: "log-act",
  });
  stepRmsExperimentBranch(logExp.experiment.experimentId, logBranch.branches[1]!.branchId, 1);
  const service = takeControl("service-capacity-pressure", "exp-svc");
  const svc = createRmsExperimentBranch(startRmsExperiment(service.watchSessionId).experiment.experimentId, { label: "Add shift" });
  requestRmsBranchSimulationAction({
    experimentId: svc.experiment.experimentId,
    branchId: svc.branches[1]!.branchId,
    actionType: "ADD_SHIFT",
    sourceManagementActionRef: "svc-act",
  });
  stepRmsExperimentBranch(svc.experiment.experimentId, svc.branches[1]!.branchId, 1);
  const capBeforeRestart = values(getRmsExperimentBranchSession(live.experiment.experimentId, b[1]!.branchId)).availableCapacity;
  const restarted = restartRmsExperimentBranch(live.experiment.experimentId, b[1]!.branchId);
  assert.equal(values(getRmsExperimentBranchSession(live.experiment.experimentId, restarted.experiment.selectedBranchId)).availableCapacity, values(getRmsExperimentParentSession(live.experiment.experimentId)).availableCapacity);
  assert.notEqual(capBeforeRestart, values(getRmsExperimentBranchSession(live.experiment.experimentId, b[1]!.branchId)).availableCapacity);
  const trace = inspectRmsExperimentTrace(getRmsExperimentBranchSession(live.experiment.experimentId, b[1]!.branchId), observer);
  assert.equal(trace.customerVisible, false);
  const kinds = inspectRmsExperimentTrace(getRmsExperimentBranchSession(live.experiment.experimentId, b[2]!.branchId), observer).events.map((item) => item.kind);
  assert.ok(kinds.includes("BRANCH_CREATED"));
  assert.equal(RMS_8_BOUNDARY.experimentImplemented, false);
  assert.equal(RMS_10_BOUNDARY.startsRms11, false);
  assert.equal(NMI_FOUNDATION_CONTRACT.copiesCanonicalEntities, false);
  restartRmsWatch(manufacturing.watchSessionId);
  assert.throws(() => getRmsExperimentBranchSession(live.experiment.experimentId, b[0]!.branchId));
});
