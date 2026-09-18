/**
 * NPA-T RMS:FINAL — architecture review and end-to-end certification.
 * Does not start RMS:11. Audit first; no new simulation features.
 */

import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { executeNexoraConversationalExperience } from "@/app/lib/conversational-control/conversationalExperienceOrchestrator.ts";
import { NMI_FOUNDATION_CONTRACT } from "@/app/lib/nmi/nmiContract.ts";
import { VAI_CAUSAL_SAFETY_BOUNDARY } from "@/app/lib/vai/vaiCausalContract.ts";
import { RMS_AUTHORITY_BOUNDARY, verifyRmsAuthorityBoundary } from "./rmsAuthorityBoundary.ts";
import { RMS_FOUNDATION_CONTRACT } from "./rmsFoundationContract.ts";
import { RMS_2_BOUNDARY } from "./rmsWorldContract.ts";
import { RMS_3_BOUNDARY } from "./rmsOperatorContract.ts";
import { RMS_4_BOUNDARY } from "./rmsManagerContract.ts";
import { RMS_5_BOUNDARY, RMS_OBSERVER_TAXONOMY } from "./rmsObserverContract.ts";
import { RMS_6_BOUNDARY } from "./rmsEventContract.ts";
import { RMS_7_BOUNDARY, RMS_SCENARIO_FORBIDDEN_KEYS } from "./rmsScenarioContract.ts";
import { RMS_8_BOUNDARY } from "./rmsWatchContract.ts";
import { RMS_9_BOUNDARY } from "./rmsHandoffContract.ts";
import { RMS_10_BOUNDARY, RMS_SIMULATION_REAL_WORLD_NOTICE } from "./rmsExperimentContract.ts";
import { RMS_FINAL_BOUNDARY, RMS_V1_INVARIANTS } from "./rmsFinalContract.ts";
import { RMS_REAL_CONVERSATION_ENTRY, RMS_REAL_CONVERSATION_ENTRY_NAME } from "./rmsManagerCc5Adapter.ts";
import { listRmsScenarios } from "./rmsScenarioRegistry.ts";
import { instantiateHybridTemplate } from "./rmsWorldTemplates.ts";
import { startRmsWatchSession, getRmsWatchRuntime, restartRmsWatch, switchRmsWatchScenario, playRmsWatch, pauseRmsWatch } from "./rmsWatchSession.ts";
import { requestRmsTakeControl, speakAsRmsHumanManager, verifyRmsTakeControl } from "./rmsHandoffRuntime.ts";
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
import { verifyRmsWatchExperience, assertRmsWatchCustomerSafe } from "./rmsWatchProjection.ts";
import { verifyRmsFoundation } from "./rmsFoundation.ts";
import { verifyRmsGroundTruthWorld } from "./rmsWorldEngine.ts";
import { verifyRmsOperatorObservable } from "./rmsOperatorRuntime.ts";
import { verifyRmsManagerConversation } from "./rmsManagerRuntime.ts";
import { verifyRmsObserverIntelligence } from "./rmsObserverMeasurement.ts";
import { verifyRmsEventsDisturbances } from "./rmsEventRuntime.ts";
import { verifyRmsScenarioLibrary } from "./rmsScenarioValidation.ts";
import {
  applyRmsGroundTruthEvents,
  flushRmsScheduledManagerAgentTurns,
  getRmsActiveManagerAuthority,
  inspectRmsGroundTruth,
  inspectRmsHandoffTrace,
  inspectRmsOperatorLedger,
  measureRmsObserverIntelligence,
  readRmsNexoraKnowledge,
  scheduleRmsManagerAgentTurn,
} from "./rmsSession.ts";
import { RMS_SCENARIO_MANAGER_ACTOR, RMS_SCENARIO_OBSERVER_ACTOR, RMS_SCENARIO_RUN_ACTORS } from "./rmsScenarioRunner.ts";
import { NORTHSTAR_DEMAND_EVENT } from "./rmsWorldFixtures.ts";

const observer = RMS_SCENARIO_OBSERVER_ACTOR;
const agent = RMS_SCENARIO_MANAGER_ACTOR;
const human = RMS_SCENARIO_RUN_ACTORS.find((actor) => actor.kind === "REAL_MANAGER")!;
const here = dirname(fileURLToPath(import.meta.url));
const LEAK = /machineAvailability|evt:demand|evt:machine|Ground Truth|MACHINE_FAILURE|OPERATOR_ERROR|CAUSAL_OVERCLAIM|\bCC:5\b|\bRDI:/;

