import { ChartMetricVisualizationManifestPlatform } from "./chartMetricVisualizationManifest.ts";
import { ChartMetricVisualizationPlatformCapabilities } from "./chartMetricVisualizationPlatformCapabilities.ts";
import { ChartMetricVisualizationPlatformCompatibility } from "./chartMetricVisualizationPlatformCompatibility.ts";
import { ChartMetricVisualizationPlatformGuarantees } from "./chartMetricVisualizationPlatformGuarantees.ts";

export const ChartMetricVisualizationPlatformComposition = Object.freeze([
  ...ChartMetricVisualizationManifestPlatform.composition,
  Object.freeze({
    id: "EVE-5:6/Composition/Platform",
    phase: "Platform",
    canonicalReference: "EVE-5:6/ChartMetricVisualizationPlatform",
    canonicalSource: "EVE-5:6/ChartMetricVisualizationPlatform",
    preservedByReference: true,
    deterministicOrder: ChartMetricVisualizationManifestPlatform.composition.length + 1,
    metadataOnly: true,
    immutable: true,
  }),
]);

const PublicPlatformSurface = Object.freeze([
  "Canonical Platform", "Platform identity metadata", "Platform inventory metadata",
  "Platform metadata", "Platform summary accessor", "Platform count accessor",
  "Platform release metadata accessor", "Platform readiness metadata",
] as const);

export const ChartMetricVisualizationPlatformInventory = Object.freeze({
  phaseComposition: ChartMetricVisualizationPlatformComposition,
  capabilities: ChartMetricVisualizationPlatformCapabilities,
  guarantees: ChartMetricVisualizationPlatformGuarantees,
  compatibility: ChartMetricVisualizationPlatformCompatibility,
  manifestInventory: ChartMetricVisualizationManifestPlatform.inventory,
  manifestComposition: ChartMetricVisualizationManifestPlatform.composition,
  manifestGuarantees: ChartMetricVisualizationManifestPlatform.guarantees,
  manifestCompatibility: ChartMetricVisualizationManifestPlatform.compatibility,
  manifestReadiness: ChartMetricVisualizationManifestPlatform.readiness,
  manifestReadinessDeclarations:
    ChartMetricVisualizationManifestPlatform.readinessDeclarations,
  manifestMetadata: ChartMetricVisualizationManifestPlatform.metadata,
  dependencyMetadata: ChartMetricVisualizationManifestPlatform.metadata.dependency,
  publicPlatformSurface: PublicPlatformSurface,
  counts: Object.freeze({
    phaseCount: ChartMetricVisualizationPlatformComposition.length,
    capabilityCount: ChartMetricVisualizationPlatformCapabilities.length,
    guaranteeCount: ChartMetricVisualizationPlatformGuarantees.length,
    compatibilityCount: ChartMetricVisualizationPlatformCompatibility.length,
    publicSurfaceCount: PublicPlatformSurface.length,
  }),
  manifestCollectionsPreservedByReference: true,
  upstreamReachableExclusivelyThroughManifest: true,
  countsDerivedFromCanonicalCollections: true,
  hardcodedAggregateTotals: false,
  reconstructsUpstreamCollections: false,
  duplicatesManifestMetadata: false,
  maintainsParallelUpstreamInventory: false,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);
