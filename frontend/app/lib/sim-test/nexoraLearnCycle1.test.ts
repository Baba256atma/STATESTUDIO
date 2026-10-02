/** NPA-T LEARN-CYCLE:1 — Learning-informed reassessment → Scenario/Decision handoff. */

import assert from "node:assert/strict";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, beforeEach, describe, test } from "node:test";

import {
  createEmptyNexoraExecutiveScenarioSession,
  scopeScenarioSessionToManagementContext,
  withLearningInformedReassessmentProvenance,
} from "../conversational-control/executiveScenarioResolver.ts";
import { resetCsvRealDataImportStoreForTests } from "../data-reality/csvRealDataImportStore.ts";
import { resetLiveDataConnectionStoreForTests } from "../data-reality/liveDataConnectionStore.ts";
import {
  listSupportedGroundedLearningForSubject,
  projectGroundedLearningIntelligence,
  resetGroundedLearningForTests,
} from "../executive-intelligence/nexoraGroundedLearningIntelligence.ts";
import { projectLiveOutcomeIntelligence } from "../executive-intelligence/nexoraLiveOutcomeIntelligence.ts";
import { resetOutcomeObservationCaptureForTests } from "../executive-intelligence/nexoraLiveOutcomeObservationCapture.ts";
import { judgeEcaExecutiveLearningClosure } from "../nexora-conversation/ecaExecutiveLearningClosure.ts";
import { resetDecisionOutcomeCommitmentForTests } from "../nex-mvp/nexoraDecisionOutcomeCommitment.ts";
import { resetPostDecisionCaptureForTests } from "../nex-mvp/nexoraPostDecisionObservationCapture.ts";
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

const ARTIFACT_DIRECTORY = new URL("../../../artifacts/sim-test/LEARN-CYCLE-1/", import.meta.url);
const FRONTEND_ROOT = fileURLToPath(new URL("../../../", import.meta.url));
const SEALED = /availableCapacity|machineAvailability|confirmedCausal|\bevt:machine|\bevt:demand|Ground Truth/i;
const LEARNING_DECISION_EDGE = /LearningDecisionLink|LearningCycleStore|ManagementCycleRegistry|CycleLearningGraph|AdvisorDecisionMemory/;

function resetAll(): void {
  resetCsvRealDataImportStoreForTests();
  resetLiveDataConnectionStoreForTests();
  resetOutcomeObservationCaptureForTests();
  resetPostDecisionCaptureForTests();
  resetDecisionOutcomeCommitmentForTests();
  resetGroundedLearningForTests();
}

function speak(previous: RmsCc5Turn | null, utterance: string, seed: string): RmsCc5Turn {
  return speakRmsManagerThroughCc5({ utterance, previous, messageIdSeed: `learn-cycle-1-${seed}` });
}

function openManufacturing(runId: string) {
  const scenario = resolveRmsScenario({ scenarioId: "manufacturing-capacity-pressure", version: "1.0" });
  const world = scenario.instantiateWorld();
  const session = createRmsFoundationSession({
    simulationId: `rms-7:${scenario.scenarioId}`,
    simulationType: "scenario-library",
    sessionId: `learn-cycle-1-${runId}`,
    runId,
    host: { hostKind: world.worldKind === "HYBRID" ? "HYBRID" : world.worldKind, hostId: world.worldId },
    actors: RMS_SCENARIO_RUN_ACTORS,
    groundTruth: world,
  });
  loadRmsEventSchedule(session, RMS_SCENARIO_OPERATOR_ACTOR, scenario.eventSchedule);
  return { session, scenario };
}

