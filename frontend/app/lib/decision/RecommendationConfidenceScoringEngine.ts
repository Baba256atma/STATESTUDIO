/**
 * D:2:4 — Recommendation Confidence Scoring Engine.
 *
 * Calculates confidence for each recommendation from DecisionScore,
 * EvidenceStrengthProfile, UncertaintyProfile, and TradeoffProfile inputs.
 * Preserves recommendation ranking and produces read-only confidence outputs.
 */

import {
  DECISION_CONFIDENCE_LEVEL_LABELS,
  resolveDecisionConfidenceLevel,
} from "./DecisionConfidenceContract.ts";
import {
  buildEvidenceStrengthProfile,
  EMPTY_RECOMMENDATION_CONFIDENCE_BATCH_RESULT,
  RECOMMENDATION_CONFIDENCE_ENGINE_DIAGNOSTICS,
  RECOMMENDATION_CONFIDENCE_SCORING_ENGINE_VERSION,
  RECOMMENDATION_CONFIDENCE_WEIGHTS,
  type RecommendationConfidenceBatchInput,
  type RecommendationConfidenceBatchResult,
  type RecommendationConfidenceDriver,
  type RecommendationConfidenceScore,
  type RecommendationConfidenceScoringInput,
} from "./recommendationConfidenceScoringEngineContract.ts";

export {
  buildEvidenceStrengthProfile,
  D2_RECOMMENDATION_CONFIDENCE_COMPLETE_TAG,
  EMPTY_RECOMMENDATION_CONFIDENCE_BATCH_RESULT,
  RECOMMENDATION_CONFIDENCE_ENGINE_DIAGNOSTIC,
  RECOMMENDATION_CONFIDENCE_ENGINE_DIAGNOSTICS,
  RECOMMENDATION_CONFIDENCE_READY_DIAGNOSTIC,
  RECOMMENDATION_CONFIDENCE_SCORING_ENGINE_VERSION,
  RECOMMENDATION_CONFIDENCE_WEIGHTS,
  type EvidenceStrengthProfile,
  type RecommendationConfidenceBatchInput,
  type RecommendationConfidenceBatchResult,
  type RecommendationConfidenceDriver,
  type RecommendationConfidenceScore,
  type RecommendationConfidenceScoringInput,
} from "./recommendationConfidenceScoringEngineContract.ts";

let latestRecommendationConfidenceResult: RecommendationConfidenceBatchResult =
  EMPTY_RECOMMENDATION_CONFIDENCE_BATCH_RESULT;

function clampScore(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value)));
}

