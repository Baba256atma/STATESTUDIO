/**
 * NW-B:9-5 — Workspace data source foundation certification contract.
 */

export const NWB95_CERTIFICATION_TAG = "[NWB95]" as const;

export const WORKSPACE_DATA_SOURCE_FOUNDATION_CERTIFICATION_TAGS = Object.freeze([
  "[NWB95]",
  "[DATA_SOURCE_FOUNDATION_CERTIFIED]",
  "[WORKSPACE_DATA_PLATFORM_READY]",
  "[DS1_READY]",
  "[NW_B9_COMPLETE]",
] as const);

export const WORKSPACE_DATA_SOURCE_FOUNDATION_COMPLETE_DIAGNOSTIC =
  "[WorkspaceDataSourceFoundation] Certification Complete" as const;

export type WorkspaceDataSourceFoundationGateId =
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
  | "K";

export type WorkspaceDataSourceFoundationGate = Readonly<{
  id: WorkspaceDataSourceFoundationGateId;
  name: string;
  status: "PASS" | "FAIL";
  detail: string;
}>;

export type WorkspaceDataSourceFoundationScenarioId =
  | "one_workspace_zero_csv"
  | "one_workspace_one_csv"
  | "one_workspace_multiple_csv"
  | "multiple_workspaces"
  | "workspace_switching"
  | "csv_remove"
  | "invalid_csv_upload";

export type WorkspaceDataSourceFoundationScenario = Readonly<{
  id: WorkspaceDataSourceFoundationScenarioId;
  name: string;
  status: "PASS" | "FAIL";
  detail: string;
}>;

export type WorkspaceDataSourceFoundationCertificationInput = Readonly<{
  buildPassed?: boolean;
  testsPassed?: boolean;
}>;

export type WorkspaceDataSourceFoundationCertificationResult = Readonly<{
  tag: typeof NWB95_CERTIFICATION_TAG;
  version: "NW-B:9-5";
  certified: boolean;
  result: "PASS" | "FAIL";
  diagnostics: readonly [typeof WORKSPACE_DATA_SOURCE_FOUNDATION_COMPLETE_DIAGNOSTIC];
  gates: readonly WorkspaceDataSourceFoundationGate[];
  scenarios: readonly WorkspaceDataSourceFoundationScenario[];
  freezeTags: typeof WORKSPACE_DATA_SOURCE_FOUNDATION_CERTIFICATION_TAGS;
  evidence: readonly string[];
}>;
