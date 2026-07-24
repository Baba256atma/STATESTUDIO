/**
 * WS-1:2 — Capability records preserving canonical Foundation references.
 */

import { WorkspaceFoundation } from "./workspaceFoundation.ts";
import type { WorkspaceRegistryRecord } from "./workspaceRegistryTypes.ts";

export const WorkspaceCapabilityRegistry = Object.freeze(
  WorkspaceFoundation.capabilities.map((source) => Object.freeze({
    id: source.id.replace("WS-1:1/Capability/", "WS-1:2/Capability/"),
    key: `capability-${source.id.split("/").at(-1) ?? source.id}`,
    name: source.name,
    description: source.description,
    registryCategory: "Capability",
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
