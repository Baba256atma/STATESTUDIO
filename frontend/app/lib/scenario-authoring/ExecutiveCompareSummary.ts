import type { ScenarioComparisonResult, ScenarioDifferenceProfile } from "./ScenarioComparisonContract.ts";
import {
  EMPTY_EXECUTIVE_COMPARE_SUMMARY,
  EXEC_COMPARE_SUMMARY_DIAGNOSTICS,
  EXECUTIVE_COMPARE_SUMMARY_VERSION,
  type ExecutiveCompareRecommendation,
  type ExecutiveCompareSummary as ExecutiveCompareSummaryContract,
  type ExecutiveCompareSummaryInput,
} from "./executiveCompareSummaryContract.ts";

let latestExecutiveCompareSummary: ExecutiveCompareSummaryContract = EMPTY_EXECUTIVE_COMPARE_SUMMARY;

function clampScore(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value)));
}

function average(values: readonly number[]): number {
  if (values.length === 0) return 0;
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

function byCategory(
  differences: readonly ScenarioDifferenceProfile[],
  category: ScenarioDifferenceProfile["category"]
): readonly ScenarioDifferenceProfile[] {
  return Object.freeze(differences.filter((difference) => difference.category === category));
}

function scoreDifference(difference: ScenarioDifferenceProfile): number {
  return (
    difference.overallImpactDelta * 0.35 -
    difference.riskMovementDelta * 0.25 +
    difference.kpiMovementDelta * 0.25 +
    difference.confidenceDelta * 0.15
  );
}

function aggregateRecommendation(comparison: ScenarioComparisonResult): ExecutiveCompareRecommendation {
  const explicitAdvantage = comparison.primaryDifference?.advantage;
  if (explicitAdvantage && explicitAdvantage !== "neutral") return explicitAdvantage;
  const score = comparison.differences.reduce((sum, difference) => sum + scoreDifference(difference), 0);
  if (score > 2) return "scenarioA";
  if (score < -2) return "scenarioB";
  return "neutral";
}

function collectAdvantages(comparison: ScenarioComparisonResult): readonly string[] {
  const advantages: string[] = [];
  for (const difference of comparison.differences) {
    if (difference.advantage === "scenarioA") {
      advantages.push(`${comparison.request.scenarioA.label}: ${difference.summary}`);
    } else if (difference.advantage === "scenarioB") {
      advantages.push(`${comparison.request.scenarioB.label}: ${difference.summary}`);
    }
  }
  if (advantages.length === 0) advantages.push("No decisive advantage detected.");
  return Object.freeze(advantages.slice(0, 5));
}

function collectDisadvantages(comparison: ScenarioComparisonResult): readonly string[] {
  const disadvantages: string[] = [];
  for (const difference of comparison.differences) {
    if (difference.riskMovementDelta > 0) {
      disadvantages.push(`${difference.differenceId}: risk movement increases by ${difference.riskMovementDelta}.`);
    }
    if (difference.confidenceDelta < 0) {
      disadvantages.push(`${difference.differenceId}: confidence decreases by ${Math.abs(difference.confidenceDelta)}.`);
    }
  }
  if (disadvantages.length === 0) disadvantages.push("No material disadvantage detected.");
  return Object.freeze(disadvantages.slice(0, 5));
}

function collectTradeoffs(comparison: ScenarioComparisonResult): readonly string[] {
  const tradeoffs: string[] = [];
  for (const difference of comparison.differences) {
    if (Math.abs(difference.kpiMovementDelta) > 0 && Math.abs(difference.riskMovementDelta) > 0) {
      tradeoffs.push(
        `${difference.differenceId}: KPI delta ${difference.kpiMovementDelta}, risk delta ${difference.riskMovementDelta}.`
      );
    }
    if (Math.abs(difference.objectCountDelta) > 0 || Math.abs(difference.relationshipCountDelta) > 0) {
      tradeoffs.push(
        `${difference.differenceId}: object delta ${difference.objectCountDelta}, relationship delta ${difference.relationshipCountDelta}.`
      );
    }
  }
  if (tradeoffs.length === 0) tradeoffs.push("Tradeoff profile is balanced across compared scenarios.");
  return Object.freeze(tradeoffs.slice(0, 5));
}

function recommendationRationale(
  comparison: ScenarioComparisonResult,
  recommendedOption: ExecutiveCompareRecommendation
): string {
  if (recommendedOption === "scenarioA") {
    return `${comparison.request.scenarioA.label} is recommended based on stronger aggregate comparison deltas.`;
  }
  if (recommendedOption === "scenarioB") {
    return `${comparison.request.scenarioB.label} is recommended based on stronger aggregate comparison deltas.`;
  }
  return "No option is decisively stronger; maintain neutral executive comparison stance.";
}

export function buildExecutiveCompareSummary(
  input: ExecutiveCompareSummaryInput
): ExecutiveCompareSummaryContract {
  const comparison = input.comparison;
  const recommendedOption = aggregateRecommendation(comparison);
  const confidence = average([
    comparison.request.scenarioA.summary.confidence,
    comparison.request.scenarioB.summary.confidence,
    ...comparison.differences.map((difference) => 100 - Math.abs(difference.confidenceDelta)),
  ]);

  latestExecutiveCompareSummary = Object.freeze({
    version: EXECUTIVE_COMPARE_SUMMARY_VERSION,
    comparisonId: comparison.request.comparisonId,
    scenarioAId: comparison.comparedScenarioIds[0],
    scenarioBId: comparison.comparedScenarioIds[1],
    advantages: collectAdvantages(comparison),
    disadvantages: collectDisadvantages(comparison),
    keyTradeoffs: collectTradeoffs(comparison),
    recommendedOption,
    recommendationRationale: recommendationRationale(comparison, recommendedOption),
    comparisonConfidence: clampScore(confidence),
    objectDifferenceCount: byCategory(comparison.differences, "object").length,
    relationshipDifferenceCount: byCategory(comparison.differences, "relationship").length,
    kpiDifferenceCount: byCategory(comparison.differences, "kpi").length,
    riskDifferenceCount: byCategory(comparison.differences, "risk").length,
    uiRendering: false as const,
    mutation: false as const,
    sceneMutation: false as const,
    topologyMutation: false as const,
    routingMutation: false as const,
    dsMutation: false as const,
    objectMutation: false as const,
    diagnostics: EXEC_COMPARE_SUMMARY_DIAGNOSTICS,
  });

  return latestExecutiveCompareSummary;
}

export function getExecutiveCompareSummary(): ExecutiveCompareSummaryContract {
  return latestExecutiveCompareSummary;
}

export function resetExecutiveCompareSummaryForTests(): void {
  latestExecutiveCompareSummary = EMPTY_EXECUTIVE_COMPARE_SUMMARY;
}

export const ExecutiveCompareSummary = Object.freeze({
  buildExecutiveCompareSummary,
  getExecutiveCompareSummary,
  resetExecutiveCompareSummaryForTests,
  diagnostics: EXEC_COMPARE_SUMMARY_DIAGNOSTICS,
  emptySummary: EMPTY_EXECUTIVE_COMPARE_SUMMARY,
});
