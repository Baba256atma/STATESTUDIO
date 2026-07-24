/** WS-6:2 — Canonical Problem Workspace Registry identity and record shape. */
import { ProblemWorkspaceFoundation } from "./problemWorkspaceFoundation.ts";

export interface ProblemWorkspaceRegistryRecord<TSource = unknown> {
  readonly id: string;
  readonly key: string;
  readonly name: string;
  readonly description: string;
  readonly registryCategory: string;
  readonly source: TSource;
  readonly sourcePhase: "WS-6:1" | "WS-6:2";
  readonly version: "1.0.0";
  readonly ownership: "Problem Workspace";
  readonly metadataOnly: true;
  readonly immutable: true;
}

export const ProblemWorkspaceIdentityRegistry = Object.freeze({
  id: "WS-6:2/ProblemWorkspaceRegistry",
  phaseId: "WS-6:2",
  key: "problem-workspace-registry",
  name: "Problem Workspace Registry",
  namespace: "nexora.workspace.problem.registry",
  version: "1.0.0",
  layer: "Workspace Layer",
  status: "Registry",
  readiness: "ReadyForModel",
  ownership: "Problem Workspace",
  sourcePhase: "WS-6:1",
  source: ProblemWorkspaceFoundation.identity,
  metadataOnly: true,
  immutable: true,
} as const);
