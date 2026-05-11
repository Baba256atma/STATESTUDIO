import test from "node:test";
import assert from "node:assert/strict";

import {
  buildTypeCMultiAgentRequest,
  fallbackTypeCMultiAgentInsight,
  parseTypeCMultiAgentInsight,
  safeTypeCMultiAgentInsight,
} from "./typeCMultiAgentAdapter.ts";
import type { TypeCAdaptiveGuidance } from "./typeCAdaptiveGuidance.ts";
import type { TypeCDecisionRecommendation } from "./typeCDecisionRecommendation.ts";

const recommendation: TypeCDecisionRecommendation = {
  recommendedScenarioId: "scenario_a",
  reasoning: "Lower propagation risk.",
  tradeoff: "Slower execution.",
  riskWarning: "Validate assumptions.",
  nextAction: "Open War Room.",
  confidence: 0.74,
};

const adaptiveGuidance: TypeCAdaptiveGuidance = {
  message: "Prior executions were stable.",
  contextFactors: ["memory_pattern_stable"],
  recommendedAdjustment: "Proceed with monitoring.",
  confidence: 0.81,
};

test("buildTypeCMultiAgentRequest builds bounded request", () => {
  const request = buildTypeCMultiAgentRequest({
    recommendation,
    adaptiveGuidance,
    memorySummary: {
      repeatedRisks: ["a", "b", "c", "d", "e"],
      stablePatterns: ["stable"],
      unstablePatterns: ["unstable"],
    },
  });
  assert.equal(request.recommendation?.recommendedScenarioId, "scenario_a");
  assert.equal(request.adaptiveGuidance?.contextFactors[0], "memory_pattern_stable");
  assert.equal(request.memorySummary?.repeatedRisks.length, 4);
});

test("parseTypeCMultiAgentInsight validates synthesis and agents", () => {
  const parsed = parseTypeCMultiAgentInsight({
    agentResponses: [
      {
        agent: "Risk Agent",
        insight: "Risk is concentrated in propagation.",
        concerns: ["Cascade exposure"],
        recommendations: ["Validate dependencies"],
        confidence: 1.4,
      },
    ],
    synthesis: {
      executiveSummary: "The lower-risk option is structurally preferred.",
      keyAgreement: "Agents agree on validation before execution.",
      keyConflict: "Finance wants speed while risk prefers caution.",
      strategicRecommendation: "Proceed only after dependency validation.",
      cautionAreas: ["Do not auto-execute"],
      confidence: 0.76,
    },
  });
  assert.equal(parsed.source, "multi_agent_ai");
  assert.equal(parsed.agentResponses.length, 1);
  assert.equal(parsed.agentResponses[0]?.confidence, 1);
  assert.equal(parsed.synthesis.confidence, 0.76);
});

test("parseTypeCMultiAgentInsight rejects malformed response", () => {
  assert.throws(() => parseTypeCMultiAgentInsight({ agentResponses: [] }));
});

test("safeTypeCMultiAgentInsight returns fallback for malformed response", () => {
  const fallback = safeTypeCMultiAgentInsight({ no: true });
  assert.equal(fallback.synthesis.executiveSummary, fallbackTypeCMultiAgentInsight().synthesis.executiveSummary);
  assert.equal(fallback.synthesis.confidence, 0.25);
});

test("parseTypeCMultiAgentInsight clamps output length and agent count", () => {
  const long = "x".repeat(900);
  const parsed = parseTypeCMultiAgentInsight({
    agentResponses: Array.from({ length: 8 }, (_, index) => ({
      agent: `Agent ${index}`,
      insight: long,
      concerns: [long, long, long, long, long],
      recommendations: [long],
      confidence: 0.5,
    })),
    synthesis: {
      executiveSummary: long,
      strategicRecommendation: long,
      cautionAreas: [long, long, long, long, long],
      confidence: 0.5,
    },
  });
  assert.equal(parsed.agentResponses.length, 6);
  assert.ok(parsed.synthesis.executiveSummary.length <= 460);
  assert.ok(parsed.agentResponses.every((agent) => agent.insight.length <= 360));
  assert.equal(parsed.synthesis.cautionAreas.length, 4);
});
