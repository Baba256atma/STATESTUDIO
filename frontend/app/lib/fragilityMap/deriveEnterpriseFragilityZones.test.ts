import test from "node:test";
import assert from "node:assert/strict";

import {
  buildEnterpriseFragilityMapOverlayState,
  deriveEnterpriseFragilityZones,
} from "./deriveEnterpriseFragilityZones.ts";

const propagationHints = [
  { sourceObjectId: "supplier", targetObjectId: "inventory", propagationStrength: 0.9, propagationType: "dependency" as const },
  { sourceObjectId: "inventory", targetObjectId: "delivery", propagationStrength: 0.82, propagationType: "delay" as const },
];

const fragilityScores = [
  { objectId: "supplier", score: 88, level: "critical" as const },
  { objectId: "inventory", score: 72, level: "fragile" as const },
  { objectId: "delivery", score: 58, level: "fragile" as const },
];

const relationships = [
  {
    edgeId: "edge_supplier_inventory",
    sourceObjectId: "supplier",
    targetObjectId: "inventory",
    relationshipType: "dependency",
    meta: { semantic: "dependency" as const, strength: 0.9, directional: true },
    executiveExplanation: "Inventory depends on supplier stability.",
  },
  {
    edgeId: "edge_inventory_delivery",
    sourceObjectId: "inventory",
    targetObjectId: "delivery",
    relationshipType: "flow",
    meta: { semantic: "flow" as const, strength: 0.8, directional: true },
    executiveExplanation: "Delivery depends on inventory flow.",
  },
];

test("derives enterprise fragility zones from corridor and systemic evidence", () => {
  const zones = deriveEnterpriseFragilityZones({
    propagationHints,
    fragilityScores,
    relationships,
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
    monitoringSignals: [{
      id: "monitor_supplier",
      title: "Supplier monitoring",
      summary: "Supplier pressure remains active.",
      relatedObjectIds: ["supplier", "inventory"],
      monitoringStatus: "elevated",
      trend: "degrading",
      confidence: 0.78,
      urgencyScore: 0.72,
      domainId: "supply_chain",
      createdAt: 0,
    }],
    strategicMemory: [{
      id: "memory_supplier",
      category: "fragility",
      title: "Recurring supplier fragility",
      summary: "Supplier fragility remains recurring.",
      relatedObjectIds: ["supplier", "inventory"],
      severity: "high",
      confidence: 0.8,
      recurrenceCount: 3,
      firstObservedAt: 0,
      lastObservedAt: 0,
      domainId: "supply_chain",
    }],
  });

  assert.ok(zones.length > 0);
  assert.equal(zones[0].zoneType, "critical_corridor");
  assert.ok(zones[0].relatedObjectIds.includes("supplier"));
  assert.ok((zones[0].systemicReach ?? 0) > 0);
  assert.equal(zones[0].createdAt, 0);
});

test("enterprise fragility zones are deterministic and do not mutate input", () => {
  const input = {
    propagationHints,
    fragilityScores,
    relationships,
  };
  const before = JSON.stringify(input);
  const first = deriveEnterpriseFragilityZones(input);
  const second = deriveEnterpriseFragilityZones(input);

  assert.deepEqual(first, second);
  assert.equal(JSON.stringify(input), before);
});

test("fragility map overlay is passive and empty state is safe", () => {
  const zones = deriveEnterpriseFragilityZones({
    propagationHints,
    fragilityScores,
    relationships,
  });
  const overlay = buildEnterpriseFragilityMapOverlayState({ zones });
  const emptyOverlay = buildEnterpriseFragilityMapOverlayState({ zones: [] });

  assert.equal(overlay.topZoneId, zones[0].id);
  assert.ok(overlay.relatedObjectIds.includes("supplier"));
  assert.equal(emptyOverlay.zoneType, "isolated");
  assert.equal(emptyOverlay.systemicReach, 0);
});
