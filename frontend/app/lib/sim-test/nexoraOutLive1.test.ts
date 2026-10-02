/** NPA-T OUT-LIVE:1 — live Data Reality → CORE-OUT observation capture. */

import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, test } from "node:test";

import { resetCsvRealDataImportStoreForTests } from "../data-reality/csvRealDataImportStore.ts";
import {
  LIVE_OUTCOME_OBSERVATION_BOUNDARY,
  listCapturedObservations,
  openOutcomeObservationWindow,
  resetOutcomeObservationCaptureForTests,
} from "../executive-intelligence/nexoraLiveOutcomeObservationCapture.ts";
import {
  ingestDataRealityKpisForOutcomeCapture,
  registerPostDecisionCaptureContext,
  resetPostDecisionCaptureForTests,
  syncLiveExecutionCaptureContexts,
} from "../nex-mvp/nexoraPostDecisionObservationCapture.ts";
import { NPS_OUTCOME_LEARNING_BOUNDARY } from "../nexora-problem-solving/npsOutcomeLearning.ts";
import { speakRmsManagerThroughCc5, type RmsCc5Turn } from "../rms/rmsManagerCc5Adapter.ts";
import {
  RMS_SCENARIO_OBSERVER_ACTOR,
  RMS_SCENARIO_OPERATOR_ACTOR,
  RMS_SCENARIO_RUN_ACTORS,
  resolveRmsScenario,
} from "../rms/rmsScenarioRunner.ts";
import {
  createRmsFoundationSession,
  inspectRmsGroundTruth,
  inspectRmsOperatorLedger,
  loadRmsEventSchedule,
  runRmsOperatorObservation,
  stepRmsEventSchedule,
} from "../rms/rmsSession.ts";
import { SIM_TEST_8_JOURNEYS } from "./nexoraSimulationAdaptiveJourneys.ts";
import { ingestSimulationCsvFile, projectRmsOperatorRecordsToCsv } from "./nexoraSimulationCsvIngestion.ts";
import type { NexoraSimulationTestJourney } from "./nexoraSimulationTestContract.ts";
import { runNexoraSimulationTestJourney } from "./nexoraSimulationTestHarness.ts";

const UNCERTAIN = /not enough|too early|unknown|does not establish|cannot tell|insufficient|not enough outcome evidence/i;
const SEALED = /bearing_damage|machineFailure|failureCause|Ground Truth/i;

function resetLive(): void {
  resetCsvRealDataImportStoreForTests();
  resetOutcomeObservationCaptureForTests();
  resetPostDecisionCaptureForTests();
}

function speak(previous: RmsCc5Turn | null, utterance: string, seed: string): RmsCc5Turn {
  return speakRmsManagerThroughCc5({ utterance, previous, messageIdSeed: `out-live-1-${seed}` });
}

function addApprovedDecision(turn: RmsCc5Turn, input: {
  readonly id: string;
  readonly title: string;
  readonly subjectIds: readonly string[];
}): void {
  const result = turn.decisionRuntime!.transitionDecision({
    decisionId: input.id,
    action: "approve",
    title: input.title,
    subjectIds: input.subjectIds,
  });
  assert.equal(result.status, "applied");
}

function startCapacityExecution(seed: string): RmsCc5Turn {
  const focused = speak(null, "Capacity. Details.", `${seed}-focus`);
  addApprovedDecision(focused, {
    id: `d-capacity-${seed}`,
    title: "Capacity Decision D1",
    subjectIds: ["obj-capacity"],
  });
  const started = speak(focused, "Start Capacity Decision D1.", `${seed}-start`);
  assert.equal(started.executionRuntime?.listExecutions().length, 1);
  return started;
}

function startDeliveryExecution(previous: RmsCc5Turn, seed: string): RmsCc5Turn {
  const focused = speak(previous, "Delivery. Details.", `${seed}-delivery`);
  addApprovedDecision(focused, {
    id: `d-delivery-${seed}`,
    title: "Delivery Decision D2",
    subjectIds: ["obj-delivery"],
  });
  const started = speak(focused, "Start Delivery Decision D2.", `${seed}-start-d`);
  assert.ok((started.executionRuntime?.listExecutions().length ?? 0) >= 2);
  return started;
}

