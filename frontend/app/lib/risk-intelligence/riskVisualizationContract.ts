/**
 * DS:6:8 — Risk Visualization Contract.
 *
 * Visualization-ready read model for risk intelligence. Exposes scores and
 * propagation metadata to future Scene and Dashboard consumers without
 * rendering authority.
 */

import type { ExecutiveRiskAttentionLevel } from "./executiveRiskSummaryContract.ts";
import type { RiskPropagationNodeKind } from "./riskPropagationProfileContract.ts";

export const RISK_VISUALIZATION_CONTRACT_DIAGNOSTIC = "[RISK_VISUALIZATION_CONTRACT]" as const;

export const RISK_VISUALIZATION_READY_DIAGNOSTIC = "[RISK_VISUALIZATION_READY]" as const;

export const RISK_VISUALIZATION_CONTRACT_VERSION = "6.8.0" as const;

export type RiskVisualizationNodeKind = "object" | "relationship" | "kpi";

export type RiskVisualizationLevel = "Low" | "Medium" | "High" | "Critical";

export type RiskVisualizationPriority = ExecutiveRiskAttentionLevel;

export type RiskVisualizationPropagation = Readonly<{
  chainId: string;
  propagationScore: number;
  sourceId: string;
  targetId: string;
  sourceKind: RiskPropagationNodeKind;
  targetKind: RiskPropagationNodeKind;
  role: "source" | "target" | "intermediate";
}>;

export type RiskVisualizationContract = Readonly<{
  nodeId: string;
  nodeKind: RiskVisualizationNodeKind;
  label: string;
  riskScore: number;
  riskLevel: RiskVisualizationLevel;
  riskPropagation: RiskVisualizationPropagation | null;
  riskPriority: RiskVisualizationPriority;
}>;

export type RiskVisualizationRegistry = Readonly<{
  version: typeof RISK_VISUALIZATION_CONTRACT_VERSION;
  entries: readonly RiskVisualizationContract[];
  entryByNodeId: Readonly<Record<string, RiskVisualizationContract>>;
  entryCount: number;
  sceneMutation: false;
  dashboardMutation: false;
  renderingMutation: false;
  readOnly: true;
  diagnostics: readonly [
    typeof RISK_VISUALIZATION_CONTRACT_DIAGNOSTIC,
    typeof RISK_VISUALIZATION_READY_DIAGNOSTIC,
  ];
}>;

export type RiskVisualizationBuildInput = Readonly<{
  sceneJson?: unknown;
  objects?: readonly unknown[];
  relationships?: readonly unknown[];
  kpis?: readonly unknown[];
  sceneObjects?: readonly unknown[];
  dataSourceObjects?: readonly unknown[];
  dataSourceKpis?: readonly unknown[];
  historicalSnapshots?: readonly import("../kpi-intelligence/kpiTrendContract.ts").KpiHistoricalSnapshot[];
}>;

export const RISK_VISUALIZATION_DIAGNOSTICS = Object.freeze([
  RISK_VISUALIZATION_CONTRACT_DIAGNOSTIC,
  RISK_VISUALIZATION_READY_DIAGNOSTIC,
] as const);

export const EMPTY_RISK_VISUALIZATION_REGISTRY: RiskVisualizationRegistry = Object.freeze({
  version: RISK_VISUALIZATION_CONTRACT_VERSION,
  entries: Object.freeze([]),
  entryByNodeId: Object.freeze({}),
  entryCount: 0,
  sceneMutation: false,
  dashboardMutation: false,
  renderingMutation: false,
  readOnly: true,
  diagnostics: RISK_VISUALIZATION_DIAGNOSTICS,
});
