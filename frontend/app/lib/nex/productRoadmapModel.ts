/**
 * NEX-2:3 — Product Roadmap Model.
 *
 * Canonical immutable structural metadata. Ready for Validation.
 */

import { ProductRoadmapModelIdentity } from "./productRoadmapModelIdentity.ts";
import { ProductRoadmapModelInventory } from "./productRoadmapModelInventory.ts";
import { ProductRoadmapModelPublicApiRegistry as PublicApiRegistry } from "./productRoadmapModelPublicApi.ts";
import { ProductRoadmapModelRelationships } from "./productRoadmapModelRelationships.ts";
import { ProductRoadmapModelValidationMetadata } from "./productRoadmapModelValidationMetadata.ts";
import { ProductRoadmapModels } from "./productRoadmapModels.ts";
import { ProductRoadmapRegistry } from "./productRoadmapRegistry.ts";

export const ProductRoadmapModelId = "NEX-2:3/ProductRoadmapModel" as const;
export const ProductRoadmapModelName = "Nexora Product Roadmap Model" as const;
export const ProductRoadmapModelNamespace = "nexora.nex.product-roadmap.model" as const;
export const ProductRoadmapModelVersion = "1.0.0" as const;
export const ProductRoadmapModelStatus = "Model" as const;
export const ProductRoadmapModelReadiness = "ReadyForValidation" as const;
export const ProductRoadmapModelPublicApiRegistry = PublicApiRegistry;

export const ProductRoadmapModel = Object.freeze({
  identity: ProductRoadmapModelIdentity,
  dependency: Object.freeze({
    id: "NEX-2:3/Dependency/NEX22Registry",
    upstreamId: ProductRoadmapRegistry.identity.id,
    upstreamPhase: "NEX-2:2",
    registryOnly: true,
    otherDependenciesAllowed: false,
    metadataOnly: true,
    immutable: true,
  } as const),
  models: ProductRoadmapModels,
  relationships: ProductRoadmapModelRelationships,
  validationMetadata: ProductRoadmapModelValidationMetadata,
  inventory: ProductRoadmapModelInventory,
  publicApiRegistry: ProductRoadmapModelPublicApiRegistry,
  compatibility: Object.freeze({
    backwardCompatible: true,
    forwardExtendable: true,
    metadataOnly: true,
  } as const),
  status: ProductRoadmapModelStatus,
  readiness: ProductRoadmapModelReadiness,
  readyForValidation: true,
  nextPhase: "NEX-2:4 — Product Roadmap Validation",
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