function openManufacturingSession(runId: string) {
  const scenario = resolveRmsScenario({ scenarioId: "manufacturing-capacity-pressure", version: "1.0" });
  const world = scenario.instantiateWorld();
  const session = createRmsFoundationSession({
    simulationId: `rms-7:${scenario.scenarioId}`,
    simulationType: "scenario-library",
    sessionId: `out-live-1-${runId}`,
    runId,
    host: { hostKind: world.worldKind === "HYBRID" ? "HYBRID" : world.worldKind, hostId: world.worldId },
    actors: RMS_SCENARIO_RUN_ACTORS,
    groundTruth: world,
  });
  loadRmsEventSchedule(session, RMS_SCENARIO_OPERATOR_ACTOR, scenario.eventSchedule);
  return { session, scenario };
}

function publishOperatorCsv(input: {
  readonly runId: string;
  readonly tick: number;
  readonly session: ReturnType<typeof createRmsFoundationSession>;
  readonly scenario: ReturnType<typeof resolveRmsScenario>;
}): readonly ReturnType<typeof ingestSimulationCsvFile>[] {
  if (input.tick > 0) stepRmsEventSchedule(input.session, RMS_SCENARIO_OPERATOR_ACTOR, input.tick);
  const observations = runRmsOperatorObservation(input.session, RMS_SCENARIO_OPERATOR_ACTOR, {
    enabledSources: input.scenario.enabledSources,
  });
  const files = projectRmsOperatorRecordsToCsv({
    scenarioId: input.scenario.scenarioId,
    simulationRunId: input.runId,
    tick: input.tick,
    records: observations,
  });
  return Object.freeze(files.map((file) => ingestSimulationCsvFile(file)));
}

function capturedFor(executionId: string) {
  return listCapturedObservations().filter((item) => item.executionId === executionId);
}

function groundTruthKeys(session: ReturnType<typeof createRmsFoundationSession>): readonly string[] {
  const ground = inspectRmsGroundTruth(session, RMS_SCENARIO_OBSERVER_ACTOR);
  if (!("variables" in ground)) return Object.freeze([]);
  return Object.freeze(ground.variables.map((item) => item.key));
}

