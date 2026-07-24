/** WS-5:4 — Canonical Validation identity and metadata shape. */
export interface ScenarioWorkspaceValidationRecord {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly order: number;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export const ScenarioWorkspaceValidationIdentity = Object.freeze({
  id: "WS-5:4/ScenarioWorkspaceValidation",
  name: "Scenario Workspace Validation",
  namespace: "nexora.workspace.scenario.validation",
  layer: "Workspace Layer (WS)",
  phase: "WS-5:4",
  version: "1.0.0",
  status: "Validation",
  readiness: "ReadyForManifest",
  metadataOnly: true,
  immutable: true,
} as const);
