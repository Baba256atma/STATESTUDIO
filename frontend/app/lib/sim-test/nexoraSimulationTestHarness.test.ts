import assert from "node:assert/strict";
import test from "node:test";

import { RMS_OBSERVER_CONTRACT, RMS_OPERATOR_AGENT_CONTRACT, RMS_MANAGER_AGENT_CONTRACT } from "../rms/rmsActorContracts.ts";
import { RMS_REAL_CONVERSATION_ENTRY_NAME } from "../rms/rmsManagerCc5Adapter.ts";
import type { RmsObserverFinding } from "../rms/rmsObserverContract.ts";
import { RMS_SCENARIO_MANAGER_ACTOR, RMS_SCENARIO_OBSERVER_ACTOR, RMS_SCENARIO_OPERATOR_ACTOR } from "../rms/rmsScenarioRunner.ts";
import {
  SIM_TEST_1_BOUNDARY,
  SIM_TEST_FORBIDDEN_JOURNEY_KEYS,
  nexoraSimulationTestHarnessIdentity,
  type NexoraSimulationTestJourney,
} from "./nexoraSimulationTestContract.ts";
import {
  aggregateNexoraSimulationTestReports,
  projectNexoraSimulationTestFinding,
  runNexoraSimulationTestJourney,
  shouldStopNexoraSimulationTest,
  validateNexoraSimulationTestJourney,
} from "./nexoraSimulationTestHarness.ts";
import {
  SIM_TEST_1_JOURNEYS,
  SIM_TEST_LOGISTICS_PARITY,
  SIM_TEST_MANUFACTURING_BASELINE,
  SIM_TEST_PROJECT_BASELINE,
  SIM_TEST_SERVICE_PARITY,
} from "./nexoraSimulationTestJourneys.ts";

let cachedReports: ReturnType<typeof runNexoraSimulationTestJourney>[] | null = null;

function reports() {
  cachedReports ??= SIM_TEST_1_JOURNEYS.map((journey, index) =>
    runNexoraSimulationTestJourney({ journey, runId: `focused-${index}` }),
  );
  return cachedReports;
}

function observerFinding(overrides: Partial<RmsObserverFinding> = {}): RmsObserverFinding {
  return Object.freeze({
    findingId: "observer-finding",
    taxonomy: "CONVERSATION_ERROR",
    subtype: "REFERENT_ERROR",
    severity: "FAILURE",
    tick: 2,
    measurementIds: Object.freeze(["m:referent:2"]),
    primaryOwnership: "CONVERSATION_ERROR",
    downstreamEffects: Object.freeze(["stage-subject"]),
    explanation: "Deictic follow-up changed subject.",
    repaired: false,
    ...overrides,
  });
}

test("1–6 — one harness consumes certified RMS actors, Observer, and real CC:5", () => {
  assert.equal(nexoraSimulationTestHarnessIdentity, "NPA-T SIM-TEST:1/NexoraSimulationTestHarness");
  assert.equal(SIM_TEST_1_BOUNDARY.rmsAuthority, "NPA-T RMS:1-10 + FINAL");
  assert.equal(RMS_SCENARIO_MANAGER_ACTOR.kind, "MANAGER_AGENT");
  assert.equal(RMS_SCENARIO_OPERATOR_ACTOR.kind, "OPERATOR_AGENT");
  assert.equal(RMS_SCENARIO_OBSERVER_ACTOR.kind, "OBSERVER");
  assert.equal(RMS_REAL_CONVERSATION_ENTRY_NAME, "executeNexoraConversationalExperience");
  assert.equal(RMS_MANAGER_AGENT_CONTRACT.kind, "MANAGER_AGENT");
  assert.equal(RMS_OPERATOR_AGENT_CONTRACT.kind, "OPERATOR_AGENT");
  assert.equal(RMS_OBSERVER_CONTRACT.kind, "OBSERVER");
});

test("7–11 — harness cannot answer or mutate Ground Truth, Data Reality, MLEVEL, or Stage", () => {
  assert.equal(SIM_TEST_1_BOUNDARY.answersManagerQuestions, false);
  assert.equal(SIM_TEST_1_BOUNDARY.mutatesGroundTruth, false);
  assert.equal(SIM_TEST_1_BOUNDARY.writesDataRealityDirectly, false);
  assert.equal(SIM_TEST_1_BOUNDARY.mutatesMlevel, false);
  assert.equal(SIM_TEST_1_BOUNDARY.mutatesStage, false);
});

test("12–14 — journeys are declarative, forbid correct-answer scripts, and checkpoints are read-only", () => {
  for (const journey of SIM_TEST_1_JOURNEYS) validateNexoraSimulationTestJourney(journey);
  assert.deepEqual(SIM_TEST_FORBIDDEN_JOURNEY_KEYS.includes("correctProblem"), true);
  const invalid = { ...SIM_TEST_MANUFACTURING_BASELINE, correctProblem: "Capacity" } as unknown as NexoraSimulationTestJourney;
  assert.throws(() => validateNexoraSimulationTestJourney(invalid), /cannot encode correctProblem/);
  const checkpoint = reports()[0]!.checkpoints[0]!;
  assert.equal(checkpoint.writeAttempted, false);
  assert.equal(Object.isFrozen(checkpoint), true);
});

