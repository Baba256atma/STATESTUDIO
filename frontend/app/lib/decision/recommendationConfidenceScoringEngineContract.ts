/**
 * D:2:4 — Recommendation Confidence Scoring Engine contract.
 *
 * Read-only contracts for calculating recommendation confidence from decision
 * scores, evidence strength, uncertainty, and tradeoff profiles without
 * changing recommendation ranking or mutating source intelligence.
 */

import type { DecisionConfidenceLevel } from "./DecisionConfidenceContract.ts";
import type { DecisionScore } from "./DecisionRecommendationContract.ts";
import type { EvidenceStrengthScore } from "./evidenceStrengthEngineContract.ts";
import type { TradeoffProfile } from "./tradeoffAnalysisEngineContract.ts";
import type { UncertaintyProfile } from "./uncertaintyDetectionEngineContract.ts";

export const RECOMMENDATION_CONFIDENCE_ENGINE_DIAGNOSTIC =
  "[RECOMMENDATION_CONFIDENCE_ENGINE]" as const;

export const RECOMMENDATION_CONFIDENCE_READY_DIAGNOSTIC =
  "[RECOMMENDATION_CONFIDENCE_READY]" as const;

export const D2_RECOMMENDATION_CONFIDENCE_COMPLETE_TAG =
  "[D2_RECOMMENDATION_CONFIDENCE_COMPLETE]" as const;

export const RECOMMENDATION_CONFIDENCE_SCORING_ENGINE_VERSION = "1.0.0" as const;

export const RECOMMENDATION_CONFIDENCE_WEIGHTS = Object.freeze({
  decisionScore: 25,
  evidenceStrength: 30,
  uncertaintyInverse: 25,
  tradeoffClarity: 20,
} as const);

export type EvidenceStrengthProfile = Readonly<{
  profileId: string;
  recommendationId: string;
  optionId: string;
  strengthScore: number;
  evidenceCount: number;
  dimensionCount: number;
  readOnly: true;
  mutation: false;
}>;

export type RecommendationConfidenceDriver = Readonly<{
  driverId: string;
  label: string;
  impact: "positive" | "negative" | "neutral";
  contribution: number;
  readOnly: true;
  mutation: false;
}>;

export type RecommendationConfidenceScore = Readonly<{
  scoreId: string;
  recommendationId: string;
  optionId: string;
  rank: number | null;
  confidenceScore: number;
  confidenceLevel: DecisionConfidenceLevel;
  confidenceLabel: string;
  confidenceDrivers: readonly RecommendationConfidenceDriver[];
  rankingPreserved: true;
  readOnly: true;
  mutation: false;
}>;

export type RecommendationConfidenceScoringInput = Readonly<{
  evaluatedAt: string;
  recommendationId: string;
  optionId: string;
  rank: number | null;
  score: DecisionScore;
  evidenceStrength: EvidenceStrengthProfile;
  uncertainty: UncertaintyProfile;
  tradeoff: TradeoffProfile;
}>;

export type RecommendationConfidenceBatchInput = Readonly<{
  evaluatedAt: string;
  entries: readonly RecommendationConfidenceScoringInput[];
}>;

export type RecommendationConfidenceBatchResult = Readonly<{
  version: typeof RECOMMENDATION_CONFIDENCE_SCORING_ENGINE_VERSION;
  evaluatedAt: string;
  scores: readonly RecommendationConfidenceScore[];
  scoreCount: number;
  rankingPreserved: true;
  readOnly: true;
  mutation: false;
  sourceMutation: false;
  sceneMutation: false;
  topologyMutation: false;
  routingMutation: false;
  dsMutation: false;
  simulationMutation: false;
  diagnostics: readonly [
    typeof RECOMMENDATION_CONFIDENCE_ENGINE_DIAGNOSTIC,
    typeof RECOMMENDATION_CONFIDENCE_READY_DIAGNOSTIC,
  ];
}>;

export const RECOMMENDATION_CONFIDENCE_ENGINE_DIAGNOSTICS = Object.freeze([
  RECOMMENDATION_CONFIDENCE_ENGINE_DIAGNOSTIC,
  RECOMMENDATION_CONFIDENCE_READY_DIAGNOSTIC,
] as const);

export const EMPTY_RECOMMENDATION_CONFIDENCE_BATCH_RESULT: RecommendationConfidenceBatchResult =
  Object.freeze({
    version: RECOMMENDATION_CONFIDENCE_SCORING_ENGINE_VERSION,
    evaluatedAt: "",
    scores: Object.freeze([]),
    scoreCount: 0,
    rankingPreserved: true,
    readOnly: true,
    mutation: false,
    sourceMutation: false,
    sceneMutation: false,
    topologyMutation: false,
    routingMutation: false,
    dsMutation: false,
    simulationMutation: false,
    diagnostics: RECOMMENDATION_CONFIDENCE_ENGINE_DIAGNOSTICS,
  });

export function buildEvidenceStrengthProfile(
  score: EvidenceStrengthScore
): EvidenceStrengthProfile {
  return Object.freeze({
    profileId: score.scoreId,
    recommendationId: score.recommendationId,
    optionId: score.optionId,
    strengthScore: score.value,
    evidenceCount: score.evidenceCount,
    dimensionCount: score.dimensions.length,
    readOnly: true as const,
    mutation: false as const,
  });
}
