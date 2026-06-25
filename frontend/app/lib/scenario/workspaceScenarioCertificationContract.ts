/**
 * DS-7:7 — Scenario Intelligence certification contract.
 * Certification only — no feature creation, engine changes, or runtime refactor.
 */

import type { WorkspaceId } from "../workspace/workspaceRegistryContract.ts";

export const WORKSPACE_SCENARIO_CERTIFICATION_VERSION = "DS-7:7" as const;

export const WORKSPACE_SCENARIO_CERTIFICATION_TAGS = Object.freeze([
  "[DS77_CERTIFIED]",
  "[SCENARIO_INTELLIGENCE_CERTIFIED]",
  "[SCENARIO_MVP_COMPLETE]",
  "[EXECUTIVE_WORKFLOW_CERTIFIED]",
  "[DS8_READY]",
  "[DS_7_COMPLETE]",
] as const);

export const NEXORA_SCENARIO_CERTIFICATION_LOG_PREFIX = "[NexoraScenarioCertification]" as const;

export type WorkspaceScenarioCertificationStatus = "PASS" | "WARNING" | "FAIL";

export type WorkspaceScenarioCertificationGateId =
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
  | "AK";

export type WorkspaceScenarioCertificationScenarioId =
  | "scenario_1_empty_workspace"
  | "scenario_2_single_scenario"
  | "scenario_3_simulation"
  | "scenario_4_comparison"
  | "scenario_5_workspace_integration"
  | "scenario_6_executive_advisor"
  | "scenario_7_multiple_scenarios"
  | "scenario_8_workspace_isolation"
  | "scenario_9_repeated_simulation"
  | "scenario_10_repeated_comparison"
  | "scenario_11_read_only_validation"
  | "scenario_12_complete_executive_workflow";

export type WorkspaceScenarioCertificationGateResult = Readonly<{
  gateId: WorkspaceScenarioCertificationGateId;
  title: string;
  status: WorkspaceScenarioCertificationStatus;
  evidence: string;
}>;

export type WorkspaceScenarioCertificationScenarioResult = Readonly<{
  scenarioId: WorkspaceScenarioCertificationScenarioId;
  title: string;
  status: WorkspaceScenarioCertificationStatus;
  evidence: string;
}>;

export type WorkspaceScenarioCertificationWarning = Readonly<{
  title: string;
  status: WorkspaceScenarioCertificationStatus;
  evidence: string;
}>;

export type WorkspaceScenarioCertificationResult = Readonly<{
  contractVersion: typeof WORKSPACE_SCENARIO_CERTIFICATION_VERSION;
  workspaceId: WorkspaceId | null;
  passed: boolean;
  certified: boolean;
  gateResults: readonly WorkspaceScenarioCertificationGateResult[];
  scenarioResults: readonly WorkspaceScenarioCertificationScenarioResult[];
  warnings: readonly WorkspaceScenarioCertificationWarning[];
  summary: string;
  generatedAt: string;
  tags: typeof WORKSPACE_SCENARIO_CERTIFICATION_TAGS;
}>;

export const WORKSPACE_SCENARIO_CERTIFICATION_GATE_TITLES: Readonly<
  Record<WorkspaceScenarioCertificationGateId, string>
> = Object.freeze({
  A: "Scenario Foundation Exists",
  B: "Scenario CRUD Works",
  C: "Workspace Isolation",
  D: "Persistence",
  E: "Scenario Metadata",
  F: "Scenario Insight Engine Exists",
  G: "Insight Reasons",
  H: "Assumptions",
  I: "Overrides",
  J: "Simulation Engine Exists",
  K: "Deterministic Simulation",
  L: "Reproducibility",
  M: "Comparison Engine Exists",
  N: "Tradeoffs",
  O: "Executive Questions",
  P: "Workspace Integration Exists",
  Q: "Executive Summary Integration",
  R: "Object Panel Integration",
  S: "Operational Feed Integration",
  T: "Executive Advisor Exists",
  U: "Assistant Router",
  V: "Assistant Cards",
  W: "Timeline Reservation",
  X: "Metrics Reservation",
  Y: "Architecture Reservation",
  Z: "Read-only Validation",
  AA: "No Workspace Mutation",
  AB: "No KPI Mutation",
  AC: "No OKR Mutation",
  AD: "No Risk Mutation",
  AE: "No Object Mutation",
  AF: "No Relationship Mutation",
  AG: "No Dashboard Mutation",
  AH: "No Assistant Mutation",
  AI: "Build Pass",
  AJ: "Regression Pass",
  AK: "Full Workflow",
});

export const WORKSPACE_SCENARIO_CERTIFICATION_SCENARIO_TITLES: Readonly<
  Record<WorkspaceScenarioCertificationScenarioId, string>
> = Object.freeze({
  scenario_1_empty_workspace: "Empty workspace scenario state is safe",
  scenario_2_single_scenario: "Single scenario foundation and insight exist",
  scenario_3_simulation: "Scenario simulation completes with predictions",
  scenario_4_comparison: "Scenario comparison produces tradeoffs",
  scenario_5_workspace_integration: "Workspace integration surfaces scenario summary",
  scenario_6_executive_advisor: "Executive advisor explains scenario intelligence",
  scenario_7_multiple_scenarios: "Multiple scenarios aggregate correctly",
  scenario_8_workspace_isolation: "Workspace isolation prevents cross-workspace leakage",
  scenario_9_repeated_simulation: "Repeated simulation is deterministic",
  scenario_10_repeated_comparison: "Repeated comparison is stable",
  scenario_11_read_only_validation: "Certification pass is read-only",
  scenario_12_complete_executive_workflow: "Complete executive workflow is certified",
});
