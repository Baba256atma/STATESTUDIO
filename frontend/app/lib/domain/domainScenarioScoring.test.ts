import { test } from "node:test";
import * as assert from "node:assert/strict";

import { buildExecutiveScenarioRecommendation } from "./domainExecutiveRecommendations.ts";
import { scoreDomainScenarios } from "./domainScenarioScoring.ts";
import type { DomainScenario } from "./domainScenarioTypes.ts";

const scenarios: DomainScenario[] = [
  {
    id: "s1",
    domainId: "finance",
    title: "Reduce exposure",
    description: "Contain exposure.",
    type: "containment",
    confidence: 0.74,
    severity: "high",
    relatedObjectIds: ["exposure"],
    impacts: [{ category: "risk", direction: "decrease", magnitude: 70 }],
    recommendedActions: ["Set exposure guardrail", "Monitor cash flow"],
    executiveSummary: "Reduce exposure.",
  },
  {
    id: "s2",
    domainId: "finance",
    title: "Delay expansion",
    description: "Wait before expanding.",
    type: "fallback",
    confidence: 0.52,
    severity: "medium",
    relatedObjectIds: ["cash"],
    impacts: [{ category: "timeline", direction: "increase", magnitude: 44 }],
    recommendedActions: ["Delay expansion"],
    executiveSummary: "Delay expansion.",
  },
];

test("scenario scoring returns valid clamped scores", () => {
  const scores = scoreDomainScenarios({ scenarios });

  assert.equal(scores.length, 2);
  for (const score of scores) {
    assert.ok(score.overallScore >= 0 && score.overallScore <= 100);
    assert.ok(score.riskReductionScore >= 0 && score.riskReductionScore <= 100);
    assert.ok(score.confidenceScore >= 0 && score.confidenceScore <= 100);
    assert.ok(score.operationalComplexityScore >= 0 && score.operationalComplexityScore <= 100);
  }
});

test("executive recommendation exists", () => {
  const scores = scoreDomainScenarios({ scenarios });
  const recommendation = buildExecutiveScenarioRecommendation({ scenarios, scores });

  assert.ok(recommendation.recommendedScenarioId);
  assert.ok(recommendation.explanation.includes("leading scenario"));
});

test("scenario scoring is deterministic", () => {
  const first = scoreDomainScenarios({ scenarios });
  const second = scoreDomainScenarios({ scenarios });

  assert.deepEqual(second, first);
});

test("empty executive recommendation is safe", () => {
  const recommendation = buildExecutiveScenarioRecommendation({ scenarios: [] });

  assert.equal(recommendation.recommendedScenarioId, undefined);
  assert.ok(recommendation.explanation.length > 0);
});