test("15–17 — findings carry reproducible evidence, owner, and severity", () => {
  const report = reports()[0]!;
  const finding = projectNexoraSimulationTestFinding({
    finding: observerFinding(),
    testRunId: report.identity.simulationTestRunId,
    journey: SIM_TEST_MANUFACTURING_BASELINE,
    rmsRunId: report.identity.rmsRunId,
    checkpoint: report.checkpoints.at(-1) ?? null,
  });
  assert.equal(finding.severity, "S1");
  assert.equal(finding.likelyOwner, "REFERENT");
  assert.equal(finding.repaired, false);
  assert.ok(finding.traceReferences.length > 0);
  assert.equal(finding.scenarioId, "manufacturing-capacity-pressure");
});

test("18–21 — manufacturing, project, logistics, and service journeys run on one harness", () => {
  const all = reports();
  assert.equal(all.length, 4);
  assert.deepEqual(all.map((item) => item.identity.scenarioId), [
    SIM_TEST_MANUFACTURING_BASELINE.scenarioId,
    SIM_TEST_PROJECT_BASELINE.scenarioId,
    SIM_TEST_LOGISTICS_PARITY.scenarioId,
    SIM_TEST_SERVICE_PARITY.scenarioId,
  ]);
  assert.ok(all.every((item) => item.harnessStatus === "PASS"));
});

test("22–25 — MLEVEL, Stage, conversation, Operator, and Data Reality are observable", () => {
  for (const report of reports()) {
    const final = report.checkpoints.at(-1)!;
    assert.equal(final.mlevel.authority, "NPA-T MLEVEL:1/ManagementLevelPath");
    assert.ok(report.checkpoints.some((item) => item.kind === "MLEVEL_STATE"));
    assert.ok(report.checkpoints.some((item) => item.kind === "STAGE_STATE"));
    assert.ok(report.checkpoints.some((item) => item.managerUtterance && item.nexoraResponse));
    assert.ok(report.checkpoints.some((item) => item.operatorRecordIds.length > 0));
    assert.ok(report.checkpoints.some((item) => item.dataRealityPublicationIds.length > 0));
  }
});

test("26 — deterministic rerun reproduces equivalent controlled conditions", () => {
  const first = runNexoraSimulationTestJourney({ journey: SIM_TEST_PROJECT_BASELINE, runId: "replay-a" });
  const second = runNexoraSimulationTestJourney({ journey: SIM_TEST_PROJECT_BASELINE, runId: "replay-b" });
  assert.equal(first.deterministicSignature, second.deterministicSignature);
});

test("27–29 — product findings remain separate, S0 stops, and budgets bound loops", () => {
  const base = reports()[0]!;
  const productFinding = projectNexoraSimulationTestFinding({
    finding: observerFinding(),
    testRunId: base.identity.simulationTestRunId,
    journey: SIM_TEST_MANUFACTURING_BASELINE,
    rmsRunId: base.identity.rmsRunId,
    checkpoint: base.checkpoints.at(-1) ?? null,
  });
  assert.equal(base.harnessStatus, "PASS");
  assert.equal(productFinding.severity, "S1");
  const s0 = projectNexoraSimulationTestFinding({
    finding: observerFinding({ taxonomy: "SIMULATION_ERROR", subtype: "FIREWALL_VIOLATION", severity: "CRITICAL_CONTRACT_FAILURE" }),
    testRunId: base.identity.simulationTestRunId,
    journey: SIM_TEST_MANUFACTURING_BASELINE,
    rmsRunId: base.identity.rmsRunId,
    checkpoint: null,
  });
  assert.equal(shouldStopNexoraSimulationTest([s0]), true);

  const bounded = Object.freeze({ ...SIM_TEST_PROJECT_BASELINE, journeyId: "budget-check", turnBudget: 1 });
  const stopped = runNexoraSimulationTestJourney({ journey: bounded, runId: "budget" });
  assert.equal(stopped.stopReason, "TURN_BUDGET");
  assert.equal(stopped.turns, 1);
});

test("30–31 — run and aggregate reports preserve harness/product accounting", () => {
  const all = reports();
  const aggregate = aggregateNexoraSimulationTestReports("sim-test-1-focused", all);
  assert.equal(aggregate.journeysRun, 4);
  assert.equal(aggregate.harnessFailures, 0);
  assert.equal(aggregate.reports.length, 4);
  assert.equal(aggregate.turns, all.reduce((sum, item) => sum + item.turns, 0));
  assert.equal(aggregate.productFailures, all.filter((item) => item.productStatus === "FAIL").length);
});

test("32–33 — no auto-repair and SIM-TEST:1 FAST journeys remain non-ingestion", () => {
  assert.equal(SIM_TEST_1_BOUNDARY.autoRepairs, false);
  assert.ok(reports().every((item) => item.autoRepairAttempted === false && item.ingestionActivated === false));
  assert.ok(reports().every((item) => item.ingestion === null));
  assert.equal(SIM_TEST_1_BOUNDARY.ingestionImplemented, false);
});

test("34 — RMS:1–10 + FINAL protection boundary is explicit", () => {
  assert.equal(SIM_TEST_1_BOUNDARY.createsRms11, false);
  assert.equal(SIM_TEST_1_BOUNDARY.ownsObserver, false);
  assert.equal(SIM_TEST_1_BOUNDARY.ownsManager, false);
  assert.equal(SIM_TEST_1_BOUNDARY.ownsOperator, false);
});
