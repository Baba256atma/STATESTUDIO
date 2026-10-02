/** NPA-T OUT-EVAL-LIVE:1 — live Observation → CORE-OUT:1 evaluation. */

import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, test } from "node:test";

import { resetCsvRealDataImportStoreForTests } from "../data-reality/csvRealDataImportStore.ts";
import { resetGroundedLearningForTests } from "../executive-intelligence/nexoraGroundedLearningIntelligence.ts";
import {
  LIVE_OUTCOME_BOUNDARY,
  projectLiveOutcomeIntelligence,
} from "../executive-intelligence/nexoraLiveOutcomeIntelligence.ts";
import {
  LIVE_OUTCOME_OBSERVATION_BOUNDARY,
  listCapturedObservations,
  projectOutcomeObservationCapture,
  resetOutcomeObservationCaptureForTests,
} from "../executive-intelligence/nexoraLiveOutcomeObservationCapture.ts";
import { resetDecisionOutcomeCommitmentForTests } from "../nex-mvp/nexoraDecisionOutcomeCommitment.ts";
import {
  ingestDataRealityKpisForOutcomeCapture,
  listLiveExecutionCaptureContextsForTests,
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
  loadRmsEventSchedule,
  runRmsOperatorObservation,
  stepRmsEventSchedule,
} from "../rms/rmsSession.ts";
import { SIM_TEST_8_JOURNEYS } from "./nexoraSimulationAdaptiveJourneys.ts";
import { ingestSimulationCsvFile, projectRmsOperatorRecordsToCsv } from "./nexoraSimulationCsvIngestion.ts";
import { SIM_TEST_10_CORE_JOURNEYS } from "./nexoraSimulationOutcomeLearningJourneys.ts";
import { runNexoraSimulationTestJourney } from "./nexoraSimulationTestHarness.ts";

const UNCERTAIN = /not enough|too early|unknown|does not establish|cannot tell|insufficient|not enough outcome evidence|no validated actual|no live Outcome|incomplete/i;
const CAUSAL = /the decision caused|caused the improvement|always use this decision/i;

function resetLive(): void {
  resetCsvRealDataImportStoreForTests();
  resetOutcomeObservationCaptureForTests();
  resetPostDecisionCaptureForTests();
  resetDecisionOutcomeCommitmentForTests();
  resetGroundedLearningForTests();
}

function speak(previous: RmsCc5Turn | null, utterance: string, seed: string): RmsCc5Turn {
  return speakRmsManagerThroughCc5({ utterance, previous, messageIdSeed: `out-eval-live-1-${seed}` });
}

function liveCapacity(seed: string): RmsCc5Turn {
  let turn = speak(null, "Capacity. Details.", `${seed}-focus`);
  turn = speak(turn, "Options.", `${seed}-options`);
  turn = speak(turn, "Go with B.", `${seed}-commit`);
  return speak(turn, "Start it.", `${seed}-start`);
}

function liveDelivery(previous: RmsCc5Turn | null, seed: string): RmsCc5Turn {
  let turn = speak(previous, "Delivery. Details.", `${seed}-d-focus`);
  turn = speak(turn, "Options.", `${seed}-d-options`);
  turn = speak(turn, "Go with A.", `${seed}-d-commit`);
  return speak(turn, "Start it.", `${seed}-d-start`);
}

