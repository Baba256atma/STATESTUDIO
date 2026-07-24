/** WS-6:8 — Canonical Problem Workspace Freeze identity. */
export const ProblemWorkspaceFreezeIdentity = Object.freeze({
  id: "WS-6:8/ProblemWorkspaceFreeze",
  name: "Problem Workspace Freeze",
  phaseId: "WS-6:8",
  workspace: "Problem Workspace",
  namespace: "nexora.workspace.problem.freeze",
  version: "1.0.0",
  layer: "Workspace Layer",
  status: "ReadyForPublicIndex",
  readiness: "ReadyForPublicIndex",
  metadataOnly: true,
  immutable: true,
} as const);
