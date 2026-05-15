import test from "node:test";
import assert from "node:assert/strict";

import { clusterStrategicInsights } from "./clusterStrategicInsights.ts";

test("overlapping object signals compress into one cluster", () => {
  const clusters = clusterStrategicInsights({
    executiveInsights: [{
      id: "insight_supplier",
      title: "Supplier Dependency Fragility",
      summary: "Supplier dependency pressure.",
      category: "dependency",
      severity: "critical",
      confidence: 0.86,
      priorityScore: 92,
      affectedObjectIds: ["supplier", "inventory"],
      recommendedFocus: "Supplier dependency",
      domainId: "supply_chain",
      sourceType: "relationship",
      createdAt: 0,
    }],
    monitoringSignals: [{
      id: "monitor_supplier",
      title: "Supplier pressure",
      summary: "Supplier pressure remains elevated.",
      relatedObjectIds: ["inventory", "supplier"],
      monitoringStatus: "critical",
      trend: "degrading",
      confidence: 0.8,
      urgencyScore: 0.86,
      recommendedAttention: "Supplier dependency",
      domainId: "supply_chain",
      createdAt: 0,
    }],
  });

  assert.equal(clusters.length, 1);
  assert.equal(clusters[0].priority, "critical");
  assert.deepEqual(clusters[0].signalIds.sort(), ["insight_supplier", "monitor_supplier"]);
});

test("separate object groups remain separate clusters", () => {
  const clusters = clusterStrategicInsights({
    recommendations: [
      {
        id: "rec_supplier",
        title: "Reduce Supplier Dependency",
        summary: "Reduce supplier dependency.",
        category: "diversify",
        rationale: "Supplier dependency is elevated.",
        recommendedFocus: "Supplier dependency",
        affectedObjectIds: ["supplier"],
        confidence: 0.84,
        priority: "high",
        createdAt: 0,
      },
      {
        id: "rec_cash",
        title: "Protect Cash Flow",
        summary: "Protect cash flow.",
        category: "protect",
        rationale: "Cash pressure is elevated.",
        recommendedFocus: "Cash flow",
        affectedObjectIds: ["cash"],
        confidence: 0.78,
        priority: "high",
        createdAt: 0,
      },
    ],
  });

  assert.equal(clusters.length, 2);
});
