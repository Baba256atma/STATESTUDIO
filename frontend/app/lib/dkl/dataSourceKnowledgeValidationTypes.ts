/**
 * DKL-2:4 — Data Source & Knowledge Validation Types.
 *
 * Readonly, metadata-only validation contracts and deterministic rule/result
 * builders for the DKL-2:4 validation platform. Every rule is a static,
 * side-effect-free evaluation over already-declared public architecture.
 *
 * Responsibility: shared immutable validation shapes + rule/result builders.
 * Ownership: owned exclusively by DKL-2:4.
 * Dependency rules: no phase imports; pure type + helper module.
 * Architectural purpose: the canonical validation vocabulary. No runtime
 * behavior, no side effects, no I/O.
 */

export type ValidationStatus = "PASS" | "FAIL" | "WARNING" | "NOT_APPLICABLE";

export type ValidationSeverity = "Critical" | "High" | "Medium" | "Low";

export type ValidationCategory =
  | "Foundation"
  | "Registry"
  | "Model"
  | "ReferenceIntegrity"
  | "Ownership"
  | "Dependency"
  | "PublicApi"
  | "Immutability"
  | "Determinism"
  | "RuntimeBoundary";

export const CANONICAL_VALIDATION_CATEGORIES: readonly ValidationCategory[] = Object.freeze([
  "Foundation",
  "Registry",
  "Model",
  "ReferenceIntegrity",
  "Ownership",
  "Dependency",
  "PublicApi",
  "Immutability",
  "Determinism",
  "RuntimeBoundary",
]);

export interface ValidationEvaluation {
  readonly passed: boolean;
  readonly evidence: readonly string[];
}

export interface ValidationRule {
  readonly validationRuleId: string;
  readonly validationRuleVersion: string;
  readonly validationRuleName: string;
  readonly validationRuleDescription: string;
  readonly category: ValidationCategory;
  readonly severity: ValidationSeverity;
  readonly sourcePhase: string;
  readonly owner: string;
  readonly expectedResult: ValidationStatus;
  readonly readinessImpact: string;
  readonly evaluate: () => ValidationEvaluation;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface ValidationResult {
  readonly validationRuleId: string;
  readonly validationRuleVersion: string;
  readonly validationRuleName: string;
  readonly validationRuleDescription: string;
  readonly category: ValidationCategory;
  readonly severity: ValidationSeverity;
  readonly sourcePhase: string;
  readonly owner: string;
  readonly expectedResult: ValidationStatus;
  readonly actualResult: ValidationStatus;
  readonly status: ValidationStatus;
  readonly evidence: readonly string[];
  readonly readinessImpact: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface ValidationManifestDescriptor {
  readonly phaseId: string;
  readonly version: string;
  readonly name: string;
  readonly owner: string;
  readonly sourcePhases: readonly string[];
  readonly dependencies: readonly string[];
  readonly categories: readonly ValidationCategory[];
  readonly ruleCount: number;
  readonly rulesByCategory: Readonly<Record<ValidationCategory, number>>;
  readonly rulesBySeverity: Readonly<Record<ValidationSeverity, number>>;
  readonly passCount: number;
  readonly failCount: number;
  readonly warningCount: number;
  readonly notApplicableCount: number;
  readonly validationStatus: "ValidationCertified" | "ValidationFailed";
  readonly duplicateRuleIdStatus: "none" | "detected";
  readonly metadataOnly: true;
  readonly runtimeFree: true;
  readonly deterministic: true;
  readonly immutable: true;
  readonly readiness: "ReadyForManifest";
}

export interface ValidationSummaryDescriptor {
  readonly phaseId: string;
  readonly version: string;
  readonly ruleCount: number;
  readonly passCount: number;
  readonly validationStatus: "ValidationCertified" | "ValidationFailed";
  readonly completion: readonly string[];
  readonly readiness: "ReadyForManifest";
  readonly metadataOnly: true;
  readonly deterministic: true;
  readonly immutable: true;
}

export interface ValidationRunResult {
  readonly results: readonly ValidationResult[];
  readonly manifest: ValidationManifestDescriptor;
  readonly summary: ValidationSummaryDescriptor;
  readonly validationStatus: "ValidationCertified" | "ValidationFailed";
  readonly passCount: number;
  readonly failCount: number;
  readonly readiness: "ReadyForManifest";
  readonly metadataOnly: true;
  readonly deterministic: true;
  readonly immutable: true;
}

export const VALIDATION_OWNER = "DKL-2 Data Source & Knowledge Registry";

export const VALIDATION_VERSION = "1.0.0";

export const VALIDATION_SOURCE_PHASE = "DKL-2:4";

export interface ValidationRuleInput {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly category: ValidationCategory;
  readonly severity: ValidationSeverity;
  readonly readinessImpact: string;
  readonly evaluate: () => ValidationEvaluation;
}

/**
 * Build a frozen, deterministic validation rule. Version, source phase, owner,
 * and expected result default to stable canonical values.
 */
export const createValidationRule = (input: ValidationRuleInput): ValidationRule =>
  Object.freeze({
    validationRuleId: input.id,
    validationRuleVersion: VALIDATION_VERSION,
    validationRuleName: input.name,
    validationRuleDescription: input.description,
    category: input.category,
    severity: input.severity,
    sourcePhase: VALIDATION_SOURCE_PHASE,
    owner: VALIDATION_OWNER,
    expectedResult: "PASS",
    readinessImpact: input.readinessImpact,
    evaluate: input.evaluate,
    metadataOnly: true,
    immutable: true,
  });

/** Deterministically evaluate a rule into a frozen validation result. */
export const evaluateValidationRule = (rule: ValidationRule): ValidationResult => {
  const evaluation = rule.evaluate();
  const actualResult: ValidationStatus = evaluation.passed ? "PASS" : "FAIL";
  return Object.freeze({
    validationRuleId: rule.validationRuleId,
    validationRuleVersion: rule.validationRuleVersion,
    validationRuleName: rule.validationRuleName,
    validationRuleDescription: rule.validationRuleDescription,
    category: rule.category,
    severity: rule.severity,
    sourcePhase: rule.sourcePhase,
    owner: rule.owner,
    expectedResult: rule.expectedResult,
    actualResult,
    status: actualResult,
    evidence: Object.freeze([...evaluation.evidence]),
    readinessImpact: rule.readinessImpact,
    metadataOnly: true,
    immutable: true,
  });
};

/** Deterministic deep-freeze check used by immutability rules. */
export const isDeeplyFrozen = (value: unknown): boolean => {
  if (value === null || typeof value !== "object") {
    return true;
  }
  if (!Object.isFrozen(value)) {
    return false;
  }
  for (const nested of Object.values(value as Record<string, unknown>)) {
    if (!isDeeplyFrozen(nested)) {
      return false;
    }
  }
  return true;
};

/** Deterministic uniqueness check for a list of identifiers. */
export const allUnique = (ids: readonly string[]): boolean => new Set(ids).size === ids.length;
