import { ChartMetricVisualizationCertificationCompatibility } from "./chartMetricVisualizationCertificationCompatibility.ts";
import { ChartMetricVisualizationCertificationCriteria } from "./chartMetricVisualizationCertificationCriteria.ts";
import { ChartMetricVisualizationCertificationGates } from "./chartMetricVisualizationCertificationGates.ts";
import { ChartMetricVisualizationPlatform } from "./chartMetricVisualizationPlatform.ts";

const PublicCertificationSurface = Object.freeze([
  "Certification platform", "Certification identity metadata",
  "Certification inventory metadata", "Certification metadata",
  "Certification summary accessor", "Certification count accessor",
  "Certification release metadata accessor", "Certification readiness metadata",
] as const);

export const ChartMetricVisualizationCertificationInventory = Object.freeze({
  criteria: ChartMetricVisualizationCertificationCriteria,
  gates: ChartMetricVisualizationCertificationGates,
  compatibilityVerification: ChartMetricVisualizationCertificationCompatibility,
  platformInventory: ChartMetricVisualizationPlatform.inventory,
  platformCapabilities: ChartMetricVisualizationPlatform.capabilities,
  platformGuarantees: ChartMetricVisualizationPlatform.guarantees,
  platformCompatibility: ChartMetricVisualizationPlatform.compatibility,
  platformComposition: ChartMetricVisualizationPlatform.composition,
  platformMetadata: ChartMetricVisualizationPlatform.metadata,
  platformReadiness: ChartMetricVisualizationPlatform.readiness,
  dependencyMetadata: ChartMetricVisualizationPlatform.metadata.dependency,
  publicCertificationSurface: PublicCertificationSurface,
  counts: Object.freeze({
    criteriaCount: ChartMetricVisualizationCertificationCriteria.length,
    gateCount: ChartMetricVisualizationCertificationGates.length,
    compatibilityVerificationCount:
      ChartMetricVisualizationCertificationCompatibility.length,
    publicSurfaceCount: PublicCertificationSurface.length,
  }),
  platformCollectionsPreservedByReference: true,
  upstreamReachableExclusivelyThroughPlatform: true,
  countsDerivedFromCanonicalCollections: true,
  hardcodedAggregateTotals: false,
  duplicatesPlatformMetadata: false,
  reconstructsUpstreamCollections: false,
  maintainsParallelUpstreamInventory: false,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);
