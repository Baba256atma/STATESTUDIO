/** WS-5:2 — Capabilities derived from Foundation. */
import { ScenarioWorkspaceFoundation } from "./scenarioWorkspaceFoundation.ts";
import type { ScenarioWorkspaceRegistryRecord } from "./scenarioWorkspaceIdentityRegistry.ts";

export const ScenarioWorkspaceCapabilityRegistry = Object.freeze(
  ScenarioWorkspaceFoundation.capabilities.map((source, index) => Object.freeze({
    id: `WS-5:2/Capability/${String(index + 1).padStart(2, "0")}`,
    key: `capability-${String(index + 1).padStart(2, "0")}`,
    name: source.name,
    description: source.description,
    registryCategory: "Capability",
    source,
    sourcePhase: "WS-5:1",
    version: "1.0.0",
    stability: "Stable",
    ownership: "Scenario Workspace",
    metadataOnly: true,
    immutable: true,
  })) satisfies readonly ScenarioWorkspaceRegistryRecord[],
);
