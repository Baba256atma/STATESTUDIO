import test from "node:test";
import assert from "node:assert/strict";

import { buildTypeCDecisionRecommendation } from "./typeCDecisionRecommendation.ts";
import type { TypeCScenarioComparison } from "./typeCScenarioComparison.ts";

function comparison(): TypeCScenarioComparison {
  return {
    id: "compare",
    scenarioIds: ["safe", "risky"],
    bestOptionId: "safe",
    highestRiskScenarioId: "risky",
    summary: "Compared two scenarios.",
    rows: [
      {
        scenarioId: "safe",
        title: "Contained option",
        riskLevel: "low",
        affectedCount: 1,
        pathCount: 0,
        confidence: 0.82,
        tradeoff: "Lower risk, but limited propagation detail.",
      },
      {
        scenarioId: "risky",
        title: "Cascade option",
        riskLevel: "high",
        affectedCount: 4,
        pathCount: 3,
        confidence: 0.9,
        tradeoff: "High impact visibility, but more propagation risk.",
      },
    ],
  };
}

test("buildTypeCDecisionRecommendation selects best scenario", () => {
  const recommendation = buildTypeCDecisionRecommendation({ comparison: comparison() });
  assert.equal(recommendation.recommendedScenarioId, "safe");
});

test("buildTypeCDecisionRecommendation falls back to lowest risk row", () => {
  const input = comparison();
  const recommendation = buildTypeCDecisionRecommendation({
    comparison: { ...input, bestOptionId: null },
  });
  assert.equal(recommendation.recommendedScenarioId, "safe");
});

test("buildTypeCDecisionRecommendation includes reasoning", () => {
  const recommendation = buildTypeCDecisionRecommendation({ comparison: comparison() });
  assert.match(recommendation.reasoning, /lower structural risk|Contained option/i);
});

test("buildTypeCDecisionRecommendation includes tradeoff", () => {
  const recommendation = buildTypeCDecisionRecommendation({ comparison: comparison() });
  assert.ok(recommendation.tradeoff.length > 0);
});

test("buildTypeCDecisionRecommendation includes risk warning", () => {
  const recommendation = buildTypeCDecisionRecommendation({ comparison: comparison() });
  assert.ok(recommendation.riskWarning.length > 0);
  assert.match(recommendation.riskWarning, /risk|highest-risk/i);
});

test("buildTypeCDecisionRecommendation confidence stays within range", () => {
  const recommendation = buildTypeCDecisionRecommendation({ comparison: comparison() });
  assert.ok(recommendation.confidence >= 0);
  assert.ok(recommendation.confidence <= 1);
});

test("buildTypeCDecisionRecommendation does not mutate comparison", () => {
  const input = comparison();
  const before = JSON.stringify(input);
  buildTypeCDecisionRecommendation({ comparison: input });
  assert.equal(JSON.stringify(input), before);
});

test("buildTypeCDecisionRecommendation returns safe fallback for empty comparison", () => {
  const recommendation = buildTypeCDecisionRecommendation({
    comparison: {
      id: "empty",
      scenarioIds: [],
      bestOptionId: null,
      highestRiskScenarioId: null,
      summary: "empty",
      rows: [],
    },
  });
  assert.equal(recommendation.recommendedScenarioId, null);
  assert.equal(recommendation.confidence, 0.3);
  assert.ok(recommendation.nextAction.length > 0);
});
