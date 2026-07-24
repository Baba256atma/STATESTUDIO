/**
 * NEX-4:4 — Derived Validation inventory and public API metadata.
 */

import { UserJourneyExperienceValidationCategories } from "./userJourneyExperienceValidationCategories.ts";
import { UserJourneyExperienceValidationGroups } from "./userJourneyExperienceValidationGroups.ts";
import { UserJourneyExperienceValidationOutcomes } from "./userJourneyExperienceValidationOutcomes.ts";
import { UserJourneyExperienceValidationRules } from "./userJourneyExperienceValidationRules.ts";

export const UserJourneyExperienceValidationInventory = Object.freeze({
  id: "NEX-4:4/ValidationInventory",
  validationCategoryCount: UserJourneyExperienceValidationCategories.length,
  validationRuleCount: UserJourneyExperienceValidationRules.length,
  validationOutcomeCount: UserJourneyExperienceValidationOutcomes.length,
  validationGroupCount: UserJourneyExperienceValidationGroups.length,
  validationVersion: "1.0.0",
  metadataOnly: true,
  immutable: true,
} as const);

export const UserJourneyExperienceValidationPublicApiRegistry = Object.freeze([
  Object.freeze({ id: "NEX-4:4/PublicValidationExport/01/Id", order: 1, exportName: "UserJourneyExperienceValidationId", artifact: "Identity", executableApi: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:4/PublicValidationExport/02/Name", order: 2, exportName: "UserJourneyExperienceValidationName", artifact: "Identity", executableApi: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:4/PublicValidationExport/03/Namespace", order: 3, exportName: "UserJourneyExperienceValidationNamespace", artifact: "Identity", executableApi: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:4/PublicValidationExport/04/Version", order: 4, exportName: "UserJourneyExperienceValidationVersion", artifact: "Identity", executableApi: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:4/PublicValidationExport/05/Status", order: 5, exportName: "UserJourneyExperienceValidationStatus", artifact: "Identity", executableApi: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:4/PublicValidationExport/06/Readiness", order: 6, exportName: "UserJourneyExperienceValidationReadiness", artifact: "Readiness", executableApi: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:4/PublicValidationExport/07/PublicApiRegistry", order: 7, exportName: "UserJourneyExperienceValidationPublicApiRegistry", artifact: "PublicApiRegistry", executableApi: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:4/PublicValidationExport/08/Validation", order: 8, exportName: "UserJourneyExperienceValidation", artifact: "Aggregate", executableApi: false, metadataOnly: true, immutable: true }),
] as const);
