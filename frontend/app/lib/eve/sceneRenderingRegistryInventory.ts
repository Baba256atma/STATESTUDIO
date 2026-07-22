import { SceneRenderingFoundation } from "./sceneRenderingFoundation.ts";
import { SceneRenderingRegistryCatalog } from "./sceneRenderingRegistryCatalog.ts";
import { SceneRenderingRegistryExtensions } from "./sceneRenderingRegistryExtensions.ts";
import { SceneRenderingRegistryPolicies } from "./sceneRenderingRegistryPolicies.ts";

const registryCollections = Object.freeze(
  Object.values(SceneRenderingRegistryCatalog).filter(
    (value): value is Extract<typeof value, readonly unknown[]> => Array.isArray(value),
  ),
);

export const SceneRenderingRegistryInventory = Object.freeze({
  registryCollectionCount: registryCollections.length,
  registryEntryCount: registryCollections.reduce(
    (total, collection) => total + collection.length, 0,
  ),
  categoryCount: SceneRenderingRegistryCatalog.registryCategoryTypes.length,
  policyCount: SceneRenderingRegistryPolicies.length,
  extensionClassificationCount: SceneRenderingRegistryExtensions.classifications.length,
  foundationContracts: SceneRenderingFoundation.contracts,
  foundationOwnership: SceneRenderingFoundation.ownership,
  foundationBoundaries: SceneRenderingFoundation.boundaries,
  foundationInventory: SceneRenderingFoundation.inventory,
  countsDerivedFromImmutableCollections: true,
  preservesFoundationByReference: true,
  hardcodesAggregateCounts: false,
  duplicatesFoundationMetadata: false,
  reconstructsFoundationInventory: false,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

