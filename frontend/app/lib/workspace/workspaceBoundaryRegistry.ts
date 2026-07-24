/**
 * WS-1:2 — Boundary records preserving all canonical Foundation prohibitions.
 */

import { WorkspaceFoundation } from "./workspaceFoundation.ts";
import type { WorkspaceRegistryRecord } from "./workspaceRegistryTypes.ts";

export const WorkspaceBoundaryRegistry = Object.freeze(
  WorkspaceFoundation.boundaries.map((source) => Object.freeze({
    id: source.id.replace("WS-1:1/Boundary/", "WS-1:2/Boundary/"),
    key: source.prohibitedConcern.toLowerCase().replaceAll(" ", "-"),
    name: `${source.prohibitedConcern} Boundary`,
    description: `Registers ${source.prohibitedConcern} as outside the Workspace Registry boundary.`,
    registryCategory: "Boundary",
    sourcePhase: "WS-1:1",
    source,
    stability: "Stable",
    version: "1.0.0",
    ownership: "Workspace",
    extensionPolicy: "Additive",
    metadataOnly: true,
    immutable: true,
  })) satisfies readonly WorkspaceRegistryRecord[],
);

