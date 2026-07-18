/**
 * DKL-5:4 — Knowledge Validation Validation Types.
 *
 * Readonly contracts for architectural validation of DKL-5:1–5:3.
 * Validates platform integrity only — never live organizational knowledge.
 *
 * Ownership: owned exclusively by DKL-5:4.
 */

export type KnowledgeValidationValidationCategory =
  | "Foundation"
  | "Registry"
  | "Model"
  | "Identity"
  | "Target"
  | "Dimension"
  | "Signal"
  | "Trust"
  | "Outcome"
  | "Severity"
  | "Evidence"
  | "Finding"
  | "Issue"
  | "Conflict"
  | "Ambiguity"
  | "Limitation"
  | "ConsumerReadiness"
  | "ExecutiveUsability"
  | "Provenance"
  | "Ownership"
  | "Dependency"
  | "Compatibility"
  | "Extension"
  | "Immutability"
  | "CrossPhase"
  | "Prohibition"
  | "Readiness";

export type ValidationSeverity = "Critical" | "High" | "Medium";
export type ValidationResultStatus = "Pass" | "Fail" | "NotApplicable";

export interface KnowledgeValidationValidationIdentityDescriptor {
  readonly validationId: string;
  readonly validationVersion: string;
  readonly validationName: string;
  readonly validationNamespace: string;
  readonly owner: string;
  readonly sourcePhase: "DKL-5:4";
  readonly platformId: "DKL-5";
  readonly platformVersion: string;
  readonly status: "ValidationComplete";
  readonly readiness: "ReadyForManifest";
}

export interface KnowledgeValidationValidationRule {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly category: KnowledgeValidationValidationCategory;
  readonly sourcePhase: string;
  readonly target: string;
  readonly severity: ValidationSeverity;
  readonly requirement: string;
  readonly expectedCondition: string;
  readonly failureMeaning: string;
  readonly ownership: string;
  readonly deterministic: true;
  readonly runtimeDataRequired: false;
  readonly mandatory: true;
  readonly status: "Active";
}

export interface KnowledgeValidationValidationEvidence {
  readonly ruleId: string;
  readonly sourcePhase: string;
  readonly targetMetadata: string;
  readonly expectedDeclaration: string;
  readonly observedDeclaration: string;
  readonly result: ValidationResultStatus;
  readonly ownership: string;
  readonly runtimeDataUsed: false;
  readonly immutable: true;
}

export interface KnowledgeValidationValidationFailure {
  readonly ruleId: string;
  readonly category: KnowledgeValidationValidationCategory;
  readonly severity: ValidationSeverity;
  readonly failureMeaning: string;
  readonly evidence: KnowledgeValidationValidationEvidence;
}

export interface KnowledgeValidationRuleResult {
  readonly ruleId: string;
  readonly name: string;
  readonly category: KnowledgeValidationValidationCategory;
  readonly severity: ValidationSeverity;
  readonly status: ValidationResultStatus;
  readonly mandatory: true;
  readonly evidence: KnowledgeValidationValidationEvidence;
  readonly failure: KnowledgeValidationValidationFailure | null;
}

export interface KnowledgeValidationCategoryResult {
  readonly category: KnowledgeValidationValidationCategory;
  readonly ruleCount: number;
  readonly passCount: number;
  readonly failCount: number;
  readonly notApplicableCount: number;
  readonly status: ValidationResultStatus;
}

export interface KnowledgeValidationPhaseResult {
  readonly phase: "DKL-5:1" | "DKL-5:2" | "DKL-5:3" | "CrossPhase";
  readonly ruleCount: number;
  readonly passCount: number;
  readonly failCount: number;
  readonly status: ValidationResultStatus;
}

export interface KnowledgeValidationManifestReadinessResult {
  readonly readiness: "ReadyForManifest" | "NotReady";
  readonly overallStatus: ValidationResultStatus;
  readonly mandatoryPassCount: number;
  readonly mandatoryFailCount: number;
  readonly grantedOnlyWhenAllMandatoryPass: true;
}

export interface KnowledgeValidationValidationSummary {
  readonly validationId: string;
  readonly overallStatus: ValidationResultStatus;
  readonly readiness: "ReadyForManifest" | "NotReady";
  readonly ruleCount: number;
  readonly passCount: number;
  readonly failCount: number;
  readonly notApplicableCount: number;
  readonly categoryCount: number;
  readonly categoryResults: readonly KnowledgeValidationCategoryResult[];
  readonly phaseResults: readonly KnowledgeValidationPhaseResult[];
  readonly manifestReadiness: KnowledgeValidationManifestReadinessResult;
  readonly metadataOnly: true;
  readonly runtimeOrganizationalDataAccepted: false;
  readonly sourceScanningUsed: false;
  readonly scoringPerformed: false;
  readonly trustCalculated: false;
  readonly sideEffectsPerformed: false;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface KnowledgeValidationValidationRunResult {
  readonly validationId: string;
  readonly overallStatus: ValidationResultStatus;
  readonly readiness: "ReadyForManifest" | "NotReady";
  readonly ruleResults: readonly KnowledgeValidationRuleResult[];
  readonly categoryResults: readonly KnowledgeValidationCategoryResult[];
  readonly phaseResults: readonly KnowledgeValidationPhaseResult[];
  readonly failures: readonly KnowledgeValidationValidationFailure[];
  readonly summary: KnowledgeValidationValidationSummary;
  readonly manifestReadiness: KnowledgeValidationManifestReadinessResult;
  readonly metadataOnly: true;
  readonly inputMutated: false;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface RuleEvaluationOutcome {
  readonly passed: boolean;
  readonly observedDeclaration: string;
}
