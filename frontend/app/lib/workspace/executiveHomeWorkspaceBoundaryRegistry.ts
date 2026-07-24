/** WS-2:2 — Boundary records preserving every Foundation prohibition. */
import { ExecutiveHomeWorkspaceFoundation } from "./executiveHomeWorkspaceFoundation.ts";
import type { ExecutiveHomeRegistryRecord } from "./executiveHomeWorkspaceRegistryTypes.ts";
export const ExecutiveHomeWorkspaceBoundaryRegistry = Object.freeze(
  ExecutiveHomeWorkspaceFoundation.boundaries.map((source, index) => Object.freeze({
    id: `WS-2:2/Boundary/${String(index + 1).padStart(2, "0")}`,
    key: `boundary-${String(index + 1).padStart(2, "0")}`,
    name: `${source.prohibitedConcern} Boundary`,
    description: `Registers ${source.prohibitedConcern} as prohibited.`,
    registryCategory: "Boundary", sourcePhase: "WS-2:1", source,
    version: "1.0.0", stability: "Stable", ownership: "Executive Home Workspace",
    extensionPolicy: "Additive", metadataOnly: true, immutable: true,
  })) satisfies readonly ExecutiveHomeRegistryRecord[],
);

