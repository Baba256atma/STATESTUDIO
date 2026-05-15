import test from "node:test";
import assert from "node:assert/strict";

import {
  buildDecisionReviewOverlayState,
  deriveDecisionReviews,
} from "./deriveDecisionReviews.ts";

const previousRecommendation = {
  id: "rec_supplier_diversify",
  title: "Reduce Supplier Dependency",
  summary: "Reduce supplier dependency.",
  category: "diversify" as const,
  rationale: "Supplier dependency is elevated.",
  recommendedFocus: "Supplier diversification",
  affectedObjectIds: ["supplier", "inventory"],
  relatedScenarioIds: ["scenario_supplier"],
  confidence: 0.68,
  priority: "critical" as const,
  domainId: "supply_chain",
  createdAt: 0,
};

const currentRecommendation = {
  id: "rec_supplier_monitor",
  title: "Strengthen Supplier Monitoring",
  summary: "Strengthen monitoring.",
  category: "monitor" as const,
  rationale: "Supplier pressure is stabilizing but requires visibility.",
  recommendedFocus: "Supplier monitoring",
  affectedObjectIds: ["supplier", "inventory"],
  relatedScenarioIds: ["scenario_supplier"],
  confidence: 0.84,
  priority: "medium" as const,
  domainId: "supply_chain",
  createdAt: 0,
};

test("derives decision review records from changed strategic evidence", () => {
  const records = deriveDecisionReviews({
    previousRecommendations: [previousRecommendation],
    currentRecommendations: [currentRecommendation],
    previousMonitoringSignals: [{
      id: "monitor_old",
      title: "Supplier monitoring",
      summary: "Supplier pressure elevated.",
      relatedObjectIds: ["supplier", "inventory"],
      monitoringStatus: "elevated",
      confidence: 0.68,
      urgencyScore: 0.8,
      createdAt: 0,
    }],
    currentMonitoringSignals: [{
      id: "monitor_new",
      title: "Supplier monitoring",
      summary: "Supplier pressure stable.",
      relatedObjectIds: ["supplier", "inventory"],
      monitoringStatus: "stable",
      confidence: 0.82,
      urgencyScore: 0.2,
      createdAt: 0,
    }],
    previousFragilityZones: [{
      id: "zone_old",
      title: "Critical corridor",
      summary: "Critical corridor.",
      zoneType: "critical_corridor",
      relatedObjectIds: ["supplier", "inventory", "delivery"],
      propagationIntensity: 0.82,
      fragilityScore: 82,
      systemicReach: 0.74,
      createdAt: 0,
    }],
    currentFragilityZones: [{
      id: "zone_new",
      title: "Localized pressure",
      summary: "Localized pressure.",
      zoneType: "isolated",
      relatedObjectIds: ["supplier"],
      propagationIntensity: 0.2,
      fragilityScore: 28,
      systemicReach: 0.1,
      createdAt: 0,
    }],
    currentInterventions: [{
      id: "intervention_monitor",
      title: "Strengthen monitoring",
      summary: "Increase visibility.",
      category: "strengthen_monitoring",
      relatedObjectIds: ["supplier", "inventory"],
      confidence: 0.76,
      priority: "medium",
      createdAt: 0,
    }],
  });

  assert.ok(records.length > 0);
  assert.equal(records[0].reviewStatus, "superseded");
  assert.ok(records[0].relatedRecommendationIds?.includes("rec_supplier_diversify"));
  assert.ok(records[0].relatedScenarioIds?.includes("scenario_supplier"));
  assert.ok(records[0].lessonsLearned?.length);
  assert.equal(records[0].createdAt, 0);
});

test("decision reviews can identify stabilized evidence", () => {
  const records = deriveDecisionReviews({
    previousRecommendations: [previousRecommendation],
    currentRecommendations: [previousRecommendation],
    previousFragilityZones: [{
      id: "zone_old",
      title: "Critical corridor",
      summary: "Critical corridor.",
      zoneType: "critical_corridor",
      relatedObjectIds: ["supplier", "inventory"],
      propagationIntensity: 0.8,
      fragilityScore: 82,
      systemicReach: 0.72,
      createdAt: 0,
    }],
    currentFragilityZones: [{
      id: "zone_new",
      title: "Localized pressure",
      summary: "Localized pressure.",
      zoneType: "isolated",
      relatedObjectIds: ["supplier"],
      propagationIntensity: 0.2,
      fragilityScore: 28,
      systemicReach: 0.1,
      createdAt: 0,
    }],
  });

  assert.equal(records[0].reviewStatus, "stabilized");
});

test("decision reviews are deterministic and do not mutate input", () => {
  const input = {
    previousRecommendations: [previousRecommendation],
    currentRecommendations: [currentRecommendation],
  };
  const before = JSON.stringify(input);
  const first = deriveDecisionReviews(input);
  const second = deriveDecisionReviews(input);

  assert.deepEqual(first, second);
  assert.equal(JSON.stringify(input), before);
});

test("decision review overlay is passive and empty state is safe", () => {
  const records = deriveDecisionReviews({
    previousRecommendations: [previousRecommendation],
    currentRecommendations: [currentRecommendation],
  });
  const overlay = buildDecisionReviewOverlayState({ records });
  const emptyOverlay = buildDecisionReviewOverlayState({ records: [] });

  assert.equal(overlay.topReviewId, records[0].id);
  assert.ok(overlay.relatedObjectIds.includes("supplier"));
  assert.equal(emptyOverlay.status, "monitoring");
});
