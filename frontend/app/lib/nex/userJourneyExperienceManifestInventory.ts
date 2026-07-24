/**
 * NEX-4:5 — Manifest inventory derived exclusively from Validation metadata.
 */

import { UserJourneyExperienceValidation } from "./userJourneyExperienceValidation.ts";

export const UserJourneyExperienceManifestInventory = Object.freeze({
  id: "NEX-4:5/ManifestInventory",
  registryCount: UserJourneyExperienceValidation.validatedInventory.registryCount,
  modelCount: UserJourneyExperienceValidation.validatedInventory.modelCount,
  validationCategoryCount: UserJourneyExperienceValidation.inventory.validationCategoryCount,
  validationRuleCount: UserJourneyExperienceValidation.inventory.validationRuleCount,
  validationOutcomeCount: UserJourneyExperienceValidation.inventory.validationOutcomeCount,
  validationGroupCount: UserJourneyExperienceValidation.inventory.validationGroupCount,
  journeyCount: UserJourneyExperienceValidation.groups[11].domainCoverage.length,
  experienceCount: UserJourneyExperienceValidation.groups[12].domainCoverage.length,
  publicApiCount: UserJourneyExperienceValidation.validatedInventory.publicApiCount,
  manifestEntryCount: UserJourneyExperienceValidation.inventory.validationGroupCount,
  sourceValidationId: UserJourneyExperienceValidation.identity.id,
  upstreamDerived: true,
  hardcodedInventoryValues: false,
  metadataOnly: true,
  immutable: true,
} as const);
