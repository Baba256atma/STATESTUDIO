/**
 * D:1 — Recommendation Engine contract.
 *
 * Read-only contracts for executive decision recommendations derived from
 * decision scores, tradeoff profiles, and war room priorities. Does not
 * execute recommendations or mutate source intelligence.
 */

import type { DecisionOption, DecisionScore } from "./DecisionRecommendationContract.ts";
import type { TradeoffProfile } from "./tradeoffAnalysisEngineContract.ts";
import type { WarRoomPriority } from "../warroom/WarRoomContract.ts";

export const RECOMMENDATION_ENGINE_DIAGNOSTIC = "[RECOMMENDATION_ENGINE]" as const;

export const RECOMMENDATION_READY_DIAGNOSTIC = "[RECOMMENDATION_READY]" as const;

export const D1_RECOMMENDATION_COMPLETE_TAG = "[D1_RECOMMENDATION_COMPLETE]" as const;

export const RECOMMENDATION_ENGINE_VERSION = "1.0.0" as const;

export type RecommendedOption = Readonly<{
  option: DecisionOption;
  score: DecisionScore;
  rank: 1;
  compositeScore: number;
  rationale: string;
  readOnly: true;
  mutation: false;
  executesActions: false;
}>;

export type AlternativeOption = Readonly<{
  option: DecisionOption;
  score: DecisionScore;
  rank: number;
  compositeScore: number;
  rationale: string;
  readOnly: true;
  mutation: false;
  executesActions: false;
}>;

export type RecommendationRankingEntry = Readonly<{
  optionId: string;
  label: string;
  rank: number;
  compositeScore: number;
  readOnly: true;
  mutation: false;
}>;

export type ExecutiveRecommendation = Readonly<{
  version: typeof RECOMMENDATION_ENGINE_VERSION;
  recommendationId: string;
  generatedAt: string;
  recommendedOption: RecommendedOption | null;
  alternativeOptions: readonly AlternativeOption[];
  ranking: readonly RecommendationRankingEntry[];
  rankingCount: number;
  executesRecommendations: false;
  readOnly: true;
  mutation: false;
  sourceMutation: false;
  sceneMutation: false;
  topologyMutation: false;
  routingMutation: false;
  dsMutation: false;
  simulationMutation: false;
  diagnostics: readonly [
    typeof RECOMMENDATION_ENGINE_DIAGNOSTIC,
    typeof RECOMMENDATION_READY_DIAGNOSTIC,
  ];
}>;

export type RecommendationEngineInput = Readonly<{
  recommendationId: string;
  generatedAt: string;
  options: readonly DecisionOption[];
  scores: readonly DecisionScore[];
  tradeoffProfile: TradeoffProfile;
  warRoomPriorities: readonly WarRoomPriority[];
}>;

export const RECOMMENDATION_ENGINE_DIAGNOSTICS = Object.freeze([
  RECOMMENDATION_ENGINE_DIAGNOSTIC,
  RECOMMENDATION_READY_DIAGNOSTIC,
] as const);

export const EMPTY_EXECUTIVE_RECOMMENDATION: ExecutiveRecommendation = Object.freeze({
  version: RECOMMENDATION_ENGINE_VERSION,
  recommendationId: "",
  generatedAt: "",
  recommendedOption: null,
  alternativeOptions: Object.freeze([]),
  ranking: Object.freeze([]),
  rankingCount: 0,
  executesRecommendations: false,
  readOnly: true,
  mutation: false,
  sourceMutation: false,
  sceneMutation: false,
  topologyMutation: false,
  routingMutation: false,
  dsMutation: false,
  simulationMutation: false,
  diagnostics: RECOMMENDATION_ENGINE_DIAGNOSTICS,
});
