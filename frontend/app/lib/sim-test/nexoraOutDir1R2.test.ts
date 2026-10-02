/** NPA-T OUT-DIR:1-R2 — project canonical RDI observedDirection into CORE-OUT:1A. */

import assert from "node:assert/strict";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { afterEach, beforeEach, describe, test } from "node:test";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  commitPreparedCsvRealDataImport,
  listCsvPublishedKpiObservations,
  resetCsvRealDataImportStoreForTests,
} from "../data-reality/csvRealDataImportStore.ts";
import { prepareCsvRealDataImport } from "../data-reality/csvRealDataVerticalSlice.ts";
import { resetLiveDataConnectionStoreForTests } from "../data-reality/liveDataConnectionStore.ts";
import { projectPublishedKpiObservedDirection } from "../data-reality/publishedKpiObservedDirection.ts";
import {
  projectGroundedLearningIntelligence,
  resetGroundedLearningForTests,
} from "../executive-intelligence/nexoraGroundedLearningIntelligence.ts";
import { projectLiveOutcomeIntelligence } from "../executive-intelligence/nexoraLiveOutcomeIntelligence.ts";
import type { ExecutiveOutcomeExpectation } from "../executive-intelligence/nexoraLiveOutcomeIntelligence.ts";
import {
  LIVE_OUTCOME_OBSERVATION_BOUNDARY,
  captureOutcomeObservation,
  canonicalExpectedOutcomeId,
  listCapturedObservations,
  openOutcomeObservationWindow,
  projectOutcomeObservationCapture,
  resetOutcomeObservationCaptureForTests,
  toEvaluatorObservation,
} from "../executive-intelligence/nexoraLiveOutcomeObservationCapture.ts";
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

const ARTIFACT_DIRECTORY = new URL("../../../artifacts/sim-test/OUT-DIR-1-R2/", import.meta.url);
const here = dirname(fileURLToPath(import.meta.url));
const CAPACITY_KPI = "kpi.production.capacity-utilization";
const T1 = "2026-09-16T00:00:00.000Z";
const T2 = "2026-09-16T15:00:00.000Z";
const T3 = "2026-09-16T20:00:00.000Z";

function resetAll(): void {
  resetCsvRealDataImportStoreForTests();
  resetLiveDataConnectionStoreForTests();
  resetOutcomeObservationCaptureForTests();
  resetPostDecisionCaptureForTests();
  resetDecisionOutcomeCommitmentForTests();
  resetGroundedLearningForTests();
}

function commitOpsCsv(input: {
  readonly importId: string;
  readonly observedAt: string;
  readonly usedCapacity: number;
  readonly totalCapacity: number;
  readonly fileName?: string;
  readonly sourceContextId?: string;
}) {
  const csvText = `currentRevenue,previousRevenue,usedCapacity,totalCapacity\n120,100,${input.usedCapacity},${input.totalCapacity}\n`;
  const prepared = prepareCsvRealDataImport({
    workspaceId: "overview",
    fileName: input.fileName ?? "production.csv",
    fileSize: csvText.length,
    csvText,
    importId: input.importId,
    importedAt: input.observedAt,
    observedAt: input.observedAt,
    sourceContextId: input.sourceContextId,
  });
  assert.equal(prepared.ready, true, prepared.errors.join("; "));
  const prior = listCsvPublishedKpiObservations().some(
    (entry) => entry.sourceContextId === prepared.sourceContextId,
  );
  const result = commitPreparedCsvRealDataImport({
    prepared,
    expectedWorkspaceId: "overview",
    mode: prior ? "replace" : "new",
    committedAt: input.observedAt,
  });
  assert.equal(result.committed, true, result.reason);
  return result.current!;
}

