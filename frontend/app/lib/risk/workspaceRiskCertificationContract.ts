/**
 * DS-6:7 — Risk Intelligence certification contract.
 * Certification only — no feature creation, engine changes, or runtime refactor.
 */

import type { WorkspaceId } from "../workspace/workspaceRegistryContract.ts";

export const WORKSPACE_RISK_CERTIFICATION_VERSION = "DS-6:7" as const;

export const WORKSPACE_RISK_CERTIFICATION_TAGS = Object.freeze([
  "[DS67_CERTIFIED]",
  "[RISK_INTELLIGENCE_CERTIFIED]",
  "[RISK_MVP_COMPLETE]",
  "[DS7_READY]",
  "[DS_6_COMPLETE]",
] as const);

export const NEXORA_RISK_CERTIFICATION_LOG_PREFIX = "[NexoraRiskCertification]" as const;

export type WorkspaceRiskCertificationStatus = "PASS" | "WARNING" | "FAIL";

export type WorkspaceRiskCertificationGateId =
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
  | "AN"
  | "AO";

export type WorkspaceRiskCertificationScenarioId =
  | "scenario_1_empty_workspace"
  | "scenario_2_single_risk"
  | "scenario_3_multiple_risks"
  | "scenario_4_critical_kpi_risk"
  | "scenario_5_warning_kpi_risk"
  | "scenario_6_critical_okr_risk"
  | "scenario_7_combined_risk"
  | "scenario_8_severity_escalation"
  | "scenario_9_risk_object_binding"
  | "scenario_10_risk_panel_integration"
  | "scenario_11_risk_dashboard_integration"
  | "scenario_12_workspace_isolation";

export type WorkspaceRiskCertificationGateResult = Readonly<{
  gateId: WorkspaceRiskCertificationGateId;
  title: string;
  status: WorkspaceRiskCertificationStatus;
  evidence: string;
}>;

export type WorkspaceRiskCertificationScenarioResult = Readonly<{
  scenarioId: WorkspaceRiskCertificationScenarioId;
  title: string;
  status: WorkspaceRiskCertificationStatus;
  evidence: string;
}>;

export type WorkspaceRiskCertificationWarning = Readonly<{
  title: string;
  status: WorkspaceRiskCertificationStatus;
  evidence: string;
}>;

export type WorkspaceRiskCertificationResult = Readonly<{
  contractVersion: typeof WORKSPACE_RISK_CERTIFICATION_VERSION;
  workspaceId: WorkspaceId | null;
  passed: boolean;
  certified: boolean;
  gateResults: readonly WorkspaceRiskCertificationGateResult[];
  scenarioResults: readonly WorkspaceRiskCertificationScenarioResult[];
  warnings: readonly WorkspaceRiskCertificationWarning[];
  summary: string;
  generatedAt: string;
  tags: typeof WORKSPACE_RISK_CERTIFICATION_TAGS;
}>;

export const WORKSPACE_RISK_CERTIFICATION_GATE_TITLES: Readonly<
  Record<WorkspaceRiskCertificationGateId, string>
> = Object.freeze({
  A: "Risk Contract Exists",
  B: "Risk CRUD Works",
  C: "Risk Retrieval Works",
  D: "Workspace Isolation",
  E: "Persistence",
  F: "Risk Detection Engine Exists",
  G: "Critical KPI Detection",
  H: "Warning KPI Detection",
  I: "Critical OKR Detection",
  J: "Warning OKR Detection",
  K: "Combined Detection",
  L: "Detection Confidence",
  M: "Duplicate Protection",
  N: "Risk Severity Engine Exists",
  O: "Severity Classification",
  P: "Priority Classification",
  Q: "Severity Score",
  R: "Severity Reason",
  S: "Risk Object Binding Exists",
  T: "Manual Binding",
  U: "Suggested Binding",
  V: "Object Retrieval",
  W: "Risk Retrieval",
  X: "Risk Panel Visibility",
  Y: "Risk Panel Empty State",
  Z: "Object Switching",
  AA: "Risk Dashboard Visibility",
  AB: "Dashboard Aggregation",
  AC: "Highest Priority Risk",
  AD: "Most Exposed Object",
  AE: "No Risk Mutation",
  AF: "No KPI Mutation",
  AG: "No OKR Mutation",
  AH: "No Object Mutation",
  AI: "No Relationship Mutation",
  AJ: "No Scene Mutation",
  AK: "No Topology Mutation",
  AL: "No Dashboard Route Mutation",
  AM: "No Assistant Mutation",
  AN: "Build Pass",
  AO: "Regression Pass",
});

export const WORKSPACE_RISK_CERTIFICATION_SCENARIO_TITLES: Readonly<
  Record<WorkspaceRiskCertificationScenarioId, string>
> = Object.freeze({
  scenario_1_empty_workspace: "Empty workspace risk state is safe",
  scenario_2_single_risk: "Single risk foundation and detection exist",
  scenario_3_multiple_risks: "Multiple risks aggregate correctly",
  scenario_4_critical_kpi_risk: "Critical KPI risk detected correctly",
  scenario_5_warning_kpi_risk: "Warning KPI risk detected correctly",
  scenario_6_critical_okr_risk: "Critical OKR risk detected correctly",
  scenario_7_combined_risk: "Combined KPI/OKR risk detected correctly",
  scenario_8_severity_escalation: "Severity escalation profiles exist",
  scenario_9_risk_object_binding: "Risk object binding works",
  scenario_10_risk_panel_integration: "Risk panel summary integrates correctly",
  scenario_11_risk_dashboard_integration: "Risk dashboard summary aggregates correctly",
  scenario_12_workspace_isolation: "Workspace isolation prevents cross-workspace leakage",
});
