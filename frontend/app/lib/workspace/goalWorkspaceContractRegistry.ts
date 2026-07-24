/** WS-3:2 — Contracts derived from Foundation without redefinition. */
import { GoalWorkspaceFoundation } from "./goalWorkspaceFoundation.ts";
import type { GoalWorkspaceRegistryRecord } from "./goalWorkspaceIdentityRegistry.ts";
export const GoalWorkspaceContractRegistry = Object.freeze(
  GoalWorkspaceFoundation.contracts.map((source, index) => Object.freeze({
    id: `WS-3:2/Contract/${String(index + 1).padStart(2, "0")}`,
    key: `contract-${String(index + 1).padStart(2, "0")}`,
    name: source.name, description: source.description,
    registryCategory: "Contract", source, sourcePhase: "WS-3:1",
    version: "1.0.0", stability: "Stable", ownership: "Goal Workspace",
    metadataOnly: true, immutable: true,
  })) satisfies readonly GoalWorkspaceRegistryRecord[],
);

