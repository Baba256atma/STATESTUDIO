/** WS-3:4 — Canonical Validation identity and metadata shape. */
export interface GoalWorkspaceValidationRecord {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly order: number;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export const GoalWorkspaceValidationIdentity = Object.freeze({
  id: "WS-3:4/GoalWorkspaceValidation",
  name: "Goal Workspace Validation",
  namespace: "nexora.workspace.goal.validation",
  layer: "Workspace",
  phase: "3:4",
  version: "1.0.0",
  status: "Validation",
  readiness: "ReadyForManifest",
  metadataOnly: true,
  immutable: true,
} as const);

