/** WS-9:6 — Upstream capability and dependency references. */
import { ValueWorkspaceManifest } from "./valueWorkspaceManifest.ts";

export const ValueWorkspacePlatformCapabilitySummary =
  ValueWorkspaceManifest.inventory.capabilityInventory;

export const ValueWorkspacePlatformDependencySummary = Object.freeze({
  foundation: ValueWorkspaceManifest.inventory.foundationInventory,
  registry: ValueWorkspaceManifest.inventory.registryInventory,
  model: ValueWorkspaceManifest.inventory.modelInventory,
  validation: ValueWorkspaceManifest.inventory.validationInventory,
  manifest: ValueWorkspaceManifest,
  chain: ValueWorkspaceManifest.dependencyChain,
  prohibitedRuntimeDependencies: Object.freeze([
    "Runtime", "Engine", "Director", "EVE", "DKL", "NEA", "EIL", "SDK", "UI",
  ]),
  metadataOnly: true,
  immutable: true,
} as const);
