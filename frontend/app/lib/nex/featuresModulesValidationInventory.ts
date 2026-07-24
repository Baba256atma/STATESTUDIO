/**
 * NEX-3:4 — Derived Validation inventory and public API metadata.
 */

import { FeaturesModulesValidationCategories } from "./featuresModulesValidationCategories.ts";
import { FeaturesModulesValidationGroups } from "./featuresModulesValidationGroups.ts";
import { FeaturesModulesValidationOutcomes } from "./featuresModulesValidationOutcomes.ts";
import { FeaturesModulesValidationRules } from "./featuresModulesValidationRules.ts";

export const FeaturesModulesValidationInventory = Object.freeze({
  id: "NEX-3:4/ValidationInventory",
  validationCategoryCount: FeaturesModulesValidationCategories.length,
  validationRuleCount: FeaturesModulesValidationRules.length,
  validationOutcomeCount: FeaturesModulesValidationOutcomes.length,
  validationGroupCount: FeaturesModulesValidationGroups.length,
  validationVersion: "1.0.0",
  metadataOnly: true,
  immutable: true,
} as const);

export const FeaturesModulesValidationPublicApiRegistry = Object.freeze([
  Object.freeze({ id: "NEX-3:4/PublicValidationExport/Id", exportName: "FeaturesModulesValidationId", artifact: "Identity", executableApi: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:4/PublicValidationExport/Name", exportName: "FeaturesModulesValidationName", artifact: "Identity", executableApi: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:4/PublicValidationExport/Namespace", exportName: "FeaturesModulesValidationNamespace", artifact: "Identity", executableApi: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:4/PublicValidationExport/Version", exportName: "FeaturesModulesValidationVersion", artifact: "Identity", executableApi: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:4/PublicValidationExport/Status", exportName: "FeaturesModulesValidationStatus", artifact: "Identity", executableApi: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:4/PublicValidationExport/Readiness", exportName: "FeaturesModulesValidationReadiness", artifact: "Readiness", executableApi: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:4/PublicValidationExport/PublicApiRegistry", exportName: "FeaturesModulesValidationPublicApiRegistry", artifact: "PublicApiRegistry", executableApi: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:4/PublicValidationExport/Validation", exportName: "FeaturesModulesValidation", artifact: "Aggregate", executableApi: false, metadataOnly: true, immutable: true }),
] as const);
