/**
 * DKL-2:4 — Data Source & Knowledge Validation Runner.
 *
 * The single canonical, immutable, metadata-only aggregate root for the DKL-2:4
 * validation platform. It exposes the canonical rules, results, manifest, and
 * summary, plus deterministic read-only accessors, and publishes exactly seven
 * runtime public APIs.
 *
 * Responsibility: aggregate and publish the validation platform + runner.
 * Ownership: owned exclusively by DKL-2:4.
 * Dependency rules: consumes DKL-2:1/2:2/2:3 only through their public APIs and
 * the DKL-2:4 validation modules. Forward-only.
 * Architectural purpose: the authoritative validation entry point. Zero runtime
 * behavior: no I/O, no network, no reflection, no async, no side effects.
 */

import {
  CanonicalValidationResults,
  CanonicalValidationRules,
  DataSourceKnowledgeValidationManifest,
} from "./dataSourceKnowledgeValidationManifest.ts";
import {
  type ValidationCategory,
  type ValidationResult,
  type ValidationRule,
  type ValidationRunResult,
  type ValidationSummaryDescriptor,
} from "./dataSourceKnowledgeValidationTypes.ts";

export { DataSourceKnowledgeValidationManifest } from "./dataSourceKnowledgeValidationManifest.ts";

/** The complete, deterministically ordered canonical validation rules. */
export const DataSourceKnowledgeValidationRules: readonly ValidationRule[] = CanonicalValidationRules;

/** The complete, deterministically ordered canonical validation results. */
export const DataSourceKnowledgeValidationResults: readonly ValidationResult[] =
  CanonicalValidationResults;

const EMPTY_RESULTS: readonly ValidationResult[] = Object.freeze([]);
const EMPTY_RULES: readonly ValidationRule[] = Object.freeze([]);

const resultById: ReadonlyMap<string, ValidationResult> = new Map(
  CanonicalValidationResults.map((result) => [result.validationRuleId, result])
);

const rulesByCategory = (category: ValidationCategory): readonly ValidationRule[] => {
  const matches = CanonicalValidationRules.filter((rule) => rule.category === category);
  return matches.length === 0 ? EMPTY_RULES : Object.freeze(matches);
};

const resultsByCategory = (category: ValidationCategory): readonly ValidationResult[] => {
  const matches = CanonicalValidationResults.filter((result) => result.category === category);
  return matches.length === 0 ? EMPTY_RESULTS : Object.freeze(matches);
};

/** Deterministic summary derived from the immutable validation manifest. */
export const DataSourceKnowledgeValidationSummary = Object.freeze({
  phaseId: DataSourceKnowledgeValidationManifest.phaseId,
  version: DataSourceKnowledgeValidationManifest.version,
  ruleCount: DataSourceKnowledgeValidationManifest.ruleCount,
  passCount: DataSourceKnowledgeValidationManifest.passCount,
  validationStatus: DataSourceKnowledgeValidationManifest.validationStatus,
  completion: Object.freeze([
    "ValidationComplete",
    "ValidationCertified",
    "MetadataOnly",
    "RuntimeFree",
    "Deterministic",
    "Immutable",
    "ReadyForManifest",
  ]),
  readiness: DataSourceKnowledgeValidationManifest.readiness,
  metadataOnly: true,
  deterministic: true,
  immutable: true,
} as const satisfies ValidationSummaryDescriptor);

/** Deterministic, read-only lookup of a validation result by rule id. */
export const getDataSourceKnowledgeValidationResultById = (
  ruleId: string
): ValidationResult | undefined => resultById.get(ruleId);

const CANONICAL_RUN_RESULT: ValidationRunResult = Object.freeze({
  results: CanonicalValidationResults,
  manifest: DataSourceKnowledgeValidationManifest,
  summary: DataSourceKnowledgeValidationSummary,
  validationStatus: DataSourceKnowledgeValidationManifest.validationStatus,
  passCount: DataSourceKnowledgeValidationManifest.passCount,
  failCount: DataSourceKnowledgeValidationManifest.failCount,
  readiness: DataSourceKnowledgeValidationManifest.readiness,
  metadataOnly: true,
  deterministic: true,
  immutable: true,
});

/**
 * Execute the deterministic validation platform. Reads only immutable in-memory
 * public metadata and returns the same deeply frozen canonical result object.
 */
export const runDataSourceKnowledgeValidation = (): ValidationRunResult => CANONICAL_RUN_RESULT;

/** The canonical, deeply frozen aggregate root for the DKL-2:4 platform. */
export const DataSourceKnowledgeValidationPlatform = Object.freeze({
  rules: CanonicalValidationRules,
  results: CanonicalValidationResults,
  manifest: DataSourceKnowledgeValidationManifest,
  summary: DataSourceKnowledgeValidationSummary,
  readiness: DataSourceKnowledgeValidationManifest.readiness,
  getRuleById: (ruleId: string): ValidationRule | undefined =>
    CanonicalValidationRules.find((rule) => rule.validationRuleId === ruleId),
  getResultById: getDataSourceKnowledgeValidationResultById,
  getRulesByCategory: rulesByCategory,
  getResultsByCategory: resultsByCategory,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
});
