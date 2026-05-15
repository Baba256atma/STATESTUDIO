import test from "node:test";
import assert from "node:assert/strict";

import {
  buildStrategicDecisionGraphOverlayState,
  deriveStrategicDecisionGraph,
} from "./deriveStrategicDecisionGraph.ts";
import { buildDecisionPathNarrative } from "./decisionGraphNarratives.ts";
import { extractDecisionPaths } from "./extractDecisionPaths.ts";

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
  executiveSummary: "Supplier diversification reduces upstream concentration.",
  recommendedFocus: "supplier backup path",
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

test("derives a stable strategic decision graph", () => {
  const graph = deriveStrategicDecisionGraph({
    executiveInsights: [insight],
    scenarios: [scenario],
    recommendations: [recommendation],
    confidenceSignals: [{
      id: "confidence_supplier",
      relatedRecommendationId: "rec_supplier",
      confidenceLevel: "high",
      confidenceScore: 0.82,
      rationale: "Recommendation supported by stable evidence.",
      domainId: "supply_chain",
      createdAt: 0,
    }],
    monitoringSignals: [{
      id: "monitor_supplier",
      title: "Supplier monitoring",
      summary: "Supplier pressure remains active.",
      relatedObjectIds: ["supplier", "inventory"],
      monitoringStatus: "elevated",
      trend: "degrading",
      confidence: 0.78,
      urgencyScore: 0.72,
      recommendedAttention: "Monitor supplier dependency",
      domainId: "supply_chain",
      createdAt: 0,
    }],
    narratives: [{
      id: "narrative_supplier",
      headline: "Supplier dependency requires executive attention.",
      summary: "Supplier dependency is consolidating into one operating story.",
      strategicMeaning: "Supplier dependency matters.",
      relatedInsightIds: ["insight_supplier"],
      relatedScenarioIds: ["scenario_supplier"],
      relatedObjectIds: ["supplier", "inventory"],
      tone: "urgent",
      confidence: 0.83,
      executiveFocus: "Supplier dependency",
      domainId: "supply_chain",
      createdAt: 0,
    }],
  });
  const paths = extractDecisionPaths({ graph });
  const overlay = buildStrategicDecisionGraphOverlayState({ graph });
  const narrative = buildDecisionPathNarrative({ graph, path: paths[0] });

  assert.ok(graph.nodes.length >= 5);
  assert.ok(graph.edges.length >= 4);
  assert.match(graph.headline ?? "", /Supplier Dependency Fragility/);
  assert.ok(paths[0].nodeIds.length >= 5);
  assert.equal(overlay.graphId, graph.id);
  assert.ok(overlay.relatedObjectIds.includes("supplier"));
  assert.match(narrative, /supports/);
});

test("decision graph derivation is deterministic and does not mutate input", () => {
  const input = {
    executiveInsights: [insight],
    scenarios: [scenario],
    recommendations: [recommendation],
  };
  const before = JSON.stringify(input);
  const first = deriveStrategicDecisionGraph(input);
  const second = deriveStrategicDecisionGraph(input);

  assert.deepEqual(first, second);
  assert.equal(JSON.stringify(input), before);
  assert.equal(first.createdAt, 0);
});

test("empty decision graph has a safe passive fallback", () => {
  const graph = deriveStrategicDecisionGraph({});
  const overlay = buildStrategicDecisionGraphOverlayState({ graph });

  assert.deepEqual(graph.nodes, []);
  assert.deepEqual(graph.edges, []);
  assert.equal(overlay.primaryPathNodeIds.length, 0);
  assert.equal(overlay.headline, "No strategic decision path is available yet.");
});
