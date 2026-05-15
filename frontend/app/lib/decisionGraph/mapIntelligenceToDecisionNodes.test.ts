import test from "node:test";
import assert from "node:assert/strict";

import { mapIntelligenceToDecisionNodes } from "./mapIntelligenceToDecisionNodes.ts";

const insight = {
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

test("maps intelligence sources to stable decision graph nodes", () => {
  const nodes = mapIntelligenceToDecisionNodes({
    executiveInsights: [insight],
    recommendations: [{
      id: "rec_supplier",
      title: "Reduce Supplier Dependency",
      summary: "Reduce supplier dependency.",
      category: "diversify",
      rationale: "Supplier pressure is elevated.",
      affectedObjectIds: ["supplier", "inventory"],
      confidence: 0.84,
      priority: "critical",
      createdAt: 0,
    }],
    confidenceSignals: [{
      id: "confidence_supplier",
      relatedRecommendationId: "rec_supplier",
      confidenceLevel: "high",
      confidenceScore: 0.82,
      rationale: "Evidence is stable.",
      createdAt: 0,
    }],
  });

  assert.equal(nodes[0].type, "risk");
  assert.equal(nodes.some((node) => node.type === "recommendation"), true);
  assert.equal(nodes.some((node) => node.type === "confidence"), true);
  assert.equal(nodes.every((node) => node.id.startsWith("decision_graph_")), true);
});

test("node mapping dedupes by source id and type", () => {
  const nodes = mapIntelligenceToDecisionNodes({
    executiveInsights: [insight, insight],
  });

  assert.equal(nodes.length, 1);
  assert.equal(nodes[0].sourceId, "insight_supplier");
});
