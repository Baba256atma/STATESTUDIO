import test from "node:test";
import assert from "node:assert/strict";

import { deriveForecastUncertaintyFactors } from "./deriveForecastUncertaintyFactors.ts";

test("forecast uncertainty factors surface limited evidence and volatility", () => {
  const factors = deriveForecastUncertaintyFactors({
    timelineIntelligence: [{
      id: "timeline",
      title: "Volatile propagation",
      summary: "Propagation volatile.",
      relatedObjectIds: ["supplier"],
      trend: "volatile",
      momentumScore: 0.7,
      confidence: 0.6,
      createdAt: 0,
    }],
    confidenceSignals: [{
      id: "confidence",
      confidenceLevel: "low",
      confidenceScore: 0.32,
      rationale: "Signals mixed.",
      createdAt: 0,
    }],
  });

  assert.ok(factors.includes("Propagation patterns remain volatile."));
  assert.ok(factors.includes("Monitoring history is still limited."));
  assert.ok(factors.some((factor) => factor.includes("confidence")));
});
