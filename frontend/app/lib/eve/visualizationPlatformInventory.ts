import { VisualizationManifest } from "./visualizationManifest.ts";

/** Platform forwards every inventory exclusively from Manifest. */
export const VisualizationPlatformInventory = Object.freeze({
  foundationInventory: VisualizationManifest.inventory.foundationInventory,
  registryInventory: VisualizationManifest.inventory.registryInventory,
  modelInventory: VisualizationManifest.inventory.modelInventory,
  validationInventory: VisualizationManifest.inventory.validationInventory,
  manifestInventory: VisualizationManifest.inventory,
  inventoryCountReferences: VisualizationManifest.inventory.inventoryCountReferences,
  canonicalReferences: VisualizationManifest.inventory.canonicalReferences,
  valuesForwardedFromManifest: true,
  recalculatesInventories: false,
  hardcodesInventoryCounts: false,
  duplicatesMetadata: false,
  reconstructsCollections: false,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

