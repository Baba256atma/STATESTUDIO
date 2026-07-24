/** WS-6:5 — Canonical Problem Workspace Manifest identity. */
export const ProblemWorkspaceManifestIdentity = Object.freeze({
  id: "WS-6:5/ProblemWorkspaceManifest",
  phaseId: "WS-6:5",
  name: "Problem Workspace Manifest",
  workspace: "Problem Workspace",
  namespace: "nexora.workspace.problem.manifest",
  version: "1.0.0",
  layer: "Workspace Layer",
  status: "ReadyForPlatform",
  readiness: "ReadyForPlatform",
  metadataOnly: true,
  immutable: true,
} as const);
