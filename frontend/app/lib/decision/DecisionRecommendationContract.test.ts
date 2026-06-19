import test from "node:test";
import assert from "node:assert/strict";

import {
  buildDecisionExplanation,
  buildDecisionOption,
  buildDecisionRecommendation,
  buildDecisionRecommendationBundle,
  buildDecisionScore,
  D1_CONTRACT_COMPLETE_TAG,
  DECISION_CONTRACT_DIAGNOSTIC,
  DECISION_CONTRACT_READY_DIAGNOSTIC,
  DECISION_RECOMMENDATION_CONTRACT,
} from "./DecisionRecommendationContract.ts";

function sampleRecommendationInput(params: {
  recommendationId: string;
  optionId: string;
  label: string;
  value: number;
  priority: "low" | "medium" | "high" | "critical";
  rank?: number | null;
}) {
  return {
    recommendationId: params.recommendationId,
    rank: params.rank ?? null,
    priority: params.priority,
    option: {
      optionId: params.optionId,
      label: params.label,
      summary: `${params.label} summary`,
      category: "executive",
    },
    score: {
      scoreId: `score-${params.optionId}`,
      optionId: params.optionId,
      value: params.value,
      confidence: 88,
    },
    explanation: {
      explanationId: `explanation-${params.optionId}`,
      optionId: params.optionId,
      rationale: `${params.label} rationale`,
      evidenceIds: [`evidence-${params.optionId}`],
      tradeoffSummary: "Balanced tradeoff profile.",
    },
  };
}

test("exports D1 decision contract tag and diagnostics", () => {
  assert.equal(D1_CONTRACT_COMPLETE_TAG, "[D1_CONTRACT_COMPLETE]");
  assert.equal(DECISION_CONTRACT_DIAGNOSTIC, "[DECISION_CONTRACT]");
  assert.equal(DECISION_CONTRACT_READY_DIAGNOSTIC, "[DECISION_CONTRACT_READY]");
  assert.equal(DECISION_RECOMMENDATION_CONTRACT.supportsSingleRecommendation, true);
  assert.equal(DECISION_RECOMMENDATION_CONTRACT.supportsMultipleRecommendations, true);
  assert.equal(DECISION_RECOMMENDATION_CONTRACT.supportsRankedRecommendations, true);
  assert.equal(DECISION_RECOMMENDATION_CONTRACT.readOnly, true);
  assert.equal(DECISION_RECOMMENDATION_CONTRACT.mutation, false);
});

test("builds immutable decision option score explanation and recommendation", () => {
  const option = buildDecisionOption({
    optionId: "option-1",
    label: "Stabilize supplier risk",
    summary: "Reduce supplier exposure immediately.",
    category: "stabilize",
  });
  const score = buildDecisionScore({
    scoreId: "score-1",
    optionId: option.optionId,
    value: 150,
    confidence: 120,
    dimensions: [
      {
        dimensionId: "risk",
        label: "Risk reduction",
        value: 90,
        weight: 60,
      },
    ],
  });
  const explanation = buildDecisionExplanation({
    explanationId: "explanation-1",
    optionId: option.optionId,
    rationale: "Supplier risk crossed executive threshold.",
    evidenceIds: ["signal-supplier", "alert-supplier"],
    tradeoffSummary: "Short-term cost for long-term stability.",
  });
  const recommendation = buildDecisionRecommendation({
    recommendationId: "recommendation-1",
    rank: null,
    priority: "critical",
    option,
    score,
    explanation,
  });

  assert.equal(score.value, 100);
  assert.equal(score.confidence, 100);
  assert.equal(score.dimensions[0]?.value, 90);
  assert.equal(Object.isFrozen(option), true);
  assert.equal(Object.isFrozen(score), true);
  assert.equal(Object.isFrozen(score.dimensions), true);
  assert.equal(Object.isFrozen(explanation), true);
  assert.equal(Object.isFrozen(explanation.evidenceIds), true);
  assert.equal(Object.isFrozen(recommendation), true);
  assert.throws(() => {
    (explanation.evidenceIds as unknown as string[]).push("mutated");
  }, TypeError);
});

test("builds single recommendation bundle", () => {
  const recommendation = buildDecisionRecommendation(
    sampleRecommendationInput({
      recommendationId: "single-1",
      optionId: "option-single",
      label: "Single recommendation",
      value: 82,
      priority: "high",
    })
  );
  const bundle = buildDecisionRecommendationBundle({
    bundleId: "bundle-single",
    generatedAt: "2026-06-18T00:00:00.000Z",
    mode: "single",
    recommendations: [recommendation],
  });

  assert.equal(bundle.mode, "single");
  assert.equal(bundle.recommendationCount, 1);
  assert.equal(bundle.primaryRecommendation?.recommendationId, "single-1");
  assert.equal(bundle.topRankedRecommendation, null);
  assert.equal(bundle.sceneMutation, false);
  assert.equal(Object.isFrozen(bundle), true);
  assert.equal(Object.isFrozen(bundle.recommendations), true);
});

test("builds multiple recommendation bundle without ranking", () => {
  const first = buildDecisionRecommendation(
    sampleRecommendationInput({
      recommendationId: "multi-1",
      optionId: "option-a",
      label: "Option A",
      value: 70,
      priority: "medium",
    })
  );
  const second = buildDecisionRecommendation(
    sampleRecommendationInput({
      recommendationId: "multi-2",
      optionId: "option-b",
      label: "Option B",
      value: 75,
      priority: "high",
    })
  );
  const recommendations = Object.freeze([first, second]);
  const before = JSON.stringify(recommendations);

  const bundle = buildDecisionRecommendationBundle({
    bundleId: "bundle-multiple",
    generatedAt: "2026-06-18T00:01:00.000Z",
    mode: "multiple",
    recommendations,
  });

  assert.equal(bundle.mode, "multiple");
  assert.equal(bundle.recommendationCount, 2);
  assert.deepEqual(
    bundle.recommendations.map((entry) => entry.recommendationId),
    ["multi-1", "multi-2"]
  );
  assert.equal(bundle.primaryRecommendation?.recommendationId, "multi-1");
  assert.equal(bundle.topRankedRecommendation, null);
  assert.equal(JSON.stringify(recommendations), before);
});

test("builds ranked recommendation bundle without mutating input order", () => {
  const low = buildDecisionRecommendation(
    sampleRecommendationInput({
      recommendationId: "rank-low",
      optionId: "option-low",
      label: "Low score option",
      value: 40,
      priority: "low",
    })
  );
  const high = buildDecisionRecommendation(
    sampleRecommendationInput({
      recommendationId: "rank-high",
      optionId: "option-high",
      label: "High score option",
      value: 95,
      priority: "critical",
    })
  );
  const recommendations = Object.freeze([low, high]);
  const before = JSON.stringify(recommendations);

  const bundle = buildDecisionRecommendationBundle({
    bundleId: "bundle-ranked",
    generatedAt: "2026-06-18T00:02:00.000Z",
    mode: "ranked",
    recommendations,
  });

  assert.equal(bundle.mode, "ranked");
  assert.equal(bundle.recommendationCount, 2);
  assert.deepEqual(
    bundle.recommendations.map((entry) => entry.recommendationId),
    ["rank-high", "rank-low"]
  );
  assert.deepEqual(
    bundle.recommendations.map((entry) => entry.rank),
    [1, 2]
  );
  assert.equal(bundle.topRankedRecommendation?.recommendationId, "rank-high");
  assert.equal(bundle.primaryRecommendation?.recommendationId, "rank-high");
  assert.equal(JSON.stringify(recommendations), before);
});
