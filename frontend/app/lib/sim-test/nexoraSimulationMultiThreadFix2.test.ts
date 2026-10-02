/** NPA-T SIM-TEST:9-FIX2 — context-scoped Scenario session resolution. */

import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import test from "node:test";

import { resolveNexoraExecutionFollowUpRequest } from "../conversational-control/executiveExecutionFollowUp.ts";
import {
  scenarioSourceManagementSubjectId,
  scopeScenarioSessionToManagementContext,
} from "../conversational-control/executiveScenarioResolver.ts";
import { speakRmsManagerThroughCc5, type RmsCc5Turn } from "../rms/rmsManagerCc5Adapter.ts";
import { SIM_TEST_9_R2_JOURNEYS } from "./nexoraSimulationMultiThreadR2Journeys.ts";
import type {
  NexoraSimulationManagerJourneyIntent,
  NexoraSimulationTestJourney,
  NexoraSimulationTestJourneyStep,
} from "./nexoraSimulationTestContract.ts";
import { runNexoraSimulationTestJourney } from "./nexoraSimulationTestHarness.ts";

function speak(previous: RmsCc5Turn | null, utterance: string, seed: string): RmsCc5Turn {
  return speakRmsManagerThroughCc5({ utterance, previous, messageIdSeed: `sim9-fix2-${seed}` });
}

function candidateNames(turn: RmsCc5Turn): readonly string[] {
  const session = turn.nextScenarioSession;
  if (!session) return Object.freeze([]);
  return Object.freeze(
    session.candidateScenarioIds.map((id) => session.scenariosById[id]?.name ?? id),
  );
}

function activeScenarioName(turn: RmsCc5Turn): string | null {
  const session = turn.nextScenarioSession;
  if (!session?.activeScenarioId) return null;
  return session.scenariosById[session.activeScenarioId]?.name ?? null;
}

function decisions(turn: RmsCc5Turn) {
  return turn.decisionRuntime?.listDecisions() ?? [];
}

function executions(turn: RmsCc5Turn) {
  return turn.executionRuntime?.listExecutions() ?? [];
}

function staleCapacityUnder(contextLabel: string, turn: RmsCc5Turn): boolean {
  const names = candidateNames(turn);
  const active = activeScenarioName(turn) ?? "";
  const response = turn.response;
  const capacityPresented = names.some((name) => /capacity/i.test(name)) || /investigate capacity/i.test(`${active} ${response}`);
  const contextIsNotCapacity = !/capacity/i.test(contextLabel);
  return contextIsNotCapacity && capacityPresented && names.length > 0;
}

function step(
  utterance: string,
  managementIntent: NexoraSimulationManagerJourneyIntent,
  intendedSubject?: string,
): NexoraSimulationTestJourneyStep {
  return Object.freeze({ kind: "MANAGER_TURN" as const, utterance, managementIntent, ...(intendedSubject ? { intendedSubject } : {}) });
}

const REQUIRED = Object.freeze([
  "DATA_VISIBLE", "MANAGER_TURN_COMPLETED", "NEXORA_TURN_COMPLETED", "SUBJECT_SELECTED",
  "MLEVEL_STATE", "STAGE_STATE", "PROBLEM_AVAILABLE", "SCENARIO_AVAILABLE",
  "DECISION_STATE", "EXECUTION_STATE",
] as const);

const BLOCKER: NexoraSimulationTestJourney = Object.freeze({
  journeyId: "sim-test-9-fix2-fix1-blocker",
  version: "1.0",
  title: "FIX1 blocker replay under FIX2",
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
  requiredCheckpoints: REQUIRED,
  targetSurfaces: Object.freeze(["CC5", "REFERENT", "NMI", "MLEVEL", "STAGE", "CC10", "CC11", "SCENARIO"]),
  stopConditions: Object.freeze(["TURN_BUDGET", "TICK_BUDGET", "S0", "RUNTIME_ERROR", "JOURNEY_COMPLETE"]),
  steps: Object.freeze([
    Object.freeze({ kind: "PUBLISH_OBSERVABLE_DATA" as const, atTick: 0 }),
    step("Status.", "ORIENT"), step("Capacity. Details.", "FOCUS_PROBLEM", "Capacity"),
    step("Options.", "EXPLORE_OPTIONS", "Capacity"), step("Go with B.", "COMMIT_DECISION", "Capacity"),
    step("Delivery. Details.", "FOCUS_PROBLEM", "Delivery"), step("Options.", "EXPLORE_OPTIONS", "Delivery"),
    step("Go with A.", "COMMIT_DECISION", "Delivery"), step("Start it.", "REQUEST_EXECUTION", "Delivery"),
  ]),
});

