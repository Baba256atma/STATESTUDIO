import type {
  DashboardTrendPoint,
  DashboardTrendSummary,
  ExecutiveReadinessDashboardModel,
  ExecutiveReadinessIndicator,
} from "./executiveReadinessDashboardTypes.ts";
import { indicatorScore } from "./dashboardScoring.ts";

function progression(current: number, previous: number | null): "improving" | "declining" | "flat" {
  if (previous == null) return "flat";
  const delta = current - previous;
  if (delta > 0.03) return "improving";
  if (delta < -0.03) return "declining";
  return "flat";
}

export function buildDashboardTrendSummary(params: {
  generatedAt: number;
  indicators: readonly ExecutiveReadinessIndicator[];
  previousDashboards?: readonly ExecutiveReadinessDashboardModel[];
}): DashboardTrendSummary {
  const current: DashboardTrendPoint = {
    generatedAt: params.generatedAt,
    readinessScore: indicatorScore(params.indicators, "readiness_score"),
    trustScore: indicatorScore(params.indicators, "trust_score"),
    stabilityScore: indicatorScore(params.indicators, "stability_score"),
    validationCoverage: indicatorScore(params.indicators, "validation_coverage"),
  };
  const previous = [...(params.previousDashboards ?? [])]
    .sort((a, b) => b.generatedAt - a.generatedAt)
    .slice(0, 4)
    .map((dashboard) => ({
      generatedAt: dashboard.generatedAt,
      readinessScore: indicatorScore(dashboard.indicators, "readiness_score"),
      trustScore: indicatorScore(dashboard.indicators, "trust_score"),
      stabilityScore: indicatorScore(dashboard.indicators, "stability_score"),
      validationCoverage: indicatorScore(dashboard.indicators, "validation_coverage"),
    }));
  const prior = previous[0] ?? null;
  return {
    readinessProgression: progression(current.readinessScore, prior?.readinessScore ?? null),
    trustProgression: progression(current.trustScore, prior?.trustScore ?? null),
    stabilityProgression: progression(current.stabilityScore, prior?.stabilityScore ?? null),
    validationProgression: progression(current.validationCoverage, prior?.validationCoverage ?? null),
    points: Object.freeze([current, ...previous].sort((a, b) => a.generatedAt - b.generatedAt)),
  };
}

