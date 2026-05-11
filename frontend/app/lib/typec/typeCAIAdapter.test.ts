import test from "node:test";
import assert from "node:assert/strict";

import {
  buildTypeCAIInsightRequest,
  fallbackTypeCAIInsightResponse,
  parseTypeCAIInsightResponse,
  safeTypeCAIInsightResponse,
} from "./typeCAIAdapter.ts";
import type { TypeCAdaptiveGuidance } from "./typeCAdaptiveGuidance.ts";
import type { TypeCDecisionRecommendation } from "./typeCDecisionRecommendation.ts";

const decision: TypeCDecisionRecommendation = {
  recommendedScenarioId: "scenario_a",
  reasoning: "Scenario A has lower structural risk.",
  tradeoff: "Lower risk with slower execution.",
  riskWarning: "Validate assumptions.",
  nextAction: "Open War Room.",
  confidence: 0.72,
};

const adaptiveGuidance: TypeCAdaptiveGuidance = {
  message: "Similar scenarios were previously stable.",
  contextFactors: ["memory_pattern_stable"],
  recommendedAdjustment: "Proceed with monitoring.",
  confidence: 0.8,
};

test("buildTypeCAIInsightRequest builds request correctly", () => {
  const request = buildTypeCAIInsightRequest({
    decisionRecommendation: decision,
    adaptiveGuidance,
    memorySummary: {
      repeatedRisks: ["a", "b", "c", "d", "e"],
      stablePatterns: ["stable"],
      unstablePatterns: [],
    },
  });
  assert.equal(request.decisionRecommendation?.recommendedScenarioId, "scenario_a");
  assert.equal(request.adaptiveGuidance?.contextFactors[0], "memory_pattern_stable");
  assert.equal(request.memorySummary?.repeatedRisks.length, 4);
});

test("parseTypeCAIInsightResponse validates well-formed response", () => {
  const parsed = parseTypeCAIInsightResponse({
    executiveSummary: "Summary",
    strategicInsight: "Insight",
    cautionNote: "Caution",
    suggestedQuestions: ["Question one?", "Question two?"],
    confidence: 1.2,
  });
  assert.equal(parsed.confidence, 1);
  assert.equal(parsed.source, "ai_assisted");
  assert.equal(parsed.suggestedQuestions.length, 2);
});

test("parseTypeCAIInsightResponse rejects malformed response", () => {
  assert.throws(() => parseTypeCAIInsightResponse({ executiveSummary: "" }));
});

test("safeTypeCAIInsightResponse returns fallback for malformed output", () => {
  const fallback = safeTypeCAIInsightResponse({ nope: true });
  assert.equal(fallback.executiveSummary, fallbackTypeCAIInsightResponse().executiveSummary);
  assert.equal(fallback.confidence, 0.25);
});

test("parseTypeCAIInsightResponse clamps output length", () => {
  const long = "x".repeat(800);
  const parsed = parseTypeCAIInsightResponse({
    executiveSummary: long,
    strategicInsight: long,
    cautionNote: long,
    suggestedQuestions: [long, long, long, long, long],
    confidence: 0.7,
  });
  assert.ok(parsed.executiveSummary.length <= 420);
  assert.ok(parsed.cautionNote.length <= 320);
  assert.equal(parsed.suggestedQuestions.length, 4);
  assert.ok(parsed.suggestedQuestions.every((question) => question.length <= 140));
});
