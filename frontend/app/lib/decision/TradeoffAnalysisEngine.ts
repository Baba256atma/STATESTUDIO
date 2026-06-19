/**
 * D:1 — Tradeoff Analysis Engine.
 *
 * Identifies tradeoffs between decision alternatives across benefit, risk, cost,
 * pressure reduction, and KPI impact. Produces read-only TradeoffProfile outputs
 * from DecisionOption and DecisionScore inputs without mutating source systems.
 */

import type { DecisionOption, DecisionScore } from "./DecisionRecommendationContract.ts";
import {
  EMPTY_TRADEOFF_PROFILE,
  TRADEOFF_ANALYSIS_ENGINE_DIAGNOSTICS,
  TRADEOFF_ANALYSIS_ENGINE_VERSION,
  type TradeoffAnalysisInput,
  type TradeoffAxisValue,
  type TradeoffComparison,
  type TradeoffDimension,
  type TradeoffDimensionId,
  type TradeoffOptionProfile,
  type TradeoffProfile,
} from "./tradeoffAnalysisEngineContract.ts";

export {
  D1_TRADEOFF_ANALYSIS_COMPLETE_TAG,
  EMPTY_TRADEOFF_PROFILE,
  TRADEOFF_ANALYSIS_ENGINE_DIAGNOSTIC,
  TRADEOFF_ANALYSIS_ENGINE_DIAGNOSTICS,
  TRADEOFF_ANALYSIS_ENGINE_VERSION,
  TRADEOFF_ANALYSIS_READY_DIAGNOSTIC,
  type TradeoffAnalysisInput,
  type TradeoffAxisValue,
  type TradeoffComparison,
  type TradeoffDimension,
  type TradeoffDimensionId,
  type TradeoffOptionProfile,
  type TradeoffProfile,
} from "./tradeoffAnalysisEngineContract.ts";

let latestTradeoffProfile: TradeoffProfile = EMPTY_TRADEOFF_PROFILE;

const TRADEOFF_DIMENSIONS = Object.freeze([
  { dimensionId: "benefit" as const, label: "Benefit", lowerIsBetter: false },
  { dimensionId: "risk" as const, label: "Risk", lowerIsBetter: false },
  { dimensionId: "cost" as const, label: "Cost", lowerIsBetter: true },
  { dimensionId: "pressureReduction" as const, label: "Pressure Reduction", lowerIsBetter: false },
  { dimensionId: "kpiImpact" as const, label: "KPI Impact", lowerIsBetter: false },
]);

function clampScore(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value)));
}

function dimensionValue(
  score: DecisionScore,
  dimensionId: "impact" | "risk" | "kpiEffect" | "scenarioOutcome" | "warRoomPressure"
): number {
  return score.dimensions.find((dimension) => dimension.dimensionId === dimensionId)?.value ?? 0;
}

function categoryCost(category: string | undefined): number {
  if (category === "stabilize") return 78;
  if (category === "reduce_risk") return 68;
  if (category === "protect") return 62;
  if (category === "diversify") return 58;
  if (category === "rebalance") return 52;
  if (category === "optimize") return 46;
  if (category === "investigate") return 38;
  if (category === "monitor") return 22;
  return 50;
}

function axisValues(option: DecisionOption, score: DecisionScore): Record<TradeoffDimensionId, number> {
  const impact = dimensionValue(score, "impact");
  const scenarioOutcome = dimensionValue(score, "scenarioOutcome");
  return {
    benefit: clampScore((impact + scenarioOutcome) / 2),
    risk: clampScore(dimensionValue(score, "risk")),
    cost: clampScore(categoryCost(option.category)),
    pressureReduction: clampScore(dimensionValue(score, "warRoomPressure")),
    kpiImpact: clampScore(dimensionValue(score, "kpiEffect")),
  };
}

function buildAxisValue(
  dimensionId: TradeoffDimensionId,
  label: string,
  value: number
): TradeoffAxisValue {
  return Object.freeze({
    dimensionId,
    label,
    value: clampScore(value),
    readOnly: true as const,
    mutation: false as const,
  });
}

export function buildTradeoffOptionProfile(input: {
  option: DecisionOption;
  score: DecisionScore;
}): TradeoffOptionProfile {
  const values = axisValues(input.option, input.score);
  return Object.freeze({
    optionId: input.option.optionId,
    label: input.option.label,
    axes: Object.freeze(
      TRADEOFF_DIMENSIONS.map((dimension) =>
        buildAxisValue(dimension.dimensionId, dimension.label, values[dimension.dimensionId])
      )
    ),
    readOnly: true as const,
    mutation: false as const,
  });
}

function buildTradeoffDimension(input: {
  dimensionId: TradeoffDimensionId;
  label: string;
  optionAId: string;
  optionBId: string;
  optionAValue: number;
  optionBValue: number;
  lowerIsBetter: boolean;
}): TradeoffDimension {
  const delta = input.optionAValue - input.optionBValue;
  let favoredOptionId: string | "neutral" = "neutral";
  if (input.lowerIsBetter) {
    if (delta <= -3) favoredOptionId = input.optionAId;
    else if (delta >= 3) favoredOptionId = input.optionBId;
  } else if (delta >= 3) {
    favoredOptionId = input.optionAId;
  } else if (delta <= -3) {
    favoredOptionId = input.optionBId;
  }

  const summary =
    favoredOptionId === "neutral"
      ? `${input.label} is broadly similar between options.`
      : `${input.label} favors option ${favoredOptionId}.`;

  return Object.freeze({
    dimensionId: input.dimensionId,
    label: input.label,
    optionAId: input.optionAId,
    optionBId: input.optionBId,
    optionAValue: clampScore(input.optionAValue),
    optionBValue: clampScore(input.optionBValue),
    delta,
    favoredOptionId,
    summary,
    readOnly: true as const,
    mutation: false as const,
  });
}

