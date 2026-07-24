/** WS-5:2 — Scenario categories derived from Foundation. */
import { ScenarioWorkspaceFoundation } from "./scenarioWorkspaceFoundation.ts";
import type { ScenarioWorkspaceRegistryRecord } from "./scenarioWorkspaceIdentityRegistry.ts";

export const ScenarioWorkspaceScenarioTypeRegistry = Object.freeze(
  ScenarioWorkspaceFoundation.scenarioTypes.map((source, index) => Object.freeze({
    id: `WS-5:2/ScenarioType/${String(index + 1).padStart(2, "0")}`,
    key: `scenario-type-${String(index + 1).padStart(2, "0")}`,
    name: source,
    description: `Registers ${source} as a canonical Scenario category.`,
    registryCategory: "ScenarioType",
    source,
    sourcePhase: "WS-5:1",
    version: "1.0.0",
    stability: "Stable",
    ownership: "Scenario Workspace",
    metadataOnly: true,
    immutable: true,
  })) satisfies readonly ScenarioWorkspaceRegistryRecord[],
);
