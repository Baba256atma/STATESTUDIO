/**
 * NEX-3:6 — Features & Modules Platform.
 */

import { FeaturesModulesManifest } from "./featuresModulesManifest.ts";
import { FeaturesModulesPlatformCapabilities } from "./featuresModulesPlatformCapabilities.ts";
import { FeaturesModulesPlatformComposition } from "./featuresModulesPlatformComposition.ts";
import { FeaturesModulesPlatformGuarantees } from "./featuresModulesPlatformGuarantees.ts";
import { FeaturesModulesPlatformIdentity } from "./featuresModulesPlatformIdentity.ts";
import { FeaturesModulesPlatformInventory } from "./featuresModulesPlatformInventory.ts";
import { FeaturesModulesPlatformPublicApiRegistry as PublicApiRegistry } from "./featuresModulesPlatformPublicApi.ts";

export const FeaturesModulesPlatformId = "NEX-3:6/FeaturesModulesPlatform" as const;
export const FeaturesModulesPlatformName = "Nexora Features & Modules Platform" as const;
export const FeaturesModulesPlatformNamespace = "nexora.nex.features-modules.platform" as const;
export const FeaturesModulesPlatformVersion = "1.0.0" as const;
export const FeaturesModulesPlatformStatus = "Platform" as const;
export const FeaturesModulesPlatformReadiness = "ReadyForCertification" as const;
export const FeaturesModulesPlatformPublicApiRegistry = PublicApiRegistry;

export const FeaturesModulesPlatform = Object.freeze({
  identity: FeaturesModulesPlatformIdentity,
  dependency: Object.freeze({
    id: "NEX-3:6/Dependency/NEX35Manifest",
    upstreamId: FeaturesModulesManifest.identity.id,
    upstreamPhase: "NEX-3:5",
    manifestOnly: true,
    otherDependenciesAllowed: false,
    runtimeDependency: false,
    metadataOnly: true,
    immutable: true,
  } as const),
  inventory: FeaturesModulesPlatformInventory,
  composition: FeaturesModulesPlatformComposition,
  capabilities: FeaturesModulesPlatformCapabilities,
  guarantees: FeaturesModulesPlatformGuarantees,
  compatibility: FeaturesModulesPlatformComposition.compatibility,
  dependencies: FeaturesModulesPlatformComposition.dependencies,
  readinessDeclaration: FeaturesModulesPlatformComposition.readiness,
  lifecycle: FeaturesModulesPlatformComposition.lifecycle,
  publication: FeaturesModulesPlatformComposition.publication,
  versioning: FeaturesModulesPlatformComposition.versioning,
  relationships: FeaturesModulesPlatformComposition.relationships,
  constraints: FeaturesModulesPlatformComposition.constraints,
  assumptions: FeaturesModulesPlatformComposition.assumptions,
  metadata: FeaturesModulesPlatformComposition.metadata,
  publicApiRegistry: FeaturesModulesPlatformPublicApiRegistry,
  certificationSeedMetadata: Object.freeze({
    platforms: Object.freeze([FeaturesModulesPlatformIdentity]),
    criteriaSubjects: Object.freeze(["CanonicalIdentity", "PlatformInventory", "ManifestTraceability", "RegistryTraceability", "ModelTraceability", "ValidationTraceability", "MetadataIntegrity", "PublicationIntegrity", "DependencyIntegrity", "Compatibility", "CapabilityCompleteness", "GuaranteeCompleteness", "PublicApiRegistry", "MetadataOnlyArchitecture", "VersionConsistency", "PlatformCompleteness"]),
    gateSubjects: Object.freeze(["Identity", "Inventory", "Dependency", "Relationship", "Capability", "Guarantee", "Compatibility", "Publication", "Metadata", "Architecture", "Readiness", "Release"]),
    dependencies: Object.freeze([FeaturesModulesPlatformComposition.dependencies]),
    compatibilityDeclarations: FeaturesModulesManifest.platformSeedMetadata.compatibilityDeclarations,
    metadataOnly: true,
    immutable: true,
  } as const),
  status: FeaturesModulesPlatformStatus,
  readiness: FeaturesModulesPlatformReadiness,
  readyForCertification: true,
  nextPhase: "NEX-3:7 — Features & Modules Certification",
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
