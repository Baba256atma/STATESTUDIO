import {
  EXECUTIVE_RESOURCE_PLATFORM_ID,
  EXECUTIVE_RESOURCE_PLATFORM_NAME,
  EXECUTIVE_RESOURCE_PLATFORM_NAMESPACE,
  EXECUTIVE_RESOURCE_PLATFORM_VERSION,
} from "./executiveResourceIndex.ts";
import {
  EXECUTIVE_RESOURCE_PLATFORM_REGISTRY,
  EXECUTIVE_RESOURCE_REGISTRY_VALIDATION,
} from "./executiveResourceRegistryIndex.ts";
import {
  EXECUTIVE_RESOURCE_MODEL_METADATA,
  EXECUTIVE_RESOURCE_MODEL_PUBLIC_APIS,
  EXECUTIVE_RESOURCE_PLATFORM_MODEL,
} from "./executiveResourceModelIndex.ts";
import type {
  ExecutiveResourcePlatformValidation,
  ExecutiveResourceValidationBundle,
  ExecutiveResourceValidationCompatibility,
  ExecutiveResourceValidationGroup,
  ExecutiveResourceValidationMetadata,
  ExecutiveResourceValidationResult,
  ExecutiveResourceValidationRule,
  ExecutiveResourceValidationSummary,
} from "./executiveResourceValidationTypes.ts";

export const EXECUTIVE_RESOURCE_VALIDATION_NAMESPACE =
  "nexora.bus.executive-resource.validation" as const;

export const EXECUTIVE_RESOURCE_VALIDATION_VERSION = "1.0.0" as const;

export const EXECUTIVE_RESOURCE_VALIDATION_DESCRIPTION =
  "Canonical metadata-only validation layer for executive resource intelligence." as const;

export const EXECUTIVE_RESOURCE_VALIDATION_METADATA: ExecutiveResourceValidationMetadata =
  Object.freeze({
    validationNamespace: EXECUTIVE_RESOURCE_VALIDATION_NAMESPACE,
    validationVersion: EXECUTIVE_RESOURCE_VALIDATION_VERSION,
    validationDescription: EXECUTIVE_RESOURCE_VALIDATION_DESCRIPTION,
    validationDependencies: Object.freeze([
      "BUS-31:1 Executive Resource Intelligence Contracts",
      "BUS-31:2 Executive Resource Registry",
      "BUS-31:3 Executive Resource Model",
    ]),
    validationConsumers: Object.freeze([
      "BUS-31:5 Manifest",
      "APP Executive Intelligence",
      "LAY Executive Layer",
    ]),
    validationStatus: "PASS",
    metadataOnly: true,
    immutable: true,
  });

const ruleMetadata = Object.freeze({
  createdBy: "BUS-31:4",
  metadataOnly: true,
  immutable: true,
} as const);

const createRule = (
  ruleId: ExecutiveResourceValidationRule["ruleId"],
  ruleCode: ExecutiveResourceValidationRule["ruleCode"],
  ruleName: string,
  description: string,
  severity: ExecutiveResourceValidationRule["severity"],
  category: ExecutiveResourceValidationRule["category"],
): ExecutiveResourceValidationRule =>
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

