/** WS-8:6 — Immutable Manifest-derived Platform composition. */
import { WarRoomWorkspaceManifest } from "./warRoomWorkspaceManifest.ts";
import { WarRoomWorkspacePlatformIdentity } from "./warRoomWorkspacePlatformIdentity.ts";

export const WarRoomWorkspacePlatformComposition = Object.freeze({
  platformIdentity: WarRoomWorkspacePlatformIdentity,
  workspaceIdentity: WarRoomWorkspaceManifest.summary.workspaceIdentity,
  canonicalPhaseIdentity: WarRoomWorkspacePlatformIdentity.phaseId,
  foundation: WarRoomWorkspaceManifest.inventory.foundationInventory,
  registry: WarRoomWorkspaceManifest.inventory.registryInventory,
  model: WarRoomWorkspaceManifest.inventory.modelInventory,
  validation: WarRoomWorkspaceManifest.inventory.validationInventory,
  manifest: WarRoomWorkspaceManifest,
  canonicalDependencyChain: WarRoomWorkspaceManifest.dependencyChain,
  source: WarRoomWorkspaceManifest,
  metadataOnly: true,
  immutable: true,
} as const);
