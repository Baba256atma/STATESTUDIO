/** WS-3:3 — Canonical Goal Workspace Model identity. */
import { GoalWorkspaceFoundation } from "./goalWorkspaceFoundation.ts";
import { GoalWorkspaceRegistry } from "./goalWorkspaceRegistry.ts";

export interface GoalWorkspaceModelDescriptor {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly source: unknown;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export const GoalWorkspaceIdentityModel = Object.freeze({
  id: "WS-3:3/GoalWorkspaceModel",
  name: "Goal Workspace Model",
  namespace: "nexora.workspace.goal.model",
  layer: "Workspace",
  phase: "3:3",
  version: "1.0.0",
  status: "Model",
  readiness: "ReadyForValidation",
  foundationIdentity: GoalWorkspaceFoundation.identity,
  registryIdentity: GoalWorkspaceRegistry.identity,
  metadataOnly: true,
  immutable: true,
} as const);

