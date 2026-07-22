import { TimelineVisualizationPlatformPlatform } from "./timelineVisualizationPlatform.ts";
import { TimelineVisualizationCertificationCompatibility } from "./timelineVisualizationCertificationCompatibility.ts";
import { TimelineVisualizationCertificationCriteria } from "./timelineVisualizationCertificationCriteria.ts";
import { TimelineVisualizationCertificationGates } from "./timelineVisualizationCertificationGates.ts";

export const TimelineVisualizationCertificationInventory = Object.freeze({
  criteria: TimelineVisualizationCertificationCriteria,
  gates: TimelineVisualizationCertificationGates,
  compatibilityVerification: TimelineVisualizationCertificationCompatibility,
  platformInventory: TimelineVisualizationPlatformPlatform.inventory,
  platformCapabilities: TimelineVisualizationPlatformPlatform.capabilities,
  platformGuarantees: TimelineVisualizationPlatformPlatform.guarantees,
  platformCompatibility: TimelineVisualizationPlatformPlatform.compatibility,
  platformComposition: TimelineVisualizationPlatformPlatform.composition,
  dependencyMetadata: TimelineVisualizationPlatformPlatform.metadata.dependency,
  publicCertificationSurface: Object.freeze([
    "Certification platform", "Certification ID", "Certification version",
    "Certification namespace", "Certification metadata", "Certification summary",
    "Certification count", "Certification release metadata",
  ] as const),
  counts: Object.freeze({
    criteriaCount: TimelineVisualizationCertificationCriteria.length,
    gateCount: TimelineVisualizationCertificationGates.length,
    compatibilityVerificationCount: TimelineVisualizationCertificationCompatibility.length,
    platformPhaseCount: TimelineVisualizationPlatformPlatform.composition.length,
  }),
  platformCollectionsPreservedByReference: true,
  countsDerivedFromCanonicalCollections: true,
  hardcodesAggregateTotals: false,
  duplicatesPlatformMetadata: false,
  reconstructsUpstreamCollections: false,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);
