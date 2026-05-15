import test from "node:test";
import assert from "node:assert/strict";

import {
  classifyFragilityZone,
  scoreSystemicFragilityReach,
} from "./scoreSystemicFragilityReach.ts";

test("systemic fragility reach is stable and clamped", () => {
  const score = scoreSystemicFragilityReach({
    relatedObjectIds: ["supplier", "inventory", "delivery"],
    propagationHints: [
      { sourceObjectId: "supplier", targetObjectId: "inventory", propagationStrength: 0.9, propagationType: "dependency" },
      { sourceObjectId: "inventory", targetObjectId: "delivery", propagationStrength: 0.82, propagationType: "delay" },
    ],
    fragilityScores: [
      { objectId: "supplier", score: 88, level: "critical" },
      { objectId: "inventory", score: 72, level: "fragile" },
    ],
    crossDomainInsights: [{
      id: "cross_supplier_delivery",
      sourceDomainId: "supply_chain",
      targetDomainId: "retail",
      relationshipType: "delivery_impact",
      title: "Supply Chain -> Retail",
      summary: "Supplier instability affects delivery.",
      relatedObjectIds: ["supplier", "inventory", "delivery"],
      severity: "high",
      confidence: 0.74,
      createdAt: 0,
    }],
  });

  assert.ok(score >= 0);
  assert.ok(score <= 1);
  assert.ok(score > 0.45);
});

test("fragility heat classification distinguishes critical corridors", () => {
  assert.equal(classifyFragilityZone({
    relatedObjectCount: 3,
    propagationIntensity: 0.82,
    fragilityScore: 78,
    systemicReach: 0.66,
    corridorDetected: true,
    domainCount: 2,
  }), "critical_corridor");

  assert.equal(classifyFragilityZone({
    relatedObjectCount: 1,
    propagationIntensity: 0.1,
    fragilityScore: 18,
    systemicReach: 0.1,
  }), "isolated");
});
