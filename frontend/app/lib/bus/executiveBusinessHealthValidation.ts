import {
  ExecutiveBusinessHealthContractId,
  ExecutiveBusinessHealthContractVersion,
} from "./executiveBusinessHealthIndex.ts";
import {
  ExecutiveBusinessHealthCapabilityRegistry,
  ExecutiveBusinessHealthDimensionRegistry,
  ExecutiveBusinessHealthDomainRegistry,
  ExecutiveBusinessHealthIndicatorRegistry,
  ExecutiveBusinessHealthRegistryFoundation,
  ExecutiveBusinessHealthRegistryMetadata,
  ExecutiveBusinessHealthScoreRangeRegistry,
  ExecutiveBusinessHealthSeverityRegistry,
  ExecutiveBusinessHealthStatusRegistry,
  ExecutiveBusinessHealthTrendRegistry,
} from "./executiveBusinessHealthRegistryIndex.ts";
import {
  ExecutiveBusinessHealthCanonicalModel,
  ExecutiveBusinessHealthModelFoundation,
  ExecutiveBusinessHealthModelMetadata,
} from "./executiveBusinessHealthModelIndex.ts";

export const ExecutiveBusinessHealthValidationId = "BUS-32:4" as const;

export const ExecutiveBusinessHealthValidationVersion = "1.0.0" as const;

export const ExecutiveBusinessHealthValidationName =
  "Executive Business Health Intelligence Validation" as const;

export const ExecutiveBusinessHealthValidationDescription =
  "Canonical metadata-only validation layer for executive business health intelligence." as const;

export type ExecutiveBusinessHealthValidationCategory =
  | "Contracts"
  | "Registry"
  | "Model"
  | "Domains"
  | "Dimensions"
  | "Capabilities"
  | "Indicators"
  | "Metadata"
  | "Public API"
  | "Architecture";

export type ExecutiveBusinessHealthValidationStatus = "PASS" | "FAIL";

