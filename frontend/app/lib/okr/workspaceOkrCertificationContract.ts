/**
 * DS-5:7 — OKR Intelligence certification contract.
 * Certification only — no feature creation, engine changes, or runtime refactor.
 */

import type { WorkspaceId } from "../workspace/workspaceRegistryContract.ts";

export const WORKSPACE_OKR_CERTIFICATION_VERSION = "DS-5:7" as const;

export const WORKSPACE_OKR_CERTIFICATION_TAGS = Object.freeze([
  "[DS57_CERTIFIED]",
  "[OKR_INTELLIGENCE_CERTIFIED]",
  "[OKR_MVP_COMPLETE]",
  "[DS6_READY]",
  "[DS_5_COMPLETE]",
] as const);

export const NEXORA_OKR_CERTIFICATION_LOG_PREFIX = "[NexoraOkrCertification]" as const;

export type WorkspaceOkrCertificationStatus = "PASS" | "WARNING" | "FAIL";

export type WorkspaceOkrCertificationGateId =
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
  | "AE"
  | "AF"
  | "AG"
  | "AH"
  | "AI"
  | "AJ"
  | "AK"
  | "AL"
  | "AM"
  | "AN";

export type WorkspaceOkrCertificationScenarioId =
  | "scenario_1_empty_workspace"
  | "scenario_2_single_objective"
  | "scenario_3_multiple_objectives"
  | "scenario_4_single_key_result"
  | "scenario_5_multiple_key_results"
  | "scenario_6_healthy_objective"
  | "scenario_7_warning_objective"
  | "scenario_8_critical_objective"
  | "scenario_9_okr_kpi_binding"
  | "scenario_10_object_panel_integration"
  | "scenario_11_dashboard_integration"
  | "scenario_12_workspace_isolation";

export type WorkspaceOkrCertificationGateResult = Readonly<{
  gateId: WorkspaceOkrCertificationGateId;
  title: string;
  status: WorkspaceOkrCertificationStatus;
  evidence: string;
}>;

export type WorkspaceOkrCertificationScenarioResult = Readonly<{
  scenarioId: WorkspaceOkrCertificationScenarioId;
  title: string;
  status: WorkspaceOkrCertificationStatus;
  evidence: string;
}>;

export type WorkspaceOkrCertificationWarning = Readonly<{
  title: string;
  status: WorkspaceOkrCertificationStatus;
  evidence: string;
}>;

export type WorkspaceOkrCertificationResult = Readonly<{
  contractVersion: typeof WORKSPACE_OKR_CERTIFICATION_VERSION;
  workspaceId: WorkspaceId | null;
  passed: boolean;
  certified: boolean;
  gateResults: readonly WorkspaceOkrCertificationGateResult[];
  scenarioResults: readonly WorkspaceOkrCertificationScenarioResult[];
  warnings: readonly WorkspaceOkrCertificationWarning[];
  summary: string;
  generatedAt: string;
  tags: typeof WORKSPACE_OKR_CERTIFICATION_TAGS;
}>;

export const WORKSPACE_OKR_CERTIFICATION_GATE_TITLES: Readonly<
  Record<WorkspaceOkrCertificationGateId, string>
> = Object.freeze({
  A: "OKR Contract Exists",
  B: "Objective CRUD Works",
  C: "Key Result CRUD Works",
  D: "Workspace Isolation",
  E: "Persistence",
  F: "Objective Retrieval",
  G: "Key Result Retrieval",
  H: "OKR Progress Engine Exists",
  I: "Objective Progress Calculation",
  J: "Key Result Progress Calculation",
  K: "Variance Calculation",
  L: "Trend Classification",
  M: "Reason Generation",
  N: "OKR Health Engine Exists",
  O: "Health Status Classification",
  P: "Severity Classification",
  Q: "Health Score Calculation",
  R: "Health Reason Generation",
  S: "OKR KPI Binding Exists",
  T: "Manual Binding",
  U: "Binding Suggestions",
  V: "Duplicate Protection",
  W: "Binding Retrieval",
  X: "OKR Panel Visibility",
  Y: "OKR Panel Empty State",
  Z: "Object Switching",
  AA: "OKR Dashboard Visibility",
  AB: "Dashboard Aggregation",
  AC: "Highest Risk Objective Resolution",
  AD: "No Objective Mutation",
  AE: "No Key Result Mutation",
  AF: "No KPI Mutation",
  AG: "No Object Mutation",
  AH: "No Relationship Mutation",
  AI: "No Scene Mutation",
  AJ: "No Topology Mutation",
  AK: "No Dashboard Route Mutation",
  AL: "No Assistant Mutation",
  AM: "Build Pass",
  AN: "Regression Pass",
});

export const WORKSPACE_OKR_CERTIFICATION_SCENARIO_TITLES: Readonly<
  Record<WorkspaceOkrCertificationScenarioId, string>
> = Object.freeze({
  scenario_1_empty_workspace: "Empty workspace OKR state is safe",
  scenario_2_single_objective: "Single objective foundation exists",
  scenario_3_multiple_objectives: "Multiple objectives aggregate correctly",
  scenario_4_single_key_result: "Single key result progress works",
  scenario_5_multiple_key_results: "Multiple key results aggregate correctly",
  scenario_6_healthy_objective: "Healthy objective classified correctly",
  scenario_7_warning_objective: "Warning objective classified correctly",
  scenario_8_critical_objective: "Critical objective classified correctly",
  scenario_9_okr_kpi_binding: "OKR KPI binding works",
  scenario_10_object_panel_integration: "Object panel OKR summary integrates correctly",
  scenario_11_dashboard_integration: "Dashboard OKR summary aggregates correctly",
  scenario_12_workspace_isolation: "Workspace isolation prevents cross-workspace leakage",
});
