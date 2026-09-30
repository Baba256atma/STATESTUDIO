import assert from "node:assert/strict";
import test from "node:test";

import { runNexoraSimulationTestJourney } from "./nexoraSimulationTestHarness.ts";
import {
  SIM_TEST_5_MANUFACTURING_LIFECYCLE,
  SIM_TEST_5_PROJECT_LIFECYCLE,
} from "./nexoraSimulationLifecycleJourneys.ts";

test("SIM-TEST:5-FIX3 — named-issue and active-execution clarification findings are resolved", () => {
  const manufacturing = runNexoraSimulationTestJourney({
    journey: SIM_TEST_5_MANUFACTURING_LIFECYCLE,
    runId: "sim-test-5-fix3-m",
  });
  const project = runNexoraSimulationTestJourney({
    journey: SIM_TEST_5_PROJECT_LIFECYCLE,
    runId: "sim-test-5-fix3-p",
  });

  const t28 = manufacturing.journeyObservations.find((item) => item.turn === 28)!;
  assert.equal(t28.decisionId, "cc10:decision:cc9:scenario:do-nothing:do-nothing:v1");
  assert.equal(t28.decisionCount, 1);
  assert.equal(t28.executionId, "execution-cc10:decision:cc9:scenario:do-nothing:do-nothing:v1");
  assert.equal(t28.executionCount, 1);
  assert.doesNotMatch(t28.response, /I'm not sure which issue you mean/i);

  const t31 = manufacturing.journeyObservations.find((item) => item.turn === 31)!;
  assert.match(t31.response, /already has an active Execution/i);
  assert.equal(t31.executionCount, 1);
  assert.equal(t31.executionStatus, "in-progress");

  const t13 = project.journeyObservations.find((item) => item.turn === 13)!;
  assert.doesNotMatch(t13.response, /I'm not sure which issue you mean/i);
  const t11 = project.journeyObservations.find((item) => item.turn === 11)!;
  assert.match(t11.response, /Execution has started/i);
  assert.ok(t11.executionId);

  const t14 = project.journeyObservations.find((item) => item.turn === 14)!;
  assert.doesNotMatch(t14.response, /Which one do you want me to show/i);

  assert.equal(manufacturing.journeyFindings.length, 0);
  assert.equal(project.journeyFindings.length, 0);
  assert.equal(manufacturing.findingCounts.S0, 0);
  assert.equal(project.findingCounts.S0, 0);
  assert.equal(manufacturing.harnessStatus, "PASS");
  assert.equal(project.harnessStatus, "PASS");
});
