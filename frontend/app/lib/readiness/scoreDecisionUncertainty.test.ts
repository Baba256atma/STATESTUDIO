import assert from "node:assert/strict";
import test from "node:test";
import {
  scoreCoordinationReadiness,
  scoreDecisionUncertainty,
  scoreMonitoringMaturity,
} from "./scoreDecisionUncertainty.ts";

test("decision uncertainty rises with volatile forecast and propagation pressure", () => {
  const uncertainty = scoreDecisionUncertainty({
    relatedObjectIds: ["supplier", "delivery"],
    confidenceSignals: [{
      id: "confidence_supplier",
      confidenceLevel: "moderate",
      confidenceScore: 0.48,
      rationale: "Mixed evidence.",
      uncertaintyFactors: ["Propagation patterns remain volatile", "Monitoring history is too short"],
      createdAt: 0,
    }],
    forecasts: [{
      id: "forecast_volatile",
      title: "Volatile",
      summary: "Volatile.",
      direction: "volatile",
      relatedObjectIds: ["supplier", "delivery"],
      confidence: 0.62,
      createdAt: 0,
    }],
    fragilityZones: [{
      id: "zone_supplier",
      title: "Supplier zone",
      summary: "Supplier pressure.",
      zoneType: "critical_corridor",
      relatedObjectIds: ["supplier", "delivery"],
      propagationIntensity: 0.84,
      fragilityScore: 82,
      systemicReach: 0.8,
      createdAt: 0,
    }],
  });

  assert.ok(uncertainty > 0.55);
  assert.ok(uncertainty <= 1);
});

test("monitoring maturity and coordination readiness are stable and clamped", () => {
  const monitoring = scoreMonitoringMaturity({
    relatedObjectIds: ["supplier"],
    monitoringSignals: [{
      id: "monitoring_supplier",
      title: "Supplier monitoring",
      summary: "Stable.",
      relatedObjectIds: ["supplier"],
      monitoringStatus: "stable",
      trend: "improving",
      confidence: 0.8,
      urgencyScore: 0.15,
      createdAt: 0,
    }],
  });
  const coordination = scoreCoordinationReadiness({
    relatedObjectIds: ["supplier", "delivery"],
    coordinationInsights: [{
      id: "coordination_supplier",
      title: "Coordination",
      summary: "Coordination.",
      dependencyType: "operational_alignment",
      relatedObjectIds: ["supplier", "delivery"],
      coordinationComplexity: 0.2,
      synchronizationRisk: 0.16,
      createdAt: 0,
    }],
  });

  assert.ok(monitoring > 0.85);
  assert.ok(coordination > 0.75);
});
