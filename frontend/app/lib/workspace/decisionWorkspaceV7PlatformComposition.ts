/** WS-7:6 — Immutable Manifest-derived Platform composition. */
import { DecisionWorkspaceV7Manifest } from "./decisionWorkspaceV7Manifest.ts";
import { DecisionWorkspaceV7PlatformIdentity } from "./decisionWorkspaceV7PlatformIdentity.ts";

export const DecisionWorkspaceV7PlatformComposition = Object.freeze({
  platformIdentity: DecisionWorkspaceV7PlatformIdentity,
  workspaceIdentity: DecisionWorkspaceV7Manifest.summary.workspaceIdentity,
  canonicalPhaseIdentity: DecisionWorkspaceV7PlatformIdentity.phaseId,
  foundation: DecisionWorkspaceV7Manifest.inventory.foundationInventory,
  registry: DecisionWorkspaceV7Manifest.inventory.registryInventory,
  model: DecisionWorkspaceV7Manifest.inventory.modelInventory,
  validation: DecisionWorkspaceV7Manifest.inventory.validationInventory,
  manifest: DecisionWorkspaceV7Manifest,
  canonicalDependencyChain: DecisionWorkspaceV7Manifest.dependencyChain,
  source: DecisionWorkspaceV7Manifest,
  metadataOnly: true,
  immutable: true,
} as const);
