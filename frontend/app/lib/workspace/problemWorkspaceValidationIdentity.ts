/** WS-6:4 — Canonical Problem Workspace Validation identity. */
export interface ProblemWorkspaceValidationRecord {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly order: number;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export const ProblemWorkspaceValidationIdentity = Object.freeze({
  id: "WS-6:4/ProblemWorkspaceValidation",
  phaseId: "WS-6:4",
  name: "Problem Workspace Validation",
  namespace: "nexora.workspace.problem.validation",
  version: "1.0.0",
  layer: "Workspace Layer",
  status: "Validation",
  readiness: "ReadyForManifest",
  metadataOnly: true,
  immutable: true,
} as const);