function maintainExpected(overrides: Partial<ExecutiveOutcomeExpectation> = {}): ExecutiveOutcomeExpectation {
  return Object.freeze({
    expectationId: canonicalExpectedOutcomeId("capacity"),
    statement: "Capacity utilization is expected to maintain.",
    claimKind: "PREDICTION",
    dimension: "capacity-utilization",
    source: "scenario",
    numericTarget: null,
    comparator: null,
    unit: "%",
    expectedDirection: "maintain",
    capturedAt: "2026-01-01T00:00:00.000Z",
    evidenceRefs: Object.freeze([]),
    provenanceRefs: Object.freeze(["test:expected-maintain"]),
    ...overrides,
  });
}

function captureLinkedCapacity(input: {
  readonly observedAt: string;
  readonly sourceId: string;
  readonly value: number;
  readonly metricId?: string;
  readonly subjectId?: string;
  readonly executionId?: string;
  readonly decisionId?: string;
}) {
  const window = openOutcomeObservationWindow({
    subjectId: input.subjectId ?? "obj-capacity",
    decisionId: input.decisionId ?? "d-capacity",
    executionId: input.executionId ?? "e-capacity",
    openedAt: "2026-01-01T00:00:00.000Z",
    expectedStartAt: "2026-01-01T00:00:00.000Z",
    expectedEndAt: "2026-12-31T23:59:59.000Z",
    expectedOutcomeIds: [canonicalExpectedOutcomeId("capacity")],
  });
  return captureOutcomeObservation({
    observation: Object.freeze({
      subjectId: input.subjectId ?? "obj-capacity",
      metricId: input.metricId ?? CAPACITY_KPI,
      dimension: "capacity-utilization",
      unit: "%",
      value: input.value,
      qualitativeState: null,
      observedAt: input.observedAt,
      capturedAt: input.observedAt,
      sourceId: input.sourceId,
      datasetId: input.sourceId,
      evidenceRefs: Object.freeze([
        Object.freeze({
          sourceKind: "data-reality" as const,
          sourceId: input.sourceId,
          subjectId: input.subjectId ?? "obj-capacity",
          factKey: input.metricId ?? CAPACITY_KPI,
        }),
      ]),
      provenanceRefs: Object.freeze([input.sourceId, input.observedAt]),
      validationState: "valid" as const,
      freshnessState: "current" as const,
      decisionId: input.decisionId ?? "d-capacity",
      executionId: input.executionId ?? "e-capacity",
    }),
    expected: maintainExpected(),
    window,
    linkBasis: "metric-binding",
  });
}

function latestCapacityKpiObservation() {
  const entries = listCsvPublishedKpiObservations().filter((entry) => entry.kpiId === CAPACITY_KPI);
  return entries[entries.length - 1] ?? null;
}