function scenarioConfusion(report: ReturnType<typeof runNexoraSimulationTestJourney>) {
  return report.journeyObservations.flatMap((row) => {
    if (row.intent !== "EXPLORE_OPTIONS" || !row.activeScenarioId || !row.canonicalSubjectId) return [];
    const scenario = row.scenarioLedger?.find((item) => item.scenarioId === row.activeScenarioId) ?? null;
    const primary = scenario?.subjectIds[0] ?? null;
    if (!primary || primary === row.canonicalSubjectId) return [];
    const expectedLabel = row.intendedSubject ?? null;
    if (expectedLabel && scenario?.title.toLowerCase().includes(expectedLabel.toLowerCase())) return [];
    if (expectedLabel === "Delivery" && /delivery/i.test(scenario?.title ?? "")) return [];
    if (expectedLabel === "Revenue" && /revenue|margin/i.test(scenario?.title ?? "")) return [];
    if (expectedLabel === "Capacity" && /capacity/i.test(scenario?.title ?? "")) return [];
    return [{
      journeyId: report.identity.journeyId,
      turn: row.turn,
      canonicalSubjectId: row.canonicalSubjectId,
      actualScenarioId: row.activeScenarioId,
      actualScenarioTitle: scenario?.title ?? null,
      intendedSubject: row.intendedSubject ?? null,
    }];
  });
}

test("T1 original Delivery reproduction: Capacity session is not reused", () => {
  let turn = speak(null, "Capacity. Details.", "t1-1");
  turn = speak(turn, "Options.", "t1-2");
  assert.ok(candidateNames(turn).some((name) => /capacity/i.test(name)));
  turn = speak(turn, "Delivery. Details.", "t1-3");
  turn = speak(turn, "Options.", "t1-4");
  assert.equal(staleCapacityUnder("Delivery", turn), false);
  assert.ok(
    candidateNames(turn).every((name) => !/investigate capacity|no action on capacity/i.test(name)) ||
      candidateNames(turn).length === 0,
  );
});

test("T2 original Revenue reproduction: Capacity session is not reused", () => {
  let turn = speak(null, "Capacity. Details.", "t2-1");
  turn = speak(turn, "Options.", "t2-2");
  turn = speak(turn, "Revenue. Details.", "t2-3");
  turn = speak(turn, "Options.", "t2-4");
  assert.equal(staleCapacityUnder("Revenue", turn), false);
});

test("T3 same-context reuse still works", () => {
  let turn = speak(null, "Capacity. Details.", "t3-1");
  turn = speak(turn, "Options.", "t3-2");
  const first = candidateNames(turn);
  turn = speak(turn, "Options.", "t3-3");
  const second = candidateNames(turn);
  assert.ok(first.some((name) => /capacity/i.test(name)));
  assert.ok(second.some((name) => /capacity/i.test(name)));
});

test("T4 historical return restores Capacity set", () => {
  let turn = speak(null, "Capacity. Details.", "t4-1");
  turn = speak(turn, "Options.", "t4-2");
  turn = speak(turn, "Delivery. Details.", "t4-3");
  turn = speak(turn, "Back to Capacity.", "t4-4");
  turn = speak(turn, "Options.", "t4-5");
  assert.ok(candidateNames(turn).some((name) => /capacity/i.test(name)));
});

test("T5 explicit Capacity options from Delivery", () => {
  let turn = speak(null, "Capacity. Details.", "t5-1");
  turn = speak(turn, "Options.", "t5-2");
  turn = speak(turn, "Delivery. Details.", "t5-3");
  turn = speak(turn, "Show me the Capacity options.", "t5-4");
  assert.ok(candidateNames(turn).some((name) => /capacity/i.test(name)));
});

test("T6 explicit named Scenario from Delivery", () => {
  let turn = speak(null, "Capacity. Details.", "t6-1");
  turn = speak(turn, "Options.", "t6-2");
  const named = candidateNames(turn).find((name) => /investigate capacity/i.test(name));
  assert.ok(named);
  turn = speak(turn, "Delivery. Details.", "t6-3");
  turn = speak(turn, `Show ${named}.`, "t6-4");
  assert.match(turn.response, /investigate capacity/i);
});

test("T7 two Scenario sets isolate Revenue Options", () => {
  let turn = speak(null, "Capacity. Details.", "t7-1");
  turn = speak(turn, "Options.", "t7-2");
  turn = speak(turn, "Revenue. Details.", "t7-3");
  turn = speak(turn, "Options.", "t7-4");
  const names = candidateNames(turn);
  assert.ok(names.every((name) => !/investigate capacity|no action on capacity/i.test(name)));
  assert.ok(names.some((name) => /revenue/i.test(name)) || names.length === 0 || turn.clarificationRequired);
});

