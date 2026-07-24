/** WS-2:2 — Responsibility records derived from Foundation. */
import { ExecutiveHomeWorkspaceFoundation } from "./executiveHomeWorkspaceFoundation.ts";
import type { ExecutiveHomeRegistryRecord } from "./executiveHomeWorkspaceRegistryTypes.ts";
export const ExecutiveHomeWorkspaceResponsibilityRegistry = Object.freeze(
  ExecutiveHomeWorkspaceFoundation.responsibilities.map((source, index) => Object.freeze({
    id: `WS-2:2/Responsibility/${String(index + 1).padStart(2, "0")}`,
    key: `responsibility-${String(index + 1).padStart(2, "0")}`, name: source.name,
    description: source.description, registryCategory: "Responsibility",
    sourcePhase: "WS-2:1", source, version: "1.0.0", stability: "Stable",
    ownership: "Executive Home Workspace", extensionPolicy: "Additive",
    metadataOnly: true, immutable: true,
  })) satisfies readonly ExecutiveHomeRegistryRecord[],
);

