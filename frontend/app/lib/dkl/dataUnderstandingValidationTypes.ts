/**
 * DKL-3:4 — Data Understanding Validation Types.
 *
 * Readonly contracts for deterministic validation summaries. Validation
 * verifies structural correctness only. No runtime understanding.
 *
 * Ownership: owned exclusively by DKL-3:4.
 */

export type DataUnderstandingValidationStatus =
  | "Valid"
  | "Invalid"
  | "Blocked";

export type DataUnderstandingValidationSeverity =
  | "Blocking"
  | "Error"
  | "Warning"
  | "Info";

export type DataUnderstandingValidationCategory =
  | "Foundation"
  | "Registry"
  | "Model"
  | "Subject"
  | "Candidate"
  | "Evidence"
  | "Relationship"
  | "Clarification"
  | "Confidence"
  | "Ambiguity"
  | "Snapshot"
  | "Result"
  | "Reference"
  | "Ownership"
  | "Boundary"
  | "Lifecycle"
  | "ProcessingPolicy"
  | "Dependency"
  | "Identity"
  | "PublicApi";

export interface DataUnderstandingValidationIssue {
  readonly code: string;
  readonly category: DataUnderstandingValidationCategory;
  readonly severity: DataUnderstandingValidationSeverity;
  readonly message: string;
  readonly field: string | null;
  readonly evidence: string;
  readonly blocking: boolean;
}

export interface DataUnderstandingValidationCounts {
  readonly total: number;
  readonly blocking: number;
  readonly error: number;
  readonly warning: number;
  readonly info: number;
  readonly pass: number;
  readonly fail: number;
}

export interface DataUnderstandingValidationRule {
  readonly ruleId: string;
  readonly category: DataUnderstandingValidationCategory;
  readonly name: string;
  readonly description: string;
  readonly blocking: boolean;
}

export interface DataUnderstandingValidationRuleResult {
  readonly ruleId: string;
  readonly category: DataUnderstandingValidationCategory;
  readonly status: "PASS" | "FAIL" | "WARNING";
  readonly severity: DataUnderstandingValidationSeverity;
  readonly message: string;
  readonly evidence: string;
  readonly blocking: boolean;
}

export interface DataUnderstandingValidationIdentity {
  readonly validationId: string;
  readonly validationVersion: string;
  readonly validationName: string;
  readonly validationNamespace: string;
  readonly owner: string;
  readonly sourcePhase: "DKL-3:4";
  readonly platformId: "DKL-3";
  readonly status: "ValidationComplete";
  readonly readiness: "ReadyForManifest";
}

export interface DataUnderstandingValidationMetadata {
  readonly metadataOnly: true;
  readonly validationOnly: true;
  readonly deterministic: true;
  readonly immutable: true;
  readonly semanticInferencePerformed: false;
  readonly understandingPerformed: false;
  readonly candidateGenerationPerformed: false;
  readonly businessObjectsCreated: false;
  readonly knowledgeGraphCreated: false;
  readonly persistencePerformed: false;
  readonly aiExecuted: false;
  readonly engineReasoningPerformed: false;
  readonly inputMutated: false;
  readonly modelsRepaired: false;
}

export interface DataUnderstandingValidationSummary {
  readonly valid: boolean;
  readonly status: DataUnderstandingValidationStatus;
  readonly ruleCount: number;
  readonly passCount: number;
  readonly failCount: number;
  readonly warningCount: number;
  readonly blockingIssueCount: number;
  readonly readiness: "ReadyForManifest" | "NotReady";
  readonly nextPhase: "DKL-3:5";
  readonly message: string;
}

export interface DataUnderstandingValidationResult {
  readonly valid: boolean;
  readonly status: DataUnderstandingValidationStatus;
  readonly issues: readonly DataUnderstandingValidationIssue[];
  readonly warnings: readonly DataUnderstandingValidationIssue[];
  readonly ruleResults: readonly DataUnderstandingValidationRuleResult[];
  readonly counts: DataUnderstandingValidationCounts;
  readonly summary: DataUnderstandingValidationSummary;
  readonly metadata: DataUnderstandingValidationMetadata;
  readonly readiness: "ReadyForManifest" | "NotReady";
}

/**
 * Structural view of the DKL-3:3 model aggregate accepted by the validator.
 * Callers may supply the canonical model or a test double. Never mutated.
 */
