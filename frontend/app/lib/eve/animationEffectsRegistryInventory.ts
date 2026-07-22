import { AnimationEffectsFoundationPlatform } from "./animationEffectsFoundation.ts";
import {
  AnimationEffectsRegistryCatalog,
  AnimationEffectsRegistryCategories,
} from "./animationEffectsRegistryCatalog.ts";
import { AnimationEffectsRegistryExtensions } from "./animationEffectsRegistryExtensions.ts";
import { AnimationEffectsRegistryPolicies } from "./animationEffectsRegistryPolicies.ts";

export const AnimationEffectsRegistryInventory = Object.freeze({
  catalog: AnimationEffectsRegistryCatalog,
  categories: AnimationEffectsRegistryCategories,
  extensions: AnimationEffectsRegistryExtensions,
  policies: AnimationEffectsRegistryPolicies,
  foundationContracts: AnimationEffectsFoundationPlatform.contracts,
  foundationOwnership: AnimationEffectsFoundationPlatform.ownership,
  foundationBoundaries: AnimationEffectsFoundationPlatform.boundaries,
  foundationLifecycle: AnimationEffectsFoundationPlatform.lifecycle,
  foundationCapabilities: AnimationEffectsFoundationPlatform.capabilities,
  foundationIdentity: AnimationEffectsFoundationPlatform.identity,
  foundationInventory: AnimationEffectsFoundationPlatform.inventory,
  counts: Object.freeze({
    catalogEntryCount: AnimationEffectsRegistryCatalog.length,
    categoryCount: AnimationEffectsRegistryCategories.length,
    extensionClassificationCount: AnimationEffectsRegistryExtensions.length,
    policyCount: AnimationEffectsRegistryPolicies.length,
  }),
  foundationCollectionsPreservedByReference: true,
  categoriesDerivedFromFoundation: true,
  countsDerivedFromCanonicalCollections: true,
  hardcodedAggregateTotals: false,
  reconstructsFoundationCollections: false,
  duplicatesFoundationMetadata: false,
  maintainsParallelUpstreamInventory: false,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);
