import test from "node:test";
import assert from "node:assert/strict";

import { detectInterventionOpportunities } from "./detectInterventionOpportunities.ts";

test("detects intervention opportunities from zones monitoring memory and cross-domain pressure", () => {
  const opportunities = detectInterventionOpportunities({
    zones: [{
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
      category: "dependency",
      title: "Supplier dependency",
      summary: "Dependency recurs.",
      relatedObjectIds: ["supplier", "inventory"],
      recurrenceCount: 3,
      firstObservedAt: 0,
      lastObservedAt: 0,
      domainId: "supply_chain",
    }],
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
  });

  assert.ok(opportunities.some((item) => item.category === "contain_propagation"));
  assert.ok(opportunities.some((item) => item.category === "strengthen_monitoring"));
  assert.ok(opportunities.some((item) => item.category === "diversify"));
  assert.equal(new Set(opportunities.map((item) => item.id)).size, opportunities.length);
});

test("opportunity detection is deterministic and does not mutate input", () => {
  const input = {
    zones: [{
      id: "zone_supplier",
      title: "Critical corridor",
      summary: "Supplier corridor.",
      zoneType: "critical_corridor" as const,
      relatedObjectIds: ["supplier"],
      propagationIntensity: 0.7,
      fragilityScore: 70,
      systemicReach: 0.7,
      createdAt: 0,
    }],
  };
  const before = JSON.stringify(input);
  const first = detectInterventionOpportunities(input);
  const second = detectInterventionOpportunities(input);

  assert.deepEqual(first, second);
  assert.equal(JSON.stringify(input), before);
});
