import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { RMS_MANAGER_AGENT_CONTRACT, RMS_OBSERVER_CONTRACT, RMS_OPERATOR_AGENT_CONTRACT } from "../rms/rmsActorContracts.ts";
import { RMS_REAL_CONVERSATION_ENTRY_NAME } from "../rms/rmsManagerCc5Adapter.ts";
import { RMS_MANAGER_PROFILES } from "../rms/rmsManagerProfiles.ts";
import {
  aggregateNexoraSimulationTestReports,
  runNexoraSimulationTestJourney,
  validateNexoraSimulationTestJourney,
} from "./nexoraSimulationTestHarness.ts";
import {
  SIM_TEST_6_FAST_PARITY,
  SIM_TEST_6_FRESH_SESSION,
  SIM_TEST_6_JOURNEYS,
  SIM_TEST_6_LOGISTICS_PARITY,
  SIM_TEST_6_MANUFACTURING_IMPATIENT,
  SIM_TEST_6_MANUFACTURING_LONG,
  SIM_TEST_6_PROJECT_LONG,
  SIM_TEST_6_SERVICE_PARITY,
} from "./nexoraSimulationLongSessionJourneys.ts";
import { clusterSimTest6Findings, uniqueSimTest6Findings, writeSimTest6Artifacts } from "./nexoraSimulationLongSessionReport.ts";
import {
  SIM_TEST_6_BOUNDARY,
  SIM_TEST_FORBIDDEN_JOURNEY_KEYS,
} from "./nexoraSimulationTestContract.ts";

const JOURNEY_SOURCE = readFileSync(new URL("./nexoraSimulationLongSessionJourneys.ts", import.meta.url), "utf8");
const HARNESS_SOURCE = readFileSync(new URL("./nexoraSimulationTestHarness.ts", import.meta.url), "utf8");
const REPORT_SOURCE = readFileSync(new URL("./nexoraSimulationLongSessionReport.ts", import.meta.url), "utf8");

function managerTurns(journey: (typeof SIM_TEST_6_MANUFACTURING_LONG)) {
  return journey.steps.filter((step) => step.kind === "MANAGER_TURN").length;
}

test("SIM-TEST:6 — existing authorities only; harness does not become intelligence", () => {
  assert.equal(SIM_TEST_6_BOUNDARY.createsLongSessionAgent, false);
  assert.equal(SIM_TEST_6_BOUNDARY.createsMemoryAgent, false);
  assert.equal(SIM_TEST_6_BOUNDARY.createsStressAgent, false);
  assert.equal(SIM_TEST_6_BOUNDARY.commitDecisionBackdoor, false);
  assert.equal(SIM_TEST_6_BOUNDARY.startExecutionBackdoor, false);
  assert.equal(SIM_TEST_6_BOUNDARY.autoRepairs, false);
  assert.equal(SIM_TEST_6_BOUNDARY.startsSimTest6Fix, false);
  assert.equal(SIM_TEST_6_BOUNDARY.startsSimTestFinal, false);
  assert.equal(RMS_MANAGER_AGENT_CONTRACT.kind, "MANAGER_AGENT");
  assert.equal(RMS_OPERATOR_AGENT_CONTRACT.kind, "OPERATOR_AGENT");
  assert.equal(RMS_OBSERVER_CONTRACT.kind, "OBSERVER");
  assert.equal(RMS_REAL_CONVERSATION_ENTRY_NAME, "executeNexoraConversationalExperience");
  assert.equal(HARNESS_SOURCE.includes("simTest.commitDecision"), false);
  assert.equal(REPORT_SOURCE.includes("commitDecision("), false);
  for (const journey of SIM_TEST_6_JOURNEYS) validateNexoraSimulationTestJourney(journey);
  for (const key of SIM_TEST_FORBIDDEN_JOURNEY_KEYS) assert.equal(JOURNEY_SOURCE.includes(key), false);
});

