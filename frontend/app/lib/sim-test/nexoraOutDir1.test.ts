/** NPA-T OUT-DIR:1 — discovery of live observedDirection. No inference. */

import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import { afterEach, beforeEach, describe, test } from "node:test";

import { NEXORA_EXECUTIVE_STATES, type NexoraKPIResult } from "../data-reality/dataRealityContracts.ts";
import { EXECUTIVE_SOURCE_INTELLIGENCE_BOUNDARY } from "../data-reality/executiveSourceIntelligence.ts";
import { projectPublishedKpiObservedDirection } from "../data-reality/publishedKpiObservedDirection.ts";
import { resetCsvRealDataImportStoreForTests } from "../data-reality/csvRealDataImportStore.ts";
import {
  projectGroundedLearningIntelligence,
  resetGroundedLearningForTests,
} from "../executive-intelligence/nexoraGroundedLearningIntelligence.ts";
import {
  LIVE_OUTCOME_BOUNDARY,
  projectLiveOutcomeIntelligence,
} from "../executive-intelligence/nexoraLiveOutcomeIntelligence.ts";
import {
  listCapturedObservations,
  projectOutcomeObservationCapture,
  resetOutcomeObservationCaptureForTests,
  toEvaluatorObservation,
} from "../executive-intelligence/nexoraLiveOutcomeObservationCapture.ts";
import { parseManagerObservation } from "../nexora-entrance/nexoraOutcomeMonitoringResolution.ts";
import { NEXORA_OUTCOME_MONITORING_BOUNDARY } from "../nexora-entrance/nexoraOutcomeMonitoringTypes.ts";
import { resetDecisionOutcomeCommitmentForTests } from "../nex-mvp/nexoraDecisionOutcomeCommitment.ts";
import {
  listLiveExecutionCaptureContextsForTests,
  resetPostDecisionCaptureForTests,
} from "../nex-mvp/nexoraPostDecisionObservationCapture.ts";
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
import { ingestSimulationCsvFile, projectRmsOperatorRecordsToCsv } from "./nexoraSimulationCsvIngestion.ts";
import { SIM_TEST_10_CORE_JOURNEYS } from "./nexoraSimulationOutcomeLearningJourneys.ts";
import { runNexoraSimulationTestJourney } from "./nexoraSimulationTestHarness.ts";

const ARTIFACT_DIRECTORY = new URL("../../../artifacts/sim-test/OUT-DIR-1/", import.meta.url);

function resetLive(): void {
  resetCsvRealDataImportStoreForTests();
  resetOutcomeObservationCaptureForTests();
  resetPostDecisionCaptureForTests();
  resetDecisionOutcomeCommitmentForTests();
  resetGroundedLearningForTests();
}

function speak(previous: RmsCc5Turn | null, utterance: string, seed: string): RmsCc5Turn {
  return speakRmsManagerThroughCc5({ utterance, previous, messageIdSeed: `out-dir-1-${seed}` });
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
    sessionId: `out-dir-1-${runId}`,
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
  const assessment = projectLiveOutcomeIntelligence({
    subjectId,
    decisionId: context?.decisionId ?? null,
    executionId: context?.executionId ?? null,
    expected: context?.expected ?? null,
    capture,
  });
  const learning = projectGroundedLearningIntelligence({
    workspaceId: "nexora-mvp",
    subjectId,
    createdAt: assessment.actualOutcome?.observedAt ?? "core-out2:session",
    assessment,
    capture,
    decisionId: assessment.decisionId,
    executionId: assessment.executionId,
  });
  return Object.freeze({ assessment, capture, learning, context });
}