function comparisonMagnitude(comparison: TradeoffComparison): number {
  return comparison.dimensions.reduce((sum, dimension) => sum + Math.abs(dimension.delta), 0);
}

function primaryDimensionForComparison(
  dimensions: readonly TradeoffDimension[]
): TradeoffDimensionId | null {
  const ranked = [...dimensions].sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta));
  const primary = ranked[0];
  return primary && Math.abs(primary.delta) >= 3 ? primary.dimensionId : null;
}

export function compareTradeoffOptions(input: {
  comparisonId: string;
  optionA: DecisionOption;
  optionB: DecisionOption;
  scoreA: DecisionScore;
  scoreB: DecisionScore;
}): TradeoffComparison {
  const axesA = axisValues(input.optionA, input.scoreA);
  const axesB = axisValues(input.optionB, input.scoreB);
  const dimensions = Object.freeze(
    TRADEOFF_DIMENSIONS.map((dimension) =>
      buildTradeoffDimension({
        dimensionId: dimension.dimensionId,
        label: dimension.label,
        optionAId: input.optionA.optionId,
        optionBId: input.optionB.optionId,
        optionAValue: axesA[dimension.dimensionId],
        optionBValue: axesB[dimension.dimensionId],
        lowerIsBetter: dimension.lowerIsBetter,
      })
    )
  );
  const primaryDimension = primaryDimensionForComparison(dimensions);
  const tradeoffCount = dimensions.filter((dimension) => Math.abs(dimension.delta) >= 3).length;
  const primary = dimensions.find((dimension) => dimension.dimensionId === primaryDimension);
  const summary =
    primary && primary.favoredOptionId !== "neutral"
      ? `Primary tradeoff on ${primary.label}: ${primary.summary}`
      : "No material tradeoff separation identified between options.";

  return Object.freeze({
    comparisonId: input.comparisonId,
    optionAId: input.optionA.optionId,
    optionBId: input.optionB.optionId,
    dimensions,
    primaryDimension,
    tradeoffCount,
    summary,
    readOnly: true as const,
    mutation: false as const,
  });
}

function resolveScoreForOption(option: DecisionOption, scores: readonly DecisionScore[]): DecisionScore {
  const score = scores.find((entry) => entry.optionId === option.optionId);
  if (!score) {
    throw new Error(`Missing DecisionScore for option ${option.optionId}`);
  }
  return score;
}

export function analyzeTradeoffs(input: TradeoffAnalysisInput): TradeoffProfile {
  const optionProfiles = Object.freeze(
    input.options.map((option) =>
      buildTradeoffOptionProfile({
        option,
        score: resolveScoreForOption(option, input.scores),
      })
    )
  );

  const comparisons: TradeoffComparison[] = [];
  for (let indexA = 0; indexA < input.options.length; indexA += 1) {
    for (let indexB = indexA + 1; indexB < input.options.length; indexB += 1) {
      const optionA = input.options[indexA];
      const optionB = input.options[indexB];
      if (!optionA || !optionB) continue;
      comparisons.push(
        compareTradeoffOptions({
          comparisonId: `${input.profileId}:${optionA.optionId}:${optionB.optionId}`,
          optionA,
          optionB,
          scoreA: resolveScoreForOption(optionA, input.scores),
          scoreB: resolveScoreForOption(optionB, input.scores),
        })
      );
    }
  }

  const frozenComparisons = Object.freeze(comparisons);
  const primaryComparison =
    frozenComparisons.length === 0
      ? null
      : [...frozenComparisons].sort((a, b) => comparisonMagnitude(b) - comparisonMagnitude(a))[0] ?? null;
  const tradeoffCount = frozenComparisons.reduce((sum, comparison) => sum + comparison.tradeoffCount, 0);

  latestTradeoffProfile = Object.freeze({
    version: TRADEOFF_ANALYSIS_ENGINE_VERSION,
    profileId: input.profileId,
    evaluatedAt: input.evaluatedAt,
    optionProfiles,
    comparisons: frozenComparisons,
    optionCount: optionProfiles.length,
    comparisonCount: frozenComparisons.length,
    tradeoffCount,
    primaryComparison,
    readOnly: true as const,
    mutation: false as const,
    sourceMutation: false as const,
    sceneMutation: false as const,
    topologyMutation: false as const,
    routingMutation: false as const,
    dsMutation: false as const,
    simulationMutation: false as const,
    diagnostics: TRADEOFF_ANALYSIS_ENGINE_DIAGNOSTICS,
  });

  return latestTradeoffProfile;
}

export function getTradeoffProfile(): TradeoffProfile {
  return latestTradeoffProfile;
}

export function resetTradeoffAnalysisEngineForTests(): void {
  latestTradeoffProfile = EMPTY_TRADEOFF_PROFILE;
}

export const TradeoffAnalysisEngine = Object.freeze({
  buildTradeoffOptionProfile,
  compareTradeoffOptions,
  analyzeTradeoffs,
  getTradeoffProfile,
  resetTradeoffAnalysisEngineForTests,
  diagnostics: TRADEOFF_ANALYSIS_ENGINE_DIAGNOSTICS,
  emptyProfile: EMPTY_TRADEOFF_PROFILE,
});
