/**
 * NEX-3:2 — Features & Modules Registry.
 */

import { FeaturesModulesFoundation } from "./featuresModulesFoundation.ts";
import { FeaturesModulesRegistryIdentity } from "./featuresModulesRegistryIdentity.ts";
import { FeaturesModulesRegistryInventory } from "./featuresModulesRegistryInventory.ts";
import { FeaturesModulesRegistryPublicApiRegistry as PublicApiRegistry } from "./featuresModulesRegistryPublicApi.ts";
import { FeaturesModulesRegistryRelationships } from "./featuresModulesRegistryRelationships.ts";
import { FeaturesModulesRegistryValidationMetadata } from "./featuresModulesRegistryValidationMetadata.ts";
import { FeaturesModulesRegistryCollections } from "./featuresModulesRegistries.ts";

export const FeaturesModulesRegistryId = "NEX-3:2/FeaturesModulesRegistry" as const;
export const FeaturesModulesRegistryName = "Nexora Features & Modules Registry" as const;
export const FeaturesModulesRegistryNamespace = "nexora.nex.features-modules.registry" as const;
export const FeaturesModulesRegistryVersion = "1.0.0" as const;
export const FeaturesModulesRegistryStatus = "Registry" as const;
export const FeaturesModulesRegistryReadiness = "ReadyForModel" as const;
export const FeaturesModulesRegistryPublicApiRegistry = PublicApiRegistry;

export const FeaturesModulesRegistry = Object.freeze({
  identity: FeaturesModulesRegistryIdentity,
  dependency: Object.freeze({
    id: "NEX-3:2/Dependency/NEX31Foundation",
    upstreamId: FeaturesModulesFoundation.identity.id,
    upstreamPhase: "NEX-3:1",
    foundationOnly: true,
    otherDependenciesAllowed: false,
    metadataOnly: true,
    immutable: true,
  } as const),
  registries: FeaturesModulesRegistryCollections,
  relationships: FeaturesModulesRegistryRelationships,
  validationMetadata: FeaturesModulesRegistryValidationMetadata,
  inventory: FeaturesModulesRegistryInventory,
  publicApiRegistry: FeaturesModulesRegistryPublicApiRegistry,
  compatibility: Object.freeze({
    backwardCompatible: true,
    forwardExtendable: true,
    metadataOnly: true,
  } as const),
  status: FeaturesModulesRegistryStatus,
  readiness: FeaturesModulesRegistryReadiness,
  readyForModel: true,
  nextPhase: "NEX-3:3 — Features & Modules Model",
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
