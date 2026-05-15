import test from "node:test";
import assert from "node:assert/strict";

import { deriveSynchronizationRisk } from "./deriveSynchronizationRisk.ts";

test("synchronization risk surfaces degrading monitoring and unresolved zones", () => {
  const risk = deriveSynchronizationRisk({
    relatedObjectIds: ["supplier", "inventory", "delivery"],
    monitoringSignals: [{
      id: "monitor_supplier",
      title: "Supplier monitoring",
      summary: "Supplier pressure elevated.",
      relatedObjectIds: ["supplier", "inventory"],
      monitoringStatus: "elevated",
      trend: "degrading",
      confidence: 0.78,
      urgencyScore: 0.8,
      createdAt: 0,
    }],
    fragilityZones: [{
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
  });

  assert.ok(risk > 0.25);
  assert.ok(risk <= 1);
});
