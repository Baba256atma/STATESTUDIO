/** WS-10:6 — Immutable Manifest-derived Platform composition. */
import { TimelineWorkspaceManifest } from "./timelineWorkspaceManifest.ts";
import { TimelineWorkspacePlatformIdentity } from "./timelineWorkspacePlatformIdentity.ts";

export const TimelineWorkspacePlatformComposition = Object.freeze({
  platformIdentity: TimelineWorkspacePlatformIdentity,
  workspaceIdentity: TimelineWorkspaceManifest.summary.workspaceIdentity,
  canonicalPhaseIdentity: TimelineWorkspacePlatformIdentity.phaseId,
  foundation: TimelineWorkspaceManifest.inventory.foundationInventory,
  registry: TimelineWorkspaceManifest.inventory.registryInventory,
  model: TimelineWorkspaceManifest.inventory.modelInventory,
  validation: TimelineWorkspaceManifest.inventory.validationInventory,
  manifest: TimelineWorkspaceManifest,
  canonicalDependencyChain: TimelineWorkspaceManifest.dependencyChain,
  source: TimelineWorkspaceManifest,
  metadataOnly: true,
  immutable: true,
} as const);
