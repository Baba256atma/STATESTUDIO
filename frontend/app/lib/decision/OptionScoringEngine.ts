/**
 * D:1 — Option Scoring Engine.
 *
 * Scores decision alternatives across impact, risk, KPI effect, scenario
 * outcome, and war room pressure dimensions. Produces normalized DecisionScore
 * outputs from read-only DecisionInputProfile intelligence without mutating
 * source systems.
 */

import {
  buildDecisionScore,
  buildDecisionScoreDimension,
  type DecisionOption,
  type DecisionScore,
  type DecisionScoreDimension,
} from "./DecisionRecommendationContract.ts";
import type { DecisionInputProfile } from "./decisionInputAggregatorContract.ts";
import {
  EMPTY_OPTION_SCORING_RESULT,
  OPTION_SCORING_DIMENSION_WEIGHTS,
  OPTION_SCORING_ENGINE_DIAGNOSTICS,
  OPTION_SCORING_ENGINE_VERSION,
  type OptionScoringDimensionId,
  type OptionScoringInput,
  type OptionScoringResult,
} from "./optionScoringEngineContract.ts";

export {
  D1_OPTION_SCORING_COMPLETE_TAG,
  EMPTY_OPTION_SCORING_RESULT,
  OPTION_SCORING_DIMENSION_WEIGHTS,
  OPTION_SCORING_ENGINE_DIAGNOSTIC,
  OPTION_SCORING_ENGINE_DIAGNOSTICS,
  OPTION_SCORING_ENGINE_VERSION,
  OPTION_SCORING_READY_DIAGNOSTIC,
  type OptionScoringDimensionId,
  type OptionScoringInput,
  type OptionScoringResult,
} from "./optionScoringEngineContract.ts";

let latestOptionScoringResult: OptionScoringResult = EMPTY_OPTION_SCORING_RESULT;

function clampScore(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value)));
}

