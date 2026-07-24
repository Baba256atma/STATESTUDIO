/**
 * NEX-4:5 — Published inventory references derived from Validation.
 */

import { UserJourneyExperienceValidation } from "./userJourneyExperienceValidation.ts";

export const UserJourneyExperienceManifestInventories = Object.freeze({
  registryInventory: Object.freeze({ id: "NEX-4:5/Inventory/Registry", count: UserJourneyExperienceValidation.validatedInventory.registryCount, source: UserJourneyExperienceValidation.identity.id, metadataOnly: true, immutable: true }),
  modelInventory: Object.freeze({ id: "NEX-4:5/Inventory/Model", count: UserJourneyExperienceValidation.validatedInventory.modelCount, source: UserJourneyExperienceValidation.validatedInventory.sourceModelId, metadataOnly: true, immutable: true }),
  validationInventory: UserJourneyExperienceValidation.inventory,
  journeyInventory: Object.freeze({ id: "NEX-4:5/Inventory/Journey", count: UserJourneyExperienceValidation.groups[11].domainCoverage.length, source: UserJourneyExperienceValidation.groups[11].id, metadataOnly: true, immutable: true }),
  experienceInventory: Object.freeze({ id: "NEX-4:5/Inventory/Experience", count: UserJourneyExperienceValidation.groups[12].domainCoverage.length, source: UserJourneyExperienceValidation.groups[12].id, metadataOnly: true, immutable: true }),
  publicApiInventory: Object.freeze({ id: "NEX-4:5/Inventory/PublicApi", count: UserJourneyExperienceValidation.validatedInventory.publicApiCount, source: UserJourneyExperienceValidation.identity.id, metadataOnly: true, immutable: true }),
} as const);
