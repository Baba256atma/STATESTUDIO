/**
 * NEX-2:4 — Validation inventory and public API metadata.
 */

import { ProductRoadmapValidationCategories } from "./productRoadmapValidationCategories.ts";
import { ProductRoadmapValidationGroups } from "./productRoadmapValidationGroups.ts";
import { ProductRoadmapValidationOutcomes } from "./productRoadmapValidationOutcomes.ts";
import { ProductRoadmapValidationRules } from "./productRoadmapValidationRules.ts";

export const ProductRoadmapValidationInventory = Object.freeze({
  id: "NEX-2:4/ValidationInventory",
  validationCategoryCount: ProductRoadmapValidationCategories.length,
  validationRuleCount: ProductRoadmapValidationRules.length,
  validationOutcomeCount: ProductRoadmapValidationOutcomes.length,
  validationGroupCount: ProductRoadmapValidationGroups.length,
  validationVersion: "1.0.0",
  metadataOnly: true,
  immutable: true,
} as const);

export const ProductRoadmapValidationPublicApiRegistry = Object.freeze([
  Object.freeze({ id: "NEX-2:4/PublicValidationExport/Id", exportName: "ProductRoadmapValidationId", artifact: "Identity", executableApi: false, metadataOnly: true }),
  Object.freeze({ id: "NEX-2:4/PublicValidationExport/Name", exportName: "ProductRoadmapValidationName", artifact: "Identity", executableApi: false, metadataOnly: true }),
  Object.freeze({ id: "NEX-2:4/PublicValidationExport/Namespace", exportName: "ProductRoadmapValidationNamespace", artifact: "Identity", executableApi: false, metadataOnly: true }),
  Object.freeze({ id: "NEX-2:4/PublicValidationExport/Version", exportName: "ProductRoadmapValidationVersion", artifact: "Identity", executableApi: false, metadataOnly: true }),
  Object.freeze({ id: "NEX-2:4/PublicValidationExport/Status", exportName: "ProductRoadmapValidationStatus", artifact: "Identity", executableApi: false, metadataOnly: true }),
  Object.freeze({ id: "NEX-2:4/PublicValidationExport/Readiness", exportName: "ProductRoadmapValidationReadiness", artifact: "Readiness", executableApi: false, metadataOnly: true }),
  Object.freeze({ id: "NEX-2:4/PublicValidationExport/PublicApiRegistry", exportName: "ProductRoadmapValidationPublicApiRegistry", artifact: "PublicApiRegistry", executableApi: false, metadataOnly: true }),
  Object.freeze({ id: "NEX-2:4/PublicValidationExport/Validation", exportName: "ProductRoadmapValidation", artifact: "Aggregate", executableApi: false, metadataOnly: true }),
] as const);
