import test from "node:test";
import assert from "node:assert/strict";
import { decisionConfidenceLabelFrom01, normalizeDecisionConfidence01 } from "../decisionConfidence.ts";

test("normalizeDecisionConfidence01 clamps and avoids NaN", () => {
  assert.equal(normalizeDecisionConfidence01(Number.NaN), 0);
  assert.equal(normalizeDecisionConfidence01(-3), 0);
  assert.equal(normalizeDecisionConfidence01(2), 1);
  assert.equal(normalizeDecisionConfidence01(0.44), 0.44);
});

test("decisionConfidenceLabelFrom01 uses D4:1:1 bands", () => {
  assert.equal(decisionConfidenceLabelFrom01(0), "low");
  assert.equal(decisionConfidenceLabelFrom01(0.29), "low");
  assert.equal(decisionConfidenceLabelFrom01(0.3), "medium");
  assert.equal(decisionConfidenceLabelFrom01(0.69), "medium");
  assert.equal(decisionConfidenceLabelFrom01(0.7), "high");
  assert.equal(decisionConfidenceLabelFrom01(1), "high");
});
