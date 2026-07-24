/**
 * NEX-3:7 — Certification inventory derived exclusively from Platform metadata.
 */

import { FeaturesModulesPlatform } from "./featuresModulesPlatform.ts";

export const FeaturesModulesCertificationInventory = Object.freeze({
  id: "NEX-3:7/CertificationInventory",
  platformCount: FeaturesModulesPlatform.certificationSeedMetadata.platforms.length,
  capabilityCount: FeaturesModulesPlatform.capabilities.length,
  guaranteeCount: FeaturesModulesPlatform.guarantees.length,
  compatibilityCount: FeaturesModulesPlatform.certificationSeedMetadata.compatibilityDeclarations.length,
  certificationCriteriaCount: FeaturesModulesPlatform.certificationSeedMetadata.criteriaSubjects.length,
  certificationGateCount: FeaturesModulesPlatform.certificationSeedMetadata.gateSubjects.length,
  dependencyCount: FeaturesModulesPlatform.certificationSeedMetadata.dependencies.length,
  publicApiCount: FeaturesModulesPlatform.publicApiRegistry.length,
  certificationEntryCount: FeaturesModulesPlatform.composition.sections.length,
  sourcePlatformId: FeaturesModulesPlatform.identity.id,
  upstreamDerived: true,
  hardcodedInventoryValues: false,
  metadataOnly: true,
  immutable: true,
} as const);
