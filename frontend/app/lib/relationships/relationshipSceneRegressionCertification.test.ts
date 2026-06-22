import assert from "node:assert/strict";
import test from "node:test";

import {
  NWB8_FIX2_CERTIFICATION_TAG,
  RELATIONSHIP_SCENE_REGRESSION_CERTIFICATION_TAGS,
  RELATIONSHIP_SCENE_REGRESSION_COMPLETE_DIAGNOSTIC,
} from "./relationshipSceneRegressionCertificationContract.ts";
import { runRelationshipSceneRegressionCertification } from "./relationshipSceneRegressionCertification.ts";

test("exports NW-B:8-FIX-2 relationship scene regression certification tags and diagnostic", () => {
  assert.equal(NWB8_FIX2_CERTIFICATION_TAG, "[NWB8_FIX2]");
  assert.equal(
    RELATIONSHIP_SCENE_REGRESSION_COMPLETE_DIAGNOSTIC,
    "[RelationshipSceneRegression] Certification Complete"
  );
  assert.deepEqual(RELATIONSHIP_SCENE_REGRESSION_CERTIFICATION_TAGS, [
    "[NWB8_FIX2]",
    "[RELATIONSHIP_CERTIFIED]",
    "[SCENE_REGRESSION_PASS]",
    "[RELATIONSHIP_RENDERING_FROZEN]",
    "[SCENE_RUNTIME_CERTIFIED]",
  ]);
});

test("NW-B:8-FIX-2 relationship scene regression certification passes gates A through L", () => {
  const result = runRelationshipSceneRegressionCertification({
    buildPassed: true,
    testsPassed: true,
  });

  assert.equal(result.tag, "[NWB8_FIX2]");
  assert.equal(result.version, "NW-B:8-FIX-2");
  assert.equal(result.certified, true);
  assert.equal(result.result, "PASS");
  assert.equal(result.gates.length, 12);
  assert.equal(result.gates.every((entry) => entry.status === "PASS"), true);
  assert.equal(result.scenarios.length, 7);
  assert.equal(result.scenarios.every((entry) => entry.status === "PASS"), true);
  assert.equal(result.diagnostics.includes(RELATIONSHIP_SCENE_REGRESSION_COMPLETE_DIAGNOSTIC), true);
  assert.equal(Object.isFrozen(result), true);
  assert.equal(Object.isFrozen(result.gates), true);
  assert.equal(Object.isFrozen(result.scenarios), true);
});

test("NW-B:8-FIX-2 relationship scene regression certification exposes required validation gates", () => {
  const result = runRelationshipSceneRegressionCertification();
  const gateNames = result.gates.map((entry) => entry.name);

  assert.equal(gateNames.includes("Relationship Contract Valid"), true);
  assert.equal(gateNames.includes("Relationship Renderer Safe"), true);
  assert.equal(gateNames.includes("Relationship Line Safe"), true);
  assert.equal(gateNames.includes("Pulse Animation Safe"), true);
  assert.equal(gateNames.includes("Scene Canvas Safe"), true);
  assert.equal(gateNames.includes("Workspace Isolation Safe"), true);
  assert.equal(gateNames.includes("Object Selection Unchanged"), true);
  assert.equal(gateNames.includes("Caption System Unchanged"), true);
  assert.equal(gateNames.includes("MRP Unchanged"), true);
  assert.equal(gateNames.includes("Assistant Unchanged"), true);
  assert.equal(gateNames.includes("Build Passes"), true);
  assert.equal(gateNames.includes("No Runtime Errors"), true);
});

test("NW-B:8-FIX-2 relationship scene regression certification exposes required regression scenarios", () => {
  const result = runRelationshipSceneRegressionCertification();
  const scenarioIds = result.scenarios.map((entry) => entry.id);

  assert.deepEqual(scenarioIds, [
    "zero_relationships",
    "single_relationship",
    "ten_relationships",
    "workspace_switching",
    "selection_after_render",
    "scene_reload",
    "invalid_payload",
  ]);
});

test("NW-B:8-FIX-2 relationship scene regression certification fails when build verification fails", () => {
  const result = runRelationshipSceneRegressionCertification({
    buildPassed: false,
    testsPassed: true,
  });

  assert.equal(result.certified, false);
  assert.equal(result.result, "FAIL");
  assert.equal(result.gates.find((entry) => entry.id === "K")?.status, "FAIL");
});
