import test from "node:test";
import assert from "node:assert/strict";

import { deriveUncertaintyFactors } from "./deriveUncertaintyFactors.ts";

test("uncertainty factors surface volatile and close comparison evidence", () => {
  const factors = deriveUncertaintyFactors({
    timelineIntelligence: [{
      id: "timeline",
      title: "Timeline",
      summary: "Volatile pressure.",
      relatedObjectIds: ["supplier"],
      trend: "volatile",
      momentumScore: 0.7,
      confidence: 0.6,
      createdAt: 0,
    }],
    scenarioComparisons: [{
      id: "comparison",
      scenarioAId: "a",
      scenarioBId: "b",
      comparisonTitle: "A vs B",
      executiveSummary: "Close options.",
      stabilityDelta: 2,
      fragilityDelta: -2,
      propagationDelta: -1,
      confidenceDelta: 3,
      tradeoffs: [],
      createdAt: 0,
    }],
  });

  assert.ok(factors.includes("Timeline behavior remains volatile."));
  assert.ok(factors.includes("Scenario comparison results remain close."));
});

test("uncertainty factors fall back safely with limited evidence", () => {
  assert.deepEqual(deriveUncertaintyFactors({}), ["Evidence coverage is limited."]);
});