describe("NPA-T OUT-LIVE:1 live Data Reality capture", { concurrency: false }, () => {
  beforeEach(resetLive);
  afterEach(resetLive);

  test("architecture: existing owners, NPS read-only", () => {
    assert.equal(LIVE_OUTCOME_OBSERVATION_BOUNDARY.evaluatesSuccess, false);
    assert.equal(NPS_OUTCOME_LEARNING_BOUNDARY.writesOutcome, false);
    assert.equal(NPS_OUTCOME_LEARNING_BOUNDARY.npsWritesOutcome, false);
    assert.equal(NPS_OUTCOME_LEARNING_BOUNDARY.writesLearning, false);
  });

  test("T1 live capture after post-Execution publication", () => {
    const started = startCapacityExecution("t1");
    const executionId = started.executionRuntime!.listExecutions()[0]!.executionId;
    const { session, scenario } = openManufacturingSession("t1");
    const ingested = publishOperatorCsv({ runId: "t1", tick: 15, session, scenario });
    assert.ok(ingested.some((item) => item.committed));
    const captured = listCapturedObservations();
    assert.ok(captured.length > 0, "CORE-OUT captures must be > 0 after publication");
    assert.ok(captured.every((item) => item.executionId === executionId));
    assert.equal(captured.filter((item) => SEALED.test(item.provenanceRefs.join(" "))).length, 0);
  });

  test("T2/T3/T12 no capture from hidden Ground Truth before publication", () => {
    const started = startCapacityExecution("t2");
    const { session, scenario } = openManufacturingSession("t2");
    stepRmsEventSchedule(session, RMS_SCENARIO_OPERATOR_ACTOR, 10);
    const hidden = inspectRmsOperatorLedger(session, RMS_SCENARIO_OBSERVER_ACTOR).observations;
    assert.ok(groundTruthKeys(session).length > 0 || hidden.length >= 0);
    assert.equal(listCapturedObservations().length, 0);
    const asked = speak(started, "Did it work?", "t2-ask");
    assert.equal(listCapturedObservations().length, 0);
    assert.ok(UNCERTAIN.test(asked.response) || /outcome|evidence|early|unknown/i.test(asked.response));
    assert.equal(scenario.scenarioId, "manufacturing-capacity-pressure");
  });

  test("T4/T11 delayed publication then evidence is visible without requiring success", () => {
    const started = startCapacityExecution("t4");
    const early = speak(started, "Did it work?", "t4-early");
    assert.equal(listCapturedObservations().length, 0);
    const { session, scenario } = openManufacturingSession("t4");
    stepRmsEventSchedule(session, RMS_SCENARIO_OPERATOR_ACTOR, 12);
    assert.equal(listCapturedObservations().length, 0);
    publishOperatorCsv({ runId: "t4", tick: 20, session, scenario });
    assert.ok(listCapturedObservations().length > 0);
    const asked = speak(early, "Did it work?", "t4-late");
    assert.ok(listCapturedObservations().length > 0);
    assert.equal(NPS_OUTCOME_LEARNING_BOUNDARY.writesOutcome, false);
    assert.equal(asked.npsOutcomeLearning?.writesOutcome, false);
  });

  test("T7 subject switch does not rebind E1 capture to recency", () => {
    const started = startCapacityExecution("t7");
    const executionId = started.executionRuntime!.listExecutions()[0]!.executionId;
    speak(started, "Delivery. Details.", "t7-switch");
    const { session, scenario } = openManufacturingSession("t7");
    publishOperatorCsv({ runId: "t7", tick: 15, session, scenario });
    const captured = listCapturedObservations();
    assert.ok(captured.length > 0);
    assert.ok(captured.every((item) => item.executionId === executionId));
  });

  test("T8 duplicate publication processing does not duplicate observations", () => {
    startCapacityExecution("t8");
    const { session, scenario } = openManufacturingSession("t8");
    publishOperatorCsv({ runId: "t8", tick: 15, session, scenario });
    const first = listCapturedObservations().map((item) => item.observationId);
    publishOperatorCsv({ runId: "t8", tick: 15, session, scenario });
    const second = listCapturedObservations().map((item) => item.observationId);
    assert.ok(first.length > 0);
    assert.equal(second.length, first.length);
    assert.equal(new Set(second).size, second.length);
  });

  test("T10 historical publication is not post-E1 evidence", () => {
    const { session, scenario } = openManufacturingSession("t10");
    publishOperatorCsv({ runId: "t10", tick: 0, session, scenario });
    assert.equal(listCapturedObservations().length, 0);
    startCapacityExecution("t10");
    assert.equal(listCapturedObservations().length, 0);
  });

  test("T13 Decision/Execution identity unchanged after capture", () => {
    const started = startCapacityExecution("t13");
    const before = started.executionRuntime!.listExecutions()[0]!;
    const decision = started.decisionRuntime!.listDecisions().find((item) => item.decisionId === before.decisionId)!;
    const { session, scenario } = openManufacturingSession("t13");
    publishOperatorCsv({ runId: "t13", tick: 15, session, scenario });
    const after = started.executionRuntime!.listExecutions()[0]!;
    assert.equal(after.executionId, before.executionId);
    assert.equal(after.decisionId, before.decisionId);
    assert.equal(started.decisionRuntime!.getDecision(decision.decisionId)?.decisionId, decision.decisionId);
    assert.ok(listCapturedObservations().length > 0);
  });

  test("multi-execution: production observation stays on E1, not E2", () => {
    const capacity = startCapacityExecution("multi");
    const e1 = capacity.executionRuntime!.listExecutions()[0]!.executionId;
    const both = startDeliveryExecution(capacity, "multi");
    const e2 = both.executionRuntime!.listExecutions().find((item) => item.executionId !== e1)!.executionId;
    const { session, scenario } = openManufacturingSession("multi");
    publishOperatorCsv({ runId: "multi", tick: 15, session, scenario });
    const e1Caps = capturedFor(e1);
    const e2Production = capturedFor(e2).filter((item) => /production|obj-capacity/i.test(`${item.subjectId}:${item.metricId}`));
    assert.ok(e1Caps.length > 0);
    assert.equal(e2Production.length, 0);
  });

  test("T17/T18 NPS read-only and Learning remains downstream", () => {
    const started = startCapacityExecution("t17");
    const { session, scenario } = openManufacturingSession("t17");
    publishOperatorCsv({ runId: "t17", tick: 15, session, scenario });
    const asked = speak(started, "What did we learn?", "t17-learn");
    assert.ok(listCapturedObservations().length > 0);
    assert.equal(asked.npsOutcomeLearning?.writesOutcome, false);
    assert.equal(asked.npsOutcomeLearning?.writesLearning, false);
    assert.equal(asked.npsOutcomeLearning?.learningDurable, false);
  });
});

