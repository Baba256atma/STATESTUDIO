import { test } from "node:test";
import * as assert from "node:assert/strict";

import {
  buildWarRoomDecisionFocus,
  describeWarRoomStage,
  labelForWarRoomStage,
} from "./warRoomStageNarratives.ts";
import type { DomainScenario } from "../domain/domainScenarioTypes.ts";
import type { ExecutiveInsight } from "../intelligence/executiveInsightTypes.ts";
import type { WarRoomFlowState } from "./warRoomFlowTypes.ts";

const flow: WarRoomFlowState = {
  currentStage: "scenario_compare",
  recommendedFocus: "Compare supplier resilience scenarios",
  updatedAt: 0,
};

const scenario: DomainScenario = {
  id: "scenario_supplier",
  domainId: "supply_chain",
  title: "Supplier Resilience",
  description: "Improve supplier resilience.",
  type: "mitigation",
  confidence: 0.8,
  severity: "medium",
  relatedObjectIds: ["supplier"],
  impacts: [],
  recommendedActions: [],
  executiveSummary: "Supplier resilience improves stability.",
  recommendedFocus: "Reduce supplier concentration",
};

const insight: ExecutiveInsight = {
  id: "insight_supplier",
  title: "Supplier Pressure",
  summary: "Supplier pressure is elevated.",
  category: "dependency",
  severity: "high",
  confidence: 0.8,
  priorityScore: 82,
  affectedObjectIds: ["supplier"],
  recommendedFocus: "Stabilize supplier pressure",
  createdAt: 0,
};

test("labels stages in executive language", () => {
  assert.equal(labelForWarRoomStage("scenario_compare"), "Scenario Compare");
  assert.equal(labelForWarRoomStage("monitoring"), "Monitoring");
});

test("describes current stage without noisy detail", () => {
  const narrative = describeWarRoomStage({
    flow,
    activeScenario: scenario,
    topInsight: insight,
    activeComparison: {
      id: "compare",
      scenarioAId: "a",
      scenarioBId: "b",
      comparisonTitle: "Supplier Strategy Comparison",
      executiveSummary: "",
      stabilityDelta: 1,
      fragilityDelta: -1,
      propagationDelta: -1,
      confidenceDelta: 1,
      tradeoffs: [],
      createdAt: 0,
    },
  });

  assert.ok(narrative.includes("Comparing strategic alternatives"));
  assert.ok(narrative.includes("Supplier Strategy Comparison"));
});

test("decision focus prefers explicit flow focus", () => {
  const focus = buildWarRoomDecisionFocus({
    flow: { ...flow, currentStage: "decision_focus" },
    insights: [insight],
    scenarios: [scenario],
  });

  assert.equal(focus, "Compare supplier resilience scenarios");
});

test("decision focus falls back to insight focus", () => {
  const focus = buildWarRoomDecisionFocus({
    flow: { currentStage: "decision_focus", updatedAt: 0 },
    insights: [insight],
    scenarios: [scenario],
  });

  assert.equal(focus, "Stabilize supplier pressure");
});
