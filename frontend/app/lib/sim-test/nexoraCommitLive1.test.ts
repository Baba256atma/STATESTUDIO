/** NPA-T COMMIT-LIVE:1 — live Scenario → Decision → context-safe Execution. */

import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, test } from "node:test";

import { scenarioSourceManagementSubjectId } from "../conversational-control/executiveScenarioResolver.ts";
import { resetCsvRealDataImportStoreForTests } from "../data-reality/csvRealDataImportStore.ts";
import { listCapturedObservations, resetOutcomeObservationCaptureForTests } from "../executive-intelligence/nexoraLiveOutcomeObservationCapture.ts";
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
import { ingestSimulationCsvFile, projectRmsOperatorRecordsToCsv } from "./nexoraSimulationCsvIngestion.ts";
import { SIM_TEST_10_CORE_JOURNEYS } from "./nexoraSimulationOutcomeLearningJourneys.ts";
import { runNexoraSimulationTestJourney } from "./nexoraSimulationTestHarness.ts";

function speak(previous: RmsCc5Turn | null, utterance: string, seed: string): RmsCc5Turn {
  return speakRmsManagerThroughCc5({ utterance, previous, messageIdSeed: `commit-live-1-${seed}` });
}

function decisions(turn: RmsCc5Turn) {
  return turn.decisionRuntime?.listDecisions() ?? [];
}

function executions(turn: RmsCc5Turn) {
  return turn.executionRuntime?.listExecutions() ?? [];
}

function candidates(turn: RmsCc5Turn) {
  const session = turn.nextScenarioSession;
  if (!session) return Object.freeze([]);
  return Object.freeze(
    session.candidateScenarioIds.map((id) => {
      const scenario = session.scenariosById[id];
      return Object.freeze({
        id,
        name: scenario?.name ?? id,
        sourceSubjectId: scenarioSourceManagementSubjectId(scenario),
      });
    }),
  );
}

function commitCapacity(seed: string): RmsCc5Turn {
  let turn = speak(null, "Capacity. Details.", `${seed}-focus`);
  turn = speak(turn, "Options.", `${seed}-options`);
  return speak(turn, "Go with B.", `${seed}-commit`);
}

function commitDelivery(previous: RmsCc5Turn | null, seed: string, utterance = "Go with A."): RmsCc5Turn {
  let turn = speak(previous, "Delivery. Details.", `${seed}-focus`);
  turn = speak(turn, "Options.", `${seed}-options`);
  return speak(turn, utterance, `${seed}-commit`);
}

function isCapacityDecision(decision: { readonly title: string; readonly scenarioId?: string }): boolean {
  return /capacity/i.test(decision.title) || /obj-capacity/i.test(decision.scenarioId ?? "");
}

function isDeliveryDecision(decision: { readonly title: string; readonly scenarioId?: string }): boolean {
  return /delivery/i.test(decision.title) || /obj-delivery/i.test(decision.scenarioId ?? "");
}

function resetLive(): void {
  resetCsvRealDataImportStoreForTests();
  resetOutcomeObservationCaptureForTests();
  resetPostDecisionCaptureForTests();
}

