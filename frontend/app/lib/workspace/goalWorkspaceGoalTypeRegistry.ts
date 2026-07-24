/** WS-3:2 — Goal categories derived from Foundation. */
import { GoalWorkspaceFoundation } from "./goalWorkspaceFoundation.ts";
import type { GoalWorkspaceRegistryRecord } from "./goalWorkspaceIdentityRegistry.ts";
export const GoalWorkspaceGoalTypeRegistry = Object.freeze(
  GoalWorkspaceFoundation.goalTypes.map((source, index) => Object.freeze({
    id: `WS-3:2/GoalType/${String(index + 1).padStart(2, "0")}`,
    key: `goal-type-${String(index + 1).padStart(2, "0")}`,
    name: source, description: `Registers ${source} as a canonical Goal category.`,
    registryCategory: "GoalType", source, sourcePhase: "WS-3:1",
    version: "1.0.0", stability: "Stable", ownership: "Goal Workspace",
    metadataOnly: true, immutable: true,
  })) satisfies readonly GoalWorkspaceRegistryRecord[],
);

