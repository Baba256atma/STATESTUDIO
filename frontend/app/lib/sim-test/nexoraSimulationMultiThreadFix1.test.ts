/** NPA-T SIM-TEST:9-FIX1 — context-safe Decision → Execution handoff. */

import assert from "node:assert/strict";
import test from "node:test";

import { resolveNexoraExecutionFollowUpRequest } from "../conversational-control/executiveExecutionFollowUp.ts";
import { speakRmsManagerThroughCc5, type RmsCc5Turn } from "../rms/rmsManagerCc5Adapter.ts";
import type {
  NexoraSimulationManagerJourneyIntent,
  NexoraSimulationTestJourney,
  NexoraSimulationTestJourneyStep,
} from "./nexoraSimulationTestContract.ts";
import { runNexoraSimulationTestJourney } from "./nexoraSimulationTestHarness.ts";

function speak(previous: RmsCc5Turn | null, utterance: string, seed: string): RmsCc5Turn {
  return speakRmsManagerThroughCc5({ utterance, previous, messageIdSeed: `sim9-fix1-${seed}` });
}

function focus(subject: "Capacity" | "Delivery" | "Revenue", seed: string): RmsCc5Turn {
  return speak(null, `${subject}. Details.`, `${seed}-focus`);
}

function addDecision(input: {
  turn: RmsCc5Turn;
  id: string;
  title: string;
  subjectIds: readonly string[];
  action?: "create" | "approve";
}): void {
  const result = input.turn.decisionRuntime!.transitionDecision({
    decisionId: input.id,
    action: input.action ?? "approve",
    title: input.title,
    subjectIds: input.subjectIds,
  });
  assert.equal(result.status, "applied");
}

function executionDecisionIds(turn: RmsCc5Turn): readonly string[] {
  return turn.executionRuntime?.listExecutions().map((execution) => execution.decisionId) ?? [];
}

function step(
  utterance: string,
  managementIntent: NexoraSimulationManagerJourneyIntent,
  intendedSubject?: string,
): NexoraSimulationTestJourneyStep {
  return Object.freeze({
    kind: "MANAGER_TURN" as const,
    utterance,
    managementIntent,
    ...(intendedSubject ? { intendedSubject } : {}),
  });
}

const BLOCKER_JOURNEY: NexoraSimulationTestJourney = Object.freeze({
  journeyId: "sim-test-9-fix1-original-blocker",
  version: "1.0",
  title: "SIM-TEST:9 exact blocker after FIX1",
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
    Object.freeze({ kind: "PUBLISH_OBSERVABLE_DATA" as const, atTick: 0 }),
    step("Status.", "ORIENT"),
    step("Capacity. Details.", "FOCUS_PROBLEM", "Capacity"),
    step("Options.", "EXPLORE_OPTIONS", "Capacity"),
    step("Go with B.", "COMMIT_DECISION", "Capacity"),
    step("Delivery. Details.", "FOCUS_PROBLEM", "Delivery"),
    step("Options.", "EXPLORE_OPTIONS", "Delivery"),
    step("Go with A.", "COMMIT_DECISION", "Delivery"),
    step("Start it.", "REQUEST_EXECUTION", "Delivery"),
  ]),
});

test("T1 original S1: Capacity Decision does not execute from Delivery", () => {
  const report = runNexoraSimulationTestJourney({ journey: BLOCKER_JOURNEY, runId: "fix1-t1" });
  const replay = runNexoraSimulationTestJourney({ journey: BLOCKER_JOURNEY, runId: "fix1-t1" });
  const before = report.journeyObservations.at(-2)!;
  const final = report.journeyObservations.at(-1)!;
  assert.equal(report.turns, 8);
  assert.equal(replay.deterministicSignature, report.deterministicSignature);
  const capacityDecisionId = "cc10:decision:cc9:scenario:do-nothing:do-nothing:v1";
  assert.ok((before.decisionLedger ?? []).some((item) => item.decisionId === capacityDecisionId));
  assert.equal(
    (final.executionLedger ?? []).filter((item) => item.decisionId === capacityDecisionId).length,
    0,
  );
  assert.ok((final.decisionLedger ?? []).some((item) => item.decisionId === capacityDecisionId));
});

