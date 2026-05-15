import test from "node:test";
import assert from "node:assert/strict";

import { deriveDecisionGraphEdges } from "./deriveDecisionGraphEdges.ts";
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

const scenario = {
  id: "scenario_supplier",
  domainId: "supply_chain" as const,
  title: "Supplier Diversification",
  description: "Add backup supplier path.",
  type: "mitigation" as const,
  confidence: 0.84,
  severity: "medium" as const,
  relatedObjectIds: ["supplier", "inventory"],
  affectedObjectIds: ["supplier", "inventory"],
  impacts: [],
  recommendedActions: [],
  executiveSummary: "Supplier diversification reduces concentration.",
  createdAt: 0,
};

const recommendation = {
  id: "rec_supplier",
  title: "Reduce Supplier Dependency",
  summary: "Reduce supplier dependency.",
  category: "diversify" as const,
  rationale: "Supplier dependency is elevated.",
  recommendedFocus: "Supplier dependency",
  affectedObjectIds: ["supplier", "inventory"],
  relatedScenarioIds: ["scenario_supplier"],
  confidence: 0.84,
  priority: "critical" as const,
  domainId: "supply_chain",
  createdAt: 0,
};

test("derives explainable edges from explicit and shared-object links", () => {
  const nodes = mapIntelligenceToDecisionNodes({
    executiveInsights: [insight],
    scenarios: [scenario],
    recommendations: [recommendation],
    confidenceSignals: [{
      id: "confidence_supplier",
      relatedRecommendationId: "rec_supplier",
      confidenceLevel: "high" as const,
      confidenceScore: 0.82,
      rationale: "Evidence is stable.",
      createdAt: 0,
    }],
  });
  const edges = deriveDecisionGraphEdges({
    nodes,
    executiveInsights: [insight],
    scenarios: [scenario],
    recommendations: [recommendation],
    confidenceSignals: [{
      id: "confidence_supplier",
      relatedRecommendationId: "rec_supplier",
      confidenceLevel: "high",
      confidenceScore: 0.82,
      rationale: "Evidence is stable.",
      createdAt: 0,
    }],
  });

  assert.ok(edges.some((edge) => edge.label === "informs scenario"));
  assert.ok(edges.some((edge) => edge.label === "leads to recommendation"));
  assert.ok(edges.some((edge) => edge.label === "confidence support"));
  assert.equal(new Set(edges.map((edge) => edge.id)).size, edges.length);
  assert.equal(edges.every((edge) => typeof edge.rationale === "string"), true);
});
