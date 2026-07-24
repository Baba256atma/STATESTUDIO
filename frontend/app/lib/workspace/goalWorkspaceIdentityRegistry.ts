/** WS-3:2 — Canonical Registry identity and record shape. */
import { GoalWorkspaceFoundation } from "./goalWorkspaceFoundation.ts";

export interface GoalWorkspaceRegistryRecord<TSource = unknown> {
  readonly id: string;
  readonly key: string;
  readonly name: string;
  readonly description: string;
  readonly registryCategory: string;
  readonly source: TSource;
  readonly sourcePhase: "WS-3:1";
  readonly version: "1.0.0";
  readonly stability: "Stable";
  readonly ownership: "Goal Workspace";
  readonly metadataOnly: true;
  readonly immutable: true;
}

export const GoalWorkspaceIdentityRegistry = Object.freeze({
  id: "WS-3:2/GoalWorkspaceRegistry",
  key: "goal-workspace-registry",
  name: "Goal Workspace Registry",
  workspace: GoalWorkspaceFoundation.identity.workspace,
  canonicalIdentifier: GoalWorkspaceFoundation.identity.id,
  namespace: "nexora.workspace.goal.registry",
  version: "1.0.0",
  status: "Registry",
  readiness: "ReadyForModel",
  ownership: "Goal Workspace",
  sourcePhase: "WS-3:1",
  source: GoalWorkspaceFoundation.identity,
  stability: "Stable",
  metadataOnly: true,
  immutable: true,
} as const);

