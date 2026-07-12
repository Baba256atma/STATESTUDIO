import {
  EXECUTIVE_ORGANIZATION_PLATFORM_ID,
  EXECUTIVE_ORGANIZATION_PLATFORM_NAMESPACE,
  EXECUTIVE_ORGANIZATION_PLATFORM_VERSION,
} from "./executiveOrganizationIndex.ts";
import {
  EXECUTIVE_ORGANIZATION_PLATFORM_REGISTRY,
  EXECUTIVE_ORGANIZATION_REGISTRY,
  EXECUTIVE_ORGANIZATION_REGISTRY_VALIDATION,
  EXECUTIVE_ORGANIZATION_UNIT_REGISTRY,
  EXECUTIVE_OWNERSHIP_REGISTRY,
  EXECUTIVE_POSITION_REGISTRY,
  EXECUTIVE_REPORTING_REGISTRY,
  EXECUTIVE_RESPONSIBILITY_REGISTRY,
  EXECUTIVE_ROLE_REGISTRY,
} from "./executiveOrganizationRegistryIndex.ts";
import {
  EXECUTIVE_HIERARCHY_MODELS,
  EXECUTIVE_ORGANIZATION_MODEL,
  EXECUTIVE_ORGANIZATION_MODEL_DESCRIPTION,
  EXECUTIVE_ORGANIZATION_MODEL_METADATA,
  EXECUTIVE_ORGANIZATION_MODEL_PUBLIC_APIS,
  EXECUTIVE_ORGANIZATION_PLATFORM_MODEL,
} from "./executiveOrganizationModelIndex.ts";
import type {
  ExecutiveOrganizationPlatformValidation,
  ExecutiveOrganizationValidationBundle,
  ExecutiveOrganizationValidationCompatibility,
  ExecutiveOrganizationValidationGroup,
  ExecutiveOrganizationValidationMetadata,
  ExecutiveOrganizationValidationResult,
  ExecutiveOrganizationValidationRule,
  ExecutiveOrganizationValidationSummary,
} from "./executiveOrganizationValidationTypes.ts";

export const EXECUTIVE_ORGANIZATION_VALIDATION_NAMESPACE =
  "nexora.bus.executive-organization.validation" as const;

export const EXECUTIVE_ORGANIZATION_VALIDATION_VERSION = "1.0.0" as const;

export const EXECUTIVE_ORGANIZATION_VALIDATION_DESCRIPTION =
  "Canonical metadata-only validation layer for executive organization intelligence." as const;

export const EXECUTIVE_ORGANIZATION_VALIDATION_METADATA: ExecutiveOrganizationValidationMetadata =
  Object.freeze({
    validationNamespace: EXECUTIVE_ORGANIZATION_VALIDATION_NAMESPACE,
    validationVersion: EXECUTIVE_ORGANIZATION_VALIDATION_VERSION,
    validationDescription: EXECUTIVE_ORGANIZATION_VALIDATION_DESCRIPTION,
    validationDependencies: Object.freeze([
      "BUS-30:1 Executive Organization Intelligence Contracts",
      "BUS-30:2 Executive Organization Registry",
      "BUS-30:3 Executive Organization Model",
    ]),
    validationConsumers: Object.freeze([
      "BUS-30:5 Manifest",
      "APP Executive Intelligence",
      "LAY Executive Layer",
    ]),
    validationStatus: "PASS",
    metadataOnly: true,
    immutable: true,
  });

const ruleMetadata = Object.freeze({
  createdBy: "BUS-30:4",
  metadataOnly: true,
  immutable: true,
} as const);

const groupMetadata = ruleMetadata;
const summaryMetadata = ruleMetadata;
const compatibilityMetadata = ruleMetadata;

const createRule = (
  ruleId: ExecutiveOrganizationValidationRule["ruleId"],
  ruleCode: ExecutiveOrganizationValidationRule["ruleCode"],
  ruleName: string,
  description: string,
  severity: ExecutiveOrganizationValidationRule["severity"],
  category: ExecutiveOrganizationValidationRule["category"],
): ExecutiveOrganizationValidationRule =>
  Object.freeze({
    ruleId,
    ruleCode,
    ruleName,
    description,
    severity,
    category,
    metadata: ruleMetadata,
    metadataOnly: true,
    immutable: true,
  });

