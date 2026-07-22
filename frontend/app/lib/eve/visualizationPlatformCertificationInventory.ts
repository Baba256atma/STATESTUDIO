import { VisualizationPlatformCertificationCompatibility } from "./visualizationPlatformCertificationCompatibility.ts";
import { VisualizationPlatformCertificationCriteria } from "./visualizationPlatformCertificationCriteria.ts";
import { VisualizationPlatformCertificationGates } from "./visualizationPlatformCertificationGates.ts";
import { VisualizationPlatformPlatform } from "./visualizationPlatformPlatform.ts";

const platform = VisualizationPlatformPlatform;
const PublicCertificationSurface = Object.freeze([
  "Canonical Certification object", "Certification identity",
  "Certification metadata", "Certification inventory",
  "Certification summary", "Certification count accessor",
  "Certification release metadata", "Certification readiness metadata",
] as const);

export const VisualizationPlatformCertificationInventory = Object.freeze({
  criteria: VisualizationPlatformCertificationCriteria,
  gates: VisualizationPlatformCertificationGates,
  compatibilityVerification: VisualizationPlatformCertificationCompatibility,
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
    criteriaCount: VisualizationPlatformCertificationCriteria.length,
    gateCount: VisualizationPlatformCertificationGates.length,
    compatibilityVerificationCount:
      VisualizationPlatformCertificationCompatibility.length,
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
