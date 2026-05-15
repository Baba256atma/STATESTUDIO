import test from "node:test";
import assert from "node:assert/strict";

import {
  interventionPriorityFromImpact,
  scoreInterventionImpact,
} from "./scoreInterventionImpact.ts";

test("intervention impact scoring is stable and clamped", () => {
  const score = scoreInterventionImpact({
    category: "contain_propagation",
    targetZones: [{
      id: "zone_supplier",
      title: "Critical corridor",
      summary: "Supplier corridor.",
      zoneType: "critical_corridor",
      relatedObjectIds: ["supplier", "inventory", "delivery"],
      propagationIntensity: 0.86,
      fragilityScore: 78,
      systemicReach: 0.74,
      createdAt: 0,
    }],
    monitoringSignals: [{
      id: "monitor_supplier",
      title: "Supplier monitoring",
      summary: "Supplier pressure remains active.",
      relatedObjectIds: ["supplier"],
      monitoringStatus: "elevated",
      trend: "degrading",
      confidence: 0.78,
      urgencyScore: 0.72,
      createdAt: 0,
    }],
  });

  assert.ok(score >= 0);
  assert.ok(score <= 1);
  assert.ok(score > 0.55);
  assert.equal(interventionPriorityFromImpact(0.8), "critical");
  assert.equal(interventionPriorityFromImpact(0.2), "low");
});
