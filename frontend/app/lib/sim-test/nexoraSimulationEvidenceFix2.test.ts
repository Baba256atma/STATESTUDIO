import assert from "node:assert/strict";
import test from "node:test";

import { runNexoraSimulationTestJourney } from "./nexoraSimulationTestHarness.ts";
import {
  SIM_TEST_5_LOGISTICS_PARITY,
  SIM_TEST_5_MANUFACTURING_LIFECYCLE,
  SIM_TEST_5_PROJECT_LIFECYCLE,
  SIM_TEST_5_SERVICE_PARITY,
} from "./nexoraSimulationLifecycleJourneys.ts";

test("SIM-TEST:5-FIX2 — Advisor/evidence S1s are repaired; project named-issue remains independent", () => {
  const manufacturing = runNexoraSimulationTestJourney({
    journey: SIM_TEST_5_MANUFACTURING_LIFECYCLE,
    runId: "sim-test-5-fix2-repro-m",
  });
  const project = runNexoraSimulationTestJourney({
    journey: SIM_TEST_5_PROJECT_LIFECYCLE,
    runId: "sim-test-5-fix2-repro-p",
  });
  const logistics = runNexoraSimulationTestJourney({
    journey: SIM_TEST_5_LOGISTICS_PARITY,
    runId: "sim-test-5-fix2-repro-l",
  });
  const service = runNexoraSimulationTestJourney({
    journey: SIM_TEST_5_SERVICE_PARITY,
    runId: "sim-test-5-fix2-repro-s",
  });

  const t4 = manufacturing.journeyObservations.find((item) => item.turn === 4)!;
  assert.match(t4.response, /Production\.csv/);
  assert.equal(t4.csvVersions.some((item) => item.sourceType === "PRODUCTION"), true);

  const t15 = manufacturing.journeyObservations.find((item) => item.turn === 15)!;
  assert.match(t15.response, /already committed/i);
  assert.doesNotMatch(t15.response, /capacity-pressure hypothesis/i);
  assert.equal(t15.decisionId, "cc10:decision:cc9:scenario:do-nothing:do-nothing:v1");
  assert.equal(t15.decisionCount, 1);

  const t17 = manufacturing.journeyObservations.find((item) => item.turn === 17)!;
  assert.equal(t17.executionStatus, "in-progress");
  assert.ok(t17.executionId);

  const t38 = manufacturing.journeyObservations.find((item) => item.turn === 38)!;
  assert.match(t38.response, /can't do that from this workspace/i);
  assert.equal(manufacturing.journeyFindings.some((item) => item.classification.includes("ADVISOR_DIVERGENCE")), false);
  assert.equal(manufacturing.journeyFindings.some((item) => item.classification.includes("UNSUPPORTED_CAUSAL_CLAIM")), false);

  assert.doesNotMatch(logistics.journeyObservations.find((item) => item.turn === 4)!.response, /Production\.csv/i);
  assert.doesNotMatch(service.journeyObservations.find((item) => item.turn === 4)!.response, /Production\.csv/i);
  assert.equal(logistics.findingCounts.S1, 0);
  assert.equal(service.findingCounts.S1, 0);
  assert.equal(logistics.findingCounts.S0, 0);
  assert.equal(service.findingCounts.S0, 0);

  assert.ok(project.journeyFindings.every((item) => item.classification.includes("REPEATED_CLARIFICATION")));
  assert.ok(manufacturing.journeyFindings.every((item) => item.classification.includes("REPEATED_CLARIFICATION")));
  assert.equal(manufacturing.findingCounts.S1, 0);
  assert.equal(project.findingCounts.S1, 0);
  assert.equal(manufacturing.findingCounts.S0, 0);
  assert.equal(manufacturing.harnessStatus, "PASS");
  assert.equal(project.harnessStatus, "PASS");
});
