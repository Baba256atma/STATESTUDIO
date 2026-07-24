/** WS-3:2 — Capabilities derived from Foundation. */
import { GoalWorkspaceFoundation } from "./goalWorkspaceFoundation.ts";
import type { GoalWorkspaceRegistryRecord } from "./goalWorkspaceIdentityRegistry.ts";
export const GoalWorkspaceCapabilityRegistry = Object.freeze(
  GoalWorkspaceFoundation.capabilities.map((source, index) => Object.freeze({
    id: `WS-3:2/Capability/${String(index + 1).padStart(2, "0")}`,
    key: `capability-${String(index + 1).padStart(2, "0")}`,
    name: source.name, description: source.description,
    registryCategory: "Capability", source, sourcePhase: "WS-3:1",
    version: "1.0.0", stability: "Stable", ownership: "Goal Workspace",
    metadataOnly: true, immutable: true,
  })) satisfies readonly GoalWorkspaceRegistryRecord[],
);