function gtValues(session: Parameters<typeof inspectRmsGroundTruth>[0]) {
  return Object.fromEntries(inspectRmsGroundTruth(session, observer).variables.map((item) => [item.key, item.value]));
}

test("RMS:FINAL verifies RMS:1–10 as one system without starting RMS:11", () => {
  assert.equal(verifyRmsFoundation().ok, true);
  assert.equal(verifyRmsAuthorityBoundary().ok, true);
  assert.equal(verifyRmsGroundTruthWorld().ok, true);
  assert.equal(verifyRmsOperatorObservable().ok, true);
  assert.equal(verifyRmsManagerConversation().ok, true);
  assert.equal(verifyRmsObserverIntelligence().ok, true);
  assert.equal(verifyRmsEventsDisturbances().ok, true);
  assert.equal(verifyRmsScenarioLibrary().ok, true);
  assert.equal(verifyRmsWatchExperience().ok, true);
  assert.equal(verifyRmsTakeControl().ok, true);
  assert.equal(verifyRmsExperiment().ok, true);
  assert.equal(RMS_FINAL_BOUNDARY.startsRms11, false);
  assert.equal(RMS_V1_INVARIANTS.length, 30);
  assert.equal(RMS_AUTHORITY_BOUNDARY.d7OperationalGraph.includes("not RMS Ground Truth"), true);
  assert.equal(RMS_AUTHORITY_BOUNDARY.decision, "CC:10");
  assert.equal(RMS_AUTHORITY_BOUNDARY.execution, "CC:11");
  assert.equal(RMS_AUTHORITY_BOUNDARY.learning, "CORE-OUT:2 / ECA:12");
  assert.equal(RMS_REAL_CONVERSATION_ENTRY, executeNexoraConversationalExperience);
  assert.equal(RMS_REAL_CONVERSATION_ENTRY_NAME, "executeNexoraConversationalExperience");
});

test("authority map: RMS does not own canonical Nexora intelligence", () => {
  assert.equal(RMS_2_BOUNDARY.ownsNmiSemantics, false);
  assert.equal(RMS_2_BOUNDARY.ownsVaiRoles, false);
  assert.equal(RMS_3_BOUNDARY.ownsDecision, false);
  assert.equal(RMS_4_BOUNDARY.ownsDecision, false);
  assert.equal(RMS_4_BOUNDARY.conversationEntry, "executeNexoraConversationalExperience");
  assert.equal(RMS_5_BOUNDARY.ownsRepair, false);
  assert.equal(RMS_6_BOUNDARY.injectsProblemObjects, false);
  assert.equal(RMS_6_BOUNDARY.injectsRiskObjects, false);
  assert.equal(RMS_7_BOUNDARY.encodesExpectedNexoraAnswer, false);
  assert.equal(RMS_8_BOUNDARY.ownsStage, false);
  assert.equal(RMS_9_BOUNDARY.ownsAdvisor, false);
  assert.equal(RMS_10_BOUNDARY.ownsVai, false);
  assert.equal(RMS_10_BOUNDARY.ownsNps, false);
  assert.equal(RMS_10_BOUNDARY.ownsNmi, false);
  assert.equal(NMI_FOUNDATION_CONTRACT.copiesCanonicalEntities, false);
  assert.equal(VAI_CAUSAL_SAFETY_BOUNDARY.parallelCausalTruthStore, false);
  assert.equal(RMS_FOUNDATION_CONTRACT.privilegedSimulationNexora, false);
});

test("information firewall and Ground Truth access", () => {
  const watch = startRmsWatchSession({ scenarioId: "manufacturing-capacity-pressure", runId: "final-gt" });
  const runtime = getRmsWatchRuntime(watch.watchSessionId);
  const nexora = runtime.actors.find((actor) => actor.kind === "NEXORA")!;
  assert.throws(() => inspectRmsGroundTruth(runtime, agent));
  assert.throws(() => inspectRmsGroundTruth(runtime, human));
  assert.throws(() => inspectRmsGroundTruth(runtime, nexora));
  const truth = inspectRmsGroundTruth(runtime, observer);
  assert.equal(truth.publishedToNexoraKnowledge, false);
  assert.doesNotMatch(JSON.stringify(readRmsNexoraKnowledge(runtime)), /world:northstar|machineAvailability/);
  assert.doesNotMatch(JSON.stringify(watch.presentation), LEAK);
  assert.throws(() => applyRmsGroundTruthEvents(runtime, observer, [NORTHSTAR_DEMAND_EVENT]));
  assert.throws(() => applyRmsGroundTruthEvents(runtime, agent, [NORTHSTAR_DEMAND_EVENT]));
  assert.throws(() => applyRmsGroundTruthEvents(runtime, nexora, [NORTHSTAR_DEMAND_EVENT]));
  const ledger = inspectRmsOperatorLedger(runtime, observer);
  assert.equal(ledger.observations.every((item) => item.semanticConfirmation === false), true);
  assert.ok(ledger.observations.some((item) => item.field === "CAP_AV"));
});

