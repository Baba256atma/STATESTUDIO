/** WS-6:1 — Canonical Problem Workspace Foundation identity metadata. */
export interface ProblemWorkspaceDeclaration {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly executable: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export const ProblemWorkspaceIdentity = Object.freeze({
  id: "WS-6:1/ProblemWorkspaceFoundation",
  phaseId: "WS-6:1",
  workspace: "Problem Workspace",
  name: "Problem Workspace Foundation",
  namespace: "nexora.workspace.problem.foundation",
  version: "1.0.0",
  layer: "Workspace Layer",
  status: "Foundation",
  readiness: "ReadyForRegistry",
  metadataOnly: true,
  immutable: true,
} as const);
