/** WS-7:5 — Canonical Decision Workspace Manifest identity. */
export const DecisionWorkspaceV7ManifestIdentity = Object.freeze({
  id: "WS-7:5/DecisionWorkspaceManifest",
  name: "Decision Workspace Manifest",
  phaseId: "WS-7:5",
  workspace: "Decision Workspace",
  namespace: "nexora.workspace.decision.manifest",
  version: "1.0.0",
  layer: "Workspace Layer",
  status: "ReadyForPlatform",
  readiness: "ReadyForPlatform",
  metadataOnly: true,
  immutable: true,
} as const);