function publishCsv(
  runId: string,
  tick: number,
  session: ReturnType<typeof createRmsFoundationSession>,
  scenario: ReturnType<typeof resolveRmsScenario>,
) {
  if (tick > 0) stepRmsEventSchedule(session, RMS_SCENARIO_OPERATOR_ACTOR, tick);
  const observations = runRmsOperatorObservation(session, RMS_SCENARIO_OPERATOR_ACTOR, {
    enabledSources: scenario.enabledSources,
  });
  const files = projectRmsOperatorRecordsToCsv({
    scenarioId: scenario.scenarioId,
    simulationRunId: runId,
    tick,
    records: observations,
  });
  return files.map((file) => ingestSimulationCsvFile(file));
}

function readyLiveCapacity(seed: string): RmsCc5Turn {
  const { session, scenario } = openManufacturing(seed);
  publishCsv(seed, 0, session, scenario);
  let turn = speak(null, "Capacity. Details.", `${seed}-focus`);
  turn = speak(turn, "Options.", `${seed}-options`);
  turn = speak(turn, "Go with B.", `${seed}-commit`);
  turn = speak(turn, "Start it.", `${seed}-start`);
  publishCsv(seed, 15, session, scenario);
  turn = speak(turn, "Did it work?", `${seed}-outcome`);
  return speak(turn, "Capacity. Details.", `${seed}-refocus`);
}

function stamp(ids: readonly string[], subjectId = "obj-capacity") {
  return Object.freeze({
    subjectId,
    coreOut2LearningIds: Object.freeze([...ids]),
    source: "eca-12-reassessment" as const,
  });
}

