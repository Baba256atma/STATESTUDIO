import assert from "node:assert/strict";
import test from "node:test";
import {
  buildExecutiveDecisionReadinessOverlayState,
  deriveExecutiveDecisionReadiness,
} from "./deriveExecutiveDecisionReadiness.ts";

test("decision readiness derives ready-for-review from stable evidence", () => {
  const readiness = deriveExecutiveDecisionReadiness({
    recommendations: [{
      id: "recommendation_supplier",
      title: "Reduce supplier dependency",
      summary: "Reduce dependency concentration.",
      category: "diversify",
      rationale: "Dependency concentration remains important.",
      affectedObjectIds: ["supplier", "delivery"],
      confidence: 0.84,
      priority: "high",
      domainId: "supply_chain",
      createdAt: 0,
    }],
    confidenceSignals: [{
      id: "confidence_supplier",
      relatedRecommendationId: "recommendation_supplier",
      confidenceLevel: "high",
      confidenceScore: 0.84,
      rationale: "Stable evidence.",
      createdAt: 0,
    }],
    monitoringSignals: [{
      id: "monitoring_supplier",
      title: "Stable monitoring",
      summary: "Stable monitoring.",
      relatedObjectIds: ["supplier", "delivery"],
      monitoringStatus: "stable",
      trend: "improving",
      confidence: 0.82,
      urgencyScore: 0.16,
      domainId: "supply_chain",
      createdAt: 0,
    }],
    coordinationInsights: [{
      id: "coordination_supplier",
      title: "Coordination stable",
      summary: "Coordination stable.",
      dependencyType: "operational_alignment",
      relatedObjectIds: ["supplier", "delivery"],
      coordinationComplexity: 0.18,
      synchronizationRisk: 0.14,
      relatedDomainIds: ["supply_chain"],
      createdAt: 0,
    }],
    resilienceSignals: [{
      id: "resilience_supplier",
      title: "Adaptive resilience",
      summary: "Adaptive resilience.",
      resilienceState: "adaptive",
      relatedObjectIds: ["supplier", "delivery"],
      resilienceScore: 0.7,
      domainIds: ["supply_chain"],
      createdAt: 0,
    }],
  });

  assert.equal(readiness.length, 1);
  assert.ok(["ready_for_review", "ready"].includes(readiness[0].readinessState));
  assert.equal(readiness[0].blockers, undefined);
  assert.ok((readiness[0].confidenceScore ?? 0) > 0.8);
});

test("decision readiness remains limited when uncertainty and blockers are active", () => {
  const readiness = deriveExecutiveDecisionReadiness({
    recommendations: [{
      id: "recommendation_supplier",
      title: "Reduce supplier dependency",
      summary: "Reduce dependency concentration.",
      category: "diversify",
      rationale: "Dependency concentration remains important.",
      affectedObjectIds: ["supplier", "delivery"],
      confidence: 0.42,
      priority: "high",
      domainId: "supply_chain",
      createdAt: 0,
    }],
    confidenceSignals: [{
      id: "confidence_supplier",
      relatedRecommendationId: "recommendation_supplier",
      confidenceLevel: "low",
      confidenceScore: 0.32,
      rationale: "Mixed evidence.",
      uncertaintyFactors: ["Propagation patterns remain volatile", "Monitoring history is too short"],
      createdAt: 0,
    }],
    forecasts: [{
      id: "forecast_volatile",
      title: "Volatile forecast",
      summary: "Volatile forecast.",
      direction: "volatile",
      relatedObjectIds: ["supplier", "delivery"],
      confidence: 0.58,
      createdAt: 0,
    }],
    fragilityZones: [{
      id: "zone_supplier",
      title: "Supplier corridor",
      summary: "Supplier pressure.",
      zoneType: "critical_corridor",
      relatedObjectIds: ["supplier", "delivery"],
      propagationIntensity: 0.84,
      fragilityScore: 86,
      systemicReach: 0.8,
      createdAt: 0,
    }],
  });

  assert.equal(readiness.length, 1);
  assert.ok(["not_ready", "limited", "developing"].includes(readiness[0].readinessState));
  assert.ok((readiness[0].blockers?.length ?? 0) >= 2);
  assert.match(readiness[0].summary, /uncertainty|evidence|readiness/i);
});

test("decision readiness derivation is deterministic and does not mutate input", () => {
  const params = {
    monitoringSignals: [{
      id: "monitoring_database",
      title: "Database monitoring",
      summary: "Database stable.",
      relatedObjectIds: ["database", "service"],
      monitoringStatus: "stable" as const,
      trend: "stable" as const,
      confidence: 0.78,
      urgencyScore: 0.2,
      createdAt: 0,
    }],
    forecasts: [{
      id: "forecast_database",
      title: "Database stable",
      summary: "Database stable.",
      direction: "stable" as const,
      relatedObjectIds: ["database", "service"],
      confidence: 0.76,
      createdAt: 0,
    }],
  };
  const before = JSON.stringify(params);

  const first = deriveExecutiveDecisionReadiness(params);
  const second = deriveExecutiveDecisionReadiness(params);

  assert.deepEqual(first, second);
  assert.equal(JSON.stringify(params), before);
});

test("decision readiness overlay is passive and empty state is safe", () => {
  const empty = buildExecutiveDecisionReadinessOverlayState({ readiness: [] });
  assert.equal(empty.readinessState, "developing");
  assert.equal(empty.blockerCount, 0);

  const overlay = buildExecutiveDecisionReadinessOverlayState({
    readiness: [{
      id: "readiness_ready_supplier",
      title: "Decision Readiness Ready: supplier",
      summary: "Operational evidence appears sufficiently mature.",
      readinessState: "ready",
      relatedObjectIds: ["supplier"],
      createdAt: 0,
    }],
  });

  assert.equal(overlay.topReadinessId, "readiness_ready_supplier");
  assert.equal(overlay.readinessState, "ready");
});
