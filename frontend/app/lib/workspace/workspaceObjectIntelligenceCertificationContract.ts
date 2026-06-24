/**
 * DS-3:7 — Full object intelligence certification contract.
 * Certification only — no feature creation, engine changes, scene mutation, or runtime refactor.
 */

import type { WorkspaceId } from "./workspaceRegistryContract.ts";

export const WORKSPACE_OBJECT_INTELLIGENCE_CERTIFICATION_VERSION = "DS-3:7" as const;

export const WORKSPACE_OBJECT_INTELLIGENCE_CERTIFICATION_TAGS = Object.freeze([
  "[DS37_CERTIFIED]",
  "[OBJECT_INTELLIGENCE_CERTIFIED]",
  "[OBJECT_INTELLIGENCE_MVP_COMPLETE]",
  "[DS4_READY]",
  "[DS_3_COMPLETE]",
] as const);

export const NEXORA_OBJECT_INTELLIGENCE_CERTIFICATION_LOG_PREFIX =
  "[NexoraObjectIntelligenceCertification]" as const;

export type WorkspaceObjectIntelligenceCertificationStatus = "PASS" | "WARNING" | "FAIL";

export type WorkspaceObjectIntelligenceCertificationGateId =
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

export type WorkspaceObjectIntelligenceCertificationScenarioId =
  | "scenario_1_single_object"
  | "scenario_2_supplier_product"
  | "scenario_3_customer_product"
  | "scenario_4_multiple_relationships"
  | "scenario_5_high_connectivity_object"
  | "scenario_6_missing_profiles"
  | "scenario_7_deleted_object"
  | "scenario_8_object_deselect"
  | "scenario_9_workspace_switching"
  | "scenario_10_reload_persistence"
  | "scenario_11_scene_object_click"
  | "scenario_12_stress_object_selection";

export type WorkspaceObjectIntelligenceCertificationGate = Readonly<{
  gateId: WorkspaceObjectIntelligenceCertificationGateId;
  title: string;
  status: WorkspaceObjectIntelligenceCertificationStatus;
  evidence: string;
}>;

export type WorkspaceObjectIntelligenceCertificationScenario = Readonly<{
  scenarioId: WorkspaceObjectIntelligenceCertificationScenarioId;
  title: string;
  status: WorkspaceObjectIntelligenceCertificationStatus;
  evidence: string;
}>;

export type WorkspaceObjectIntelligenceKnownAuditCheck = Readonly<{
  title: string;
  status: WorkspaceObjectIntelligenceCertificationStatus;
  evidence: string;
}>;

export type WorkspaceObjectIntelligenceCertificationReport = Readonly<{
  contractVersion: typeof WORKSPACE_OBJECT_INTELLIGENCE_CERTIFICATION_VERSION;
  workspaceId: WorkspaceId | null;
  certifiedAt: string;
  certified: boolean;
  overallStatus: WorkspaceObjectIntelligenceCertificationStatus;
  gates: readonly WorkspaceObjectIntelligenceCertificationGate[];
  scenarios: readonly WorkspaceObjectIntelligenceCertificationScenario[];
  knownAuditChecks: readonly WorkspaceObjectIntelligenceKnownAuditCheck[];
  diagnosticsPrefixes: readonly string[];
  tags: typeof WORKSPACE_OBJECT_INTELLIGENCE_CERTIFICATION_TAGS;
}>;

export const WORKSPACE_OBJECT_INTELLIGENCE_CERTIFICATION_GATE_TITLES: Readonly<
  Record<WorkspaceObjectIntelligenceCertificationGateId, string>
> = Object.freeze({
  A: "Object Intelligence Profiles Created",
  B: "Relationship Metrics Correct",
  C: "Connected Object Counts Correct",
  D: "Impact Profiles Created",
  E: "Impact Scores Correct",
  F: "Dependency Profiles Created",
  G: "Dependency Scores Correct",
  H: "Confidence Profiles Created",
  I: "Confidence Scores Correct",
  J: "Object Intelligence Panel Visible",
  K: "Impact Display Visible",
  L: "Dependency Display Visible",
  M: "Confidence Display Visible",
  N: "Why Section Visible",
  O: "Object Click Integration Works",
  P: "Scene Object Resolution Works",
  Q: "Workspace Object Resolution Works",
  R: "Pipeline Object Resolution Works",
  S: "Deleted Object Safety Works",
  T: "Missing Intelligence Safety Works",
  U: "Object Deselect Works",
  V: "Workspace Switching Works",
  W: "Workspace Isolation Preserved",
  X: "Persistence Preserved",
  Y: "No Engine Recalculation",
  Z: "No Scene Mutation",
  AA: "No Topology Mutation",
  AB: "No Relationship Rendering Mutation",
  AC: "No Object Position Mutation",
  AD: "No Dashboard Mutation",
  AE: "No Assistant Mutation",
  AF: "No MRP Mutation",
  AG: "No Object Click Regression",
  AH: "No Selection Regression",
  AI: "No Panel Freeze",
  AJ: "No Recursive Loops",
  AK: "Build Passes",
});

export const WORKSPACE_OBJECT_INTELLIGENCE_CERTIFICATION_SCENARIO_TITLES: Readonly<
  Record<WorkspaceObjectIntelligenceCertificationScenarioId, string>
> = Object.freeze({
  scenario_1_single_object: "Single object intelligence profile exists",
  scenario_2_supplier_product: "Supplier to Product impact, dependency, and confidence generated",
  scenario_3_customer_product: "Customer to Product intelligence generated",
  scenario_4_multiple_relationships: "Multiple relationships increase impact and dependency",
  scenario_5_high_connectivity_object: "High connectivity object receives high impact and dependency",
  scenario_6_missing_profiles: "Missing profiles render safe fallback",
  scenario_7_deleted_object: "Deleted object handled gracefully without crash",
  scenario_8_object_deselect: "Object deselect closes panel correctly",
  scenario_9_workspace_switching: "Workspace switching prevents cross-workspace leakage",
  scenario_10_reload_persistence: "Reload persistence restores profiles",
  scenario_11_scene_object_click: "Scene object click loads object intelligence",
  scenario_12_stress_object_selection: "Stress object selection avoids panel freeze and loops",
});
