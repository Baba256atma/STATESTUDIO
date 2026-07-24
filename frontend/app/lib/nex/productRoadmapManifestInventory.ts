/**
 * NEX-2:5 — Manifest inventory derived exclusively from Validation metadata.
 */

import { ProductRoadmapValidation } from "./productRoadmapValidation.ts";

export const ProductRoadmapManifestInventory = Object.freeze({
  id: "NEX-2:5/ManifestInventory",
  registryCount:
    ProductRoadmapValidation.validatedInventory.registryCount,
  modelCount:
    ProductRoadmapValidation.validatedInventory.modelCount,
  validationCategoryCount:
    ProductRoadmapValidation.inventory.validationCategoryCount,
  validationRuleCount:
    ProductRoadmapValidation.inventory.validationRuleCount,
  validationOutcomeCount:
    ProductRoadmapValidation.inventory.validationOutcomeCount,
  validationGroupCount:
    ProductRoadmapValidation.inventory.validationGroupCount,
  relationshipCount:
    ProductRoadmapValidation.validatedInventory.relationshipCount,
  publicApiCount:
    ProductRoadmapValidation.validatedInventory.publicApiCount,
  manifestEntryCount:
    ProductRoadmapValidation.inventory.validationGroupCount,
  sourceValidationId: ProductRoadmapValidation.identity.id,
  upstreamDerived: true,
  hardcodedInventoryValues: false,
  metadataOnly: true,
  immutable: true,
} as const);