export const EXECUTIVE_ORGANIZATION_VALIDATION_RULES: readonly ExecutiveOrganizationValidationRule[] =
  Object.freeze([
    createRule(
      "executive-organization-validation-rule-platform-identity",
      "BUS30V-PLATFORM-001",
      "Platform Identity Integrity",
      "Platform metadata must remain aligned across contracts, registry, and model surfaces.",
      "Critical",
      "Platform",
    ),
    createRule(
      "executive-organization-validation-rule-organization-structure",
      "BUS30V-ORG-001",
      "Organization Structure Integrity",
      "Organization metadata must remain present and structurally complete.",
      "Error",
      "Organization",
    ),
    createRule(
      "executive-organization-validation-rule-unit-integrity",
      "BUS30V-UNIT-001",
      "Organization Unit Integrity",
      "Organization unit metadata must remain published and namespace-compatible.",
      "Error",
      "OrganizationUnit",
    ),
    createRule(
      "executive-organization-validation-rule-role-integrity",
      "BUS30V-ROLE-001",
      "Executive Role Integrity",
      "Executive role metadata must remain published and structurally complete.",
      "Warning",
      "Role",
    ),
    createRule(
      "executive-organization-validation-rule-position-integrity",
      "BUS30V-POS-001",
      "Executive Position Integrity",
      "Executive position metadata must remain published and structurally complete.",
      "Warning",
      "Position",
    ),
    createRule(
      "executive-organization-validation-rule-reporting-integrity",
      "BUS30V-REPORT-001",
      "Reporting Relationship Integrity",
      "Reporting relationship metadata must remain published and structurally complete.",
      "Information",
      "Reporting",
    ),
    createRule(
      "executive-organization-validation-rule-ownership-integrity",
      "BUS30V-OWN-001",
      "Ownership Integrity",
      "Ownership metadata must remain published and structurally complete.",
      "Information",
      "Ownership",
    ),
    createRule(
      "executive-organization-validation-rule-responsibility-integrity",
      "BUS30V-RESP-001",
      "Responsibility Integrity",
      "Responsibility metadata must remain published and structurally complete.",
      "Information",
      "Responsibility",
    ),
    createRule(
      "executive-organization-validation-rule-hierarchy-integrity",
      "BUS30V-HIER-001",
      "Hierarchy Integrity",
      "Hierarchy metadata must remain published and structurally complete.",
      "Warning",
      "Hierarchy",
    ),
    createRule(
      "executive-organization-validation-rule-registry-integrity",
      "BUS30V-REG-001",
      "Registry Integrity",
      "Registry validation metadata must remain PASS and metadata-only.",
      "Critical",
      "Registry",
    ),
    createRule(
      "executive-organization-validation-rule-model-integrity",
      "BUS30V-MODEL-001",
      "Model Integrity",
      "Model metadata and aggregate model public surface must remain deterministic.",
      "Critical",
      "Model",
    ),
    createRule(
      "executive-organization-validation-rule-public-api",
      "BUS30V-API-001",
      "Public API Integrity",
      "Public API metadata must remain stable and metadata-only.",
      "Critical",
      "Platform",
    ),
  ]);

const byCode = (code: ExecutiveOrganizationValidationRule["ruleCode"]) =>
  EXECUTIVE_ORGANIZATION_VALIDATION_RULES.find((rule) => rule.ruleCode === code)!;

