/**
 * INT:1:1 — Executive Intelligence Snapshot contract.
 *
 * Read-only adapter between Analyze integration surfaces and the certified DS
 * Intelligence Core (DS-3 → DS-7). No mutations, routing, or execution authority.
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

export const EXEC_INTELLIGENCE_ADAPTER_DIAGNOSTIC = "[EXEC_INTELLIGENCE_ADAPTER]" as const;

export const EXEC_INTELLIGENCE_ADAPTER_READY_DIAGNOSTIC =
  "[EXEC_INTELLIGENCE_ADAPTER_READY]" as const;

export const INT1_ADAPTER_COMPLETE_TAG = "[INT1_ADAPTER_COMPLETE]" as const;

export const EXECUTIVE_INTELLIGENCE_SNAPSHOT_VERSION = "1.1.0" as const;

export type ExecutiveIntelligenceSnapshot = Readonly<{
  version: typeof EXECUTIVE_INTELLIGENCE_SNAPSHOT_VERSION;
  objectIntelligence: ExecutiveObjectIntelligenceSummary;
  relationshipIntelligence: ExecutiveRelationshipSummary;
  kpiIntelligence: ExecutiveKpiSummary;
  riskIntelligence: ExecutiveRiskSummary;
  scenarioIntelligence: ExecutiveScenarioSummary;
  readOnly: true;
  sceneMutation: false;
  objectMutation: false;
  mrpMutation: false;
  routingMutation: false;
  legacyRouterUsage: false;
  diagnostics: readonly [
    typeof EXEC_INTELLIGENCE_ADAPTER_DIAGNOSTIC,
    typeof EXEC_INTELLIGENCE_ADAPTER_READY_DIAGNOSTIC,
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
}>;

export const EXEC_INTELLIGENCE_ADAPTER_DIAGNOSTICS = Object.freeze([
  EXEC_INTELLIGENCE_ADAPTER_DIAGNOSTIC,
  EXEC_INTELLIGENCE_ADAPTER_READY_DIAGNOSTIC,
] as const);

export const EMPTY_EXECUTIVE_INTELLIGENCE_SNAPSHOT: ExecutiveIntelligenceSnapshot = Object.freeze({
  version: EXECUTIVE_INTELLIGENCE_SNAPSHOT_VERSION,
  objectIntelligence: EMPTY_EXECUTIVE_OBJECT_INTELLIGENCE_SUMMARY,
  relationshipIntelligence: EMPTY_EXECUTIVE_RELATIONSHIP_SUMMARY,
  kpiIntelligence: EMPTY_EXECUTIVE_KPI_SUMMARY,
  riskIntelligence: EMPTY_EXECUTIVE_RISK_SUMMARY,
  scenarioIntelligence: EMPTY_EXECUTIVE_SCENARIO_SUMMARY,
  readOnly: true,
  sceneMutation: false,
  objectMutation: false,
  mrpMutation: false,
  routingMutation: false,
  legacyRouterUsage: false,
  diagnostics: EXEC_INTELLIGENCE_ADAPTER_DIAGNOSTICS,
});
