/** WS-9:5 — Inventories referenced exclusively from validated metadata. */
import { ValueWorkspaceValidation } from "./valueWorkspaceValidation.ts";

const foundation = ValueWorkspaceValidation.foundation;
const registry = ValueWorkspaceValidation.registry;
const model = ValueWorkspaceValidation.model;

export const ValueWorkspaceManifestInventory = Object.freeze({
  foundationInventory: foundation.inventory,
  registryInventory: registry.inventory,
  modelInventory: model.modelRegistry,
  validationInventory: ValueWorkspaceValidation.summary,
  contractInventory: foundation.contracts,
  capabilityInventory: registry.capabilities,
  responsibilityInventory: registry.responsibilities,
  valueCategoryInventory: registry.valueCategories,
  valueDimensionInventory: registry.valueDimensions,
  valueOutcomeInventory: registry.outcomeTypes,
  roiCategoryInventory: registry.roiTypes,
  measurementTypeInventory: registry.measurementTypes,
  valueEvidenceInventory: registry.evidenceTypes,
  valueImpactInventory: registry.impactDomains,
  relationshipInventory: model.relationships,
  lifecycleInventory: registry.lifecycle,
  boundaryInventory: registry.boundaries,
  exportInventory: Object.freeze({
    foundation: foundation.publicApiSurface,
    registry: registry.publicApiSurface,
    model: model.publicApiSurface,
    validation: ValueWorkspaceValidation.publicApiSurface,
  }),
  dependencyInventory: ValueWorkspaceValidation.upstreamDependencies,
  inventoryTotals: Object.freeze({
    foundation: foundation.inventory,
    registry: registry.inventory,
    model: model.modelRegistry,
    validation: ValueWorkspaceValidation.summary,
  }),
  source: ValueWorkspaceValidation,
  canonicalInventoryRule: "Validated References Only",
  duplicatedValues: false,
  manuallyRedefinedTotals: false,
  recalculatedValues: false,
  introducedMetadata: false,
  modifiedMetadata: false,
  metadataOnly: true,
  immutable: true,
} as const);
