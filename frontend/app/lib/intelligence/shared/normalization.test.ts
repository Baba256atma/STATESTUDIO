import assert from "node:assert/strict";
import test from "node:test";
import {
  clamp01,
  clamp100,
  confidenceLevelFromScore,
  normalizeIdPart,
  normalizeSeverity,
  uniqueStrings,
} from "./normalization.ts";

test("shared normalization utilities clamp and normalize consistently", () => {
  assert.equal(clamp01(1.4), 1);
  assert.equal(clamp01(-0.2), 0);
  assert.equal(clamp100(120), 100);
  assert.equal(normalizeSeverity("urgent"), "high");
  assert.equal(confidenceLevelFromScore(0.9), "very_high");
  assert.deepEqual(uniqueStrings(["a", "a", "", "b"]), ["a", "b"]);
  assert.equal(normalizeIdPart("Supplier Risk!"), "supplier_risk");
});
