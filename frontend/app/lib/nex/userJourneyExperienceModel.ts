/**
 * NEX-4:3 — User Journey & Experience Model.
 */

import { UserJourneyExperienceModelIdentity } from "./userJourneyExperienceModelIdentity.ts";
import { UserJourneyExperienceModelInventory } from "./userJourneyExperienceModelInventory.ts";
import { UserJourneyExperienceModelPublicApiRegistry as PublicApiRegistry } from "./userJourneyExperienceModelPublicApi.ts";
import { UserJourneyExperienceModelRelationships } from "./userJourneyExperienceModelRelationships.ts";
import { UserJourneyExperienceModels } from "./userJourneyExperienceModels.ts";
import { UserJourneyExperienceModelValidationMetadata } from "./userJourneyExperienceModelValidationMetadata.ts";
import { UserJourneyExperienceRegistry } from "./userJourneyExperienceRegistry.ts";

export const UserJourneyExperienceModelId = "NEX-4:3/UserJourneyExperienceModel" as const;
export const UserJourneyExperienceModelName = "Nexora User Journey & Experience Model" as const;
export const UserJourneyExperienceModelNamespace = "nexora.nex.user-journey-experience.model" as const;
export const UserJourneyExperienceModelVersion = "1.0.0" as const;
export const UserJourneyExperienceModelStatus = "Model" as const;
export const UserJourneyExperienceModelReadiness = "ReadyForValidation" as const;
export const UserJourneyExperienceModelPublicApiRegistry = PublicApiRegistry;

export const UserJourneyExperienceModel = Object.freeze({
  identity: UserJourneyExperienceModelIdentity,
  dependency: Object.freeze({ id: "NEX-4:3/Dependency/NEX42Registry", upstreamId: UserJourneyExperienceRegistry.identity.id, upstreamPhase: "NEX-4:2", registryOnly: true, otherDependenciesAllowed: false, metadataOnly: true, immutable: true } as const),
  models: UserJourneyExperienceModels,
  relationships: UserJourneyExperienceModelRelationships,
  validationMetadata: UserJourneyExperienceModelValidationMetadata,
  inventory: UserJourneyExperienceModelInventory,
  publicApiRegistry: UserJourneyExperienceModelPublicApiRegistry,
  compatibility: Object.freeze({ backwardCompatible: true, forwardExtendable: true, metadataOnly: true } as const),
  status: UserJourneyExperienceModelStatus,
  readiness: UserJourneyExperienceModelReadiness,
  readyForValidation: true,
  nextPhase: "NEX-4:4 — User Journey & Experience Validation",
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
