/** WS-2:2 — Capability records derived from Foundation. */
import { ExecutiveHomeWorkspaceFoundation } from "./executiveHomeWorkspaceFoundation.ts";
import type { ExecutiveHomeRegistryRecord } from "./executiveHomeWorkspaceRegistryTypes.ts";
export const ExecutiveHomeWorkspaceCapabilityRegistry = Object.freeze(
  ExecutiveHomeWorkspaceFoundation.capabilities.map((source, index) => Object.freeze({
    id: `WS-2:2/Capability/${String(index + 1).padStart(2, "0")}`,
    key: `capability-${String(index + 1).padStart(2, "0")}`, name: source.name,
    description: source.description, registryCategory: "Capability",
    sourcePhase: "WS-2:1", source, version: "1.0.0", stability: "Stable",
    ownership: "Executive Home Workspace", extensionPolicy: "Additive",
    metadataOnly: true, immutable: true,
  })) satisfies readonly ExecutiveHomeRegistryRecord[],
);

