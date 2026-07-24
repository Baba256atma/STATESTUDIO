/** WS-7:5 — Inventories referenced exclusively from validated metadata. */
import { DecisionWorkspaceV7Validation } from "./decisionWorkspaceV7Validation.ts";

const foundation = DecisionWorkspaceV7Validation.foundation;
const registry = DecisionWorkspaceV7Validation.registry;
const model = DecisionWorkspaceV7Validation.model;

export const DecisionWorkspaceV7ManifestInventory = Object.freeze({
  foundationInventory: foundation.inventory,
  registryInventory: registry.inventory,
  modelInventory: model.modelRegistry,
  validationInventory: DecisionWorkspaceV7Validation.summary,
  contractInventory: foundation.contracts,
  capabilityInventory: registry.capabilities,
  responsibilityInventory: registry.responsibilities,
  decisionCategoryInventory: registry.taxonomy.categories,
  decisionTypeInventory: registry.taxonomy.types,
  decisionOptionInventory: registry.optionTypes,
  relationshipInventory: model.relationships,
  lifecycleInventory: registry.lifecycle,
  boundaryInventory: registry.boundaries,
  exportInventory: Object.freeze({
    foundation: foundation.publicApiSurface,
    registry: registry.publicApiSurface,
    model: model.publicApiSurface,
    validation: DecisionWorkspaceV7Validation.publicApiSurface,
  }),
  dependencyInventory: DecisionWorkspaceV7Validation.upstreamDependencies,
  inventoryTotals: Object.freeze({
    foundation: foundation.inventory,
    registry: registry.inventory,
    model: model.modelRegistry,
    validation: DecisionWorkspaceV7Validation.summary,
  }),
  source: DecisionWorkspaceV7Validation,
  canonicalInventoryRule: "Validated References Only",
  duplicatedValues: false,
  manuallyRedefinedTotals: false,
  recalculatedValues: false,
  newMetadataIntroduced: false,
  metadataOnly: true,
  immutable: true,
} as const);