function average(values: readonly number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function weightedAverage(dimensions: readonly DecisionScoreDimension[]): number {
  const totalWeight = dimensions.reduce((sum, dimension) => sum + dimension.weight, 0);
  if (totalWeight === 0) return 0;
  const weighted = dimensions.reduce((sum, dimension) => sum + dimension.value * dimension.weight, 0);
  return clampScore(weighted / totalWeight);
}

function severityWeight(severity: "info" | "watch" | "warning" | "critical"): number {
  if (severity === "critical") return 100;
  if (severity === "warning") return 72;
  if (severity === "watch") return 42;
  return 16;
}

function categoryImpactBoost(category: string | undefined): number {
  if (category === "stabilize" || category === "optimize") return 8;
  if (category === "rebalance" || category === "investigate") return 4;
  return 0;
}

function categoryRiskBoost(category: string | undefined): number {
  if (category === "reduce_risk" || category === "protect") return 10;
  if (category === "diversify") return 6;
  return 0;
}

function categoryKpiBoost(category: string | undefined): number {
  if (category === "optimize" || category === "rebalance") return 8;
  if (category === "monitor") return 3;
  return 0;
}

function categoryScenarioBoost(category: string | undefined): number {
  if (category === "stabilize" || category === "reduce_risk") return 6;
  if (category === "investigate") return 4;
  return 0;
}

function categoryWarRoomFit(category: string | undefined, pressure: number): number {
  if (pressure >= 70) {
    if (category === "stabilize" || category === "reduce_risk" || category === "protect") return 14;
    if (category === "monitor" || category === "investigate") return -12;
  }
  if (pressure < 30) {
    if (category === "monitor" || category === "optimize") return 12;
    if (category === "stabilize") return -6;
  }
  return 0;
}

function scoreImpact(profile: DecisionInputProfile, option: DecisionOption): number {
  const objectValues = profile.dsIntelligence.objectProfiles.map(
    (objectProfile) => (objectProfile.impact + objectProfile.importance) / 2
  );
  const relationshipValues = profile.dsIntelligence.relationshipProfiles.map(
    (relationshipProfile) => relationshipProfile.influence
  );
  const values = [...objectValues, ...relationshipValues];
  return clampScore(average(values) + categoryImpactBoost(option.category));
}

function scoreRisk(profile: DecisionInputProfile, option: DecisionOption): number {
  const riskValues = profile.dsIntelligence.riskProfiles.map(
    (riskProfile) => 100 - (riskProfile.severity + riskProfile.exposure) / 2
  );
  const compareValues = profile.compareResults.compareResults.flatMap((result) =>
    result.differences.map((difference) =>
      difference.advantage === "neutral"
        ? 50
        : clampScore(50 - difference.riskMovementDelta * 2)
    )
  );
  const values = riskValues.length > 0 ? riskValues : compareValues.length > 0 ? compareValues : [50];
  return clampScore(average(values) + categoryRiskBoost(option.category));
}

function scoreKpiEffect(profile: DecisionInputProfile, option: DecisionOption): number {
  const kpiValues = profile.dsIntelligence.kpiProfiles.map((kpiProfile) => kpiProfile.intelligenceScore);
  const scenarioValues = profile.scenarioResults.scenarioResults.map((result) => {
    if (result.kpiMovement.direction === "positive") {
      return clampScore(55 + result.kpiMovement.delta + result.kpiMovement.confidence * 0.2);
    }
    if (result.kpiMovement.direction === "negative") {
      return clampScore(45 - Math.abs(result.kpiMovement.delta) + result.kpiMovement.confidence * 0.1);
    }
    return 50;
  });
  const values = [...kpiValues, ...scenarioValues];
  return clampScore((values.length > 0 ? average(values) : 0) + categoryKpiBoost(option.category));
}

function scoreScenarioOutcome(profile: DecisionInputProfile, option: DecisionOption): number {
  const values = profile.scenarioResults.scenarioResults.map(
    (result) => result.overallScenarioImpact * 0.7 + result.confidence * 0.3
  );
  return clampScore((values.length > 0 ? average(values) : 0) + categoryScenarioBoost(option.category));
}

function scoreWarRoomPressure(profile: DecisionInputProfile, option: DecisionOption): number {
  const base = clampScore(
    average(profile.warRoomSignals.signals.map((signal) => severityWeight(signal.severity)))
  );
  return clampScore(base + categoryWarRoomFit(option.category, base));
}

function buildDimension(
  dimensionId: OptionScoringDimensionId,
  label: string,
  value: number
): DecisionScoreDimension {
  return buildDecisionScoreDimension({
    dimensionId,
    label,
    value,
    weight: OPTION_SCORING_DIMENSION_WEIGHTS[dimensionId],
  });
}

export function scoreDecisionOption(input: {
  option: DecisionOption;
  inputProfile: DecisionInputProfile;
  evaluatedAt: string;
}): DecisionScore {
  const dimensions = Object.freeze([
    buildDimension("impact", "Impact", scoreImpact(input.inputProfile, input.option)),
    buildDimension("risk", "Risk", scoreRisk(input.inputProfile, input.option)),
    buildDimension("kpiEffect", "KPI Effect", scoreKpiEffect(input.inputProfile, input.option)),
    buildDimension(
      "scenarioOutcome",
      "Scenario Outcome",
      scoreScenarioOutcome(input.inputProfile, input.option)
    ),
    buildDimension(
      "warRoomPressure",
      "War Room Pressure",
      scoreWarRoomPressure(input.inputProfile, input.option)
    ),
  ]);

  const confidence = clampScore(
    input.inputProfile.readinessScore * 0.45 +
      average(dimensions.map((dimension) => dimension.value)) * 0.35 +
      input.inputProfile.scenarioResults.averageScenarioConfidence * 0.2
  );

  return buildDecisionScore({
    scoreId: `option-score:${input.option.optionId}:${input.evaluatedAt}`,
    optionId: input.option.optionId,
    value: weightedAverage(dimensions),
    confidence,
    dimensions,
  });
}

export function scoreDecisionOptions(input: OptionScoringInput): OptionScoringResult {
  const scores = Object.freeze(
    input.options.map((option) =>
      scoreDecisionOption({
        option,
        inputProfile: input.inputProfile,
        evaluatedAt: input.evaluatedAt,
      })
    )
  );

  latestOptionScoringResult = Object.freeze({
    version: OPTION_SCORING_ENGINE_VERSION,
    evaluatedAt: input.evaluatedAt,
    profileId: input.inputProfile.profileId,
    scores,
    scoreCount: scores.length,
    normalizedScoring: true as const,
    readOnly: true as const,
    mutation: false as const,
    sourceMutation: false as const,
    sceneMutation: false as const,
    topologyMutation: false as const,
    routingMutation: false as const,
    dsMutation: false as const,
    simulationMutation: false as const,
    diagnostics: OPTION_SCORING_ENGINE_DIAGNOSTICS,
  });

  return latestOptionScoringResult;
}

export function getOptionScoringResult(): OptionScoringResult {
  return latestOptionScoringResult;
}

export function resetOptionScoringEngineForTests(): void {
  latestOptionScoringResult = EMPTY_OPTION_SCORING_RESULT;
}

export const OptionScoringEngine = Object.freeze({
  scoreDecisionOption,
  scoreDecisionOptions,
  getOptionScoringResult,
  resetOptionScoringEngineForTests,
  diagnostics: OPTION_SCORING_ENGINE_DIAGNOSTICS,
  dimensionWeights: OPTION_SCORING_DIMENSION_WEIGHTS,
  emptyResult: EMPTY_OPTION_SCORING_RESULT,
});