test("SIM-TEST:6 — journeys declare long-session coverage without filler budgets", () => {
  assert.equal(SIM_TEST_6_MANUFACTURING_LONG.mode, "INGESTION");
  assert.equal(SIM_TEST_6_MANUFACTURING_LONG.managerProfileId, "DATA_DRIVEN_MANAGER");
  assert.equal(RMS_MANAGER_PROFILES.DATA_DRIVEN_MANAGER.groundTruthAccess, false);
  assert.equal(RMS_MANAGER_PROFILES.IMPATIENT_MANAGER.profileId, "IMPATIENT_MANAGER");
  const manufacturing = managerTurns(SIM_TEST_6_MANUFACTURING_LONG);
  const project = managerTurns(SIM_TEST_6_PROJECT_LONG);
  const logistics = managerTurns(SIM_TEST_6_LOGISTICS_PARITY);
  const service = managerTurns(SIM_TEST_6_SERVICE_PARITY);
  const fast = managerTurns(SIM_TEST_6_FAST_PARITY);
  const impatient = managerTurns(SIM_TEST_6_MANUFACTURING_IMPATIENT);
  assert.ok(manufacturing >= 100 && manufacturing <= 150, String(manufacturing));
  assert.ok(project >= 60 && project <= 100, String(project));
  assert.ok(logistics >= 30 && logistics <= 50, String(logistics));
  assert.ok(service >= 30 && service <= 50, String(service));
  assert.ok(fast >= 30 && fast <= 50, String(fast));
  assert.ok(impatient >= 30 && impatient <= 50, String(impatient));
  assert.equal(SIM_TEST_6_FAST_PARITY.mode, "FAST");
  assert.equal(SIM_TEST_6_FRESH_SESSION.mode, "INGESTION");
  const intents = SIM_TEST_6_MANUFACTURING_LONG.steps.flatMap((step) => step.kind === "MANAGER_TURN" ? [step.managementIntent] : []);
  for (const intent of [
    "ORIENT", "FOCUS_PROBLEM", "REQUEST_EVIDENCE", "ASK_VARIABLES", "EXPLORE_OPTIONS", "COMPARE",
    "COMMIT_DECISION", "REQUEST_EXECUTION", "ASK_OUTCOME", "CHANGE_CONTEXT", "RETURN_TO_SUBJECT",
    "ASK_CAUSE", "CHECK_CHANGE", "ASK_LEARNING", "UNSUPPORTED_ACTION",
  ]) {
    assert.ok(intents.some((item) => item === intent), intent);
  }
});

test("SIM-TEST:6 — long-session discovery runs (no auto-repair)", { timeout: 1_200_000 }, () => {
  const started = Date.now();
  const reports = SIM_TEST_6_JOURNEYS.map((journey, index) =>
    runNexoraSimulationTestJourney({ journey, runId: `sim-test-6-${index}` }),
  );
  const elapsedMs = Date.now() - started;
  for (const report of reports) {
    assert.equal(report.harnessStatus, "PASS", report.error ?? report.stopReason);
    assert.equal(report.findingCounts.S0, 0);
    assert.equal(report.autoRepairAttempted, false);
    assert.equal(report.managerFirewall?.groundTruthAccess, false);
  }
  const manufacturing = reports[0];
  const project = reports[1];
  const logistics = reports[2];
  const service = reports[3];
  const fast = reports[4];
  const fresh = reports[6];
  assert.ok(manufacturing.turns >= 100, String(manufacturing.turns));
  assert.ok(project.turns >= 60, String(project.turns));
  assert.ok(logistics.turns >= 30);
  assert.ok(service.turns >= 30);
  assert.ok(fast.turns >= 30);
  assert.equal(manufacturing.identity.mode, "INGESTION");
  assert.equal(fast.identity.mode, "FAST");
  const manufacturingDecision = manufacturing.journeyObservations.map((item) => item.decisionId).find(Boolean) ?? null;
  const freshDecision = fresh.journeyObservations.map((item) => item.decisionId).find(Boolean) ?? null;
  assert.equal(Boolean(manufacturingDecision && freshDecision && manufacturingDecision === freshDecision), false);
  const aggregate = aggregateNexoraSimulationTestReports("sim-test-6", reports);
  assert.equal(aggregate.harnessFailures, 0);
  const uniqueFindings = uniqueSimTest6Findings(reports);
  const clusters = clusterSimTest6Findings(uniqueFindings);
  const s1 = uniqueFindings.filter((item) => item.severity === "S1").length;
  writeSimTest6Artifacts({
    reports,
    clusters,
    certified: s1 === 0 && aggregate.harnessFailures === 0,
    notes: {
      performance: `harness wall ${elapsedMs}ms across ${aggregate.turns} Manager turns`,
      isolation: aggregate.crossRunIsolation,
      browser: "Deferred until discovery classification. Bounded Watch sample is not a substitute for the harness.",
    },
  });
  void SIM_TEST_6_MANUFACTURING_IMPATIENT;
});