export const EXECUTIVE_RESOURCE_VALIDATION_RULES: readonly ExecutiveResourceValidationRule[] =
  Object.freeze([
    createRule(
      "executive-resource-validation-rule-platform-identity",
      "BUS31V-PLATFORM-001",
      "Platform Identity Integrity",
      "Platform metadata must remain aligned across contracts, registry, and model surfaces.",
      "Critical",
      "Platform",
    ),
    createRule(
      "executive-resource-validation-rule-resource-integrity",
      "BUS31V-RESOURCE-001",
      "Resource Integrity",
      "Resource metadata must remain published and structurally complete.",
      "Error",
      "Resource",
    ),
    createRule(
      "executive-resource-validation-rule-category-integrity",
      "BUS31V-CATEGORY-001",
      "Category Integrity",
      "Resource category metadata must remain published and namespace-compatible.",
      "Error",
      "Category",
    ),
    createRule(
      "executive-resource-validation-rule-type-integrity",
      "BUS31V-TYPE-001",
      "Type Integrity",
      "Resource type metadata must remain published and structurally complete.",
      "Warning",
      "Type",
    ),
    createRule(
      "executive-resource-validation-rule-owner-integrity",
      "BUS31V-OWNER-001",
      "Owner Integrity",
      "Resource owner metadata must remain published and structurally complete.",
      "Warning",
      "Owner",
    ),
    createRule(
      "executive-resource-validation-rule-allocation-integrity",
      "BUS31V-ALLOCATION-001",
      "Allocation Integrity",
      "Resource allocation metadata must remain published and structurally complete.",
      "Information",
      "Allocation",
    ),
    createRule(
      "executive-resource-validation-rule-capacity-integrity",
      "BUS31V-CAPACITY-001",
      "Capacity Integrity",
      "Resource capacity metadata must remain published and structurally complete.",
      "Information",
      "Capacity",
    ),
    createRule(
      "executive-resource-validation-rule-utilization-integrity",
      "BUS31V-UTILIZATION-001",
      "Utilization Integrity",
      "Resource utilization metadata must remain published and structurally complete.",
      "Information",
      "Utilization",
    ),
    createRule(
      "executive-resource-validation-rule-availability-integrity",
      "BUS31V-AVAILABILITY-001",
      "Availability Integrity",
      "Resource availability metadata must remain published and structurally complete.",
      "Information",
      "Availability",
    ),
    createRule(
      "executive-resource-validation-rule-constraint-integrity",
      "BUS31V-CONSTRAINT-001",
      "Constraint Integrity",
      "Resource constraint metadata must remain published and structurally complete.",
      "Warning",
      "Constraint",
    ),
    createRule(
      "executive-resource-validation-rule-lifecycle-integrity",
      "BUS31V-LIFECYCLE-001",
      "Lifecycle Integrity",
      "Resource lifecycle metadata must remain published and structurally complete.",
      "Warning",
      "Lifecycle",
    ),
    createRule(
      "executive-resource-validation-rule-classification-integrity",
      "BUS31V-CLASSIFICATION-001",
      "Classification Integrity",
      "Resource classification metadata must remain published and structurally complete.",
      "Warning",
      "Classification",
    ),
    createRule(
      "executive-resource-validation-rule-registry-integrity",
      "BUS31V-REGISTRY-001",
      "Registry Integrity",
      "Registry validation metadata must remain PASS and metadata-only.",
      "Critical",
      "Registry",
    ),
    createRule(
      "executive-resource-validation-rule-model-integrity",
      "BUS31V-MODEL-001",
      "Model Integrity",
      "Model metadata and aggregate resource model public surface must remain deterministic.",
      "Critical",
      "Model",
    ),
    createRule(
      "executive-resource-validation-rule-public-api-integrity",
      "BUS31V-API-001",
      "Public API Integrity",
      "Public API metadata must remain stable and metadata-only.",
      "Critical",
      "PublicAPI",
    ),
  ]);

const byCode = (code: ExecutiveResourceValidationRule["ruleCode"]) =>
  EXECUTIVE_RESOURCE_VALIDATION_RULES.find((rule) => rule.ruleCode === code)!;

