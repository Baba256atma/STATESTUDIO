import assert from "node:assert/strict";
import test from "node:test";
import { detectAdaptationBottlenecks } from "./detectAdaptationBottlenecks.ts";

test("adaptation bottlenecks identify rigidity coordination monitoring and drift", () => {
  const bottlenecks = detectAdaptationBottlenecks({
    relatedObjectIds: ["supplier", "delivery"],
    fragilityZones: [{
      id: "zone_supplier",
      title: "Supplier zone",
      summary: "Supplier pressure.",
      zoneType: "critical_corridor",
      relatedObjectIds: ["supplier", "delivery"],
      propagationIntensity: 0.84,
      fragilityScore: 82,
      systemicReach: 0.78,
      createdAt: 0,
    }],
    coordinationInsights: [{
      id: "coordination_supplier",
      title: "Coordination pressure",
      summary: "Coordination pressure.",
      dependencyType: "cross_domain_sync",
      relatedObjectIds: ["supplier", "delivery"],
      coordinationComplexity: 0.7,
      synchronizationRisk: 0.66,
      createdAt: 0,
    }],
    monitoringSignals: [{
      id: "monitoring_supplier",
      title: "Monitoring degraded",
      summary: "Monitoring degraded.",
      relatedObjectIds: ["supplier", "delivery"],
      monitoringStatus: "elevated",
      trend: "degrading",
      confidence: 0.7,
      urgencyScore: 0.76,
      createdAt: 0,
    }],
    driftSignals: [{
      id: "drift_supplier",
      title: "Supplier drift",
      summary: "Supplier drift.",
      driftType: "stability_regression",
      relatedObjectIds: ["supplier", "delivery"],
      driftIntensity: 0.72,
      createdAt: 0,
    }],
  });

  assert.ok(bottlenecks.length >= 4);
  assert.ok(bottlenecks.some((item) => item.label === "Rigid dependency concentration"));
  assert.ok(bottlenecks.some((item) => item.label === "Coordination adaptation friction"));
});

test("adaptation bottlenecks stay quiet with stable adaptation evidence", () => {
  const bottlenecks = detectAdaptationBottlenecks({
    relatedObjectIds: ["supplier"],
    monitoringSignals: [{
      id: "monitoring_supplier",
      title: "Stable",
      summary: "Stable.",
      relatedObjectIds: ["supplier"],
      monitoringStatus: "stable",
      trend: "improving",
      confidence: 0.8,
      urgencyScore: 0.12,
      createdAt: 0,
    }],
  });

  assert.deepEqual(bottlenecks, []);
});
