/**
 * NEX-3:7 — Features & Modules Certification.
 */

import { FeaturesModulesCertificationCriteria } from "./featuresModulesCertificationCriteria.ts";
import { FeaturesModulesCertificationGates } from "./featuresModulesCertificationGates.ts";
import { FeaturesModulesCertificationGuarantees } from "./featuresModulesCertificationGuarantees.ts";
import { FeaturesModulesCertificationIdentity } from "./featuresModulesCertificationIdentity.ts";
import { FeaturesModulesCertificationInventory } from "./featuresModulesCertificationInventory.ts";
import { FeaturesModulesCertificationMetadata, FeaturesModulesCertificationPublicApiRegistry as PublicApiRegistry } from "./featuresModulesCertificationMetadata.ts";
import { FeaturesModulesPlatform } from "./featuresModulesPlatform.ts";

export const FeaturesModulesCertificationId = "NEX-3:7/FeaturesModulesCertification" as const;
export const FeaturesModulesCertificationName = "Nexora Features & Modules Certification" as const;
export const FeaturesModulesCertificationNamespace = "nexora.nex.features-modules.certification" as const;
export const FeaturesModulesCertificationVersion = "1.0.0" as const;
export const FeaturesModulesCertificationStatus = "Certification" as const;
export const FeaturesModulesCertificationReadiness = "ReadyForFreeze" as const;
export const FeaturesModulesCertificationPublicApiRegistry = PublicApiRegistry;

export const FeaturesModulesCertification = Object.freeze({
  identity: FeaturesModulesCertificationIdentity,
  dependency: Object.freeze({ id: "NEX-3:7/Dependency/NEX36Platform", upstreamId: FeaturesModulesPlatform.identity.id, upstreamPhase: "NEX-3:6", platformOnly: true, otherDependenciesAllowed: false, runtimeDependency: false, metadataOnly: true, immutable: true } as const),
  inventory: FeaturesModulesCertificationInventory,
  criteria: FeaturesModulesCertificationCriteria,
  gates: FeaturesModulesCertificationGates,
  guarantees: FeaturesModulesCertificationGuarantees,
  compatibility: FeaturesModulesCertificationMetadata.compatibility,
  dependencies: FeaturesModulesCertificationMetadata.dependencies,
  readinessDeclaration: FeaturesModulesCertificationMetadata.readiness,
  lifecycle: FeaturesModulesCertificationMetadata.lifecycle,
  publication: FeaturesModulesCertificationMetadata.publication,
  versioning: FeaturesModulesCertificationMetadata.versioning,
  compliance: FeaturesModulesCertificationMetadata.compliance,
  constraints: FeaturesModulesCertificationMetadata.constraints,
  assumptions: FeaturesModulesCertificationMetadata.assumptions,
  metadata: FeaturesModulesCertificationMetadata.certificationMetadata,
  publicApiRegistry: FeaturesModulesCertificationPublicApiRegistry,
  freezeSeedMetadata: Object.freeze({
    baselineSubjects: Object.freeze(["Foundation", "Registry", "Model", "Validation", "Manifest", "Platform", "Certification", "Freeze"]),
    lockSubjects: Object.freeze(["Identity", "Namespace", "Metadata", "Publication", "Compatibility", "Dependency", "Capability", "Guarantee", "Structure", "Version", "PublicApiRegistry", "Architecture"]),
    extensionPolicySubjects: Object.freeze(["PreserveFrozenMetadata", "ExtendFutureVersions", "StablePublicContracts", "BackwardCompatibility", "ImmutableCanonicalIdentity", "StablePublicApiRegistry", "PreserveMetadataIntegrity", "NonExecutableFreeze"]),
    compatibilityDeclarations: FeaturesModulesPlatform.certificationSeedMetadata.compatibilityDeclarations,
    freezeEntrySubjects: FeaturesModulesPlatform.composition.sections,
    metadataOnly: true,
    immutable: true,
  } as const),
  status: FeaturesModulesCertificationStatus,
  readiness: FeaturesModulesCertificationReadiness,
  readyForFreeze: true,
  nextPhase: "NEX-3:8 — Features & Modules Freeze",
  metadataOnly: true,
  immutable: true,
  executesCertification: false,
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
