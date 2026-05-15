import assert from "node:assert/strict";
import test from "node:test";
import { scoreStrategicDriftIntensity } from "./scoreStrategicDriftIntensity.ts";

test("strategic drift intensity is stable clamped and deviation-aware", () => {
  const score = scoreStrategicDriftIntensity({
    driftType: "propagation_expansion",
    relatedObjectIds: ["supplier", "delivery"],
    baseline: {
      id: "baseline_supplier_delivery",
      relatedObjectIds: ["supplier", "delivery"],
      relatedZoneIds: [],
      sourceIds: ["review_1"],
      baselineStrength: 0.8,
      stabilityScore: 0.78,
      domainIds: ["supply_chain"],
      createdAt: 0,
    },
    forecasts: [{
      id: "forecast_degrading",
      title: "Degrading",
      summary: "Pressure returned.",
      direction: "degrading",
      relatedObjectIds: ["supplier", "delivery"],
      confidence: 0.84,
      createdAt: 0,
    }],
    fragilityZones: [{
      id: "zone_supplier_delivery",
      title: "Supplier delivery corridor",
      summary: "Propagation corridor.",
      zoneType: "critical_corridor",
      relatedObjectIds: ["supplier", "delivery"],
      propagationIntensity: 0.82,
      fragilityScore: 84,
      systemicReach: 0.76,
      createdAt: 0,
    }],
  });

  assert.ok(score.driftIntensity > 0.45);
  assert.ok(score.stabilityDeviation > 0.4);
  assert.ok(score.confidence > 0.5);
  assert.ok(score.driftIntensity <= 1);
});

test("strategic drift intensity remains low without matching pressure", () => {
  const score = scoreStrategicDriftIntensity({
    driftType: "stability_regression",
    relatedObjectIds: ["supplier"],
    forecasts: [{
      id: "forecast_stable",
      title: "Stable",
      summary: "Stable.",
      direction: "stable",
      relatedObjectIds: ["supplier"],
      confidence: 0.8,
      createdAt: 0,
    }],
  });

  assert.ok(score.driftIntensity < 0.25);
});
