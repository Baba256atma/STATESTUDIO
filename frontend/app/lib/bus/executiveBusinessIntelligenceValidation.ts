import {
  ExecutiveBusinessIntelligenceContractId,
  ExecutiveBusinessIntelligenceContractVersion,
} from "./executiveBusinessIntelligenceIndex.ts";
import {
  ExecutiveBusinessIntelligenceCapabilityRegistry,
  ExecutiveBusinessIntelligenceDependencyRegistry,
  ExecutiveBusinessIntelligenceDomainRegistry,
  ExecutiveBusinessIntelligenceIntegrationRegistry,
  ExecutiveBusinessIntelligenceNamespaceRegistry,
  ExecutiveBusinessIntelligencePlatformRegistry,
  ExecutiveBusinessIntelligenceRegistryFoundation,
  ExecutiveBusinessIntelligenceRegistryMetadata,
} from "./executiveBusinessIntelligenceRegistryIndex.ts";
import {
  ExecutiveBusinessIntelligenceCanonicalModel,
  ExecutiveBusinessIntelligenceModelFoundation,
  ExecutiveBusinessIntelligenceModelMetadata,
} from "./executiveBusinessIntelligenceModelIndex.ts";

export const ExecutiveBusinessIntelligenceValidationId = "BUS-34:4" as const;

export const ExecutiveBusinessIntelligenceValidationVersion = "1.0.0" as const;

export const ExecutiveBusinessIntelligenceValidationName =
  "Executive Business Intelligence Validation" as const;

export const ExecutiveBusinessIntelligenceValidationDescription =
  "Canonical metadata-only validation layer for executive business intelligence." as const;

export type ExecutiveBusinessIntelligenceValidationCategory =
  | "Contracts"
  | "Registry"
  | "Model"
  | "Domains"
  | "Capabilities"
  | "Platforms"
  | "Namespaces"
  | "Dependencies"
  | "Integration"
  | "Relationships"
  | "Public API"
  | "Architecture"
  | "Immutability"
  | "Determinism";

export type ExecutiveBusinessIntelligenceValidationStatus = "PASS" | "FAIL";

