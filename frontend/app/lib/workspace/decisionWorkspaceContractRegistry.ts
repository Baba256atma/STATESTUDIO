/** WS-4:2 — Contracts derived from Foundation without redefinition. */
import { DecisionWorkspaceFoundation } from "./decisionWorkspaceFoundation.ts";
import type { DecisionWorkspaceRegistryRecord } from "./decisionWorkspaceIdentityRegistry.ts";

export const DecisionWorkspaceContractRegistry = Object.freeze(
  DecisionWorkspaceFoundation.contracts.map((source, index) => Object.freeze({
    id: `WS-4:2/Contract/${String(index + 1).padStart(2, "0")}`,
    key: `contract-${String(index + 1).padStart(2, "0")}`,
    name: source.name,
    description: source.description,
    registryCategory: "Contract",
    source,
    sourcePhase: "WS-4:1",
    version: "1.0.0",
    stability: "Stable",
    ownership: "Decision Workspace",
    metadataOnly: true,
    immutable: true,
  })) satisfies readonly DecisionWorkspaceRegistryRecord[],
);
