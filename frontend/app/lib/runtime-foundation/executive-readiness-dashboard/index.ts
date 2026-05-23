export type {
  DashboardTrendPoint,
  DashboardTrendSummary,
  ExecutiveDashboardClassificationSeverity,
  ExecutiveDashboardHealthStatus,
  ExecutiveReadinessDashboardInput,
  ExecutiveReadinessDashboardModel,
  ExecutiveReadinessGap,
  ExecutiveReadinessIndicator,
  ExecutiveReadinessSummary,
  ReadinessGapSeverity,
  RuntimeHealthClassification,
  RuntimeHealthSurface,
  StrategicLaunchAssessment,
} from "./executiveReadinessDashboardTypes.ts";

export {
  buildExecutiveReadinessDashboard,
} from "./dashboardAggregator.ts";

export {
  buildExecutiveReadinessIndicators,
  clampDashboardScore,
  healthFromScore,
  indicatorScore,
  scoreFromHealth,
} from "./dashboardScoring.ts";

export { analyzeExecutiveReadinessGaps } from "./gapAnalysis.ts";
export { classifyRuntimeHealthGaps } from "./healthClassification.ts";
export { assessStrategicLaunchReadiness } from "./launchAssessment.ts";
export { generateExecutiveReadinessSummary } from "./executiveSummary.ts";
export { buildDashboardTrendSummary } from "./dashboardTrend.ts";

export {
  validateExecutiveReadinessDashboard,
  validateExecutiveReadinessGap,
  validateRuntimeHealthClassification,
  validateRuntimeHealthSurface,
} from "./executiveReadinessDashboardGuards.ts";

