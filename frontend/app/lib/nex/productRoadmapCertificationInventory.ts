/**
 * NEX-2:7 — Certification inventory derived exclusively from Platform metadata.
 */

import { ProductRoadmapPlatform } from "./productRoadmapPlatform.ts";

export const ProductRoadmapCertificationInventory = Object.freeze({
  id: "NEX-2:7/CertificationInventory",
  platformCount:
    ProductRoadmapPlatform.certificationSeedMetadata.platforms.length,
  capabilityCount:
    ProductRoadmapPlatform.capabilities.length,
  guaranteeCount:
    ProductRoadmapPlatform.guarantees.length,
  compatibilityCount:
    ProductRoadmapPlatform.certificationSeedMetadata.compatibilityDeclarations.length,
  certificationCriteriaCount:
    ProductRoadmapPlatform.certificationSeedMetadata.criteriaSubjects.length,
  certificationGateCount:
    ProductRoadmapPlatform.certificationSeedMetadata.gateSubjects.length,
  dependencyCount:
    ProductRoadmapPlatform.certificationSeedMetadata.dependencies.length,
  publicApiCount:
    ProductRoadmapPlatform.publicApiRegistry.length,
  certificationEntryCount:
    ProductRoadmapPlatform.composition.sections.length,
  sourcePlatformId: ProductRoadmapPlatform.identity.id,
  upstreamDerived: true,
  hardcodedInventoryValues: false,
  metadataOnly: true,
  immutable: true,
} as const);
