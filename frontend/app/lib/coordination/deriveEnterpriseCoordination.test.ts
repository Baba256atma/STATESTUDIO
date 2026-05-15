import test from "node:test";
import assert from "node:assert/strict";

import {
  buildEnterpriseCoordinationOverlayState,
  deriveEnterpriseCoordinationInsights,
} from "./deriveEnterpriseCoordination.ts";

const crossDomainInsight = {
  id: "cross_supplier",
  sourceDomainId: "supply_chain",
  targetDomainId: "retail",
  relationshipType: "delivery_impact" as const,
  title: "Supply Chain -> Retail",
  summary: "Delivery impact.",
  relatedObjectIds: ["supplier", "inventory", "delivery"],
  severity: "high" as const,
  confidence: 0.75,
  createdAt: 0,
};

const fragilityZone = {
  id: "zone_supplier",
  title: "Critical corridor",
  summary: "Supplier corridor.",
  zoneType: "critical_corridor" as const,
  relatedObjectIds: ["supplier", "inventory", "delivery"],
  propagationIntensity: 0.86,
  fragilityScore: 78,
  systemicReach: 0.74,
  domainIds: ["supply_chain", "retail"],
  createdAt: 0,
};

test("derives enterprise coordination insights from cross-domain corridor evidence", () => {
  const insights = deriveEnterpriseCoordinationInsights({
    crossDomainInsights: [crossDomainInsight],
    fragilityZones: [fragilityZone],
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
    monitoringSignals: [{
      id: "monitor_supplier",
      title: "Supplier monitoring",
      summary: "Supplier pressure elevated.",
      relatedObjectIds: ["supplier", "inventory"],
      monitoringStatus: "elevated",
      trend: "degrading",
      confidence: 0.78,
      urgencyScore: 0.8,
      domainId: "supply_chain",
      createdAt: 0,
    }],
  });

  assert.ok(insights.length > 0);
  assert.equal(insights[0].dependencyType, "cross_domain_sync");
  assert.ok(insights[0].coordinationComplexity && insights[0].coordinationComplexity > 0);
  assert.ok(insights[0].synchronizationRisk && insights[0].synchronizationRisk > 0);
  assert.match(insights[0].recommendedFocus ?? "", /Coordinate|Align/);
  assert.equal(insights[0].createdAt, 0);
});

test("enterprise coordination derivation is deterministic and does not mutate input", () => {
  const input = {
    crossDomainInsights: [crossDomainInsight],
    fragilityZones: [fragilityZone],
  };
  const before = JSON.stringify(input);
  const first = deriveEnterpriseCoordinationInsights(input);
  const second = deriveEnterpriseCoordinationInsights(input);

  assert.deepEqual(first, second);
  assert.equal(JSON.stringify(input), before);
});

test("coordination overlay is passive and empty state is safe", () => {
  const insights = deriveEnterpriseCoordinationInsights({
    crossDomainInsights: [crossDomainInsight],
    fragilityZones: [fragilityZone],
  });
  const overlay = buildEnterpriseCoordinationOverlayState({ insights });
  const emptyOverlay = buildEnterpriseCoordinationOverlayState({ insights: [] });

  assert.equal(overlay.topInsightId, insights[0].id);
  assert.ok(overlay.relatedObjectIds.includes("supplier"));
  assert.equal(emptyOverlay.dependencyType, "operational_alignment");
  assert.equal(emptyOverlay.coordinationComplexity, 0);
});
