/**
 * DS-1:7 — Workspace data source foundation certification contract.
 * End-to-end certification for DS-1:1 through DS-1:6 — certification only.
 */

export const DS17_CERTIFICATION_TAG = "[DS17_CERTIFIED]" as const;

export const WORKSPACE_DATA_SOURCE_CERTIFICATION_TAGS = Object.freeze([
  "[DS17_CERTIFIED]",
  "[DATA_SOURCE_PIPELINE_CERTIFIED]",
  "[WORKSPACE_DATA_INTELLIGENCE_READY]",
  "[DS2_READY]",
  "[DS_1_COMPLETE]",
] as const);

export const WORKSPACE_DATA_SOURCE_CERTIFICATION_COMPLETE_DIAGNOSTIC =
  "[NexoraDataSourceCertification] Certification Complete" as const;

export type WorkspaceDataSourceCertificationGateId =
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
  | "X";

export type WorkspaceDataSourceCertificationGate = Readonly<{
  id: WorkspaceDataSourceCertificationGateId;
  name: string;
  status: "PASS" | "FAIL";
  detail: string;
}>;

export type WorkspaceDataSourceCertificationScenarioId =
  | "single_csv_customer"
  | "customer_supplier"
  | "multiple_approved_objects"
  | "workspace_switch"
  | "duplicate_sync_attempt"
  | "duplicate_creation_attempt"
  | "reload_persistence"
  | "scene_selection_after_sync"
  | "object_panel_after_sync"
  | "empty_workspace";

export type WorkspaceDataSourceCertificationScenario = Readonly<{
  id: WorkspaceDataSourceCertificationScenarioId;
  name: string;
  status: "PASS" | "FAIL";
  detail: string;
}>;

export type WorkspaceDataSourceCertificationInput = Readonly<{
  buildPassed?: boolean;
  testsPassed?: boolean;
}>;

export type WorkspaceDataSourceCertificationResult = Readonly<{
  tag: typeof DS17_CERTIFICATION_TAG;
  version: "DS-1:7";
  certified: boolean;
  result: "PASS" | "FAIL";
  diagnostics: readonly [typeof WORKSPACE_DATA_SOURCE_CERTIFICATION_COMPLETE_DIAGNOSTIC];
  gates: readonly WorkspaceDataSourceCertificationGate[];
  scenarios: readonly WorkspaceDataSourceCertificationScenario[];
  freezeTags: typeof WORKSPACE_DATA_SOURCE_CERTIFICATION_TAGS;
  evidence: readonly string[];
}>;
