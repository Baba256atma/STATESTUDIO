/**
 * NEX-2:6 — Platform inventory derived exclusively from Manifest metadata.
 */

import { ProductRoadmapManifest } from "./productRoadmapManifest.ts";

export const ProductRoadmapPlatformInventory = Object.freeze({
  id: "NEX-2:6/PlatformInventory",
  manifestCount:
    ProductRoadmapManifest.platformSeedMetadata.manifests.length,
  registryCount:
    ProductRoadmapManifest.inventory.registryCount,
  modelCount:
    ProductRoadmapManifest.inventory.modelCount,
  validationCategoryCount:
    ProductRoadmapManifest.inventory.validationCategoryCount,
  validationRuleCount:
    ProductRoadmapManifest.inventory.validationRuleCount,
  platformCapabilityCount:
    ProductRoadmapManifest.platformSeedMetadata.capabilitySubjects.length,
  platformGuaranteeCount:
    ProductRoadmapManifest.guarantees.length,
  platformCompatibilityCount:
    ProductRoadmapManifest.platformSeedMetadata.compatibilityDeclarations.length,
  publicApiCount:
    ProductRoadmapManifest.publicApiRegistry.length,
  platformEntryCount:
    ProductRoadmapManifest.composition.sections.length,
  sourceManifestId: ProductRoadmapManifest.identity.id,
  upstreamDerived: true,
  hardcodedInventoryValues: false,
  metadataOnly: true,
  immutable: true,
} as const);
