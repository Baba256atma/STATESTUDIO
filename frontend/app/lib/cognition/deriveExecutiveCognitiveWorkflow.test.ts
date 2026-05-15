import test from "node:test";
import assert from "node:assert/strict";

import {
  buildCognitiveWorkflowOverlayState,
  deriveExecutiveCognitiveWorkflow,
} from "./deriveExecutiveCognitiveWorkflow.ts";

const recommendation = {
  id: "rec_supplier",
  title: "Reduce Supplier Dependency",
  summary: "Reduce supplier dependency.",
  category: "diversify" as const,
  rationale: "Supplier dependency is elevated.",
  recommendedFocus: "Reduce supplier concentration",
  affectedObjectIds: ["supplier", "inventory"],
  relatedScenarioIds: ["scenario_supplier"],
  confidence: 0.84,
  priority: "critical" as const,
  domainId: "supply_chain",
  createdAt: 0,
};

const decisionGraph = {
  id: "graph",
  nodes: [
    { id: "risk", type: "risk" as const, title: "Supplier Risk", createdAt: 0 },
    { id: "scenario", type: "scenario" as const, title: "Supplier Scenario", createdAt: 0 },
    { id: "recommendation", type: "recommendation" as const, title: "Reduce Supplier Dependency", createdAt: 0 },
  ],
  edges: [
    { id: "e1", sourceNodeId: "risk", targetNodeId: "scenario" },
    { id: "e2", sourceNodeId: "scenario", targetNodeId: "recommendation" },
  ],
  headline: "Supplier Risk -> Reduce Supplier Dependency",
  executiveSummary: "Supplier risk leads to recommendation focus.",
  createdAt: 0,
};

test("derives decision focus from recommendation and decision graph path", () => {
  const workflow = deriveExecutiveCognitiveWorkflow({
    recommendations: [recommendation],
    decisionGraph,
  });

  assert.equal(workflow.currentStage, "decision_focus");
  assert.equal(workflow.recommendedFocus, "Reduce supplier concentration");
  assert.ok(workflow.relatedRecommendationIds?.includes("rec_supplier"));
  assert.equal(workflow.domainId, "supply_chain");
});

test("low recommendation confidence moves workflow into confidence review", () => {
  const workflow = deriveExecutiveCognitiveWorkflow({
    recommendations: [recommendation],
    confidenceSignals: [{
      id: "confidence_supplier",
      relatedRecommendationId: "rec_supplier",
      confidenceLevel: "low",
      confidenceScore: 0.34,
      rationale: "Operational signals remain mixed.",
      domainId: "supply_chain",
      createdAt: 0,
    }],
  });

  assert.equal(workflow.currentStage, "confidence_review");
  assert.match(workflow.stageSummary ?? "", /confidence/);
});

test("monitoring state is supported without auto actions", () => {
  const workflow = deriveExecutiveCognitiveWorkflow({
    recommendations: [recommendation],
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
  });

  assert.equal(workflow.currentStage, "monitoring");
  assert.match(workflow.stageSummary ?? "", /monitoring/i);
});

test("cognitive workflow is deterministic and does not mutate input", () => {
  const input = {
    recommendations: [recommendation],
    decisionGraph,
  };
  const before = JSON.stringify(input);
  const first = deriveExecutiveCognitiveWorkflow(input);
  const second = deriveExecutiveCognitiveWorkflow(input);

  assert.deepEqual(first, second);
  assert.equal(JSON.stringify(input), before);
  assert.equal(first.updatedAt, 0);
});

test("cognitive workflow overlay is passive and safe", () => {
  const workflow = deriveExecutiveCognitiveWorkflow({});
  const overlay = buildCognitiveWorkflowOverlayState({ workflow });

  assert.equal(workflow.currentStage, "awareness");
  assert.equal(overlay.currentStage, "awareness");
  assert.equal(overlay.confidence, 0);
});