export const EXECUTIVE_ORGANIZATION_VALIDATION_GROUPS: readonly ExecutiveOrganizationValidationGroup[] =
  Object.freeze([
    Object.freeze({
      groupId: "executive-organization-validation-group-platform-integrity",
      groupName: "Platform Integrity",
      description: "Validates platform identity and public API stability metadata.",
      rules: Object.freeze([
        byCode("BUS30V-PLATFORM-001"),
        byCode("BUS30V-API-001"),
      ]),
      metadata: groupMetadata,
      metadataOnly: true,
      immutable: true,
    }),
    Object.freeze({
      groupId: "executive-organization-validation-group-organization-structure",
      groupName: "Organization Structure",
      description: "Validates organization-level structural metadata.",
      rules: Object.freeze([byCode("BUS30V-ORG-001")]),
      metadata: groupMetadata,
      metadataOnly: true,
      immutable: true,
    }),
    Object.freeze({
      groupId: "executive-organization-validation-group-organization-units",
      groupName: "Organization Units",
      description: "Validates organization unit metadata.",
      rules: Object.freeze([byCode("BUS30V-UNIT-001")]),
      metadata: groupMetadata,
      metadataOnly: true,
      immutable: true,
    }),
    Object.freeze({
      groupId: "executive-organization-validation-group-executive-roles",
      groupName: "Executive Roles",
      description: "Validates executive role metadata.",
      rules: Object.freeze([byCode("BUS30V-ROLE-001")]),
      metadata: groupMetadata,
      metadataOnly: true,
      immutable: true,
    }),
    Object.freeze({
      groupId: "executive-organization-validation-group-executive-positions",
      groupName: "Executive Positions",
      description: "Validates executive position metadata.",
      rules: Object.freeze([byCode("BUS30V-POS-001")]),
      metadata: groupMetadata,
      metadataOnly: true,
      immutable: true,
    }),
    Object.freeze({
      groupId: "executive-organization-validation-group-reporting-relationships",
      groupName: "Reporting Relationships",
      description: "Validates reporting relationship metadata.",
      rules: Object.freeze([byCode("BUS30V-REPORT-001")]),
      metadata: groupMetadata,
      metadataOnly: true,
      immutable: true,
    }),
    Object.freeze({
      groupId: "executive-organization-validation-group-ownership",
      groupName: "Ownership",
      description: "Validates ownership metadata.",
      rules: Object.freeze([byCode("BUS30V-OWN-001")]),
      metadata: groupMetadata,
      metadataOnly: true,
      immutable: true,
    }),
    Object.freeze({
      groupId: "executive-organization-validation-group-responsibilities",
      groupName: "Responsibilities",
      description: "Validates responsibility metadata.",
      rules: Object.freeze([byCode("BUS30V-RESP-001")]),
      metadata: groupMetadata,
      metadataOnly: true,
      immutable: true,
    }),
    Object.freeze({
      groupId: "executive-organization-validation-group-hierarchy",
      groupName: "Hierarchy",
      description: "Validates hierarchy metadata.",
      rules: Object.freeze([byCode("BUS30V-HIER-001")]),
      metadata: groupMetadata,
      metadataOnly: true,
      immutable: true,
    }),
    Object.freeze({
      groupId: "executive-organization-validation-group-registry-integrity",
      groupName: "Registry Integrity",
      description: "Validates registry metadata status.",
      rules: Object.freeze([byCode("BUS30V-REG-001")]),
      metadata: groupMetadata,
      metadataOnly: true,
      immutable: true,
    }),
    Object.freeze({
      groupId: "executive-organization-validation-group-model-integrity",
      groupName: "Model Integrity",
      description: "Validates model metadata and aggregate integrity.",
      rules: Object.freeze([byCode("BUS30V-MODEL-001")]),
      metadata: groupMetadata,
      metadataOnly: true,
      immutable: true,
    }),
    Object.freeze({
      groupId: "executive-organization-validation-group-public-api",
      groupName: "Public API",
      description: "Validates public API metadata completeness.",
      rules: Object.freeze([byCode("BUS30V-API-001")]),
      metadata: groupMetadata,
      metadataOnly: true,
      immutable: true,
    }),
  ]);

export const EXECUTIVE_ORGANIZATION_VALIDATION_SUMMARY: ExecutiveOrganizationValidationSummary =
  Object.freeze({
    ruleCount: EXECUTIVE_ORGANIZATION_VALIDATION_RULES.length,
    groupCount: EXECUTIVE_ORGANIZATION_VALIDATION_GROUPS.length,
    platformStatus: "Published",
    compatibilityStatus: "Compatible",
    metadata: summaryMetadata,
    metadataOnly: true,
    immutable: true,
  });

export const EXECUTIVE_ORGANIZATION_VALIDATION_COMPATIBILITY: ExecutiveOrganizationValidationCompatibility =
  Object.freeze({
    supportedPlatformVersion: EXECUTIVE_ORGANIZATION_PLATFORM_VERSION,
    supportedRegistryVersion: EXECUTIVE_ORGANIZATION_PLATFORM_REGISTRY.platformVersion,
    supportedModelVersion: EXECUTIVE_ORGANIZATION_PLATFORM_MODEL.platformVersion,
    compatibilityStatus: "Compatible",
    metadata: compatibilityMetadata,
    metadataOnly: true,
    immutable: true,
  });

export const EXECUTIVE_ORGANIZATION_PLATFORM_VALIDATION: ExecutiveOrganizationPlatformValidation =
  Object.freeze({
    platformId: EXECUTIVE_ORGANIZATION_PLATFORM_ID,
    platformVersion: EXECUTIVE_ORGANIZATION_PLATFORM_VERSION,
    platformNamespace: EXECUTIVE_ORGANIZATION_PLATFORM_NAMESPACE,
    platformStatus: "Published",
    validationVersion: EXECUTIVE_ORGANIZATION_VALIDATION_VERSION,
    validationStatus: "PASS",
    validationMetadata: EXECUTIVE_ORGANIZATION_VALIDATION_METADATA,
    metadataOnly: true,
    immutable: true,
  });

