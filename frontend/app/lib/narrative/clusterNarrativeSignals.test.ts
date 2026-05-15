import test from "node:test";
import assert from "node:assert/strict";

import { clusterNarrativeSignals } from "./clusterNarrativeSignals.ts";

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

const compressedInsight = {
  id: "compressed_supplier",
  title: "Supplier pressure",
  summary: "Supplier pressure remains central.",
  supportingInsightIds: ["insight_supplier"],
  supportingScenarioIds: ["scenario_supplier"],
  relatedObjectIds: ["supplier", "inventory"],
  priority: "critical" as const,
  confidenceLevel: "high" as const,
  executiveFocus: "Supplier dependency",
  domainId: "supply_chain",
  createdAt: 0,
};

test("narrative clustering combines overlapping intelligence", () => {
  const clusters = clusterNarrativeSignals({
    executiveInsights: [executiveInsight],
    compressedInsights: [compressedInsight],
    monitoringSignals: [{
      id: "monitor_supplier",
      title: "Supplier monitoring",
      summary: "Supplier pressure is active.",
      relatedObjectIds: ["supplier", "inventory"],
      monitoringStatus: "critical" as const,
      trend: "degrading" as const,
      confidence: 0.8,
      urgencyScore: 0.86,
      recommendedAttention: "Supplier dependency",
      domainId: "supply_chain",
      createdAt: 0,
    }],
  });

  assert.equal(clusters.length, 1);
  assert.equal(clusters[0].tone, "urgent");
  assert.ok(clusters[0].signalIds.includes("insight_supplier"));
  assert.ok(clusters[0].scenarioIds.includes("scenario_supplier"));
  assert.ok(clusters[0].relatedObjectIds.includes("supplier"));
});

test("narrative clustering is deterministic and does not mutate input", () => {
  const input = {
    executiveInsights: [executiveInsight],
    compressedInsights: [compressedInsight],
  };
  const before = JSON.stringify(input);
  const first = clusterNarrativeSignals(input);
  const second = clusterNarrativeSignals(input);

  assert.deepEqual(first, second);
  assert.equal(JSON.stringify(input), before);
});
