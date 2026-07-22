import { SceneRenderingValidation } from "./sceneRenderingValidation.ts";

const model = SceneRenderingValidation.model;
const registry = model.registry;
const foundation = registry.foundation;

export const SceneRenderingManifestInventory = Object.freeze({
  foundationInventory: foundation.inventory,
  registryInventory: registry.inventory,
  modelInventory: model.inventory,
  validationInventory: SceneRenderingValidation.inventory,
  validationCategories: SceneRenderingValidation.categories,
  validationRules: SceneRenderingValidation.rules,
  validationGates: SceneRenderingValidation.gates,
  canonicalReferences: Object.freeze([
    foundation.identity.id,
    registry.metadata.id,
    model.metadata.id,
    SceneRenderingValidation.metadata.id,
  ]),
  inventoryCountReferences: Object.freeze({
    foundationContractCount: foundation.inventory.contractCount,
    registryEntryCount: registry.inventory.registryEntryCount,
    modelDescriptorCount: model.inventory.modelDescriptorCount,
    validationRuleCount: SceneRenderingValidation.inventory.ruleCount,
  }),
  valuesForwardedFromValidationChain: true,
  validationCollectionsPreservedByReference: true,
  recalculatesInventories: false,
  hardcodesInventoryTotals: false,
  duplicatesValidationMetadata: false,
  reconstructsCollections: false,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);
