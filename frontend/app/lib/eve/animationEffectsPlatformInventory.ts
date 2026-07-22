import { AnimationEffectsManifestPlatform } from "./animationEffectsManifest.ts";
import { AnimationEffectsPlatformCapabilities } from "./animationEffectsPlatformCapabilities.ts";
import { AnimationEffectsPlatformCompatibility } from "./animationEffectsPlatformCompatibility.ts";
import { AnimationEffectsPlatformGuarantees } from "./animationEffectsPlatformGuarantees.ts";

const manifest = AnimationEffectsManifestPlatform;

export const AnimationEffectsPlatformComposition = Object.freeze([
  ...manifest.composition,
  Object.freeze({
    id: "EVE-7:6/Composition/Platform",
    phase: "Platform",
    canonicalReference: "EVE-7:6/AnimationEffectsPlatform",
    canonicalSource: "EVE-7:6/AnimationEffectsPlatform",
    preservedByReference: true,
    deterministicOrder: manifest.composition.length + 1,
    metadataOnly: true,
    immutable: true,
  }),
]);

const PublicPlatformSurface = Object.freeze([
  "Canonical Platform", "Platform identity metadata", "Platform metadata",
  "Platform inventory metadata", "Platform summary accessor",
  "Platform count accessor", "Platform readiness metadata",
  "Platform release metadata accessor",
] as const);

export const AnimationEffectsPlatformInventory = Object.freeze({
  phaseComposition: AnimationEffectsPlatformComposition,
  capabilities: AnimationEffectsPlatformCapabilities,
  guarantees: AnimationEffectsPlatformGuarantees,
  compatibility: AnimationEffectsPlatformCompatibility,
  manifestInventory: manifest.inventory,
  manifestComposition: manifest.composition,
  manifestGuarantees: manifest.guarantees,
  manifestCompatibility: manifest.compatibility,
  manifestReadiness: manifest.readiness,
  manifestReadinessDeclarations: manifest.readinessDeclarations,
  manifestMetadata: manifest.metadata,
  validationInventory: manifest.inventory.validationInventory,
  canonicalReferences: AnimationEffectsPlatformComposition,
  dependencyMetadata: manifest.metadata.dependency,
  publicPlatformSurface: PublicPlatformSurface,
  counts: Object.freeze({
    phaseCount: AnimationEffectsPlatformComposition.length,
    capabilityCount: AnimationEffectsPlatformCapabilities.length,
    guaranteeCount: AnimationEffectsPlatformGuarantees.length,
    compatibilityCount: AnimationEffectsPlatformCompatibility.length,
    manifestInventoryCount: Object.keys(manifest.inventory.counts).length,
    validationInventoryCount:
      Object.keys(manifest.inventory.validationInventory.counts).length,
    canonicalReferenceCount: AnimationEffectsPlatformComposition.length,
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
