/** WS-2:2 — Declarative lifecycle records without transition execution. */
import { ExecutiveHomeWorkspaceFoundation } from "./executiveHomeWorkspaceFoundation.ts";
import type { ExecutiveHomeRegistryRecord } from "./executiveHomeWorkspaceRegistryTypes.ts";
export const ExecutiveHomeWorkspaceLifecycleRegistry = Object.freeze(
  ExecutiveHomeWorkspaceFoundation.lifecycle.map((source, index) => Object.freeze({
    id: `WS-2:2/Lifecycle/${source}`, key: `lifecycle-${source.toLowerCase()}`,
    name: source, description: `Registers the ${source} lifecycle state.`,
    registryCategory: "Lifecycle", sourcePhase: "WS-2:1", source,
    version: "1.0.0", stability: "Stable", ownership: "Executive Home Workspace",
    extensionPolicy: "Additive", metadataOnly: true, immutable: true,
    ordinal: index + 1, executesTransitions: false,
  })) satisfies readonly (ExecutiveHomeRegistryRecord & {
    readonly ordinal: number; readonly executesTransitions: false;
  })[],
);