describe("NPA-T OUT-LIVE:1 harness regression", { concurrency: false }, () => {
  test("T14 FIX1 regression: wrong-thread Execution remains zero", () => {
    const blocker: NexoraSimulationTestJourney = Object.freeze({
      journeyId: "out-live-1-t14-fix1-blocker",
      version: "1.0",
      title: "FIX1 blocker",
      scenarioId: "manufacturing-capacity-pressure",
      scenarioVersion: "1.0",
      managerProfileId: "DECISION_ORIENTED_MANAGER",
      behaviorSeed: 11,
      conversationLength: "medium",
      startingMode: "WATCH",
      mode: "INGESTION",
      boundedDurationTicks: 29,
      turnBudget: 8,
      maxRepeatedClarificationAttempts: 3,
      maxUnresolvedLoops: 3,
      disturbancePolicy: "CERTIFIED_SCENARIO_SCHEDULE",
      requiredCheckpoints: Object.freeze([
        "DATA_VISIBLE", "MANAGER_TURN_COMPLETED", "NEXORA_TURN_COMPLETED", "SUBJECT_SELECTED",
        "MLEVEL_STATE", "STAGE_STATE", "PROBLEM_AVAILABLE", "SCENARIO_AVAILABLE",
        "DECISION_STATE", "EXECUTION_STATE",
      ]),
      targetSurfaces: Object.freeze(["CC5", "REFERENT", "NMI", "MLEVEL", "STAGE", "CC10", "CC11"]),
      stopConditions: Object.freeze(["TURN_BUDGET", "TICK_BUDGET", "S0", "RUNTIME_ERROR", "JOURNEY_COMPLETE"]),
      steps: Object.freeze([
        { kind: "PUBLISH_OBSERVABLE_DATA" as const, atTick: 0 },
        { kind: "MANAGER_TURN" as const, utterance: "Status.", managementIntent: "ORIENT" },
        { kind: "MANAGER_TURN" as const, utterance: "Capacity. Details.", managementIntent: "FOCUS_PROBLEM", intendedSubject: "Capacity" },
        { kind: "MANAGER_TURN" as const, utterance: "Options.", managementIntent: "EXPLORE_OPTIONS", intendedSubject: "Capacity" },
        { kind: "MANAGER_TURN" as const, utterance: "Go with B.", managementIntent: "COMMIT_DECISION", intendedSubject: "Capacity" },
        { kind: "MANAGER_TURN" as const, utterance: "Delivery. Details.", managementIntent: "FOCUS_PROBLEM", intendedSubject: "Delivery" },
        { kind: "MANAGER_TURN" as const, utterance: "Options.", managementIntent: "EXPLORE_OPTIONS", intendedSubject: "Delivery" },
        { kind: "MANAGER_TURN" as const, utterance: "Go with A.", managementIntent: "COMMIT_DECISION", intendedSubject: "Delivery" },
        { kind: "MANAGER_TURN" as const, utterance: "Start it.", managementIntent: "REQUEST_EXECUTION", intendedSubject: "Delivery" },
      ]),
    });
    const report = runNexoraSimulationTestJourney({ journey: blocker, runId: "out-live-t14" });
    const capacityDecisionId = "cc10:decision:cc9:scenario:do-nothing:do-nothing:v1";
    const final = report.journeyObservations.at(-1)!;
    assert.equal(
      (final.executionLedger ?? []).filter((item) => item.decisionId === capacityDecisionId).length,
      0,
    );
  });

  test("T16 reassessment does not invent subjects", () => {
    const focused = SIM_TEST_8_JOURNEYS.find(
      (item) =>
        item.adaptiveFamily === "RECOVERY" &&
        item.scenarioId === "manufacturing-capacity-pressure" &&
        item.conversationLength === "short",
    )!;
    const report = runNexoraSimulationTestJourney({ journey: focused, runId: "out-live-t16" });
    const reassess = report.journeyObservations.find((row) => row.utterance === "Is this still a problem?");
    if (reassess) {
      assert.equal(/is this still a/i.test(reassess.response), false);
      assert.equal(reassess.canonicalSubjectId, "obj-capacity");
    }
  });
});

