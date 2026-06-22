/**
 * DS-2:6 — Full relationship intelligence certification contract.
 * Certification only — no feature creation, scene mutation, topology mutation, or runtime refactor.
 */

import type { WorkspaceId } from "./workspaceRegistryContract.ts";

export const WORKSPACE_RELATIONSHIP_CERTIFICATION_VERSION = "DS-2:6" as const;

export const WORKSPACE_RELATIONSHIP_CERTIFICATION_TAGS = Object.freeze([
  "[DS26_CERTIFIED]",
  "[RELATIONSHIP_INTELLIGENCE_CERTIFIED]",
  "[WORKSPACE_RELATIONSHIP_PLATFORM_READY]",
  "[DS3_READY]",
  "[DS_2_COMPLETE]",
] as const);

export const NEXORA_RELATIONSHIP_CERTIFICATION_LOG_PREFIX =
  "[NexoraRelationshipCertification]" as const;

export type WorkspaceRelationshipCertificationStatus = "PASS" | "WARNING" | "FAIL";

export type WorkspaceRelationshipCertificationGateId =
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
  | "AC";

export type WorkspaceRelationshipCertificationScenarioId =
  | "scenario_1_supplier_product"
  | "scenario_2_customer_product"
  | "scenario_3_employee_department"
  | "scenario_4_project_department"
  | "scenario_5_multiple_relationship_set"
  | "scenario_6_duplicate_relationship_creation"
  | "scenario_7_duplicate_relationship_sync"
  | "scenario_8_workspace_switching"
  | "scenario_9_reload_persistence"
  | "scenario_10_object_selection_after_sync"
  | "scenario_11_relationship_rendering_stress"
  | "scenario_12_empty_workspace";

export type WorkspaceRelationshipCertificationGate = Readonly<{
  gateId: WorkspaceRelationshipCertificationGateId;
  title: string;
  status: WorkspaceRelationshipCertificationStatus;
  evidence: string;
}>;

export type WorkspaceRelationshipCertificationScenario = Readonly<{
  scenarioId: WorkspaceRelationshipCertificationScenarioId;
  title: string;
  status: WorkspaceRelationshipCertificationStatus;
  evidence: string;
}>;

export type WorkspaceRelationshipKnownAuditCheck = Readonly<{
  title: string;
  status: WorkspaceRelationshipCertificationStatus;
  evidence: string;
}>;

export type WorkspaceRelationshipCertificationReport = Readonly<{
  contractVersion: typeof WORKSPACE_RELATIONSHIP_CERTIFICATION_VERSION;
  workspaceId: WorkspaceId | null;
  certifiedAt: string;
  overallStatus: WorkspaceRelationshipCertificationStatus;
  gates: readonly WorkspaceRelationshipCertificationGate[];
  scenarios: readonly WorkspaceRelationshipCertificationScenario[];
  knownAuditChecks: readonly WorkspaceRelationshipKnownAuditCheck[];
  diagnosticsPrefixes: readonly string[];
  tags: typeof WORKSPACE_RELATIONSHIP_CERTIFICATION_TAGS;
}>;

export const WORKSPACE_RELATIONSHIP_CERTIFICATION_GATE_TITLES: Readonly<
  Record<WorkspaceRelationshipCertificationGateId, string>
> = Object.freeze({
  A: "Relationship Candidate Discovery Works",
  B: "Relationship Classification Works",
  C: "Relationship Approval Works",
  D: "Relationship Creation Works",
  E: "Relationship Scene Sync Works",
  F: "Workspace Isolation Preserved",
  G: "Relationship Traceability Preserved",
  H: "Relationship Type Preservation",
  I: "Relationship Direction Preservation",
  J: "Relationship Confidence Preservation",
  K: "Duplicate Relationship Creation Protection",
  L: "Duplicate Scene Sync Protection",
  M: "Relationship Rendering Visible",
  N: "Relationship Rendering Stable",
  O: "No Relationship Renderer Regression",
  P: "No RelationshipLine Regression",
  Q: "No Topology Creation",
  R: "No Object Repositioning",
  S: "No Scene Placement Mutation",
  T: "No Object Click Regression",
  U: "No Selection Regression",
  V: "No Dashboard Routing Regression",
  W: "No MRP Regression",
  X: "No Assistant Runtime Mutation",
  Y: "No Recursive setSceneJson",
  Z: "No Relationship Sync Loop",
  AA: "No Scene Freeze",
  AB: "Workspace Switching Works",
  AC: "Build Passes",
});

export const WORKSPACE_RELATIONSHIP_CERTIFICATION_SCENARIO_TITLES: Readonly<
  Record<WorkspaceRelationshipCertificationScenarioId, string>
> = Object.freeze({
  scenario_1_supplier_product: "Supplier to Product supplies relationship visible",
  scenario_2_customer_product: "Customer to Product purchases relationship visible",
  scenario_3_employee_department: "Employee to Department belongs_to relationship visible",
  scenario_4_project_department: "Project to Department managed_by relationship visible",
  scenario_5_multiple_relationship_set: "Multiple relationship set visible",
  scenario_6_duplicate_relationship_creation: "Duplicate relationship creation attempt blocked",
  scenario_7_duplicate_relationship_sync: "Duplicate relationship sync attempt blocked",
  scenario_8_workspace_switching: "Workspace switching preserves isolation",
  scenario_9_reload_persistence: "Reload persistence restores relationships",
  scenario_10_object_selection_after_sync: "Object selection after relationship sync remains safe",
  scenario_11_relationship_rendering_stress: "Relationship rendering stress remains stable",
  scenario_12_empty_workspace: "Empty workspace is a safe no-op",
});