test("T8 ordinal in Revenue does not bind Capacity", () => {
  let turn = speak(null, "Capacity. Details.", "t8-1");
  turn = speak(turn, "Options.", "t8-2");
  turn = speak(turn, "Revenue. Details.", "t8-3");
  turn = speak(turn, "Options.", "t8-4");
  turn = speak(turn, "The second one.", "t8-5");
  assert.equal(/investigate capacity|no action on capacity/i.test(activeScenarioName(turn) ?? ""), false);
});

test("T9 ordinal after switch without Delivery set does not bind CAP-B", () => {
  let turn = speak(null, "Capacity. Details.", "t9-1");
  turn = speak(turn, "Options.", "t9-2");
  turn = speak(turn, "Delivery. Details.", "t9-3");
  const before = decisions(turn).length;
  turn = speak(turn, "The second one.", "t9-4");
  assert.equal(decisions(turn).length, before);
  assert.equal(/investigate capacity/i.test(turn.response), false);
  assert.ok(turn.status === "clarification-required" || /don't have a current ordered list|presented set|which/i.test(turn.response));
});

test("T10 stale ordinal does not write a Capacity Decision under Delivery", () => {
  let turn = speak(null, "Capacity. Details.", "t10-1");
  turn = speak(turn, "Options.", "t10-2");
  turn = speak(turn, "Delivery. Details.", "t10-3");
  const before = decisions(turn).length;
  turn = speak(turn, "Let's go with the second option.", "t10-4");
  assert.equal(decisions(turn).length, before);
  assert.equal(decisions(turn).some((item) => /capacity/i.test(item.title) && item.status === "Approved"), false);
});

test("T11 two sets, Capacity return, second option is Capacity", () => {
  let turn = speak(null, "Capacity. Details.", "t11-1");
  turn = speak(turn, "Options.", "t11-2");
  turn = speak(turn, "Revenue. Details.", "t11-3");
  turn = speak(turn, "Options.", "t11-4");
  turn = speak(turn, "Back to Capacity.", "t11-5");
  turn = speak(turn, "Options.", "t11-6");
  turn = speak(turn, "The second one.", "t11-7");
  const active = activeScenarioName(turn) ?? turn.response;
  assert.match(active, /capacity/i);
});

test("T12 related Delivery does not authorize Capacity session", () => {
  let turn = speak(null, "Capacity. Details.", "t12-1");
  turn = speak(turn, "Options.", "t12-2");
  turn = speak(turn, "Delivery. Details.", "t12-3");
  turn = speak(turn, "Options.", "t12-4");
  assert.equal(staleCapacityUnder("Delivery", turn), false);
});

test("T13 shared evidence does not authorize Capacity reuse", () => {
  let turn = speak(null, "Capacity. Details.", "t13-1");
  turn = speak(turn, "Options.", "t13-2");
  turn = speak(turn, "Delivery. Details.", "t13-3");
  turn = speak(turn, "Options.", "t13-4");
  assert.equal(candidateNames(turn).some((name) => /investigate capacity/i.test(name)), false);
});

test("T14 Compare them stays in the current set", () => {
  let turn = speak(null, "Capacity. Details.", "t14-1");
  turn = speak(turn, "Options.", "t14-2");
  turn = speak(turn, "Revenue. Details.", "t14-3");
  turn = speak(turn, "Options.", "t14-4");
  turn = speak(turn, "Compare them.", "t14-5");
  assert.equal(/investigate capacity/i.test(turn.response), false);
});

test("T15 explain first Revenue option, not Capacity", () => {
  let turn = speak(null, "Capacity. Details.", "t15-1");
  turn = speak(turn, "Options.", "t15-2");
  turn = speak(turn, "Revenue. Details.", "t15-3");
  turn = speak(turn, "Options.", "t15-4");
  turn = speak(turn, "Explain the first option.", "t15-5");
  assert.equal(/investigate capacity|no action on capacity/i.test(turn.response), false);
});

test("T16 FIX1 regression: Delivery Start it. does not execute Capacity", () => {
  const report = runNexoraSimulationTestJourney({ journey: BLOCKER, runId: "fix2-t16" });
  const replay = runNexoraSimulationTestJourney({ journey: BLOCKER, runId: "fix2-t16" });
  const final = report.journeyObservations.at(-1)!;
  assert.equal(replay.deterministicSignature, report.deterministicSignature);
  assert.equal(final.executionCount === 0 || !/do-nothing:do-nothing/i.test(final.executionId ?? ""), true);
  assert.equal(
    (final.executionLedger ?? []).some((item) => item.decisionId === "cc10:decision:cc9:scenario:do-nothing:do-nothing:v1"),
    false,
  );
  assert.equal(resolveNexoraExecutionFollowUpRequest("Start it.")?.requiresContext, true);
});

test("T17 reassessment does not invent a title or Scenario session", () => {
  let turn = speak(null, "Capacity. Details.", "t17-1");
  turn = speak(turn, "Is this still a problem?", "t17-2");
  assert.equal(/Is This Still A/i.test(`${turn.response} ${turn.nxaAdvisorContract?.referentName ?? ""}`), false);
  assert.equal(decisions(turn).length, 0);
  assert.equal(executions(turn).length, 0);
});

test("T18 Scenario scoping ignores hidden Ground Truth fields", () => {
  const hidden = {
    scenarioId: "cc9:scenario:intervention:obj-capacity:v1",
    name: "Investigate Capacity",
    revision: 1,
    subjectIds: ["obj-budget", "obj-capacity"],
    sourceSubjectId: "obj-capacity",
    assumptions: [],
    interventions: [{ subjectId: "obj-capacity", actionKind: "investigate" as const }],
    horizon: null,
    source: "conversation" as const,
    status: "defined" as const,
    kind: "intervention" as const,
    availableCapacity: 999,
    confirmedCausal: true,
  };
  assert.equal(scenarioSourceManagementSubjectId(hidden), "obj-capacity");
  assert.equal(
    scenarioSourceManagementSubjectId({ ...hidden, sourceSubjectId: "obj-delivery", interventions: [] }),
    "obj-delivery",
  );
});

test("multi-scenario micro-funnel isolates P1/P2/P3", () => {
  let turn = speak(null, "Capacity. Details.", "mf-p1");
  turn = speak(turn, "Options.", "mf-p1-opt");
  const p1 = candidateNames(turn);
  turn = speak(turn, "Go with B.", "mf-p1-d");
  const d1 = decisions(turn).map((item) => item.decisionId);
  turn = speak(turn, "Delivery. Details.", "mf-p2");
  turn = speak(turn, "Options.", "mf-p2-opt");
  const p2 = candidateNames(turn);
  assert.equal(p1.some((name) => /capacity/i.test(name)), true);
  assert.equal(p2.some((name) => /investigate capacity|no action on capacity/i.test(name)), false);
  turn = speak(turn, "Inventory. Details.", "mf-p3");
  turn = speak(turn, "The second one.", "mf-p3-ord");
  assert.equal(decisions(turn).length, d1.length);
  turn = speak(turn, "Capacity. Details.", "mf-p1b");
  turn = speak(turn, "Options.", "mf-explicit");
  assert.ok(candidateNames(turn).some((name) => /capacity/i.test(name)));
});

test("R2 material Scenario-set journeys no longer reuse Capacity under Delivery/Revenue", () => {
  const material = SIM_TEST_9_R2_JOURNEYS.filter((journey) =>
    ["C_SCENARIO_SETS", "D_MULTI_DECISION", "E_DECISION_EXECUTION_CONCURRENCY", "F_MULTI_OUTCOME", "J_ORDINAL_STRESS", "K_LONG_SESSION"].includes(journey.r2Family),
  );
  assert.equal(material.length, 6);
  const rows = material.flatMap((journey) => {
    const first = runNexoraSimulationTestJourney({ journey, runId: `fix2-r2-${journey.journeyId}` });
    const second = runNexoraSimulationTestJourney({ journey, runId: `fix2-r2-${journey.journeyId}` });
    return [{
      journeyId: journey.journeyId,
      family: journey.r2Family,
      signature: first.deterministicSignature,
      matched: first.deterministicSignature === second.deterministicSignature,
      confusion: scenarioConfusion(first),
      decisions: first.journeyObservations.at(-1)?.decisionLedger ?? [],
    }];
  });
  const remaining = rows.flatMap((row) => row.confusion);
  mkdirSync(new URL("../../../artifacts/sim-test/SIM-TEST-9-FIX2/", import.meta.url), { recursive: true });
  writeFileSync(
    new URL("../../../artifacts/sim-test/SIM-TEST-9-FIX2/r2-replay.json", import.meta.url),
    JSON.stringify({ remaining, rows }, null, 2),
  );
  assert.equal(rows.every((row) => row.matched), true);
  assert.equal(remaining.length, 0);
});

test("B T5 canonical/L1 lag remains unrepaired independent debt", () => {
  const journey = SIM_TEST_9_R2_JOURNEYS.find((item) => item.r2Family === "B_MULTI_RISK")!;
  const report = runNexoraSimulationTestJourney({ journey, runId: "fix2-bt5" });
  const t5 = report.journeyObservations.find((row) => row.utterance === "Go back to the first risk.")!;
  assert.equal(t5.canonicalSubjectId === t5.mlevelL1, false);
});
