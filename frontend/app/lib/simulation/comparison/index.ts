/**
 * D7:1:6 — Executive scenario comparison intelligence (public surface).
 */

export type {
  ScenarioComparison,
  ScenarioComparisonMetrics,
  ScenarioDeltaAnalysis,
  StrategicTradeoff,
  StrategicTradeoffDimension,
  ExecutiveComparisonNarrative,
  ScenarioComparisonSnapshot,
  ScenarioComparisonPanelContract,
  ScenarioComparisonPanelRow,
  ScenarioRankingEntry,
  CompareScenarioTimelinesInput,
  CompareMultipleScenariosInput,
  MultiScenarioComparisonResult,
  ScenarioComparisonResult,
} from "./scenarioComparisonTypes.ts";

export type { ComparisonGuardCode, ComparisonGuardResult } from "./comparisonGuards.ts";
export { guardScenarioComparison, resolveCompareAtTick } from "./comparisonGuards.ts";

export { logComparisonDev } from "./comparisonDevLog.ts";
export type { ComparisonDevChannel } from "./comparisonDevLog.ts";

export type { ScenarioMetricProfile } from "./scenarioMetricsExtractor.ts";
export {
  extractScenarioMetricProfile,
  extractTimelineMetricProfile,
  getSnapshotAtTick,
} from "./scenarioMetricsExtractor.ts";

export { analyzeScenarioDelta } from "./scenarioDeltaAnalysis.ts";
export {
  analyzeStrategicTradeoffs,
  buildScenarioComparisonMetrics,
} from "./strategicTradeoffAnalysis.ts";
export { buildExecutiveComparisonNarrative } from "./executiveScenarioNarratives.ts";

export {
  compareScenarioTimelines,
  compareMultipleScenarios,
  buildComparisonFingerprint,
  buildScenarioComparisonPanelContract,
  freezeComparisonSnapshot,
} from "./executiveScenarioComparisonEngine.ts";
