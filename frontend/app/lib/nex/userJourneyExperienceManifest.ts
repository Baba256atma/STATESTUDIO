/**
 * NEX-4:5 — User Journey & Experience Manifest.
 */

import { UserJourneyExperienceManifestComposition } from "./userJourneyExperienceManifestComposition.ts";
import { UserJourneyExperienceManifestGuarantees } from "./userJourneyExperienceManifestGuarantees.ts";
import { UserJourneyExperienceManifestIdentity } from "./userJourneyExperienceManifestIdentity.ts";
import { UserJourneyExperienceManifestInventories } from "./userJourneyExperienceManifestInventories.ts";
import { UserJourneyExperienceManifestInventory } from "./userJourneyExperienceManifestInventory.ts";
import { UserJourneyExperienceManifestPublicApiRegistry as PublicApiRegistry } from "./userJourneyExperienceManifestPublicApi.ts";
import { UserJourneyExperienceValidation } from "./userJourneyExperienceValidation.ts";

export const UserJourneyExperienceManifestId = "NEX-4:5/UserJourneyExperienceManifest" as const;
export const UserJourneyExperienceManifestName = "Nexora User Journey & Experience Manifest" as const;
export const UserJourneyExperienceManifestNamespace = "nexora.nex.user-journey-experience.manifest" as const;
export const UserJourneyExperienceManifestVersion = "1.0.0" as const;
export const UserJourneyExperienceManifestStatus = "Manifest" as const;
export const UserJourneyExperienceManifestReadiness = "ReadyForPlatform" as const;
export const UserJourneyExperienceManifestPublicApiRegistry = PublicApiRegistry;

export const UserJourneyExperienceManifest = Object.freeze({
  identity: UserJourneyExperienceManifestIdentity,
  dependency: Object.freeze({ id: "NEX-4:5/Dependency/NEX44Validation", upstreamId: UserJourneyExperienceValidation.identity.id, upstreamPhase: "NEX-4:4", validationOnly: true, otherDependenciesAllowed: false, runtimeDependency: false, metadataOnly: true, immutable: true } as const),
  inventory: UserJourneyExperienceManifestInventory,
  inventories: UserJourneyExperienceManifestInventories,
  composition: UserJourneyExperienceManifestComposition,
  guarantees: UserJourneyExperienceManifestGuarantees,
  compatibility: UserJourneyExperienceManifestComposition.compatibility,
  dependencies: UserJourneyExperienceManifestComposition.dependencies,
  lifecycle: UserJourneyExperienceManifestComposition.lifecycle,
  readinessDeclaration: UserJourneyExperienceManifestComposition.readiness,
  publication: UserJourneyExperienceManifestComposition.publication,
  metadata: UserJourneyExperienceManifestComposition.metadata,
  publicApiRegistry: UserJourneyExperienceManifestPublicApiRegistry,
  platformSeedMetadata: Object.freeze({
    manifests: Object.freeze([UserJourneyExperienceManifestIdentity]),
    capabilitySubjects: Object.freeze(["UserJourney", "Experience", "Persona", "JourneyStage", "Touchpoint", "WorkspaceExperience", "TimelineExperience", "ExperienceGovernance"]),
    compatibilityDeclarations: Object.freeze(["BackwardCompatible", "ForwardExtendable", "MetadataCompatible", "VersionCompatible"]),
    metadataOnly: true,
    immutable: true,
  } as const),
  status: UserJourneyExperienceManifestStatus,
  readiness: UserJourneyExperienceManifestReadiness,
  readyForPlatform: true,
  nextPhase: "NEX-4:6 — User Journey & Experience Platform",
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
