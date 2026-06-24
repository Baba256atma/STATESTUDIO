/**
 * DS-4:7 — KPI Intelligence certification contract.
 * Certification only — no feature creation, engine changes, or runtime refactor.
 */

import type { WorkspaceId } from "../workspace/workspaceRegistryContract.ts";

export const WORKSPACE_KPI_CERTIFICATION_VERSION = "DS-4:7" as const;

export const WORKSPACE_KPI_CERTIFICATION_TAGS = Object.freeze([
  "[DS47_CERTIFIED]",
  "[KPI_INTELLIGENCE_CERTIFIED]",
  "[KPI_MVP_COMPLETE]",
  "[DS5_READY]",
  "[DS_4_COMPLETE]",
] as const);

export const NEXORA_KPI_CERTIFICATION_LOG_PREFIX = "[NexoraKpiCertification]" as const;

export type WorkspaceKpiCertificationStatus = "PASS" | "WARNING" | "FAIL";

export type WorkspaceKpiCertificationGateId =
  | "A"
  | "B"
  | "C"
  | "D"
  | "E"
  | "F"
  | "G"
  | "H"
  | "I"
  | "J"
  | "K"
  | "L"
  | "M"
  | "N"
  | "O"
  | "P"
  | "Q"
  | "R"
  | "S"
  | "T"
  | "U"
  | "V"
  | "W"
  | "X"
  | "Y"
  | "Z"
  | "AA"
  | "AB"
  | "AC"
  | "AD"
  | "AE";

export type WorkspaceKpiCertificationScenarioId =
  | "scenario_1_empty_workspace"
  | "scenario_2_single_kpi"
  | "scenario_3_multiple_kpis"
  | "scenario_4_healthy_kpi"
  | "scenario_5_warning_kpi"
  | "scenario_6_critical_kpi"
  | "scenario_7_forecast_kpi_binding"
  | "scenario_8_revenue_kpi_binding"
  | "scenario_9_dashboard_summary"
  | "scenario_10_workspace_isolation"
  | "scenario_11_persistence_reload"
  | "scenario_12_object_panel_integration";

export type WorkspaceKpiCertificationGateResult = Readonly<{
  gateId: WorkspaceKpiCertificationGateId;
  title: string;
  status: WorkspaceKpiCertificationStatus;
  evidence: string;
}>;

export type WorkspaceKpiCertificationScenarioResult = Readonly<{
  scenarioId: WorkspaceKpiCertificationScenarioId;
  title: string;
  status: WorkspaceKpiCertificationStatus;
  evidence: string;
}>;

export type WorkspaceKpiCertificationWarning = Readonly<{
  title: string;
  status: WorkspaceKpiCertificationStatus;
  evidence: string;
}>;

export type WorkspaceKpiCertificationResult = Readonly<{
  contractVersion: typeof WORKSPACE_KPI_CERTIFICATION_VERSION;
  workspaceId: WorkspaceId | null;
  passed: boolean;
  certified: boolean;
  gateResults: readonly WorkspaceKpiCertificationGateResult[];
  scenarioResults: readonly WorkspaceKpiCertificationScenarioResult[];
  warnings: readonly WorkspaceKpiCertificationWarning[];
  summary: string;
  generatedAt: string;
  tags: typeof WORKSPACE_KPI_CERTIFICATION_TAGS;
}>;

export const WORKSPACE_KPI_CERTIFICATION_GATE_TITLES: Readonly<
  Record<WorkspaceKpiCertificationGateId, string>
> = Object.freeze({
  A: "KPI Contract Exists",
  B: "KPI CRUD Works",
  C: "Workspace Isolation",
  D: "Persistence",
  E: "KPI Calculation Profiles",
  F: "Progress Calculation",
  G: "Variance Calculation",
  H: "Trend Classification",
  I: "Health Profiles",
  J: "Health Status Classification",
  K: "Severity Classification",
  L: "Health Score Calculation",
  M: "Reason Generation",
  N: "KPI Object Binding",
  O: "Binding Retrieval",
  P: "Duplicate Protection",
  Q: "Suggested Bindings",
  R: "Object Panel KPI Visibility",
  S: "Object Panel Empty State",
  T: "Dashboard KPI Summary",
  U: "Dashboard KPI Aggregation",
  V: "Highest Risk KPI Resolution",
  W: "No KPI Definition Mutation",
  X: "No Object Mutation",
  Y: "No Relationship Mutation",
  Z: "No Scene Mutation",
  AA: "No Topology Mutation",
  AB: "No Dashboard Route Mutation",
  AC: "No Assistant Mutation",
  AD: "Build Pass",
  AE: "Regression Pass",
});

export const WORKSPACE_KPI_CERTIFICATION_SCENARIO_TITLES: Readonly<
  Record<WorkspaceKpiCertificationScenarioId, string>
> = Object.freeze({
  scenario_1_empty_workspace: "Empty workspace KPI state is safe",
  scenario_2_single_kpi: "Single KPI foundation and profiles exist",
  scenario_3_multiple_kpis: "Multiple KPIs aggregate correctly",
  scenario_4_healthy_kpi: "Healthy KPI classified correctly",
  scenario_5_warning_kpi: "Warning KPI classified correctly",
  scenario_6_critical_kpi: "Critical KPI classified correctly",
  scenario_7_forecast_kpi_binding: "Forecast KPI binding works",
  scenario_8_revenue_kpi_binding: "Revenue KPI binding works",
  scenario_9_dashboard_summary: "Dashboard KPI summary aggregates correctly",
  scenario_10_workspace_isolation: "Workspace isolation prevents cross-workspace leakage",
  scenario_11_persistence_reload: "Persistence reload restores KPI intelligence",
  scenario_12_object_panel_integration: "Object panel KPI summary integrates correctly",
});
