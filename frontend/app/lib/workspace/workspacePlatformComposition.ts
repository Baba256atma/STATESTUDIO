/** WS-1:6 — Complete Manifest-reachable Platform composition. */
import { WorkspaceManifest } from "./workspaceManifest.ts";
export const WorkspacePlatformComposition = Object.freeze({
  manifest: WorkspaceManifest,
  architectureIdentity: WorkspaceManifest.identity,
  foundation: WorkspaceManifest.validation.model.registry.foundation,
  registry: WorkspaceManifest.validation.model.registry,
  model: WorkspaceManifest.validation.model,
  validation: WorkspaceManifest.validation,
  workspaceTypes: WorkspaceManifest.inventory.workspaceTypes,
  contracts: WorkspaceManifest.inventory.contracts,
  capabilities: WorkspaceManifest.inventory.capabilities,
  responsibilities: WorkspaceManifest.inventory.responsibilities,
  lifecycle: WorkspaceManifest.inventory.lifecycle,
  boundaries: WorkspaceManifest.inventory.boundaries,
  relationships: WorkspaceManifest.inventory.relationships,
  guarantees: WorkspaceManifest.guarantees,
  compatibility: WorkspaceManifest.compatibility,
  extensions: WorkspaceManifest.extensions,
  metadataOnly: true, immutable: true,
} as const);

