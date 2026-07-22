import { SceneRenderingManifest } from "./sceneRenderingManifest.ts";
import { SceneRenderingPlatformCapabilities } from "./sceneRenderingPlatformCapabilities.ts";
import { SceneRenderingPlatformCompatibility } from "./sceneRenderingPlatformCompatibility.ts";
import { SceneRenderingPlatformGuarantees } from "./sceneRenderingPlatformGuarantees.ts";

export const SceneRenderingPlatformInventory = Object.freeze({
  manifestInventory: SceneRenderingManifest.inventory,
  validationInventory: SceneRenderingManifest.inventory.validationInventory,
  upstreamCanonicalReferences: SceneRenderingManifest.inventory.canonicalReferences,
  manifestComposition: SceneRenderingManifest.metadata.phaseComposition,
  manifestGuarantees: SceneRenderingManifest.guarantees,
  manifestCompatibility: SceneRenderingManifest.compatibility,
  capabilities: SceneRenderingPlatformCapabilities,
  guarantees: SceneRenderingPlatformGuarantees,
  compatibility: SceneRenderingPlatformCompatibility,
  counts: Object.freeze({
    manifestPhaseCount: SceneRenderingManifest.metadata.phaseComposition.length,
    capabilityCount: SceneRenderingPlatformCapabilities.length,
    guaranteeCount: SceneRenderingPlatformGuarantees.length,
    compatibilityCount: SceneRenderingPlatformCompatibility.length,
    upstreamReferenceCount: SceneRenderingManifest.inventory.canonicalReferences.length,
  }),
  valuesForwardedFromManifest: true,
  manifestCollectionsPreservedByReference: true,
  recalculatesUpstreamInventories: false,
  hardcodesInventoryTotals: false,
  duplicatesManifestMetadata: false,
  reconstructsUpstreamCollections: false,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);
