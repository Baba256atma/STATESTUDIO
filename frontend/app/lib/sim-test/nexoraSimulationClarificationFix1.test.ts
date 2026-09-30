import assert from "node:assert/strict";
import test from "node:test";

import { runNexoraSimulationTestJourney } from "./nexoraSimulationTestHarness.ts";
import {
  SIM_TEST_6_FAST_PARITY,
  SIM_TEST_6_FRESH_SESSION,
  SIM_TEST_6_LOGISTICS_PARITY,
  SIM_TEST_6_MANUFACTURING_LONG,
  SIM_TEST_6_PROJECT_LONG,
  SIM_TEST_6_SERVICE_PARITY,
  SIM_TEST_6_T50_FOCUSED,
} from "./nexoraSimulationLongSessionJourneys.ts";
import { uniqueSimTest6Findings } from "./nexoraSimulationLongSessionReport.ts";
import { SIM_TEST_5_MANUFACTURING_LIFECYCLE } from "./nexoraSimulationLifecycleJourneys.ts";

test("SIM-TEST:6-FIX1 — focused T42–T52 reproduction no longer repeats stale clarification", () => {
  const report = runNexoraSimulationTestJourney({
    journey: SIM_TEST_6_T50_FOCUSED,
    runId: "sim-test-6-fix1-t50",
  });
  assert.equal(report.harnessStatus, "PASS");
  assert.equal(report.findingCounts.S0, 0);
  assert.equal(report.turns, 52);
  const t48 = report.journeyObservations.find((item) => item.turn === 48)!;
  const t49 = report.journeyObservations.find((item) => item.turn === 49)!;
  const t50 = report.journeyObservations.find((item) => item.turn === 50)!;
  assert.equal(t48.utterance, "Return to the capacity pressure we started with.");
  assert.notEqual(t48.clarificationRequired, true);
  assert.doesNotMatch(t48.response, /Which one do you want me to show/i);
  assert.ok(t48.canonicalSubjectId === "obj-capacity" || t48.canonicalSubjectId === "ctx-problem-capacity", String(t48.canonicalSubjectId));
  assert.notEqual(t49.clarificationRequired, true);
  assert.doesNotMatch(t50.response, /Which one do you want me to show/i);
  assert.equal(
    report.journeyFindings.some((item) => item.classification.includes("REPEATED_CLARIFICATION") && item.managerTurn === 50),
    false,
  );
  assert.equal(t50.decisionCount, 1);
  assert.equal(t50.executionCount, 1);
});

test("SIM-TEST:6-FIX1 — manufacturing long no longer carries the T50 clarification root", () => {
  const report = runNexoraSimulationTestJourney({
    journey: SIM_TEST_6_MANUFACTURING_LONG,
    runId: "sim-test-6-fix1-mfg",
  });
  assert.equal(report.harnessStatus, "PASS");
  assert.equal(report.findingCounts.S0, 0);
  const t50 = report.journeyObservations.find((item) => item.turn === 50)!;
  assert.equal(
    report.journeyFindings.some((item) => item.classification.includes("REPEATED_CLARIFICATION") && item.managerTurn === 50),
    false,
  );
  assert.equal(t50.decisionCount, 1);
  assert.equal(t50.executionCount, 1);
  assert.equal(t50.npsLearningDurable === true, false);
});

test("SIM-TEST:6-FIX1 — project, parity, FAST, and fresh isolation keep the T50 root closed", () => {
  const project = runNexoraSimulationTestJourney({ journey: SIM_TEST_6_PROJECT_LONG, runId: "sim-test-6-fix1-p" });
  const logistics = runNexoraSimulationTestJourney({ journey: SIM_TEST_6_LOGISTICS_PARITY, runId: "sim-test-6-fix1-l" });
  const service = runNexoraSimulationTestJourney({ journey: SIM_TEST_6_SERVICE_PARITY, runId: "sim-test-6-fix1-s" });
  const fast = runNexoraSimulationTestJourney({ journey: SIM_TEST_6_FAST_PARITY, runId: "sim-test-6-fix1-f" });
  const fresh = runNexoraSimulationTestJourney({ journey: SIM_TEST_6_FRESH_SESSION, runId: "sim-test-6-fix1-fresh" });
  for (const report of [project, logistics, service, fast, fresh]) {
    assert.equal(report.harnessStatus, "PASS", report.identity.journeyId);
    assert.equal(report.findingCounts.S0, 0, report.identity.journeyId);
  }
  assert.equal(
    uniqueSimTest6Findings([logistics, service, fast]).some((item) =>
      item.classification.includes("REPEATED_CLARIFICATION") && item.managerTurn === 24,
    ),
    false,
  );
  assert.equal(fresh.journeyObservations.some((item) => item.clarificationRequired), false);
});

test("SIM-TEST:6-FIX1 — SIM-TEST:5-FIX3 named-issue and execution regressions remain green", () => {
  const manufacturing = runNexoraSimulationTestJourney({
    journey: SIM_TEST_5_MANUFACTURING_LIFECYCLE,
    runId: "sim-test-6-fix1-reg-5",
  });
  assert.equal(manufacturing.harnessStatus, "PASS");
  assert.equal(manufacturing.findingCounts.S0, 0);
  assert.equal(manufacturing.findingCounts.S1, 0, manufacturing.journeyFindings.map((item) => item.classification).join(","));
});