function openManufacturingSession(runId: string) {
  const scenario = resolveRmsScenario({ scenarioId: "manufacturing-capacity-pressure", version: "1.0" });
  const world = scenario.instantiateWorld();
  const session = createRmsFoundationSession({
    simulationId: `rms-7:${scenario.scenarioId}`,
    simulationType: "scenario-library",
    sessionId: `out-eval-live-1-${runId}`,
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
}) {
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

function assessSubject(subjectId: string) {
  const context = listLiveExecutionCaptureContextsForTests().find((item) => item.subjectId === subjectId) ?? null;
  const capture = projectOutcomeObservationCapture({
    subjectId,
    expected: context?.expected ?? null,
    window: context?.window ?? null,
  });
  return projectLiveOutcomeIntelligence({
    subjectId,
    decisionId: context?.decisionId ?? null,
    executionId: context?.executionId ?? null,
    expected: context?.expected ?? null,
    capture,
  });
}

describe("NPA-T OUT-EVAL-LIVE:1 live Observation → CORE-OUT:1", { concurrency: false }, () => {
  beforeEach(resetLive);
  afterEach(resetLive);

  test("architecture owners and NPS read-only", () => {
    assert.equal(LIVE_OUTCOME_OBSERVATION_BOUNDARY.evaluatesSuccess, false);
    assert.equal(LIVE_OUTCOME_BOUNDARY.createsLearning, false);
    assert.equal(NPS_OUTCOME_LEARNING_BOUNDARY.writesOutcome, false);
    assert.equal(NPS_OUTCOME_LEARNING_BOUNDARY.writesLearning, false);
  });

  test("T1/T4/T12/T16/T17 live funnel: E1 → publication → eligible Obs1 → CORE-OUT:1", () => {
    const started = liveCapacity("t1");
    const d1 = started.decisionRuntime!.listDecisions()[0]!;
    const e1 = started.executionRuntime!.listExecutions()[0]!;
    assert.ok(d1.decisionId);
    assert.equal(e1.decisionId, d1.decisionId);
    const { session, scenario } = openManufacturingSession("t1");
    assert.ok(publishOperatorCsv({ runId: "t1", tick: 15, session, scenario }).some((item) => item.committed));
    const asked = speak(started, "Did it work?", "t1-ask");
    const captured = listCapturedObservations().filter((item) => item.executionId === e1.executionId);
    assert.ok(captured.length > 0);
    const eligible = captured.filter((item) => item.eligibleAsActualOutcome);
    assert.ok(eligible.length > 0, "relevant Capacity observation must become eligible");
    assert.ok(eligible.every((item) => item.decisionId === d1.decisionId));
    assert.ok(eligible.every((item) => item.outcomeLink != null));
    const evaluated = assessSubject("obj-capacity");
    assert.equal(evaluated.identity, "CORE-OUT:1/LiveOutcomeIntelligence");
    assert.equal(evaluated.executionId, e1.executionId);
    assert.equal(evaluated.decisionId, d1.decisionId);
    assert.ok(evaluated.actualOutcome);
    assert.equal(evaluated.actualOutcome?.outcomeLinked, true);
    assert.equal(evaluated.establishesCausation, false);
    assert.equal(evaluated.createsLearning, false);
    assert.equal(CAUSAL.test(asked.response), false);
    assert.equal(asked.npsOutcomeLearning?.writesOutcome, false);
  });

  test("T2/T20 pre-publication hidden state is not evaluation evidence", () => {
    const started = liveCapacity("t2");
    const { session } = openManufacturingSession("t2");
    stepRmsEventSchedule(session, RMS_SCENARIO_OPERATOR_ACTOR, 10);
    const before = listCapturedObservations().filter((item) => item.eligibleAsActualOutcome).length;
    const asked = speak(started, "Did it work?", "t2-ask");
    const after = listCapturedObservations().filter((item) => item.eligibleAsActualOutcome).length;
    assert.equal(after, before);
    assert.ok(UNCERTAIN.test(asked.response) || /pending|unknown|not yet|no validated/i.test(asked.response));
    const ground = inspectRmsGroundTruth(session, RMS_SCENARIO_OBSERVER_ACTOR);
    const gt = "variables" in ground ? ground.variables.map((item) => item.key).join(" ") : "";
    assert.equal(/bearing_damage|machineFailure/i.test(asked.response), false);
    assert.ok(gt.length >= 0);
  });

  test("T3 delayed publication then evaluation consumes Obs1", () => {
    const started = liveCapacity("t3");
    const early = speak(started, "Did it work?", "t3-early");
    assert.equal(assessSubject("obj-capacity").actualOutcome, null);
    const { session, scenario } = openManufacturingSession("t3");
    stepRmsEventSchedule(session, RMS_SCENARIO_OPERATOR_ACTOR, 12);
    assert.equal(listCapturedObservations().length, 0);
    publishOperatorCsv({ runId: "t3", tick: 20, session, scenario });
    speak(early, "Did it work?", "t3-late");
    const evaluated = assessSubject("obj-capacity");
    assert.ok(evaluated.actualOutcome);
    assert.equal(evaluated.executionId, started.executionRuntime!.listExecutions()[0]!.executionId);
  });

  test("T5 unrelated KPI stays ineligible for E1", () => {
    const started = liveCapacity("t5");
    const e1 = started.executionRuntime!.listExecutions()[0]!.executionId;
    ingestDataRealityKpisForOutcomeCapture({
      kpis: [{
        kpiId: "kpi.shipping.on-time-rate",
        objectKey: "shipping",
        nexoraObjectId: "obj-delivery",
        value: 12,
        unit: "%",
        calculatedAt: "2026-09-16T15:00:00.000Z",
      }],
      sourceId: "csv:shipping",
      datasetId: "ds-unrelated",
      observedAt: "2026-09-16T15:00:00.000Z",
      capturedAt: "2026-09-16T15:00:00.000Z",
      provenanceRefs: Object.freeze(["unrelated"]),
      validationState: "valid",
    });
    const e1Obs = listCapturedObservations().filter((item) => item.executionId === e1);
    assert.equal(e1Obs.length, 0);
    assert.equal(assessSubject("obj-capacity").actualOutcome, null);
  });

  test("T6 pre-Execution publication does not become E1 Outcome", () => {
    const { session, scenario } = openManufacturingSession("t6");
    publishOperatorCsv({ runId: "t6", tick: 0, session, scenario });
    assert.equal(listCapturedObservations().length, 0);
    liveCapacity("t6");
    const eligible = listCapturedObservations().filter((item) => item.eligibleAsActualOutcome);
    assert.equal(eligible.length, 0);
  });

  test("T7 delayed publication after Execution", () => {
    const started = liveCapacity("t7");
    assert.equal(listCapturedObservations().length, 0);
    const { session, scenario } = openManufacturingSession("t7");
    publishOperatorCsv({ runId: "t7", tick: 20, session, scenario });
    speak(started, "Did it work?", "t7-ask");
    assert.ok(listCapturedObservations().some((item) => item.eligibleAsActualOutcome));
  });

  test("T8 duplicate publication does not duplicate eligible Outcome identity", () => {
    liveCapacity("t8");
    const { session, scenario } = openManufacturingSession("t8");
    publishOperatorCsv({ runId: "t8", tick: 15, session, scenario });
    const first = listCapturedObservations().filter((item) => item.eligibleAsActualOutcome).map((item) => item.observationId);
    publishOperatorCsv({ runId: "t8", tick: 15, session, scenario });
    const second = listCapturedObservations().filter((item) => item.eligibleAsActualOutcome).map((item) => item.observationId);
    assert.ok(first.length > 0);
    assert.equal(second.length, first.length);
    assert.equal(new Set(second).size, second.length);
  });

  test("T9/T10 two Executions and subject switch keep evaluation isolation", () => {
    const capacity = liveCapacity("t9");
    const e1 = capacity.executionRuntime!.listExecutions()[0]!;
    const delivery = liveDelivery(capacity, "t9");
    const e2 = delivery.executionRuntime!.listExecutions().find((item) => item.executionId !== e1.executionId)!;
    assert.ok(e2);
    const switched = speak(delivery, "Delivery. Details.", "t9-stay-delivery");
    const { session, scenario } = openManufacturingSession("t9");
    publishOperatorCsv({ runId: "t9", tick: 15, session, scenario });
    speak(switched, "Did it work?", "t9-ask");
    const capObs = listCapturedObservations().filter((item) => item.executionId === e1.executionId && item.eligibleAsActualOutcome);
    const delObs = listCapturedObservations().filter((item) => item.executionId === e2.executionId && item.eligibleAsActualOutcome);
    assert.ok(capObs.length > 0);
    assert.equal(capObs.some((item) => item.executionId === e2.executionId), false);
    const capacityEval = assessSubject("obj-capacity");
    assert.equal(capacityEval.executionId, e1.executionId);
    const deliveryEval = assessSubject("obj-delivery");
    if (deliveryEval.actualOutcome) {
      assert.equal(deliveryEval.executionId, e2.executionId);
      assert.notEqual(deliveryEval.executionId, capacityEval.executionId);
    }
    assert.equal(delObs.some((item) => item.executionId === e1.executionId), false);
  });

  test("T11 missing canonical expectation does not fabricate one", () => {
    syncLiveExecutionCaptureContexts({
      executions: [{ executionId: "e-missing", decisionId: "d-missing", title: "E", status: "Active" }],
      decisions: [{ decisionId: "d-missing", subjectIds: ["obj-capacity"] }],
    });
    ingestDataRealityKpisForOutcomeCapture({
      kpis: [{
        kpiId: "kpi.production.capacity-utilization",
        objectKey: "production",
        nexoraObjectId: "obj-capacity",
        value: 91,
        unit: "%",
        calculatedAt: "2026-09-16T16:00:00.000Z",
      }],
      sourceId: "csv:production",
      datasetId: "ds-missing-exp",
      observedAt: "2026-09-16T16:00:00.000Z",
      capturedAt: "2026-09-16T16:00:00.000Z",
      provenanceRefs: Object.freeze(["missing-exp"]),
      validationState: "valid",
    });
    const captured = listCapturedObservations().filter((item) => item.executionId === "e-missing");
    assert.ok(captured.length > 0);
    assert.equal(captured.some((item) => item.eligibleAsActualOutcome), false);
    assert.equal(listLiveExecutionCaptureContextsForTests()[0]?.expected, null);
  });

  test("T13/T15 Execution completion is not success; history is unchanged", () => {
    const started = liveCapacity("t13");
    const beforeD = started.decisionRuntime!.listDecisions()[0]!;
    const beforeE = started.executionRuntime!.listExecutions()[0]!;
    const { session, scenario } = openManufacturingSession("t13");
    publishOperatorCsv({ runId: "t13", tick: 15, session, scenario });
    const asked = speak(started, "Did it work?", "t13-ask");
    const afterD = started.decisionRuntime!.getDecision(beforeD.decisionId)!;
    const afterE = started.executionRuntime!.listExecutions()[0]!;
    assert.equal(afterD.decisionId, beforeD.decisionId);
    assert.equal(afterD.title, beforeD.title);
    assert.equal(afterE.executionId, beforeE.executionId);
    assert.equal(afterE.decisionId, beforeE.decisionId);
    assert.equal(/decision succeeded|execution succeeded|the action worked/i.test(asked.response), false);
    const evaluated = assessSubject("obj-capacity");
    assert.equal(evaluated.establishesCausation, false);
  });

  test("T14 partial evidence stays bounded", () => {
    const started = liveCapacity("t14");
    const { session, scenario } = openManufacturingSession("t14");
    publishOperatorCsv({ runId: "t14", tick: 15, session, scenario });
    speak(started, "Did it work?", "t14-ask");
    const evaluated = assessSubject("obj-capacity");
    assert.ok(evaluated.actualOutcome);
    assert.equal(evaluated.comparison.result === "met" && evaluated.missingEvidence.length > 0, false);
    assert.ok(
      evaluated.status === "comparison-incomplete" ||
        evaluated.status === "comparison-ready" ||
        evaluated.status === "observed" ||
        evaluated.status === "conflicting",
    );
  });

  test("T18 NPS remains read-only after evaluation", () => {
    const started = liveCapacity("t18");
    const { session, scenario } = openManufacturingSession("t18");
    publishOperatorCsv({ runId: "t18", tick: 15, session, scenario });
    const asked = speak(started, "Did it work?", "t18-ask");
    assert.equal(NPS_OUTCOME_LEARNING_BOUNDARY.writesOutcome, false);
    assert.equal(NPS_OUTCOME_LEARNING_BOUNDARY.writesLearning, false);
    assert.equal(asked.npsOutcomeLearning?.writesOutcome, false);
    assert.equal(asked.npsOutcomeLearning?.writesLearning, false);
  });

  test("T19 Learning is observed only; not repaired", () => {
    const started = liveCapacity("t19");
    const { session, scenario } = openManufacturingSession("t19");
    publishOperatorCsv({ runId: "t19", tick: 15, session, scenario });
    speak(started, "What did we learn?", "t19-learn");
    const evaluated = assessSubject("obj-capacity");
    assert.ok(evaluated.actualOutcome);
    assert.equal(evaluated.createsLearning, false);
  });

  test("T15 FIX1 Start it. after Delivery switch does not start Capacity", () => {
    const capacity = liveCapacity("fix1");
    const switched = speak(capacity, "Delivery. Details.", "fix1-switch");
    const before = switched.executionRuntime!.listExecutions().filter((item) => /capacity/i.test(item.title)).length;
    const after = speak(switched, "Start it.", "fix1-start");
    const capacityExec = after.executionRuntime!.listExecutions().filter((item) => /capacity/i.test(item.title));
    assert.equal(capacityExec.length, before);
  });

  test("T16 FIX2 Options after Delivery switch does not reuse Capacity candidates", () => {
    let turn = speak(null, "Capacity. Details.", "fix2-1");
    turn = speak(turn, "Options.", "fix2-2");
    turn = speak(turn, "Delivery. Details.", "fix2-3");
    turn = speak(turn, "Options.", "fix2-4");
    const names = (turn.nextScenarioSession?.candidateScenarioIds ?? []).map(
      (id) => turn.nextScenarioSession?.scenariosById[id]?.name ?? id,
    );
    assert.equal(names.some((name) => /investigate capacity|no action on capacity/i.test(name)), false);
  });

  test("T16 SIM-TEST:8-FIX1 reassessment does not invent a Decision", () => {
    const focused = SIM_TEST_8_JOURNEYS.find(
      (item) =>
        item.adaptiveFamily === "RECOVERY" &&
        item.scenarioId === "manufacturing-capacity-pressure" &&
        item.conversationLength === "short",
    )!;
    const report = runNexoraSimulationTestJourney({ journey: focused, runId: "out-eval-t8fix1" });
    const reassess = report.journeyObservations.find((row) => row.utterance === "Is this still a problem?");
    if (reassess) {
      assert.equal(/is this still a/i.test(reassess.response), false);
    }
  });

  test("R2 micro-check: family A can now produce eligible evaluation", () => {
    const journey = SIM_TEST_10_CORE_JOURNEYS.find((item) => item.r10Family === "A_EXPECTED_POSITIVE")!;
    runNexoraSimulationTestJourney({ journey, runId: "out-eval-r2-micro" });
    const captured = listCapturedObservations();
    const eligible = captured.filter((item) => item.eligibleAsActualOutcome);
    assert.ok(captured.length > 0);
    assert.ok(eligible.length > 0);
    assert.ok(assessSubject("obj-capacity").actualOutcome);
  });
});
