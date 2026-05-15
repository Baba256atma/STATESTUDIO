import test from "node:test";
import assert from "node:assert/strict";

import { scoreStabilityDirection } from "./scoreStabilityDirection.ts";

test("stability direction scoring identifies degrading pressure", () => {
  const score = scoreStabilityDirection({
    timelineIntelligence: [{
      id: "timeline_supplier",
      title: "Supplier degradation",
      summary: "Supplier pressure degrading.",
      relatedObjectIds: ["supplier"],
      trend: "degrading",
      momentumScore: 0.86,
      confidence: 0.8,
      createdAt: 0,
    }],
    monitoringSignals: [{
      id: "monitor_supplier",
      title: "Supplier monitoring",
      summary: "Supplier pressure elevated.",
      relatedObjectIds: ["supplier"],
      monitoringStatus: "elevated",
      confidence: 0.78,
      urgencyScore: 0.8,
      createdAt: 0,
    }],
    fragilityZones: [{
      id: "zone_supplier",
      title: "Critical corridor",
      summary: "Critical corridor.",
      zoneType: "critical_corridor",
      relatedObjectIds: ["supplier", "inventory"],
      propagationIntensity: 0.84,
      fragilityScore: 82,
      systemicReach: 0.74,
      createdAt: 0,
    }],
  });

  assert.equal(score.direction, "degrading");
  assert.ok(score.confidence > 0);
  assert.ok(score.confidence <= 1);
});

test("stability direction scoring identifies improving conditions", () => {
  const score = scoreStabilityDirection({
    interventions: [{
      id: "intervention_supplier",
      title: "Reduce supplier concentration",
      summary: "Reduce concentration.",
      category: "reduce_dependency",
      relatedObjectIds: ["supplier"],
      propagationReductionPotential: 0.82,
      priority: "high",
      createdAt: 0,
    }],
    decisionReviews: [{
      id: "review_supplier",
      title: "Supplier review stabilized",
      summary: "Supplier pressure stabilized.",
      reviewStatus: "stabilized",
      createdAt: 0,
    }],
  });

  assert.equal(score.direction, "improving");
});
