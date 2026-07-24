/** WS-3:2 — Lifecycle states derived from Foundation. */
import { GoalWorkspaceFoundation } from "./goalWorkspaceFoundation.ts";
import type { GoalWorkspaceRegistryRecord } from "./goalWorkspaceIdentityRegistry.ts";
export const GoalWorkspaceLifecycleRegistry = Object.freeze(
  GoalWorkspaceFoundation.lifecycle.map((source) => Object.freeze({
    id: `WS-3:2/Lifecycle/${source}`, key: `lifecycle-${source.toLowerCase()}`,
    name: source, description: `Registers the ${source} Goal lifecycle state.`,
    registryCategory: "Lifecycle", source, sourcePhase: "WS-3:1",
    version: "1.0.0", stability: "Stable", ownership: "Goal Workspace",
    metadataOnly: true, immutable: true,
  })) satisfies readonly GoalWorkspaceRegistryRecord[],
);