function speak(previous: RmsCc5Turn | null, utterance: string, seed: string): RmsCc5Turn {
  return speakRmsManagerThroughCc5({ utterance, previous, messageIdSeed: `out-dir-1-r2-${seed}` });
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
    sessionId: `out-dir-1-r2-${runId}`,
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

describe("NPA-T OUT-DIR:1-R2 projection seam", { concurrency: false }, () => {
  beforeEach(resetAll);
  afterEach(resetAll);

  test("T1 consumes RDI projection; does not recompute from baseline/actual", () => {
    assert.equal(LIVE_OUTCOME_OBSERVATION_BOUNDARY.infersObservedDirection, false);
    assert.equal(LIVE_OUTCOME_OBSERVATION_BOUNDARY.consumesRdiPublishedDirection, true);
    const source = readFileSync(join(here, "../executive-intelligence/nexoraLiveOutcomeObservationCapture.ts"), "utf8");
    assert.match(source, /projectPublishedKpiObservedDirection/);
    assert.doesNotMatch(source, /actual\s*>\s*baseline|Math\.sign\(/);
    assert.doesNotMatch(source, /if\s*\(\s*captured\.value\s*>/);
  });

  test("T3/T4/T5/T10 increase, decrease, stable, and first-publication null", () => {
    commitOpsCsv({ importId: "inc-a", observedAt: T1, usedCapacity: 10, totalCapacity: 11 });
    const first = latestCapacityKpiObservation()!;
    const firstCapture = captureLinkedCapacity({
      observedAt: first.observedAt,
      sourceId: first.sourceContextId,
      value: first.value,
    });
    assert.equal(toEvaluatorObservation(firstCapture)?.observedDirection ?? null, null);
    commitOpsCsv({ importId: "inc-b", observedAt: T2, usedCapacity: 100, totalCapacity: 100 });
    const second = latestCapacityKpiObservation()!;
    const increased = captureLinkedCapacity({
      observedAt: second.observedAt,
      sourceId: second.sourceContextId,
      value: second.value,
    });
    assert.equal(projectPublishedKpiObservedDirection({ kpiId: CAPACITY_KPI, subjectId: "obj-capacity" }).observedDirection, "increase");
    assert.equal(toEvaluatorObservation(increased)?.observedDirection, "increase");

    resetAll();
    commitOpsCsv({ importId: "dec-a", observedAt: T1, usedCapacity: 100, totalCapacity: 100 });
    commitOpsCsv({ importId: "dec-b", observedAt: T2, usedCapacity: 90, totalCapacity: 100 });
    const decreased = latestCapacityKpiObservation()!;
    const decCapture = captureLinkedCapacity({
      observedAt: decreased.observedAt,
      sourceId: decreased.sourceContextId,
      value: decreased.value,
    });
    assert.equal(toEvaluatorObservation(decCapture)?.observedDirection, "decrease");

    resetAll();
    commitOpsCsv({ importId: "st-a", observedAt: T1, usedCapacity: 100, totalCapacity: 100 });
    commitOpsCsv({ importId: "st-b", observedAt: T2, usedCapacity: 100, totalCapacity: 100 });
    const stable = latestCapacityKpiObservation()!;
    const stCapture = captureLinkedCapacity({
      observedAt: stable.observedAt,
      sourceId: stable.sourceContextId,
      value: stable.value,
    });
    assert.equal(toEvaluatorObservation(stCapture)?.observedDirection, "stable");
  });

  test("T7/T8/T9 wrong metric, subject, and source do not project", () => {
    commitOpsCsv({ importId: "iso-a", observedAt: T1, usedCapacity: 10, totalCapacity: 11 });
    commitOpsCsv({ importId: "iso-b", observedAt: T2, usedCapacity: 100, totalCapacity: 100 });
    const current = latestCapacityKpiObservation()!;
    const wrongMetric = captureLinkedCapacity({
      observedAt: current.observedAt,
      sourceId: current.sourceContextId,
      value: current.value,
      metricId: "kpi.shipping.on-time-rate",
    });
    assert.equal(toEvaluatorObservation(wrongMetric)?.observedDirection ?? null, null);
    const wrongSubject = captureLinkedCapacity({
      observedAt: current.observedAt,
      sourceId: current.sourceContextId,
      value: current.value,
      subjectId: "obj-delivery",
    });
    assert.equal(toEvaluatorObservation(wrongSubject)?.observedDirection ?? null, null);
    const wrongSource = captureLinkedCapacity({
      observedAt: current.observedAt,
      sourceId: "csv:other-source",
      value: current.value,
    });
    assert.equal(toEvaluatorObservation(wrongSource)?.observedDirection ?? null, null);
  });

  test("T19/T24/T25/T28 historical identity, correction, idempotence", () => {
    commitOpsCsv({ importId: "hist-a", observedAt: T1, usedCapacity: 10, totalCapacity: 11 });
    commitOpsCsv({ importId: "hist-b", observedAt: T2, usedCapacity: 100, totalCapacity: 100 });
    const t2 = latestCapacityKpiObservation()!;
    const t2Capture = captureLinkedCapacity({
      observedAt: t2.observedAt,
      sourceId: t2.sourceContextId,
      value: t2.value,
    });
    assert.equal(toEvaluatorObservation(t2Capture)?.observedDirection, "increase");
    commitOpsCsv({ importId: "hist-c", observedAt: T3, usedCapacity: 95, totalCapacity: 100 });
    assert.equal(toEvaluatorObservation(t2Capture)?.observedDirection, "increase");
    const once = toEvaluatorObservation(t2Capture);
    const twice = toEvaluatorObservation(t2Capture);
    assert.equal(once?.observedDirection, twice?.observedDirection);
    assert.equal(listCapturedObservations().filter((item) => item.observationId === t2Capture.observationId).length, 1);

    resetAll();
    commitOpsCsv({ importId: "corr-a", observedAt: T1, usedCapacity: 80, totalCapacity: 100 });
    commitOpsCsv({ importId: "corr-b", observedAt: T1, usedCapacity: 100, totalCapacity: 100 });
    const corrected = latestCapacityKpiObservation()!;
    const corrCapture = captureLinkedCapacity({
      observedAt: corrected.observedAt,
      sourceId: corrected.sourceContextId,
      value: corrected.value,
    });
    assert.equal(toEvaluatorObservation(corrCapture)?.observedDirection ?? null, null);
  });

  test("T26 out-of-order publication follows RDI observedAt", () => {
    commitOpsCsv({ importId: "oo-late", observedAt: T2, usedCapacity: 100, totalCapacity: 100 });
    commitOpsCsv({ importId: "oo-early", observedAt: T1, usedCapacity: 10, totalCapacity: 11 });
    const t2 = listCsvPublishedKpiObservations().find(
      (entry) => entry.kpiId === CAPACITY_KPI && entry.observedAt === T2,
    )!;
    const captured = captureLinkedCapacity({
      observedAt: t2.observedAt,
      sourceId: t2.sourceContextId,
      value: t2.value,
    });
    assert.equal(toEvaluatorObservation(captured)?.observedDirection, "increase");
  });
});

describe("NPA-T OUT-DIR:1-R2 live RMS / CORE-OUT", { concurrency: false }, () => {
  beforeEach(resetAll);
  afterEach(resetAll);

  test("T2/T6/T13/T14-T18 Capacity increase projects with maintain expected", () => {
    const { session, scenario } = openManufacturingSession("pos");
    publishOperatorCsv({ runId: "pos", tick: 0, session, scenario });
    const started = liveCapacity("pos");
    const baseline = assessSubject("obj-capacity").capture.baseline;
    publishOperatorCsv({ runId: "pos", tick: 15, session, scenario });
    speak(started, "Did it work?", "pos-ask");
    const rdi = projectPublishedKpiObservedDirection({ kpiId: CAPACITY_KPI, subjectId: "obj-capacity" });
    const after = assessSubject("obj-capacity");
    assert.equal(rdi.observedDirection, "increase");
    assert.equal(after.assessment.actualOutcome?.observedDirection, "increase");
    assert.equal(after.assessment.expectedOutcome?.expectedDirection, "maintain");
    assert.equal(after.assessment.expectedOutcome?.numericTarget ?? null, null);
    assert.equal(after.assessment.expectedOutcome?.comparator ?? null, null);
    assert.equal(after.capture.baseline?.numericValue, baseline?.numericValue);
    assert.equal(after.assessment.actualOutcome?.numericValue, 100);
    assert.equal(after.assessment.establishesCausation, false);
    assert.ok((after.assessment.actualOutcome?.provenanceRefs.length ?? 0) > 2);
  });

  test("T11/T12 hidden GT and pre-publication ask stay null", () => {
    const { session, scenario } = openManufacturingSession("hid");
    publishOperatorCsv({ runId: "hid", tick: 0, session, scenario });
    const started = liveCapacity("hid");
    speak(started, "Did it work?", "hid-early");
    assert.equal(assessSubject("obj-capacity").assessment.actualOutcome?.observedDirection ?? null, null);
    stepRmsEventSchedule(session, RMS_SCENARIO_OPERATOR_ACTOR, 15);
    assert.ok("variables" in inspectRmsGroundTruth(session, RMS_SCENARIO_OBSERVER_ACTOR));
    assert.equal(assessSubject("obj-capacity").assessment.actualOutcome?.observedDirection ?? null, null);
    assert.equal(
      projectPublishedKpiObservedDirection({ kpiId: CAPACITY_KPI, subjectId: "obj-capacity" }).observedDirection,
      null,
    );
  });

  test("T20/T23 subject switch and Delivery isolation", () => {
    const { session, scenario } = openManufacturingSession("iso");
    publishOperatorCsv({ runId: "iso", tick: 0, session, scenario });
    const capacity = liveCapacity("iso");
    publishOperatorCsv({ runId: "iso", tick: 15, session, scenario });
    speak(capacity, "Did it work?", "iso-ask");
    const cap = assessSubject("obj-capacity");
    const delivery = liveDelivery(capacity, "iso");
    speak(delivery, "Delivery. Details.", "iso-switch");
    const still = assessSubject("obj-capacity");
    const del = assessSubject("obj-delivery");
    assert.equal(still.assessment.actualOutcome?.observedDirection, "increase");
    assert.equal(cap.assessment.actualOutcome?.observedDirection, "increase");
    assert.notEqual(del.assessment.actualOutcome?.observedDirection ?? null, "increase");
  });

  test("T27/T29/T30/T31 R4 Family A replay after projection", { timeout: 60_000 }, () => {
    const report = runNexoraSimulationTestJourney({
      journey: SIM_TEST_10_CORE_JOURNEYS[0]!,
      runId: "out-dir-1-r2-family-a",
    });
    const rdi = projectPublishedKpiObservedDirection({ kpiId: CAPACITY_KPI, subjectId: "obj-capacity" });
    const assessed = assessSubject("obj-capacity");
    mkdirSync(ARTIFACT_DIRECTORY, { recursive: true });
    writeFileSync(
      new URL("r4-replay.json", ARTIFACT_DIRECTORY),
      JSON.stringify({
        journeyId: report.identity.journeyId,
        harnessStatus: report.harnessStatus,
        rdiObservedDirection: rdi.observedDirection,
        baseline: assessed.capture.baseline?.numericValue ?? null,
        actual: assessed.assessment.actualOutcome?.numericValue ?? null,
        expectedDirection: assessed.assessment.expectedOutcome?.expectedDirection ?? null,
        observedDirection: assessed.assessment.actualOutcome?.observedDirection ?? null,
        numericTarget: assessed.assessment.expectedOutcome?.numericTarget ?? null,
        comparator: assessed.assessment.expectedOutcome?.comparator ?? null,
        status: assessed.assessment.status,
        comparable: assessed.assessment.comparison.comparable,
        reason: assessed.assessment.comparison.incompatibilityReason,
        result: assessed.assessment.comparison.result,
        missingEvidence: assessed.assessment.missingEvidence,
        establishesCausation: assessed.assessment.establishesCausation,
        createsLearning: assessed.assessment.createsLearning,
        comparisonStatus: assessed.assessment.status,
        learningCandidates: assessed.learning.candidates.length,
        promotionEligible: assessed.learning.promotions.some((item) => item.eligible),
        learningRejectionReasons: assessed.learning.rejectionReasons,
      }, null, 2),
    );
    assert.equal(report.harnessStatus, "PASS");
    assert.equal(rdi.observedDirection, "increase");
    assert.equal(assessed.assessment.actualOutcome?.observedDirection, "increase");
    assert.equal(assessed.assessment.expectedOutcome?.expectedDirection, "maintain");
    assert.equal(assessed.assessment.establishesCausation, false);
  });
});
