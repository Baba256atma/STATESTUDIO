/**
 * D:1 — Dashboard Decision Binding.
 *
 * Exposes recommended option, alternative options, scores, tradeoffs, and ranking
 * to Dashboard surfaces. Read-only presentation binding with no execution authority.
 */

import type { ExecutiveRecommendation } from "./recommendationEngineContract.ts";
import type { TradeoffProfile } from "./tradeoffAnalysisEngineContract.ts";
import {
  DASHBOARD_DECISION_BINDING_DIAGNOSTIC,
  DASHBOARD_DECISION_BINDING_DIAGNOSTICS,
  DECISION_BINDING_VERSION,
  EMPTY_DASHBOARD_DECISION_BINDING_RESULT,
  type DashboardDecisionAlternativeOptionView,
  type DashboardDecisionBindingResult,
  type DashboardDecisionBindingView,
  type DashboardDecisionRankingView,
  type DashboardDecisionRecommendedOptionView,
  type DashboardDecisionScoreView,
  type DashboardDecisionTradeoffView,
  type DecisionBindingBuildInput,
} from "./decisionBindingContract.ts";

export {
  ASSISTANT_DECISION_BINDING_DIAGNOSTIC,
  D1_BINDING_COMPLETE_TAG,
  DASHBOARD_DECISION_BINDING_DIAGNOSTIC,
  DECISION_BINDING_DIAGNOSTICS,
  DECISION_BINDING_VERSION,
  EMPTY_DASHBOARD_DECISION_BINDING_RESULT,
  type DashboardDecisionBindingResult,
  type DashboardDecisionBindingView,
  type DecisionBindingBuildInput,
} from "./decisionBindingContract.ts";

let latestDashboardDecisionBindingResult: DashboardDecisionBindingResult =
  EMPTY_DASHBOARD_DECISION_BINDING_RESULT;

function buildRecommendedOptionView(
  recommendation: ExecutiveRecommendation
): DashboardDecisionRecommendedOptionView | null {
  const recommended = recommendation.recommendedOption;
  if (!recommended) return null;
  return Object.freeze({
    optionId: recommended.option.optionId,
    label: recommended.option.label,
    summary: recommended.option.summary,
    compositeScore: recommended.compositeScore,
    decisionScore: recommended.score.value,
    confidence: recommended.score.confidence,
    readOnly: true as const,
    mutation: false as const,
    executesActions: false as const,
  });
}

function buildAlternativeOptionViews(
  recommendation: ExecutiveRecommendation
): readonly DashboardDecisionAlternativeOptionView[] {
  return Object.freeze(
    recommendation.alternativeOptions.map((alternative) =>
      Object.freeze({
        optionId: alternative.option.optionId,
        label: alternative.option.label,
        summary: alternative.option.summary,
        rank: alternative.rank,
        compositeScore: alternative.compositeScore,
        readOnly: true as const,
        mutation: false as const,
        executesActions: false as const,
      })
    )
  );
}

function buildScoreViews(recommendation: ExecutiveRecommendation): readonly DashboardDecisionScoreView[] {
  const scores = [
    ...(recommendation.recommendedOption ? [recommendation.recommendedOption.score] : []),
    ...recommendation.alternativeOptions.map((alternative) => alternative.score),
  ];
  return Object.freeze(
    scores.map((score) =>
      Object.freeze({
        scoreId: score.scoreId,
        optionId: score.optionId,
        value: score.value,
        confidence: score.confidence,
        dimensions: Object.freeze(
          score.dimensions.map((dimension) =>
            Object.freeze({
              dimensionId: dimension.dimensionId,
              label: dimension.label,
              value: dimension.value,
            })
          )
        ),
        readOnly: true as const,
        mutation: false as const,
      })
    )
  );
}

function buildTradeoffViews(tradeoffProfile: TradeoffProfile): readonly DashboardDecisionTradeoffView[] {
  const comparisons =
    tradeoffProfile.primaryComparison != null
      ? [tradeoffProfile.primaryComparison]
      : tradeoffProfile.comparisons;
  return Object.freeze(
    comparisons.flatMap((comparison) =>
      comparison.dimensions
        .filter((dimension) => Math.abs(dimension.delta) >= 3)
        .map((dimension) =>
          Object.freeze({
            dimensionId: dimension.dimensionId,
            label: dimension.label,
            summary: dimension.summary,
            favoredOptionId: dimension.favoredOptionId,
            readOnly: true as const,
            mutation: false as const,
          })
        )
    )
  );
}

function buildRankingViews(recommendation: ExecutiveRecommendation): readonly DashboardDecisionRankingView[] {
  return Object.freeze(
    recommendation.ranking.map((entry) =>
      Object.freeze({
        optionId: entry.optionId,
        label: entry.label,
        rank: entry.rank,
        compositeScore: entry.compositeScore,
        readOnly: true as const,
        mutation: false as const,
      })
    )
  );
}

function buildDashboardView(input: DecisionBindingBuildInput): DashboardDecisionBindingView | null {
  if (!input.recommendation.recommendedOption) return null;
  return Object.freeze({
    recommendationId: input.recommendation.recommendationId,
    recommendedOption: buildRecommendedOptionView(input.recommendation),
    alternativeOptions: buildAlternativeOptionViews(input.recommendation),
    scores: buildScoreViews(input.recommendation),
    tradeoffs: buildTradeoffViews(input.tradeoffProfile),
    ranking: buildRankingViews(input.recommendation),
    bindingStatus: "bound" as const,
    bindingReady: true as const,
    readOnly: true as const,
    executesRecommendations: false as const,
    mutation: false as const,
  });
}

export function resolveDashboardDecisionBinding(
  input: DecisionBindingBuildInput
): DashboardDecisionBindingResult {
  const view = buildDashboardView(input);
  latestDashboardDecisionBindingResult = Object.freeze({
    version: DECISION_BINDING_VERSION,
    boundAt: input.boundAt,
    view,
    bindingStatus: view ? ("bound" as const) : ("missing_recommendation" as const),
    readOnly: true as const,
    executesRecommendations: false as const,
    mutation: false as const,
    sourceMutation: false as const,
    sceneMutation: false as const,
    topologyMutation: false as const,
    routingMutation: false as const,
    dsMutation: false as const,
    simulationMutation: false as const,
    diagnostics: DASHBOARD_DECISION_BINDING_DIAGNOSTICS,
  });
  return latestDashboardDecisionBindingResult;
}

export function getDashboardDecisionBindingResult(): DashboardDecisionBindingResult {
  return latestDashboardDecisionBindingResult;
}

export function resetDashboardDecisionBindingForTests(): void {
  latestDashboardDecisionBindingResult = EMPTY_DASHBOARD_DECISION_BINDING_RESULT;
}

export const DashboardDecisionBinding = Object.freeze({
  resolveDashboardDecisionBinding,
  getDashboardDecisionBindingResult,
  resetDashboardDecisionBindingForTests,
  diagnostic: DASHBOARD_DECISION_BINDING_DIAGNOSTIC,
  emptyResult: EMPTY_DASHBOARD_DECISION_BINDING_RESULT,
});
