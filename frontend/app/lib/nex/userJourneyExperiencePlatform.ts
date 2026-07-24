/**
 * NEX-4:6 — User Journey & Experience Platform.
 */

import { UserJourneyExperienceManifest } from "./userJourneyExperienceManifest.ts";
import { UserJourneyExperiencePlatformCapabilities } from "./userJourneyExperiencePlatformCapabilities.ts";
import { UserJourneyExperiencePlatformComposition } from "./userJourneyExperiencePlatformComposition.ts";
import { UserJourneyExperiencePlatformGuarantees } from "./userJourneyExperiencePlatformGuarantees.ts";
import { UserJourneyExperiencePlatformIdentity } from "./userJourneyExperiencePlatformIdentity.ts";
import { UserJourneyExperiencePlatformInventory } from "./userJourneyExperiencePlatformInventory.ts";
import { UserJourneyExperiencePlatformPublicApiRegistry as PublicApiRegistry } from "./userJourneyExperiencePlatformPublicApi.ts";

export const UserJourneyExperiencePlatformId = "NEX-4:6/UserJourneyExperiencePlatform" as const;
export const UserJourneyExperiencePlatformName = "Nexora User Journey & Experience Platform" as const;
export const UserJourneyExperiencePlatformNamespace = "nexora.nex.user-journey-experience.platform" as const;
export const UserJourneyExperiencePlatformVersion = "1.0.0" as const;
export const UserJourneyExperiencePlatformStatus = "Platform" as const;
export const UserJourneyExperiencePlatformReadiness = "ReadyForCertification" as const;
export const UserJourneyExperiencePlatformPublicApiRegistry = PublicApiRegistry;

export const UserJourneyExperiencePlatform = Object.freeze({
  identity: UserJourneyExperiencePlatformIdentity,
  dependency: Object.freeze({ id: "NEX-4:6/Dependency/NEX45Manifest", upstreamId: UserJourneyExperienceManifest.identity.id, upstreamPhase: "NEX-4:5", manifestOnly: true, otherDependenciesAllowed: false, runtimeDependency: false, metadataOnly: true, immutable: true } as const),
  inventory: UserJourneyExperiencePlatformInventory,
  composition: UserJourneyExperiencePlatformComposition,
  capabilities: UserJourneyExperiencePlatformCapabilities,
  guarantees: UserJourneyExperiencePlatformGuarantees,
  compatibility: UserJourneyExperiencePlatformComposition.compatibility,
  dependencies: UserJourneyExperiencePlatformComposition.dependencies,
  readinessDeclaration: UserJourneyExperiencePlatformComposition.readiness,
  lifecycle: UserJourneyExperiencePlatformComposition.lifecycle,
  publication: UserJourneyExperiencePlatformComposition.publication,
  versioning: UserJourneyExperiencePlatformComposition.versioning,
  relationships: UserJourneyExperiencePlatformComposition.relationships,
  constraints: UserJourneyExperiencePlatformComposition.constraints,
  assumptions: UserJourneyExperiencePlatformComposition.assumptions,
  metadata: UserJourneyExperiencePlatformComposition.metadata,
  publicApiRegistry: UserJourneyExperiencePlatformPublicApiRegistry,
  certificationSeedMetadata: Object.freeze({
    platforms: Object.freeze([UserJourneyExperiencePlatformIdentity]),
    criteriaSubjects: Object.freeze(["CanonicalIdentity", "PlatformInventory", "ManifestTraceability", "RegistryTraceability", "ModelTraceability", "ValidationTraceability", "MetadataIntegrity", "PublicationIntegrity", "DependencyIntegrity", "Compatibility", "CapabilityCompleteness", "GuaranteeCompleteness", "PublicApiRegistry", "MetadataOnlyArchitecture", "VersionConsistency", "PlatformCompleteness"]),
    gateSubjects: Object.freeze(["Identity", "Inventory", "Dependency", "Relationship", "Capability", "Guarantee", "Compatibility", "Publication", "Metadata", "Architecture", "Readiness", "Release"]),
    dependencies: Object.freeze([UserJourneyExperiencePlatformComposition.dependencies]),
    compatibilityDeclarations: UserJourneyExperienceManifest.platformSeedMetadata.compatibilityDeclarations,
    metadataOnly: true,
    immutable: true,
  } as const),
  status: UserJourneyExperiencePlatformStatus,
  readiness: UserJourneyExperiencePlatformReadiness,
  readyForCertification: true,
  nextPhase: "NEX-4:7 — User Journey & Experience Certification",
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
