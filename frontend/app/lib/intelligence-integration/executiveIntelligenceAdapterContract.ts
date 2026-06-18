/**
 * INT:1:1 — Executive Intelligence Adapter contract.
 *
 * Read-only adapter between Analyze surfaces and DS Intelligence Core (DS-3 → DS-7).
 * No mutations, routing, or execution authority.
 */

import type { ExecutiveKpiSummary } from "../kpi-intelligence/executiveKpiSummaryContract.ts";
import { EMPTY_EXECUTIVE_KPI_SUMMARY } from "../kpi-intelligence/executiveKpiSummaryContract.ts";
import type { ExecutiveObjectIntelligenceSummary } from "../object-intelligence/executiveObjectIntelligenceSummaryContract.ts";
import { EMPTY_EXECUTIVE_OBJECT_INTELLIGENCE_SUMMARY } from "../object-intelligence/executiveObjectIntelligenceSummaryContract.ts";
import type { ExecutiveRelationshipSummary } from "../relationship-intelligence/executiveRelationshipSummaryContract.ts";
import { EMPTY_EXECUTIVE_RELATIONSHIP_SUMMARY } from "../relationship-intelligence/executiveRelationshipSummaryContract.ts";
import type { ExecutiveRiskSummary } from "../risk-intelligence/executiveRiskSummaryContract.ts";
import { EMPTY_EXECUTIVE_RISK_SUMMARY } from "../risk-intelligence/executiveRiskSummaryContract.ts";
import type { ExecutiveScenarioSummary } from "../scenario-intelligence/executiveScenarioSummaryContract.ts";
import { EMPTY_EXECUTIVE_SCENARIO_SUMMARY } from "../scenario-intelligence/executiveScenarioSummaryContract.ts";
import type { ScenarioComparisonFoundationRegistry } from "../scenario-intelligence/scenarioComparisonFoundationContract.ts";
import { EMPTY_SCENARIO_COMPARISON_FOUNDATION_REGISTRY } from "../scenario-intelligence/scenarioComparisonFoundationContract.ts";
import type { ScenarioRecommendationRegistry } from "../scenario-intelligence/scenarioRecommendationContract.ts";
import { EMPTY_SCENARIO_RECOMMENDATION_REGISTRY } from "../scenario-intelligence/scenarioRecommendationContract.ts";
import {
  EXEC_INTELLIGENCE_ADAPTER_DIAGNOSTIC,
  EXEC_INTELLIGENCE_ADAPTER_READY_DIAGNOSTIC,
  EXEC_INTELLIGENCE_ADAPTER_DIAGNOSTICS,
} from "../intelligence/executiveIntelligenceSnapshotContract.ts";

export const INTELLIGENCE_ADAPTER_DIAGNOSTIC = EXEC_INTELLIGENCE_ADAPTER_DIAGNOSTIC;

export const INTELLIGENCE_ADAPTER_READY_DIAGNOSTIC = EXEC_INTELLIGENCE_ADAPTER_READY_DIAGNOSTIC;

export const EXECUTIVE_INTELLIGENCE_ADAPTER_VERSION = "1.1.0" as const;

export type ExecutiveIntelligenceAdapterLayer =
  | "object"
  | "relationship"
  | "kpi"
  | "risk"
  | "scenario";

export type ExecutiveIntelligenceAdapterLayerSnapshot = Readonly<{
  layer: ExecutiveIntelligenceAdapterLayer;
  layerVersion: string;
  summaryText: string;
  entityCount: number;
  layerDiagnostics: readonly string[];
  adapterReady: true;
}>;

export type ExecutiveIntelligenceAdapterRegistry = Readonly<{
  version: typeof EXECUTIVE_INTELLIGENCE_ADAPTER_VERSION;
  adapterSummary: string;
  objectIntelligence: ExecutiveObjectIntelligenceSummary;
  relationshipIntelligence: ExecutiveRelationshipSummary;
  kpiIntelligence: ExecutiveKpiSummary;
  riskIntelligence: ExecutiveRiskSummary;
  scenarioIntelligence: ExecutiveScenarioSummary;
  scenarioComparison: ScenarioComparisonFoundationRegistry;
  scenarioRecommendation: ScenarioRecommendationRegistry;
  layers: readonly ExecutiveIntelligenceAdapterLayerSnapshot[];
  layerCount: number;
  readOnly: true;
  sceneMutation: false;
  objectMutation: false;
  routingMutation: false;
  mrpMutation: false;
  simulationActive: false;
  legacyRouterUsage: false;
  diagnostics: readonly [
    typeof INTELLIGENCE_ADAPTER_DIAGNOSTIC,
    typeof INTELLIGENCE_ADAPTER_READY_DIAGNOSTIC,
  ];
}>;

export type ExecutiveIntelligenceAdapterBuildInput = Readonly<{
  sceneJson?: unknown;
  objects?: readonly unknown[];
  relationships?: readonly unknown[];
  kpis?: readonly unknown[];
  risks?: readonly unknown[];
  sceneObjects?: readonly unknown[];
  dataSourceObjects?: readonly unknown[];
  dataSourceKpis?: readonly unknown[];
  historicalSnapshots?: readonly import("../kpi-intelligence/kpiTrendContract.ts").KpiHistoricalSnapshot[];
  selectedObjectId?: string | null;
  objectIntelligence?: ExecutiveObjectIntelligenceSummary;
  relationshipIntelligence?: ExecutiveRelationshipSummary;
  kpiIntelligence?: ExecutiveKpiSummary;
  riskIntelligence?: ExecutiveRiskSummary;
  scenarioIntelligence?: ExecutiveScenarioSummary;
  scenarioComparison?: ScenarioComparisonFoundationRegistry;
  scenarioRecommendation?: ScenarioRecommendationRegistry;
}>;

export const INTELLIGENCE_ADAPTER_DIAGNOSTICS = EXEC_INTELLIGENCE_ADAPTER_DIAGNOSTICS;

export const EMPTY_EXECUTIVE_INTELLIGENCE_ADAPTER_REGISTRY: ExecutiveIntelligenceAdapterRegistry =
  Object.freeze({
    version: EXECUTIVE_INTELLIGENCE_ADAPTER_VERSION,
    adapterSummary: "No executive intelligence adapter data is available.",
    objectIntelligence: EMPTY_EXECUTIVE_OBJECT_INTELLIGENCE_SUMMARY,
    relationshipIntelligence: EMPTY_EXECUTIVE_RELATIONSHIP_SUMMARY,
    kpiIntelligence: EMPTY_EXECUTIVE_KPI_SUMMARY,
    riskIntelligence: EMPTY_EXECUTIVE_RISK_SUMMARY,
    scenarioIntelligence: EMPTY_EXECUTIVE_SCENARIO_SUMMARY,
    scenarioComparison: EMPTY_SCENARIO_COMPARISON_FOUNDATION_REGISTRY,
    scenarioRecommendation: EMPTY_SCENARIO_RECOMMENDATION_REGISTRY,
    layers: Object.freeze([]),
    layerCount: 0,
    readOnly: true,
    sceneMutation: false,
    objectMutation: false,
    routingMutation: false,
    mrpMutation: false,
    simulationActive: false,
    legacyRouterUsage: false,
    diagnostics: INTELLIGENCE_ADAPTER_DIAGNOSTICS,
  });
