import {
  ExecutiveReportingContractId,
  ExecutiveReportingContractVersion,
} from "./executiveReportingIndex.ts";
import {
  ExecutiveReportAudienceRegistry,
  ExecutiveReportCategoryRegistry,
  ExecutiveReportDefinitionRegistry,
  ExecutiveReportFormatRegistry,
  ExecutiveReportPriorityRegistry,
  ExecutiveReportSectionRegistry,
  ExecutiveReportStatusRegistry,
  ExecutiveReportTemplateRegistry,
  ExecutiveReportingProfileRegistry,
  ExecutiveReportingRegistryFoundation,
  ExecutiveReportingRegistryMetadata,
} from "./executiveReportingRegistryIndex.ts";
import {
  ExecutiveReportingCanonicalModel,
  ExecutiveReportingModelFoundation,
  ExecutiveReportingModelMetadata,
} from "./executiveReportingModelIndex.ts";

export const ExecutiveReportingValidationId = "BUS-33:4" as const;

export const ExecutiveReportingValidationVersion = "1.0.0" as const;

export const ExecutiveReportingValidationName =
  "Executive Reporting Intelligence Validation" as const;

export const ExecutiveReportingValidationDescription =
  "Canonical metadata-only validation layer for executive reporting intelligence." as const;

export type ExecutiveReportingValidationCategory =
  | "Contracts"
  | "Registry"
  | "Model"
  | "Categories"
  | "Audiences"
  | "Formats"
  | "Sections"
  | "Templates"
  | "Reports"
  | "Profiles"
  | "Relationships"
  | "Public API"
  | "Architecture";

export type ExecutiveReportingValidationStatus = "PASS" | "FAIL";

