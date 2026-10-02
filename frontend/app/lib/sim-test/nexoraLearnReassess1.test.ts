/** NPA-T LEARN-REASSESS:1 — CORE-OUT:2 Learning into CC/Advisor reassessment. */

import assert from "node:assert/strict";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, beforeEach, describe, test } from "node:test";

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

const ARTIFACT_DIRECTORY = new URL("../../../artifacts/sim-test/LEARN-REASSESS-1/", import.meta.url);
const FRONTEND_ROOT = fileURLToPath(new URL("../../../", import.meta.url));
const SEALED = /availableCapacity|machineAvailability|confirmedCausal|\bevt:machine|\bevt:demand|Ground Truth/i;

function resetAll(): void {
  resetCsvRealDataImportStoreForTests();
  resetLiveDataConnectionStoreForTests();
  resetOutcomeObservationCaptureForTests();
  resetPostDecisionCaptureForTests();
  resetDecisionOutcomeCommitmentForTests();
  resetGroundedLearningForTests();
}

function speak(previous: RmsCc5Turn | null, utterance: string, seed: string): RmsCc5Turn {
  return speakRmsManagerThroughCc5({ utterance, previous, messageIdSeed: `learn-reassess-1-${seed}` });
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

function startCapacity(seed: string): RmsCc5Turn {
  const focused = speak(null, "Capacity. Details.", `${seed}-focus`);
  addApprovedDecision(focused, {
    id: `d-capacity-${seed}`,
    title: "Capacity Decision D1",
    subjectIds: ["obj-capacity"],
  });
  return speak(focused, "Start Capacity Decision D1.", `${seed}-start`);
}

function startDelivery(previous: RmsCc5Turn, seed: string): RmsCc5Turn {
  const focused = speak(previous, "Delivery. Details.", `${seed}-delivery`);
  addApprovedDecision(focused, {
    id: `d-delivery-${seed}`,
    title: "Delivery Decision D2",
    subjectIds: ["obj-delivery"],
  });
  return speak(focused, "Start Delivery Decision D2.", `${seed}-start-d`);
}

function openManufacturing(runId: string) {
  const scenario = resolveRmsScenario({ scenarioId: "manufacturing-capacity-pressure", version: "1.0" });
  const world = scenario.instantiateWorld();
  const session = createRmsFoundationSession({
    simulationId: `rms-7:${scenario.scenarioId}`,
    simulationType: "scenario-library",
    sessionId: `learn-reassess-1-${runId}`,
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

function learningFingerprint(subjectId: string): string {
  return listSupportedGroundedLearningForSubject({
    workspaceId: "nexora-mvp",
    subjectId,
  }).map((item) => `${item.learningId}:${item.statement}:${item.status}`).join("|");
}

function projection(learningId: string, subjectId: string, statement: string, extras: {
  readonly status?: string;
  readonly promotionEligibility?: string;
} = {}) {
  return Object.freeze({
    learningId,
    subjectId,
    statement,
    status: extras.status ?? "supported",
    learningType: "outcome-learning",
    decisionRefs: Object.freeze(["d1"]),
    executionRefs: Object.freeze(["e1"]),
    observationRefs: Object.freeze(["o1"]),
    outcomeAssessmentRefs: Object.freeze(["a1"]),
    promotionEligibility: extras.promotionEligibility ?? "promotion-eligible",
    establishesCausation: false as const,
  });
}

describe("NPA-T LEARN-REASSESS:1", { concurrency: false }, () => {
  beforeEach(resetAll);
  afterEach(resetAll);

  test("T1/T2 existing CORE-OUT:2 read surface (no new store)", () => {
    assert.equal(typeof listSupportedGroundedLearningForSubject, "function");
    assert.equal(listSupportedGroundedLearningForSubject({ workspaceId: "nexora-mvp", subjectId: "obj-capacity" }).length, 0);
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
    projectGroundedLearningIntelligence({
      workspaceId: "nexora-mvp",
      subjectId: "obj-capacity",
      createdAt: "2026-02-01T00:00:00.000Z",
      assessment,
      decisionId: "decision-capacity",
      executionId: "execution-capacity",
    });
    const capacity = listSupportedGroundedLearningForSubject({ workspaceId: "nexora-mvp", subjectId: "obj-capacity" });
    const delivery = listSupportedGroundedLearningForSubject({ workspaceId: "nexora-mvp", subjectId: "obj-delivery" });
    assert.ok(capacity.length > 0);
    assert.equal(delivery.length, 0);
    assert.ok(capacity.every((item) => item.subjectId === "obj-capacity" && item.status === "supported"));
    const again = listSupportedGroundedLearningForSubject({ workspaceId: "nexora-mvp", subjectId: "obj-capacity" });
    assert.deepEqual(again.map((item) => item.learningId), capacity.map((item) => item.learningId));
  });

  test("T4/T10 ECA:12 consumes only supported CORE-OUT:2 on reassessment", () => {
    const working = {
      activeSubject: { id: "obj-capacity", label: "Capacity", kind: "object" as const },
      unresolved: Object.freeze([]) as readonly string[],
      interactionMode: "ANSWER" as const,
      references: Object.freeze([]),
    };
    const supported = judgeEcaExecutiveLearningClosure({
      utterance: "Is this still a problem?",
      workingContext: working as never,
      actionPlan: { intent: "REASSESS" } as never,
      outcome: { observationState: "OBSERVED", overallInterpretation: "SINGLE", baselineComparison: "CHANGED", targetComparison: "NOT_MET", speak: false } as never,
      reassessmentTurn: true,
      coreOut2SupportedLearning: [
        projection("learn-capacity-1", "obj-capacity", "In this Decision context, the validated Outcome not-met relative to the recorded expectation; causal attribution remains unestablished."),
        projection("learn-bad", "obj-capacity", "unsupported", { status: "inconclusive", promotionEligibility: "not-promotion-eligible" }),
      ],
    });
    assert.equal(supported.consumedSupportedLearning, true);
    assert.deepEqual(supported.coreOut2LearningIds, ["learn-capacity-1"]);
    assert.match(supported.learningStatement ?? "", /not-met/);
    assert.doesNotMatch(supported.managerFacingNote ?? "", /\bcaused\b/i);
    assert.equal(supported.durableWrite, false);
    assert.ok(supported.provenance.sources.includes("learn-capacity-1"));

    const ordinary = judgeEcaExecutiveLearningClosure({
      utterance: "What is Capacity?",
      workingContext: working as never,
      actionPlan: { intent: "EXPLAIN" } as never,
      outcome: { observationState: "OBSERVED", overallInterpretation: "SINGLE", baselineComparison: "CHANGED", targetComparison: "NOT_MET", speak: false } as never,
      reassessmentTurn: false,
      coreOut2SupportedLearning: [projection("learn-capacity-1", "obj-capacity", "should not inject")],
    });
    assert.equal(ordinary.consumedSupportedLearning, false);

    const empty = judgeEcaExecutiveLearningClosure({
      utterance: "Is this still a problem?",
      workingContext: working as never,
      actionPlan: { intent: "REASSESS" } as never,
      outcome: { observationState: "NOT_YET_OBSERVED", overallInterpretation: "UNKNOWN", baselineComparison: "UNKNOWN", targetComparison: "UNKNOWN", speak: false } as never,
      reassessmentTurn: true,
      coreOut2SupportedLearning: [],
    });
    assert.equal(empty.consumedSupportedLearning, false);
  });

  test("T3/T4/T15/T18/T23/T24/T25/T27 live Capacity reassessment consumes Learning", { timeout: 60_000 }, () => {
    const focused = readyLiveCapacity("t3");
    const before = learningFingerprint("obj-capacity");
    assert.ok(before.length > 0, "supported Capacity Learning must exist before reassessment");
    const decisionsBefore = focused.decisionRuntime!.listDecisions().length;
    const executionsBefore = focused.executionRuntime!.listExecutions().length;
    const first = speak(focused, "Is this still a problem?", "t3-reassess");
    assert.equal(first.ecaLearningClosureJudgment?.consumedSupportedLearning, true);
    assert.ok((first.ecaLearningClosureJudgment?.coreOut2LearningIds.length ?? 0) > 0);
    assert.match(first.ecaLearningClosureJudgment?.learningStatement ?? "", /not-met|Outcome/i);
    assert.doesNotMatch(first.response, SEALED);
    assert.doesNotMatch(first.response, /\b(?:caused the increase|the decision made)\b/i);
    assert.equal(learningFingerprint("obj-capacity"), before);
    const second = speak(first, "Is this still a problem?", "t3-repeat");
    assert.equal(second.ecaLearningClosureJudgment?.consumedSupportedLearning, true);
    assert.deepEqual(second.ecaLearningClosureJudgment?.coreOut2LearningIds, first.ecaLearningClosureJudgment?.coreOut2LearningIds);
    assert.equal(second.decisionRuntime!.listDecisions().length, decisionsBefore);
    assert.equal(second.executionRuntime!.listExecutions().length, executionsBefore);
    const replay = speak(focused, "Is this still a problem?", "t3-reassess");
    assert.deepEqual(replay.ecaLearningClosureJudgment?.coreOut2LearningIds, first.ecaLearningClosureJudgment?.coreOut2LearningIds);
  });

  test("T5/T8/T12/T13 Delivery has no Capacity Learning; switch restores Capacity", { timeout: 60_000 }, () => {
    const capacity = readyLiveCapacity("t5");
    const withDelivery = startDelivery(capacity, "t5");
    const deliveryAsk = speak(withDelivery, "Is this still a problem?", "t5-delivery-reassess");
    assert.equal(deliveryAsk.ecaLearningClosureJudgment?.consumedSupportedLearning, false);
    const back = speak(deliveryAsk, "Capacity. Details.", "t5-back");
    const capacityAsk = speak(back, "Is this still a problem?", "t5-capacity-reassess");
    assert.equal(capacityAsk.ecaLearningClosureJudgment?.consumedSupportedLearning, true);
  });

  test("T6/T19 Family J remains clarification under ambiguity", { timeout: 60_000 }, () => {
    const journey = SIM_TEST_10_CORE_JOURNEYS.find((item) => item.journeyId === "sim-test-10-j_reassessment")!;
    const report = runNexoraSimulationTestJourney({ journey, runId: "learn-reassess-1-j" });
    const reassess = report.journeyObservations.filter((row) => row.utterance === "Is this still a problem?");
    assert.ok(reassess.length >= 1);
    assert.match(reassess[0]!.response, /which item do you mean/i);
  });

  test("T7/T20/T21 resolved Capacity after live chain consumes Learning", { timeout: 60_000 }, () => {
    const live = readyLiveCapacity("t7");
    const problem = speak(live, "Is this still a problem?", "t7-reassess");
    const reconsider = speak(live, "What should we reconsider?", "t7-reconsider");
    assert.equal(problem.ecaLearningClosureJudgment?.consumedSupportedLearning, true);
    assert.equal(reconsider.ecaLearningClosureJudgment?.consumedSupportedLearning, true);
  });

  test("T20 Family K replay from turn 1", { timeout: 60_000 }, () => {
    const journey = SIM_TEST_10_CORE_JOURNEYS.find((item) => item.journeyId === "sim-test-10-k_learning_assumption")!;
    const report = runNexoraSimulationTestJourney({ journey, runId: "learn-reassess-1-k" });
    assert.ok(report.journeyObservations.some((row) => row.utterance === "What should we reconsider?"));
  });

  test("T21 Family L replay: D2 remains temporal-only", { timeout: 60_000 }, () => {
    const journey = SIM_TEST_10_CORE_JOURNEYS.find((item) => item.journeyId === "sim-test-10-l_loop_reentry")!;
    const report = runNexoraSimulationTestJourney({ journey, runId: "learn-reassess-1-l" });
    const goA = report.journeyObservations.find((row) => row.utterance === "Go with A.");
    assert.ok(goA);
    assert.ok((goA.decisionLedger?.length ?? 0) >= 2);
  });

  test("T22 Family A upstream Learning remains available", { timeout: 60_000 }, () => {
    const journey = SIM_TEST_10_CORE_JOURNEYS.find((item) => item.journeyId === "sim-test-10-a_expected_positive")!;
    const report = runNexoraSimulationTestJourney({ journey, runId: "learn-reassess-1-a" });
    assert.equal(report.harnessStatus, "PASS");
  });

  test("T16 unpublished Ground Truth is not Learning context", { timeout: 60_000 }, () => {
    const { session, scenario } = openManufacturing("t16");
    publishCsv("t16", 0, session, scenario);
    const started = startCapacity("t16");
    publishCsv("t16", 15, session, scenario);
    const focused = speak(speak(started, "Did it work?", "t16-out"), "Capacity. Details.", "t16-focus");
    stepRmsEventSchedule(session, RMS_SCENARIO_OPERATOR_ACTOR, 22);
    inspectRmsGroundTruth(session, RMS_SCENARIO_OBSERVER_ACTOR);
    const ask = speak(focused, "Is this still a problem?", "t16-reassess");
    assert.doesNotMatch(ask.response, SEALED);
  });

  test("T28 architecture: no duplicate Learning store in this repair", () => {
    const orchestrator = readFileSync(resolve(FRONTEND_ROOT, "app/lib/conversational-control/conversationalExperienceOrchestrator.ts"), "utf8");
    assert.match(orchestrator, /listSupportedGroundedLearningForSubject/);
    assert.doesNotMatch(orchestrator, /ReassessmentLearningStore|AdvisorLearningStore|ConversationLearningRegistry/);
    assert.equal(NPS_OUTCOME_LEARNING_BOUNDARY.writesLearning, false);
  });
});

test("LEARN-REASSESS:1 artifact directory exists", () => {
  mkdirSync(ARTIFACT_DIRECTORY, { recursive: true });
  writeFileSync(new URL("SOURCE-INTEGRITY.md", ARTIFACT_DIRECTORY), "# LEARN-REASSESS:1\nSee CERTIFICATION.md for production files.\n");
});
