/** WS-4:4 — Canonical Validation identity and metadata shape. */
export interface DecisionWorkspaceValidationRecord {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly order: number;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export const DecisionWorkspaceValidationIdentity = Object.freeze({
  id: "WS-4:4/DecisionWorkspaceValidation",
  name: "Decision Workspace Validation",
  namespace: "nexora.workspace.decision.validation",
  layer: "Workspace Layer (WS)",
  phase: "WS-4:4",
  version: "1.0.0",
  status: "Validation",
  readiness: "ReadyForManifest",
  metadataOnly: true,
  immutable: true,
} as const);
