/** WS-4:2 — Decision categories derived from Foundation. */
import { DecisionWorkspaceFoundation } from "./decisionWorkspaceFoundation.ts";
import type { DecisionWorkspaceRegistryRecord } from "./decisionWorkspaceIdentityRegistry.ts";

export const DecisionWorkspaceDecisionTypeRegistry = Object.freeze(
  DecisionWorkspaceFoundation.decisionTypes.map((source, index) => Object.freeze({
    id: `WS-4:2/DecisionType/${String(index + 1).padStart(2, "0")}`,
    key: `decision-type-${String(index + 1).padStart(2, "0")}`,
    name: source,
    description: `Registers ${source} as a canonical Decision category.`,
    registryCategory: "DecisionType",
    source,
    sourcePhase: "WS-4:1",
    version: "1.0.0",
    stability: "Stable",
    ownership: "Decision Workspace",
    metadataOnly: true,
    immutable: true,
  })) satisfies readonly DecisionWorkspaceRegistryRecord[],
);
