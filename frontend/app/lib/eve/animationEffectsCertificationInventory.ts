import { AnimationEffectsCertificationCompatibility } from "./animationEffectsCertificationCompatibility.ts";
import { AnimationEffectsCertificationCriteria } from "./animationEffectsCertificationCriteria.ts";
import { AnimationEffectsCertificationGates } from "./animationEffectsCertificationGates.ts";
import { AnimationEffectsPlatform } from "./animationEffectsPlatform.ts";

const platform = AnimationEffectsPlatform;
const PublicCertificationSurface = Object.freeze([
  "Certification platform", "Certification identity metadata",
  "Certification metadata", "Certification inventory metadata",
  "Certification summary accessor", "Certification count accessor",
  "Certification readiness metadata", "Certification release metadata accessor",
] as const);

export const AnimationEffectsCertificationInventory = Object.freeze({
  criteria: AnimationEffectsCertificationCriteria,
  gates: AnimationEffectsCertificationGates,
  compatibilityVerification: AnimationEffectsCertificationCompatibility,
  platformInventory: platform.inventory,
  platformCapabilities: platform.capabilities,
  platformGuarantees: platform.guarantees,
  platformCompatibility: platform.compatibility,
  platformComposition: platform.composition,
  platformMetadata: platform.metadata,
  platformReadiness: platform.readiness,
  platformReferences: platform.composition,
  canonicalReferences: platform.inventory.canonicalReferences,
  dependencyMetadata: platform.metadata.dependency,
  publicCertificationSurface: PublicCertificationSurface,
  counts: Object.freeze({
    criteriaCount: AnimationEffectsCertificationCriteria.length,
    gateCount: AnimationEffectsCertificationGates.length,
    compatibilityVerificationCount:
      AnimationEffectsCertificationCompatibility.length,
    platformReferenceCount: platform.composition.length,
    canonicalReferenceCount: platform.inventory.canonicalReferences.length,
    publicSurfaceCount: PublicCertificationSurface.length,
  }),
  platformCollectionsPreservedByReference: true,
  upstreamReachableExclusivelyThroughPlatform: true,
  inventoriesDerivedExclusivelyFromPlatformCollections: true,
  countsDerivedFromCanonicalCollections: true,
  hardcodedAggregateTotals: false,
  duplicatesPlatformMetadata: false,
  reconstructsUpstreamCollections: false,
  maintainsParallelUpstreamInventory: false,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);