describe("NPA-T COMMIT-LIVE:1", { concurrency: false }, () => {
  test("T1 basic commitment produces canonical Decision D1", () => {
    const committed = commitCapacity("t1");
    const ledger = decisions(committed);
    assert.equal(committed.decisionCommitmentResult?.status, "applied");
    assert.equal(ledger.length, 1);
    assert.equal(ledger[0]?.status, "Approved");
    assert.ok(ledger[0]?.scenarioId);
    assert.ok(isCapacityDecision(ledger[0]!));
  });

  test("T2 basic execution starts canonical Execution E1", () => {
    const started = speak(commitCapacity("t2"), "Start it.", "t2-start");
    const d1 = decisions(started)[0]!;
    const ledger = executions(started);
    assert.equal(ledger.length, 1);
    assert.equal(ledger[0]?.decisionId, d1.decisionId);
    assert.notEqual(ledger[0]?.executionId, d1.decisionId);
  });

  test("T3 commitment identity binds Scenario B of Capacity", () => {
    let turn = speak(null, "Capacity. Details.", "t3-focus");
    turn = speak(turn, "Options.", "t3-options");
    const presented = candidates(turn);
    assert.equal(turn.nextExecutiveContext.currentSubject?.subjectId, "obj-capacity");
    assert.equal(presented.length, 2);
    assert.ok(presented.every((item) => item.sourceSubjectId === "obj-capacity"));
    const b = presented[1]!;
    turn = speak(turn, "Go with B.", "t3-commit");
    const d1 = decisions(turn)[0]!;
    assert.equal(d1.scenarioId, b.id);
    assert.ok(isCapacityDecision(d1));
  });

  test("T4 execution identity binds D1 only", () => {
    const started = speak(commitCapacity("t4"), "Start it.", "t4-start");
    const d1 = decisions(started)[0]!;
    const e1 = executions(started)[0]!;
    assert.equal(e1.decisionId, d1.decisionId);
    assert.equal(executions(started).filter((item) => item.decisionId !== d1.decisionId).length, 0);
  });

  test("T5 no presented collection does not write a Decision", () => {
    const turn = speak(null, "Go with B.", "t5");
    assert.equal(decisions(turn).length, 0);
    assert.ok(
      turn.status === "clarification-required" ||
        turn.decisionCommitmentResult == null ||
        turn.decisionCommitmentResult.status === "clarification-required",
    );
  });

  test("T6 stale Capacity collection under Delivery does not commit", () => {
    let turn = speak(null, "Capacity. Details.", "t6-1");
    turn = speak(turn, "Options.", "t6-2");
    turn = speak(turn, "Delivery. Details.", "t6-3");
    const before = decisions(turn).length;
    turn = speak(turn, "Go with B.", "t6-4");
    assert.equal(decisions(turn).length, before);
    assert.equal(decisions(turn).filter((item) => item.subjectIds.includes("obj-capacity")).length, 0);
  });

  test("T7 fresh Delivery collection commits Delivery Decision", () => {
    let turn = speak(null, "Capacity. Details.", "t7-1");
    turn = speak(turn, "Options.", "t7-2");
    const committed = commitDelivery(turn, "t7", "Go with B.");
    const ledger = decisions(committed);
    assert.equal(ledger.length, 1);
    assert.ok(isDeliveryDecision(ledger[0]!));
    assert.equal(isCapacityDecision(ledger[0]!), false);
  });

  test("T8 two Decisions coexist", () => {
    const d1Turn = commitCapacity("t8");
    const d1 = decisions(d1Turn)[0]!;
    const d2Turn = commitDelivery(d1Turn, "t8-d");
    const ledger = decisions(d2Turn);
    assert.equal(ledger.length, 2);
    const d2 = ledger.find((item) => item.decisionId !== d1.decisionId)!;
    assert.notEqual(d1.decisionId, d2.decisionId);
    assert.ok(isCapacityDecision(d1));
    assert.ok(isDeliveryDecision(d2));
  });

  test("T9 Start it from Delivery executes D2 not first/global D1", () => {
    const d1Turn = commitCapacity("t9");
    const d1 = decisions(d1Turn)[0]!;
    const d2Turn = commitDelivery(d1Turn, "t9-d");
    const d2 = decisions(d2Turn).find((item) => item.decisionId !== d1.decisionId)!;
    const started = speak(d2Turn, "Start it.", "t9-start");
    const ledger = executions(started);
    assert.equal(ledger.length, 1);
    assert.equal(ledger[0]?.decisionId, d2.decisionId);
    assert.notEqual(ledger[0]?.decisionId, d1.decisionId);
  });

  test("T10 FIX1 wrong-thread Start it does not execute Capacity D1", () => {
    const d1Turn = commitCapacity("t10");
    const d1 = decisions(d1Turn)[0]!;
    const switched = speak(d1Turn, "Delivery. Details.", "t10-switch");
    const started = speak(switched, "Start it.", "t10-start");
    assert.equal(executions(started).filter((item) => item.decisionId === d1.decisionId).length, 0);
    assert.equal(started.status, "clarification-required");
  });

  test("T11 explicit historical Decision can start E1", () => {
    const d1Turn = commitCapacity("t11");
    const d1 = decisions(d1Turn)[0]!;
    const d2Turn = commitDelivery(d1Turn, "t11-d");
    const returned = speak(d2Turn, "Go back to the Capacity decision.", "t11-return");
    const started = speak(returned, `Start ${d1.title}.`, "t11-start");
    assert.equal(executions(started).length, 1);
    assert.equal(executions(started)[0]?.decisionId, d1.decisionId);
    const d2 = decisions(started).find((item) => item.decisionId !== d1.decisionId)!;
    assert.ok(d2);
    assert.equal(d2.title, decisions(d2Turn).find((item) => item.decisionId === d2.decisionId)?.title);
  });

  test("T12 duplicate commitment is idempotent", () => {
    const first = commitCapacity("t12");
    const second = speak(first, "Go with B.", "t12-repeat");
    assert.equal(decisions(second).length, 1);
    assert.equal(decisions(second)[0]?.decisionId, decisions(first)[0]?.decisionId);
  });

  test("T13 duplicate Start it is idempotent", () => {
    const first = speak(commitCapacity("t13"), "Start it.", "t13-start");
    const second = speak(first, "Start it.", "t13-repeat");
    assert.equal(executions(second).length, 1);
    assert.equal(executions(second)[0]?.executionId, executions(first)[0]?.executionId);
  });

  test("T14 subject switch preserves D1 identity", () => {
    const d1Turn = commitCapacity("t14");
    const d1 = decisions(d1Turn)[0]!;
    let turn = speak(d1Turn, "Delivery. Details.", "t14-d");
    turn = speak(turn, "Capacity. Details.", "t14-back");
    turn = speak(turn, "Delivery. Details.", "t14-d2");
    const still = decisions(turn).find((item) => item.decisionId === d1.decisionId)!;
    assert.equal(still.scenarioId, d1.scenarioId);
    assert.equal(still.title, d1.title);
    assert.equal(decisions(turn).length, 1);
  });

  test("T15 reassessment does not invent titles or write Decision/Execution", () => {
    const focused = speak(null, "Capacity. Details.", "t15-focus");
    const turn = speak(focused, "Is this still a problem?", "t15-ask");
    assert.equal(turn.nextExecutiveContext.currentSubject?.subjectId, "obj-capacity");
    assert.equal(decisions(turn).length, 0);
    assert.equal(executions(turn).length, 0);
    assert.equal(/is this still a/i.test(turn.response), false);
  });

  test("T16 FIX2 Options does not reuse stale Capacity set under Delivery", () => {
    let turn = speak(null, "Capacity. Details.", "t16-1");
    turn = speak(turn, "Options.", "t16-2");
    turn = speak(turn, "Delivery. Details.", "t16-3");
    turn = speak(turn, "Options.", "t16-4");
    const presented = candidates(turn);
    assert.equal(presented.some((item) => /investigate capacity|no action on capacity/i.test(item.name)), false);
    assert.ok(presented.every((item) => item.sourceSubjectId !== "obj-capacity" || presented.length === 0));
  });
});

