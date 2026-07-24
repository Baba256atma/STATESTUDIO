/** WS-3:5 — Canonical Goal Workspace Manifest identity. */
export const GoalWorkspaceManifestIdentity = Object.freeze({
  id: "WS-3:5/GoalWorkspaceManifest",
  name: "Goal Workspace Manifest",
  namespace: "nexora.workspace.goal.manifest",
  layer: "Workspace", phase: "3:5", version: "1.0.0",
  status: "Manifest", readiness: "ReadyForPlatform",
  metadataOnly: true, immutable: true,
} as const);

