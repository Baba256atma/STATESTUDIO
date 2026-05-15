import { test } from "node:test";
import * as assert from "node:assert/strict";

import { deriveWarRoomFlow } from "./deriveWarRoomFlow.ts";
import type { DomainScenario } from "../domain/domainScenarioTypes.ts";
import type { ExecutiveInsight } from "../intelligence/executiveInsightTypes.ts";
import type { ScenarioComparison } from "../scenario/scenarioCompareTypes.ts";

const scenarios: DomainScenario[] = [
  {
    id: "supplier_diversification",
    domainId: "supply_chain",
    title: "Supplier Diversification",
    description: "Add backup supplier path.",
    type: "mitigation",
    confidence: 0.82,
    severity: "medium",
    relatedObjectIds: ["supplier", "inventory"],
    affectedObjectIds: ["supplier", "inventory"],
    impacts: [],
    recommendedActions: ["Reduce supplier dependency"],
    executiveSummary: "Diversify supplier path.",
    recommendedFocus: "Reduce supplier dependency concentration",
    createdAt: 0,
  },
  {
    id: "accept_delay",
    domainId: "supply_chain",
    title: "Accept Delay Risk",
    description: "Accept upstream delay risk.",
    type: "delay",
    confidence: 0.58,
    severity: "high",
    relatedObjectIds: ["supplier", "delivery"],
    affectedObjectIds: ["supplier", "inventory", "delivery"],
    impacts: [],
    recommendedActions: [],
    executiveSummary: "Delay may reach delivery.",
    createdAt: 0,
  },
];

const criticalInsight: ExecutiveInsight = {
  id: "insight_supplier",
  title: "Supplier Dependency Fragility",
  summary: "Supplier fragility is the primary operational pressure.",
  category: "dependency",
  severity: "critical",
  confidence: 0.86,
  priorityScore: 91,
  affectedObjectIds: ["supplier", "inventory"],
  recommendedFocus: "Stabilize supplier dependency",
  domainId: "supply_chain",
  sourceType: "fragility",
  createdAt: 0,
};

const comparison: ScenarioComparison = {
  id: "compare_supplier",
  scenarioAId: "accept_delay",
  scenarioBId: "supplier_diversification",
  comparisonTitle: "Supplier Strategy Comparison",
  executiveSummary: "Supplier diversification reduces propagation exposure.",
  stabilityDelta: 22,
  fragilityDelta: -31,
  propagationDelta: -18,
  confidenceDelta: 14,
  recommendedScenarioId: "supplier_diversification",
  tradeoffs: ["Reduces dependency concentration"],
  createdAt: 0,
};

test("critical insight derives risk analysis stage", () => {
  const flow = deriveWarRoomFlow({ insights: [criticalInsight] });

  assert.equal(flow.currentStage, "risk_analysis");
  assert.equal(flow.selectedInsightId, "insight_supplier");
  assert.ok(flow.executiveSummary?.includes("risk assessment"));
});

test("active scenario derives scenario review stage", () => {
  const flow = deriveWarRoomFlow({
    scenarios,
    insights: [criticalInsight],
    activeScenarioId: "supplier_diversification",
  });

  assert.equal(flow.currentStage, "scenario_review");
  assert.equal(flow.activeScenarioId, "supplier_diversification");
  assert.equal(flow.recommendedFocus, "Reduce supplier dependency concentration");
});

test("comparison context derives scenario compare stage", () => {
  const flow = deriveWarRoomFlow({
    scenarios,
    comparisons: [comparison],
    insights: [criticalInsight],
  });

  assert.equal(flow.currentStage, "scenario_compare");
  assert.deepEqual(flow.comparedScenarioIds, ["accept_delay", "supplier_diversification"]);
  assert.equal(flow.activeScenarioId, "supplier_diversification");
});

test("high-confidence recommendation derives recommendation focus without active compare", () => {
  const flow = deriveWarRoomFlow({
    scenarios,
    insights: [criticalInsight],
    recommendationScenarioId: "supplier_diversification",
  });

  assert.equal(flow.currentStage, "recommendation_focus");
  assert.equal(flow.activeScenarioId, "supplier_diversification");
});

test("selected insight derives decision focus", () => {
  const flow = deriveWarRoomFlow({
    insights: [criticalInsight],
    selectedInsightId: "insight_supplier",
  });

  assert.equal(flow.currentStage, "decision_focus");
});

test("monitoring active derives monitoring stage", () => {
  const flow = deriveWarRoomFlow({
    scenarios,
    activeScenarioId: "supplier_diversification",
    monitoringActive: true,
  });

  assert.equal(flow.currentStage, "monitoring");
  assert.ok(flow.executiveSummary?.includes("Monitoring"));
});

test("previous comparison stage remains stable while comparison context exists", () => {
  const previousState = deriveWarRoomFlow({
    scenarios,
    comparisons: [comparison],
  });
  const flow = deriveWarRoomFlow({
    scenarios,
    comparisons: [comparison],
    insights: [criticalInsight],
    previousState,
  });

  assert.equal(flow.currentStage, "scenario_compare");
});

test("deriveWarRoomFlow is deterministic and does not mutate inputs", () => {
  const scenarioCopy = structuredClone(scenarios);
  const insightCopy = structuredClone([criticalInsight]);
  const comparisonCopy = structuredClone([comparison]);

  const first = deriveWarRoomFlow({ scenarios, insights: [criticalInsight], comparisons: [comparison] });
  const second = deriveWarRoomFlow({ scenarios, insights: [criticalInsight], comparisons: [comparison] });

  assert.deepEqual(second, first);
  assert.deepEqual(scenarios, scenarioCopy);
  assert.deepEqual([criticalInsight], insightCopy);
  assert.deepEqual([comparison], comparisonCopy);
});
