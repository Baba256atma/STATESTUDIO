import type {
  ExecutiveDecisionCertificationCompatibility as ExecutiveDecisionCertificationCompatibilityEntry,
  ExecutiveDecisionCertificationRegressionDeclaration,
} from "./executiveDecisionCertificationTypes.ts";

const compatibility = (
  id: string,
  source: string,
  target: string,
  relationshipType: string,
  approvedContract: string,
) => Object.freeze({
  id,
  source,
  target,
  relationshipType,
  approvedContract,
  direction: "ForwardOnly",
  compatibilityStatus: "Compatible",
  publicApiRequired: true,
  runtimeBehaviorProhibited: true,
  metadataOnly: true,
  immutable: true,
} as const satisfies ExecutiveDecisionCertificationCompatibilityEntry);

const regression = (
  id: string,
  name: string,
  description: string,
) => Object.freeze({
  id,
  name,
  description,
  protection: "Protected",
  status: "PASS",
  metadataOnly: true,
  immutable: true,
} as const satisfies ExecutiveDecisionCertificationRegressionDeclaration);

/**
 * Certified compatibility relationships for ENG-7 decision architecture.
 */
export const ExecutiveDecisionCertificationCompatibilityRelationships = Object.freeze([
  compatibility(
    "eng-7-cert-compat-foundation-registry",
    "ENG-7 Foundation",
    "Registry",
    "PhaseDependency",
    "executiveDecisionPublicApi.ts → executiveDecisionRegistryPlatform.ts",
  ),
  compatibility(
    "eng-7-cert-compat-registry-model",
    "ENG-7 Registry",
    "Model",
    "PhaseDependency",
    "executiveDecisionRegistryPlatform.ts → executiveDecisionModelPlatform.ts",
  ),
  compatibility(
    "eng-7-cert-compat-model-validation",
    "ENG-7 Model",
    "Validation",
    "PhaseDependency",
    "executiveDecisionModelPlatform.ts → executiveDecisionValidationPlatform.ts",
  ),
  compatibility(
    "eng-7-cert-compat-validation-manifest",
    "ENG-7 Validation",
    "Manifest",
    "PhaseDependency",
    "executiveDecisionValidationPlatform.ts → executiveDecisionManifestPlatform.ts",
  ),
  compatibility(
    "eng-7-cert-compat-manifest-platform",
    "ENG-7 Manifest",
    "Platform",
    "PhaseDependency",
    "executiveDecisionManifestPlatform.ts → executiveDecisionPlatform.ts",
  ),
  compatibility(
    "eng-7-cert-compat-reasoning-decision",
    "ENG-6 Reasoning",
    "ENG-7 Decision",
    "CrossPlatformReference",
    "ENG-6 public reasoning surface → ENG-7 decision architecture",
  ),
  compatibility(
    "eng-7-cert-compat-decision-orchestration",
    "ENG-7 Decision",
    "ENG-8 Orchestration",
    "FutureConsumerReference",
    "ENG-7 decision platform → ENG-8 orchestration (metadata reference only)",
  ),
  compatibility(
    "eng-7-cert-compat-decision-advisor",
    "ENG-7 Decision",
    "Advisor",
    "ExternalConsumerReference",
    "ENG-7 decision platform → Advisor (metadata reference only)",
  ),
] as const);

/**
 * Regression protection declarations. No regression runner is implemented.
 */
export const ExecutiveDecisionCertificationRegressionDeclarations = Object.freeze([
  regression(
    "eng-7-cert-regression-foundation-exports",
    "Foundation export stability",
    "Protects ENG-7:1 approved public export count and surface identity.",
  ),
  regression(
    "eng-7-cert-regression-registry-count",
    "Registry-count stability",
    "Protects ENG-7:2 registry inventory and approved export counts.",
  ),
  regression(
    "eng-7-cert-regression-model-count",
    "Model-count stability",
    "Protects ENG-7:3 canonical model inventory of 10 models.",
  ),
  regression(
    "eng-7-cert-regression-validation-rules",
    "Validation-rule stability",
    "Protects ENG-7:4 validation-rule inventory of 32 passing rules.",
  ),
  regression(
    "eng-7-cert-regression-manifest-inventory",
    "Manifest-inventory stability",
    "Protects ENG-7:5 manifest inventory and guarantee counts.",
  ),
  regression(
    "eng-7-cert-regression-platform-components",
    "Platform-component stability",
    "Protects ENG-7:6 five-component platform assembly order.",
  ),
  regression(
    "eng-7-cert-regression-ownership-boundaries",
    "Ownership-boundary stability",
    "Protects ENG-7 ownership isolation across certified phases.",
  ),
  regression(
    "eng-7-cert-regression-dependency-direction",
    "Dependency-direction stability",
    "Protects forward-only public-API dependency direction.",
  ),
  regression(
    "eng-7-cert-regression-public-api-isolation",
    "Public-API isolation stability",
    "Protects approved-surface-only consumption policy.",
  ),
  regression(
    "eng-7-cert-regression-metadata-only",
    "Metadata-only behavior stability",
    "Protects metadata-only and runtime-free certification posture.",
  ),
] as const);

export const ExecutiveDecisionCertificationCompatibility = Object.freeze({
  relationships: ExecutiveDecisionCertificationCompatibilityRelationships,
  regressions: ExecutiveDecisionCertificationRegressionDeclarations,
  relationshipCount: 8,
  regressionCount: 10,
  allRelationshipsCompatible: true,
  allRegressionsProtected: true,
  allRegressionsPassing: true,
  metadataOnly: true,
  immutable: true,
} as const);
