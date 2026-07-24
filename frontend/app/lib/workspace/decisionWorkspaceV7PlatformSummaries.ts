/** WS-7:6 — Upstream capability and dependency references. */
import { DecisionWorkspaceV7Manifest } from "./decisionWorkspaceV7Manifest.ts";

export const DecisionWorkspaceV7PlatformCapabilitySummary =
  DecisionWorkspaceV7Manifest.inventory.capabilityInventory;

export const DecisionWorkspaceV7PlatformDependencySummary = Object.freeze({
  foundation: DecisionWorkspaceV7Manifest.inventory.foundationInventory,
  registry: DecisionWorkspaceV7Manifest.inventory.registryInventory,
  model: DecisionWorkspaceV7Manifest.inventory.modelInventory,
  validation: DecisionWorkspaceV7Manifest.inventory.validationInventory,
  manifest: DecisionWorkspaceV7Manifest,
  chain: DecisionWorkspaceV7Manifest.dependencyChain,
  prohibitedRuntimeDependencies: Object.freeze([
    "Runtime",
    "Engine",
    "Director",
    "EVE",
    "DKL",
    "NEA",
    "EIL",
    "SDK",
    "UI",
  ]),
  metadataOnly: true,
  immutable: true,
} as const);
