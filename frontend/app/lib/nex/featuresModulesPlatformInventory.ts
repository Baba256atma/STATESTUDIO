/**
 * NEX-3:6 — Platform inventory derived exclusively from Manifest metadata.
 */

import { FeaturesModulesManifest } from "./featuresModulesManifest.ts";

export const FeaturesModulesPlatformInventory = Object.freeze({
  id: "NEX-3:6/PlatformInventory",
  manifestCount: FeaturesModulesManifest.platformSeedMetadata.manifests.length,
  registryCount: FeaturesModulesManifest.inventory.registryCount,
  modelCount: FeaturesModulesManifest.inventory.modelCount,
  validationCategoryCount: FeaturesModulesManifest.inventory.validationCategoryCount,
  validationRuleCount: FeaturesModulesManifest.inventory.validationRuleCount,
  featureCount: FeaturesModulesManifest.inventory.featureCount,
  moduleCount: FeaturesModulesManifest.inventory.moduleCount,
  platformCapabilityCount: FeaturesModulesManifest.platformSeedMetadata.capabilitySubjects.length,
  publicApiCount: FeaturesModulesManifest.publicApiRegistry.length,
  platformEntryCount: FeaturesModulesManifest.composition.sections.length,
  sourceManifestId: FeaturesModulesManifest.identity.id,
  upstreamDerived: true,
  hardcodedInventoryValues: false,
  metadataOnly: true,
  immutable: true,
} as const);
