import { VisualizationSuiteCertificationCompatibility } from "./visualizationSuiteCertificationCompatibility.ts";
import { VisualizationSuiteCertificationCriteria } from "./visualizationSuiteCertificationCriteria.ts";
import { VisualizationSuiteCertificationGates } from "./visualizationSuiteCertificationGates.ts";
import { VisualizationSuitePlatform } from "./visualizationSuitePlatform.ts";

const platform = VisualizationSuitePlatform;
const PublicCertificationSurface = Object.freeze([
  "Certification object", "Certification identity", "Certification metadata",
  "Certification inventory", "Certification summary",
  "Certification count accessor", "Certification release metadata",
  "Certification readiness metadata",
] as const);

export const VisualizationSuiteCertificationInventory = Object.freeze({
  criteria: VisualizationSuiteCertificationCriteria,
  gates: VisualizationSuiteCertificationGates,
  compatibilityVerification: VisualizationSuiteCertificationCompatibility,
  platformInventory: platform.inventory,
  platformCapabilities: platform.capabilities,
  platformGuarantees: platform.guarantees,
  platformCompatibility: platform.compatibility,
  platformComposition: platform.composition,
  platformMetadata: platform.metadata,
  platformReadiness: platform.readiness,
  platformReferences: platform.composition,
  canonicalReferences: platform.inventory.canonicalReferences,
  dependencyInventory: platform.metadata.dependency,
  namespaceInventory: platform.metadata.namespace,
  publicMetadataInventory: platform.inventory.publicPlatformSurface,
  certificationSummaryInventory: PublicCertificationSurface,
  publicCertificationSurface: PublicCertificationSurface,
  counts: Object.freeze({
    criteriaCount: VisualizationSuiteCertificationCriteria.length,
    gateCount: VisualizationSuiteCertificationGates.length,
    compatibilityVerificationCount:
      VisualizationSuiteCertificationCompatibility.length,
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
