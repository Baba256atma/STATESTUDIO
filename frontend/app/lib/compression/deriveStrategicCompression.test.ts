import test from "node:test";
import assert from "node:assert/strict";

import {
  buildStrategicCompressionOverlayState,
  deriveStrategicCompression,
} from "./deriveStrategicCompression.ts";
import { deriveExecutiveBriefing } from "./deriveExecutiveBriefing.ts";

const executiveInsight = {
  id: "insight_supplier",
  title: "Supplier Dependency Fragility",
  summary: "Supplier dependency pressure.",
  category: "dependency" as const,
  severity: "critical" as const,
  confidence: 0.86,
  priorityScore: 92,
  affectedObjectIds: ["supplier", "inventory"],
  recommendedFocus: "Supplier dependency",
  domainId: "supply_chain",
  sourceType: "relationship" as const,
  createdAt: 0,
};

const monitoringSignal = {
  id: "monitor_supplier",
  title: "Supplier pressure",
  summary: "Supplier pressure remains elevated.",
  relatedObjectIds: ["supplier", "inventory"],
  monitoringStatus: "critical" as const,
  trend: "degrading" as const,
  confidence: 0.8,
  urgencyScore: 0.86,
  recommendedAttention: "Supplier dependency",
  domainId: "supply_chain",
  createdAt: 0,
};

test("strategic compression reduces overlapping intelligence into top truths", () => {
  const compressed = deriveStrategicCompression({
    executiveInsights: [executiveInsight],
    monitoringSignals: [monitoringSignal],
    recommendations: [{
      id: "rec_supplier",
      title: "Reduce Supplier Dependency",
      summary: "Reduce supplier dependency.",
      category: "diversify",
      rationale: "Supplier dependency is elevated.",
      recommendedFocus: "Supplier dependency",
      affectedObjectIds: ["supplier", "inventory"],
      relatedScenarioIds: ["scenario_supplier"],
      confidence: 0.84,
      priority: "critical",
      domainId: "supply_chain",
      createdAt: 0,
    }],
    confidenceSignals: [{
      id: "confidence_supplier",
      relatedRecommendationId: "rec_supplier",
      confidenceLevel: "high",
      confidenceScore: 0.82,
      rationale: "Confidence remains high.",
      supportingSignals: ["Stable evidence."],
      domainId: "supply_chain",
      createdAt: 0,
    }],
  });

  assert.equal(compressed.length, 2);
  assert.equal(compressed[0].priority, "critical");
  assert.ok(compressed[0].supportingInsightIds.length >= 3);
  assert.ok(compressed[0].relatedObjectIds.includes("supplier"));
});

test("strategic compression is deterministic and does not mutate input", () => {
  const input = {
    executiveInsights: [executiveInsight],
    monitoringSignals: [monitoringSignal],
  };
  const before = JSON.stringify(input);
  const first = deriveStrategicCompression(input);
  const second = deriveStrategicCompression(input);

  assert.deepEqual(first, second);
  assert.equal(JSON.stringify(input), before);
});

test("compression overlay and briefing are passive executive metadata", () => {
  const compressed = deriveStrategicCompression({
    executiveInsights: [executiveInsight],
    monitoringSignals: [monitoringSignal],
  });
  const overlay = buildStrategicCompressionOverlayState({ insights: compressed });
  const briefing = deriveExecutiveBriefing({ insights: compressed });

  assert.equal(overlay.topInsightId, compressed[0].id);
  assert.ok(overlay.headline.includes("Supplier dependency"));
  assert.ok(briefing.headline.includes("Supplier dependency"));
  assert.equal(briefing.priority, "critical");
});

test("empty compression returns safe briefing state", () => {
  const compressed = deriveStrategicCompression({});
  const overlay = buildStrategicCompressionOverlayState({ insights: compressed });
  const briefing = deriveExecutiveBriefing({ insights: compressed });

  assert.deepEqual(compressed, []);
  assert.equal(overlay.priority, "low");
  assert.equal(briefing.confidence, "low");
});
