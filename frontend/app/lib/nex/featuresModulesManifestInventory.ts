/**
 * NEX-3:5 — Manifest inventory derived exclusively from Validation metadata.
 */

import { FeaturesModulesValidation } from "./featuresModulesValidation.ts";

export const FeaturesModulesManifestInventory = Object.freeze({
  id: "NEX-3:5/ManifestInventory",
  registryCount: FeaturesModulesValidation.validatedInventory.registryCount,
  modelCount: FeaturesModulesValidation.validatedInventory.modelCount,
  validationCategoryCount: FeaturesModulesValidation.inventory.validationCategoryCount,
  validationRuleCount: FeaturesModulesValidation.inventory.validationRuleCount,
  validationOutcomeCount: FeaturesModulesValidation.inventory.validationOutcomeCount,
  validationGroupCount: FeaturesModulesValidation.inventory.validationGroupCount,
  featureCount: FeaturesModulesValidation.groups[11].domainCoverage.length,
  moduleCount: FeaturesModulesValidation.groups[12].domainCoverage.length,
  publicApiCount: FeaturesModulesValidation.validatedInventory.publicApiCount,
  manifestEntryCount: FeaturesModulesValidation.inventory.validationGroupCount,
  sourceValidationId: FeaturesModulesValidation.identity.id,
  upstreamDerived: true,
  hardcodedInventoryValues: false,
  metadataOnly: true,
  immutable: true,
} as const);
