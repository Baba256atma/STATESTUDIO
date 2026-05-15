import type { ScenarioComparison } from "./scenarioCompareTypes.ts";

export type ScenarioComparisonOverlayState = {
  comparisonSummaries: Array<{
    comparisonId: string;
    title: string;
    recommendedScenarioId?: string;
    executiveSummary: string;
  }>;
  recommendedScenarioIds: string[];
};

export function buildScenarioComparisonOverlayState(params: {
  comparisons: ScenarioComparison[];
}): ScenarioComparisonOverlayState {
  const comparisons = Array.isArray(params.comparisons) ? params.comparisons : [];
  return {
    comparisonSummaries: comparisons.map((comparison) => ({
      comparisonId: comparison.id,
      title: comparison.comparisonTitle,
      recommendedScenarioId: comparison.recommendedScenarioId,
      executiveSummary: comparison.executiveSummary,
    })),
    recommendedScenarioIds: Array.from(
      new Set(comparisons.map((comparison) => comparison.recommendedScenarioId).filter((id): id is string => Boolean(id)))
    ),
  };
}
