/**
 * D:1 — Recommendation Engine.
 *
 * Generates executive recommendations from decision scores, tradeoff profiles,
 * and war room priorities. Produces recommended option, alternative options,
 * and ranking without executing recommendations or mutating source systems.
 */

import type { DecisionOption, DecisionScore } from "./DecisionRecommendationContract.ts";
import type { TradeoffProfile } from "./tradeoffAnalysisEngineContract.ts";
import type { WarRoomPriority, WarRoomPriorityLevel } from "../warroom/WarRoomContract.ts";
import {
  EMPTY_EXECUTIVE_RECOMMENDATION,
  RECOMMENDATION_ENGINE_DIAGNOSTICS,
  RECOMMENDATION_ENGINE_VERSION,
  type AlternativeOption,
  type ExecutiveRecommendation,
  type RecommendationEngineInput,
  type RecommendationRankingEntry,
  type RecommendedOption,
} from "./recommendationEngineContract.ts";

export {
  D1_RECOMMENDATION_COMPLETE_TAG,
  EMPTY_EXECUTIVE_RECOMMENDATION,
  RECOMMENDATION_ENGINE_DIAGNOSTIC,
  RECOMMENDATION_ENGINE_DIAGNOSTICS,
  RECOMMENDATION_ENGINE_VERSION,
  RECOMMENDATION_READY_DIAGNOSTIC,
  type AlternativeOption,
  type ExecutiveRecommendation,
  type RecommendationEngineInput,
  type RecommendationRankingEntry,
  type RecommendedOption,
} from "./recommendationEngineContract.ts";

let latestExecutiveRecommendation: ExecutiveRecommendation = EMPTY_EXECUTIVE_RECOMMENDATION;

type RankedCandidate = Readonly<{
  option: DecisionOption;
  score: DecisionScore;
  compositeScore: number;
  tradeoffWins: number;
  priorityAlignment: number;
}>;

function clampScore(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value)));
}

function resolveScore(option: DecisionOption, scores: readonly DecisionScore[]): DecisionScore {
  const score = scores.find((entry) => entry.optionId === option.optionId);
  if (!score) {
    throw new Error(`Missing DecisionScore for option ${option.optionId}`);
  }
  return score;
}

function priorityWeight(level: WarRoomPriorityLevel): number {
  if (level === "critical") return 4;
  if (level === "high") return 3;
  if (level === "medium") return 2;
  return 1;
}

function tradeoffWinsForOption(optionId: string, tradeoffProfile: TradeoffProfile): number {
  return tradeoffProfile.comparisons.reduce((sum, comparison) => {
    if (comparison.optionAId !== optionId && comparison.optionBId !== optionId) {
      return sum;
    }
    return (
      sum +
      comparison.dimensions.filter((dimension) => dimension.favoredOptionId === optionId).length
    );
  }, 0);
}

function tradeoffOpportunitiesForOption(optionId: string, tradeoffProfile: TradeoffProfile): number {
  return tradeoffProfile.comparisons.reduce((sum, comparison) => {
    if (comparison.optionAId === optionId || comparison.optionBId === optionId) {
      return sum + comparison.dimensions.length;
    }
    return sum;
  }, 0);
}

function priorityAlignment(option: DecisionOption, priorities: readonly WarRoomPriority[]): number {
  if (priorities.length === 0) return 50;
  const topPriority = priorities[0];
  if (!topPriority) return 50;

  const urgency = priorityWeight(topPriority.level) * 20;
  const category = option.category;

  if (topPriority.level === "critical" || topPriority.level === "high") {
    if (category === "stabilize" || category === "reduce_risk" || category === "protect") return 100;
    if (category === "monitor" || category === "investigate") return 25;
  }

  if (topPriority.level === "low") {
    if (category === "monitor" || category === "optimize") return 90;
    if (category === "stabilize") return 40;
  }

  return clampScore(50 + urgency * 0.25);
}

