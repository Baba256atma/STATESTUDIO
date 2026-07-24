/** WS-9:4 — Canonical immutable Value Workspace Validation identity. */
import { ValueWorkspaceIdentityModel } from "./valueWorkspaceIdentityModel.ts";

export const ValueWorkspaceValidationIdentity = Object.freeze({
  id: "WS-9:4/ValueWorkspaceValidation",
  name: "Value Workspace Validation",
  phaseId: "WS-9:4",
  workspace: ValueWorkspaceIdentityModel.workspace,
  namespace: "nexora.workspace.value.validation",
  version: "1.0.0",
  layer: "Workspace Layer",
  status: "ReadyForManifest",
  readiness: "ReadyForManifest",
  sourceModel: ValueWorkspaceIdentityModel.id,
  metadataOnly: true,
  immutable: true,
} as const);
