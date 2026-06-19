import test from "node:test";
import assert from "node:assert/strict";

import {
  C2_CERTIFICATION_COMPLETE_DIAGNOSTIC,
  C2_CERTIFICATION_FREEZE_TAGS,
  C2_CERTIFIED_TAG,
  C2_COMPARE_SCENE_OVERLAY_CERTIFICATION_TAG,
  COMPARE_SCENE_OVERLAY_COMPLETE_TAG,
} from "./compareSceneOverlayCertificationContract.ts";
import { runCompareSceneOverlayCertification } from "./compareSceneOverlayCertification.ts";

test("exports C2 compare scene overlay certification tags and diagnostic", () => {
  assert.equal(C2_CERTIFIED_TAG, "[C2_CERTIFIED]");
  assert.equal(COMPARE_SCENE_OVERLAY_COMPLETE_TAG, "[COMPARE_SCENE_OVERLAY_COMPLETE]");
  assert.equal(C2_CERTIFICATION_COMPLETE_DIAGNOSTIC, "[C2_CERTIFICATION_COMPLETE]");
  assert.deepEqual(C2_CERTIFICATION_FREEZE_TAGS, [
    "[C2_CERTIFIED]",
    "[COMPARE_SCENE_OVERLAY_COMPLETE]",
  ]);
});

test("C2 compare scene overlay certification passes gates A through M", () => {
  const result = runCompareSceneOverlayCertification({ buildPassed: true, testsPassed: true });

  assert.equal(result.tag, C2_COMPARE_SCENE_OVERLAY_CERTIFICATION_TAG);
  assert.equal(result.certified, true);
  assert.equal(result.gates.length, 13);
  assert.equal(result.gates.every((entry) => entry.status === "PASS"), true);
  assert.equal(result.diagnostics.includes(C2_CERTIFICATION_COMPLETE_DIAGNOSTIC), true);
  assert.equal(Object.isFrozen(result), true);
  assert.equal(Object.isFrozen(result.gates), true);
});

test("C2 compare scene overlay certification exposes required validation gates", () => {
  const result = runCompareSceneOverlayCertification();
  const gateNames = result.gates.map((entry) => entry.name);

  assert.equal(gateNames.includes("Overlay Contract works"), true);
  assert.equal(gateNames.includes("Scene Compare Adapter works"), true);
  assert.equal(gateNames.includes("Object Compare Markers work"), true);
  assert.equal(gateNames.includes("KPI/Risk Visual Layer works"), true);
  assert.equal(gateNames.includes("Overlay Controller works"), true);
  assert.equal(gateNames.includes("No Scene mutations"), true);
  assert.equal(gateNames.includes("No Topology mutations"), true);
  assert.equal(gateNames.includes("No Routing changes"), true);
  assert.equal(gateNames.includes("No DS mutations"), true);
  assert.equal(gateNames.includes("No Simulation mutations"), true);
  assert.equal(gateNames.includes("No Object mutations"), true);
  assert.equal(gateNames.includes("Build passes"), true);
  assert.equal(gateNames.includes("Tests pass"), true);
});
