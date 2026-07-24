/**
 * NEX-4:7 — Certification inventory derived exclusively from Platform metadata.
 */

import { UserJourneyExperiencePlatform } from "./userJourneyExperiencePlatform.ts";

export const UserJourneyExperienceCertificationInventory = Object.freeze({
  id: "NEX-4:7/CertificationInventory",
  platformCount: UserJourneyExperiencePlatform.certificationSeedMetadata.platforms.length,
  capabilityCount: UserJourneyExperiencePlatform.capabilities.length,
  guaranteeCount: UserJourneyExperiencePlatform.guarantees.length,
  compatibilityCount: UserJourneyExperiencePlatform.certificationSeedMetadata.compatibilityDeclarations.length,
  certificationCriteriaCount: UserJourneyExperiencePlatform.certificationSeedMetadata.criteriaSubjects.length,
  certificationGateCount: UserJourneyExperiencePlatform.certificationSeedMetadata.gateSubjects.length,
  dependencyCount: UserJourneyExperiencePlatform.certificationSeedMetadata.dependencies.length,
  publicApiCount: UserJourneyExperiencePlatform.publicApiRegistry.length,
  certificationEntryCount: UserJourneyExperiencePlatform.composition.sections.length,
  sourcePlatformId: UserJourneyExperiencePlatform.identity.id,
  upstreamDerived: true,
  hardcodedInventoryValues: false,
  metadataOnly: true,
  immutable: true,
} as const);
