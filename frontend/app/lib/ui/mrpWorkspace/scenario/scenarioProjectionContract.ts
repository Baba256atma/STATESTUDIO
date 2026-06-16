/**
 * MRP:4E:4 — Future projection layer contract.
 *
 * Forecast-only — no decision execution, timeline mutation, or War Room writes.
 */

import type { GeneratedScenarioId } from "./scenarioGenerationContract.ts";

export const MRP_SCENARIO_PROJECTION_TAG = "[MRP_SCENARIO_PROJECTION]" as const;

export const SCENARIO_PROJECTION_VERSION = "4E.4.0";

export const SCENARIO_PROJECTION_CONTEXT = "scenario" as const;

export const SCENARIO_PROJECTION_QUESTION = "What might happen next?" as const;

export type ProjectionTrendId = "expected_trend" | "best_case_trend" | "worst_case_trend";

export type ProjectionSectionId =
  | "operational_impact"
  | "financial_impact"
  | "risk_impact"
  | "strategic_impact";

export type ProjectionTrendDirection = "up" | "down" | "stable";

export type ProjectionCurvePoint = Readonly<{
  step: number;
  value: number;
  label: string;
}>;

export type ProjectionTrend = Readonly<{
  id: ProjectionTrendId;
  label: string;
  sourceScenarioId: GeneratedScenarioId;
  direction: ProjectionTrendDirection;
  deltaLabel: string;
  summary: string;
  curve: readonly ProjectionCurvePoint[];
}>;

export type ProjectionImpactSummary = Readonly<{
  id: ProjectionSectionId;
  label: string;
  impactLevel: string;
  direction: ProjectionTrendDirection;
  summary: string;
}>;

export type ScenarioProjectionLayer = Readonly<{
  horizon: string;
  trends: readonly ProjectionTrend[];
  sections: readonly ProjectionImpactSummary[];
  readOnly: true;
}>;

export type ScenarioProjectionSurface = Readonly<{
  layer: ScenarioProjectionLayer;
  question: typeof SCENARIO_PROJECTION_QUESTION;
  dashboardContext: typeof SCENARIO_PROJECTION_CONTEXT;
  readOnly: true;
}>;

export const PROJECTION_TREND_ORDER: readonly ProjectionTrendId[] = Object.freeze([
  "expected_trend",
  "best_case_trend",
  "worst_case_trend",
]);

export const PROJECTION_SECTION_ORDER: readonly ProjectionSectionId[] = Object.freeze([
  "operational_impact",
  "financial_impact",
  "risk_impact",
  "strategic_impact",
]);

export const PROJECTION_TREND_LABELS: Readonly<Record<ProjectionTrendId, string>> =
  Object.freeze({
    expected_trend: "Expected Trend",
    best_case_trend: "Best Case Trend",
    worst_case_trend: "Worst Case Trend",
  });

export const PROJECTION_TREND_SOURCE_MAP: Readonly<
  Record<ProjectionTrendId, GeneratedScenarioId>
> = Object.freeze({
  expected_trend: "expected_case",
  best_case_trend: "best_case",
  worst_case_trend: "worst_case",
});

export const PROJECTION_SECTION_LABELS: Readonly<Record<ProjectionSectionId, string>> =
  Object.freeze({
    operational_impact: "Operational Impact",
    financial_impact: "Financial Impact",
    risk_impact: "Risk Impact",
    strategic_impact: "Strategic Impact",
  });

export const DEFAULT_SCENARIO_PROJECTION_LAYER: ScenarioProjectionLayer = Object.freeze({
  horizon: "None",
  trends: Object.freeze([]),
  sections: Object.freeze([]),
  readOnly: true,
});

export const DEFAULT_SCENARIO_PROJECTION_SURFACE: ScenarioProjectionSurface = Object.freeze({
  layer: DEFAULT_SCENARIO_PROJECTION_LAYER,
  question: SCENARIO_PROJECTION_QUESTION,
  dashboardContext: SCENARIO_PROJECTION_CONTEXT,
  readOnly: true,
});

export type ScenarioProjectionInput = Readonly<{
  scenarios: readonly import("./scenarioGenerationContract.ts").GeneratedScenario[];
  projectionHorizon: string;
  comparisonCells?: Readonly<
    Partial<
      Record<
        import("./scenarioComparisonContract.ts").ComparisonSectionId,
        Readonly<Record<import("./scenarioComparisonContract.ts").ComparisonScenarioId, string>>
      >
    >
  >;
}>;
