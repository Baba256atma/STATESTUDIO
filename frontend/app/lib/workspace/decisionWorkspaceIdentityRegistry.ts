/** WS-4:2 — Canonical Registry identity and record shape. */
import { DecisionWorkspaceFoundation } from "./decisionWorkspaceFoundation.ts";

export interface DecisionWorkspaceRegistryRecord<TSource = unknown> {
  readonly id: string;
  readonly key: string;
  readonly name: string;
  readonly description: string;
  readonly registryCategory: string;
  readonly source: TSource;
  readonly sourcePhase: "WS-4:1";
  readonly version: "1.0.0";
  readonly stability: "Stable";
  readonly ownership: "Decision Workspace";
  readonly metadataOnly: true;
  readonly immutable: true;
}

export const DecisionWorkspaceIdentityRegistry = Object.freeze({
  id: "WS-4:2/DecisionWorkspaceRegistry",
  key: "decision-workspace-registry",
  name: "Decision Workspace Registry",
  workspace: DecisionWorkspaceFoundation.identity.workspace,
  canonicalIdentifier: DecisionWorkspaceFoundation.identity.id,
  namespace: "nexora.workspace.decision.registry",
  version: "1.0.0",
  status: "Registry",
  readiness: "ReadyForModel",
  ownership: "Decision Workspace",
  sourcePhase: "WS-4:1",
  source: DecisionWorkspaceFoundation.identity,
  stability: "Stable",
  metadataOnly: true,
  immutable: true,
} as const);
