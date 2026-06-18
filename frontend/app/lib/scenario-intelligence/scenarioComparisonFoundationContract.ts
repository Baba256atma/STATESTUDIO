/**
 * DS:7:8 — Scenario Comparison Foundation contract.
 *
 * Comparison-ready scenario structures for future A-vs-B and baseline-vs-alternative
 * evaluation. Foundation only — no UI rendering or simulation authority.
 */

import type { ExecutiveScenarioSummary } from "./executiveScenarioSummaryContract.ts";
import { EMPTY_EXECUTIVE_SCENARIO_SUMMARY } from "./executiveScenarioSummaryContract.ts";
import type { KpiImpactProfileRegistry } from "./kpiImpactSimulationContract.ts";
import type { ObjectImpactProfileRegistry } from "./objectImpactSimulationContract.ts";
import type { RelationshipImpactProfileRegistry } from "./relationshipImpactSimulationContract.ts";
import type { RiskImpactProfileRegistry } from "./riskImpactSimulationContract.ts";
import type { ScenarioType } from "./scenarioGenerationContract.ts";

export const SCENARIO_COMPARISON_DIAGNOSTIC = "[SCENARIO_COMPARISON]" as const;

export const SCENARIO_COMPARISON_READY_DIAGNOSTIC = "[SCENARIO_COMPARISON_READY]" as const;

export const SCENARIO_COMPARISON_FOUNDATION_VERSION = "7.8.0" as const;

export type ScenarioComparisonPairKind = "baseline_vs_alternative" | "scenario_a_vs_b";

export type ScenarioComparisonDimension =
  | "composite"
  | "object"
  | "relationship"
  | "kpi"
  | "risk"
  | "swot"
  | "actions";

export type ScenarioComparisonChangeDirection = "up" | "down" | "neutral";

export type ScenarioDifferenceProfile = Readonly<{
  differenceId: string;
  comparisonId: string;
  dimension: ScenarioComparisonDimension;
  subjectId: string;
  label: string;
  leftScenarioId: string;
  rightScenarioId: string;
  leftValue: number;
  rightValue: number;
  delta: number;
  direction: ScenarioComparisonChangeDirection;
  comparisonReady: true;
}>;

export type ScenarioComparisonPair = Readonly<{
  comparisonId: string;
  pairKind: ScenarioComparisonPairKind;
  leftScenarioId: string;
  rightScenarioId: string;
  leftLabel: string;
  rightLabel: string;
  leftScenarioType: ScenarioType;
  rightScenarioType: ScenarioType;
  differenceProfiles: readonly ScenarioDifferenceProfile[];
  differenceCount: number;
  netDelta: number;
  comparisonReady: true;
  renderingActive: false;
}>;

export type ScenarioComparisonPairInput = Readonly<{
  pairKind: ScenarioComparisonPairKind;
  leftScenarioId: string;
  rightScenarioId: string;
}>;

export type ScenarioComparisonFoundationRegistry = Readonly<{
  version: typeof SCENARIO_COMPARISON_FOUNDATION_VERSION;
  pairs: readonly ScenarioComparisonPair[];
  pairById: Readonly<Record<string, ScenarioComparisonPair>>;
  differenceProfiles: readonly ScenarioDifferenceProfile[];
  differenceById: Readonly<Record<string, ScenarioDifferenceProfile>>;
  pairCount: number;
  differenceCount: number;
  executiveScenarioSummary: ExecutiveScenarioSummary;
  foundationOnly: true;
  comparisonActive: false;
  renderingActive: false;
  visualRendering: false;
  readOnly: true;
  sceneMutation: false;
  simulationActive: false;
  diagnostics: readonly [
    typeof SCENARIO_COMPARISON_DIAGNOSTIC,
    typeof SCENARIO_COMPARISON_READY_DIAGNOSTIC,
  ];
}>;

export type ScenarioComparisonFoundationBuildInput = Readonly<{
  sceneJson?: unknown;
  objects?: readonly unknown[];
  relationships?: readonly unknown[];
  kpis?: readonly unknown[];
  sceneObjects?: readonly unknown[];
  dataSourceObjects?: readonly unknown[];
  dataSourceKpis?: readonly unknown[];
  historicalSnapshots?: readonly import("../kpi-intelligence/kpiTrendContract.ts").KpiHistoricalSnapshot[];
  scenarioIds?: readonly string[];
  comparisonPairs?: readonly ScenarioComparisonPairInput[];
  executiveScenarioSummary?: ExecutiveScenarioSummary;
  objectImpactRegistry?: ObjectImpactProfileRegistry;
  relationshipImpactRegistry?: RelationshipImpactProfileRegistry;
  kpiImpactRegistry?: KpiImpactProfileRegistry;
  riskImpactRegistry?: RiskImpactProfileRegistry;
}>;

export const SCENARIO_COMPARISON_DIAGNOSTICS = Object.freeze([
  SCENARIO_COMPARISON_DIAGNOSTIC,
  SCENARIO_COMPARISON_READY_DIAGNOSTIC,
] as const);

export const DEFAULT_BASELINE_VS_ALTERNATIVE_PAIR: ScenarioComparisonPairInput = Object.freeze({
  pairKind: "baseline_vs_alternative",
  leftScenarioId: "scenario:baseline",
  rightScenarioId: "scenario:alternative",
});

export const EMPTY_SCENARIO_COMPARISON_FOUNDATION_REGISTRY: ScenarioComparisonFoundationRegistry =
  Object.freeze({
    version: SCENARIO_COMPARISON_FOUNDATION_VERSION,
    pairs: Object.freeze([]),
    pairById: Object.freeze({}),
    differenceProfiles: Object.freeze([]),
    differenceById: Object.freeze({}),
    pairCount: 0,
    differenceCount: 0,
    executiveScenarioSummary: EMPTY_EXECUTIVE_SCENARIO_SUMMARY,
    foundationOnly: true,
    comparisonActive: false,
    renderingActive: false,
    visualRendering: false,
    readOnly: true,
    sceneMutation: false,
    simulationActive: false,
    diagnostics: SCENARIO_COMPARISON_DIAGNOSTICS,
  });
