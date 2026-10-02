/** NPA-T RDI-DIR:1 — canonical published KPI observed direction. */

import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import { afterEach, beforeEach, describe, test } from "node:test";

import {
  CORE_OUT_OBSERVED_DIRECTION_VOCABULARY,
  PUBLISHED_KPI_OBSERVED_DIRECTION_BOUNDARY,
  PUBLISHED_KPI_TO_CORE_OUT_DIRECTION_COMPATIBILITY,
  getPublishedKpiObservedDirectionIdentity,
  projectPublishedKpiObservedDirection,
  publishedKpiObservedDirectionIdentity,
  resolvePublishedKpiObservedDirectionFromObservations,
  type PublishedKpiObservation,
} from "../data-reality/publishedKpiObservedDirection.ts";
import { NEXORA_PUBLISHED_KPI_OBSERVED_DIRECTIONS } from "../data-reality/dataRealityContracts.ts";
import {
  commitPreparedCsvRealDataImport,
  listCsvPublishedKpiObservations,
  resetCsvRealDataImportStoreForTests,
} from "../data-reality/csvRealDataImportStore.ts";
import { prepareCsvRealDataImport } from "../data-reality/csvRealDataVerticalSlice.ts";
import { EXECUTIVE_SOURCE_INTELLIGENCE_BOUNDARY } from "../data-reality/executiveSourceIntelligence.ts";
import { resetLiveDataConnectionStoreForTests } from "../data-reality/liveDataConnectionStore.ts";
import {
  listCapturedObservations,
  toEvaluatorObservation,
  resetOutcomeObservationCaptureForTests,
} from "../executive-intelligence/nexoraLiveOutcomeObservationCapture.ts";
import { resetGroundedLearningForTests } from "../executive-intelligence/nexoraGroundedLearningIntelligence.ts";
import { resetDecisionOutcomeCommitmentForTests } from "../nex-mvp/nexoraDecisionOutcomeCommitment.ts";
import { resetPostDecisionCaptureForTests } from "../nex-mvp/nexoraPostDecisionObservationCapture.ts";
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
import { ingestSimulationCsvFile, projectRmsOperatorRecordsToCsv } from "../sim-test/nexoraSimulationCsvIngestion.ts";

const ARTIFACT_DIRECTORY = new URL("../../../artifacts/sim-test/RDI-DIR-1/", import.meta.url);
const CAPACITY_KPI = "kpi.production.capacity-utilization";
const CAPACITY_SUBJECT = "obj-capacity";
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
  const existing = prepared.sourceContextId;
  const prior = listCsvPublishedKpiObservations().some((entry) => entry.sourceContextId === existing);
  const result = commitPreparedCsvRealDataImport({
    prepared,
    expectedWorkspaceId: "overview",
    mode: prior ? "replace" : "new",
    committedAt: input.observedAt,
  });
  assert.equal(result.committed, true, result.reason);
  return result.current!;
}

function observation(partial: Partial<PublishedKpiObservation> & Pick<PublishedKpiObservation, "observationId" | "value" | "observedAt">): PublishedKpiObservation {
  return Object.freeze({
    kpiId: CAPACITY_KPI,
    objectKey: "production",
    nexoraObjectId: "obj-capacity",
    unit: "%",
    sourceContextId: "csv:overview:production",
    publicationId: partial.observationId,
    channel: "csv" as const,
    provenance: Object.freeze([partial.observationId]),
    ...partial,
  });
}

function speak(previous: RmsCc5Turn | null, utterance: string, seed: string): RmsCc5Turn {
  return speakRmsManagerThroughCc5({ utterance, previous, messageIdSeed: `rdi-dir-1-${seed}` });
}

