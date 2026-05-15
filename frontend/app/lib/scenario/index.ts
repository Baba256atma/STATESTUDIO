export type {
  ScenarioComparison,
  ScenarioComparisonMetric,
} from "./scenarioCompareTypes.ts";
export {
  compareScenarioScores,
  measureScenarioForComparison,
} from "./compareScenarioScores.ts";
export { deriveScenarioTradeoffs } from "./deriveScenarioTradeoffs.ts";
export {
  buildScenarioComparisonSummary,
  buildScenarioComparisonTitle,
} from "./scenarioComparisonNarratives.ts";
export {
  deriveScenarioComparison,
  deriveScenarioComparisons,
} from "./deriveScenarioComparison.ts";
export type { ScenarioComparisonOverlayState } from "./scenarioComparisonOverlays.ts";
export { buildScenarioComparisonOverlayState } from "./scenarioComparisonOverlays.ts";