export interface DataUnderstandingModelValidationView {
  readonly identity?: {
    readonly modelId?: string;
    readonly modelVersion?: string;
    readonly sourcePhase?: string;
    readonly status?: string;
    readonly readiness?: string;
  } | null;
  readonly version?: string;
  readonly modelKinds?: readonly string[];
  readonly modelKindCount?: number;
  readonly candidate?: {
    readonly allowedCandidateTypes?: readonly string[];
    readonly allowedCandidateStatuses?: readonly string[];
    readonly allowedConfidenceLevels?: readonly string[];
    readonly allowedAmbiguityLevels?: readonly string[];
    readonly fieldCount?: number;
    readonly forbiddenContents?: readonly string[];
    readonly boundaries?: {
      readonly businessObjectForbidden?: boolean;
      readonly knowledgeGraphForbidden?: boolean;
      readonly persistenceForbidden?: boolean;
      readonly aiForbidden?: boolean;
      readonly engineReasoningForbidden?: boolean;
    };
    readonly registry?: {
      readonly candidateTypeCount?: number;
      readonly candidatesAreNotBusinessObjects?: boolean;
    };
  } | null;
  readonly evidence?: {
    readonly allowedCategories?: readonly string[];
    readonly allowedPriorityTiers?: readonly string[];
    readonly limitationsRequired?: boolean;
    readonly runtimeCalculationForbidden?: boolean;
    readonly registry?: {
      readonly evidenceCategoryCount?: number;
    };
  } | null;
  readonly relationship?: {
    readonly relationshipKinds?: readonly string[];
    readonly relationshipKindCount?: number;
    readonly forbiddenMeanings?: readonly string[];
  } | null;
  readonly snapshot?: {
    readonly snapshotSectionCount?: number;
    readonly resultFieldCount?: number;
    readonly allowedScopes?: readonly string[];
    readonly allowedResultStatuses?: readonly string[];
    readonly forbiddenOutputs?: readonly string[];
  } | null;
  readonly subject?: {
    readonly allowedSubjectKinds?: readonly string[];
    readonly subjectCount?: number;
    readonly registrySubjectCount?: number;
  } | null;
  readonly ambiguity?: {
    readonly allowedAmbiguityLevels?: readonly string[];
  } | null;
  readonly clarification?: {
    readonly allowedStatuses?: readonly string[];
    readonly clarificationEngineForbidden?: boolean;
  } | null;
  readonly confidence?: {
    readonly allowedConfidenceLevels?: readonly string[];
    readonly floatingPointForbidden?: boolean;
    readonly guaranteedTruthForbidden?: boolean;
  } | null;
  readonly scope?: {
    readonly allowedScopes?: readonly string[];
  } | null;
  readonly lifecycle?: {
    readonly allowedStates?: readonly string[];
    readonly stateCount?: number;
  } | null;
  readonly processingPolicy?: {
    readonly policies?: {
      readonly previewOnlyInputRequired?: boolean;
      readonly allowCanonicalBusinessObjects?: boolean;
      readonly allowPersistence?: boolean;
      readonly allowAiProviderCalls?: boolean;
      readonly allowExecutiveReasoning?: boolean;
      readonly requireEvidenceForCandidates?: boolean;
      readonly requireLimitationsForEvidence?: boolean;
      readonly preserveAmbiguity?: boolean;
    };
  } | null;
  readonly result?: {
    readonly readiness?: string;
    readonly allowedStatuses?: readonly string[];
  } | null;
  readonly foundationReference?: {
    readonly foundationId?: string;
    readonly sourcePhase?: string;
    readonly readiness?: string;
  } | null;
  readonly registryReference?: {
    readonly registryId?: string;
    readonly sourcePhase?: string;
    readonly readiness?: string;
  } | null;
  readonly pipelineReference?: {
    readonly targetPlatform?: string;
    readonly readiness?: string;
    readonly previewOnlyRequired?: boolean;
    readonly contractValidRequired?: boolean;
  } | null;
  readonly validationSummaryReference?: {
    readonly validationPhase?: string;
    readonly readyForBusinessObjects?: boolean;
  } | null;
  readonly ownership?: {
    readonly owns?: readonly string[];
    readonly doesNotOwn?: readonly string[];
  } | null;
  readonly boundaries?: {
    readonly createsBusinessObjects?: boolean;
    readonly createsKnowledgeGraph?: boolean;
    readonly persistsDataset?: boolean;
    readonly executesAiModels?: boolean;
    readonly executesEngineReasoning?: boolean;
    readonly rendersUi?: boolean;
  } | null;
  readonly dependencies?: {
    readonly dkl31Foundation?: { readonly readyForRegistry?: boolean };
    readonly dkl32Registry?: { readonly readyForModel?: boolean };
    readonly pipelineUnderstandingPlatform?: { readonly readyForDKL3Intake?: boolean };
  } | null;
  readonly readiness?: {
    readonly ReadyForValidation?: boolean;
    readonly ModelComplete?: boolean;
    readonly BusinessObjectCreationForbidden?: boolean;
    readonly KnowledgeGraphForbidden?: boolean;
    readonly PersistenceForbidden?: boolean;
    readonly AIFree?: boolean;
    readonly EngineFree?: boolean;
  } | null;
  readonly publicApiNames?: readonly string[];
  readonly nextPhase?: string;
}

export interface DataUnderstandingValidationManifestDescriptor {
  readonly validationId: string;
  readonly version: string;
  readonly name: string;
  readonly owner: string;
  readonly sourcePhase: "DKL-3:4";
  readonly ruleCount: number;
  readonly categoryCount: number;
  readonly publicApiCount: 8;
  readonly metadataOnly: true;
  readonly validationOnly: true;
  readonly deterministic: true;
  readonly immutable: true;
  readonly semanticInferencePerformed: false;
  readonly understandingPerformed: false;
  readonly businessObjectsCreated: false;
  readonly knowledgeGraphCreated: false;
  readonly persistencePerformed: false;
  readonly aiExecuted: false;
  readonly engineReasoningPerformed: false;
  readonly readiness: "ReadyForManifest";
  readonly nextPhase: "DKL-3:5";
}
