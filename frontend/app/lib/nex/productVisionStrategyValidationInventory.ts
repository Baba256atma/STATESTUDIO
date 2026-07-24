/**
 * NEX-1:4 — Validation inventory and public API Registry metadata.
 */

import { ProductVisionStrategyValidationCategories } from "./productVisionStrategyValidationCategories.ts";
import { ProductVisionStrategyValidationGroups } from "./productVisionStrategyValidationGroups.ts";
import { ProductVisionStrategyValidationOutcomes } from "./productVisionStrategyValidationOutcomes.ts";
import { ProductVisionStrategyValidationRules } from "./productVisionStrategyValidationRules.ts";

export const ProductVisionStrategyValidationInventory = Object.freeze({
  identifier: "NEX-1:4/ValidationInventory",
  validationCategoryCount: ProductVisionStrategyValidationCategories.length,
  validationRuleCount: ProductVisionStrategyValidationRules.length,
  validationOutcomeCount: ProductVisionStrategyValidationOutcomes.length,
  validationGroupCount: ProductVisionStrategyValidationGroups.length,
  validationVersion: "1.0.0",
  metadataOnly: true,
  immutable: true,
} as const);

export const ProductVisionStrategyValidationPublicApiRegistry = Object.freeze([
  Object.freeze({ identifier: "NEX-1:4/PublicValidationExport/Id", exportName: "ProductVisionStrategyValidationId", artifact: "Identity", metadataOnly: true }),
  Object.freeze({ identifier: "NEX-1:4/PublicValidationExport/Name", exportName: "ProductVisionStrategyValidationName", artifact: "Identity", metadataOnly: true }),
  Object.freeze({ identifier: "NEX-1:4/PublicValidationExport/Namespace", exportName: "ProductVisionStrategyValidationNamespace", artifact: "Identity", metadataOnly: true }),
  Object.freeze({ identifier: "NEX-1:4/PublicValidationExport/Version", exportName: "ProductVisionStrategyValidationVersion", artifact: "Identity", metadataOnly: true }),
  Object.freeze({ identifier: "NEX-1:4/PublicValidationExport/Status", exportName: "ProductVisionStrategyValidationStatus", artifact: "Identity", metadataOnly: true }),
  Object.freeze({ identifier: "NEX-1:4/PublicValidationExport/Readiness", exportName: "ProductVisionStrategyValidationReadiness", artifact: "Readiness", metadataOnly: true }),
  Object.freeze({ identifier: "NEX-1:4/PublicValidationExport/PublicApiRegistry", exportName: "ProductVisionStrategyValidationPublicApiRegistry", artifact: "PublicApiRegistry", metadataOnly: true }),
  Object.freeze({ identifier: "NEX-1:4/PublicValidationExport/Validation", exportName: "ProductVisionStrategyValidation", artifact: "Aggregate", metadataOnly: true }),
] as const);
