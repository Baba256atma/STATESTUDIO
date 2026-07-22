import { AnimationEffectsModelDescriptors } from "./animationEffectsModelDescriptors.ts";
import { AnimationEffectsModelPolicies } from "./animationEffectsModelPolicies.ts";
import { AnimationEffectsModelRelationships } from "./animationEffectsModelRelationships.ts";
import { AnimationEffectsRegistryPlatform } from "./animationEffectsRegistry.ts";

export const AnimationEffectsModelInventory = Object.freeze({
  models: AnimationEffectsModelDescriptors,
  relationships: AnimationEffectsModelRelationships,
  policies: AnimationEffectsModelPolicies,
  registryCatalog: AnimationEffectsRegistryPlatform.catalog,
  registryCategories: AnimationEffectsRegistryPlatform.categories,
  registryInventory: AnimationEffectsRegistryPlatform.inventory,
  registryPolicies: AnimationEffectsRegistryPlatform.policies,
  registryExtensions: AnimationEffectsRegistryPlatform.extensions,
  registryFoundationReference: AnimationEffectsRegistryPlatform.foundation,
  counts: Object.freeze({
    modelCount: AnimationEffectsModelDescriptors.length,
    relationshipCount: AnimationEffectsModelRelationships.length,
    policyCount: AnimationEffectsModelPolicies.length,
  }),
  registryCollectionsPreservedByReference: true,
  inventoriesDerivedExclusivelyFromRegistryCollections: true,
  stableIdentitiesPreserved: true,
  countsDerivedFromCanonicalCollections: true,
  hardcodedAggregateTotals: false,
  reconstructsRegistryCollections: false,
  duplicatesRegistryMetadata: false,
  recountsUpstreamInventories: false,
  maintainsParallelUpstreamInventory: false,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);
