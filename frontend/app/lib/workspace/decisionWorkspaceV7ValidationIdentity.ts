/** WS-7:4 — Canonical Decision Workspace Validation identity. */
export interface DecisionWorkspaceV7ValidationRecord {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly order: number;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export const DecisionWorkspaceV7ValidationIdentity = Object.freeze({
  id: "WS-7:4/DecisionWorkspaceValidation",
  name: "Decision Workspace Validation",
  phaseId: "WS-7:4",
  namespace: "nexora.workspace.decision.validation",
  version: "1.0.0",
  layer: "Workspace Layer",
  status: "ReadyForManifest",
  readiness: "ReadyForManifest",
  metadataOnly: true,
  immutable: true,
} as const);