export type ExecutiveReportingValidationCheck = Readonly<{
  readonly id: `executive-reporting-validation-check-${string}`;
  readonly name: string;
  readonly description: string;
  readonly category: ExecutiveReportingValidationCategory;
  readonly status: ExecutiveReportingValidationStatus;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveReportingValidationSummary = Readonly<{
  readonly validationId: typeof ExecutiveReportingValidationId;
  readonly totalChecks: number;
  readonly passedChecks: number;
  readonly failedChecks: number;
  readonly deterministic: true;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveReportingValidationResult = Readonly<{
  readonly validationId: typeof ExecutiveReportingValidationId;
  readonly validationVersion: typeof ExecutiveReportingValidationVersion;
  readonly validationName: typeof ExecutiveReportingValidationName;
  readonly validationDescription: typeof ExecutiveReportingValidationDescription;
  readonly checks: readonly ExecutiveReportingValidationCheck[];
  readonly summary: ExecutiveReportingValidationSummary;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

const createCheck = (
  id: ExecutiveReportingValidationCheck["id"],
  name: string,
  description: string,
  category: ExecutiveReportingValidationCategory,
  status: ExecutiveReportingValidationStatus,
): ExecutiveReportingValidationCheck =>
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

const categoryIds = ExecutiveReportCategoryRegistry;
const audienceIds = ExecutiveReportAudienceRegistry;
const formatIds = ExecutiveReportFormatRegistry;
const sectionIds = ExecutiveReportSectionRegistry.map((section) => section.id);
const templateIds: readonly string[] = ExecutiveReportTemplateRegistry.map(
  (template) => template.id,
);
const reportIds: readonly string[] = ExecutiveReportDefinitionRegistry.map(
  (definition) => definition.id,
);
const profileIds: readonly string[] = ExecutiveReportingProfileRegistry.map(
  (profile) => profile.id,
);

const allTemplateSectionsAreRegistered = ExecutiveReportTemplateRegistry.every((template) =>
  template.sections.every((section) => sectionIds.includes(section.id)),
);

const allDefinitionsReferenceRegisteredTemplates = ExecutiveReportDefinitionRegistry.every(
  (definition) => templateIds.includes(definition.template.id),
);

const allProfilesReferenceRegisteredReportsAndTemplates =
  ExecutiveReportingProfileRegistry.every((profile) => {
    const reportsAreRegistered = profile.reports.every((report) =>
      reportIds.includes(report.id),
    );
    const templatesAreRegistered = profile.templates.every((template) =>
      templateIds.includes(template.id),
    );
    return reportsAreRegistered && templatesAreRegistered;
  });

const audienceTemplateRelationshipsAreValid =
  ExecutiveReportingCanonicalModel.relationships.audienceToTemplate.every((relationship) =>
    relationship.templateIds.every((templateId) => templateIds.includes(templateId)),
  );

const categoryReportRelationshipsAreValid =
  ExecutiveReportingCanonicalModel.relationships.categoryToReport.every((relationship) =>
    relationship.reportIds.every((reportId) => reportIds.includes(reportId)),
  );

const canonicalModelContainsRequiredMetadata =
  ExecutiveReportingCanonicalModel.metadataOnly &&
  ExecutiveReportingCanonicalModel.immutable &&
  ExecutiveReportingModelMetadata.modelDependencies.length === 2 &&
  ExecutiveReportingCanonicalModel.templates.length ===
    ExecutiveReportTemplateRegistry.length &&
  ExecutiveReportingCanonicalModel.definitions.length ===
    ExecutiveReportDefinitionRegistry.length;

const publicApiIntegrityIsPresent =
  ExecutiveReportingModelFoundation.metadataOnly &&
  typeof ExecutiveReportingModelFoundation.buildExecutiveReportingModel === "function" &&
  typeof ExecutiveReportingModelFoundation.getExecutiveReportingModelSummary ===
    "function";

const registryIsImmutable =
  Object.isFrozen(ExecutiveReportingRegistryFoundation) &&
  Object.isFrozen(ExecutiveReportCategoryRegistry) &&
  Object.isFrozen(ExecutiveReportAudienceRegistry) &&
  Object.isFrozen(ExecutiveReportTemplateRegistry) &&
  Object.isFrozen(ExecutiveReportDefinitionRegistry);

const modelIsImmutable =
  Object.isFrozen(ExecutiveReportingModelFoundation) &&
  Object.isFrozen(ExecutiveReportingCanonicalModel);

const exportedMetadataIsDeterministic =
  ExecutiveReportingRegistryMetadata.registryVersion === "1.0.0" &&
  ExecutiveReportingModelMetadata.modelVersion === "1.0.0" &&
  ExecutiveReportingContractVersion === "1.0.0";

const validationChecks = Object.freeze([
  createCheck(
    "executive-reporting-validation-check-contract-metadata",
    "Contract Metadata Integrity",
    "Contract metadata identifiers and versions are present and deterministic.",
    "Contracts",
    ExecutiveReportingContractId === "BUS-33:1" ? "PASS" : "FAIL",
  ),
  createCheck(
    "executive-reporting-validation-check-category-uniqueness",
    "Category Uniqueness",
    "Every report category identifier is unique.",
    "Categories",
    hasUniqueValues(categoryIds) ? "PASS" : "FAIL",
  ),
  createCheck(
    "executive-reporting-validation-check-audience-uniqueness",
    "Audience Uniqueness",
    "Every report audience identifier is unique.",
    "Audiences",
    hasUniqueValues(audienceIds) ? "PASS" : "FAIL",
  ),
  createCheck(
    "executive-reporting-validation-check-format-coverage",
    "Format Coverage",
    "All canonical report formats are present.",
    "Formats",
    formatIds.length === 7 ? "PASS" : "FAIL",
  ),
  createCheck(
    "executive-reporting-validation-check-priority-coverage",
    "Priority Coverage",
    "All canonical report priorities are present.",
    "Registry",
    ExecutiveReportPriorityRegistry.length === 4 ? "PASS" : "FAIL",
  ),
  createCheck(
    "executive-reporting-validation-check-status-coverage",
    "Status Coverage",
    "All canonical report statuses are present.",
    "Registry",
    ExecutiveReportStatusRegistry.length === 4 ? "PASS" : "FAIL",
  ),
  createCheck(
    "executive-reporting-validation-check-section-uniqueness",
    "Section Uniqueness",
    "Every report section identifier is unique.",
    "Sections",
    hasUniqueValues(sectionIds) ? "PASS" : "FAIL",
  ),
  createCheck(
    "executive-reporting-validation-check-template-uniqueness",
    "Template Uniqueness",
    "Every report template identifier is unique.",
    "Templates",
    hasUniqueValues(templateIds) ? "PASS" : "FAIL",
  ),
  createCheck(
    "executive-reporting-validation-check-report-uniqueness",
    "Report Definition Uniqueness",
    "Every report definition identifier is unique.",
    "Reports",
    hasUniqueValues(reportIds) ? "PASS" : "FAIL",
  ),
  createCheck(
    "executive-reporting-validation-check-profile-uniqueness",
    "Profile Uniqueness",
    "Every reporting profile identifier is unique.",
    "Profiles",
    hasUniqueValues(profileIds) ? "PASS" : "FAIL",
  ),
  createCheck(
    "executive-reporting-validation-check-template-section-mapping",
    "Template Section Mapping",
    "Every template references valid sections.",
    "Relationships",
    allTemplateSectionsAreRegistered ? "PASS" : "FAIL",
  ),
  createCheck(
    "executive-reporting-validation-check-definition-template-mapping",
    "Definition Template Mapping",
    "Every report definition references a valid template.",
    "Reports",
    allDefinitionsReferenceRegisteredTemplates ? "PASS" : "FAIL",
  ),
  createCheck(
    "executive-reporting-validation-check-profile-mapping",
    "Profile Mapping Integrity",
    "Every profile references valid reports and templates.",
    "Profiles",
    allProfilesReferenceRegisteredReportsAndTemplates ? "PASS" : "FAIL",
  ),
  createCheck(
    "executive-reporting-validation-check-audience-template-relationships",
    "Audience Template Relationships",
    "Audience-to-template relationships reference registered templates.",
    "Relationships",
    audienceTemplateRelationshipsAreValid ? "PASS" : "FAIL",
  ),
  createCheck(
    "executive-reporting-validation-check-category-report-relationships",
    "Category Report Relationships",
    "Category-to-report relationships reference registered report definitions.",
    "Relationships",
    categoryReportRelationshipsAreValid ? "PASS" : "FAIL",
  ),
  createCheck(
    "executive-reporting-validation-check-canonical-model-completeness",
    "Canonical Model Completeness",
    "Canonical model contains required metadata and registry coverage.",
    "Model",
    canonicalModelContainsRequiredMetadata ? "PASS" : "FAIL",
  ),
  createCheck(
    "executive-reporting-validation-check-public-api-integrity",
    "Public API Integrity",
    "Public validation and model API surfaces are present and metadata-only.",
    "Public API",
    publicApiIntegrityIsPresent ? "PASS" : "FAIL",
  ),
  createCheck(
    "executive-reporting-validation-check-registry-immutability",
    "Registry Immutability",
    "Registry exports are immutable metadata structures.",
    "Registry",
    registryIsImmutable ? "PASS" : "FAIL",
  ),
  createCheck(
    "executive-reporting-validation-check-model-immutability",
    "Model Immutability",
    "Model exports are immutable metadata structures.",
    "Model",
    modelIsImmutable ? "PASS" : "FAIL",
  ),
  createCheck(
    "executive-reporting-validation-check-deterministic-exports",
    "Deterministic Exports",
    "Exported metadata remains deterministic across contracts, registry, and model layers.",
    "Architecture",
    exportedMetadataIsDeterministic ? "PASS" : "FAIL",
  ),
] as const);

const passedChecks = validationChecks.filter((check) => check.status === "PASS").length;

const validationSummary = Object.freeze({
  validationId: ExecutiveReportingValidationId,
  totalChecks: validationChecks.length,
  passedChecks,
  failedChecks: validationChecks.length - passedChecks,
  deterministic: true,
  metadataOnly: true,
  immutable: true,
} satisfies ExecutiveReportingValidationSummary);

const validationResult = Object.freeze({
  validationId: ExecutiveReportingValidationId,
  validationVersion: ExecutiveReportingValidationVersion,
  validationName: ExecutiveReportingValidationName,
  validationDescription: ExecutiveReportingValidationDescription,
  checks: validationChecks,
  summary: validationSummary,
  metadataOnly: true,
  immutable: true,
} satisfies ExecutiveReportingValidationResult);

const validationMetadata = Object.freeze({
  validationId: ExecutiveReportingValidationId,
  validationVersion: ExecutiveReportingValidationVersion,
  validationName: ExecutiveReportingValidationName,
  validationDescription: ExecutiveReportingValidationDescription,
  validationNamespace: "nexora.bus.executive-reporting.validation",
  categories: Object.freeze([
    "Contracts",
    "Registry",
    "Model",
    "Categories",
    "Audiences",
    "Formats",
    "Sections",
    "Templates",
    "Reports",
    "Profiles",
    "Relationships",
    "Public API",
    "Architecture",
  ] as const),
  metadataOnly: true,
  immutable: true,
} as const);

export const validateExecutiveReportingModel = () => validationResult;

export const buildExecutiveReportingValidationSummary = () => validationSummary;

export const getExecutiveReportingValidationChecks = () => validationChecks;

export const getExecutiveReportingValidationMetadata = () => validationMetadata;
