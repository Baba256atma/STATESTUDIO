import test from "node:test";
import assert from "node:assert/strict";

import { scoreCoordinationComplexity } from "./scoreCoordinationComplexity.ts";

test("coordination complexity scoring is stable and clamped", () => {
  const score = scoreCoordinationComplexity({
    relatedObjectIds: ["supplier", "inventory", "delivery"],
    relatedDomainIds: ["supply_chain", "retail"],
    crossDomainInsights: [{
      id: "cross_supplier",
      sourceDomainId: "supply_chain",
      targetDomainId: "retail",
      relationshipType: "delivery_impact",
      title: "Supply Chain -> Retail",
      summary: "Delivery impact.",
      relatedObjectIds: ["supplier", "inventory", "delivery"],
      severity: "high",
      confidence: 0.75,
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

  assert.ok(score >= 0);
  assert.ok(score <= 1);
  assert.ok(score > 0.3);
});