export const EXECUTIVE_RESOURCE_VALIDATION_GROUPS: readonly ExecutiveResourceValidationGroup[] =
  Object.freeze([
    Object.freeze({
      groupId: "executive-resource-validation-group-platform-integrity",
      groupName: "Platform Integrity",
      description: "Validates platform identity metadata and cross-surface consistency.",
      rules: Object.freeze([
        byCode("BUS31V-PLATFORM-001"),
      ]),
      metadata: ruleMetadata,
      metadataOnly: true,
      immutable: true,
    }),
    Object.freeze({
      groupId: "executive-resource-validation-group-resource-integrity",
      groupName: "Resource Integrity",
      description: "Validates resource metadata completeness.",
      rules: Object.freeze([byCode("BUS31V-RESOURCE-001")]),
      metadata: ruleMetadata,
      metadataOnly: true,
      immutable: true,
    }),
    Object.freeze({
      groupId: "executive-resource-validation-group-category-integrity",
      groupName: "Category Integrity",
      description: "Validates resource category metadata completeness.",
      rules: Object.freeze([byCode("BUS31V-CATEGORY-001")]),
      metadata: ruleMetadata,
      metadataOnly: true,
      immutable: true,
    }),
    Object.freeze({
      groupId: "executive-resource-validation-group-type-integrity",
      groupName: "Type Integrity",
      description: "Validates resource type metadata completeness.",
      rules: Object.freeze([byCode("BUS31V-TYPE-001")]),
      metadata: ruleMetadata,
      metadataOnly: true,
      immutable: true,
    }),
    Object.freeze({
      groupId: "executive-resource-validation-group-owner-integrity",
      groupName: "Owner Integrity",
      description: "Validates resource owner metadata completeness.",
      rules: Object.freeze([byCode("BUS31V-OWNER-001")]),
      metadata: ruleMetadata,
      metadataOnly: true,
      immutable: true,
    }),
    Object.freeze({
      groupId: "executive-resource-validation-group-allocation-integrity",
      groupName: "Allocation Integrity",
      description: "Validates resource allocation metadata completeness.",
      rules: Object.freeze([byCode("BUS31V-ALLOCATION-001")]),
      metadata: ruleMetadata,
      metadataOnly: true,
      immutable: true,
    }),
    Object.freeze({
      groupId: "executive-resource-validation-group-capacity-integrity",
      groupName: "Capacity Integrity",
      description: "Validates resource capacity metadata completeness.",
      rules: Object.freeze([byCode("BUS31V-CAPACITY-001")]),
      metadata: ruleMetadata,
      metadataOnly: true,
      immutable: true,
    }),
    Object.freeze({
      groupId: "executive-resource-validation-group-utilization-integrity",
      groupName: "Utilization Integrity",
      description: "Validates resource utilization metadata completeness.",
      rules: Object.freeze([byCode("BUS31V-UTILIZATION-001")]),
      metadata: ruleMetadata,
      metadataOnly: true,
      immutable: true,
    }),
    Object.freeze({
      groupId: "executive-resource-validation-group-availability-integrity",
      groupName: "Availability Integrity",
      description: "Validates resource availability metadata completeness.",
      rules: Object.freeze([byCode("BUS31V-AVAILABILITY-001")]),
      metadata: ruleMetadata,
      metadataOnly: true,
      immutable: true,
    }),
    Object.freeze({
      groupId: "executive-resource-validation-group-constraint-integrity",
      groupName: "Constraint Integrity",
      description: "Validates resource constraint metadata completeness.",
      rules: Object.freeze([byCode("BUS31V-CONSTRAINT-001")]),
      metadata: ruleMetadata,
      metadataOnly: true,
      immutable: true,
    }),
    Object.freeze({
      groupId: "executive-resource-validation-group-lifecycle-integrity",
      groupName: "Lifecycle Integrity",
      description: "Validates resource lifecycle metadata completeness.",
      rules: Object.freeze([byCode("BUS31V-LIFECYCLE-001")]),
      metadata: ruleMetadata,
      metadataOnly: true,
      immutable: true,
    }),
    Object.freeze({
      groupId: "executive-resource-validation-group-classification-integrity",
      groupName: "Classification Integrity",
      description: "Validates resource classification metadata completeness.",
      rules: Object.freeze([byCode("BUS31V-CLASSIFICATION-001")]),
      metadata: ruleMetadata,
      metadataOnly: true,
      immutable: true,
    }),
    Object.freeze({
      groupId: "executive-resource-validation-group-registry-integrity",
      groupName: "Registry Integrity",
      description: "Validates registry metadata status.",
      rules: Object.freeze([byCode("BUS31V-REGISTRY-001")]),
      metadata: ruleMetadata,
      metadataOnly: true,
      immutable: true,
    }),
    Object.freeze({
      groupId: "executive-resource-validation-group-model-integrity",
      groupName: "Model Integrity",
      description: "Validates model metadata and aggregate resource model integrity.",
      rules: Object.freeze([byCode("BUS31V-MODEL-001")]),
      metadata: ruleMetadata,
      metadataOnly: true,
      immutable: true,
    }),
    Object.freeze({
      groupId: "executive-resource-validation-group-public-api-integrity",
      groupName: "Public API Integrity",
      description: "Validates public API metadata completeness.",
      rules: Object.freeze([byCode("BUS31V-API-001")]),
      metadata: ruleMetadata,
      metadataOnly: true,
      immutable: true,
    }),
  ]);

export const EXECUTIVE_RESOURCE_VALIDATION_SUMMARY: ExecutiveResourceValidationSummary =
  Object.freeze({
    ruleCount: EXECUTIVE_RESOURCE_VALIDATION_RULES.length,
    groupCount: EXECUTIVE_RESOURCE_VALIDATION_GROUPS.length,
    platformStatus: "Published",
    compatibilityStatus: "Compatible",
    metadata: ruleMetadata,
    metadataOnly: true,
    immutable: true,
  });

