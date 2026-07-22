import { SceneRenderingRegistry } from "./sceneRenderingRegistry.ts";
import { SceneRenderingModelDescriptors } from "./sceneRenderingModelDescriptors.ts";
import { SceneRenderingModelPolicies } from "./sceneRenderingModelPolicies.ts";
import { SceneRenderingModelRelationships } from "./sceneRenderingModelRelationships.ts";

export const SceneRenderingModelInventory = Object.freeze({
  modelCount: SceneRenderingModelDescriptors.length,
  modelDescriptorCount: SceneRenderingModelDescriptors.length,
  relationshipCount: SceneRenderingModelRelationships.length,
  policyCount: SceneRenderingModelPolicies.length,
  registryCatalog: SceneRenderingRegistry.catalog,
  registryInventory: SceneRenderingRegistry.inventory,
  registryEntryCount: SceneRenderingRegistry.inventory.registryEntryCount,
  countsDerivedFromCanonicalCollections: true,
  registryCollectionsPreservedByReference: true,
  hardcodesInventoryTotals: false,
  duplicatesRegistryMetadata: false,
  reconstructsRegistryCollections: false,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

