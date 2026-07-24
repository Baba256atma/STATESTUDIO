/** WS-4:2 — Responsibilities derived from Foundation. */
import { DecisionWorkspaceFoundation } from "./decisionWorkspaceFoundation.ts";
import type { DecisionWorkspaceRegistryRecord } from "./decisionWorkspaceIdentityRegistry.ts";

export const DecisionWorkspaceResponsibilityRegistry = Object.freeze(
  DecisionWorkspaceFoundation.responsibilities.map((source, index) => Object.freeze({
    id: `WS-4:2/Responsibility/${String(index + 1).padStart(2, "0")}`,
    key: `responsibility-${String(index + 1).padStart(2, "0")}`,
    name: source.name,
    description: source.description,
    registryCategory: "Responsibility",
    source,
    sourcePhase: "WS-4:1",
    version: "1.0.0",
    stability: "Stable",
    ownership: "Decision Workspace",
    metadataOnly: true,
    immutable: true,
  })) satisfies readonly DecisionWorkspaceRegistryRecord[],
);