test("T2 same context with one approved Decision executes it", () => {
  const current = focus("Capacity", "t2");
  addDecision({ turn: current, id: "d-capacity", title: "Capacity Decision D1", subjectIds: ["obj-capacity"] });
  const started = speak(current, "Start it.", "t2-start");
  assert.deepEqual(executionDecisionIds(started), ["d-capacity"]);
});

test("T3 multiple global Decisions select the unique current-context Decision", () => {
  const current = focus("Capacity", "t3");
  addDecision({ turn: current, id: "d-margin", title: "Margin Decision D2", subjectIds: ["obj-revenue"] });
  addDecision({ turn: current, id: "d-capacity", title: "Capacity Decision D1", subjectIds: ["obj-capacity"] });
  const started = speak(current, "Start it.", "t3-start");
  assert.deepEqual(executionDecisionIds(started), ["d-capacity"]);
});

test("T4 current Delivery context selects its own approved Decision", () => {
  const current = focus("Delivery", "t4");
  addDecision({ turn: current, id: "d-capacity", title: "Capacity Decision D1", subjectIds: ["obj-capacity"] });
  addDecision({ turn: current, id: "d-delivery", title: "Delivery Decision D2", subjectIds: ["obj-delivery"] });
  const started = speak(current, "Start it.", "t4-start");
  assert.deepEqual(executionDecisionIds(started), ["d-delivery"]);
});

test("T5 multiple Decisions in one context clarify without Execution", () => {
  const current = focus("Capacity", "t5");
  addDecision({ turn: current, id: "d-capacity-1", title: "Capacity Decision D1", subjectIds: ["obj-capacity"] });
  addDecision({ turn: current, id: "d-capacity-2", title: "Capacity Decision D2", subjectIds: ["obj-capacity"] });
  const result = speak(current, "Start it.", "t5-start");
  assert.equal(result.status, "clarification-required");
  assert.deepEqual(executionDecisionIds(result), []);
});

test("T6 explicit cross-context Decision remains executable", () => {
  const current = focus("Delivery", "t6");
  addDecision({ turn: current, id: "d1", title: "Capacity Decision D1", subjectIds: ["obj-capacity"] });
  const result = speak(current, "Start Capacity Decision D1.", "t6-start");
  assert.deepEqual(executionDecisionIds(result), ["d1"]);
});

test("T7 explicit historical return re-establishes Capacity before execution", () => {
  let current = speak(null, "Status.", "t7-1");
  for (const [index, utterance] of ["Capacity. Details.", "Options.", "Go with B.", "Delivery. Details.", "Go back to the Capacity decision.", "Start it."].entries()) {
    current = speak(current, utterance, `t7-${index + 2}`);
  }
  assert.equal(current.nextExecutiveContext.currentSubject?.subjectId, "obj-capacity");
  assert.equal(executionDecisionIds(current).length, 1);
});

test("T8 no Decision means no Decision creation and no Execution", () => {
  const current = focus("Delivery", "t8");
  const result = speak(current, "Start it.", "t8-start");
  assert.equal(result.status, "clarification-required");
  assert.equal(result.decisionRuntime?.listDecisions().length, 0);
  assert.deepEqual(executionDecisionIds(result), []);
});

test("T9 an ineligible contextual Decision does not execute", () => {
  const current = focus("Capacity", "t9");
  addDecision({ turn: current, id: "d-draft", title: "Capacity Draft", subjectIds: ["obj-capacity"], action: "create" });
  const result = speak(current, "Start it.", "t9-start");
  assert.equal(result.status, "clarification-required");
  assert.deepEqual(executionDecisionIds(result), []);
});

test("T10 duplicate Execution protection remains intact", () => {
  const current = focus("Capacity", "t10");
  addDecision({ turn: current, id: "d-capacity", title: "Capacity Decision D1", subjectIds: ["obj-capacity"] });
  const first = speak(current, "Start it.", "t10-first");
  const second = speak(first, "Start it.", "t10-second");
  assert.deepEqual(executionDecisionIds(second), ["d-capacity"]);
});

test("T11 Decision reassessment does not start Execution", () => {
  const current = focus("Capacity", "t11");
  addDecision({ turn: current, id: "d-capacity", title: "Capacity Decision D1", subjectIds: ["obj-capacity"] });
  const result = speak(current, "Does this decision still make sense?", "t11-reassess");
  assert.deepEqual(executionDecisionIds(result), []);
});

