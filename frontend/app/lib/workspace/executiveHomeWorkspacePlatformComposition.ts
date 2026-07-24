/** WS-2:6 — Complete Manifest-reachable Platform composition. */
import { ExecutiveHomeWorkspaceManifest } from "./executiveHomeWorkspaceManifest.ts";
const validation = ExecutiveHomeWorkspaceManifest.validation;
const model = validation.model;
const registry = model.registry;
export const ExecutiveHomeWorkspacePlatformComposition = Object.freeze({
  manifest: ExecutiveHomeWorkspaceManifest,
  architectureIdentity: ExecutiveHomeWorkspaceManifest.identity,
  foundation: registry.foundation, registry, model, validation,
  categories: ExecutiveHomeWorkspaceManifest.inventory.categories,
  contracts: ExecutiveHomeWorkspaceManifest.inventory.contracts,
  capabilities: ExecutiveHomeWorkspaceManifest.inventory.capabilities,
  responsibilities: ExecutiveHomeWorkspaceManifest.inventory.responsibilities,
  lifecycle: ExecutiveHomeWorkspaceManifest.inventory.lifecycle,
  boundaries: ExecutiveHomeWorkspaceManifest.inventory.boundaries,
  domainModels: ExecutiveHomeWorkspaceManifest.inventory.domainModels,
  relationships: ExecutiveHomeWorkspaceManifest.inventory.relationships,
  guarantees: ExecutiveHomeWorkspaceManifest.guarantees,
  compatibility: ExecutiveHomeWorkspaceManifest.compatibility,
  extensions: ExecutiveHomeWorkspaceManifest.extensions,
  metadataOnly: true, immutable: true,
} as const);

