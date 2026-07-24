/** WS-5:5 — Canonical Scenario Workspace Manifest identity. */
export const ScenarioWorkspaceManifestIdentity = Object.freeze({
  id: "WS-5:5/ScenarioWorkspaceManifest",
  name: "Scenario Workspace Manifest",
  namespace: "nexora.workspace.scenario.manifest",
  layer: "Workspace Layer (WS)",
  phase: "WS-5:5",
  version: "1.0.0",
  status: "Manifest",
  readiness: "ReadyForPlatform",
  metadataOnly: true,
  immutable: true,
} as const);
