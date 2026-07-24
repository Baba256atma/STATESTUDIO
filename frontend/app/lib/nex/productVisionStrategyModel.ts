/**
 * NEX-1:3 — Vision & Product Strategy Model.
 *
 * Canonical typed structural metadata. Ready for Validation.
 *
 * Public model exports (exactly eight):
 * ProductVisionStrategyModelId
 * ProductVisionStrategyModelName
 * ProductVisionStrategyModelNamespace
 * ProductVisionStrategyModelVersion
 * ProductVisionStrategyModelStatus
 * ProductVisionStrategyModelReadiness
 * ProductVisionStrategyModelPublicApiRegistry
 * ProductVisionStrategyModel
 */

import { ProductVisionStrategyAudienceModels } from "./productVisionStrategyAudienceModels.ts";
import { ProductVisionStrategyBoundaryModels } from "./productVisionStrategyBoundaryModels.ts";
import { ProductVisionStrategyEvolutionModels } from "./productVisionStrategyEvolutionModels.ts";
import { ProductVisionStrategyIdentityModels } from "./productVisionStrategyIdentityModels.ts";
import { ProductVisionStrategyOutcomeModels } from "./productVisionStrategyOutcomeModels.ts";
import {
  ProductVisionStrategyModelRelationships,
  ProductVisionStrategyModelValidationMetadata,
} from "./productVisionStrategyRelationshipModels.ts";
import { ProductVisionStrategyRegistry } from "./productVisionStrategyRegistry.ts";

export const ProductVisionStrategyModelId = "NEX-1:3/ProductVisionStrategyModel" as const;
export const ProductVisionStrategyModelName = "Nexora Vision & Product Strategy Model" as const;
export const ProductVisionStrategyModelNamespace = "nexora.nex.product-vision-strategy.model" as const;
export const ProductVisionStrategyModelVersion = "1.0.0" as const;
export const ProductVisionStrategyModelStatus = "Model" as const;
export const ProductVisionStrategyModelReadiness = "ReadyForValidation" as const;

const identity = Object.freeze({
  id: ProductVisionStrategyModelId,
  name: ProductVisionStrategyModelName,
  layer: "NEX",
  phase: "NEX-1:3",
  namespace: ProductVisionStrategyModelNamespace,
  version: ProductVisionStrategyModelVersion,
  status: ProductVisionStrategyModelStatus,
  description: "Canonical typed structural representation of Nexora product vision and strategy metadata.",
  modelVersion: "1.0.0",
  modelOwner: "Nexora Product",
  metadataOnly: true,
  immutable: true,
} as const);

const modelGroups = Object.freeze({
  identity: ProductVisionStrategyIdentityModels,
  outcomes: ProductVisionStrategyOutcomeModels,
  boundaries: ProductVisionStrategyBoundaryModels,
  audiences: ProductVisionStrategyAudienceModels,
  evolution: ProductVisionStrategyEvolutionModels,
} as const);

const inventory = Object.freeze({
  identifier: "NEX-1:3/ModelInventory",
  totalModelCount: 16,
  modelCategories: Object.freeze(["Vision", "Mission", "Principle", "Value", "Goal", "StrategicObjective", "Scope", "Boundary", "TargetUser", "Stakeholder", "SuccessMetric", "Lifecycle", "StrategicTheme", "ProductCapability", "ProductConstraint", "ProductAssumption"]),
  modelRelationships: ProductVisionStrategyModelRelationships,
  modelGroups: Object.freeze(["identity", "outcomes", "boundaries", "audiences", "evolution"]),
  modelVersion: ProductVisionStrategyModelVersion,
  metadataOnly: true,
  immutable: true,
} as const);

export const ProductVisionStrategyModelPublicApiRegistry = Object.freeze([
  Object.freeze({ identifier: "NEX-1:3/PublicModelExport/Id", exportName: "ProductVisionStrategyModelId", artifact: "Identity", metadataOnly: true }),
  Object.freeze({ identifier: "NEX-1:3/PublicModelExport/Name", exportName: "ProductVisionStrategyModelName", artifact: "Identity", metadataOnly: true }),
  Object.freeze({ identifier: "NEX-1:3/PublicModelExport/Namespace", exportName: "ProductVisionStrategyModelNamespace", artifact: "Identity", metadataOnly: true }),
  Object.freeze({ identifier: "NEX-1:3/PublicModelExport/Version", exportName: "ProductVisionStrategyModelVersion", artifact: "Identity", metadataOnly: true }),
  Object.freeze({ identifier: "NEX-1:3/PublicModelExport/Status", exportName: "ProductVisionStrategyModelStatus", artifact: "Identity", metadataOnly: true }),
  Object.freeze({ identifier: "NEX-1:3/PublicModelExport/Readiness", exportName: "ProductVisionStrategyModelReadiness", artifact: "Readiness", metadataOnly: true }),
  Object.freeze({ identifier: "NEX-1:3/PublicModelExport/PublicApiRegistry", exportName: "ProductVisionStrategyModelPublicApiRegistry", artifact: "PublicApiRegistry", metadataOnly: true }),
  Object.freeze({ identifier: "NEX-1:3/PublicModelExport/Model", exportName: "ProductVisionStrategyModel", artifact: "Aggregate", metadataOnly: true }),
] as const);

export const ProductVisionStrategyModel = Object.freeze({
  identity,
  dependency: Object.freeze({
    identifier: "NEX-1:3/Dependency/NEX12Registry",
    upstreamId: ProductVisionStrategyRegistry.identity.id,
    upstreamPhase: "NEX-1:2",
    registryOnly: true,
    otherDependenciesAllowed: false,
    metadataOnly: true,
    immutable: true,
  } as const),
  groups: modelGroups,
  relationships: ProductVisionStrategyModelRelationships,
  validationMetadata: ProductVisionStrategyModelValidationMetadata,
  inventory,
  publicApiRegistry: ProductVisionStrategyModelPublicApiRegistry,
  compatibility: Object.freeze({
    backwardCompatible: true,
    forwardExtendable: true,
    metadataOnly: true,
  } as const),
  status: ProductVisionStrategyModelStatus,
  readiness: ProductVisionStrategyModelReadiness,
  readyForValidation: true,
  nextPhase: "NEX-1:4 — Vision & Product Strategy Validation",
  metadataOnly: true,
  immutable: true,
  runtimeBehavior: false,
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
