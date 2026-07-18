/**
 * DKL-1:4 — Data Knowledge Foundation Validation.
 *
 * Metadata-only type definitions and deterministic helpers for the DKL
 * Foundation validation platform. All evidence is derived from approved public
 * metadata of DKL-1:1 through DKL-1:3. No I/O, no reflection, no side effects.
 */

export type ValidationSeverity = "ERROR" | "WARNING" | "INFO";

export type ValidationResult = "PASS" | "FAIL";

export type ValidationDomainKey =
  | "foundation"
  | "registry"
  | "model"
  | "ownership"
  | "public-api";

export type ValidationSourcePhase = "DKL-1:1" | "DKL-1:2" | "DKL-1:3";

export type ValidationEvidenceValue = string | number | boolean;

export type ValidationEvidence = Readonly<Record<string, ValidationEvidenceValue>>;

export interface ValidationRuleDescriptor {
  readonly id: string;
  readonly domain: ValidationDomainKey;
  readonly title: string;
  readonly description: string;
  readonly severity: ValidationSeverity;
  readonly expected: string;
  readonly actual: string;
  readonly result: ValidationResult;
  readonly evidence: ValidationEvidence;
  readonly sourcePhase: ValidationSourcePhase;
}

export interface ValidationRuleInput {
  readonly id: string;
  readonly domain: ValidationDomainKey;
  readonly severity: ValidationSeverity;
  readonly sourcePhase: ValidationSourcePhase;
  readonly title: string;
  readonly description: string;
  readonly expected: string;
  readonly actual: string;
  readonly condition: boolean;
  readonly evidence: ValidationEvidence;
}

export interface ValidationDomainDescriptor {
  readonly domain: ValidationDomainKey;
  readonly name: string;
  readonly sourcePhase: ValidationSourcePhase;
  readonly rules: readonly ValidationRuleDescriptor[];
  readonly passed: boolean;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface ValidationManifestDescriptor {
  readonly validationId: "DKL-1:4";
  readonly name: "Data Knowledge Foundation Validation";
  readonly namespace: "nexora.dkl.foundation.validation";
  readonly version: "1.0.0";
  readonly sourcePhases: readonly ValidationSourcePhase[];
  readonly validationDomains: readonly ValidationDomainKey[];
  readonly ruleCount: number;
  readonly ruleIds: readonly string[];
  readonly severityInventory: Readonly<{
    ERROR: number;
    WARNING: number;
    INFO: number;
  }>;
  readonly compatibility: Readonly<{
    foundationCompatible: true;
    registryCompatible: true;
    modelCompatible: true;
    metadataOnly: true;
    runtimeFree: true;
    deterministic: true;
    ownershipProtected: true;
    publicApiStable: true;
  }>;
  readonly validationStatus: "VALIDATED";
  readonly stability: "Stable";
  readonly readiness: "ReadyForManifest";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface ValidationRunnerResult {
  readonly totalRules: number;
  readonly passedRules: number;
  readonly failedRules: number;
  readonly warningCount: number;
  readonly errorCount: number;
  readonly status: "VALIDATED" | "FAILED";
  readonly readiness: "ReadyForManifest" | "NotReady";
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface DataKnowledgeFoundationValidationDescriptor {
  readonly foundation: ValidationDomainDescriptor;
  readonly registry: ValidationDomainDescriptor;
  readonly model: ValidationDomainDescriptor;
  readonly ownership: ValidationDomainDescriptor;
  readonly publicApi: ValidationDomainDescriptor;
  readonly rules: readonly ValidationRuleDescriptor[];
  readonly manifest: ValidationManifestDescriptor;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface DataKnowledgeFoundationValidationSummary {
  readonly validationId: "DKL-1:4";
  readonly version: "1.0.0";
  readonly domainCount: number;
  readonly ruleCount: number;
  readonly passedRules: number;
  readonly failedRules: number;
  readonly status: "VALIDATED" | "FAILED";
  readonly readiness: "ReadyForManifest" | "NotReady";
  readonly metadataOnly: true;
  readonly immutable: true;
}

/**
 * Build a frozen, deterministic validation rule from static metadata evidence.
 */
export const createValidationRule = (input: ValidationRuleInput): ValidationRuleDescriptor =>
  Object.freeze({
    id: input.id,
    domain: input.domain,
    title: input.title,
    description: input.description,
    severity: input.severity,
    expected: input.expected,
    actual: input.actual,
    result: input.condition ? ("PASS" as const) : ("FAIL" as const),
    evidence: Object.freeze({ ...input.evidence }),
    sourcePhase: input.sourcePhase,
  });

/**
 * Freeze a validation domain descriptor and derive its aggregate pass state.
 */
export const createValidationDomain = (
  domain: ValidationDomainKey,
  name: string,
  sourcePhase: ValidationSourcePhase,
  rules: readonly ValidationRuleDescriptor[]
): ValidationDomainDescriptor =>
  Object.freeze({
    domain,
    name,
    sourcePhase,
    rules: Object.freeze([...rules]),
    passed: rules.every((rule) => rule.result === "PASS"),
    metadataOnly: true,
    immutable: true,
  });

/**
 * Deterministic deep-frozen predicate over plain metadata structures.
 * Reads only enumerable own values; performs no reflection over source code.
 */
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
