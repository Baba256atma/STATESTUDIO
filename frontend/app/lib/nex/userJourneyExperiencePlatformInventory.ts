/**
 * NEX-4:6 — Platform inventory derived exclusively from Manifest metadata.
 */

import { UserJourneyExperienceManifest } from "./userJourneyExperienceManifest.ts";

export const UserJourneyExperiencePlatformInventory = Object.freeze({
  id: "NEX-4:6/PlatformInventory",
  manifestCount: UserJourneyExperienceManifest.platformSeedMetadata.manifests.length,
  registryCount: UserJourneyExperienceManifest.inventory.registryCount,
  modelCount: UserJourneyExperienceManifest.inventory.modelCount,
  validationCategoryCount: UserJourneyExperienceManifest.inventory.validationCategoryCount,
  validationRuleCount: UserJourneyExperienceManifest.inventory.validationRuleCount,
  journeyCount: UserJourneyExperienceManifest.inventory.journeyCount,
  experienceCount: UserJourneyExperienceManifest.inventory.experienceCount,
  platformCapabilityCount: UserJourneyExperienceManifest.platformSeedMetadata.capabilitySubjects.length,
  publicApiCount: UserJourneyExperienceManifest.publicApiRegistry.length,
  platformEntryCount: UserJourneyExperienceManifest.composition.sections.length,
  sourceManifestId: UserJourneyExperienceManifest.identity.id,
  upstreamDerived: true,
  hardcodedInventoryValues: false,
  metadataOnly: true,
  immutable: true,
} as const);
