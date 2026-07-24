/** WS-7:8 — Canonical Decision Workspace Freeze identity. */
export const DecisionWorkspaceV7FreezeIdentity = Object.freeze({
  id: "WS-7:8/DecisionWorkspaceFreeze",
  name: "Decision Workspace Freeze",
  phaseId: "WS-7:8",
  workspace: "Decision Workspace",
  namespace: "nexora.workspace.decision.freeze",
  version: "1.0.0",
  layer: "Workspace Layer",
  status: "ReadyForPublicIndex",
  readiness: "ReadyForPublicIndex",
  metadataOnly: true,
  immutable: true,
} as const);