test("Observer non-interference and taxonomy remain read-only", () => {
  const first = startRmsWatchSession({ scenarioId: "manufacturing-capacity-pressure", runId: "final-obs-a" });
  const second = startRmsWatchSession({ scenarioId: "manufacturing-capacity-pressure", runId: "final-obs-b" });
  const a = getRmsWatchRuntime(first.watchSessionId);
  const b = getRmsWatchRuntime(second.watchSessionId);
  measureRmsObserverIntelligence(a, observer);
  assert.deepEqual(gtValues(a), gtValues(b));
  assert.equal(RMS_5_BOUNDARY.silentlyRepairs, false);
  assert.equal(RMS_5_BOUNDARY.numericalScoring, false);
  const report = measureRmsObserverIntelligence(b, observer);
  assert.equal(report.writeAttempted, false);
  assert.equal(report.findings.every((item) => item.repaired === false), true);
  assert.ok(RMS_OBSERVER_TAXONOMY.includes("OPERATOR_ERROR"));
  assert.ok(RMS_OBSERVER_TAXONOMY.includes("NEXORA_ERROR"));
  assert.ok(RMS_OBSERVER_TAXONOMY.includes("NO_ERROR"));
});

test("E2E Manufacturing: WATCH → TAKE_CONTROL → EXPERIMENT → compare", () => {
  const watch = startRmsWatchSession({ scenarioId: "manufacturing-capacity-pressure", runId: "final-mfg" });
  playRmsWatch(watch.watchSessionId);
  pauseRmsWatch(watch.watchSessionId);
  assert.equal(watch.execution.cc5CallsAfterStart, 0);
  const control = requestRmsTakeControl(watch.watchSessionId);
  assert.equal(control.phase, "TAKE_CONTROL");
  assert.equal(control.activeManagerAuthority, "HUMAN_MANAGER");
  assert.equal(control.handoff?.runId, watch.runId);
  scheduleRmsManagerAgentTurn(getRmsWatchRuntime(watch.watchSessionId));
  assert.equal(flushRmsScheduledManagerAgentTurns(getRmsWatchRuntime(watch.watchSessionId), agent), 0);
  const again = requestRmsTakeControl(watch.watchSessionId);
  assert.equal(again.handoff?.handoffId, control.handoff?.handoffId);
  const humanTurn = speakAsRmsHumanManager(watch.watchSessionId, "Tell me more about it.");
  assert.equal(humanTurn.humanTurns.some((item) => item.label === "You"), true);
  speakAsRmsHumanManager(watch.watchSessionId, "Show me the evidence.");
  speakAsRmsHumanManager(watch.watchSessionId, "Show me the project risks.");
  const experiment = startRmsExperiment(watch.watchSessionId);
  const parentTick = inspectRmsGroundTruth(getRmsExperimentParentSession(experiment.experiment.experimentId), observer).clock.tick;
  createRmsExperimentBranch(experiment.experiment.experimentId, { label: "Temporary Capacity" });
  const forked = createRmsExperimentBranch(experiment.experiment.experimentId, { label: "External Production" });
  const [baseline, capacity, external] = forked.branches;
  assert.ok(baseline && capacity && external);
  const startA = gtValues(getRmsExperimentBranchSession(experiment.experiment.experimentId, baseline.branchId));
  const startB = gtValues(getRmsExperimentBranchSession(experiment.experiment.experimentId, capacity.branchId));
  assert.deepEqual(startA, startB);
  requestRmsBranchSimulationAction({
    experimentId: experiment.experiment.experimentId,
    branchId: capacity.branchId,
    actionType: "TEMP_EXTERNAL_CAPACITY",
    sourceManagementActionRef: "final-mfg-capacity",
  });
  requestRmsBranchSimulationAction({
    experimentId: experiment.experiment.experimentId,
    branchId: external.branchId,
    actionType: "EXTERNAL_PRODUCTION",
    sourceManagementActionRef: "final-mfg-external",
  });
  const unsupported = requestRmsBranchSimulationAction({
    experimentId: experiment.experiment.experimentId,
    branchId: baseline.branchId,
    actionType: "UNMODELED_MAGIC",
    sourceManagementActionRef: "final-mfg-none",
  });
  assert.equal(unsupported.status, "UNSUPPORTED");
  stepRmsExperimentBranch(experiment.experiment.experimentId, baseline.branchId, 2);
  stepRmsExperimentBranch(experiment.experiment.experimentId, capacity.branchId, 2);
  stepRmsExperimentBranch(experiment.experiment.experimentId, external.branchId, 2);
  const afterA = gtValues(getRmsExperimentBranchSession(experiment.experiment.experimentId, baseline.branchId));
  const afterB = gtValues(getRmsExperimentBranchSession(experiment.experiment.experimentId, capacity.branchId));
  assert.equal(afterB.availableCapacity, (afterA.availableCapacity as number) + 20);
  speakOnRmsExperimentBranch(experiment.experiment.experimentId, capacity.branchId, "Approve temporary capacity.");
  speakOnRmsExperimentBranch(experiment.experiment.experimentId, baseline.branchId, "Continue without a new intervention.");
  const turnsB = inspectRmsHandoffTrace(getRmsExperimentBranchSession(experiment.experiment.experimentId, capacity.branchId), observer).humanTurns.map((item) => item.text);
  const turnsA = inspectRmsHandoffTrace(getRmsExperimentBranchSession(experiment.experiment.experimentId, baseline.branchId), observer).humanTurns.map((item) => item.text);
  assert.equal(turnsA.includes("Approve temporary capacity."), false);
  assert.equal(turnsB.includes("Continue without a new intervention."), false);
  const compared = compareRmsExperiment(experiment.experiment.experimentId);
  assert.equal(compared.comparison?.winner, null);
  assert.equal(compared.comparison?.canonicalOutcome, false);
  assert.equal(compared.comparison?.durableLearning, false);
  assert.equal(compared.customerNotice, RMS_SIMULATION_REAL_WORLD_NOTICE);
  assert.ok((compared.comparison?.rows.length ?? 0) > 0);
  assert.ok(compared.comparison?.rows.every((row) => row.branchId && row.runId));
  assert.doesNotMatch(JSON.stringify(compared.comparison), LEAK);
  assert.equal(inspectRmsGroundTruth(getRmsExperimentParentSession(experiment.experiment.experimentId), observer).clock.tick, parentTick);
  selectRmsExperimentBranch(experiment.experiment.experimentId, baseline.branchId);
  assert.equal(getRmsActiveManagerAuthority(getRmsWatchRuntime(watch.watchSessionId)), "HUMAN_MANAGER");
});

