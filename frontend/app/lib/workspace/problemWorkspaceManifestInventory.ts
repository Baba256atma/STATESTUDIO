/** WS-6:5 — Canonical inventories referenced from validated upstream metadata. */
import { ProblemWorkspaceValidation } from "./problemWorkspaceValidation.ts";

const foundation = ProblemWorkspaceValidation.foundation;
const registry = ProblemWorkspaceValidation.registry;
const model = ProblemWorkspaceValidation.model;

export const ProblemWorkspaceManifestInventory = Object.freeze({
  foundationInventory: foundation.inventory,
  registryInventory: registry.inventory,
  modelInventory: model.modelRegistry,
  validationInventory: ProblemWorkspaceValidation.summary,
  capabilityInventory: registry.capabilities,
  responsibilityInventory: registry.responsibilities,
  contractInventory: registry.contracts,
  relationshipInventory: model.relationships,
  lifecycleInventory: registry.lifecycle,
  boundaryInventory: registry.boundaries,
  exportInventory: Object.freeze({
    foundation: foundation.publicApiSurface,
    registry: registry.publicApiSurface,
    model: model.publicApiSurface,
    validation: ProblemWorkspaceValidation.publicApiSurface,
  }),
  dependencyInventory: ProblemWorkspaceValidation.upstreamDependencies,
  inventoryTotals: Object.freeze({
    foundation: foundation.inventory,
    registry: registry.inventory,
    model: model.modelRegistry,
    validation: ProblemWorkspaceValidation.summary,
  }),
  source: ProblemWorkspaceValidation,
  canonicalInventoryRule: "Validated References Only",
  duplicatedValues: false,
  recalculatedValues: false,
  metadataOnly: true,
  immutable: true,
} as const);
