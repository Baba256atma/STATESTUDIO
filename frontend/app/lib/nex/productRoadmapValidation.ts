/**
 * NEX-2:4 — Product Roadmap Validation.
 *
 * Immutable validation declarations only. No validation executes.
 */

import { ProductRoadmapModel } from "./productRoadmapModel.ts";
import { ProductRoadmapValidationCategories } from "./productRoadmapValidationCategories.ts";
import { ProductRoadmapValidationGroups } from "./productRoadmapValidationGroups.ts";
import { ProductRoadmapValidationIdentity } from "./productRoadmapValidationIdentity.ts";
import {
  ProductRoadmapValidationInventory,
  ProductRoadmapValidationPublicApiRegistry as PublicApiRegistry,
} from "./productRoadmapValidationInventory.ts";
import { ProductRoadmapValidationOutcomes } from "./productRoadmapValidationOutcomes.ts";
import { ProductRoadmapValidationRules } from "./productRoadmapValidationRules.ts";

export const ProductRoadmapValidationId = "NEX-2:4/ProductRoadmapValidation" as const;
export const ProductRoadmapValidationName = "Nexora Product Roadmap Validation" as const;
export const ProductRoadmapValidationNamespace = "nexora.nex.product-roadmap.validation" as const;
export const ProductRoadmapValidationVersion = "1.0.0" as const;
export const ProductRoadmapValidationStatus = "Validation" as const;
export const ProductRoadmapValidationReadiness = "ReadyForManifest" as const;
export const ProductRoadmapValidationPublicApiRegistry = PublicApiRegistry;

export const ProductRoadmapValidation = Object.freeze({
  identity: ProductRoadmapValidationIdentity,
  dependency: Object.freeze({
    id: "NEX-2:4/Dependency/NEX23Model",
    upstreamId: ProductRoadmapModel.identity.id,
    upstreamPhase: "NEX-2:3",
    modelOnly: true,
    otherDependenciesAllowed: false,
    metadataOnly: true,
    immutable: true,
  } as const),
  categories: ProductRoadmapValidationCategories,
  rules: ProductRoadmapValidationRules,
  outcomes: ProductRoadmapValidationOutcomes,
  groups: ProductRoadmapValidationGroups,
  inventory: ProductRoadmapValidationInventory,
  validatedInventory: Object.freeze({
    registryCount: ProductRoadmapModel.models.length,
    modelCount: ProductRoadmapModel.models.length,
    relationshipCount: ProductRoadmapModel.relationships.length,
    publicApiCount: ProductRoadmapModel.publicApiRegistry.length,
    sourceModelId: ProductRoadmapModel.identity.id,
    metadataOnly: true,
    immutable: true,
  } as const),
  publicApiRegistry: ProductRoadmapValidationPublicApiRegistry,
  compatibility: Object.freeze({
    backwardCompatible: true,
    forwardExtendable: true,
    metadataOnly: true,
  } as const),
  status: ProductRoadmapValidationStatus,
  readiness: ProductRoadmapValidationReadiness,
  readyForManifest: true,
  nextPhase: "NEX-2:5 — Product Roadmap Manifest",
  metadataOnly: true,
  immutable: true,
  executesValidation: false,
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
  artificialIntelligenceImplementation: false,
  orchestration: false,
  integrations: false,
} as const);
