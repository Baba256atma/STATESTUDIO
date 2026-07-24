/** WS-6:6 — Upstream capability and dependency references. */
import { ProblemWorkspaceManifest } from "./problemWorkspaceManifest.ts";

export const ProblemWorkspacePlatformCapabilitySummary =
  ProblemWorkspaceManifest.inventory.capabilityInventory;

export const ProblemWorkspacePlatformDependencySummary = Object.freeze({
  foundation: ProblemWorkspaceManifest.inventory.foundationInventory,
  registry: ProblemWorkspaceManifest.inventory.registryInventory,
  model: ProblemWorkspaceManifest.inventory.modelInventory,
  validation: ProblemWorkspaceManifest.inventory.validationInventory,
  manifest: ProblemWorkspaceManifest,
  chain: ProblemWorkspaceManifest.dependencyChain,
  prohibitedRuntimeDependencies: Object.freeze([
    "Runtime",
    "Engine",
    "Director",
    "DKL",
    "EVE",
    "NEA",
    "EIL",
    "SDK",
    "UI",
  ]),
  metadataOnly: true,
  immutable: true,
} as const);
