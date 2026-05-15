import test from "node:test";
import assert from "node:assert/strict";

import {
  buildExecutiveStabilityForecastOverlayState,
  deriveExecutiveStabilityForecast,
} from "./deriveExecutiveStabilityForecast.ts";

test("derives degrading stability forecast from unresolved pressure", () => {
  const forecast = deriveExecutiveStabilityForecast({
    timelineIntelligence: [{
      id: "timeline_supplier",
      title: "Supplier degradation",
      summary: "Supplier pressure degrading.",
      relatedObjectIds: ["supplier", "inventory"],
      trend: "degrading",
      momentumScore: 0.86,
      confidence: 0.8,
      recommendedAttention: "Supplier dependency",
      domainId: "supply_chain",
      createdAt: 0,
    }],
    monitoringSignals: [{
      id: "monitor_supplier",
      title: "Supplier monitoring",
      summary: "Supplier pressure elevated.",
      relatedObjectIds: ["supplier", "inventory"],
      monitoringStatus: "elevated",
      confidence: 0.78,
      urgencyScore: 0.8,
      recommendedAttention: "Watch supplier-to-inventory propagation",
      domainId: "supply_chain",
      createdAt: 0,
    }],
    fragilityZones: [{
      id: "zone_supplier",
      title: "Critical supplier corridor",
      summary: "Supplier corridor.",
      zoneType: "critical_corridor",
      relatedObjectIds: ["supplier", "inventory", "delivery"],
      propagationIntensity: 0.84,
      fragilityScore: 82,
      systemicReach: 0.74,
      domainIds: ["supply_chain"],
      createdAt: 0,
    }],
  });

  assert.ok(forecast);
  assert.equal(forecast.direction, "degrading");
  assert.match(forecast.summary, /under pressure/);
  assert.ok(forecast.relatedZoneIds?.includes("zone_supplier"));
  assert.equal(forecast.createdAt, 0);
});

test("derives improving stability forecast from intervention relief and stabilized review", () => {
  const forecast = deriveExecutiveStabilityForecast({
    interventions: [{
      id: "intervention_supplier",
      title: "Reduce supplier concentration",
      summary: "Reduce concentration.",
      category: "reduce_dependency",
      relatedObjectIds: ["supplier"],
      propagationReductionPotential: 0.84,
      priority: "high",
      domainIds: ["supply_chain"],
      createdAt: 0,
    }],
    decisionReviews: [{
      id: "review_supplier",
      title: "Supplier review stabilized",
      summary: "Supplier pressure stabilized.",
      relatedObjectIds: ["supplier"],
      relatedRecommendationIds: ["rec_supplier"],
      reviewStatus: "stabilized",
      confidence: 0.82,
      createdAt: 0,
    }],
  });

  assert.ok(forecast);
  assert.equal(forecast.direction, "improving");
  assert.ok(forecast.relatedRecommendationIds?.includes("rec_supplier"));
});

test("forecast marks conflicting volatile evidence as uncertain", () => {
  const forecast = deriveExecutiveStabilityForecast({
    timelineIntelligence: [{
      id: "timeline_supplier",
      title: "Volatile supplier pressure",
      summary: "Supplier pressure volatile.",
      relatedObjectIds: ["supplier"],
      trend: "volatile",
      momentumScore: 0.58,
      confidence: 0.5,
      createdAt: 0,
    }],
    confidenceSignals: [{
      id: "confidence_supplier",
      confidenceLevel: "low",
      confidenceScore: 0.28,
      rationale: "Evidence mixed.",
      createdAt: 0,
    }],
  });

  assert.ok(forecast);
  assert.equal(forecast.direction, "uncertain");
  assert.ok(forecast.uncertaintyFactors?.length);
});

test("forecast stability guard avoids minor direction flicker", () => {
  const previousForecast = {
    id: "previous",
    title: "Supplier stability is expected to remain steady in the near term.",
    summary: "Stable.",
    direction: "stable" as const,
    relatedObjectIds: ["supplier"],
    confidence: 0.62,
    monitoringFocus: "Supplier dependency",
    createdAt: 0,
  };
  const forecast = deriveExecutiveStabilityForecast({
    previousForecast,
    monitoringSignals: [{
      id: "monitor_supplier",
      title: "Supplier monitoring",
      summary: "Supplier pressure watch.",
      relatedObjectIds: ["supplier"],
      monitoringStatus: "watch",
      confidence: 0.64,
      urgencyScore: 0.42,
      recommendedAttention: "Supplier dependency",
      createdAt: 0,
    }],
  });

  assert.ok(forecast);
  assert.equal(forecast.direction, "stable");
});

test("forecast derivation is deterministic and overlay is passive", () => {
  const input = {
    monitoringSignals: [{
      id: "monitor_supplier",
      title: "Supplier monitoring",
      summary: "Supplier pressure elevated.",
      relatedObjectIds: ["supplier"],
      monitoringStatus: "elevated" as const,
      confidence: 0.78,
      urgencyScore: 0.8,
      createdAt: 0,
    }],
  };
  const before = JSON.stringify(input);
  const first = deriveExecutiveStabilityForecast(input);
  const second = deriveExecutiveStabilityForecast(input);
  const overlay = buildExecutiveStabilityForecastOverlayState({ forecast: first });
  const emptyOverlay = buildExecutiveStabilityForecastOverlayState({ forecast: null });

  assert.deepEqual(first, second);
  assert.equal(JSON.stringify(input), before);
  assert.equal(overlay.topForecastId, first?.id);
  assert.equal(emptyOverlay.direction, "uncertain");
});
