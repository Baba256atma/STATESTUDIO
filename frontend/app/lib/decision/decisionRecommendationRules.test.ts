import { test } from "node:test";
import * as assert from "node:assert/strict";

import {
  categoryForExecutiveInsight,
  categoryForScenario,
  clampRecommendationConfidence,
  priorityFromRecommendationScore,
  scoreDecisionRecommendationPriority,
} from "./decisionRecommendationRules.ts";
import type { DomainScenario } from "../domain/domainScenarioTypes.ts";
import type { ExecutiveInsight } from "../intelligence/executiveInsightTypes.ts";

const dependencyInsight: ExecutiveInsight = {
  id: "insight_supplier",
  title: "Supplier Dependency Fragility",
  summary: "Supplier dependency is fragile.",
  category: "dependency",
  severity: "critical",
  confidence: 0.86,
  priorityScore: 91,
  affectedObjectIds: ["supplier", "inventory"],
  recommendedFocus: "supplier dependency",
  createdAt: 0,
};

const scenario: DomainScenario = {
  id: "scenario_delay",
  domainId: "supply_chain",
  title: "Delay Propagation",
  description: "Supplier delay can propagate.",
  type: "delay",
  confidence: 0.8,
  severity: "high",
  relatedObjectIds: ["supplier"],
  impacts: [],
  recommendedActions: [],
  executiveSummary: "Delay can reach delivery.",
};

test("insight categories map to recommendation categories", () => {
  assert.equal(categoryForExecutiveInsight(dependencyInsight), "diversify");
  assert.equal(categoryForExecutiveInsight({ ...dependencyInsight, category: "capacity", severity: "high" }), "rebalance");
  assert.equal(categoryForExecutiveInsight({ ...dependencyInsight, category: "financial", severity: "medium" }), "protect");
});

test("scenario categories map to recommendation categories", () => {
  assert.equal(categoryForScenario(scenario), "stabilize");
  assert.equal(categoryForScenario({ ...scenario, type: "financial_pressure" }), "protect");
  assert.equal(categoryForScenario({ ...scenario, type: "resource_constraint" }), "rebalance");
});

test("recommendation score and confidence are clamped", () => {
  assert.equal(clampRecommendationConfidence(2), 1);
  assert.equal(clampRecommendationConfidence(-1), 0);
  const score = scoreDecisionRecommendationPriority({
    category: "stabilize",
    confidence: 1,
    severity: "critical",
    affectedObjectIds: ["a", "b", "c"],
    propagationReach: 4,
  });

  assert.ok(score >= 0 && score <= 100);
  assert.equal(priorityFromRecommendationScore(score), "critical");
});
