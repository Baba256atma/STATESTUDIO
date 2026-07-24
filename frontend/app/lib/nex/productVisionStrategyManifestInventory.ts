/**
 * NEX-1:5 — Manifest inventory metadata.
 *
 * Earlier-phase counts are published through the validated package reference;
 * this artifact imports no Registry or Model implementation.
 */

import { ProductVisionStrategyValidation } from "./productVisionStrategyValidation.ts";

export const ProductVisionStrategyManifestInventory = Object.freeze({
  id: "NEX-1:5/ManifestInventory",
  registryCount: 16,
  modelCount: 16,
  validationCategoryCount:
    ProductVisionStrategyValidation.inventory.validationCategoryCount,
  validationRuleCount:
    ProductVisionStrategyValidation.inventory.validationRuleCount,
  validationOutcomeCount:
    ProductVisionStrategyValidation.inventory.validationOutcomeCount,
  domainGroupCount:
    ProductVisionStrategyValidation.inventory.validationGroupCount,
  relationshipCount: 14,
  publicApiCount:
    ProductVisionStrategyValidation.publicApiRegistry.length,
  manifestEntryCount: 16,
  sourceValidationId: ProductVisionStrategyValidation.identity.id,
  metadataOnly: true,
  immutable: true,
} as const);

export const ProductVisionStrategyManifestInventories = Object.freeze({
  manifestInventory: ProductVisionStrategyManifestInventory,
  modelInventory: Object.freeze({ id: "NEX-1:5/Inventory/Model", count: 16, source: "NEX-1:4/ValidatedModelInventory", metadataOnly: true, immutable: true }),
  registryInventory: Object.freeze({ id: "NEX-1:5/Inventory/Registry", count: 16, source: "NEX-1:4/ValidatedRegistryInventory", metadataOnly: true, immutable: true }),
  validationInventory: ProductVisionStrategyValidation.inventory,
  productStrategyInventory: Object.freeze({ id: "NEX-1:5/Inventory/ProductStrategy", domainCount: 16, source: ProductVisionStrategyValidation.identity.id, metadataOnly: true, immutable: true }),
  relationshipInventory: Object.freeze({ id: "NEX-1:5/Inventory/Relationship", count: 14, source: "NEX-1:4/ValidatedModelRelationships", metadataOnly: true, immutable: true }),
  publicApiInventory: Object.freeze({ id: "NEX-1:5/Inventory/PublicApi", validationExportCount: ProductVisionStrategyValidation.publicApiRegistry.length, manifestExportCount: 8, metadataOnly: true, immutable: true }),
} as const);
