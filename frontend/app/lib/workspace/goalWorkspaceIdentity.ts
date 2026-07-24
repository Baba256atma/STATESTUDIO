/** WS-3:1 — Canonical Goal Workspace Foundation identity metadata. */
export interface GoalWorkspaceDeclaration {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly executable: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export const GoalWorkspaceIdentity = Object.freeze({
  id: "WS-3:1/GoalWorkspaceFoundation",
  workspace: "Goal Workspace",
  name: "Goal Workspace Foundation",
  layer: "Workspace",
  phase: "3:1",
  namespace: "nexora.workspace.goal.foundation",
  version: "1.0.0",
  status: "Foundation",
  readiness: "ReadyForRegistry",
  metadataOnly: true,
  immutable: true,
} as const);

