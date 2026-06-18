import test from "node:test";
import assert from "node:assert/strict";

import {
  ANALYZE_INTELLIGENCE_COMPLETE_TAG,
  INT1_CERTIFICATION_FREEZE_TAGS,
  INT1_CERTIFIED_TAG,
  INT_1_ANALYZE_INTEGRATION_CERTIFICATION_TAG,
} from "./analyzeIntelligenceCertificationContract.ts";
import { runAnalyzeIntelligenceCertification } from "./analyzeIntelligenceCertification.ts";

test("exports INT-1 freeze tags", () => {
  assert.equal(INT1_CERTIFIED_TAG, "[INT1_CERTIFIED]");
  assert.equal(ANALYZE_INTELLIGENCE_COMPLETE_TAG, "[ANALYZE_INTELLIGENCE_COMPLETE]");
  assert.deepEqual(INT1_CERTIFICATION_FREEZE_TAGS, [
    "[INT1_CERTIFIED]",
    "[ANALYZE_INTELLIGENCE_COMPLETE]",
  ]);
});

test("INT-1 certification passes all gates A through L", () => {
  const result = runAnalyzeIntelligenceCertification();

  assert.equal(result.tag, INT_1_ANALYZE_INTEGRATION_CERTIFICATION_TAG);
  assert.equal(result.version, "1.5.0");
  assert.equal(result.certified, true);
  assert.equal(result.gates.length, 12);
  assert.equal(
    result.gates.every((entry) => entry.status === "PASS"),
    true
  );
  assert.equal(Object.isFrozen(result), true);
  assert.equal(Object.isFrozen(result.gates), true);
});

test("certification validates INT-1 adapter contract binding summary and guardrails", () => {
  const result = runAnalyzeIntelligenceCertification();
  const gateNames = result.gates.map((entry) => entry.name);

  assert.equal(gateNames.includes("Executive Intelligence Adapter Works"), true);
  assert.equal(gateNames.includes("Analyze Contract Works"), true);
  assert.equal(gateNames.includes("Analyze Binding Works"), true);
  assert.equal(gateNames.includes("Analyze Summary Renders"), true);
  assert.equal(gateNames.includes("Object Selection Preserved"), true);
  assert.equal(gateNames.includes("Scene Unchanged"), true);
  assert.equal(gateNames.includes("Topology Unchanged"), true);
  assert.equal(gateNames.includes("Routing Unchanged"), true);
  assert.equal(gateNames.includes("MRP Unchanged"), true);
  assert.equal(gateNames.includes("No Legacy Router Usage"), true);
  assert.equal(gateNames.includes("Build Passes"), true);
  assert.equal(gateNames.includes("Tests Pass"), true);
});
