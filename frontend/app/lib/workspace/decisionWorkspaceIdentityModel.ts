/** WS-4:3 — Canonical Decision Workspace Model identity. */
import { DecisionWorkspaceFoundation } from "./decisionWorkspaceFoundation.ts";
import { DecisionWorkspaceRegistry } from "./decisionWorkspaceRegistry.ts";

export interface DecisionWorkspaceModelDescriptor {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly source: unknown;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export const DecisionWorkspaceIdentityModel = Object.freeze({
  id: "WS-4:3/DecisionWorkspaceModel",
  name: "Decision Workspace Model",
  namespace: "nexora.workspace.decision.model",
  layer: "Workspace Layer (WS)",
  phase: "WS-4:3",
  version: "1.0.0",
  status: "Model",
  readiness: "ReadyForValidation",
  foundationIdentity: DecisionWorkspaceFoundation.identity,
  registryIdentity: DecisionWorkspaceRegistry.identity,
  metadataOnly: true,
  immutable: true,
} as const);
