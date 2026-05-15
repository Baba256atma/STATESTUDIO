import assert from "node:assert/strict";
import test from "node:test";
import {
  resilienceStateFromScore,
  scoreOrganizationalResilience,
} from "./scoreOrganizationalResilience.ts";

test("organizational resilience scoring is stable and clamped", () => {
  const score = scoreOrganizationalResilience({
    relatedObjectIds: ["supplier", "delivery"],
    adaptationCapacity: 0.78,
    monitoringSignals: [{
      id: "monitoring_stable",
      title: "Stable monitoring",
      summary: "Monitoring stable.",
      relatedObjectIds: ["supplier", "delivery"],
      monitoringStatus: "stable",
      trend: "improving",
      confidence: 0.8,
      urgencyScore: 0.18,
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
    interventions: [{
      id: "intervention_reduce_dependency",
      title: "Reduce dependency",
      summary: "Reduce dependency.",
      category: "reduce_dependency",
      relatedObjectIds: ["supplier", "delivery"],
      propagationReductionPotential: 0.72,
      priority: "high",
      createdAt: 0,
    }],
  });

  assert.ok(score.resilienceScore > 0.45);
  assert.ok(score.resilienceScore <= 1);
  assert.ok(score.recoveryCapacity > 0.6);
  assert.ok(["stable", "adaptive", "resilient"].includes(score.resilienceState));
});

test("organizational resilience scoring penalizes unresolved drift and fragility", () => {
  const score = scoreOrganizationalResilience({
    relatedObjectIds: ["supplier", "delivery"],
    adaptationCapacity: 0.3,
    fragilityZones: [{
      id: "zone_supplier",
      title: "Supplier corridor",
      summary: "Supplier pressure.",
      zoneType: "critical_corridor",
      relatedObjectIds: ["supplier", "delivery"],
      propagationIntensity: 0.86,
      fragilityScore: 86,
      systemicReach: 0.8,
      createdAt: 0,
    }],
    driftSignals: [{
      id: "drift_supplier",
      title: "Supplier drift",
      summary: "Supplier drift.",
      driftType: "propagation_expansion",
      relatedObjectIds: ["supplier", "delivery"],
      driftIntensity: 0.8,
      createdAt: 0,
    }],
  });

  assert.equal(score.resilienceState, "fragile");
});

test("resilience state bands are deterministic", () => {
  assert.equal(resilienceStateFromScore(0.9), "resilient");
  assert.equal(resilienceStateFromScore(0.7), "adaptive");
  assert.equal(resilienceStateFromScore(0.55), "stable");
  assert.equal(resilienceStateFromScore(0.4), "recovering");
  assert.equal(resilienceStateFromScore(0.2), "fragile");
});
