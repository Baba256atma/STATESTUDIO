import test from "node:test";
import assert from "node:assert/strict";

import { trackDecisionEvolution } from "./trackDecisionEvolution.ts";

const previousRecommendation = {
  id: "rec_old",
  title: "Reduce Supplier Dependency",
  summary: "Reduce supplier dependency.",
  category: "diversify" as const,
  rationale: "Supplier dependency is elevated.",
  affectedObjectIds: ["supplier", "inventory"],
  confidence: 0.7,
  priority: "high" as const,
  createdAt: 0,
};

const currentRecommendation = {
  id: "rec_new",
  title: "Strengthen Supplier Monitoring",
  summary: "Strengthen monitoring.",
  category: "monitor" as const,
  rationale: "Supplier dependency is stabilizing but needs visibility.",
  affectedObjectIds: ["supplier", "inventory"],
  confidence: 0.84,
  priority: "medium" as const,
  createdAt: 0,
};

test("tracks recommendation confidence monitoring and fragility evolution", () => {
  const changes = trackDecisionEvolution({
    previousRecommendations: [previousRecommendation],
    currentRecommendations: [currentRecommendation],
    previousMonitoringSignals: [{
      id: "monitor_old",
      title: "Supplier monitoring",
      summary: "Supplier pressure elevated.",
      relatedObjectIds: ["supplier"],
      monitoringStatus: "elevated",
      confidence: 0.7,
      urgencyScore: 0.8,
      createdAt: 0,
    }],
    currentMonitoringSignals: [{
      id: "monitor_new",
      title: "Supplier monitoring",
      summary: "Supplier pressure stable.",
      relatedObjectIds: ["supplier"],
      monitoringStatus: "stable",
      confidence: 0.8,
      urgencyScore: 0.2,
      createdAt: 0,
    }],
    previousFragilityZones: [{
      id: "zone_old",
      title: "Critical corridor",
      summary: "Critical corridor.",
      zoneType: "critical_corridor",
      relatedObjectIds: ["supplier", "inventory"],
      propagationIntensity: 0.8,
      fragilityScore: 80,
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

  assert.ok(changes.some((change) => change.type === "recommendation_changed"));
  assert.ok(changes.some((change) => change.type === "confidence_changed"));
  assert.ok(changes.some((change) => change.type === "monitoring_changed"));
  assert.ok(changes.some((change) => change.type === "fragility_changed"));
});

test("decision evolution tracking is deterministic and does not mutate input", () => {
  const input = {
    previousRecommendations: [previousRecommendation],
    currentRecommendations: [currentRecommendation],
  };
  const before = JSON.stringify(input);
  const first = trackDecisionEvolution(input);
  const second = trackDecisionEvolution(input);

  assert.deepEqual(first, second);
  assert.equal(JSON.stringify(input), before);
});
