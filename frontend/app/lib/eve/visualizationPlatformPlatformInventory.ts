import { VisualizationPlatformManifestPlatform } from "./visualizationPlatformManifest.ts";
import { VisualizationPlatformPlatformCapabilities } from "./visualizationPlatformPlatformCapabilities.ts";
import { VisualizationPlatformPlatformCompatibility } from "./visualizationPlatformPlatformCompatibility.ts";
import { VisualizationPlatformPlatformGuarantees } from "./visualizationPlatformPlatformGuarantees.ts";

const manifest = VisualizationPlatformManifestPlatform;

export const VisualizationPlatformPlatformComposition = Object.freeze([
  ...manifest.composition,
  Object.freeze({
    id: "EVE-8:6/Composition/Platform",
    phase: "Platform",
    canonicalReference: "EVE-8:6/VisualizationPlatformPlatform",
    canonicalSource: "EVE-8:6/VisualizationPlatformPlatform",
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

export const VisualizationPlatformPlatformInventory = Object.freeze({
  phaseComposition: VisualizationPlatformPlatformComposition,
  capabilities: VisualizationPlatformPlatformCapabilities,
  guarantees: VisualizationPlatformPlatformGuarantees,
  compatibility: VisualizationPlatformPlatformCompatibility,
  manifestInventory: manifest.inventory,
  manifestComposition: manifest.composition,
  manifestGuarantees: manifest.guarantees,
  manifestCompatibility: manifest.compatibility,
  manifestReadiness: manifest.readiness,
  manifestReadinessDeclarations: manifest.readinessDeclarations,
  manifestMetadata: manifest.metadata,
  validationInventory: manifest.inventory.validationInventory,
  canonicalReferences: VisualizationPlatformPlatformComposition,
  dependencyMetadata: manifest.metadata.dependency,
  publicPlatformSurface: PublicPlatformSurface,
  counts: Object.freeze({
    phaseCount: VisualizationPlatformPlatformComposition.length,
    capabilityCount: VisualizationPlatformPlatformCapabilities.length,
    guaranteeCount: VisualizationPlatformPlatformGuarantees.length,
    compatibilityCount: VisualizationPlatformPlatformCompatibility.length,
    manifestInventoryCount: Object.keys(manifest.inventory.counts).length,
    validationInventoryCount:
      Object.keys(manifest.inventory.validationInventory.counts).length,
    canonicalReferenceCount:
      VisualizationPlatformPlatformComposition.length,
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
