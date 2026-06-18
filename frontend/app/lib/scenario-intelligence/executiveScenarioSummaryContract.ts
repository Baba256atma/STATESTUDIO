/**
 * DS:7:7 — Executive Scenario Aggregator contract.
 *
 * Read-only executive scenario summaries aggregating object, relationship,
 * KPI, and risk simulation impacts with SWOT and recommended actions.
 */

import type { ObjectImpactProfileRegistry } from "./objectImpactSimulationContract.ts";
import type { KpiImpactProfileRegistry } from "./kpiImpactSimulationContract.ts";
import type { RelationshipImpactProfileRegistry } from "./relationshipImpactSimulationContract.ts";
import type { RiskImpactProfileRegistry } from "./riskImpactSimulationContract.ts";
import type { ScenarioDefinition, ScenarioRegistry } from "./scenarioGenerationContract.ts";
import type { ScenarioType } from "./scenarioGenerationContract.ts";

export const EXEC_SCENARIO_SUMMARY_DIAGNOSTIC = "[EXEC_SCENARIO_SUMMARY]" as const;

export const EXEC_SCENARIO_READY_DIAGNOSTIC = "[EXEC_SCENARIO_READY]" as const;

export const EXEC_SCENARIO_SUMMARY_VERSION = "7.7.0" as const;

export type ExecutiveScenarioActionPriority = "monitor" | "review" | "prioritize" | "immediate";

export type ExecutiveScenarioSwotItem = Readonly<{
  id: string;
  label: string;
  detail: string;
  score: number;
}>;

export type ExecutiveScenarioRecommendedAction = Readonly<{
  actionId: string;
  priority: ExecutiveScenarioActionPriority;
  label: string;
  reason: string;
}>;

export type ExecutiveScenarioImpactAggregation = Readonly<{
  objectImpactCount: number;
  relationshipImpactCount: number;
  kpiImpactCount: number;
  riskImpactCount: number;
  averageObjectImpactScore: number;
  averageRelationshipImpactScore: number;
  averageKpiImpactScore: number;
  averageRiskImpactScore: number;
  compositeImpactScore: number;
}>;

export type ExecutiveScenarioSummaryProfile = Readonly<{
  scenarioId: string;
  scenarioType: ScenarioType;
  label: string;
  definition?: ScenarioDefinition;
  impactAggregation: ExecutiveScenarioImpactAggregation;
  strengths: readonly ExecutiveScenarioSwotItem[];
  weaknesses: readonly ExecutiveScenarioSwotItem[];
  opportunities: readonly ExecutiveScenarioSwotItem[];
  threats: readonly ExecutiveScenarioSwotItem[];
  recommendedActions: readonly ExecutiveScenarioRecommendedAction[];
}>;

export type ExecutiveScenarioSummary = Readonly<{
  version: typeof EXEC_SCENARIO_SUMMARY_VERSION;
  executiveSummary: string;
  scenarioCount: number;
  summaries: readonly ExecutiveScenarioSummaryProfile[];
  summaryByScenarioId: Readonly<Record<string, ExecutiveScenarioSummaryProfile>>;
  readOnly: true;
  sceneMutation: false;
  simulationActive: false;
  diagnostics: readonly [
    typeof EXEC_SCENARIO_SUMMARY_DIAGNOSTIC,
    typeof EXEC_SCENARIO_READY_DIAGNOSTIC,
  ];
}>;

export type ExecutiveScenarioSummaryBuildInput = Readonly<{
  sceneJson?: unknown;
  objects?: readonly unknown[];
  relationships?: readonly unknown[];
  kpis?: readonly unknown[];
  sceneObjects?: readonly unknown[];
  dataSourceObjects?: readonly unknown[];
  dataSourceKpis?: readonly unknown[];
  historicalSnapshots?: readonly import("../kpi-intelligence/kpiTrendContract.ts").KpiHistoricalSnapshot[];
  scenarioIds?: readonly string[];
  selectedObjectId?: string | null;
  scenarioRegistry?: ScenarioRegistry;
  objectImpactRegistry?: ObjectImpactProfileRegistry;
  relationshipImpactRegistry?: RelationshipImpactProfileRegistry;
  kpiImpactRegistry?: KpiImpactProfileRegistry;
  riskImpactRegistry?: RiskImpactProfileRegistry;
}>;

export const EXEC_SCENARIO_SUMMARY_DIAGNOSTICS = Object.freeze([
  EXEC_SCENARIO_SUMMARY_DIAGNOSTIC,
  EXEC_SCENARIO_READY_DIAGNOSTIC,
] as const);

export const EMPTY_EXECUTIVE_SCENARIO_SUMMARY: ExecutiveScenarioSummary = Object.freeze({
  version: EXEC_SCENARIO_SUMMARY_VERSION,
  executiveSummary: "No executive scenario intelligence is available.",
  scenarioCount: 0,
  summaries: Object.freeze([]),
  summaryByScenarioId: Object.freeze({}),
  readOnly: true,
  sceneMutation: false,
  simulationActive: false,
  diagnostics: EXEC_SCENARIO_SUMMARY_DIAGNOSTICS,
});
