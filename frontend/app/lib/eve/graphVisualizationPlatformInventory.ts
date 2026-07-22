import { GraphVisualizationManifest } from "./graphVisualizationManifest.ts";
import { GraphVisualizationPlatformCapabilities } from "./graphVisualizationPlatformCapabilities.ts";
import { GraphVisualizationPlatformCompatibility } from "./graphVisualizationPlatformCompatibility.ts";
import { GraphVisualizationPlatformGuarantees } from "./graphVisualizationPlatformGuarantees.ts";

export const GraphVisualizationPlatformInventory = Object.freeze({
  manifestInventory: GraphVisualizationManifest.inventory,
  manifestComposition: GraphVisualizationManifest.composition,
  manifestGuarantees: GraphVisualizationManifest.guarantees,
  manifestCompatibility: GraphVisualizationManifest.compatibility,
  manifestReadiness: GraphVisualizationManifest.readiness,
  capabilities: GraphVisualizationPlatformCapabilities,
  guarantees: GraphVisualizationPlatformGuarantees,
  compatibility: GraphVisualizationPlatformCompatibility,
  dependencyMetadata: GraphVisualizationManifest.metadata.dependency,
  counts: Object.freeze({
    manifestPhaseCount: GraphVisualizationManifest.composition.length,
    capabilityCount: GraphVisualizationPlatformCapabilities.length,
    guaranteeCount: GraphVisualizationPlatformGuarantees.length,
    compatibilityCount: GraphVisualizationPlatformCompatibility.length,
  }),
  manifestCollectionsPreservedByReference: true,
  countsDerivedFromCanonicalCollections: true,
  hardcodesAggregateTotals: false,
  reconstructsUpstreamCollections: false,
  duplicatesManifestMetadata: false,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);