function openManufacturingSession(runId: string) {
  const scenario = resolveRmsScenario({ scenarioId: "manufacturing-capacity-pressure", version: "1.0" });
  const world = scenario.instantiateWorld();
  const session = createRmsFoundationSession({
    simulationId: `rms-7:${scenario.scenarioId}`,
    simulationType: "scenario-library",
    sessionId: `rdi-dir-1-${runId}`,
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

describe("NPA-T RDI-DIR:1 published KPI observed direction", { concurrency: false }, () => {
  beforeEach(resetAll);
  afterEach(resetAll);

  test("T1 owner is P0:1/RDI published KPI, not CORE-OUT or RDI:3 evaluation", () => {
    const identity = getPublishedKpiObservedDirectionIdentity();
    assert.equal(identity.id, publishedKpiObservedDirectionIdentity);
    assert.equal(PUBLISHED_KPI_OBSERVED_DIRECTION_BOUNDARY.owner, "P0:1/NexoraDataRealityFoundation");
    assert.equal(PUBLISHED_KPI_OBSERVED_DIRECTION_BOUNDARY.ownsOutcomeEvaluation, false);
    assert.equal(PUBLISHED_KPI_OBSERVED_DIRECTION_BOUNDARY.copiesRdi3ImprovedDeteriorated, false);
    assert.equal(EXECUTIVE_SOURCE_INTELLIGENCE_BOUNDARY.ownsExecutiveTruth, false);
    assert.deepEqual([...NEXORA_PUBLISHED_KPI_OBSERVED_DIRECTIONS], ["increase", "decrease", "stable"]);
  });

  test("T2/T9 first observation has no direction", () => {
    commitOpsCsv({ importId: "t2", observedAt: T1, usedCapacity: 10, totalCapacity: 11 });
    const projected = projectPublishedKpiObservedDirection({ kpiId: CAPACITY_KPI, subjectId: CAPACITY_SUBJECT });
    assert.equal(projected.observedDirection, null);
    assert.equal(projected.absenceReason, "first-observation");
    assert.equal(projected.establishesCausation, false);
    assert.equal(projected.evaluatesOutcome, false);
  });

  test("T3 increase 90.91 → 100", () => {
    commitOpsCsv({ importId: "t3-a", observedAt: T1, usedCapacity: 10, totalCapacity: 11 });
    commitOpsCsv({ importId: "t3-b", observedAt: T2, usedCapacity: 100, totalCapacity: 100 });
    const projected = projectPublishedKpiObservedDirection({ kpiId: CAPACITY_KPI, subjectId: CAPACITY_SUBJECT });
    assert.equal(projected.observedDirection, "increase");
    assert.ok(projected.previousValue != null && projected.previousValue > 90 && projected.previousValue < 91);
    assert.equal(projected.currentValue, 100);
    assert.ok(projected.previousObservationId);
    assert.ok(projected.currentObservationId);
    assert.ok(projected.previousObservedAt! < projected.currentObservedAt!);
  });

  test("T4 decrease 100 → 90", () => {
    commitOpsCsv({ importId: "t4-a", observedAt: T1, usedCapacity: 100, totalCapacity: 100 });
    commitOpsCsv({ importId: "t4-b", observedAt: T2, usedCapacity: 90, totalCapacity: 100 });
    assert.equal(
      projectPublishedKpiObservedDirection({ kpiId: CAPACITY_KPI, subjectId: CAPACITY_SUBJECT }).observedDirection,
      "decrease",
    );
  });

  test("T5 exact stable 100 → 100", () => {
    commitOpsCsv({ importId: "t5-a", observedAt: T1, usedCapacity: 100, totalCapacity: 100 });
    commitOpsCsv({ importId: "t5-b", observedAt: T2, usedCapacity: 100, totalCapacity: 100 });
    assert.equal(
      projectPublishedKpiObservedDirection({ kpiId: CAPACITY_KPI, subjectId: CAPACITY_SUBJECT }).observedDirection,
      "stable",
    );
  });

  test("T6 different metrics do not compare", () => {
    const projected = resolvePublishedKpiObservedDirectionFromObservations(
      [
        observation({ observationId: "o1", value: 90, observedAt: T1, kpiId: CAPACITY_KPI }),
        observation({ observationId: "o2", value: 100, observedAt: T2, kpiId: "kpi.shipping.on-time-rate" }),
      ],
      { kpiId: CAPACITY_KPI, subjectId: CAPACITY_SUBJECT },
    );
    assert.equal(projected.observedDirection, null);
    assert.equal(projected.absenceReason, "first-observation");
  });

  test("T7 different subjects do not compare", () => {
    const projected = resolvePublishedKpiObservedDirectionFromObservations(
      [
        observation({ observationId: "o1", value: 90, observedAt: T1, nexoraObjectId: "obj-capacity" }),
        observation({
          observationId: "o2",
          value: 100,
          observedAt: T2,
          kpiId: "kpi.warehouse.capacity-utilization",
          objectKey: "warehouse",
          nexoraObjectId: "obj-inventory",
        }),
      ],
      { kpiId: CAPACITY_KPI, subjectId: CAPACITY_SUBJECT },
    );
    assert.equal(projected.observedDirection, null);
  });

  test("T8 incompatible units do not compare", () => {
    const projected = resolvePublishedKpiObservedDirectionFromObservations(
      [
        observation({ observationId: "o1", value: 90, observedAt: T1, unit: "%" }),
        observation({ observationId: "o2", value: 100, observedAt: T2, unit: "units/hour" }),
      ],
      { kpiId: CAPACITY_KPI, subjectId: CAPACITY_SUBJECT },
    );
    assert.equal(projected.observedDirection, null);
    assert.equal(projected.absenceReason, "incompatible-unit");
  });

  test("T12/T13 direction follows observedAt, not array order", () => {
    const projected = resolvePublishedKpiObservedDirectionFromObservations(
      [
        observation({ observationId: "later-first", value: 100, observedAt: T2 }),
        observation({ observationId: "earlier-second", value: 90, observedAt: T1 }),
      ],
      { kpiId: CAPACITY_KPI, subjectId: CAPACITY_SUBJECT },
    );
    assert.equal(projected.observedDirection, "increase");
    assert.equal(projected.previousObservationId, "earlier-second");
    assert.equal(projected.currentObservationId, "later-first");
  });

  test("T14 duplicate same timestamp/value does not create stable", () => {
    commitOpsCsv({ importId: "t14-a", observedAt: T1, usedCapacity: 100, totalCapacity: 100 });
    commitOpsCsv({ importId: "t14-a", observedAt: T1, usedCapacity: 100, totalCapacity: 100 });
    const projected = projectPublishedKpiObservedDirection({ kpiId: CAPACITY_KPI, subjectId: CAPACITY_SUBJECT });
    assert.equal(projected.observedDirection, null);
    assert.equal(projected.absenceReason, "first-observation");
  });

  test("T15 same-timestamp replacement is correction, not trend", () => {
    commitOpsCsv({ importId: "t15-a", observedAt: T1, usedCapacity: 80, totalCapacity: 100 });
    commitOpsCsv({ importId: "t15-b", observedAt: T1, usedCapacity: 100, totalCapacity: 100 });
    const projected = projectPublishedKpiObservedDirection({ kpiId: CAPACITY_KPI, subjectId: CAPACITY_SUBJECT });
    assert.equal(projected.observedDirection, null);
    assert.equal(projected.absenceReason, "first-observation");
    assert.equal(projected.currentValue, 100);
  });

  test("T16 provenance identifies both observations", () => {
    commitOpsCsv({ importId: "t16-a", observedAt: T1, usedCapacity: 10, totalCapacity: 11 });
    commitOpsCsv({ importId: "t16-b", observedAt: T2, usedCapacity: 100, totalCapacity: 100 });
    const projected = projectPublishedKpiObservedDirection({ kpiId: CAPACITY_KPI, subjectId: CAPACITY_SUBJECT });
    assert.match(projected.previousObservationId ?? "", /t16-a/);
    assert.match(projected.currentObservationId ?? "", /t16-b/);
    assert.ok(projected.provenance.length >= 4);
  });

  test("T20 later T3 does not rewrite T1→T2 history", () => {
    commitOpsCsv({ importId: "t20-a", observedAt: T1, usedCapacity: 10, totalCapacity: 11 });
    commitOpsCsv({ importId: "t20-b", observedAt: T2, usedCapacity: 100, totalCapacity: 100 });
    const t2 = projectPublishedKpiObservedDirection({ kpiId: CAPACITY_KPI, subjectId: CAPACITY_SUBJECT });
    commitOpsCsv({ importId: "t20-c", observedAt: T3, usedCapacity: 95, totalCapacity: 100 });
    const historical = projectPublishedKpiObservedDirection({
      kpiId: CAPACITY_KPI,
      subjectId: CAPACITY_SUBJECT,
      currentObservationId: t2.currentObservationId,
    });
    const latest = projectPublishedKpiObservedDirection({ kpiId: CAPACITY_KPI, subjectId: CAPACITY_SUBJECT });
    assert.equal(historical.observedDirection, "increase");
    assert.equal(historical.currentObservationId, t2.currentObservationId);
    assert.equal(latest.observedDirection, "decrease");
  });

  test("T21/T22 multi-KPI and multi-subject isolation", () => {
    const projected = resolvePublishedKpiObservedDirectionFromObservations(
      [
        observation({ observationId: "c1", value: 90, observedAt: T1 }),
        observation({ observationId: "c2", value: 100, observedAt: T2 }),
        observation({
          observationId: "s1",
          value: 70,
          observedAt: T1,
          kpiId: "kpi.shipping.on-time-rate",
          objectKey: "shipping",
          nexoraObjectId: "obj-delivery",
          sourceContextId: "csv:overview:shipping",
        }),
        observation({
          observationId: "s2",
          value: 60,
          observedAt: T2,
          kpiId: "kpi.shipping.on-time-rate",
          objectKey: "shipping",
          nexoraObjectId: "obj-delivery",
          sourceContextId: "csv:overview:shipping",
        }),
      ],
      { kpiId: CAPACITY_KPI, subjectId: CAPACITY_SUBJECT },
    );
    assert.equal(projected.observedDirection, "increase");
    const shipping = resolvePublishedKpiObservedDirectionFromObservations(
      [
        observation({ observationId: "c1", value: 90, observedAt: T1 }),
        observation({ observationId: "c2", value: 100, observedAt: T2 }),
        observation({
          observationId: "s1",
          value: 70,
          observedAt: T1,
          kpiId: "kpi.shipping.on-time-rate",
          objectKey: "shipping",
          nexoraObjectId: "obj-delivery",
          sourceContextId: "csv:overview:shipping",
        }),
        observation({
          observationId: "s2",
          value: 60,
          observedAt: T2,
          kpiId: "kpi.shipping.on-time-rate",
          objectKey: "shipping",
          nexoraObjectId: "obj-delivery",
          sourceContextId: "csv:overview:shipping",
        }),
      ],
      { kpiId: "kpi.shipping.on-time-rate", subjectId: "obj-delivery" },
    );
    assert.equal(shipping.observedDirection, "decrease");
  });

  test("T23 mixed sources are not compared", () => {
    const projected = resolvePublishedKpiObservedDirectionFromObservations(
      [
        observation({ observationId: "a", value: 90, observedAt: T1, sourceContextId: "src-a" }),
        observation({ observationId: "b", value: 100, observedAt: T2, sourceContextId: "src-b" }),
      ],
      { kpiId: CAPACITY_KPI, subjectId: CAPACITY_SUBJECT },
    );
    assert.equal(projected.observedDirection, null);
    assert.equal(projected.absenceReason, "first-observation");
  });

  test("T24 missing and non-finite values do not create direction", () => {
    const missing = resolvePublishedKpiObservedDirectionFromObservations([], {
      kpiId: CAPACITY_KPI,
      subjectId: CAPACITY_SUBJECT,
    });
    assert.equal(missing.absenceReason, "no-matching-observation");
    const invalid = resolvePublishedKpiObservedDirectionFromObservations(
      [
        observation({ observationId: "o1", value: 90, observedAt: T1 }),
        observation({ observationId: "o2", value: Number.NaN, observedAt: T2 }),
      ],
      { kpiId: CAPACITY_KPI, subjectId: CAPACITY_SUBJECT },
    );
    assert.equal(invalid.observedDirection, null);
    assert.equal(invalid.absenceReason, "non-finite-value");
  });

  test("T25 CORE-OUT vocabulary is compatible only as a later projection, not copied here", () => {
    assert.deepEqual([...CORE_OUT_OBSERVED_DIRECTION_VOCABULARY], ["improved", "worsened", "unchanged"]);
    assert.equal(PUBLISHED_KPI_TO_CORE_OUT_DIRECTION_COMPATIBILITY.automaticProjection, false);
    assert.match(PUBLISHED_KPI_TO_CORE_OUT_DIRECTION_COMPATIBILITY.representationalNotes.increase, /not equivalent to improved/);
  });

  test("T18/T28/T29 direction works without Execution and is not Outcome/cause", () => {
    commitOpsCsv({ importId: "t18-a", observedAt: T1, usedCapacity: 10, totalCapacity: 11 });
    commitOpsCsv({ importId: "t18-b", observedAt: T2, usedCapacity: 100, totalCapacity: 100 });
    const projected = projectPublishedKpiObservedDirection({ kpiId: CAPACITY_KPI, subjectId: CAPACITY_SUBJECT });
    assert.equal(projected.observedDirection, "increase");
    assert.equal(projected.establishesCausation, false);
    assert.equal(projected.evaluatesOutcome, false);
  });
});

describe("NPA-T RDI-DIR:1 live RMS publication funnel", { concurrency: false }, () => {
  beforeEach(resetAll);
  afterEach(resetAll);

  test("T10/T11/T27 hidden GT does not create direction; publication does", () => {
    const { session, scenario } = openManufacturingSession("hidden");
    publishOperatorCsv({ runId: "hidden", tick: 0, session, scenario });
    const before = projectPublishedKpiObservedDirection({ kpiId: CAPACITY_KPI, subjectId: CAPACITY_SUBJECT });
    assert.equal(before.observedDirection, null);
    stepRmsEventSchedule(session, RMS_SCENARIO_OPERATOR_ACTOR, 15);
    assert.ok("variables" in inspectRmsGroundTruth(session, RMS_SCENARIO_OBSERVER_ACTOR));
    const hidden = projectPublishedKpiObservedDirection({ kpiId: CAPACITY_KPI, subjectId: CAPACITY_SUBJECT });
    assert.equal(hidden.observedDirection, null);
    assert.equal(hidden.absenceReason, "first-observation");
    runRmsOperatorObservation(session, RMS_SCENARIO_OPERATOR_ACTOR, { enabledSources: scenario.enabledSources });
    publishOperatorCsv({ runId: "hidden", tick: 15, session, scenario });
    const after = projectPublishedKpiObservedDirection({ kpiId: CAPACITY_KPI, subjectId: CAPACITY_SUBJECT });
    assert.equal(after.observedDirection, "increase");
  });

  test("T17/T19 expected direction and conversation subject do not alter RDI direction", () => {
    const { session, scenario } = openManufacturingSession("indep");
    publishOperatorCsv({ runId: "indep", tick: 0, session, scenario });
    let turn = speak(null, "Capacity. Details.", "focus");
    turn = speak(turn, "Options.", "options");
    turn = speak(turn, "Go with B.", "commit");
    speak(turn, "Start it.", "start");
    publishOperatorCsv({ runId: "indep", tick: 15, session, scenario });
    speak(turn, "Delivery. Details.", "switch");
    const projected = projectPublishedKpiObservedDirection({ kpiId: CAPACITY_KPI, subjectId: CAPACITY_SUBJECT });
    assert.equal(projected.observedDirection, "increase");
    mkdirSync(ARTIFACT_DIRECTORY, { recursive: true });
    writeFileSync(
      new URL("capacity-live-funnel.json", ARTIFACT_DIRECTORY),
      JSON.stringify({
        subject: CAPACITY_SUBJECT,
        metric: CAPACITY_KPI,
        previousValue: projected.previousValue,
        currentValue: projected.currentValue,
        previousObservedAt: projected.previousObservedAt,
        currentObservedAt: projected.currentObservedAt,
        observedDirection: projected.observedDirection,
        previousObservationId: projected.previousObservationId,
        currentObservationId: projected.currentObservationId,
        expectedDirectionNotUsed: true,
      }, null, 2),
    );
  });

  test("T26 CORE-OUT:1A forwards RDI increase without mapping it to improved", () => {
    const { session, scenario } = openManufacturingSession("outdir");
    publishOperatorCsv({ runId: "outdir", tick: 0, session, scenario });
    let turn = speak(null, "Capacity. Details.", "o-focus");
    turn = speak(turn, "Options.", "o-options");
    turn = speak(turn, "Go with B.", "o-commit");
    turn = speak(turn, "Start it.", "o-start");
    publishOperatorCsv({ runId: "outdir", tick: 15, session, scenario });
    speak(turn, "Did it work?", "o-ask");
    const rdi = projectPublishedKpiObservedDirection({ kpiId: CAPACITY_KPI, subjectId: CAPACITY_SUBJECT });
    assert.equal(rdi.observedDirection, "increase");
    const eligible = listCapturedObservations().filter((item) => item.eligibleAsActualOutcome);
    const evaluator = eligible[0] ? toEvaluatorObservation(eligible[0]) : null;
    assert.equal(evaluator?.observedDirection, "increase");
    assert.equal(PUBLISHED_KPI_TO_CORE_OUT_DIRECTION_COMPATIBILITY.automaticProjection, false);
    assert.equal(PUBLISHED_KPI_TO_CORE_OUT_DIRECTION_COMPATIBILITY.representationalNotes.increase, "not equivalent to improved");
  });

  test("T26 determinism: same publications replay to increase", () => {
    const first = (() => {
      const { session, scenario } = openManufacturingSession("det-a");
      publishOperatorCsv({ runId: "det-a", tick: 0, session, scenario });
      publishOperatorCsv({ runId: "det-a", tick: 15, session, scenario });
      return projectPublishedKpiObservedDirection({ kpiId: CAPACITY_KPI, subjectId: CAPACITY_SUBJECT });
    })();
    resetAll();
    const second = (() => {
      const { session, scenario } = openManufacturingSession("det-b");
      publishOperatorCsv({ runId: "det-b", tick: 0, session, scenario });
      publishOperatorCsv({ runId: "det-b", tick: 15, session, scenario });
      return projectPublishedKpiObservedDirection({ kpiId: CAPACITY_KPI, subjectId: CAPACITY_SUBJECT });
    })();
    assert.equal(first.observedDirection, "increase");
    assert.equal(second.observedDirection, first.observedDirection);
    assert.equal(first.previousValue, second.previousValue);
    assert.equal(first.currentValue, second.currentValue);
  });
});