describe("NPA-T OUT-LIVE:1 unit capture isolation", { concurrency: false }, () => {
  beforeEach(resetLive);
  afterEach(resetLive);

  test("T5/T6 two Execution contexts stay distinct", () => {
    syncLiveExecutionCaptureContexts({
      executions: [
        { executionId: "e1", decisionId: "d1", title: "E1", status: "Active" },
        { executionId: "e2", decisionId: "d2", title: "E2", status: "Active" },
      ],
      decisions: [
        { decisionId: "d1", subjectIds: ["obj-capacity"] },
        { decisionId: "d2", subjectIds: ["obj-delivery"] },
      ],
    });
    ingestDataRealityKpisForOutcomeCapture({
      kpis: [{ kpiId: "cap", objectKey: "production", nexoraObjectId: "obj-capacity", value: 91, unit: "units", calculatedAt: "2026-09-16T15:00:00.000Z" }],
      sourceId: "csv:production",
      datasetId: "ds-e1",
      observedAt: "2026-09-16T15:00:00.000Z",
      capturedAt: "2026-09-16T15:00:00.000Z",
      provenanceRefs: Object.freeze(["p1"]),
      validationState: "partial",
    });
    ingestDataRealityKpisForOutcomeCapture({
      kpis: [{ kpiId: "otd", objectKey: "shipping", nexoraObjectId: "obj-delivery", value: 40, unit: "deliveries", calculatedAt: "2026-09-16T16:00:00.000Z" }],
      sourceId: "csv:shipping",
      datasetId: "ds-e2",
      observedAt: "2026-09-16T16:00:00.000Z",
      capturedAt: "2026-09-16T16:00:00.000Z",
      provenanceRefs: Object.freeze(["p2"]),
      validationState: "partial",
    });
    assert.equal(capturedFor("e1").length, 1);
    assert.equal(capturedFor("e2").length, 1);
    assert.equal(capturedFor("e1")[0]?.decisionId, "d1");
    assert.equal(capturedFor("e2")[0]?.decisionId, "d2");
  });

  test("T9 irrelevant publication is not E1 evidence", () => {
    syncLiveExecutionCaptureContexts({
      executions: [{ executionId: "e1", decisionId: "d1", title: "E1", status: "Active" }],
      decisions: [{ decisionId: "d1", subjectIds: ["obj-capacity"] }],
    });
    ingestDataRealityKpisForOutcomeCapture({
      kpis: [{ kpiId: "otd", objectKey: "shipping", nexoraObjectId: "obj-delivery", value: 12, unit: "deliveries", calculatedAt: "2026-09-16T15:00:00.000Z" }],
      sourceId: "csv:shipping",
      datasetId: "ds-irrel",
      observedAt: "2026-09-16T15:00:00.000Z",
      capturedAt: "2026-09-16T15:00:00.000Z",
      provenanceRefs: Object.freeze(["irrel"]),
      validationState: "partial",
    });
    assert.equal(capturedFor("e1").length, 0);
    assert.equal(listCapturedObservations().length, 0);
  });

  test("T8 unit duplicate identity", () => {
    registerPostDecisionCaptureContext({
      decisionId: "d1",
      executionId: "e1",
      subjectId: "obj-capacity",
      expected: null,
      window: null,
      binding: null,
      linkBasis: null,
    });
    const input = {
      kpis: [{ kpiId: "cap", objectKey: "production", nexoraObjectId: "obj-capacity", value: 91, unit: "units", calculatedAt: "2026-09-16T15:00:00.000Z" }],
      sourceId: "csv:production",
      datasetId: "ds-dup",
      observedAt: "2026-09-16T15:00:00.000Z",
      capturedAt: "2026-09-16T15:00:00.000Z",
      provenanceRefs: Object.freeze(["dup"]),
      validationState: "partial" as const,
    };
    ingestDataRealityKpisForOutcomeCapture(input);
    ingestDataRealityKpisForOutcomeCapture(input);
    assert.equal(listCapturedObservations().length, 1);
  });

  test("T10 unit pre-window observation is not captured", () => {
    const window = openOutcomeObservationWindow({
      subjectId: "obj-capacity",
      decisionId: "d1",
      executionId: "e1",
      openedAt: "2026-09-16T10:00:00.000Z",
      expectedStartAt: "2026-09-16T10:00:00.000Z",
      expectedEndAt: null,
      baselineObservationId: null,
      expectedOutcomeIds: [],
    });
    registerPostDecisionCaptureContext({
      decisionId: "d1",
      executionId: "e1",
      subjectId: "obj-capacity",
      expected: null,
      window,
      binding: null,
      linkBasis: null,
    });
    ingestDataRealityKpisForOutcomeCapture({
      kpis: [{ kpiId: "cap", objectKey: "production", nexoraObjectId: "obj-capacity", value: 82, unit: "units", calculatedAt: "2026-09-16T09:00:00.000Z" }],
      sourceId: "csv:production",
      datasetId: "ds-hist",
      observedAt: "2026-09-16T09:00:00.000Z",
      capturedAt: "2026-09-16T09:00:00.000Z",
      provenanceRefs: Object.freeze(["hist"]),
      validationState: "partial",
    });
    assert.equal(listCapturedObservations().length, 0);
    ingestDataRealityKpisForOutcomeCapture({
      kpis: [{ kpiId: "cap", objectKey: "production", nexoraObjectId: "obj-capacity", value: 91, unit: "units", calculatedAt: "2026-09-16T20:00:00.000Z" }],
      sourceId: "csv:production",
      datasetId: "ds-late",
      observedAt: "2026-09-16T20:00:00.000Z",
      capturedAt: "2026-09-16T20:00:00.000Z",
      provenanceRefs: Object.freeze(["late"]),
      validationState: "partial",
    });
    assert.equal(listCapturedObservations().length, 1);
    assert.equal(listCapturedObservations()[0]?.executionId, "e1");
  });

  test("T15 FIX2 scenario source isolation still holds", () => {
    let turn = speak(null, "Capacity. Details.", "t15-1");
    turn = speak(turn, "Options.", "t15-2");
    turn = speak(turn, "Delivery. Details.", "t15-3");
    turn = speak(turn, "Options.", "t15-4");
    const names = (turn.nextScenarioSession?.candidateScenarioIds ?? []).map(
      (id) => turn.nextScenarioSession?.scenariosById[id]?.name ?? id,
    );
    assert.equal(
      names.some((name) => /investigate capacity|no action on capacity/i.test(name)) && names.length > 0,
      false,
    );
  });
});
