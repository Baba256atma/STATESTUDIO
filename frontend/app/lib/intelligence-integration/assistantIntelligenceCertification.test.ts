import test from "node:test";
import assert from "node:assert/strict";

import {
  ASSISTANT_INTELLIGENCE_COMPLETE_TAG,
  INT3_ASSISTANT_INTEGRATION_CERTIFICATION_TAG,
  INT3_CERTIFICATION_COMPLETE_DIAGNOSTIC,
  INT3_CERTIFICATION_FREEZE_TAGS,
  INT3_CERTIFIED_TAG,
} from "./assistantIntelligenceCertificationContract.ts";
import { runAssistantIntelligenceCertification } from "./assistantIntelligenceCertification.ts";

test("exports INT-3 freeze tags and certification diagnostic", () => {
  assert.equal(INT3_CERTIFIED_TAG, "[INT3_CERTIFIED]");
  assert.equal(ASSISTANT_INTELLIGENCE_COMPLETE_TAG, "[ASSISTANT_INTELLIGENCE_COMPLETE]");
  assert.equal(INT3_CERTIFICATION_COMPLETE_DIAGNOSTIC, "[INT3_CERTIFICATION_COMPLETE]");
  assert.deepEqual(INT3_CERTIFICATION_FREEZE_TAGS, [
    "[INT3_CERTIFIED]",
    "[ASSISTANT_INTELLIGENCE_COMPLETE]",
  ]);
});

test("INT-3 certification passes all gates A through N", () => {
  const result = runAssistantIntelligenceCertification();

  assert.equal(result.tag, INT3_ASSISTANT_INTEGRATION_CERTIFICATION_TAG);
  assert.equal(result.version, "3.6.0");
  assert.equal(result.certified, true);
  assert.equal(result.gates.length, 14);
  assert.equal(
    result.gates.every((entry) => entry.status === "PASS"),
    true
  );
  assert.equal(result.diagnostics.includes(INT3_CERTIFICATION_COMPLETE_DIAGNOSTIC), true);
  assert.equal(Object.isFrozen(result), true);
  assert.equal(Object.isFrozen(result.gates), true);
});

test("certification validates assistant adapter, explanation engines, and guardrails", () => {
  const result = runAssistantIntelligenceCertification();
  const gateNames = result.gates.map((entry) => entry.name);

  assert.equal(gateNames.includes("Assistant Adapter Works"), true);
  assert.equal(gateNames.includes("Object Explanation Engine Works"), true);
  assert.equal(gateNames.includes("Relationship Explanation Engine Works"), true);
  assert.equal(gateNames.includes("KPI Explanation Engine Works"), true);
  assert.equal(gateNames.includes("Risk Explanation Engine Works"), true);
  assert.equal(gateNames.includes("Scenario Explanation Engine Works"), true);
  assert.equal(gateNames.includes("No Scene Mutations"), true);
  assert.equal(gateNames.includes("No Topology Mutations"), true);
  assert.equal(gateNames.includes("No Routing Changes"), true);
  assert.equal(gateNames.includes("No Object Mutations"), true);
  assert.equal(gateNames.includes("No MRP Mutations"), true);
  assert.equal(gateNames.includes("No Legacy Router Usage"), true);
  assert.equal(gateNames.includes("Build Passes"), true);
  assert.equal(gateNames.includes("Tests Pass"), true);
});
