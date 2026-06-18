import test from "node:test";
import assert from "node:assert/strict";

import {
  SCENARIO_AUTHORING_COMPLETE_TAG,
  S1_CERTIFICATION_COMPLETE_DIAGNOSTIC,
  S1_CERTIFICATION_FREEZE_TAGS,
  S1_CERTIFIED_TAG,
  S1_SCENARIO_AUTHORING_CERTIFICATION_TAG,
} from "./scenarioAuthoringCertificationContract.ts";
import { runScenarioAuthoringCertification } from "./scenarioAuthoringCertification.ts";

test("exports S-1 freeze tags and certification diagnostic", () => {
  assert.equal(S1_CERTIFIED_TAG, "[S1_CERTIFIED]");
  assert.equal(SCENARIO_AUTHORING_COMPLETE_TAG, "[SCENARIO_AUTHORING_COMPLETE]");
  assert.equal(S1_CERTIFICATION_COMPLETE_DIAGNOSTIC, "[S1_CERTIFICATION_COMPLETE]");
  assert.deepEqual(S1_CERTIFICATION_FREEZE_TAGS, [
    "[S1_CERTIFIED]",
    "[SCENARIO_AUTHORING_COMPLETE]",
  ]);
});

test("S-1 certification passes all gates A through N", () => {
  const result = runScenarioAuthoringCertification();

  assert.equal(result.tag, S1_SCENARIO_AUTHORING_CERTIFICATION_TAG);
  assert.equal(result.version, "1.0.0");
  assert.equal(result.certified, true);
  assert.equal(result.gates.length, 14);
  assert.equal(
    result.gates.every((entry) => entry.status === "PASS"),
    true
  );
  assert.equal(result.diagnostics.includes(S1_CERTIFICATION_COMPLETE_DIAGNOSTIC), true);
  assert.equal(Object.isFrozen(result), true);
  assert.equal(Object.isFrozen(result.gates), true);
});

test("certification validates authoring modules and guardrails", () => {
  const result = runScenarioAuthoringCertification();
  const gateNames = result.gates.map((entry) => entry.name);

  assert.equal(gateNames.includes("Authoring Contract Works"), true);
  assert.equal(gateNames.includes("Input Model Works"), true);
  assert.equal(gateNames.includes("Draft Builder Works"), true);
  assert.equal(gateNames.includes("Validation Engine Works"), true);
  assert.equal(gateNames.includes("Save Registry Works"), true);
  assert.equal(gateNames.includes("UI Binding Works"), true);
  assert.equal(gateNames.includes("Assistant Bridge Works"), true);
  assert.equal(gateNames.includes("No Scene Mutations"), true);
  assert.equal(gateNames.includes("No Topology Mutations"), true);
  assert.equal(gateNames.includes("No Routing Changes"), true);
  assert.equal(gateNames.includes("No DS Mutations"), true);
  assert.equal(gateNames.includes("No Simulation Execution"), true);
  assert.equal(gateNames.includes("Build Passes"), true);
  assert.equal(gateNames.includes("Tests Pass"), true);
});
