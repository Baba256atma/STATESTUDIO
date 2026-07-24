/** WS-4:5 — Canonical Decision Workspace Manifest identity. */
export const DecisionWorkspaceManifestIdentity = Object.freeze({
  id: "WS-4:5/DecisionWorkspaceManifest",
  name: "Decision Workspace Manifest",
  namespace: "nexora.workspace.decision.manifest",
  layer: "Workspace Layer (WS)",
  phase: "WS-4:5",
  version: "1.0.0",
  status: "Manifest",
  readiness: "ReadyForPlatform",
  metadataOnly: true,
  immutable: true,
} as const);