function compositeScore(input: {
  option: DecisionOption;
  score: DecisionScore;
  tradeoffProfile: TradeoffProfile;
  warRoomPriorities: readonly WarRoomPriority[];
}): RankedCandidate {
  const tradeoffWins = tradeoffWinsForOption(input.option.optionId, input.tradeoffProfile);
  const tradeoffOpportunities = Math.max(1, tradeoffOpportunitiesForOption(input.option.optionId, input.tradeoffProfile));
  const alignment = priorityAlignment(input.option, input.warRoomPriorities);
  const tradeoffContribution = (tradeoffWins / tradeoffOpportunities) * 15;
  const composite = clampScore(
    input.score.value * 0.55 +
      input.score.confidence * 0.2 +
      tradeoffContribution +
      alignment * 0.1
  );

  return Object.freeze({
    option: input.option,
    score: input.score,
    compositeScore: composite,
    tradeoffWins,
    priorityAlignment: alignment,
  });
}

function buildRationale(candidate: RankedCandidate, rank: number): string {
  return `Rank ${rank} with composite score ${candidate.compositeScore}. Decision score ${candidate.score.value}, confidence ${candidate.score.confidence}. Tradeoff profile favors this option on ${candidate.tradeoffWins} dimensions. War room priority alignment ${candidate.priorityAlignment}.`;
}

function compareCandidates(a: RankedCandidate, b: RankedCandidate): number {
  return (
    b.compositeScore - a.compositeScore ||
    b.score.value - a.score.value ||
    b.score.confidence - a.score.confidence ||
    a.option.optionId.localeCompare(b.option.optionId)
  );
}

function buildRankingEntry(candidate: RankedCandidate, rank: number): RecommendationRankingEntry {
  return Object.freeze({
    optionId: candidate.option.optionId,
    label: candidate.option.label,
    rank,
    compositeScore: candidate.compositeScore,
    readOnly: true as const,
    mutation: false as const,
  });
}

function buildRecommendedOption(candidate: RankedCandidate): RecommendedOption {
  return Object.freeze({
    option: candidate.option,
    score: candidate.score,
    rank: 1 as const,
    compositeScore: candidate.compositeScore,
    rationale: buildRationale(candidate, 1),
    readOnly: true as const,
    mutation: false as const,
    executesActions: false as const,
  });
}

function buildAlternativeOption(candidate: RankedCandidate, rank: number): AlternativeOption {
  return Object.freeze({
    option: candidate.option,
    score: candidate.score,
    rank,
    compositeScore: candidate.compositeScore,
    rationale: buildRationale(candidate, rank),
    readOnly: true as const,
    mutation: false as const,
    executesActions: false as const,
  });
}

export function generateExecutiveRecommendation(
  input: RecommendationEngineInput
): ExecutiveRecommendation {
  const ranked = Object.freeze(
    input.options
      .map((option) =>
        compositeScore({
          option,
          score: resolveScore(option, input.scores),
          tradeoffProfile: input.tradeoffProfile,
          warRoomPriorities: input.warRoomPriorities,
        })
      )
      .sort(compareCandidates)
  );

  const ranking = Object.freeze(
    ranked.map((candidate, index) => buildRankingEntry(candidate, index + 1))
  );
  const topCandidate = ranked[0] ?? null;
  const recommendedOption = topCandidate ? buildRecommendedOption(topCandidate) : null;
  const alternativeOptions = Object.freeze(
    ranked.slice(1).map((candidate, index) => buildAlternativeOption(candidate, index + 2))
  );

  latestExecutiveRecommendation = Object.freeze({
    version: RECOMMENDATION_ENGINE_VERSION,
    recommendationId: input.recommendationId,
    generatedAt: input.generatedAt,
    recommendedOption,
    alternativeOptions,
    ranking,
    rankingCount: ranking.length,
    executesRecommendations: false as const,
    readOnly: true as const,
    mutation: false as const,
    sourceMutation: false as const,
    sceneMutation: false as const,
    topologyMutation: false as const,
    routingMutation: false as const,
    dsMutation: false as const,
    simulationMutation: false as const,
    diagnostics: RECOMMENDATION_ENGINE_DIAGNOSTICS,
  });

  return latestExecutiveRecommendation;
}

export function getExecutiveRecommendation(): ExecutiveRecommendation {
  return latestExecutiveRecommendation;
}

export function resetRecommendationEngineForTests(): void {
  latestExecutiveRecommendation = EMPTY_EXECUTIVE_RECOMMENDATION;
}

export const RecommendationEngine = Object.freeze({
  generateExecutiveRecommendation,
  getExecutiveRecommendation,
  resetRecommendationEngineForTests,
  diagnostics: RECOMMENDATION_ENGINE_DIAGNOSTICS,
  emptyRecommendation: EMPTY_EXECUTIVE_RECOMMENDATION,
});
