import { VisualizationValidation } from "./visualizationValidation.ts";

const model = VisualizationValidation.model;
const registry = model.registry;
const foundation = registry.foundation;

/** Canonical upstream inventories are preserved by reference without recounting. */
export const VisualizationManifestInventory = Object.freeze({
  foundationInventory: foundation.inventory,
  registryInventory: registry.inventory,
  modelInventory: model.inventory,
  validationInventory: VisualizationValidation.inventory,
  canonicalReferences: Object.freeze([
    foundation.identity.id,
    registry.metadata.id,
    model.metadata.id,
    VisualizationValidation.metadata.id,
  ]),
  inventoryCountReferences: Object.freeze({
    foundationContractCount: foundation.inventory.contractCount,
    registryEntryCount: registry.inventory.registryEntryCount,
    modelDescriptorCount: model.inventory.modelDescriptorCount,
    validationRuleCount: VisualizationValidation.inventory.ruleCount,
  }),
  valuesForwardedFromValidationChain: true,
  recalculatesInventories: false,
  hardcodesInventoryCounts: false,
  duplicatesUpstreamMetadata: false,
  reconstructsCollections: false,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

