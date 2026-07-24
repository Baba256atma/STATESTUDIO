/** WS-7:3 — Canonical Decision Workspace Model identity. */
import { DecisionWorkspaceV7Foundation } from "./decisionWorkspaceV7Foundation.ts";
import { DecisionWorkspaceV7Registry } from "./decisionWorkspaceV7Registry.ts";

export interface DecisionWorkspaceV7ModelDescriptor {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly source: unknown;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export const DecisionWorkspaceV7IdentityModel = Object.freeze({
  id: "WS-7:3/DecisionWorkspaceModel",
  name: "Decision Workspace Model",
  phaseId: "WS-7:3",
  namespace: "nexora.workspace.decision.model",
  version: "1.0.0",
  layer: "Workspace Layer",
  status: "ReadyForValidation",
  readiness: "ReadyForValidation",
  foundationIdentity: DecisionWorkspaceV7Foundation.identity,
  registryIdentity: DecisionWorkspaceV7Registry.identity,
  metadataOnly: true,
  immutable: true,
} as const);
