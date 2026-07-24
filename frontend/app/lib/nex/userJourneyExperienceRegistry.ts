/**
 * NEX-4:2 — User Journey & Experience Registry.
 */

import { UserJourneyExperienceFoundation } from "./userJourneyExperienceFoundation.ts";
import { UserJourneyExperienceRegistryCollections } from "./userJourneyExperienceRegistries.ts";
import { UserJourneyExperienceRegistryIdentity } from "./userJourneyExperienceRegistryIdentity.ts";
import { UserJourneyExperienceRegistryInventory } from "./userJourneyExperienceRegistryInventory.ts";
import { UserJourneyExperienceRegistryPublicApiRegistry as PublicApiRegistry } from "./userJourneyExperienceRegistryPublicApi.ts";
import { UserJourneyExperienceRegistryRelationships } from "./userJourneyExperienceRegistryRelationships.ts";
import { UserJourneyExperienceRegistryValidationMetadata } from "./userJourneyExperienceRegistryValidationMetadata.ts";

export const UserJourneyExperienceRegistryId = "NEX-4:2/UserJourneyExperienceRegistry" as const;
export const UserJourneyExperienceRegistryName = "Nexora User Journey & Experience Registry" as const;
export const UserJourneyExperienceRegistryNamespace = "nexora.nex.user-journey-experience.registry" as const;
export const UserJourneyExperienceRegistryVersion = "1.0.0" as const;
export const UserJourneyExperienceRegistryStatus = "Registry" as const;
export const UserJourneyExperienceRegistryReadiness = "ReadyForModel" as const;
export const UserJourneyExperienceRegistryPublicApiRegistry = PublicApiRegistry;

export const UserJourneyExperienceRegistry = Object.freeze({
  identity: UserJourneyExperienceRegistryIdentity,
  dependency: Object.freeze({ id: "NEX-4:2/Dependency/NEX41Foundation", upstreamId: UserJourneyExperienceFoundation.identity.id, upstreamPhase: "NEX-4:1", foundationOnly: true, otherDependenciesAllowed: false, metadataOnly: true, immutable: true } as const),
  registries: UserJourneyExperienceRegistryCollections,
  relationships: UserJourneyExperienceRegistryRelationships,
  validationMetadata: UserJourneyExperienceRegistryValidationMetadata,
  inventory: UserJourneyExperienceRegistryInventory,
  publicApiRegistry: UserJourneyExperienceRegistryPublicApiRegistry,
  compatibility: Object.freeze({ backwardCompatible: true, forwardExtendable: true, metadataOnly: true } as const),
  status: UserJourneyExperienceRegistryStatus,
  readiness: UserJourneyExperienceRegistryReadiness,
  readyForModel: true,
  nextPhase: "NEX-4:3 — User Journey & Experience Model",
  metadataOnly: true,
  immutable: true,
  runtimeExecution: false,
  uiImplementation: false,
  uxBehavior: false,
  navigationLogic: false,
  workflows: false,
  businessLogic: false,
  persistence: false,
  networking: false,
  rendering: false,
  apiImplementation: false,
  services: false,
  executableValidation: false,
  artificialIntelligenceImplementation: false,
  orchestration: false,
  integrations: false,
} as const);
