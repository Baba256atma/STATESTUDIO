/** WS-10:6 — Upstream capability and dependency references. */
import { TimelineWorkspaceManifest } from "./timelineWorkspaceManifest.ts";

export const TimelineWorkspacePlatformCapabilitySummary =
  TimelineWorkspaceManifest.inventory.capabilityInventory;

export const TimelineWorkspacePlatformDependencySummary = Object.freeze({
  foundation: TimelineWorkspaceManifest.inventory.foundationInventory,
  registry: TimelineWorkspaceManifest.inventory.registryInventory,
  model: TimelineWorkspaceManifest.inventory.modelInventory,
  validation: TimelineWorkspaceManifest.inventory.validationInventory,
  manifest: TimelineWorkspaceManifest,
  chain: TimelineWorkspaceManifest.dependencyChain,
  prohibitedRuntimeDependencies: Object.freeze([
    "Runtime", "Engine", "Director", "EVE", "DKL", "NEA", "EIL", "SDK", "UI",
  ]),
  metadataOnly: true,
  immutable: true,
} as const);
