/** WS-4:2 — Lifecycle states derived from Foundation. */
import { DecisionWorkspaceFoundation } from "./decisionWorkspaceFoundation.ts";
import type { DecisionWorkspaceRegistryRecord } from "./decisionWorkspaceIdentityRegistry.ts";

export const DecisionWorkspaceLifecycleRegistry = Object.freeze(
  DecisionWorkspaceFoundation.lifecycle.map((source) => Object.freeze({
    id: `WS-4:2/Lifecycle/${source}`,
    key: `lifecycle-${source.toLowerCase()}`,
    name: source,
    description: `Registers the ${source} Decision lifecycle state.`,
    registryCategory: "Lifecycle",
    source,
    sourcePhase: "WS-4:1",
    version: "1.0.0",
    stability: "Stable",
    ownership: "Decision Workspace",
    metadataOnly: true,
    immutable: true,
  })) satisfies readonly DecisionWorkspaceRegistryRecord[],
);
