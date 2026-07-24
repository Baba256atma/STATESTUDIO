/** WS-9:3 — Canonical immutable Value Workspace Model identity. */
import { ValueWorkspaceIdentityRegistry } from "./valueWorkspaceIdentityRegistry.ts";

export const ValueWorkspaceIdentityModel = Object.freeze({
  id: "WS-9:3/ValueWorkspaceModel",
  name: "Value Workspace Model",
  phaseId: "WS-9:3",
  workspace: ValueWorkspaceIdentityRegistry.workspace,
  namespace: "nexora.workspace.value.model",
  version: "1.0.0",
  layer: "Workspace Layer",
  status: "ReadyForValidation",
  readiness: "ReadyForValidation",
  sourceRegistry: ValueWorkspaceIdentityRegistry.id,
  metadataOnly: true,
  immutable: true,
} as const);
