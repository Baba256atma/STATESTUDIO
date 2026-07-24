/**
 * NEX-3:5 — Features & Modules Manifest.
 */

import { FeaturesModulesManifestComposition } from "./featuresModulesManifestComposition.ts";
import { FeaturesModulesManifestGuarantees } from "./featuresModulesManifestGuarantees.ts";
import { FeaturesModulesManifestIdentity } from "./featuresModulesManifestIdentity.ts";
import { FeaturesModulesManifestInventories } from "./featuresModulesManifestInventories.ts";
import { FeaturesModulesManifestInventory } from "./featuresModulesManifestInventory.ts";
import { FeaturesModulesManifestPublicApiRegistry as PublicApiRegistry } from "./featuresModulesManifestPublicApi.ts";
import { FeaturesModulesValidation } from "./featuresModulesValidation.ts";

export const FeaturesModulesManifestId = "NEX-3:5/FeaturesModulesManifest" as const;
export const FeaturesModulesManifestName = "Nexora Features & Modules Manifest" as const;
export const FeaturesModulesManifestNamespace = "nexora.nex.features-modules.manifest" as const;
export const FeaturesModulesManifestVersion = "1.0.0" as const;
export const FeaturesModulesManifestStatus = "Manifest" as const;
export const FeaturesModulesManifestReadiness = "ReadyForPlatform" as const;
export const FeaturesModulesManifestPublicApiRegistry = PublicApiRegistry;

export const FeaturesModulesManifest = Object.freeze({
  identity: FeaturesModulesManifestIdentity,
  dependency: Object.freeze({
    id: "NEX-3:5/Dependency/NEX34Validation",
    upstreamId: FeaturesModulesValidation.identity.id,
    upstreamPhase: "NEX-3:4",
    validationOnly: true,
    otherDependenciesAllowed: false,
    runtimeDependency: false,
    metadataOnly: true,
    immutable: true,
  } as const),
  inventory: FeaturesModulesManifestInventory,
  inventories: FeaturesModulesManifestInventories,
  composition: FeaturesModulesManifestComposition,
  guarantees: FeaturesModulesManifestGuarantees,
  compatibility: FeaturesModulesManifestComposition.compatibility,
  dependencies: FeaturesModulesManifestComposition.dependencies,
  lifecycle: FeaturesModulesManifestComposition.lifecycle,
  readinessDeclaration: FeaturesModulesManifestComposition.readiness,
  publication: FeaturesModulesManifestComposition.publication,
  metadata: FeaturesModulesManifestComposition.metadata,
  publicApiRegistry: FeaturesModulesManifestPublicApiRegistry,
  platformSeedMetadata: Object.freeze({
    manifests: Object.freeze([FeaturesModulesManifestIdentity]),
    capabilitySubjects: Object.freeze([
      "ProductFeature",
      "ProductModule",
      "Capability",
      "FeatureDependency",
      "ModuleDependency",
      "ProductComposition",
      "Governance",
      "FeatureLifecycle",
    ]),
    compatibilityDeclarations: Object.freeze(["BackwardCompatible", "ForwardExtendable", "MetadataCompatible", "VersionCompatible"]),
    metadataOnly: true,
    immutable: true,
  } as const),
  status: FeaturesModulesManifestStatus,
  readiness: FeaturesModulesManifestReadiness,
  readyForPlatform: true,
  nextPhase: "NEX-3:6 — Features & Modules Platform",
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
