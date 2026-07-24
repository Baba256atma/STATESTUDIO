/** WS-9:6 — Immutable Manifest-derived Platform composition. */
import { ValueWorkspaceManifest } from "./valueWorkspaceManifest.ts";
import { ValueWorkspacePlatformIdentity } from "./valueWorkspacePlatformIdentity.ts";

export const ValueWorkspacePlatformComposition = Object.freeze({
  platformIdentity: ValueWorkspacePlatformIdentity,
  workspaceIdentity: ValueWorkspaceManifest.summary.workspaceIdentity,
  canonicalPhaseIdentity: ValueWorkspacePlatformIdentity.phaseId,
  foundation: ValueWorkspaceManifest.inventory.foundationInventory,
  registry: ValueWorkspaceManifest.inventory.registryInventory,
  model: ValueWorkspaceManifest.inventory.modelInventory,
  validation: ValueWorkspaceManifest.inventory.validationInventory,
  manifest: ValueWorkspaceManifest,
  canonicalDependencyChain: ValueWorkspaceManifest.dependencyChain,
  source: ValueWorkspaceManifest,
  metadataOnly: true,
  immutable: true,
} as const);