describe("NPA-T OUT-DIR:1 live observedDirection discovery", { concurrency: false }, () => {
  beforeEach(resetLive);
  afterEach(resetLive);

  test("T1/T2 Data Reality KPI and executive state are not Outcome observedDirection", () => {
    const sample: NexoraKPIResult = {
      kpiId: "kpi.capacity.utilization",
      objectKey: "capacity",
      nexoraObjectId: "obj-capacity",
      value: 90.91,
      unit: "%",
      calculatedAt: "t0",
    };
    assert.deepEqual(Object.keys(sample).sort(), [
      "calculatedAt",
      "kpiId",
      "nexoraObjectId",
      "objectKey",
      "unit",
      "value",
    ]);
    assert.equal("direction" in sample, false);
    assert.deepEqual([...NEXORA_EXECUTIVE_STATES], ["normal", "attention", "critical"]);
    assert.equal(EXECUTIVE_SOURCE_INTELLIGENCE_BOUNDARY.ownsExecutiveTruth, false);
    assert.equal(LIVE_OUTCOME_BOUNDARY.inventsNumericImpact, false);
  });

  test("T4 NEX-ENT observation.state is manager-reported, not RMS Data Reality", () => {
    assert.equal(NEXORA_OUTCOME_MONITORING_BOUNDARY.writesDataReality, false);
    const parsed = parseManagerObservation("On-time delivery improved to 94%.", {
      goalDiscovery: { object: { id: "goal-x" } },
      realityDiscovery: { context: { gap: { measure: "otd", currentValue: "88%", targetValue: "95%" } } },
      executionPlanning: { canonicalExecutionId: "e1" },
    } as never, []);
    assert.ok(parsed);
    assert.equal(parsed!.source, "manager-reported");
    assert.equal(parsed!.state, "improved");
  });

  test("T3/T5/T9/T10/T15/T16/T23/T24 no canonical direction on live CC:5 path", () => {
    const started = liveCapacity("t5");
    const before = assessSubject("obj-capacity");
    assert.equal(before.assessment.actualOutcome?.observedDirection ?? null, null);
    const { session, scenario } = openManufacturingSession("t5");
    const askedEarly = speak(started, "Did it work?", "t5-early");
    assert.equal(/bearing_damage|machineFailure/i.test(askedEarly.response), false);
    stepRmsEventSchedule(session, RMS_SCENARIO_OPERATOR_ACTOR, 10);
    assert.ok("variables" in inspectRmsGroundTruth(session, RMS_SCENARIO_OBSERVER_ACTOR));
    assert.equal(assessSubject("obj-capacity").assessment.actualOutcome?.observedDirection ?? null, null);
  });

  test("T11/T12/T13/T14/T21/T22 live funnel: CORE-OUT observedDirection matches RDI, not local arithmetic", () => {
    const { session, scenario } = openManufacturingSession("t11");
    publishOperatorCsv({ runId: "t11", tick: 0, session, scenario });
    const started = liveCapacity("t11");
    const afterStart = assessSubject("obj-capacity");
    const baseline = afterStart.capture.baseline;
    assert.ok(baseline);
    const expectedDirection = afterStart.assessment.expectedOutcome?.expectedDirection ?? null;
    publishOperatorCsv({ runId: "t11", tick: 15, session, scenario });
    speak(started, "Did it work?", "t11-ask");
    const after = assessSubject("obj-capacity");
    const rdi = projectPublishedKpiObservedDirection({
      kpiId: "kpi.production.capacity-utilization",
      subjectId: "obj-capacity",
    });
    assert.ok(after.assessment.actualOutcome);
    assert.equal(after.assessment.actualOutcome?.observedDirection ?? null, rdi.observedDirection);
    assert.equal(after.assessment.expectedOutcome?.expectedDirection, expectedDirection);
    assert.notEqual(after.assessment.expectedOutcome?.expectedDirection, after.assessment.actualOutcome?.observedDirection);
    assert.equal(after.capture.baseline?.numericValue, baseline?.numericValue);
    assert.equal(after.capture.baseline?.measuredAt, baseline?.measuredAt);
    assert.equal(after.assessment.expectedOutcome?.numericTarget ?? null, null);
    assert.equal(after.assessment.expectedOutcome?.comparator ?? null, null);
    assert.ok((after.assessment.actualOutcome?.numericValue ?? 0) > (baseline?.numericValue ?? 0));
    assert.equal(after.assessment.establishesCausation, false);
    const eligible = listCapturedObservations().filter((item) => item.eligibleAsActualOutcome);
    assert.ok(eligible.length > 0);
    const evaluator = toEvaluatorObservation(eligible[0]!);
    assert.equal(evaluator?.observedDirection ?? null, rdi.observedDirection);
    assert.equal(eligible[0]!.qualitativeState, null);
  });

  test("T7/T8/T17/T18 Delivery switch does not bind Capacity RDI direction to Delivery", () => {
    const { session, scenario } = openManufacturingSession("t8");
    publishOperatorCsv({ runId: "t8", tick: 0, session, scenario });
    const capacity = liveCapacity("t8");
    publishOperatorCsv({ runId: "t8", tick: 15, session, scenario });
    speak(capacity, "Did it work?", "t8-ask");
    const cap = assessSubject("obj-capacity");
    const delivery = liveDelivery(capacity, "t8");
    speak(delivery, "Delivery. Details.", "t8-switch");
    const still = assessSubject("obj-capacity");
    const del = assessSubject("obj-delivery");
    assert.equal(still.assessment.actualOutcome?.observedDirection, cap.assessment.actualOutcome?.observedDirection);
    assert.notEqual(del.assessment.actualOutcome?.observedDirection ?? null, "increase");
  });

  test("T6 not implemented: no valid canonical direction to project", () => {
    assert.equal(LIVE_OUTCOME_BOUNDARY.createsLearning, false);
  });
});

test("T82 R4 Family A replay now receives RDI increase through CORE-OUT:1A", { timeout: 60_000 }, () => {
  resetLive();
  const report = runNexoraSimulationTestJourney({
    journey: SIM_TEST_10_CORE_JOURNEYS[0]!,
    runId: "out-dir-1-family-a",
  });
  const assessed = assessSubject("obj-capacity");
  mkdirSync(ARTIFACT_DIRECTORY, { recursive: true });
  writeFileSync(
    new URL("r4-replay.json", ARTIFACT_DIRECTORY),
    JSON.stringify({
      journeyId: report.identity.journeyId,
      harnessStatus: report.harnessStatus,
      baseline: assessed.capture.baseline,
      expectedDirection: assessed.assessment.expectedOutcome?.expectedDirection ?? null,
      numericTarget: assessed.assessment.expectedOutcome?.numericTarget ?? null,
      actual: assessed.assessment.actualOutcome?.numericValue ?? null,
      observedDirection: assessed.assessment.actualOutcome?.observedDirection ?? null,
      comparison: assessed.assessment.comparison,
      status: assessed.assessment.status,
      createsLearning: assessed.assessment.createsLearning,
      productionRepair: "projected-from-rdi-dir-1",
    }, null, 2),
  );
  assert.equal(report.harnessStatus, "PASS");
  assert.ok(assessed.capture.baseline);
  assert.ok(assessed.assessment.actualOutcome);
  assert.equal(assessed.assessment.actualOutcome?.observedDirection ?? null, "increase");
  resetLive();
});
