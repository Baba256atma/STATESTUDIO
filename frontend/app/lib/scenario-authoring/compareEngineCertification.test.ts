import test from "node:test";
import assert from "node:assert/strict";

import {
  C1_CERTIFICATION_COMPLETE_DIAGNOSTIC,
  C1_CERTIFICATION_FREEZE_TAGS,
  C1_CERTIFIED_TAG,
  C1_COMPARE_ENGINE_CERTIFICATION_TAG,
  COMPARE_ENGINE_COMPLETE_TAG,
} from "./compareEngineCertificationContract.ts";
import { runCompareEngineCertification } from "./compareEngineCertification.ts";

test("exports C1 compare certification tags and diagnostic", () => {
  assert.equal(C1_CERTIFIED_TAG, "[C1_CERTIFIED]");
  assert.equal(COMPARE_ENGINE_COMPLETE_TAG, "[COMPARE_ENGINE_COMPLETE]");
  assert.equal(C1_CERTIFICATION_COMPLETE_DIAGNOSTIC, "[C1_CERTIFICATION_COMPLETE]");
  assert.deepEqual(C1_CERTIFICATION_FREEZE_TAGS, [
    "[C1_CERTIFIED]",
    "[COMPARE_ENGINE_COMPLETE]",
  ]);
});

test("C1 compare certification passes gates A through M", () => {
  const result = runCompareEngineCertification({ buildPassed: true, testsPassed: true });

  assert.equal(result.tag, C1_COMPARE_ENGINE_CERTIFICATION_TAG);
  assert.equal(result.certified, true);
  assert.equal(result.gates.length, 13);
  assert.equal(result.gates.every((entry) => entry.status === "PASS"), true);
  assert.equal(result.diagnostics.includes(C1_CERTIFICATION_COMPLETE_DIAGNOSTIC), true);
  assert.equal(Object.isFrozen(result), true);
  assert.equal(Object.isFrozen(result.gates), true);
});

test("C1 compare certification exposes required validation gates", () => {
  const result = runCompareEngineCertification();
  const gateNames = result.gates.map((entry) => entry.name);

  assert.equal(gateNames.includes("Compare Contract works"), true);
  assert.equal(gateNames.includes("Pair Selector works"), true);
  assert.equal(gateNames.includes("Object Delta Compare works"), true);
  assert.equal(gateNames.includes("KPI/Risk Compare works"), true);
  assert.equal(gateNames.includes("Executive Compare Summary works"), true);
  assert.equal(gateNames.includes("No Scene mutations"), true);
  assert.equal(gateNames.includes("No Topology mutations"), true);
  assert.equal(gateNames.includes("No Routing changes"), true);
  assert.equal(gateNames.includes("No DS mutations"), true);
  assert.equal(gateNames.includes("No Simulation mutations"), true);
  assert.equal(gateNames.includes("No Object mutations"), true);
  assert.equal(gateNames.includes("Build passes"), true);
  assert.equal(gateNames.includes("Tests pass"), true);
});
