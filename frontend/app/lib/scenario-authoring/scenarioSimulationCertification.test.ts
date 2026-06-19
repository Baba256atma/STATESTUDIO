import test from "node:test";
import assert from "node:assert/strict";

import {
  SCENARIO_SIMULATION_COMPLETE_TAG,
  S2_CERTIFICATION_COMPLETE_DIAGNOSTIC,
  S2_CERTIFICATION_FREEZE_TAGS,
  S2_CERTIFIED_TAG,
  S2_SCENARIO_SIMULATION_CERTIFICATION_TAG,
} from "./scenarioSimulationCertificationContract.ts";
import { runScenarioSimulationCertification } from "./scenarioSimulationCertification.ts";

test("exports S2 certification tags and diagnostic", () => {
  assert.equal(S2_CERTIFIED_TAG, "[S2_CERTIFIED]");
  assert.equal(SCENARIO_SIMULATION_COMPLETE_TAG, "[SCENARIO_SIMULATION_COMPLETE]");
  assert.equal(S2_CERTIFICATION_COMPLETE_DIAGNOSTIC, "[S2_CERTIFICATION_COMPLETE]");
  assert.deepEqual(S2_CERTIFICATION_FREEZE_TAGS, [
    "[S2_CERTIFIED]",
    "[SCENARIO_SIMULATION_COMPLETE]",
  ]);
});

test("S2 certification passes gates A through N", () => {
  const result = runScenarioSimulationCertification({ buildPassed: true, testsPassed: true });

  assert.equal(result.tag, S2_SCENARIO_SIMULATION_CERTIFICATION_TAG);
  assert.equal(result.certified, true);
  assert.equal(result.gates.length, 14);
  assert.equal(result.gates.every((entry) => entry.status === "PASS"), true);
  assert.equal(result.diagnostics.includes(S2_CERTIFICATION_COMPLETE_DIAGNOSTIC), true);
  assert.equal(Object.isFrozen(result), true);
  assert.equal(Object.isFrozen(result.gates), true);
});

test("S2 certification exposes all required validation gates", () => {
  const result = runScenarioSimulationCertification();
  const gateNames = result.gates.map((entry) => entry.name);

  assert.equal(gateNames.includes("Simulation Runtime works"), true);
  assert.equal(gateNames.includes("Draft-to-Simulation Adapter works"), true);
  assert.equal(gateNames.includes("Object Simulation Engine works"), true);
  assert.equal(gateNames.includes("Relationship Simulation Engine works"), true);
  assert.equal(gateNames.includes("KPI Simulation Engine works"), true);
  assert.equal(gateNames.includes("Risk Simulation Engine works"), true);
  assert.equal(gateNames.includes("Simulation Result Aggregator works"), true);
  assert.equal(gateNames.includes("No Scene mutations"), true);
  assert.equal(gateNames.includes("No Topology mutations"), true);
  assert.equal(gateNames.includes("No Routing changes"), true);
  assert.equal(gateNames.includes("No DS mutations"), true);
  assert.equal(gateNames.includes("No Object mutations"), true);
  assert.equal(gateNames.includes("Build passes"), true);
  assert.equal(gateNames.includes("Tests pass"), true);
});