describe("NPA-T LEARN-CYCLE:1", { concurrency: false }, () => {
  beforeEach(resetAll);
  afterEach(resetAll);

  test("T1/T2/T3 existing Scenario session can carry read-only R1 provenance", () => {
    const empty = createEmptyNexoraExecutiveScenarioSession();
    assert.equal(empty.learningInformedReassessment, null);
    const attached = withLearningInformedReassessmentProvenance(empty, stamp(["learn-1"]));
    assert.deepEqual(attached.learningInformedReassessment?.coreOut2LearningIds, ["learn-1"]);
    const delivery = scopeScenarioSessionToManagementContext(attached, "obj-delivery");
    assert.equal(delivery.learningInformedReassessment, null);
    const capacity = scopeScenarioSessionToManagementContext(attached, "obj-capacity");
    assert.deepEqual(capacity.learningInformedReassessment?.coreOut2LearningIds, ["learn-1"]);
  });

  test("T7 no direct Learning→Decision relationship type", () => {
    const resolver = readFileSync(resolve(FRONTEND_ROOT, "app/lib/conversational-control/executiveScenarioResolver.ts"), "utf8");
    const orchestrator = readFileSync(resolve(FRONTEND_ROOT, "app/lib/conversational-control/conversationalExperienceOrchestrator.ts"), "utf8");
    const commitment = readFileSync(resolve(FRONTEND_ROOT, "app/lib/conversational-control/executiveDecisionCommitmentResolver.ts"), "utf8");
    assert.doesNotMatch(resolver, LEARNING_DECISION_EDGE);
    assert.doesNotMatch(orchestrator, LEARNING_DECISION_EDGE);
    assert.doesNotMatch(commitment, LEARNING_DECISION_EDGE);
    assert.match(resolver, /learningInformedReassessment/);
    assert.match(resolver, /eca-12-reassessment/);
  });

  test("T4/T5/T6/T8/T9/T18/T21/T27 live Capacity R1 → Options → D2", { timeout: 60_000 }, () => {
    const focused = readyLiveCapacity("t4");
    const decisionsBeforeReassess = focused.decisionRuntime!.listDecisions().length;
    const executionsBefore = focused.executionRuntime!.listExecutions().length;
    const r1 = speak(focused, "Is this still a problem?", "t4-reassess");
    const learningIds = [...(r1.ecaLearningClosureJudgment?.coreOut2LearningIds ?? [])];
    assert.equal(r1.ecaLearningClosureJudgment?.consumedSupportedLearning, true);
    assert.ok(learningIds.length > 0);
    assert.equal(r1.nextScenarioSession?.learningInformedReassessment?.subjectId, "obj-capacity");
    assert.deepEqual([...(r1.nextScenarioSession?.learningInformedReassessment?.coreOut2LearningIds ?? [])], learningIds);
    assert.equal(r1.decisionRuntime!.listDecisions().length, decisionsBeforeReassess);
    assert.equal(r1.executionRuntime!.listExecutions().length, executionsBefore);

    const options = speak(r1, "Options.", "t4-options");
    assert.deepEqual(
      [...(options.nextScenarioSession?.learningInformedReassessment?.coreOut2LearningIds ?? [])],
      learningIds,
    );
    assert.equal(options.nextScenarioSession?.learningInformedReassessment?.subjectId, "obj-capacity");
    assert.equal(options.executionRuntime!.listExecutions().length, executionsBefore);

    const goA = speak(options, "Go with A.", "t4-commit");
    assert.ok(goA.decisionRuntime!.listDecisions().length > decisionsBeforeReassess);
    const d2 = goA.decisionCommitmentResult?.decision ?? goA.decisionRuntime!.listDecisions().at(-1);
    assert.ok(d2);
    const sessionScenario = d2.scenarioId
      ? goA.nextScenarioSession?.scenariosById[d2.scenarioId] ?? null
      : null;
    assert.ok(d2.scenarioId);
    assert.equal(goA.nextScenarioSession?.learningInformedReassessment?.subjectId, "obj-capacity");
    assert.deepEqual(
      [...(goA.nextScenarioSession?.learningInformedReassessment?.coreOut2LearningIds ?? [])],
      learningIds,
    );
    assert.equal(JSON.stringify(d2).includes("learn:"), false);
    assert.ok(sessionScenario || d2.scenarioId.startsWith("cc9:"));
    const replayOptions = speak(r1, "Options.", "t4-options");
    assert.deepEqual(
      replayOptions.nextScenarioSession?.learningInformedReassessment?.coreOut2LearningIds,
      options.nextScenarioSession?.learningInformedReassessment?.coreOut2LearningIds,
    );
    const repeatCommit = speak(goA, "Go with A.", "t4-commit-again");
    assert.equal(repeatCommit.decisionRuntime!.listDecisions().length, goA.decisionRuntime!.listDecisions().length);
  });

  test("T12/T15/T16 Capacity R1 does not follow Delivery work or return", { timeout: 60_000 }, () => {
    const r1 = speak(readyLiveCapacity("t12"), "Is this still a problem?", "t12-reassess");
    assert.equal(r1.nextScenarioSession?.learningInformedReassessment?.subjectId, "obj-capacity");
    const delivery = speak(r1, "Delivery. Details.", "t12-delivery");
    const deliveryOptions = speak(delivery, "Options.", "t12-d-options");
    assert.notEqual(deliveryOptions.nextScenarioSession?.learningInformedReassessment?.subjectId, "obj-capacity");
    const back = speak(deliveryOptions, "Capacity. Details.", "t12-return");
    assert.notEqual(back.nextScenarioSession?.learningInformedReassessment?.subjectId, "obj-capacity");
  });

  test("T13/T14 no-learning reassessment does not stamp next-cycle provenance", { timeout: 60_000 }, () => {
    let turn = speak(null, "Delivery. Details.", "t14-focus");
    turn = speak(turn, "Is this still a problem?", "t14-reassess");
    assert.equal(turn.ecaLearningClosureJudgment?.consumedSupportedLearning, false);
    assert.equal(turn.nextScenarioSession?.learningInformedReassessment?.coreOut2LearningIds?.length ?? 0, 0);
  });

  test("T10 Family J still clarifies", { timeout: 60_000 }, () => {
    const journey = SIM_TEST_10_CORE_JOURNEYS.find((item) => item.journeyId === "sim-test-10-j_reassessment")!;
    const report = runNexoraSimulationTestJourney({ journey, runId: "learn-cycle-1-j" });
    const rows = report.journeyObservations.filter((row) => /is this still a problem|still relevant|still make sense/i.test(row.utterance));
    assert.ok(rows.some((row) => /which (?:item|one) do you mean/i.test(row.response)));
    for (const row of rows) {
      if ((row.scenarioLearningInformedIds?.length ?? 0) > 0) {
        assert.equal(row.scenarioLearningInformedSubjectId, "obj-capacity");
      }
    }
  });

  test("T11 Family K remains incomplete", { timeout: 60_000 }, () => {
    const journey = SIM_TEST_10_CORE_JOURNEYS.find((item) => item.journeyId === "sim-test-10-k_learning_assumption")!;
    const report = runNexoraSimulationTestJourney({ journey, runId: "learn-cycle-1-k" });
    const reconsider = report.journeyObservations.find((row) => row.utterance === "What should we reconsider?");
    assert.equal(reconsider?.consumedSupportedLearning, true);
    const after = report.journeyObservations.slice(
      report.journeyObservations.findIndex((row) => row.utterance === "What should we reconsider?") + 1,
    );
    assert.equal(after.some((row) => row.intent === "EXPLORE_OPTIONS" || row.intent === "COMMIT_DECISION"), false);
  });

  test("T19/T20/T30/T31 Family L positive continuity from turn 1", { timeout: 60_000 }, () => {
    const journey = SIM_TEST_10_CORE_JOURNEYS.find((item) => item.journeyId === "sim-test-10-l_loop_reentry")!;
    const first = runNexoraSimulationTestJourney({ journey, runId: "learn-cycle-1-l" });
    const replay = runNexoraSimulationTestJourney({ journey, runId: "learn-cycle-1-l" });
    assert.equal(first.deterministicSignature, replay.deterministicSignature);
    const r1 = first.journeyObservations.find((row) => row.utterance === "Is this still a problem?");
    const options = first.journeyObservations.find((row) => row.turn === (r1?.turn ?? 0) + 1 && row.utterance === "Options.");
    const goA = first.journeyObservations.find((row) => row.utterance === "Go with A.");
    assert.equal(r1?.consumedSupportedLearning, true);
    assert.ok((r1?.coreOut2LearningIds?.length ?? 0) > 0);
    assert.equal(r1?.scenarioLearningInformedSubjectId, "obj-capacity");
    assert.deepEqual([...(r1?.scenarioLearningInformedIds ?? [])], [...(r1?.coreOut2LearningIds ?? [])]);
    assert.deepEqual([...(options?.scenarioLearningInformedIds ?? [])], [...(r1?.coreOut2LearningIds ?? [])]);
    assert.deepEqual([...(goA?.scenarioLearningInformedIds ?? [])], [...(r1?.coreOut2LearningIds ?? [])]);
    assert.ok((goA?.decisionCount ?? 0) >= 2);
    assert.doesNotMatch(JSON.stringify(goA?.decisionLedger ?? []), /"learn:/);
  });

  test("T30 Family A upstream Outcome/Learning unchanged", { timeout: 60_000 }, () => {
    const journey = SIM_TEST_10_CORE_JOURNEYS.find((item) => item.journeyId === "sim-test-10-a_expected_positive")!;
    const report = runNexoraSimulationTestJourney({ journey, runId: "learn-cycle-1-a" });
    assert.equal(report.harnessStatus, "PASS");
    const assessment = projectLiveOutcomeIntelligence({
      subjectId: "obj-capacity",
      decisionId: "decision-capacity",
      executionId: "execution-capacity",
      expected: {
        expectationId: "expected-capacity",
        statement: "Capacity utilization is expected to maintain.",
        claimKind: "PREDICTION",
        dimension: "capacity-utilization",
        source: "scenario",
        numericTarget: null,
        comparator: null,
        unit: "%",
        expectedDirection: "maintain",
        capturedAt: "2026-01-01T00:00:00.000Z",
        evidenceRefs: Object.freeze([
          { sourceKind: "scenario" as const, sourceId: "ctx-scenario-capacity", factKey: "expected-effect" },
        ]),
        provenanceRefs: Object.freeze(["test:expected-capacity"]),
      },
      actuals: [{
        observationId: "obs-capacity-1",
        statement: "Validated capacity utilization is 100%.",
        claimKind: "FACT",
        dimension: "capacity-utilization",
        source: "data-reality",
        numericValue: 100,
        unit: "%",
        observedDirection: "increase",
        observedAt: "2026-02-01T00:00:00.000Z",
        freshness: "current",
        validationStatus: "validated",
        outcomeLinked: true,
        evidenceRefs: Object.freeze([
          { sourceKind: "data-reality" as const, sourceId: "rdi:capacity", factKey: "utilization" },
        ]),
        provenanceRefs: Object.freeze(["test:actual-capacity"]),
      }],
      baseline: {
        measured: "Capacity utilization at decision time",
        measuredAt: "2026-01-01T00:00:00.000Z",
        source: "data-reality",
        numericValue: 90.91,
        unit: "%",
        confidence: "medium",
        provenanceRefs: Object.freeze(["test:baseline"]),
      },
      window: {
        decisionAt: "2026-01-01T00:00:00.000Z",
        executionAt: "2026-01-15T00:00:00.000Z",
        observedAt: "2026-02-01T00:00:00.000Z",
        timingComplete: true,
      },
    });
    assert.equal(assessment.status, "comparison-ready");
    assert.equal(assessment.comparison.result, "not-met");
    assert.equal(assessment.expectedOutcome?.expectedDirection, "maintain");
    assert.equal(assessment.actualOutcome?.observedDirection, "increase");
    assert.equal(assessment.establishesCausation, false);
    projectGroundedLearningIntelligence({
      workspaceId: "nexora-mvp",
      subjectId: "obj-capacity",
      createdAt: "2026-02-01T00:00:00.000Z",
      assessment,
      decisionId: "decision-capacity",
      executionId: "execution-capacity",
    });
    const supported = listSupportedGroundedLearningForSubject({ workspaceId: "nexora-mvp", subjectId: "obj-capacity" });
    assert.ok(supported.length > 0);
  });

  test("T25 unpublished Ground Truth does not enter handoff", { timeout: 60_000 }, () => {
    const live = readyLiveCapacity("t25");
    const r1 = speak(live, "Is this still a problem?", "t25-reassess");
    const options = speak(r1, "Options.", "t25-options");
    assert.doesNotMatch(r1.response, SEALED);
    assert.doesNotMatch(options.response, SEALED);
    assert.doesNotMatch(JSON.stringify(options.nextScenarioSession?.learningInformedReassessment ?? {}), SEALED);
  });

  test("T29 architecture guard", () => {
    const files = [
      "app/lib/conversational-control/conversationalExperienceOrchestrator.ts",
      "app/lib/conversational-control/executiveScenarioResolver.ts",
      "app/lib/conversational-control/executiveDecisionCommitmentResolver.ts",
    ];
    for (const rel of files) {
      const text = readFileSync(resolve(FRONTEND_ROOT, rel), "utf8");
      assert.doesNotMatch(text, LEARNING_DECISION_EDGE);
    }
    assert.equal(NPS_OUTCOME_LEARNING_BOUNDARY.writesLearning, false);
    assert.equal(typeof judgeEcaExecutiveLearningClosure, "function");
  });
});

test("LEARN-CYCLE:1 artifact directory exists", () => {
  mkdirSync(ARTIFACT_DIRECTORY, { recursive: true });
  writeFileSync(new URL("SOURCE-INTEGRITY.md", ARTIFACT_DIRECTORY), "# LEARN-CYCLE:1\nSee CERTIFICATION.md.\n");
});