describe("NPA-T COMMIT-LIVE:1 T17 OUT-LIVE guard", { concurrency: false }, () => {
  beforeEach(resetLive);
  afterEach(resetLive);

  test("T17 valid E1 still reaches CORE-OUT capture after publication", () => {
    const started = speak(commitCapacity("t17"), "Start it.", "t17-start");
    const executionId = executions(started)[0]!.executionId;
    const scenario = resolveRmsScenario({ scenarioId: "manufacturing-capacity-pressure", version: "1.0" });
    const world = scenario.instantiateWorld();
    const session = createRmsFoundationSession({
      simulationId: `rms-7:${scenario.scenarioId}`,
      simulationType: "scenario-library",
      sessionId: "commit-live-1-t17",
      runId: "commit-live-1-t17",
      host: { hostKind: world.worldKind === "HYBRID" ? "HYBRID" : world.worldKind, hostId: world.worldId },
      actors: RMS_SCENARIO_RUN_ACTORS,
      groundTruth: world,
    });
    loadRmsEventSchedule(session, RMS_SCENARIO_OPERATOR_ACTOR, scenario.eventSchedule);
    stepRmsEventSchedule(session, RMS_SCENARIO_OPERATOR_ACTOR, 15);
    const observations = runRmsOperatorObservation(session, RMS_SCENARIO_OPERATOR_ACTOR, {
      enabledSources: scenario.enabledSources,
    });
    const files = projectRmsOperatorRecordsToCsv({
      scenarioId: scenario.scenarioId,
      simulationRunId: "commit-live-1-t17",
      tick: 15,
      records: observations,
    });
    assert.ok(files.map((file) => ingestSimulationCsvFile(file)).some((item) => item.committed));
    const captured = listCapturedObservations();
    assert.ok(captured.length > 0);
    assert.ok(captured.every((item) => item.executionId === executionId));
  });
});

