/** WS-4:8 — Canonical Decision Workspace Freeze identity. */
export const DecisionWorkspaceFreezeIdentity = Object.freeze({
  id: "WS-4:8/DecisionWorkspaceFreeze",
  name: "Decision Workspace Freeze",
  namespace: "nexora.workspace.decision.freeze",
  layer: "Workspace Layer (WS)",
  phase: "WS-4:8",
  version: "1.0.0",
  status: "Frozen",
  readiness: "ReadyForPublicIndex",
  metadataOnly: true,
  immutable: true,
} as const);
