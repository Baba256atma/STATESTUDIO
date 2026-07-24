/** WS-4:1 — Canonical Decision Workspace Foundation identity metadata. */
export interface DecisionWorkspaceDeclaration {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly executable: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export const DecisionWorkspaceIdentity = Object.freeze({
  id: "WS-4:1/DecisionWorkspaceFoundation",
  workspace: "Decision Workspace",
  name: "Decision Workspace Foundation",
  layer: "Workspace Layer (WS)",
  phase: "WS-4:1",
  namespace: "nexora.workspace.decision.foundation",
  version: "1.0.0",
  status: "Foundation",
  readiness: "ReadyForRegistry",
  metadataOnly: true,
  immutable: true,
} as const);
