/** WS-6:3 — Canonical Problem Workspace Model identity. */
import { ProblemWorkspaceFoundation } from "./problemWorkspaceFoundation.ts";
import { ProblemWorkspaceRegistry } from "./problemWorkspaceRegistry.ts";

export interface ProblemWorkspaceModelDescriptor {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly source: unknown;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export const ProblemWorkspaceIdentityModel = Object.freeze({
  id: "WS-6:3/ProblemWorkspaceModel",
  phaseId: "WS-6:3",
  name: "Problem Workspace Model",
  namespace: "nexora.workspace.problem.model",
  version: "1.0.0",
  layer: "Workspace Layer",
  status: "Model",
  readiness: "ReadyForValidation",
  foundationIdentity: ProblemWorkspaceFoundation.identity,
  registryIdentity: ProblemWorkspaceRegistry.identity,
  metadataOnly: true,
  immutable: true,
} as const);
