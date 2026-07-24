/** WS-4:2 — Capabilities derived from Foundation. */
import { DecisionWorkspaceFoundation } from "./decisionWorkspaceFoundation.ts";
import type { DecisionWorkspaceRegistryRecord } from "./decisionWorkspaceIdentityRegistry.ts";

export const DecisionWorkspaceCapabilityRegistry = Object.freeze(
  DecisionWorkspaceFoundation.capabilities.map((source, index) => Object.freeze({
    id: `WS-4:2/Capability/${String(index + 1).padStart(2, "0")}`,
    key: `capability-${String(index + 1).padStart(2, "0")}`,
    name: source.name,
    description: source.description,
    registryCategory: "Capability",
    source,
    sourcePhase: "WS-4:1",
    version: "1.0.0",
    stability: "Stable",
    ownership: "Decision Workspace",
    metadataOnly: true,
    immutable: true,
  })) satisfies readonly DecisionWorkspaceRegistryRecord[],
);
