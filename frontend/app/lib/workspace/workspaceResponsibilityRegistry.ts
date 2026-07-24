/**
 * WS-1:2 — Responsibility records preserving canonical Foundation references.
 */

import { WorkspaceFoundation } from "./workspaceFoundation.ts";
import type { WorkspaceRegistryRecord } from "./workspaceRegistryTypes.ts";

export const WorkspaceResponsibilityRegistry = Object.freeze(
  WorkspaceFoundation.responsibilities.map((source) => Object.freeze({
    id: source.id.replace("WS-1:1/Responsibility/", "WS-1:2/Responsibility/"),
    key: `responsibility-${source.id.split("/").at(-1) ?? source.id}`,
    name: source.name,
    description: source.description,
    registryCategory: "Responsibility",
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
