/** WS-5:2 — Contracts derived from Foundation without redefinition. */
import { ScenarioWorkspaceFoundation } from "./scenarioWorkspaceFoundation.ts";
import type { ScenarioWorkspaceRegistryRecord } from "./scenarioWorkspaceIdentityRegistry.ts";

export const ScenarioWorkspaceContractRegistry = Object.freeze(
  ScenarioWorkspaceFoundation.contracts.map((source, index) => Object.freeze({
    id: `WS-5:2/Contract/${String(index + 1).padStart(2, "0")}`,
    key: `contract-${String(index + 1).padStart(2, "0")}`,
    name: source.name,
    description: source.description,
    registryCategory: "Contract",
    source,
    sourcePhase: "WS-5:1",
    version: "1.0.0",
    stability: "Stable",
    ownership: "Scenario Workspace",
    metadataOnly: true,
    immutable: true,
  })) satisfies readonly ScenarioWorkspaceRegistryRecord[],
);
