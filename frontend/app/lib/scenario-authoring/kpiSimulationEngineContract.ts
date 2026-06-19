/**
 * S:2 — KPI Simulation Engine contract.
 *
 * Projects deterministic KPI-level scenario deltas from ScenarioSimulationRequest
 * and DS:5 KPI Intelligence. No KPI mutation and no forecast execution.
 */

import type {
  KpiIntelligenceProfile,
  KpiIntelligenceRegistry,
} from "../kpi-intelligence/kpiIntelligenceContract.ts";
import type { ScenarioSimulationRequest } from "./scenarioSimulationRuntimeContract.ts";

export const KPI_SIMULATION_ENGINE_DIAGNOSTIC = "[KPI_SIMULATION_ENGINE]" as const;

export const KPI_SIMULATION_READY_DIAGNOSTIC = "[KPI_SIMULATION_READY]" as const;

export const S2_KPI_SIMULATION_COMPLETE_TAG = "[S2_KPI_SIMULATION_COMPLETE]" as const;

export const KPI_SIMULATION_ENGINE_VERSION = "1.0.0" as const;

export type KpiSimulationEngineInput = Readonly<{
  request: ScenarioSimulationRequest;
  kpiIntelligence?: KpiIntelligenceRegistry;
}>;

export type KpiSimulationImpact = Readonly<{
  kpiId: string;
  label: string;
  category: KpiIntelligenceProfile["category"];
  source: KpiIntelligenceProfile["source"];
  baselineValue: number;
  baselineTarget: number;
  baselineIntelligenceScore: number;
  baselineDirection: KpiIntelligenceProfile["direction"];
  kpiHealthDelta: number;
  kpiTrendDelta: number;
  kpiImpactDelta: number;
  kpiConfidence: number;
  deterministicScenarioDelta: true;
  forecastExecution: false;
  readOnly: true;
  kpiMutation: false;
}>;

export type KpiSimulationResult = Readonly<{
  version: typeof KPI_SIMULATION_ENGINE_VERSION;
  request: ScenarioSimulationRequest;
  kpiImpacts: readonly KpiSimulationImpact[];
  kpiCount: number;
  averageKpiHealthDelta: number;
  averageKpiTrendDelta: number;
  averageKpiImpactDelta: number;
  averageKpiConfidence: number;
  deterministicScenarioDelta: true;
  forecastExecution: false;
  readOnly: true;
  kpiMutation: false;
  sceneMutation: false;
  dsMutation: false;
  routingMutation: false;
  diagnostics: readonly [
    typeof KPI_SIMULATION_ENGINE_DIAGNOSTIC,
    typeof KPI_SIMULATION_READY_DIAGNOSTIC,
  ];
}>;

export const KPI_SIMULATION_ENGINE_DIAGNOSTICS = Object.freeze([
  KPI_SIMULATION_ENGINE_DIAGNOSTIC,
  KPI_SIMULATION_READY_DIAGNOSTIC,
] as const);

export const EMPTY_KPI_SIMULATION_RESULT: KpiSimulationResult = Object.freeze({
  version: KPI_SIMULATION_ENGINE_VERSION,
  request: Object.freeze({
    draftId: "",
    sceneMutation: false,
    dsMutation: false,
    routingMutation: false,
  }),
  kpiImpacts: Object.freeze([]),
  kpiCount: 0,
  averageKpiHealthDelta: 0,
  averageKpiTrendDelta: 0,
  averageKpiImpactDelta: 0,
  averageKpiConfidence: 0,
  deterministicScenarioDelta: true,
  forecastExecution: false,
  readOnly: true,
  kpiMutation: false,
  sceneMutation: false,
  dsMutation: false,
  routingMutation: false,
  diagnostics: KPI_SIMULATION_ENGINE_DIAGNOSTICS,
});
