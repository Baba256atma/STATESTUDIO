/**
 * NEX-3:5 — Published inventory references derived from Validation.
 */

import { FeaturesModulesValidation } from "./featuresModulesValidation.ts";

export const FeaturesModulesManifestInventories = Object.freeze({
  registryInventory: Object.freeze({
    id: "NEX-3:5/Inventory/Registry",
    count: FeaturesModulesValidation.validatedInventory.registryCount,
    source: FeaturesModulesValidation.identity.id,
    metadataOnly: true,
    immutable: true,
  }),
  modelInventory: Object.freeze({
    id: "NEX-3:5/Inventory/Model",
    count: FeaturesModulesValidation.validatedInventory.modelCount,
    source: FeaturesModulesValidation.validatedInventory.sourceModelId,
    metadataOnly: true,
    immutable: true,
  }),
  validationInventory: FeaturesModulesValidation.inventory,
  featuresInventory: Object.freeze({
    id: "NEX-3:5/Inventory/Features",
    count: FeaturesModulesValidation.groups[11].domainCoverage.length,
    source: FeaturesModulesValidation.groups[11].id,
    metadataOnly: true,
    immutable: true,
  }),
  modulesInventory: Object.freeze({
    id: "NEX-3:5/Inventory/Modules",
    count: FeaturesModulesValidation.groups[12].domainCoverage.length,
    source: FeaturesModulesValidation.groups[12].id,
    metadataOnly: true,
    immutable: true,
  }),
  publicApiInventory: Object.freeze({
    id: "NEX-3:5/Inventory/PublicApi",
    count: FeaturesModulesValidation.validatedInventory.publicApiCount,
    source: FeaturesModulesValidation.identity.id,
    metadataOnly: true,
    immutable: true,
  }),
} as const);