test("E2E Project plus logistics/service parity and run isolation", () => {
  const projectWatch = startRmsWatchSession({ scenarioId: "project-delivery-pressure", runId: "final-prj" });
  const projectControl = requestRmsTakeControl(projectWatch.watchSessionId);
  assert.equal(projectControl.phase, "TAKE_CONTROL");
  speakAsRmsHumanManager(projectWatch.watchSessionId, "Why are we behind?");
  const projectExp = startRmsExperiment(projectWatch.watchSessionId);
  const resource = createRmsExperimentBranch(projectExp.experiment.experimentId, { label: "Add Resource" });
  requestRmsBranchSimulationAction({
    experimentId: projectExp.experiment.experimentId,
    branchId: resource.branches[1]!.branchId,
    actionType: "ADD_PROJECT_RESOURCE",
    sourceManagementActionRef: "final-prj-resource",
  });
  stepRmsExperimentBranch(projectExp.experiment.experimentId, resource.branches[0]!.branchId, 1);
  stepRmsExperimentBranch(projectExp.experiment.experimentId, resource.branches[1]!.branchId, 1);
  assert.equal(
    gtValues(getRmsExperimentBranchSession(projectExp.experiment.experimentId, resource.branches[1]!.branchId)).staffAvailable,
    (gtValues(getRmsExperimentBranchSession(projectExp.experiment.experimentId, resource.branches[0]!.branchId)).staffAvailable as number) + 3,
  );
  const logistics = startRmsWatchSession({ scenarioId: "logistics-delivery-pressure", runId: "final-log" });
  assert.equal(requestRmsTakeControl(logistics.watchSessionId).phase, "TAKE_CONTROL");
  const logExp = startRmsExperiment(logistics.watchSessionId);
  assert.equal(logExp.experiment.scenarioId, "logistics-delivery-pressure");
  const service = startRmsWatchSession({ scenarioId: "service-capacity-pressure", runId: "final-svc" });
  assert.equal(requestRmsTakeControl(service.watchSessionId).phase, "TAKE_CONTROL");
  const switched = switchRmsWatchScenario({ fromWatchSessionId: projectWatch.watchSessionId, scenarioId: "manufacturing-capacity-pressure" });
  assert.equal(switched.scenarioId, "manufacturing-capacity-pressure");
  assert.equal(getRmsActiveManagerAuthority(getRmsWatchRuntime(switched.watchSessionId)), "MANAGER_AGENT");
  const restarted = restartRmsWatch(service.watchSessionId);
  assert.equal(getRmsActiveManagerAuthority(getRmsWatchRuntime(restarted.watchSessionId)), "MANAGER_AGENT");
});

