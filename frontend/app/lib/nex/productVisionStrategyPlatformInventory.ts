/**
 * NEX-1:6 — Platform inventory metadata.
 */

import { ProductVisionStrategyManifest } from "./productVisionStrategyManifest.ts";

export const ProductVisionStrategyPlatformInventory = Object.freeze({
  id: "NEX-1:6/PlatformInventory",
  manifestCount: 1,
  registryCount: ProductVisionStrategyManifest.inventory.registryCount,
  modelCount: ProductVisionStrategyManifest.inventory.modelCount,
  validationCategoryCount:
    ProductVisionStrategyManifest.inventory.validationCategoryCount,
  validationRuleCount:
    ProductVisionStrategyManifest.inventory.validationRuleCount,
  platformCapabilityCount: 8,
  platformGuaranteeCount: 10,
  platformCompatibilityCount: 4,
  publicApiCount: 8,
  platformEntryCount: 16,
  sourceManifestId: ProductVisionStrategyManifest.identity.id,
  metadataOnly: true,
  immutable: true,
} as const);
