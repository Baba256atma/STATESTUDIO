/** WS-5:2 — Responsibilities derived from Foundation. */
import { ScenarioWorkspaceFoundation } from "./scenarioWorkspaceFoundation.ts";
import type { ScenarioWorkspaceRegistryRecord } from "./scenarioWorkspaceIdentityRegistry.ts";

export const ScenarioWorkspaceResponsibilityRegistry = Object.freeze(
  ScenarioWorkspaceFoundation.responsibilities.map((source, index) => Object.freeze({
    id: `WS-5:2/Responsibility/${String(index + 1).padStart(2, "0")}`,
    key: `responsibility-${String(index + 1).padStart(2, "0")}`,
    name: source.name,
    description: source.description,
    registryCategory: "Responsibility",
    source,
    sourcePhase: "WS-5:1",
    version: "1.0.0",
    stability: "Stable",
    ownership: "Scenario Workspace",
    metadataOnly: true,
    immutable: true,
  })) satisfies readonly ScenarioWorkspaceRegistryRecord[],
);