function average(values: readonly number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function scoreDecisionScoreConfidence(input: RecommendationConfidenceScoringInput): number {
  return clampScore((input.score.confidence + input.score.value) / 2);
}

function scoreUncertaintyInverse(input: RecommendationConfidenceScoringInput): number {
  const penalty = input.uncertainty.aggregateUncertainty;
  const findingPenalty = Math.min(20, input.uncertainty.findingCount * 2);
  return clampScore(100 - penalty - findingPenalty);
}

function scoreTradeoffClarity(input: RecommendationConfidenceScoringInput): number {
  const optionProfile = input.tradeoff.optionProfiles.find(
    (profile) => profile.optionId === input.optionId
  );
  if (!optionProfile) return 0;

  const axisScores = optionProfile.axes.map((axis) => {
    if (axis.dimensionId === "cost") {
      return clampScore(100 - axis.value);
    }
    return axis.value;
  });

  const comparisonBoost =
    input.tradeoff.comparisons.filter(
      (comparison) =>
        comparison.optionAId === input.optionId || comparison.optionBId === input.optionId
    ).length > 0
      ? 6
      : 0;

  return clampScore(average(axisScores) + comparisonBoost);
}

function buildDriver(input: {
  driverId: string;
  label: string;
  impact: RecommendationConfidenceDriver["impact"];
  contribution: number;
}): RecommendationConfidenceDriver {
  return Object.freeze({
    driverId: input.driverId,
    label: input.label,
    impact: input.impact,
    contribution: clampScore(input.contribution),
    readOnly: true as const,
    mutation: false as const,
  });
}

function buildConfidenceDrivers(input: {
  scoringInput: RecommendationConfidenceScoringInput;
  decisionScoreComponent: number;
  evidenceStrengthComponent: number;
  uncertaintyComponent: number;
  tradeoffComponent: number;
}): readonly RecommendationConfidenceDriver[] {
  const evidenceImpact: RecommendationConfidenceDriver["impact"] =
    input.scoringInput.evidenceStrength.strengthScore >= 60 ? "positive" : "negative";
  const uncertaintyImpact: RecommendationConfidenceDriver["impact"] =
    input.scoringInput.uncertainty.aggregateUncertainty >= 55 ? "negative" : "neutral";
  const tradeoffImpact: RecommendationConfidenceDriver["impact"] =
    input.tradeoffComponent >= 55 ? "positive" : "neutral";

  return Object.freeze([
    buildDriver({
      driverId: "decision-score-confidence",
      label: "Decision score confidence",
      impact: input.decisionScoreComponent >= 55 ? "positive" : "neutral",
      contribution: input.decisionScoreComponent * (RECOMMENDATION_CONFIDENCE_WEIGHTS.decisionScore / 100),
    }),
    buildDriver({
      driverId: "evidence-strength",
      label: "Evidence strength",
      impact: evidenceImpact,
      contribution:
        input.evidenceStrengthComponent * (RECOMMENDATION_CONFIDENCE_WEIGHTS.evidenceStrength / 100),
    }),
    buildDriver({
      driverId: "uncertainty-adjustment",
      label: "Uncertainty adjustment",
      impact: uncertaintyImpact,
      contribution:
        input.uncertaintyComponent * (RECOMMENDATION_CONFIDENCE_WEIGHTS.uncertaintyInverse / 100),
    }),
    buildDriver({
      driverId: "tradeoff-clarity",
      label: "Tradeoff clarity",
      impact: tradeoffImpact,
      contribution: input.tradeoffComponent * (RECOMMENDATION_CONFIDENCE_WEIGHTS.tradeoffClarity / 100),
    }),
  ]);
}

export function scoreRecommendationConfidence(
  input: RecommendationConfidenceScoringInput
): RecommendationConfidenceScore {
  const decisionScoreComponent = scoreDecisionScoreConfidence(input);
  const evidenceStrengthComponent = clampScore(input.evidenceStrength.strengthScore);
  const uncertaintyComponent = scoreUncertaintyInverse(input);
  const tradeoffComponent = scoreTradeoffClarity(input);

  const confidenceScore = clampScore(
    decisionScoreComponent * (RECOMMENDATION_CONFIDENCE_WEIGHTS.decisionScore / 100) +
      evidenceStrengthComponent * (RECOMMENDATION_CONFIDENCE_WEIGHTS.evidenceStrength / 100) +
      uncertaintyComponent * (RECOMMENDATION_CONFIDENCE_WEIGHTS.uncertaintyInverse / 100) +
      tradeoffComponent * (RECOMMENDATION_CONFIDENCE_WEIGHTS.tradeoffClarity / 100)
  );

  const sufficientEvidence =
    input.evidenceStrength.evidenceCount >= 2 && input.evidenceStrength.strengthScore >= 45;
  const confidenceLevel = resolveDecisionConfidenceLevel({
    confidenceScore,
    evidenceCount: input.evidenceStrength.evidenceCount,
    sufficientEvidence,
  });

  return Object.freeze({
    scoreId: `recommendation-confidence:${input.recommendationId}:${input.evaluatedAt}`,
    recommendationId: input.recommendationId,
    optionId: input.optionId,
    rank: input.rank,
    confidenceScore,
    confidenceLevel,
    confidenceLabel: DECISION_CONFIDENCE_LEVEL_LABELS[confidenceLevel],
    confidenceDrivers: buildConfidenceDrivers({
      scoringInput: input,
      decisionScoreComponent,
      evidenceStrengthComponent,
      uncertaintyComponent,
      tradeoffComponent,
    }),
    rankingPreserved: true as const,
    readOnly: true as const,
    mutation: false as const,
  });
}

export function scoreRecommendationConfidences(
  input: RecommendationConfidenceBatchInput
): RecommendationConfidenceBatchResult {
  const scores = Object.freeze(input.entries.map((entry) => scoreRecommendationConfidence(entry)));

  latestRecommendationConfidenceResult = Object.freeze({
    version: RECOMMENDATION_CONFIDENCE_SCORING_ENGINE_VERSION,
    evaluatedAt: input.evaluatedAt,
    scores,
    scoreCount: scores.length,
    rankingPreserved: true as const,
    readOnly: true as const,
    mutation: false as const,
    sourceMutation: false as const,
    sceneMutation: false as const,
    topologyMutation: false as const,
    routingMutation: false as const,
    dsMutation: false as const,
    simulationMutation: false as const,
    diagnostics: RECOMMENDATION_CONFIDENCE_ENGINE_DIAGNOSTICS,
  });

  return latestRecommendationConfidenceResult;
}

export function getRecommendationConfidenceResult(): RecommendationConfidenceBatchResult {
  return latestRecommendationConfidenceResult;
}

export function resetRecommendationConfidenceScoringEngineForTests(): void {
  latestRecommendationConfidenceResult = EMPTY_RECOMMENDATION_CONFIDENCE_BATCH_RESULT;
}

export const RecommendationConfidenceScoringEngine = Object.freeze({
  scoreRecommendationConfidence,
  scoreRecommendationConfidences,
  getRecommendationConfidenceResult,
  resetRecommendationConfidenceScoringEngineForTests,
  buildEvidenceStrengthProfile,
  diagnostics: RECOMMENDATION_CONFIDENCE_ENGINE_DIAGNOSTICS,
  weights: RECOMMENDATION_CONFIDENCE_WEIGHTS,
  emptyResult: EMPTY_RECOMMENDATION_CONFIDENCE_BATCH_RESULT,
});
