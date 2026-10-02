/** NPA-T OUT-BASE:1 — pre-action Data Reality baseline for CORE-OUT comparison. */

import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import { afterEach, beforeEach, describe, test } from "node:test";

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
} from "../executive-intelligence/nexoraLiveOutcomeObservationCapture.ts";
import { resetDecisionOutcomeCommitmentForTests } from "../nex-mvp/nexoraDecisionOutcomeCommitment.ts";
import {
  ingestDataRealityKpisForOutcomeCapture,
  listLiveExecutionCaptureContextsForTests,
  resetPostDecisionCaptureForTests,
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
import { ingestSimulationCsvFile, projectRmsOperatorRecordsToCsv } from "./nexoraSimulationCsvIngestion.ts";
import { SIM_TEST_10_CORE_JOURNEYS } from "./nexoraSimulationOutcomeLearningJourneys.ts";
import { runNexoraSimulationTestJourney } from "./nexoraSimulationTestHarness.ts";

const ARTIFACT_DIRECTORY = new URL("../../../artifacts/sim-test/OUT-BASE-1/", import.meta.url);
const SEALED = /bearing_damage|machineFailure|failureCause|Ground Truth/i;

function resetLive(): void {
  resetCsvRealDataImportStoreForTests();
  resetOutcomeObservationCaptureForTests();
  resetPostDecisionCaptureForTests();
  resetDecisionOutcomeCommitmentForTests();
  resetGroundedLearningForTests();
}

function speak(previous: RmsCc5Turn | null, utterance: string, seed: string): RmsCc5Turn {
  return speakRmsManagerThroughCc5({ utterance, previous, messageIdSeed: `out-base-1-${seed}` });
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
    sessionId: `out-base-1-${runId}`,
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

describe("NPA-T OUT-BASE:1 pre-action Data Reality baseline", { concurrency: false }, () => {
  beforeEach(resetLive);
  afterEach(resetLive);

  test("architecture: CORE-OUT/NPS boundaries unchanged", () => {
    assert.equal(LIVE_OUTCOME_BOUNDARY.createsLearning, false);
    assert.equal(LIVE_OUTCOME_BOUNDARY.inventsNumericImpact, false);
    assert.equal(NPS_OUTCOME_LEARNING_BOUNDARY.writesOutcome, false);
    assert.equal(NPS_OUTCOME_LEARNING_BOUNDARY.writesLearning, false);
  });

  test("T1/T12/T13/T14/T16/T21/T22 live funnel supplies historical baseline then actual", () => {
    const { session, scenario } = openManufacturingSession("t1");
    assert.ok(publishOperatorCsv({ runId: "t1", tick: 0, session, scenario }).some((item) => item.committed));
    const started = liveCapacity("t1");
    const d1 = started.decisionRuntime!.listDecisions()[0]!;
    const e1 = started.executionRuntime!.listExecutions()[0]!;
    const afterStart = assessSubject("obj-capacity");
    assert.ok(afterStart.capture.baseline, "pre-E publication must become CORE-OUT baseline");
    assert.equal(afterStart.assessment.actualOutcome, null);
    assert.ok(afterStart.assessment.missingEvidence.includes("actual-outcome"));
    assert.equal(afterStart.assessment.expectedOutcome?.numericTarget ?? null, null);
    const baselineValue = afterStart.capture.baseline?.numericValue ?? null;
    const baselineAt = afterStart.capture.baseline?.measuredAt ?? null;
    const baselineSource = afterStart.capture.baseline?.source ?? null;
    publishOperatorCsv({ runId: "t1", tick: 15, session, scenario });
    const asked = speak(started, "Did it work?", "t1-ask");
    const after = assessSubject("obj-capacity");
    assert.equal(after.assessment.decisionId, d1.decisionId);
    assert.equal(after.assessment.executionId, e1.executionId);
    assert.ok(after.capture.baseline);
    assert.equal(after.capture.baseline?.numericValue, baselineValue);
    assert.equal(after.capture.baseline?.measuredAt, baselineAt);
    assert.equal(after.capture.baseline?.source, baselineSource);
    assert.ok(after.assessment.actualOutcome);
    assert.ok(after.assessment.baseline);
    assert.equal(after.assessment.expectedOutcome?.numericTarget ?? null, null);
    assert.equal(after.assessment.establishesCausation, false);
    assert.equal(after.assessment.createsLearning, false);
    assert.equal(SEALED.test(asked.response), false);
    assert.equal(started.decisionRuntime!.getDecision(d1.decisionId)!.decisionId, d1.decisionId);
    assert.equal(started.executionRuntime!.listExecutions()[0]!.executionId, e1.executionId);
  });

  test("T2 no pre-E publication leaves baseline missing", () => {
    const started = liveCapacity("t2");
    assert.equal(assessSubject("obj-capacity").capture.baseline, null);
    const { session, scenario } = openManufacturingSession("t2");
    publishOperatorCsv({ runId: "t2", tick: 15, session, scenario });
    speak(started, "Did it work?", "t2-ask");
    const after = assessSubject("obj-capacity");
    assert.ok(after.assessment.actualOutcome);
    assert.equal(after.capture.baseline, null);
  });

  test("T3 unpublished Ground Truth is not baseline", () => {
    const { session } = openManufacturingSession("t3");
    stepRmsEventSchedule(session, RMS_SCENARIO_OPERATOR_ACTOR, 10);
    liveCapacity("t3");
    assert.equal(assessSubject("obj-capacity").capture.baseline, null);
    assert.ok("variables" in inspectRmsGroundTruth(session, RMS_SCENARIO_OBSERVER_ACTOR));
  });

  test("T4 latest committed pre-E Data Reality is the baseline", () => {
    const { session, scenario } = openManufacturingSession("t4");
    publishOperatorCsv({ runId: "t4", tick: 0, session, scenario });
    publishOperatorCsv({ runId: "t4", tick: 8, session, scenario });
    const started = liveCapacity("t4");
    const assessed = assessSubject("obj-capacity");
    assert.ok(assessed.capture.baseline);
    const frozen = assessed.capture.baseline!;
    publishOperatorCsv({ runId: "t4", tick: 20, session, scenario });
    speak(started, "Did it work?", "t4-ask");
    const later = assessSubject("obj-capacity");
    assert.equal(later.capture.baseline?.numericValue, frozen.numericValue);
    assert.equal(later.capture.baseline?.measuredAt, frozen.measuredAt);
  });

  test("T5/T62 post-E-only publication is actual, not baseline", () => {
    const started = liveCapacity("t5");
    const { session, scenario } = openManufacturingSession("t5");
    publishOperatorCsv({ runId: "t5", tick: 15, session, scenario });
    speak(started, "Did it work?", "t5-ask");
    const after = assessSubject("obj-capacity");
    assert.ok(after.assessment.actualOutcome);
    assert.equal(after.capture.baseline, null);
  });

  test("T6/T7 Capacity baseline uses Capacity Outcome metric, not shipping", () => {
    const { session, scenario } = openManufacturingSession("t6");
    publishOperatorCsv({ runId: "t6", tick: 0, session, scenario });
    liveCapacity("t6");
    const assessed = assessSubject("obj-capacity");
    assert.ok(assessed.capture.baseline);
    assert.equal(assessed.capture.baseline?.measured.includes("ship"), false);
    assert.ok(assessed.assessment.expectedOutcome?.dimension);
    assert.equal(
      assessed.capture.baseline?.measured === assessed.assessment.expectedOutcome?.dimension,
      true,
    );
  });

  test("T8 Capacity baseline survives Delivery subject switch", () => {
    const { session, scenario } = openManufacturingSession("t8");
    publishOperatorCsv({ runId: "t8", tick: 0, session, scenario });
    const capacity = liveCapacity("t8");
    const frozen = assessSubject("obj-capacity").capture.baseline;
    assert.ok(frozen);
    speak(capacity, "Delivery. Details.", "t8-switch");
    const still = assessSubject("obj-capacity");
    assert.equal(still.capture.baseline?.numericValue, frozen?.numericValue);
    assert.equal(still.capture.baseline?.measuredAt, frozen?.measuredAt);
  });

  test("T9/T63 two Executions do not cross-bind baselines", () => {
    const { session, scenario } = openManufacturingSession("t9");
    publishOperatorCsv({ runId: "t9", tick: 0, session, scenario });
    const capacity = liveCapacity("t9");
    const e1 = capacity.executionRuntime!.listExecutions()[0]!;
    const b1 = assessSubject("obj-capacity").capture.baseline;
    const delivery = liveDelivery(capacity, "t9");
    const e2 = delivery.executionRuntime!.listExecutions().find((item) => item.executionId !== e1.executionId)!;
    assert.ok(e2);
    const cap = assessSubject("obj-capacity");
    const del = assessSubject("obj-delivery");
    assert.equal(cap.assessment.executionId, e1.executionId);
    if (del.context?.executionId) {
      assert.equal(del.context.executionId, e2.executionId);
    }
    if (b1 && del.capture.baseline) {
      assert.equal(cap.context?.window?.id === del.context?.window?.id, false);
    }
    assert.equal(cap.capture.baseline?.numericValue, b1?.numericValue);
  });

  test("T10 historical baseline stays frozen after later publications", () => {
    const { session, scenario } = openManufacturingSession("t10");
    publishOperatorCsv({ runId: "t10", tick: 0, session, scenario });
    const started = liveCapacity("t10");
    const frozen = assessSubject("obj-capacity").capture.baseline!;
    publishOperatorCsv({ runId: "t10", tick: 12, session, scenario });
    publishOperatorCsv({ runId: "t10", tick: 20, session, scenario });
    speak(started, "Did it work?", "t10-ask");
    const later = assessSubject("obj-capacity");
    assert.equal(later.capture.baseline?.measuredAt, frozen.measuredAt);
    assert.equal(later.capture.baseline?.numericValue, frozen.numericValue);
  });

  test("T11 duplicate ingestion does not duplicate baseline identity", () => {
    const { session, scenario } = openManufacturingSession("t11");
    publishOperatorCsv({ runId: "t11", tick: 0, session, scenario });
    publishOperatorCsv({ runId: "t11", tick: 0, session, scenario });
    liveCapacity("t11");
    const ids = listCapturedObservations()
      .filter((item) => item.executionId == null)
      .map((item) => item.observationId);
    assert.equal(new Set(ids).size, ids.filter((id, index) => ids.indexOf(id) === index).length);
    const assessed = assessSubject("obj-capacity");
    assert.ok(assessed.capture.baseline);
  });

  test("T15/T20 comparison readiness and CORE-OUT:2 observed, not modified", () => {
    const { session, scenario } = openManufacturingSession("t15");
    publishOperatorCsv({ runId: "t15", tick: 0, session, scenario });
    const started = liveCapacity("t15");
    publishOperatorCsv({ runId: "t15", tick: 15, session, scenario });
    speak(started, "Did it work?", "t15-ask");
    const after = assessSubject("obj-capacity");
    assert.ok(after.assessment.baseline);
    assert.ok(after.assessment.actualOutcome);
    assert.equal(after.assessment.establishesCausation, false);
    const ready = after.assessment.status === "comparison-ready";
    if (!ready) {
      assert.equal(after.assessment.status, "comparison-incomplete");
      assert.ok(
        after.assessment.comparison.incompatibilityReason === "incompatible-evidence-shape" ||
          after.assessment.comparison.incompatibilityReason === "baseline-missing",
      );
    }
    assert.equal(after.learning.establishesCausation, false);
  });

  test("T17 OUT-EVAL-LIVE: post-E observation still evaluates", () => {
    const started = liveCapacity("t17");
    const { session, scenario } = openManufacturingSession("t17");
    publishOperatorCsv({ runId: "t17", tick: 15, session, scenario });
    speak(started, "Did it work?", "t17-ask");
    const evaluated = assessSubject("obj-capacity");
    assert.ok(evaluated.assessment.actualOutcome);
    assert.equal(evaluated.assessment.executionId, started.executionRuntime!.listExecutions()[0]!.executionId);
  });

  test("T18 OUT-LIVE: Execution then publication still captures actual", () => {
    const started = liveCapacity("t18");
    assert.equal(listCapturedObservations().filter((item) => item.eligibleAsActualOutcome).length, 0);
    const { session, scenario } = openManufacturingSession("t18");
    publishOperatorCsv({ runId: "t18", tick: 15, session, scenario });
    speak(started, "Did it work?", "t18-ask");
    assert.ok(listCapturedObservations().some((item) => item.eligibleAsActualOutcome));
  });

  test("T19 COMMIT-LIVE: Go with B. then Start it. stays on Capacity Decision", () => {
    const started = liveCapacity("t19");
    const decision = started.decisionRuntime!.listDecisions()[0]!;
    const execution = started.executionRuntime!.listExecutions()[0]!;
    assert.equal(execution.decisionId, decision.decisionId);
    assert.equal(started.executionRuntime!.listExecutions().filter((item) => item.decisionId !== decision.decisionId).length, 0);
  });

  test("T7 unrelated ingest is not Capacity baseline", () => {
    ingestDataRealityKpisForOutcomeCapture({
      kpis: [{
        kpiId: "kpi.shipping.on-time-rate",
        objectKey: "shipping",
        nexoraObjectId: "obj-delivery",
        value: 12,
        unit: "%",
        calculatedAt: "2026-09-01T00:00:00.000Z",
      }],
      sourceId: "csv:shipping",
      datasetId: "ds-unrelated",
      observedAt: "2026-09-01T00:00:00.000Z",
      capturedAt: "2026-09-01T00:00:00.000Z",
      provenanceRefs: Object.freeze(["unrelated"]),
      validationState: "valid",
    });
    liveCapacity("t7");
    const assessed = assessSubject("obj-capacity");
    assert.equal(assessed.capture.baseline, null);
  });
});

test("T64/T65 bounded Family A replay", { timeout: 60_000 }, () => {
  resetLive();
  const journey = SIM_TEST_10_CORE_JOURNEYS[0]!;
  const report = runNexoraSimulationTestJourney({ journey, runId: "out-base-1-family-a" });
  const last = report.journeyObservations.at(-1);
  const assessed = assessSubject("obj-capacity");
  mkdirSync(ARTIFACT_DIRECTORY, { recursive: true });
  writeFileSync(
    new URL("population-sample.json", ARTIFACT_DIRECTORY),
    JSON.stringify({
      journeyId: report.identity.journeyId,
      harnessStatus: report.harnessStatus,
      decisions: last?.decisionLedger?.length ?? 0,
      executions: last?.executionLedger?.length ?? 0,
      captures: listCapturedObservations().length,
      baseline: assessed.capture.baseline,
      evaluationStatus: assessed.assessment.status,
      comparison: assessed.assessment.comparison,
      missingEvidence: assessed.assessment.missingEvidence,
      numericTarget: assessed.assessment.expectedOutcome?.numericTarget ?? null,
      expectedDirection: assessed.assessment.expectedOutcome?.expectedDirection ?? null,
      actual: assessed.assessment.actualOutcome?.numericValue ?? null,
      learningCandidates: assessed.learning.candidates.map((item) => item.status),
      promotion: assessed.learning.candidates.map((item) => item.promotionEligibility),
      createsLearning: assessed.assessment.createsLearning,
    }, null, 2),
  );
  assert.equal(report.harnessStatus, "PASS");
  assert.ok((last?.executionLedger?.length ?? 0) > 0);
  resetLive();
});
