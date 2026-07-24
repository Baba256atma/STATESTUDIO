/**
 * NEX-2:5 — Published Registry, Model, Validation, Roadmap, Relationship,
 * and Public API inventory references.
 */

import { ProductRoadmapValidation } from "./productRoadmapValidation.ts";

export const ProductRoadmapManifestInventories = Object.freeze({
  registryInventory: Object.freeze({
    id: "NEX-2:5/Inventory/Registry",
    count: ProductRoadmapValidation.validatedInventory.registryCount,
    source: ProductRoadmapValidation.identity.id,
    metadataOnly: true,
    immutable: true,
  }),
  modelInventory: Object.freeze({
    id: "NEX-2:5/Inventory/Model",
    count: ProductRoadmapValidation.validatedInventory.modelCount,
    source: ProductRoadmapValidation.validatedInventory.sourceModelId,
    metadataOnly: true,
    immutable: true,
  }),
  validationInventory: ProductRoadmapValidation.inventory,
  roadmapInventory: Object.freeze({
    id: "NEX-2:5/Inventory/Roadmap",
    domainCount: ProductRoadmapValidation.validatedInventory.modelCount,
    source: ProductRoadmapValidation.identity.id,
    metadataOnly: true,
    immutable: true,
  }),
  relationshipInventory: Object.freeze({
    id: "NEX-2:5/Inventory/Relationship",
    count: ProductRoadmapValidation.validatedInventory.relationshipCount,
    source: ProductRoadmapValidation.identity.id,
    metadataOnly: true,
    immutable: true,
  }),
  publicApiInventory: Object.freeze({
    id: "NEX-2:5/Inventory/PublicApi",
    count: ProductRoadmapValidation.validatedInventory.publicApiCount,
    source: ProductRoadmapValidation.identity.id,
    metadataOnly: true,
    immutable: true,
  }),
} as const);