test("T12 action reassessment does not start Execution", () => {
  const current = focus("Capacity", "t12");
  addDecision({ turn: current, id: "d-capacity", title: "Capacity Decision D1", subjectIds: ["obj-capacity"] });
  const result = speak(current, "Do I still need to act?", "t12-reassess");
  assert.deepEqual(executionDecisionIds(result), []);
});

test("T13 ordinary deictics retain non-execution semantics", () => {
  let current = focus("Capacity", "t13");
  addDecision({ turn: current, id: "d-capacity", title: "Capacity Decision D1", subjectIds: ["obj-capacity"] });
  for (const [index, utterance] of ["Why?", "Show it.", "What about it?"].entries()) {
    current = speak(current, utterance, `t13-${index}`);
  }
  assert.deepEqual(executionDecisionIds(current), []);
  assert.equal(resolveNexoraExecutionFollowUpRequest("Why?"), null);
  assert.equal(resolveNexoraExecutionFollowUpRequest("Show it."), null);
  assert.equal(resolveNexoraExecutionFollowUpRequest("What about it?"), null);
});

test("T14 three Decisions select Delivery only from Delivery context", () => {
  const current = focus("Delivery", "t14");
  addDecision({ turn: current, id: "d-capacity", title: "Capacity Decision D1", subjectIds: ["obj-capacity"] });
  addDecision({ turn: current, id: "d-delivery", title: "Delivery Decision D2", subjectIds: ["obj-delivery"] });
  addDecision({ turn: current, id: "d-margin", title: "Margin Decision D3", subjectIds: ["obj-revenue"] });
  const result = speak(current, "Start it.", "t14-start");
  assert.deepEqual(executionDecisionIds(result), ["d-delivery"]);
});

test("T15 ambiguous historical Decision language does not select by order", () => {
  const current = focus("Capacity", "t15");
  addDecision({ turn: current, id: "d1", title: "Capacity Decision D1", subjectIds: ["obj-capacity"] });
  addDecision({ turn: current, id: "d2", title: "Capacity Decision D2", subjectIds: ["obj-capacity"] });
  const result = speak(current, "Start the earlier decision.", "t15-start");
  assert.equal(result.status, "clarification-required");
  assert.deepEqual(executionDecisionIds(result), []);
});

test("T16 related-but-not-primary context is not execution authorization", () => {
  const current = focus("Delivery", "t16");
  addDecision({ turn: current, id: "d1", title: "Add Overtime", subjectIds: ["obj-capacity", "obj-delivery"] });
  const result = speak(current, "Start it.", "t16-start");
  assert.equal(result.status, "clarification-required");
  assert.deepEqual(executionDecisionIds(result), []);
});

test("multi-decision micro-funnel preserves all three Decision → Execution links", () => {
  let current = focus("Capacity", "micro");
  addDecision({ turn: current, id: "d-capacity", title: "Capacity Decision D1", subjectIds: ["obj-capacity"] });
  addDecision({ turn: current, id: "d-delivery", title: "Delivery Decision D2", subjectIds: ["obj-delivery"] });
  addDecision({ turn: current, id: "d-margin", title: "Margin Decision D3", subjectIds: ["obj-revenue"] });

  current = speak(current, "Delivery. Details.", "micro-delivery");
  current = speak(current, "Start it.", "micro-delivery-start");
  current = speak(current, "Revenue. Details.", "micro-margin");
  current = speak(current, "Start it.", "micro-margin-start");
  current = speak(current, "Capacity. Details.", "micro-capacity");
  current = speak(current, "Start it.", "micro-capacity-start");

  assert.deepEqual([...executionDecisionIds(current)].sort(), ["d-capacity", "d-delivery", "d-margin"]);
  assert.equal(current.decisionRuntime?.listDecisions().length, 3);
});

test("execution action vocabulary is bounded and reassessment-safe", () => {
  for (const utterance of ["Start it.", "Execute it.", "Do it.", "Proceed.", "Go ahead with it.", "Run it.", "Start that."]) {
    assert.equal(resolveNexoraExecutionFollowUpRequest(utterance)?.action, "start", utterance);
  }
  for (const utterance of ["Why?", "Show it.", "Explain it.", "What about it?", "Is it still valid?", "Do I still need to act?"]) {
    assert.equal(resolveNexoraExecutionFollowUpRequest(utterance), null, utterance);
  }
});
