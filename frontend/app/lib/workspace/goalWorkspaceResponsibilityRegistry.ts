/** WS-3:2 — Responsibilities derived from Foundation. */
import { GoalWorkspaceFoundation } from "./goalWorkspaceFoundation.ts";
import type { GoalWorkspaceRegistryRecord } from "./goalWorkspaceIdentityRegistry.ts";
export const GoalWorkspaceResponsibilityRegistry = Object.freeze(
  GoalWorkspaceFoundation.responsibilities.map((source, index) => Object.freeze({
    id: `WS-3:2/Responsibility/${String(index + 1).padStart(2, "0")}`,
    key: `responsibility-${String(index + 1).padStart(2, "0")}`,
    name: source.name, description: source.description,
    registryCategory: "Responsibility", source, sourcePhase: "WS-3:1",
    version: "1.0.0", stability: "Stable", ownership: "Goal Workspace",
    metadataOnly: true, immutable: true,
  })) satisfies readonly GoalWorkspaceRegistryRecord[],
);

