/**
 * DKL-2:4 — Validation Manifest.
 *
 * Assembles the canonical validation rules in deterministic category order,
 * deterministically evaluates them into immutable results, and derives the
 * immutable validation manifest. All values are derived only from immutable
 * in-memory metadata — no source inspection, no reflection.
 *
 * Ownership: owned exclusively by DKL-2:4.
 * Dependency rules: depends only on the DKL-2:4 validation rule modules and
 * types. It is consumed by the validation runner (forward-only).
 */

import { FoundationValidationRules } from "./dataSourceKnowledgeFoundationValidation.ts";
import { ModelValidationRules } from "./dataSourceKnowledgeModelValidation.ts";
import {
  DependencyValidationRules,
  OwnershipValidationRules,
} from "./dataSourceKnowledgeOwnershipValidation.ts";
import {
  DeterminismValidationRules,
  ImmutabilityValidationRules,
  PublicApiValidationRules,
  RuntimeBoundaryValidationRules,
} from "./dataSourceKnowledgePublicApiValidation.ts";
import {
  ReferenceIntegrityValidationRules,
  RegistryValidationRules,
} from "./dataSourceKnowledgeRegistryValidation.ts";
import {
  allUnique,
  CANONICAL_VALIDATION_CATEGORIES,
  evaluateValidationRule,
  VALIDATION_OWNER,
  VALIDATION_VERSION,
  type ValidationCategory,
  type ValidationManifestDescriptor,
  type ValidationResult,
  type ValidationRule,
  type ValidationSeverity,
  type ValidationStatus,
} from "./dataSourceKnowledgeValidationTypes.ts";

export const CanonicalValidationRules: readonly ValidationRule[] = Object.freeze([
  ...FoundationValidationRules,
  ...RegistryValidationRules,
  ...ModelValidationRules,
  ...ReferenceIntegrityValidationRules,
  ...OwnershipValidationRules,
  ...DependencyValidationRules,
  ...PublicApiValidationRules,
  ...ImmutabilityValidationRules,
  ...DeterminismValidationRules,
  ...RuntimeBoundaryValidationRules,
]);

export const CanonicalValidationResults: readonly ValidationResult[] = Object.freeze(
  CanonicalValidationRules.map(evaluateValidationRule)
);

const countByCategory = (category: ValidationCategory): number =>
  CanonicalValidationRules.filter((rule) => rule.category === category).length;

const countBySeverity = (severity: ValidationSeverity): number =>
  CanonicalValidationRules.filter((rule) => rule.severity === severity).length;

const countByStatus = (status: ValidationStatus): number =>
  CanonicalValidationResults.filter((result) => result.status === status).length;

const rulesByCategory = Object.freeze(
  CANONICAL_VALIDATION_CATEGORIES.reduce(
    (acc, category) => {
      acc[category] = countByCategory(category);
      return acc;
    },
    {} as Record<ValidationCategory, number>
  )
);

const rulesBySeverity = Object.freeze({
  Critical: countBySeverity("Critical"),
  High: countBySeverity("High"),
  Medium: countBySeverity("Medium"),
  Low: countBySeverity("Low"),
});

const passCount = countByStatus("PASS");
const failCount = countByStatus("FAIL");
const warningCount = countByStatus("WARNING");
const notApplicableCount = countByStatus("NOT_APPLICABLE");

const duplicateRuleIdStatus: "none" | "detected" = allUnique(
  CanonicalValidationRules.map((rule) => rule.validationRuleId)
)
  ? "none"
  : "detected";

const validationStatus: "ValidationCertified" | "ValidationFailed" =
  failCount === 0 && warningCount === 0 && passCount === CanonicalValidationRules.length
    ? "ValidationCertified"
    : "ValidationFailed";

export const DataSourceKnowledgeValidationManifest = Object.freeze({
  phaseId: "DKL-2:4",
  version: VALIDATION_VERSION,
  name: "Data Source & Knowledge Registry Validation Platform",
  owner: VALIDATION_OWNER,
  sourcePhases: Object.freeze(["DKL-2:1", "DKL-2:2", "DKL-2:3"]),
  dependencies: Object.freeze(["DKL-2:1", "DKL-2:2", "DKL-2:3"]),
  categories: CANONICAL_VALIDATION_CATEGORIES,
  ruleCount: CanonicalValidationRules.length,
  rulesByCategory,
  rulesBySeverity,
  passCount,
  failCount,
  warningCount,
  notApplicableCount,
  validationStatus,
  duplicateRuleIdStatus,
  metadataOnly: true,
  runtimeFree: true,
  deterministic: true,
  immutable: true,
  readiness: "ReadyForManifest",
} as const satisfies ValidationManifestDescriptor);
