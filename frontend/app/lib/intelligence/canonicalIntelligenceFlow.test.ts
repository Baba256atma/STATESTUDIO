import assert from "node:assert/strict";
import test from "node:test";
import {
  getCanonicalIntelligenceFlow,
  validateCanonicalFlow,
} from "./canonicalIntelligenceFlow.ts";

test("canonical intelligence flow is ordered from signals to executive UX", () => {
  const flow = getCanonicalIntelligenceFlow();
  assert.equal(flow[0].stage, "signals");
  assert.equal(flow.at(-1)?.stage, "executive_ux");
  assert.ok(flow.some((step) => step.layerIds.includes("readiness")));
  assert.ok(flow.some((step) => step.layerIds.includes("adaptation")));
});

test("canonical intelligence flow references registered layers", () => {
  const result = validateCanonicalFlow();
  assert.equal(result.valid, true, result.warnings.join("; "));
});
