/**
 * B.25 — pilot validator unit tests.
 */

import test from "node:test";
import assert from "node:assert/strict";

import { validatePilotScenario } from "./nexoraPilotValidator.ts";
import type { NexoraPilotScenario } from "./nexoraPilotScenarios.ts";

const baseScenario: NexoraPilotScenario = {
  id: "test",
  name: "Test",
  domain: "finance",
  description: "d",
  input: { type: "text", payload: "x" },
  expected: { minSignals: 2, expectedFragility: ["medium", "high"] },
};

test("signals + fragility pass", () => {
  const r = validatePilotScenario(baseScenario, {
    signalsCount: 3,
    fragilityLevel: "medium",
    driverLabels: [],
  });
  assert.equal(r.passed, true);
  assert.equal(r.checks.signalsOk, true);
  assert.equal(r.checks.fragilityOk, true);
});

test("driver keywords required", () => {
  const sc: NexoraPilotScenario = {
    ...baseScenario,
    expected: { ...baseScenario.expected, mustHaveDrivers: ["delay", "inventory"] },
  };
  const fail = validatePilotScenario(sc, {
    signalsCount: 4,
    fragilityLevel: "high",
    driverLabels: ["Customer churn"],
  });
  assert.equal(fail.passed, false);
  assert.equal(fail.checks.driversOk, false);

  const ok = validatePilotScenario(sc, {
    signalsCount: 4,
    fragilityLevel: "high",
    driverLabels: ["Inventory risk", "Delivery delay"],
  });
  assert.equal(ok.passed, true);
  assert.equal(ok.checks.driversOk, true);
});