export type ExecutiveBusinessHealthValidationCheck = Readonly<{
  readonly id: `executive-business-health-validation-check-${string}`;
  readonly name: string;
  readonly description: string;
  readonly category: ExecutiveBusinessHealthValidationCategory;
  readonly status: ExecutiveBusinessHealthValidationStatus;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveBusinessHealthValidationSummary = Readonly<{
  readonly validationId: typeof ExecutiveBusinessHealthValidationId;
  readonly totalChecks: number;
  readonly passedChecks: number;
  readonly failedChecks: number;
  readonly deterministic: true;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveBusinessHealthValidationResult = Readonly<{
  readonly validationId: typeof ExecutiveBusinessHealthValidationId;
  readonly validationVersion: typeof ExecutiveBusinessHealthValidationVersion;
  readonly validationName: typeof ExecutiveBusinessHealthValidationName;
  readonly validationDescription: typeof ExecutiveBusinessHealthValidationDescription;
  readonly checks: readonly ExecutiveBusinessHealthValidationCheck[];
  readonly summary: ExecutiveBusinessHealthValidationSummary;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

const createCheck = (
  id: ExecutiveBusinessHealthValidationCheck["id"],
  name: string,
  description: string,
  category: ExecutiveBusinessHealthValidationCategory,
  status: ExecutiveBusinessHealthValidationStatus,
): ExecutiveBusinessHealthValidationCheck =>
  Object.freeze({
    id,
    name,
    description,
    category,
    status,
    metadataOnly: true,
    immutable: true,
  });

const hasUniqueValues = <T>(values: readonly T[]): boolean => new Set(values).size === values.length;

const dimensionCapabilityIds = ExecutiveBusinessHealthDimensionRegistry.flatMap((dimension) =>
  dimension.capabilities.map((capability) => capability.id),
);

const capabilityIds = ExecutiveBusinessHealthCapabilityRegistry.map((capability) => capability.id);
const indicatorIds = ExecutiveBusinessHealthIndicatorRegistry.map((indicator) => indicator.id);
const domainIds = ExecutiveBusinessHealthDomainRegistry.map((domain) => domain.id);

const allDimensionCapabilitiesAreRegistered = dimensionCapabilityIds.every((capabilityId) =>
  capabilityIds.includes(capabilityId),
);

const allCapabilityIndicatorsAreRegistered = ExecutiveBusinessHealthCapabilityRegistry.every(
  (capability) =>
    capability.indicators.every((indicator) => indicatorIds.includes(indicator.id)),
);

const allIndicatorsReferenceValidDomains = ExecutiveBusinessHealthIndicatorRegistry.every((indicator) =>
  domainIds.includes(indicator.domain),
);

const allScoreRangesAreStructurallyValid = ExecutiveBusinessHealthScoreRangeRegistry.every(
  (range) => range.minimum <= range.maximum,
);

const canonicalModelContainsRequiredMetadata =
  ExecutiveBusinessHealthCanonicalModel.metadataOnly &&
  ExecutiveBusinessHealthCanonicalModel.immutable &&
  ExecutiveBusinessHealthModelMetadata.modelDependencies.length === 2 &&
  ExecutiveBusinessHealthCanonicalModel.profile.dimensions.length ===
    ExecutiveBusinessHealthDimensionRegistry.length;

const registriesAreImmutable =
  Object.isFrozen(ExecutiveBusinessHealthRegistryFoundation) &&
  Object.isFrozen(ExecutiveBusinessHealthDomainRegistry) &&
  Object.isFrozen(ExecutiveBusinessHealthDimensionRegistry) &&
  Object.isFrozen(ExecutiveBusinessHealthCapabilityRegistry) &&
  Object.isFrozen(ExecutiveBusinessHealthIndicatorRegistry);

const modelIsImmutable =
  Object.isFrozen(ExecutiveBusinessHealthModelFoundation) &&
  Object.isFrozen(ExecutiveBusinessHealthCanonicalModel);

const exportedMetadataIsDeterministic =
  ExecutiveBusinessHealthRegistryMetadata.registryVersion === "1.0.0" &&
  ExecutiveBusinessHealthModelMetadata.modelVersion === "1.0.0" &&
  ExecutiveBusinessHealthContractVersion === "1.0.0";

const validationChecks = Object.freeze([
  createCheck(
    "executive-business-health-validation-check-contract-metadata",
    "Contract Metadata Integrity",
    "Contract metadata identifiers and versions are present and deterministic.",
    "Contracts",
    ExecutiveBusinessHealthContractId === "BUS-32:1" ? "PASS" : "FAIL",
  ),
  createCheck(
    "executive-business-health-validation-check-domain-uniqueness",
    "Domain Uniqueness",
    "Every domain identifier is unique.",
    "Domains",
    hasUniqueValues(domainIds) ? "PASS" : "FAIL",
  ),
  createCheck(
    "executive-business-health-validation-check-dimension-uniqueness",
    "Dimension Uniqueness",
    "Every dimension identifier is unique.",
    "Dimensions",
    hasUniqueValues(ExecutiveBusinessHealthDimensionRegistry.map((dimension) => dimension.id))
      ? "PASS"
      : "FAIL",
  ),
  createCheck(
    "executive-business-health-validation-check-capability-uniqueness",
    "Capability Uniqueness",
    "Every capability identifier is unique.",
    "Capabilities",
    hasUniqueValues(capabilityIds) ? "PASS" : "FAIL",
  ),
  createCheck(
    "executive-business-health-validation-check-indicator-uniqueness",
    "Indicator Uniqueness",
    "Every indicator identifier is unique.",
    "Indicators",
    hasUniqueValues(indicatorIds) ? "PASS" : "FAIL",
  ),
  createCheck(
    "executive-business-health-validation-check-dimension-capability-mapping",
    "Dimension Capability Mapping",
    "Every dimension references valid capabilities.",
    "Dimensions",
    allDimensionCapabilitiesAreRegistered ? "PASS" : "FAIL",
  ),
  createCheck(
    "executive-business-health-validation-check-capability-indicator-mapping",
    "Capability Indicator Mapping",
    "Every capability references valid indicators.",
    "Capabilities",
    allCapabilityIndicatorsAreRegistered ? "PASS" : "FAIL",
  ),
  createCheck(
    "executive-business-health-validation-check-indicator-domain-mapping",
    "Indicator Domain Mapping",
    "Every indicator references a valid domain.",
    "Indicators",
    allIndicatorsReferenceValidDomains ? "PASS" : "FAIL",
  ),
  createCheck(
    "executive-business-health-validation-check-score-range-structure",
    "Score Range Structure",
    "Every score range is structurally valid.",
    "Registry",
    allScoreRangesAreStructurallyValid ? "PASS" : "FAIL",
  ),
  createCheck(
    "executive-business-health-validation-check-status-coverage",
    "Status Coverage",
    "All canonical business health statuses exist.",
    "Registry",
    ExecutiveBusinessHealthStatusRegistry.length === 5 ? "PASS" : "FAIL",
  ),
  createCheck(
    "executive-business-health-validation-check-trend-coverage",
    "Trend Coverage",
    "All canonical business health trends exist.",
    "Registry",
    ExecutiveBusinessHealthTrendRegistry.length === 4 ? "PASS" : "FAIL",
  ),
  createCheck(
    "executive-business-health-validation-check-severity-coverage",
    "Severity Coverage",
    "All canonical business health severities exist.",
    "Registry",
    ExecutiveBusinessHealthSeverityRegistry.length === 5 ? "PASS" : "FAIL",
  ),
  createCheck(
    "executive-business-health-validation-check-canonical-model-completeness",
    "Canonical Model Completeness",
    "Canonical model contains all required metadata and coverage.",
    "Model",
    canonicalModelContainsRequiredMetadata ? "PASS" : "FAIL",
  ),
  createCheck(
    "executive-business-health-validation-check-registry-immutability",
    "Registry Immutability",
    "Registry exports are immutable metadata structures.",
    "Registry",
    registriesAreImmutable ? "PASS" : "FAIL",
  ),
  createCheck(
    "executive-business-health-validation-check-model-immutability",
    "Model Immutability",
    "Model exports are immutable metadata structures.",
    "Model",
    modelIsImmutable ? "PASS" : "FAIL",
  ),
  createCheck(
    "executive-business-health-validation-check-deterministic-exports",
    "Deterministic Exports",
    "Exported metadata remains deterministic across contracts, registry, and model layers.",
    "Architecture",
    exportedMetadataIsDeterministic ? "PASS" : "FAIL",
  ),
] as const);

const passedChecks = validationChecks.filter((check) => check.status === "PASS").length;

const validationSummary = Object.freeze({
  validationId: ExecutiveBusinessHealthValidationId,
  totalChecks: validationChecks.length,
  passedChecks,
  failedChecks: validationChecks.length - passedChecks,
  deterministic: true,
  metadataOnly: true,
  immutable: true,
} satisfies ExecutiveBusinessHealthValidationSummary);

const validationResult = Object.freeze({
  validationId: ExecutiveBusinessHealthValidationId,
  validationVersion: ExecutiveBusinessHealthValidationVersion,
  validationName: ExecutiveBusinessHealthValidationName,
  validationDescription: ExecutiveBusinessHealthValidationDescription,
  checks: validationChecks,
  summary: validationSummary,
  metadataOnly: true,
  immutable: true,
} satisfies ExecutiveBusinessHealthValidationResult);

const validationMetadata = Object.freeze({
  validationId: ExecutiveBusinessHealthValidationId,
  validationVersion: ExecutiveBusinessHealthValidationVersion,
  validationName: ExecutiveBusinessHealthValidationName,
  validationDescription: ExecutiveBusinessHealthValidationDescription,
  categories: Object.freeze([
    "Contracts",
    "Registry",
    "Model",
    "Domains",
    "Dimensions",
    "Capabilities",
    "Indicators",
    "Metadata",
    "Public API",
    "Architecture",
  ] as const),
  metadataOnly: true,
  immutable: true,
});

export const getExecutiveBusinessHealthValidationChecks = ():
  readonly ExecutiveBusinessHealthValidationCheck[] => validationChecks;

export const buildExecutiveBusinessHealthValidationSummary =
  (): ExecutiveBusinessHealthValidationSummary => validationSummary;

export const validateExecutiveBusinessHealthModel =
  (): ExecutiveBusinessHealthValidationResult => validationResult;

export const getExecutiveBusinessHealthValidationMetadata = () => validationMetadata;