export const EXECUTIVE_ORGANIZATION_VALIDATION_RESULT: ExecutiveOrganizationValidationResult =
  Object.freeze({
    validationId: "executive-organization-validation",
    validationVersion: EXECUTIVE_ORGANIZATION_VALIDATION_VERSION,
    validationStatus: "PASS",
    summary: EXECUTIVE_ORGANIZATION_VALIDATION_SUMMARY,
    metadata: EXECUTIVE_ORGANIZATION_VALIDATION_METADATA,
    metadataOnly: true,
    immutable: true,
  });

export const EXECUTIVE_ORGANIZATION_VALIDATION_PUBLIC_APIS = Object.freeze([
  "EXECUTIVE_ORGANIZATION_VALIDATION_NAMESPACE",
  "EXECUTIVE_ORGANIZATION_VALIDATION_VERSION",
  "EXECUTIVE_ORGANIZATION_VALIDATION_DESCRIPTION",
  "EXECUTIVE_ORGANIZATION_VALIDATION_METADATA",
  "EXECUTIVE_ORGANIZATION_PLATFORM_VALIDATION",
  "EXECUTIVE_ORGANIZATION_VALIDATION_RULES",
  "EXECUTIVE_ORGANIZATION_VALIDATION_GROUPS",
  "EXECUTIVE_ORGANIZATION_VALIDATION_SUMMARY",
  "EXECUTIVE_ORGANIZATION_VALIDATION_COMPATIBILITY",
  "EXECUTIVE_ORGANIZATION_VALIDATION_RESULT",
  "ExecutiveOrganizationValidationFoundation",
] as const);

export const ExecutiveOrganizationValidationFoundation: ExecutiveOrganizationValidationBundle =
  Object.freeze({
    platform: EXECUTIVE_ORGANIZATION_PLATFORM_VALIDATION,
    rules: EXECUTIVE_ORGANIZATION_VALIDATION_RULES,
    groups: EXECUTIVE_ORGANIZATION_VALIDATION_GROUPS,
    summary: EXECUTIVE_ORGANIZATION_VALIDATION_SUMMARY,
    compatibility: EXECUTIVE_ORGANIZATION_VALIDATION_COMPATIBILITY,
    validation: EXECUTIVE_ORGANIZATION_VALIDATION_RESULT,
    metadata: EXECUTIVE_ORGANIZATION_VALIDATION_METADATA,
    publicApis: EXECUTIVE_ORGANIZATION_VALIDATION_PUBLIC_APIS,
    metadataOnly: true,
    immutable: true,
  });

export const EXECUTIVE_ORGANIZATION_VALIDATION_FOUNDATION_COMPATIBILITY = Object.freeze({
  contractPlatformId: EXECUTIVE_ORGANIZATION_PLATFORM_ID,
  registryValidationStatus: EXECUTIVE_ORGANIZATION_REGISTRY_VALIDATION.validationStatus,
  modelNamespace: EXECUTIVE_ORGANIZATION_MODEL_METADATA.modelNamespace,
  modelDescription: EXECUTIVE_ORGANIZATION_MODEL_DESCRIPTION,
  publicApiCount: EXECUTIVE_ORGANIZATION_MODEL_PUBLIC_APIS.length,
  organizationCount: EXECUTIVE_ORGANIZATION_REGISTRY.organizations.length,
  unitCount: EXECUTIVE_ORGANIZATION_UNIT_REGISTRY.units.length,
  roleCount: EXECUTIVE_ROLE_REGISTRY.roles.length,
  positionCount: EXECUTIVE_POSITION_REGISTRY.positions.length,
  reportingCount: EXECUTIVE_REPORTING_REGISTRY.relationships.length,
  ownershipCount: EXECUTIVE_OWNERSHIP_REGISTRY.ownershipEntries.length,
  responsibilityCount: EXECUTIVE_RESPONSIBILITY_REGISTRY.responsibilities.length,
  hierarchyCount: EXECUTIVE_HIERARCHY_MODELS.length,
  aggregateModelId: EXECUTIVE_ORGANIZATION_MODEL.modelId,
  metadataOnly: true,
  immutable: true,
});
