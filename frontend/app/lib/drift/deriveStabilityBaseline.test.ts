import assert from "node:assert/strict";
import test from "node:test";
import { deriveStabilityBaseline } from "./deriveStabilityBaseline.ts";

test("stability baseline derives from stabilized review and improving forecast", () => {
  const baselines = deriveStabilityBaseline({
    decisionReviews: [{
      id: "review_supplier_stable",
      title: "Supplier review",
      summary: "Supplier pathway stabilized.",
      relatedObjectIds: ["supplier", "delivery"],
      reviewStatus: "stabilized",
      confidence: 0.82,
      createdAt: 0,
    }],
    forecasts: [{
      id: "forecast_delivery_improving",
      title: "Delivery improving",
      summary: "Delivery is improving.",
      direction: "improving",
      relatedObjectIds: ["supplier", "delivery"],
      confidence: 0.8,
      domainIds: ["supply_chain"],
      createdAt: 0,
    }],
  });

  assert.equal(baselines.length, 1);
  assert.deepEqual(baselines[0].relatedObjectIds, ["supplier", "delivery"]);
  assert.ok(baselines[0].stabilityScore > 0.65);
});

test("stability baseline ignores active degraded evidence", () => {
  const baselines = deriveStabilityBaseline({
    forecasts: [{
      id: "forecast_degrading",
      title: "Degrading",
      summary: "Pressure returned.",
      direction: "degrading",
      relatedObjectIds: ["supplier"],
      confidence: 0.75,
      createdAt: 0,
    }],
    monitoringSignals: [{
      id: "monitoring_elevated",
      title: "Elevated",
      summary: "Pressure elevated.",
      relatedObjectIds: ["supplier"],
      monitoringStatus: "elevated",
      trend: "degrading",
      confidence: 0.8,
      urgencyScore: 0.82,
      createdAt: 0,
    }],
  });

  assert.deepEqual(baselines, []);
});
