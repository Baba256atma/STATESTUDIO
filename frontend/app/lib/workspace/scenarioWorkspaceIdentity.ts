/** WS-5:1 — Canonical Scenario Workspace Foundation identity metadata. */
export interface ScenarioWorkspaceDeclaration {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly executable: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export const ScenarioWorkspaceIdentity = Object.freeze({
  id: "WS-5:1/ScenarioWorkspaceFoundation",
  workspace: "Scenario Workspace",
  name: "Scenario Workspace Foundation",
  layer: "Workspace Layer (WS)",
  phase: "WS-5:1",
  namespace: "nexora.workspace.scenario.foundation",
  version: "1.0.0",
  status: "Foundation",
  readiness: "ReadyForRegistry",
  metadataOnly: true,
  immutable: true,
} as const);
