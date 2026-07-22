import { SceneRenderingPlatform } from "./sceneRenderingPlatform.ts";
import { SceneRenderingCertificationCompatibility } from "./sceneRenderingCertificationCompatibility.ts";
import { SceneRenderingCertificationCriteria } from "./sceneRenderingCertificationCriteria.ts";
import { SceneRenderingCertificationGates } from "./sceneRenderingCertificationGates.ts";

export const SceneRenderingCertificationInventory = Object.freeze({
  criteriaCount: SceneRenderingCertificationCriteria.length,
  gateCount: SceneRenderingCertificationGates.length,
  compatibilityVerificationCount: SceneRenderingCertificationCompatibility.length,
  platformInventory: SceneRenderingPlatform.inventory,
  platformCapabilities: SceneRenderingPlatform.capabilities,
  platformGuarantees: SceneRenderingPlatform.guarantees,
  platformCompatibility: SceneRenderingPlatform.compatibility,
  platformComposition: SceneRenderingPlatform.metadata.composition,
  canonicalReferences: SceneRenderingPlatform.inventory.upstreamCanonicalReferences,
  countsDerivedFromCanonicalCollections: true,
  platformCollectionsPreservedByReference: true,
  recalculatesPlatformInventory: false,
  hardcodesInventoryTotals: false,
  duplicatesPlatformMetadata: false,
  reconstructsUpstreamCollections: false,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);
