/**
 * DS:7:5 — KPI Impact Simulation Engine contract.
 *
 * Read-only KPI outcome estimation from KPI Intelligence and scenario
 * blueprint proposals. No scene mutation or prediction authority.
 */

import type { KpiTrendDirection } from "../kpi-intelligence/kpiTrendContract.ts";
import type { ScenarioBlueprintRegistry } from "./scenarioBuilderContract.ts";
import type { ScenarioType } from "./scenarioGenerationContract.ts";

export const KPI_IMPACT_SIMULATION_DIAGNOSTIC = "[KPI_IMPACT_SIMULATION]" as const;

export const KPI_IMPACT_READY_DIAGNOSTIC = "[KPI_IMPACT_READY]" as const;

export const KPI_IMPACT_SIMULATION_ENGINE_VERSION = "7.5.0" as const;

export type KpiImpactState = "Positive" | "Neutral" | "Negative";

export type KpiForecastHorizonImpact = Readonly<{
  horizon: "short" | "medium" | "long";
  baselineValue: number;
  projectedValue: number;
  forecastDelta: number;
  impactState: KpiImpactState;
}>;

export type KpiForecastImpact = Readonly<{
  kpiId: string;
  label: string;
  baselineValue: number;
  projectedValue: number;
  targetValue: number;
  forecastDelta: number;
  impactState: KpiImpactState;
  baselineHealthScore: number;
  projectedHealthScore: number;
  baselineImpactScore: number;
  projectedImpactScore: number;
  trendDirection: KpiTrendDirection;
  projectedTrendDirection: KpiTrendDirection;
  horizonImpacts: readonly KpiForecastHorizonImpact[];
  forecastReady: true;
  predictionActive: false;
}>;

export type KpiImpactSimulationResult = Readonly<{
  kpiId: string;
  scenarioId: string;
  label: string;
  forecastImpact: KpiForecastImpact;
  impactState: KpiImpactState;
  compositeImpactScore: number;
  simulationReady: true;
  applied: false;
}>;

export type KpiImpactProfile = Readonly<{
  profileId: string;
  scenarioId: string;
  scenarioType: ScenarioType;
  kpiId: string;
  label: string;
  impactResult: KpiImpactSimulationResult;
  readOnly: true;
}>;

export type KpiImpactProfileRegistry = Readonly<{
  version: typeof KPI_IMPACT_SIMULATION_ENGINE_VERSION;
  profiles: readonly KpiImpactProfile[];
  profileById: Readonly<Record<string, KpiImpactProfile>>;
  profilesByKpiId: Readonly<Record<string, readonly KpiImpactProfile[]>>;
  profilesByScenarioId: Readonly<Record<string, readonly KpiImpactProfile[]>>;
  profileCount: number;
  kpiCount: number;
  scenarioCount: number;
  readOnly: true;
  sceneMutation: false;
  simulationActive: false;
  diagnostics: readonly [
    typeof KPI_IMPACT_SIMULATION_DIAGNOSTIC,
    typeof KPI_IMPACT_READY_DIAGNOSTIC,
  ];
}>;

export type KpiImpactSimulationBuildInput = Readonly<{
  sceneJson?: unknown;
  kpis?: readonly unknown[];
  dataSourceKpis?: readonly unknown[];
  historicalSnapshots?: readonly import("../kpi-intelligence/kpiTrendContract.ts").KpiHistoricalSnapshot[];
  blueprintRegistry?: ScenarioBlueprintRegistry;
  scenarioIds?: readonly string[];
}>;

export const KPI_IMPACT_SIMULATION_DIAGNOSTICS = Object.freeze([
  KPI_IMPACT_SIMULATION_DIAGNOSTIC,
  KPI_IMPACT_READY_DIAGNOSTIC,
] as const);

export const EMPTY_KPI_IMPACT_PROFILE_REGISTRY: KpiImpactProfileRegistry = Object.freeze({
  version: KPI_IMPACT_SIMULATION_ENGINE_VERSION,
  profiles: Object.freeze([]),
  profileById: Object.freeze({}),
  profilesByKpiId: Object.freeze({}),
  profilesByScenarioId: Object.freeze({}),
  profileCount: 0,
  kpiCount: 0,
  scenarioCount: 0,
  readOnly: true,
  sceneMutation: false,
  simulationActive: false,
  diagnostics: KPI_IMPACT_SIMULATION_DIAGNOSTICS,
});
