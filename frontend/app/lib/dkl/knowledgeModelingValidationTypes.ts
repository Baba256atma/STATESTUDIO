/**
 * DKL-4:4 — Knowledge Modeling Validation Types.
 *
 * Readonly contracts for architectural validation of DKL-4:1–4:3.
 * Validates platform integrity only — never operational payloads.
 *
 * Ownership: owned exclusively by DKL-4:4.
 */

export type ValidationCategory =
  | "FoundationIntegrity"
  | "RegistryIntegrity"
  | "ModelIntegrity"
  | "DependencySafety"
  | "OwnershipBoundaries"
  | "CompatibilityExtension"
  | "PublicApiSurface"
  | "ImmutabilityDeterminism";

export type ValidationSeverity = "Critical" | "High" | "Medium";
export type ValidationRuleStatus = "Pass" | "Fail";
export type ValidationRunStatus = "Validated" | "Failed";

export interface KnowledgeModelingValidationIdentityDescriptor {
  readonly validationId: string;
  readonly validationVersion: string;
  readonly validationName: string;
  readonly validationNamespace: string;
  readonly owner: string;
  readonly sourcePhase: "DKL-4:4";
  readonly platformId: "DKL-4";
  readonly platformVersion: string;
  readonly status: "ValidationComplete";
  readonly readiness: "ReadyForManifest";
}

export interface KnowledgeModelingValidationRule {
  readonly ruleId: string;
  readonly ruleName: string;
  readonly category: ValidationCategory;
  readonly severity: ValidationSeverity;
  readonly description: string;
  readonly sourcePhases: readonly string[];
  readonly expected: string;
  readonly blocking: true;
}

export interface KnowledgeModelingValidationRuleResult {
  readonly ruleId: string;
  readonly category: ValidationCategory;
  readonly status: ValidationRuleStatus;
  readonly message: string;
}

export interface KnowledgeModelingValidationResult {
  readonly validationId: string;
  readonly status: ValidationRunStatus;
  readonly readiness: "ReadyForManifest" | "NotReady";
  readonly ruleResults: readonly KnowledgeModelingValidationRuleResult[];
  readonly passCount: number;
  readonly failCount: number;
  readonly categoryCount: number;
  readonly ruleCount: number;
  readonly metadataOnly: true;
  readonly inputMutated: false;
  readonly repaired: false;
  readonly immutable: true;
  readonly deterministic: true;
}
