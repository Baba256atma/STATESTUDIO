/**
 * NEX-2:2 — Product Roadmap Registry.
 *
 * Canonical immutable roadmap reference registries. Ready for Model.
 */

import { ProductRoadmapFoundation } from "./productRoadmapFoundation.ts";
import { ProductRoadmapRegistryIdentity } from "./productRoadmapRegistryIdentity.ts";
import { ProductRoadmapRegistryInventory } from "./productRoadmapRegistryInventory.ts";
import { ProductRoadmapRegistryPublicApiRegistry as PublicApiRegistry } from "./productRoadmapRegistryPublicApi.ts";
import { ProductRoadmapRegistryRelationships } from "./productRoadmapRegistryRelationships.ts";
import { ProductRoadmapRegistryValidationMetadata } from "./productRoadmapRegistryValidationMetadata.ts";
import { ProductRoadmapRegistryCollections } from "./productRoadmapRegistries.ts";

export const ProductRoadmapRegistryId = "NEX-2:2/ProductRoadmapRegistry" as const;
export const ProductRoadmapRegistryName = "Nexora Product Roadmap Registry" as const;
export const ProductRoadmapRegistryNamespace = "nexora.nex.product-roadmap.registry" as const;
export const ProductRoadmapRegistryVersion = "1.0.0" as const;
export const ProductRoadmapRegistryStatus = "Registry" as const;
export const ProductRoadmapRegistryReadiness = "ReadyForModel" as const;
export const ProductRoadmapRegistryPublicApiRegistry = PublicApiRegistry;

export const ProductRoadmapRegistry = Object.freeze({
  identity: ProductRoadmapRegistryIdentity,
  dependency: Object.freeze({
    id: "NEX-2:2/Dependency/NEX21Foundation",
    upstreamId: ProductRoadmapFoundation.identity.id,
    upstreamPhase: "NEX-2:1",
    foundationOnly: true,
    otherDependenciesAllowed: false,
    metadataOnly: true,
    immutable: true,
  } as const),
  registries: ProductRoadmapRegistryCollections,
  relationships: ProductRoadmapRegistryRelationships,
  validationMetadata: ProductRoadmapRegistryValidationMetadata,
  inventory: ProductRoadmapRegistryInventory,
  publicApiRegistry: ProductRoadmapRegistryPublicApiRegistry,
  compatibility: Object.freeze({
    backwardCompatible: true,
    forwardExtendable: true,
    metadataOnly: true,
  } as const),
  status: ProductRoadmapRegistryStatus,
  readiness: ProductRoadmapRegistryReadiness,
  readyForModel: true,
  nextPhase: "NEX-2:3 — Product Roadmap Model",
  metadataOnly: true,
  immutable: true,
  runtimeExecution: false,
  roadmapExecution: false,
  scheduling: false,
  projectManagementExecution: false,
  businessLogic: false,
  persistence: false,
  networking: false,
  rendering: false,
  ui: false,
  apiImplementation: false,
  services: false,
  executableValidation: false,
  artificialIntelligenceImplementation: false,
  orchestration: false,
  integrations: false,
} as const);
