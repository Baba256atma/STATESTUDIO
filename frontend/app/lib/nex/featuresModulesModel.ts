/**
 * NEX-3:3 — Features & Modules Model.
 */

import { FeaturesModulesModelIdentity } from "./featuresModulesModelIdentity.ts";
import { FeaturesModulesModelInventory } from "./featuresModulesModelInventory.ts";
import { FeaturesModulesModelPublicApiRegistry as PublicApiRegistry } from "./featuresModulesModelPublicApi.ts";
import { FeaturesModulesModelRelationships } from "./featuresModulesModelRelationships.ts";
import { FeaturesModulesModels } from "./featuresModulesModels.ts";
import { FeaturesModulesModelValidationMetadata } from "./featuresModulesModelValidationMetadata.ts";
import { FeaturesModulesRegistry } from "./featuresModulesRegistry.ts";

export const FeaturesModulesModelId = "NEX-3:3/FeaturesModulesModel" as const;
export const FeaturesModulesModelName = "Nexora Features & Modules Model" as const;
export const FeaturesModulesModelNamespace = "nexora.nex.features-modules.model" as const;
export const FeaturesModulesModelVersion = "1.0.0" as const;
export const FeaturesModulesModelStatus = "Model" as const;
export const FeaturesModulesModelReadiness = "ReadyForValidation" as const;
export const FeaturesModulesModelPublicApiRegistry = PublicApiRegistry;

export const FeaturesModulesModel = Object.freeze({
  identity: FeaturesModulesModelIdentity,
  dependency: Object.freeze({
    id: "NEX-3:3/Dependency/NEX32Registry",
    upstreamId: FeaturesModulesRegistry.identity.id,
    upstreamPhase: "NEX-3:2",
    registryOnly: true,
    otherDependenciesAllowed: false,
    metadataOnly: true,
    immutable: true,
  } as const),
  models: FeaturesModulesModels,
  relationships: FeaturesModulesModelRelationships,
  validationMetadata: FeaturesModulesModelValidationMetadata,
  inventory: FeaturesModulesModelInventory,
  publicApiRegistry: FeaturesModulesModelPublicApiRegistry,
  compatibility: Object.freeze({
    backwardCompatible: true,
    forwardExtendable: true,
    metadataOnly: true,
  } as const),
  status: FeaturesModulesModelStatus,
  readiness: FeaturesModulesModelReadiness,
  readyForValidation: true,
  nextPhase: "NEX-3:4 — Features & Modules Validation",
  metadataOnly: true,
  immutable: true,
  runtimeExecution: false,
  featureExecution: false,
  moduleLoading: false,
  featureLoading: false,
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
