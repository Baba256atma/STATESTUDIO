/** WS-6:6 — Immutable Manifest-derived Platform composition. */
import { ProblemWorkspaceManifest } from "./problemWorkspaceManifest.ts";
import { ProblemWorkspacePlatformIdentity } from "./problemWorkspacePlatformIdentity.ts";

export const ProblemWorkspacePlatformComposition = Object.freeze({
  platformIdentity: ProblemWorkspacePlatformIdentity,
  workspaceIdentity: ProblemWorkspaceManifest.summary.workspaceIdentity,
  canonicalPhaseIdentity: ProblemWorkspacePlatformIdentity.phaseId,
  foundation: ProblemWorkspaceManifest.inventory.foundationInventory,
  registry: ProblemWorkspaceManifest.inventory.registryInventory,
  model: ProblemWorkspaceManifest.inventory.modelInventory,
  validation: ProblemWorkspaceManifest.inventory.validationInventory,
  manifest: ProblemWorkspaceManifest,
  canonicalDependencyChain: ProblemWorkspaceManifest.dependencyChain,
  source: ProblemWorkspaceManifest,
  metadataOnly: true,
  immutable: true,
} as const);