test("scenarios, HYBRID bound, mutation/Decision/Execution/Learning, public surface", () => {
  const scenarios = listRmsScenarios();
  assert.equal(scenarios.length, 4);
  assert.equal(new Set(scenarios.map((item) => `${item.scenarioId}:${item.version}`)).size, 4);
  for (const scenario of scenarios) {
    assert.equal(scenario.forkCompatible, true);
    assert.equal(scenario.customer.disclosesHiddenEvents, false);
    for (const key of RMS_SCENARIO_FORBIDDEN_KEYS) {
      assert.equal(key in scenario, false);
    }
  }
  assert.equal(instantiateHybridTemplate().worldKind, "HYBRID");
  assert.equal(RMS_FINAL_BOUNDARY.hybridExpanded, false);
  assert.equal(RMS_4_BOUNDARY.autoConfirm, false);
  assert.equal(RMS_4_BOUNDARY.autoApproveDecision, false);
  assert.equal(RMS_4_BOUNDARY.autoStartExecution, false);
  assert.equal(RMS_10_BOUNDARY.writesCanonicalOutcome, false);
  assert.equal(RMS_10_BOUNDARY.writesDurableLearning, false);
  assert.equal(RMS_10_BOUNDARY.autoWinner, false);
  const page = readFileSync(join(here, "../../executive/watch/page.tsx"), "utf8");
  const ui = readFileSync(join(here, "../../executive/watch/RmsWatchExperience.tsx"), "utf8");
  assert.match(page, /RmsWatchExperience/);
  assert.doesNotMatch(page, /inspectRmsGroundTruth|inspectRmsObserverReport/);
  assert.doesNotMatch(ui, /inspectRmsGroundTruth/);
  assert.match(ui, /Simulation results reflect this modeled Scenario|customerNotice|rms-experiment-notice/);
  const rmsSources = readFileSync(join(here, "rmsManagerCc5Adapter.ts"), "utf8") + readFileSync(join(here, "rmsDataRealityPublication.ts"), "utf8");
  assert.match(rmsSources, /executeNexoraConversationalExperience/);
  assert.match(rmsSources, /realDataIntegrationFoundation/);
  assert.doesNotMatch(readFileSync(join(here, "rmsExperimentRuntime.ts"), "utf8"), /from \"@\/app\/lib\/simulation/);
});

test("deterministic replay, branch restart, Observer measurement does not change CC:5 playback", () => {
  const watch = startRmsWatchSession({ scenarioId: "manufacturing-capacity-pressure", runId: "final-replay" });
  requestRmsTakeControl(watch.watchSessionId);
  const experiment = startRmsExperiment(watch.watchSessionId);
  const branch = createRmsExperimentBranch(experiment.experiment.experimentId, { label: "Temporary Capacity" }).branches[1]!;
  requestRmsBranchSimulationAction({
    experimentId: experiment.experiment.experimentId,
    branchId: branch.branchId,
    actionType: "TEMP_EXTERNAL_CAPACITY",
    sourceManagementActionRef: "replay-1",
  });
  stepRmsExperimentBranch(experiment.experiment.experimentId, branch.branchId, 2);
  const first = gtValues(getRmsExperimentBranchSession(experiment.experiment.experimentId, branch.branchId)).availableCapacity;
  restartRmsExperimentBranch(experiment.experiment.experimentId, branch.branchId);
  requestRmsBranchSimulationAction({
    experimentId: experiment.experiment.experimentId,
    branchId: branch.branchId,
    actionType: "TEMP_EXTERNAL_CAPACITY",
    sourceManagementActionRef: "replay-2",
  });
  stepRmsExperimentBranch(experiment.experiment.experimentId, branch.branchId, 2);
  assert.equal(gtValues(getRmsExperimentBranchSession(experiment.experiment.experimentId, branch.branchId)).availableCapacity, first);
  const playback = startRmsWatchSession({ scenarioId: "service-capacity-pressure", runId: "final-play" });
  playRmsWatch(playback.watchSessionId);
  const afterPlay = pauseRmsWatch(playback.watchSessionId);
  assert.equal(afterPlay.execution.cc5CallsAfterStart, 0);
  assertRmsWatchCustomerSafe(afterPlay.presentation);
});
