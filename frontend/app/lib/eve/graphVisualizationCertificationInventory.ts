import { GraphVisualizationPlatform } from "./graphVisualizationPlatform.ts";
import { GraphVisualizationCertificationCompatibility } from "./graphVisualizationCertificationCompatibility.ts";
import { GraphVisualizationCertificationCriteria } from "./graphVisualizationCertificationCriteria.ts";
import { GraphVisualizationCertificationGates } from "./graphVisualizationCertificationGates.ts";

export const GraphVisualizationCertificationInventory = Object.freeze({
  criteria: GraphVisualizationCertificationCriteria,
  gates: GraphVisualizationCertificationGates,
  compatibilityVerification: GraphVisualizationCertificationCompatibility,
  platformInventory: GraphVisualizationPlatform.inventory,
  platformCapabilities: GraphVisualizationPlatform.capabilities,
  platformGuarantees: GraphVisualizationPlatform.guarantees,
  platformCompatibility: GraphVisualizationPlatform.compatibility,
  platformComposition: GraphVisualizationPlatform.metadata.composition,
  dependencyMetadata: GraphVisualizationPlatform.metadata.dependency,
  publicCertificationSurface: Object.freeze([
    "Certification platform", "Certification identity", "Certification inventory",
    "Certification metadata", "Certification summary", "Certification count",
    "Certification release metadata", "Certification readiness",
  ] as const),
  counts: Object.freeze({
    criteriaCount: GraphVisualizationCertificationCriteria.length,
    gateCount: GraphVisualizationCertificationGates.length,
    compatibilityVerificationCount: GraphVisualizationCertificationCompatibility.length,
    platformPhaseCount: GraphVisualizationPlatform.metadata.composition.length,
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
