/**
 * NEX-4:2 — Registry inventory metadata.
 */

import { UserJourneyExperienceRegistryCollections } from "./userJourneyExperienceRegistries.ts";
import { UserJourneyExperienceRegistryRelationships } from "./userJourneyExperienceRegistryRelationships.ts";

export const UserJourneyExperienceRegistryInventory = Object.freeze({
  id: "NEX-4:2/RegistryInventory",
  registryCount: Object.keys(UserJourneyExperienceRegistryCollections).length,
  registryCategoryCount: Object.keys(UserJourneyExperienceRegistryCollections).length,
  registryRelationshipCount: UserJourneyExperienceRegistryRelationships.length,
  registryGroupCount: Object.keys(UserJourneyExperienceRegistryCollections).length,
  registryVersion: "1.0.0",
  metadataOnly: true,
  immutable: true,
} as const);
