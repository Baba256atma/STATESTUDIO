import assert from "node:assert/strict";
import test from "node:test";
import {
  buildEnterpriseAdaptationOverlayState,
  deriveEnterpriseAdaptationSignals,
} from "./deriveEnterpriseAdaptation.ts";

test("enterprise adaptation derives adaptive signal from flexibility evidence", () => {
  const signals = deriveEnterpriseAdaptationSignals({
    resilienceSignals: [{
      id: "resilience_supplier",
      title: "Adaptive resilience",
      summary: "Adaptive resilience.",
      resilienceState: "adaptive",
      relatedObjectIds: ["supplier", "inventory", "delivery"],
      resilienceScore: 0.72,
      adaptationCapacity: 0.76,
      domainIds: ["supply_chain"],
      createdAt: 0,
    }],
    interventions: [{
      id: "intervention_diversify",
      title: "Diversify supplier",
      summary: "Diversify supplier pathway.",
      category: "diversify",
      relatedObjectIds: ["supplier", "inventory", "delivery"],
      propagationReductionPotential: 0.76,
      priority: "high",
      domainIds: ["supply_chain"],
      createdAt: 0,
    }],
    coordinationInsights: [{
      id: "coordination_supplier",
      title: "Coordination stable",
      summary: "Coordination stable.",
      dependencyType: "operational_alignment",
      relatedObjectIds: ["supplier", "inventory", "delivery"],
      coordinationComplexity: 0.18,
      synchronizationRisk: 0.16,
      relatedDomainIds: ["supply_chain"],
      createdAt: 0,
    }],
    monitoringSignals: [{
      id: "monitoring_supplier",
      title: "Monitoring improving",
      summary: "Monitoring improving.",
      relatedObjectIds: ["supplier", "inventory", "delivery"],
      monitoringStatus: "stable",
      trend: "improving",
      confidence: 0.8,
      urgencyScore: 0.16,
      createdAt: 0,
    }],
    forecasts: [{
      id: "forecast_improving",
      title: "Improving",
      summary: "Improving.",
      direction: "improving",
      relatedObjectIds: ["supplier", "inventory", "delivery"],
      confidence: 0.82,
      domainIds: ["supply_chain"],
      createdAt: 0,
    }],
  });

  assert.equal(signals.length, 1);
  assert.ok(["adjusting", "adaptive", "evolving"].includes(signals[0].adaptationState));
  assert.ok((signals[0].flexibilityScore ?? 0) > 0.45);
  assert.match(signals[0].summary, /adapt|flexibility|adjusting|coordination/i);
});

test("enterprise adaptation surfaces rigid state from unresolved bottlenecks", () => {
  const signals = deriveEnterpriseAdaptationSignals({
    fragilityZones: [{
      id: "zone_supplier",
      title: "Supplier zone",
      summary: "Supplier pressure.",
      zoneType: "critical_corridor",
      relatedObjectIds: ["supplier", "delivery"],
      propagationIntensity: 0.86,
      fragilityScore: 88,
      systemicReach: 0.82,
      domainIds: ["supply_chain"],
      createdAt: 0,
    }],
    driftSignals: [{
      id: "drift_supplier",
      title: "Supplier drift",
      summary: "Supplier drift.",
      driftType: "propagation_expansion",
      relatedObjectIds: ["supplier", "delivery"],
      driftIntensity: 0.82,
      domainIds: ["supply_chain"],
      createdAt: 0,
    }],
  });

  assert.equal(signals.length, 1);
  assert.equal(signals[0].adaptationState, "rigid");
  assert.match(signals[0].recommendedFocus ?? "", /rigid|flexibility|dependency/i);
});

test("enterprise adaptation derivation is deterministic and does not mutate input", () => {
  const params = {
    forecasts: [{
      id: "forecast_stable",
      title: "Stable",
      summary: "Stable.",
      direction: "stable" as const,
      relatedObjectIds: ["database", "service"],
      confidence: 0.78,
      createdAt: 0,
    }],
    decisionReviews: [{
      id: "review_database",
      title: "Database stabilized",
      summary: "Database stabilized.",
      relatedObjectIds: ["database", "service"],
      reviewStatus: "stabilized" as const,
      confidence: 0.8,
      createdAt: 0,
    }],
  };
  const before = JSON.stringify(params);

  const first = deriveEnterpriseAdaptationSignals(params);
  const second = deriveEnterpriseAdaptationSignals(params);

  assert.deepEqual(first, second);
  assert.equal(JSON.stringify(params), before);
});

test("enterprise adaptation overlay is passive and empty state is safe", () => {
  const empty = buildEnterpriseAdaptationOverlayState({ signals: [] });
  assert.equal(empty.adaptationState, "adjusting");
  assert.equal(empty.bottleneckCount, 0);

  const overlay = buildEnterpriseAdaptationOverlayState({
    signals: [{
      id: "enterprise_adaptation_adaptive_supplier",
      title: "Adaptive Adaptation: supplier",
      summary: "Operational coordination is adapting.",
      adaptationState: "adaptive",
      relatedObjectIds: ["supplier"],
      createdAt: 0,
    }],
  });

  assert.equal(overlay.topSignalId, "enterprise_adaptation_adaptive_supplier");
  assert.equal(overlay.adaptationState, "adaptive");
});
