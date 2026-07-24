/**
 * NEX-2:2 — Registry inventory metadata.
 */

import { ProductRoadmapRegistryRelationships } from "./productRoadmapRegistryRelationships.ts";

export const ProductRoadmapRegistryInventory = Object.freeze({
  id: "NEX-2:2/RegistryInventory",
  registryCount: 16,
  registryCategoryCount: 16,
  registryRelationshipCount: ProductRoadmapRegistryRelationships.length,
  registryGroupCount: 16,
  registryVersion: "1.0.0",
  metadataOnly: true,
  immutable: true,
} as const);
