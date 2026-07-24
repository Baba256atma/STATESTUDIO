/**
 * NEX-3:2 — Registry inventory metadata.
 */

import { FeaturesModulesRegistryCollections } from "./featuresModulesRegistries.ts";
import { FeaturesModulesRegistryRelationships } from "./featuresModulesRegistryRelationships.ts";

export const FeaturesModulesRegistryInventory = Object.freeze({
  id: "NEX-3:2/RegistryInventory",
  registryCount: Object.keys(FeaturesModulesRegistryCollections).length,
  registryCategoryCount: Object.keys(FeaturesModulesRegistryCollections).length,
  registryRelationshipCount: FeaturesModulesRegistryRelationships.length,
  registryGroupCount: Object.keys(FeaturesModulesRegistryCollections).length,
  registryVersion: "1.0.0",
  metadataOnly: true,
  immutable: true,
} as const);
