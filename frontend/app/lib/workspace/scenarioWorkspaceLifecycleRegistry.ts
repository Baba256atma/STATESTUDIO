/** WS-5:2 — Lifecycle states derived from Foundation. */
import { ScenarioWorkspaceFoundation } from "./scenarioWorkspaceFoundation.ts";
import type { ScenarioWorkspaceRegistryRecord } from "./scenarioWorkspaceIdentityRegistry.ts";

export const ScenarioWorkspaceLifecycleRegistry = Object.freeze(
  ScenarioWorkspaceFoundation.lifecycle.map((source) => Object.freeze({
    id: `WS-5:2/Lifecycle/${source}`,
    key: `lifecycle-${source.toLowerCase()}`,
    name: source,
    description: `Registers the ${source} Scenario lifecycle state.`,
    registryCategory: "Lifecycle",
    source,
    sourcePhase: "WS-5:1",
    version: "1.0.0",
    stability: "Stable",
    ownership: "Scenario Workspace",
    metadataOnly: true,
    immutable: true,
  })) satisfies readonly ScenarioWorkspaceRegistryRecord[],
);