export const EXECUTIVE_RESOURCE_VALIDATION_COMPATIBILITY: ExecutiveResourceValidationCompatibility =
  Object.freeze({
    supportedPlatformVersion: EXECUTIVE_RESOURCE_PLATFORM_VERSION,
    supportedRegistryVersion: EXECUTIVE_RESOURCE_PLATFORM_REGISTRY.platformVersion,
    supportedModelVersion: EXECUTIVE_RESOURCE_PLATFORM_MODEL.platformVersion,
    compatibilityStatus: "Compatible",
    metadata: ruleMetadata,
    metadataOnly: true,
    immutable: true,
  });

export const EXECUTIVE_RESOURCE_PLATFORM_VALIDATION: ExecutiveResourcePlatformValidation =
  Object.freeze({
    platformId: EXECUTIVE_RESOURCE_PLATFORM_ID,
    platformName: EXECUTIVE_RESOURCE_PLATFORM_NAME,
    platformNamespace: EXECUTIVE_RESOURCE_PLATFORM_NAMESPACE,
    platformVersion: EXECUTIVE_RESOURCE_PLATFORM_VERSION,
    platformStatus: "Published",
    validationVersion: EXECUTIVE_RESOURCE_VALIDATION_VERSION,
    validationStatus: "PASS",
    validationMetadata: EXECUTIVE_RESOURCE_VALIDATION_METADATA,
    metadataOnly: true,
    immutable: true,
  });

export const EXECUTIVE_RESOURCE_VALIDATION_RESULT: ExecutiveResourceValidationResult =
  Object.freeze({
    validationId: "executive-resource-validation",
    validationVersion: EXECUTIVE_RESOURCE_VALIDATION_VERSION,
    validationStatus: "PASS",
    summary: EXECUTIVE_RESOURCE_VALIDATION_SUMMARY,
    metadata: EXECUTIVE_RESOURCE_VALIDATION_METADATA,
    metadataOnly: true,
    immutable: true,
  });

export const EXECUTIVE_RESOURCE_VALIDATION_PUBLIC_APIS = Object.freeze([
  "EXECUTIVE_RESOURCE_VALIDATION_NAMESPACE",
  "EXECUTIVE_RESOURCE_VALIDATION_VERSION",
  "EXECUTIVE_RESOURCE_VALIDATION_DESCRIPTION",
  "EXECUTIVE_RESOURCE_VALIDATION_METADATA",
  "EXECUTIVE_RESOURCE_VALIDATION_RULES",
  "EXECUTIVE_RESOURCE_VALIDATION_GROUPS",
  "EXECUTIVE_RESOURCE_VALIDATION_SUMMARY",
  "EXECUTIVE_RESOURCE_VALIDATION_COMPATIBILITY",
  "EXECUTIVE_RESOURCE_PLATFORM_VALIDATION",
  "EXECUTIVE_RESOURCE_VALIDATION_RESULT",
  "ExecutiveResourceValidationFoundation",
] as const);

export const ExecutiveResourceValidationFoundation: ExecutiveResourceValidationBundle =
  Object.freeze({
    platform: EXECUTIVE_RESOURCE_PLATFORM_VALIDATION,
    rules: EXECUTIVE_RESOURCE_VALIDATION_RULES,
    groups: EXECUTIVE_RESOURCE_VALIDATION_GROUPS,
    summary: EXECUTIVE_RESOURCE_VALIDATION_SUMMARY,
    compatibility: EXECUTIVE_RESOURCE_VALIDATION_COMPATIBILITY,
    validation: EXECUTIVE_RESOURCE_VALIDATION_RESULT,
    metadata: EXECUTIVE_RESOURCE_VALIDATION_METADATA,
    publicApis: EXECUTIVE_RESOURCE_VALIDATION_PUBLIC_APIS,
    metadataOnly: true,
    immutable: true,
  });

export const EXECUTIVE_RESOURCE_VALIDATION_FOUNDATION_COMPATIBILITY = Object.freeze({
  registryValidationStatus: EXECUTIVE_RESOURCE_REGISTRY_VALIDATION.validationStatus,
  modelNamespace: EXECUTIVE_RESOURCE_MODEL_METADATA.modelNamespace,
  modelPublicApiCount: EXECUTIVE_RESOURCE_MODEL_PUBLIC_APIS.length,
  metadataOnly: true,
  immutable: true,
});
