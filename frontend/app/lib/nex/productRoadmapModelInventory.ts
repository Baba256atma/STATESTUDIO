/**
 * NEX-2:3 — Roadmap Model inventory metadata.
 */

import { ProductRoadmapModelRelationships } from "./productRoadmapModelRelationships.ts";
import { ProductRoadmapModels } from "./productRoadmapModels.ts";

export const ProductRoadmapModelInventory = Object.freeze({
  id: "NEX-2:3/ModelInventory",
  modelCount: ProductRoadmapModels.length,
  modelCategoryCount: 16,
  modelRelationshipCount: ProductRoadmapModelRelationships.length,
  modelGroupCount: 4,
  modelVersion: "1.0.0",
  groups: Object.freeze(["Direction", "Planning", "Outcomes", "Governance"]),
  metadataOnly: true,
  immutable: true,
} as const);
