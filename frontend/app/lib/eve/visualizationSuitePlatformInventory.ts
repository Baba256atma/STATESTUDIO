import { VisualizationSuiteManifestPlatform } from "./visualizationSuiteManifest.ts";
import { VisualizationSuitePlatformCapabilities } from "./visualizationSuitePlatformCapabilities.ts";
import { VisualizationSuitePlatformCompatibility } from "./visualizationSuitePlatformCompatibility.ts";
import { VisualizationSuitePlatformGuarantees } from "./visualizationSuitePlatformGuarantees.ts";

const manifest = VisualizationSuiteManifestPlatform;

export const VisualizationSuitePlatformComposition = Object.freeze([
  ...manifest.composition,
  Object.freeze({
    id: "EVE-9:6/Composition/Platform",
    phase: "Platform",
    canonicalReference: "EVE-9:6/VisualizationSuitePlatform",
    canonicalSource: "EVE-9:6/VisualizationSuitePlatform",
    preservedByReference: true,
    deterministicOrder: manifest.composition.length + 1,
    metadataOnly: true,
    immutable: true,
  }),
]);

const PublicPlatformSurface = Object.freeze([
  "Canonical Platform object", "Platform identity", "Platform metadata",
  "Platform inventory", "Platform summary", "Platform count accessor",
  "Platform release metadata", "Platform readiness metadata",
] as const);

export const VisualizationSuitePlatformInventory = Object.freeze({
  phaseComposition: VisualizationSuitePlatformComposition,
  capabilities: VisualizationSuitePlatformCapabilities,
  guarantees: VisualizationSuitePlatformGuarantees,
  compatibility: VisualizationSuitePlatformCompatibility,
  manifestInventory: manifest.inventory,
  manifestComposition: manifest.composition,
  manifestGuarantees: manifest.guarantees,
  manifestCompatibility: manifest.compatibility,
  manifestReadiness: manifest.readiness,
  manifestReadinessDeclarations: manifest.readinessDeclarations,
  manifestMetadata: manifest.metadata,
  validationInventory: manifest.inventory.validationInventory,
  canonicalReferences: VisualizationSuitePlatformComposition,
  dependencyMetadata: manifest.metadata.dependency,
  publicPlatformSurface: PublicPlatformSurface,
  counts: Object.freeze({
    phaseCount: VisualizationSuitePlatformComposition.length,
    capabilityCount: VisualizationSuitePlatformCapabilities.length,
    guaranteeCount: VisualizationSuitePlatformGuarantees.length,
    compatibilityCount: VisualizationSuitePlatformCompatibility.length,
    manifestInventoryCount: Object.keys(manifest.inventory.counts).length,
    validationInventoryCount:
      Object.keys(manifest.inventory.validationInventory.counts).length,
    canonicalReferenceCount: VisualizationSuitePlatformComposition.length,
    publicSurfaceCount: PublicPlatformSurface.length,
  }),
  manifestCollectionsPreservedByReference: true,
  upstreamReachableExclusivelyThroughManifest: true,
  inventoriesDerivedExclusivelyFromManifestCollections: true,
  countsDerivedFromCanonicalCollections: true,
  hardcodedAggregateTotals: false,
  reconstructsUpstreamCollections: false,
  duplicatesManifestMetadata: false,
  maintainsParallelUpstreamInventory: false,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);
