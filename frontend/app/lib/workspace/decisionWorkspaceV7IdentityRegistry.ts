/** WS-7:2 — Canonical Decision Workspace Registry identity. */
import { DecisionWorkspaceV7Foundation } from "./decisionWorkspaceV7Foundation.ts";

export const DecisionWorkspaceV7IdentityRegistry = Object.freeze({
  id: "WS-7:2/DecisionWorkspaceRegistry",
  key: "decision-workspace-registry",
  name: "Decision Workspace Registry",
  phaseId: "WS-7:2",
  namespace: "nexora.workspace.decision.registry",
  version: "1.0.0",
  layer: "Workspace Layer",
  status: "ReadyForModel",
  readiness: "ReadyForModel",
  source: DecisionWorkspaceV7Foundation.identity,
  metadataOnly: true,
  immutable: true,
} as const);
