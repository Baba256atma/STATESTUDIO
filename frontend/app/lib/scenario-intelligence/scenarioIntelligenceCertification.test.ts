import test from "node:test";
import assert from "node:assert/strict";

import {
  DS7_CERTIFICATION_FREEZE_TAGS,
  DS_7_10_SCENARIO_INTELLIGENCE_CERTIFICATION_TAG,
} from "./scenarioIntelligenceCertificationContract.ts";
import { runScenarioIntelligenceCertification } from "./scenarioIntelligenceCertification.ts";
import {
  DS7_CERTIFIED_TAG,
  SCENARIO_GENERATION_COMPLETE_TAG,
} from "./scenarioGenerationContract.ts";

test("exports DS-7 freeze tags", () => {
  assert.equal(DS7_CERTIFIED_TAG, "[DS7_CERTIFIED]");
  assert.equal(SCENARIO_GENERATION_COMPLETE_TAG, "[SCENARIO_GENERATION_COMPLETE]");
  assert.deepEqual(DS7_CERTIFICATION_FREEZE_TAGS, [
    "[DS7_CERTIFIED]",
    "[SCENARIO_GENERATION_COMPLETE]",
  ]);
});

test("DS-7:10 certification passes all gates", () => {
  const result = runScenarioIntelligenceCertification();

  assert.equal(result.tag, DS_7_10_SCENARIO_INTELLIGENCE_CERTIFICATION_TAG);
  assert.equal(result.version, "7.10.0");
  assert.equal(result.certified, true);
  assert.equal(result.gates.length, 14);
  assert.equal(
    result.gates.every((gate) => gate.status === "PASS"),
    true
  );
  assert.equal(Object.isFrozen(result), true);
  assert.equal(Object.isFrozen(result.gates), true);
});

test("certification validates runtime builder impacts aggregator comparison and recommendation layers", () => {
  const result = runScenarioIntelligenceCertification();
  const gateNames = result.gates.map((gate) => gate.name);

  assert.equal(gateNames.includes("Runtime Created"), true);
  assert.equal(gateNames.includes("Builder Engine"), true);
  assert.equal(gateNames.includes("Object Impact Simulation"), true);
  assert.equal(gateNames.includes("Relationship Impact Simulation"), true);
  assert.equal(gateNames.includes("KPI Impact Simulation"), true);
  assert.equal(gateNames.includes("Risk Impact Simulation"), true);
  assert.equal(gateNames.includes("Aggregator"), true);
  assert.equal(gateNames.includes("Comparison Foundation"), true);
  assert.equal(gateNames.includes("Recommendation Foundation"), true);
});