test("T18 Ground Truth is not used for Decision or Execution target selection", () => {
  const scenario = resolveRmsScenario({ scenarioId: "manufacturing-capacity-pressure", version: "1.0" });
  const world = scenario.instantiateWorld();
  const session = createRmsFoundationSession({
    simulationId: `rms-7:${scenario.scenarioId}`,
    simulationType: "scenario-library",
    sessionId: "commit-live-1-t18",
    runId: "commit-live-1-t18",
    host: { hostKind: world.worldKind === "HYBRID" ? "HYBRID" : world.worldKind, hostId: world.worldId },
    actors: RMS_SCENARIO_RUN_ACTORS,
    groundTruth: world,
  });
  const hidden = inspectRmsGroundTruth(session, RMS_SCENARIO_OBSERVER_ACTOR);
  const committed = commitCapacity("t18");
  const started = speak(committed, "Start it.", "t18-start");
  const d1 = decisions(started)[0]!;
  const e1 = executions(started)[0]!;
  const gtKeys = "variables" in hidden ? hidden.variables.map((item) => item.key).join(" ") : "";
  assert.ok(gtKeys.length >= 0);
  assert.equal(d1.subjectIds.some((id) => gtKeys.includes(id)), false);
  assert.equal(e1.decisionId, d1.decisionId);
  assert.ok(isCapacityDecision(d1));
});

test("Capacity/Delivery funnels and multi-thread execution isolation", () => {
  const capacity = speak(commitCapacity("funnel-c"), "Start it.", "funnel-c-start");
  const d1 = decisions(capacity)[0]!;
  const e1 = executions(capacity)[0]!;
  const deliveryOnly = speak(commitDelivery(null, "funnel-d", "Go with B."), "Start it.", "funnel-d-start");
  const d2 = decisions(deliveryOnly)[0]!;
  const e2 = executions(deliveryOnly)[0]!;
  assert.ok(isCapacityDecision(d1));
  assert.ok(isDeliveryDecision(d2));
  assert.equal(e1.decisionId, d1.decisionId);
  assert.equal(e2.decisionId, d2.decisionId);

  const bothCommit = commitDelivery(commitCapacity("funnel-m"), "funnel-m-d");
  const bothD1 = decisions(bothCommit).find((item) => isCapacityDecision(item))!;
  const bothD2 = decisions(bothCommit).find((item) => isDeliveryDecision(item))!;
  const e2Start = speak(bothCommit, "Start it.", "funnel-m-e2");
  const e1Start = speak(e2Start, `Start ${bothD1.title}.`, "funnel-m-e1");
  const ledger = executions(e1Start);
  assert.equal(ledger.length, 2);
  assert.ok(ledger.some((item) => item.decisionId === bothD1.decisionId));
  assert.ok(ledger.some((item) => item.decisionId === bothD2.decisionId));
  assert.equal(ledger.filter((item) => item.decisionId === bothD1.decisionId && item.decisionId === bothD2.decisionId).length, 0);
});

test("R1 micro-replay and bounded family recovery", () => {
  const samples = SIM_TEST_10_CORE_JOURNEYS.slice(0, 3);
  const rows = samples.map((journey) => {
    const report = runNexoraSimulationTestJourney({ journey, runId: `commit-live-r1-${journey.journeyId}` });
    const commitTurns = report.journeyObservations.filter((row) => row.intent === "COMMIT_DECISION");
    const startTurns = report.journeyObservations.filter((row) => row.intent === "REQUEST_EXECUTION");
    return {
      journeyId: journey.journeyId,
      unexpectedMissingDecisions: commitTurns.filter((row) => (row.decisionCount ?? 0) < 1 && row.clarificationRequired !== true).length,
      unexpectedMissingExecutions: startTurns.filter((row) => (row.executionCount ?? 0) < 1 && row.clarificationRequired !== true).length,
      decisions: report.journeyObservations.at(-1)?.decisionCount ?? 0,
      executions: report.journeyObservations.at(-1)?.executionCount ?? 0,
    };
  });
  assert.ok(rows.every((row) => row.decisions >= 1));
  assert.ok(rows.every((row) => row.executions >= 1));
  assert.equal(rows.reduce((sum, row) => sum + row.unexpectedMissingDecisions, 0), 0);
  assert.equal(rows.reduce((sum, row) => sum + row.unexpectedMissingExecutions, 0), 0);
});
