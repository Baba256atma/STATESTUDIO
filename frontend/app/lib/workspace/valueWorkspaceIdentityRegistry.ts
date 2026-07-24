/** WS-9:2 — Canonical immutable Value Workspace Registry identity. */
import { ValueWorkspaceIdentity } from "./valueWorkspaceIdentity.ts";

export const ValueWorkspaceIdentityRegistry = Object.freeze({
  id: "WS-9:2/ValueWorkspaceRegistry",
  name: "Value Workspace Registry",
  phaseId: "WS-9:2",
  workspace: ValueWorkspaceIdentity.workspace,
  namespace: "nexora.workspace.value.registry",
  version: "1.0.0",
  layer: "Workspace Layer",
  status: "ReadyForModel",
  readiness: "ReadyForModel",
  owner: "Nexora Architecture",
  sourcePhase: ValueWorkspaceIdentity.id,
  stability: "Stable",
  metadataOnly: true,
  immutable: true,
} as const);
