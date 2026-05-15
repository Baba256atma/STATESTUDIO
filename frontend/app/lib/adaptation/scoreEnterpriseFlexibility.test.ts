import assert from "node:assert/strict";
import test from "node:test";
import {
  adaptationStateFromScore,
  scoreEnterpriseFlexibility,
} from "./scoreEnterpriseFlexibility.ts";

test("enterprise flexibility scoring increases with diversification coordination and recovery evidence", () => {
  const score = scoreEnterpriseFlexibility({
    relatedObjectIds: ["supplier", "delivery"],
    interventions: [{
      id: "intervention_diversify",
      title: "Diversify supplier",
      summary: "Diversify supplier pathway.",
      category: "diversify",
      relatedObjectIds: ["supplier", "delivery"],
      propagationReductionPotential: 0.76,
      priority: "high",
      createdAt: 0,
    }],
    coordinationInsights: [{
      id: "coordination_supplier",
      title: "Coordination stable",
      summary: "Coordination stable.",
      dependencyType: "operational_alignment",
      relatedObjectIds: ["supplier", "delivery"],
      coordinationComplexity: 0.18,
      synchronizationRisk: 0.14,
      createdAt: 0,
    }],
    monitoringSignals: [{
      id: "monitoring_supplier",
      title: "Supplier monitoring",
      summary: "Supplier monitoring.",
      relatedObjectIds: ["supplier", "delivery"],
      monitoringStatus: "stable",
      trend: "improving",
      confidence: 0.82,
      urgencyScore: 0.16,
      createdAt: 0,
    }],
    forecasts: [{
      id: "forecast_improving",
      title: "Improving",
      summary: "Improving.",
      direction: "improving",
      relatedObjectIds: ["supplier", "delivery"],
      confidence: 0.82,
      createdAt: 0,
    }],
  });

  assert.ok(score.flexibilityScore > 0.55);
  assert.ok(score.adaptationCapacity > 0.6);
  assert.ok(["adjusting", "adaptive", "evolving"].includes(score.adaptationState));
});

test("enterprise flexibility scoring penalizes drift and rigid fragility", () => {
  const score = scoreEnterpriseFlexibility({
    relatedObjectIds: ["supplier", "delivery"],
    fragilityZones: [{
      id: "zone_supplier",
      title: "Supplier zone",
      summary: "Supplier pressure.",
      zoneType: "critical_corridor",
      relatedObjectIds: ["supplier", "delivery"],
      propagationIntensity: 0.88,
      fragilityScore: 88,
      systemicReach: 0.82,
      createdAt: 0,
    }],
    driftSignals: [{
      id: "drift_supplier",
      title: "Supplier drift",
      summary: "Supplier drift.",
      driftType: "propagation_expansion",
      relatedObjectIds: ["supplier", "delivery"],
      driftIntensity: 0.82,
      createdAt: 0,
    }],
  });

  assert.equal(score.adaptationState, "rigid");
});

test("adaptation state bands are deterministic", () => {
  assert.equal(adaptationStateFromScore(0.9), "evolving");
  assert.equal(adaptationStateFromScore(0.7), "adaptive");
  assert.equal(adaptationStateFromScore(0.5), "adjusting");
  assert.equal(adaptationStateFromScore(0.35), "strained");
  assert.equal(adaptationStateFromScore(0.1), "rigid");
});
