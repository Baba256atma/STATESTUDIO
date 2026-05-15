import test from "node:test";
import assert from "node:assert/strict";

import {
  buildConfidenceRationale,
  confidenceLevelFromScore,
  summarizeConfidence,
} from "./confidenceNarratives.ts";

test("confidence levels map to disciplined bands", () => {
  assert.equal(confidenceLevelFromScore(0.2), "low");
  assert.equal(confidenceLevelFromScore(0.5), "moderate");
  assert.equal(confidenceLevelFromScore(0.75), "high");
  assert.equal(confidenceLevelFromScore(0.92), "very_high");
});

test("confidence narratives are executive and uncertainty-aware", () => {
  const high = buildConfidenceRationale({
    level: "high",
    focus: "Reduce supplier dependency",
    supportingSignalCount: 3,
  });
  const moderate = buildConfidenceRationale({
    level: "moderate",
    focus: "Reduce supplier dependency",
    uncertaintyCount: 2,
  });
  const summary = summarizeConfidence({
    level: "moderate",
    score: 0.55,
    uncertaintyFactors: ["Timeline behavior remains volatile."],
  });

  assert.ok(high.includes("consistent operational signals"));
  assert.ok(moderate.includes("some uncertainty remains"));
  assert.ok(summary.includes("Timeline behavior remains volatile."));
});
