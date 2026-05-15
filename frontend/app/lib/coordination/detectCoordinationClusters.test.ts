import test from "node:test";
import assert from "node:assert/strict";

import { detectCoordinationClusters } from "./detectCoordinationClusters.ts";

test("detects coordination clusters from cross-domain fragility and intervention sources", () => {
  const clusters = detectCoordinationClusters({
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
      domainIds: ["supply_chain", "retail"],
      createdAt: 0,
    }],
    interventions: [{
      id: "intervention_supplier",
      title: "Contain propagation",
      summary: "Contain propagation.",
      category: "contain_propagation",
      relatedObjectIds: ["supplier", "inventory", "delivery"],
      priority: "high",
      domainIds: ["supply_chain", "retail"],
      createdAt: 0,
    }],
  });

  assert.equal(clusters.length, 1);
  assert.ok(clusters[0].relatedDomainIds.includes("supply_chain"));
  assert.ok(clusters[0].coordinationComplexity > 0);
});

test("coordination cluster detection is deterministic and does not mutate input", () => {
  const input = {
    fragilityZones: [{
      id: "zone_supplier",
      title: "Critical corridor",
      summary: "Supplier corridor.",
      zoneType: "critical_corridor" as const,
      relatedObjectIds: ["supplier", "inventory"],
      propagationIntensity: 0.7,
      fragilityScore: 70,
      createdAt: 0,
    }],
  };
  const before = JSON.stringify(input);
  const first = detectCoordinationClusters(input);
  const second = detectCoordinationClusters(input);

  assert.deepEqual(first, second);
  assert.equal(JSON.stringify(input), before);
});
