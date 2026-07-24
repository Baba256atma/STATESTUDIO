/** WS-8:6 — Upstream capability and dependency references. */
import { WarRoomWorkspaceManifest } from "./warRoomWorkspaceManifest.ts";

export const WarRoomWorkspacePlatformCapabilitySummary =
  WarRoomWorkspaceManifest.inventory.capabilityInventory;

export const WarRoomWorkspacePlatformDependencySummary = Object.freeze({
  foundation: WarRoomWorkspaceManifest.inventory.foundationInventory,
  registry: WarRoomWorkspaceManifest.inventory.registryInventory,
  model: WarRoomWorkspaceManifest.inventory.modelInventory,
  validation: WarRoomWorkspaceManifest.inventory.validationInventory,
  manifest: WarRoomWorkspaceManifest,
  chain: WarRoomWorkspaceManifest.dependencyChain,
  prohibitedRuntimeDependencies: Object.freeze([
    "Runtime", "Engine", "Director", "EVE", "DKL", "NEA", "EIL", "SDK", "UI",
  ]),
  metadataOnly: true,
  immutable: true,
} as const);
