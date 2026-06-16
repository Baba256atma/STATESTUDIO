/**
 * MRP:4E:3 — Scenario comparison workspace contract.
 *
 * Read-only alternative futures comparison — no decision execution or War Room auto-open.
 */

import type { GeneratedScenario, GeneratedScenarioId } from "./scenarioGenerationContract.ts";

export const MRP_SCENARIO_COMPARISON_TAG = "[MRP_SCENARIO_COMPARISON]" as const;

export const SCENARIO_COMPARISON_VERSION = "4E.3.0";

export const SCENARIO_COMPARISON_CONTEXT = "scenario" as const;

export type ComparisonScenarioId = "scenario_a" | "scenario_b" | "scenario_c";

export type ComparisonSectionId =
  | "risk"
  | "cost"
  | "timeline_impact"
  | "operational_impact"
  | "strategic_impact";

export type ScenarioComparisonColumn = Readonly<{
  id: ComparisonScenarioId;
  label: string;
  sourceScenarioId: GeneratedScenarioId;
  title: string;
  probability: string;
  confidence: string;
}>;

export type ScenarioComparisonRow = Readonly<{
  id: ComparisonSectionId;
  label: string;
  cells: Readonly<Record<ComparisonScenarioId, string>>;
}>;

export type ScenarioComparisonMatrix = Readonly<{
  columns: readonly ScenarioComparisonColumn[];
  rows: readonly ScenarioComparisonRow[];
  readOnly: true;
}>;

export type ScenarioComparisonSurface = Readonly<{
  matrix: ScenarioComparisonMatrix;
  dashboardContext: typeof SCENARIO_COMPARISON_CONTEXT;
  readOnly: true;
}>;

export const COMPARISON_SCENARIO_ORDER: readonly ComparisonScenarioId[] = Object.freeze([
  "scenario_a",
  "scenario_b",
  "scenario_c",
]);

export const COMPARISON_SECTION_ORDER: readonly ComparisonSectionId[] = Object.freeze([
  "risk",
  "cost",
  "timeline_impact",
  "operational_impact",
  "strategic_impact",
]);

export const COMPARISON_SCENARIO_LABELS: Readonly<Record<ComparisonScenarioId, string>> =
  Object.freeze({
    scenario_a: "Scenario A",
    scenario_b: "Scenario B",
    scenario_c: "Scenario C",
  });

export const COMPARISON_SCENARIO_SOURCE_MAP: Readonly<
  Record<ComparisonScenarioId, GeneratedScenarioId>
> = Object.freeze({
  scenario_a: "best_case",
  scenario_b: "expected_case",
  scenario_c: "worst_case",
});

export const COMPARISON_SECTION_LABELS: Readonly<Record<ComparisonSectionId, string>> =
  Object.freeze({
    risk: "Risk",
    cost: "Cost",
    timeline_impact: "Timeline Impact",
    operational_impact: "Operational Impact",
    strategic_impact: "Strategic Impact",
  });

export const DEFAULT_SCENARIO_COMPARISON_MATRIX: ScenarioComparisonMatrix = Object.freeze({
  columns: Object.freeze([]),
  rows: Object.freeze([]),
  readOnly: true,
});

export const DEFAULT_SCENARIO_COMPARISON_SURFACE: ScenarioComparisonSurface = Object.freeze({
  matrix: DEFAULT_SCENARIO_COMPARISON_MATRIX,
  dashboardContext: SCENARIO_COMPARISON_CONTEXT,
  readOnly: true,
});

export type ScenarioComparisonInput = Readonly<{
  scenarios: readonly GeneratedScenario[];
}>;
