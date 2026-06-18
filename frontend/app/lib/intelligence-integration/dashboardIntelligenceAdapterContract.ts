/**
 * INT:2:1 — Dashboard Intelligence Adapter contract.
 *
 * Read-only adapter between Dashboard surfaces and ExecutiveIntelligenceSnapshot.
 * Consumes certified DS-3 through DS-7 intelligence without mutation authority.
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
import type { ExecutiveIntelligenceSnapshot } from "../intelligence/executiveIntelligenceSnapshotContract.ts";
import { EMPTY_EXECUTIVE_INTELLIGENCE_SNAPSHOT } from "../intelligence/executiveIntelligenceSnapshotContract.ts";

export const DASHBOARD_INTELLIGENCE_ADAPTER_DIAGNOSTIC =
  "[DASHBOARD_INTELLIGENCE_ADAPTER]" as const;

export const DASHBOARD_INTELLIGENCE_ADAPTER_READY_DIAGNOSTIC =
  "[DASHBOARD_INTELLIGENCE_ADAPTER_READY]" as const;

export const INT2_ADAPTER_COMPLETE_TAG = "[INT2_ADAPTER_COMPLETE]" as const;

export const DASHBOARD_INTELLIGENCE_ADAPTER_VERSION = "2.1.0" as const;

export type DashboardIntelligenceAdapterLayer =
  | "object"
  | "relationship"
  | "kpi"
  | "risk"
  | "scenario";

export type DashboardIntelligenceAdapterLayerSnapshot = Readonly<{
  layer: DashboardIntelligenceAdapterLayer;
  layerVersion: string;
  summaryText: string;
  entityCount: number;
  layerDiagnostics: readonly string[];
  adapterReady: true;
}>;

export type DashboardIntelligenceAdapterRegistry = Readonly<{
  version: typeof DASHBOARD_INTELLIGENCE_ADAPTER_VERSION;
  adapterSummary: string;
  snapshot: ExecutiveIntelligenceSnapshot;
  snapshotVersion: string;
  objectIntelligence: ExecutiveObjectIntelligenceSummary;
  relationshipIntelligence: ExecutiveRelationshipSummary;
  kpiIntelligence: ExecutiveKpiSummary;
  riskIntelligence: ExecutiveRiskSummary;
  scenarioIntelligence: ExecutiveScenarioSummary;
  layers: readonly DashboardIntelligenceAdapterLayerSnapshot[];
  layerCount: number;
  readOnly: true;
  sceneMutation: false;
  objectMutation: false;
  mrpMutation: false;
  routingMutation: false;
  topologyMutation: false;
  legacyRouterUsage: false;
  diagnostics: readonly [
    typeof DASHBOARD_INTELLIGENCE_ADAPTER_DIAGNOSTIC,
    typeof DASHBOARD_INTELLIGENCE_ADAPTER_READY_DIAGNOSTIC,
  ];
}>;

export type DashboardIntelligenceAdapterBuildInput = Readonly<{
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
  snapshot?: ExecutiveIntelligenceSnapshot;
}>;

export const DASHBOARD_INTELLIGENCE_ADAPTER_DIAGNOSTICS = Object.freeze([
  DASHBOARD_INTELLIGENCE_ADAPTER_DIAGNOSTIC,
  DASHBOARD_INTELLIGENCE_ADAPTER_READY_DIAGNOSTIC,
] as const);

export const EMPTY_DASHBOARD_INTELLIGENCE_ADAPTER_REGISTRY: DashboardIntelligenceAdapterRegistry =
  Object.freeze({
    version: DASHBOARD_INTELLIGENCE_ADAPTER_VERSION,
    adapterSummary: "No dashboard intelligence adapter data is available.",
    snapshot: EMPTY_EXECUTIVE_INTELLIGENCE_SNAPSHOT,
    snapshotVersion: EMPTY_EXECUTIVE_INTELLIGENCE_SNAPSHOT.version,
    objectIntelligence: EMPTY_EXECUTIVE_OBJECT_INTELLIGENCE_SUMMARY,
    relationshipIntelligence: EMPTY_EXECUTIVE_RELATIONSHIP_SUMMARY,
    kpiIntelligence: EMPTY_EXECUTIVE_KPI_SUMMARY,
    riskIntelligence: EMPTY_EXECUTIVE_RISK_SUMMARY,
    scenarioIntelligence: EMPTY_EXECUTIVE_SCENARIO_SUMMARY,
    layers: Object.freeze([]),
    layerCount: 0,
    readOnly: true,
    sceneMutation: false,
    objectMutation: false,
    mrpMutation: false,
    routingMutation: false,
    topologyMutation: false,
    legacyRouterUsage: false,
    diagnostics: DASHBOARD_INTELLIGENCE_ADAPTER_DIAGNOSTICS,
  });
