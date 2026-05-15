import assert from "node:assert/strict";
import test from "node:test";
import { deriveAdaptationCapacity } from "./deriveAdaptationCapacity.ts";

test("adaptation capacity increases with diversification monitoring and improving forecast", () => {
  const score = deriveAdaptationCapacity({
    relatedObjectIds: ["supplier", "delivery"],
    interventions: [{
      id: "intervention_diversify",
      title: "Diversify supplier path",
      summary: "Reduce supplier concentration.",
      category: "diversify",
      relatedObjectIds: ["supplier", "delivery"],
      propagationReductionPotential: 0.72,
      priority: "high",
      createdAt: 0,
    }],
    monitoringSignals: [{
      id: "monitoring_stable",
      title: "Monitoring stable",
      summary: "Monitoring stable.",
      relatedObjectIds: ["supplier", "delivery"],
      monitoringStatus: "stable",
      trend: "improving",
      confidence: 0.82,
      urgencyScore: 0.2,
      createdAt: 0,
    }],
    forecasts: [{
      id: "forecast_improving",
      title: "Improving",
      summary: "Improving.",
      direction: "improving",
      relatedObjectIds: ["supplier", "delivery"],
      confidence: 0.8,
      createdAt: 0,
    }],
  });

  assert.ok(score > 0.6);
  assert.ok(score <= 1);
});

test("adaptation capacity is reduced by recurring strategic pressure", () => {
  const score = deriveAdaptationCapacity({
    relatedObjectIds: ["supplier"],
    strategicMemory: [{
      id: "memory_supplier",
      category: "fragility",
      title: "Supplier recurrence",
      summary: "Repeated supplier pressure.",
      relatedObjectIds: ["supplier"],
      recurrenceCount: 5,
      firstObservedAt: 0,
      lastObservedAt: 0,
    }],
  });

  assert.ok(score < 0.3);
});