export type ExecutiveBusinessIntelligenceValidationCheck = Readonly<{
  readonly id: `executive-business-intelligence-validation-check-${string}`;
  readonly name: string;
  readonly description: string;
  readonly category: ExecutiveBusinessIntelligenceValidationCategory;
  readonly status: ExecutiveBusinessIntelligenceValidationStatus;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveBusinessIntelligenceValidationSummary = Readonly<{
  readonly validationId: typeof ExecutiveBusinessIntelligenceValidationId;
  readonly totalChecks: number;
  readonly passedChecks: number;
  readonly failedChecks: number;
  readonly deterministic: true;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveBusinessIntelligenceValidationResult = Readonly<{
  readonly validationId: typeof ExecutiveBusinessIntelligenceValidationId;
  readonly validationVersion: typeof ExecutiveBusinessIntelligenceValidationVersion;
  readonly validationName: typeof ExecutiveBusinessIntelligenceValidationName;
  readonly validationDescription: typeof ExecutiveBusinessIntelligenceValidationDescription;
  readonly checks: readonly ExecutiveBusinessIntelligenceValidationCheck[];
  readonly summary: ExecutiveBusinessIntelligenceValidationSummary;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

const createCheck = (
  id: ExecutiveBusinessIntelligenceValidationCheck["id"],
  name: string,
  description: string,
  category: ExecutiveBusinessIntelligenceValidationCategory,
  status: ExecutiveBusinessIntelligenceValidationStatus,
): ExecutiveBusinessIntelligenceValidationCheck =>
  Object.freeze({
    id,
    name,
    description,
    category,
    status,
    metadataOnly: true,
    immutable: true,
  });

const hasUniqueValues = <T>(values: readonly T[]): boolean =>
  new Set(values).size === values.length;

const domainIds = ExecutiveBusinessIntelligenceDomainRegistry;
const capabilityIds: readonly string[] =
  ExecutiveBusinessIntelligenceCapabilityRegistry.map(
    (capability) => capability.id,
  );
const platformIds: readonly string[] = ExecutiveBusinessIntelligencePlatformRegistry.map(
  (platform) => platform.id,
);
const namespaceIds = ExecutiveBusinessIntelligenceNamespaceRegistry.map(
  (namespace) => namespace.id,
);
const dependencyIds = ExecutiveBusinessIntelligenceDependencyRegistry.map(
  (dependency) => dependency.id,
);

const allCapabilitiesReferenceRegisteredDomains =
  ExecutiveBusinessIntelligenceCapabilityRegistry.every((capability) =>
    domainIds.includes(capability.domain),
  );

const allPlatformsContainNamespaceAndVersionMetadata =
  ExecutiveBusinessIntelligencePlatformRegistry.every(
    (platform) =>
      platform.namespace.startsWith("nexora.bus.") && platform.version === "1.0.0",
  );

const allNamespacesReferenceRegisteredPlatforms =
  ExecutiveBusinessIntelligenceNamespaceRegistry.every((namespace) =>
    namespace.platforms.every((platform) => platformIds.includes(platform.id)),
  );

const allDependenciesReferenceRegisteredPlatforms =
  ExecutiveBusinessIntelligenceDependencyRegistry.every(
    (dependency) =>
      platformIds.includes(dependency.source) && platformIds.includes(dependency.target),
  );

const integrationMetadataIsComplete = ExecutiveBusinessIntelligenceIntegrationRegistry.every(
  (integration) =>
    integration.platformIds.every((platformId) => platformIds.includes(platformId)) &&
    integration.dependencyIds.every((dependencyId) =>
      dependencyIds.includes(dependencyId),
    ),
);

const domainCapabilityRelationshipsAreValid =
  ExecutiveBusinessIntelligenceCanonicalModel.relationships.domainToCapability.every(
    (relationship) =>
      relationship.capabilityIds.every((capabilityId) =>
        capabilityIds.includes(capabilityId),
      ),
  );

const domainPlatformRelationshipsAreValid =
  ExecutiveBusinessIntelligenceCanonicalModel.relationships.domainToPlatform.every(
    (relationship) =>
      relationship.platformIds.every((platformId) => platformIds.includes(platformId)),
  );

const platformDependencyRelationshipsAreValid =
  ExecutiveBusinessIntelligenceCanonicalModel.relationships.platformToPlatformDependency.every(
    (relationship) =>
      dependencyIds.includes(relationship.dependencyId) &&
      platformIds.includes(relationship.sourcePlatformId) &&
      platformIds.includes(relationship.targetPlatformId),
  );

const canonicalModelContainsRequiredMetadata =
  ExecutiveBusinessIntelligenceCanonicalModel.metadataOnly &&
  ExecutiveBusinessIntelligenceCanonicalModel.immutable &&
  ExecutiveBusinessIntelligenceModelMetadata.modelDependencies.length === 2 &&
  ExecutiveBusinessIntelligenceCanonicalModel.platforms.length ===
    ExecutiveBusinessIntelligencePlatformRegistry.length &&
  ExecutiveBusinessIntelligenceCanonicalModel.capabilities.length ===
    ExecutiveBusinessIntelligenceCapabilityRegistry.length;

const publicApiIntegrityIsPresent =
  ExecutiveBusinessIntelligenceModelFoundation.metadataOnly &&
  typeof ExecutiveBusinessIntelligenceModelFoundation.buildExecutiveBusinessIntelligenceModel ===
    "function" &&
  typeof ExecutiveBusinessIntelligenceModelFoundation.getExecutiveBusinessIntelligenceModelSummary ===
    "function";

const registryIsImmutable =
  Object.isFrozen(ExecutiveBusinessIntelligenceRegistryFoundation) &&
  Object.isFrozen(ExecutiveBusinessIntelligenceDomainRegistry) &&
  Object.isFrozen(ExecutiveBusinessIntelligenceCapabilityRegistry) &&
  Object.isFrozen(ExecutiveBusinessIntelligencePlatformRegistry) &&
  Object.isFrozen(ExecutiveBusinessIntelligenceDependencyRegistry);

const modelIsImmutable =
  Object.isFrozen(ExecutiveBusinessIntelligenceModelFoundation) &&
  Object.isFrozen(ExecutiveBusinessIntelligenceCanonicalModel);

const exportedMetadataIsDeterministic =
  ExecutiveBusinessIntelligenceRegistryMetadata.registryVersion === "1.0.0" &&
  ExecutiveBusinessIntelligenceModelMetadata.modelVersion === "1.0.0" &&
  ExecutiveBusinessIntelligenceContractVersion === "1.0.0";

const validationChecks = Object.freeze([
  createCheck(
    "executive-business-intelligence-validation-check-contract-metadata",
    "Contract Metadata Integrity",
    "Contract metadata identifiers and versions are present and deterministic.",
    "Contracts",
    ExecutiveBusinessIntelligenceContractId === "BUS-34:1" ? "PASS" : "FAIL",
  ),
  createCheck(
    "executive-business-intelligence-validation-check-domain-uniqueness",
    "Domain Uniqueness",
    "Every intelligence domain identifier is unique.",
    "Domains",
    hasUniqueValues(domainIds) ? "PASS" : "FAIL",
  ),
  createCheck(
    "executive-business-intelligence-validation-check-capability-uniqueness",
    "Capability Uniqueness",
    "Every capability identifier is unique.",
    "Capabilities",
    hasUniqueValues(capabilityIds) ? "PASS" : "FAIL",
  ),
  createCheck(
    "executive-business-intelligence-validation-check-platform-uniqueness",
    "Platform Uniqueness",
    "Every platform identifier is unique.",
    "Platforms",
    hasUniqueValues(platformIds) ? "PASS" : "FAIL",
  ),
  createCheck(
    "executive-business-intelligence-validation-check-namespace-uniqueness",
    "Namespace Uniqueness",
    "Every namespace identifier is unique.",
    "Namespaces",
    hasUniqueValues(namespaceIds) ? "PASS" : "FAIL",
  ),
  createCheck(
    "executive-business-intelligence-validation-check-dependency-uniqueness",
    "Dependency Uniqueness",
    "Every dependency identifier is unique.",
    "Dependencies",
    hasUniqueValues(dependencyIds) ? "PASS" : "FAIL",
  ),
  createCheck(
    "executive-business-intelligence-validation-check-capability-domain-mapping",
    "Capability Domain Mapping",
    "Every capability references a valid intelligence domain.",
    "Capabilities",
    allCapabilitiesReferenceRegisteredDomains ? "PASS" : "FAIL",
  ),
  createCheck(
    "executive-business-intelligence-validation-check-platform-metadata",
    "Platform Metadata Completeness",
    "Every platform reference has valid namespace and version metadata.",
    "Platforms",
    allPlatformsContainNamespaceAndVersionMetadata ? "PASS" : "FAIL",
  ),
  createCheck(
    "executive-business-intelligence-validation-check-namespace-platform-mapping",
    "Namespace Platform Mapping",
    "Every namespace references registered platform identifiers.",
    "Namespaces",
    allNamespacesReferenceRegisteredPlatforms ? "PASS" : "FAIL",
  ),
  createCheck(
    "executive-business-intelligence-validation-check-dependency-platform-mapping",
    "Dependency Platform Mapping",
    "Every dependency references registered platform identifiers.",
    "Dependencies",
    allDependenciesReferenceRegisteredPlatforms ? "PASS" : "FAIL",
  ),
  createCheck(
    "executive-business-intelligence-validation-check-integration-metadata",
    "Integration Metadata Completeness",
    "Integration metadata references registered platforms and dependencies.",
    "Integration",
    integrationMetadataIsComplete ? "PASS" : "FAIL",
  ),
  createCheck(
    "executive-business-intelligence-validation-check-domain-capability-relationships",
    "Domain Capability Relationships",
    "Domain-to-capability relationships reference registered capabilities.",
    "Relationships",
    domainCapabilityRelationshipsAreValid ? "PASS" : "FAIL",
  ),
  createCheck(
    "executive-business-intelligence-validation-check-domain-platform-relationships",
    "Domain Platform Relationships",
    "Domain-to-platform relationships reference registered platforms.",
    "Relationships",
    domainPlatformRelationshipsAreValid ? "PASS" : "FAIL",
  ),
  createCheck(
    "executive-business-intelligence-validation-check-platform-dependency-relationships",
    "Platform Dependency Relationships",
    "Platform-to-platform dependency relationships reference registered dependencies and platforms.",
    "Relationships",
    platformDependencyRelationshipsAreValid ? "PASS" : "FAIL",
  ),
  createCheck(
    "executive-business-intelligence-validation-check-canonical-model-completeness",
    "Canonical Model Completeness",
    "Canonical model contains required metadata and registry coverage.",
    "Model",
    canonicalModelContainsRequiredMetadata ? "PASS" : "FAIL",
  ),
  createCheck(
    "executive-business-intelligence-validation-check-public-api-integrity",
    "Public API Integrity",
    "Public validation and model API surfaces are present and metadata-only.",
    "Public API",
    publicApiIntegrityIsPresent ? "PASS" : "FAIL",
  ),
  createCheck(
    "executive-business-intelligence-validation-check-registry-immutability",
    "Registry Immutability",
    "Registry exports are immutable metadata structures.",
    "Registry",
    registryIsImmutable ? "PASS" : "FAIL",
  ),
  createCheck(
    "executive-business-intelligence-validation-check-model-immutability",
    "Model Immutability",
    "Model exports are immutable metadata structures.",
    "Model",
    modelIsImmutable ? "PASS" : "FAIL",
  ),
  createCheck(
    "executive-business-intelligence-validation-check-deterministic-exports",
    "Deterministic Exports",
    "Exported metadata remains deterministic across contracts, registry, and model layers.",
    "Determinism",
    exportedMetadataIsDeterministic ? "PASS" : "FAIL",
  ),
  createCheck(
    "executive-business-intelligence-validation-check-architectural-consistency",
    "Architectural Consistency",
    "Model and registry layers remain consistent with the BUS integration architecture.",
    "Architecture",
    ExecutiveBusinessIntelligenceCanonicalModel.relationships.domainToCapability.length ===
      ExecutiveBusinessIntelligenceDomainRegistry.length &&
      ExecutiveBusinessIntelligenceCanonicalModel.relationships.domainToPlatform.length ===
        ExecutiveBusinessIntelligenceDomainRegistry.length
      ? "PASS"
      : "FAIL",
  ),
] as const);

const passedChecks = validationChecks.filter((check) => check.status === "PASS").length;

const validationSummary = Object.freeze({
  validationId: ExecutiveBusinessIntelligenceValidationId,
  totalChecks: validationChecks.length,
  passedChecks,
  failedChecks: validationChecks.length - passedChecks,
  deterministic: true,
  metadataOnly: true,
  immutable: true,
} satisfies ExecutiveBusinessIntelligenceValidationSummary);

const validationResult = Object.freeze({
  validationId: ExecutiveBusinessIntelligenceValidationId,
  validationVersion: ExecutiveBusinessIntelligenceValidationVersion,
  validationName: ExecutiveBusinessIntelligenceValidationName,
  validationDescription: ExecutiveBusinessIntelligenceValidationDescription,
  checks: validationChecks,
  summary: validationSummary,
  metadataOnly: true,
  immutable: true,
} satisfies ExecutiveBusinessIntelligenceValidationResult);

const validationMetadata = Object.freeze({
  validationId: ExecutiveBusinessIntelligenceValidationId,
  validationVersion: ExecutiveBusinessIntelligenceValidationVersion,
  validationName: ExecutiveBusinessIntelligenceValidationName,
  validationDescription: ExecutiveBusinessIntelligenceValidationDescription,
  validationNamespace: "nexora.bus.executive-business-intelligence.validation",
  categories: Object.freeze([
    "Contracts",
    "Registry",
    "Model",
    "Domains",
    "Capabilities",
    "Platforms",
    "Namespaces",
    "Dependencies",
    "Integration",
    "Relationships",
    "Public API",
    "Architecture",
    "Immutability",
    "Determinism",
  ] as const),
  metadataOnly: true,
  immutable: true,
} as const);

export const validateExecutiveBusinessIntelligenceModel = () => validationResult;

export const buildExecutiveBusinessIntelligenceValidationSummary = () =>
  validationSummary;

export const getExecutiveBusinessIntelligenceValidationChecks = () =>
  validationChecks;

export const getExecutiveBusinessIntelligenceValidationMetadata = () =>
  validationMetadata;
