/**
 * DS:7:6 — Risk Impact Simulation Engine contract.
 *
 * Read-only future risk outcome estimation from Risk Intelligence and
 * scenario blueprint proposals. No scene mutation or execution authority.
 */

import type { ExecutiveRiskNodeKind } from "../risk-intelligence/executiveRiskSummaryContract.ts";
import type { ScenarioBlueprintRegistry } from "./scenarioBuilderContract.ts";
import type { ScenarioType } from "./scenarioGenerationContract.ts";

export const RISK_IMPACT_SIMULATION_DIAGNOSTIC = "[RISK_IMPACT_SIMULATION]" as const;

export const RISK_IMPACT_READY_DIAGNOSTIC = "[RISK_IMPACT_READY]" as const;

export const RISK_IMPACT_SIMULATION_ENGINE_VERSION = "7.6.0" as const;

export type RiskImpactSubjectKind = ExecutiveRiskNodeKind | "propagation";

export type RiskIncreaseImpact = Readonly<{
  baselineRiskScore: number;
  projectedRiskScore: number;
  riskDelta: number;
  increaseDetected: boolean;
}>;

export type RiskDecreaseImpact = Readonly<{
  baselineRiskScore: number;
  projectedRiskScore: number;
  riskDelta: number;
  decreaseDetected: boolean;
}>;

export type RiskPropagationImpact = Readonly<{
  baselinePropagationScore: number;
  projectedPropagationScore: number;
  propagationDelta: number;
  affectedChainCount: number;
  affectedTargetCount: number;
  propagationDetected: boolean;
}>;

export type RiskImpactResult = Readonly<{
  subjectId: string;
  subjectKind: RiskImpactSubjectKind;
  scenarioId: string;
  label: string;
  riskIncrease: RiskIncreaseImpact;
  riskDecrease: RiskDecreaseImpact;
  riskPropagation: RiskPropagationImpact;
  netRiskDelta: number;
  compositeImpactScore: number;
  simulationReady: true;
  applied: false;
}>;

export type RiskImpactProfile = Readonly<{
  profileId: string;
  scenarioId: string;
  scenarioType: ScenarioType;
  subjectId: string;
  subjectKind: RiskImpactSubjectKind;
  label: string;
  impactResult: RiskImpactResult;
  readOnly: true;
}>;

export type RiskImpactProfileRegistry = Readonly<{
  version: typeof RISK_IMPACT_SIMULATION_ENGINE_VERSION;
  profiles: readonly RiskImpactProfile[];
  profileById: Readonly<Record<string, RiskImpactProfile>>;
  profilesBySubjectId: Readonly<Record<string, readonly RiskImpactProfile[]>>;
  profilesByScenarioId: Readonly<Record<string, readonly RiskImpactProfile[]>>;
  profileCount: number;
  subjectCount: number;
  scenarioCount: number;
  readOnly: true;
  sceneMutation: false;
  simulationActive: false;
  diagnostics: readonly [
    typeof RISK_IMPACT_SIMULATION_DIAGNOSTIC,
    typeof RISK_IMPACT_READY_DIAGNOSTIC,
  ];
}>;

export type RiskImpactSimulationBuildInput = Readonly<{
  sceneJson?: unknown;
  objects?: readonly unknown[];
  relationships?: readonly unknown[];
  kpis?: readonly unknown[];
  sceneObjects?: readonly unknown[];
  dataSourceObjects?: readonly unknown[];
  dataSourceKpis?: readonly unknown[];
  historicalSnapshots?: readonly import("../kpi-intelligence/kpiTrendContract.ts").KpiHistoricalSnapshot[];
  blueprintRegistry?: ScenarioBlueprintRegistry;
  scenarioIds?: readonly string[];
}>;

export const RISK_IMPACT_SIMULATION_DIAGNOSTICS = Object.freeze([
  RISK_IMPACT_SIMULATION_DIAGNOSTIC,
  RISK_IMPACT_READY_DIAGNOSTIC,
] as const);

export const EMPTY_RISK_IMPACT_PROFILE_REGISTRY: RiskImpactProfileRegistry = Object.freeze({
  version: RISK_IMPACT_SIMULATION_ENGINE_VERSION,
  profiles: Object.freeze([]),
  profileById: Object.freeze({}),
  profilesBySubjectId: Object.freeze({}),
  profilesByScenarioId: Object.freeze({}),
  profileCount: 0,
  subjectCount: 0,
  scenarioCount: 0,
  readOnly: true,
  sceneMutation: false,
  simulationActive: false,
  diagnostics: RISK_IMPACT_SIMULATION_DIAGNOSTICS,
});
