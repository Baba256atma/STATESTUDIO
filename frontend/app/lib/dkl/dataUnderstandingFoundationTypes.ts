/**
 * DKL-3:1 — Data Understanding Foundation Types.
 *
 * Readonly contracts for the Data Understanding Platform foundation.
 * Architectural and metadata-oriented. No runtime behavior.
 *
 * Ownership: owned exclusively by DKL-3:1.
 */

/** Official definition of Data Understanding (DKL-3). */
export const DATA_UNDERSTANDING_DEFINITION =
  "Data Understanding is the evidence-based interpretation of structural data into provisional semantic meaning, ambiguity, and clarification needs without creating canonical Business Objects or executive decisions.";

export type UnderstandingSubjectKind =
  | "Dataset"
  | "Column"
  | "ValuePattern"
  | "RowStructure"
  | "RelationshipHint"
  | "SourceContext"
  | "DiagnosticContext";

export type UnderstandingCandidateStatus =
  | "Proposed"
  | "Supported"
  | "Ambiguous"
  | "Rejected"
  | "Confirmed";

export type UnderstandingCandidateType =
  | "DatasetPurpose"
  | "ColumnRole"
  | "Identifier"
  | "Measure"
  | "Dimension"
  | "TemporalField"
  | "CategoricalField"
  | "TextField"
  | "BooleanIndicator"
  | "EntityReference"
  | "RelationshipHint"
  | "UnknownMeaning";

export type UnderstandingConfidenceLevel =
  | "VeryLow"
  | "Low"
  | "Medium"
  | "High"
  | "VeryHigh";

export type UnderstandingAmbiguityLevel =
  | "None"
  | "Low"
  | "Moderate"
  | "High"
  | "Blocking";

export type ClarificationStatus = "Pending" | "Answered" | "Dismissed" | "Resolved";

export type EvidenceCategory =
  | "HeaderName"
  | "PrimitiveType"
  | "SampleValues"
  | "ValueDistribution"
  | "NullPattern"
  | "UniquenessPattern"
  | "FormatPattern"
  | "SourceRegistry"
  | "ConnectorContext"
  | "ContentTypeContext"
  | "DatasetName"
  | "UserSelection"
  | "ParserDiagnostic"
  | "UserConfirmation"
  | "CrossColumnPattern";

export type EvidenceStrength = "Weak" | "Moderate" | "Strong";

export type UnderstandingScope =
  | "DatasetOnly"
  | "SelectedColumns"
  | "DatasetAndSelectedColumns"
  | "RelationshipHints";

export type DataUnderstandingResultStatus =
  | "NotStarted"
  | "UnderstandingInProgress"
  | "UnderstandingComplete"
  | "UnderstandingWithAmbiguities"
  | "Blocked"
  | "Failed";

export type UnderstandingLifecycleState =
  | "Received"
  | "Validated"
  | "EvidencePrepared"
  | "CandidatesGenerated"
  | "AmbiguitiesAssessed"
  | "ClarificationRequired"
  | "UnderstandingReady"
  | "Completed"
  | "Blocked"
  | "Failed"
  | "Cancelled";

export type FoundationValidationStatus = "Valid" | "Invalid" | "Blocked";

export interface DataUnderstandingFoundationIdentity {
  readonly foundationId: string;
  readonly foundationVersion: string;
  readonly foundationName: string;
  readonly foundationNamespace: string;
  readonly owner: string;
  readonly sourcePhase: "DKL-3:1";
  readonly platformId: string;
  readonly platformVersion: string;
  readonly status: "FoundationComplete";
  readonly readiness: "ReadyForRegistry";
}

export interface UnderstandingCandidate {
  readonly candidateId: string;
  readonly subjectKind: UnderstandingSubjectKind;
  readonly subjectId: string;
  readonly candidateType: UnderstandingCandidateType;
  readonly candidateLabel: string;
  readonly description: string;
  readonly evidenceIds: readonly string[];
  readonly confidenceLevel: UnderstandingConfidenceLevel;
  readonly ambiguityLevel: UnderstandingAmbiguityLevel;
  readonly status: UnderstandingCandidateStatus;
  readonly sourcePhase: string;
}

export interface UnderstandingAmbiguity {
  readonly ambiguityId: string;
  readonly subjectId: string;
  readonly description: string;
  readonly reasonCodes: readonly string[];
  readonly possibleInterpretations: readonly string[];
  readonly requiresClarification: boolean;
  readonly blocking: boolean;
  readonly ambiguityLevel: UnderstandingAmbiguityLevel;
}

export interface ClarificationRequest {
  readonly clarificationId: string;
  readonly subjectId: string;
  readonly question: string;
  readonly reason: string;
  readonly possibleAnswers: readonly string[];
  readonly required: boolean;
  readonly blocking: boolean;
  readonly status: ClarificationStatus;
}

export interface UnderstandingEvidenceItem {
  readonly evidenceId: string;
  readonly category: EvidenceCategory;
  readonly subjectId: string;
  readonly description: string;
  readonly sourceReference: string;
  readonly strength: EvidenceStrength;
  readonly limitations: string;
}

/**
 * Structural view of PipelineUnderstandingIntakePackage required by DKL-3.
 * Runtime packages are produced by UI-PIPE-1:3; DKL-3 does not mutate them.
 */
export interface PipelineIntakePackageView {
  readonly identity: {
    readonly intakeId: string;
    readonly contractVersion: string;
    readonly tenantId: string;
    readonly workspaceId: string;
    readonly sessionId: string;
    readonly datasetId: string;
    readonly handoffId: string;
    readonly sourcePhase: string;
    readonly targetPhase: string;
  };
  readonly source: {
    readonly sourceMode: string;
    readonly sourceName: string;
    readonly sourceRegistryId: string;
    readonly connectorRegistryId: string;
    readonly contentTypeRegistryId: string;
    readonly dklRegistryVersion: string;
  };
  readonly dataset: {
    readonly datasetName: string;
    readonly dataScope: string;
    readonly columnCount: number;
    readonly selectedColumnCount: number;
    readonly parseStatus: string;
  };
  readonly columns: readonly {
    readonly key: string;
    readonly index: number;
  }[];
  readonly diagnostics: {
    readonly hasBlockingIssues: boolean;
    readonly diagnosticCounts: {
      readonly blocking: number;
      readonly total: number;
    };
  };
  readonly review: {
    readonly confirmed: boolean;
    readonly selectedColumnKeys: readonly string[];
    readonly readyForUnderstanding: boolean;
  };
  readonly boundaries: {
    readonly previewOnly: boolean;
  };
  readonly readiness: {
    readonly contractValid: boolean;
    readonly readyForDKL3Intake: boolean;
    readonly reviewConfirmed: boolean;
    readonly sourceReferencesValid: boolean;
    readonly blockingIssueCount: number;
  };
}

export interface DataUnderstandingConsumerContext {
  readonly consumerId: string;
  readonly consumerPhase: string;
  readonly tenantId: string;
  readonly workspaceId: string;
  readonly sessionId: string;
}

export interface DataUnderstandingProcessingPolicy {
  readonly previewOnlyInputRequired: true;
  readonly preserveOriginalValues: true;
  readonly preserveOriginalHeaders: true;
  readonly allowSemanticCandidates: true;
  readonly allowCanonicalBusinessObjects: false;
  readonly allowPersistence: false;
  readonly allowAiProviderCalls: false;
  readonly allowExecutiveReasoning: false;
  readonly requireEvidenceForCandidates: true;
  readonly requireLimitationsForEvidence: true;
  readonly preserveAmbiguity: true;
  readonly requireClarificationForBlockingAmbiguity: true;
}

/** Runtime policy view accepted by foundation validation (callers may violate). */
export interface DataUnderstandingProcessingPolicyInput {
  readonly previewOnlyInputRequired?: boolean;
  readonly preserveOriginalValues?: boolean;
  readonly preserveOriginalHeaders?: boolean;
  readonly allowSemanticCandidates?: boolean;
  readonly allowCanonicalBusinessObjects?: boolean;
  readonly allowPersistence?: boolean;
  readonly allowAiProviderCalls?: boolean;
  readonly allowExecutiveReasoning?: boolean;
  readonly requireEvidenceForCandidates?: boolean;
  readonly requireLimitationsForEvidence?: boolean;
  readonly preserveAmbiguity?: boolean;
  readonly requireClarificationForBlockingAmbiguity?: boolean;
}

export interface DataUnderstandingFoundationInput {
  readonly intakePackage: PipelineIntakePackageView | null | undefined;
  readonly requestedUnderstandingScope: UnderstandingScope | string;
  readonly requestedSubjectIds: readonly string[];
  readonly consumerContext: DataUnderstandingConsumerContext;
  readonly processingPolicy: DataUnderstandingProcessingPolicyInput;
}

export interface DataUnderstandingResultSummary {
  readonly candidateCount: number;
  readonly ambiguityCount: number;
  readonly clarificationCount: number;
  readonly evidenceCount: number;
  readonly message: string;
}

export interface DataUnderstandingResultBoundaries {
  readonly previewOnly: true;
  readonly businessObjectsCreated: false;
  readonly knowledgeGraphCreated: false;
  readonly persistencePerformed: false;
  readonly aiExecuted: false;
  readonly engineReasoningPerformed: false;
}

export interface DataUnderstandingResult {
  readonly resultId: string;
  readonly intakeId: string;
  readonly tenantId: string;
  readonly workspaceId: string;
  readonly sessionId: string;
  readonly datasetId: string;
  readonly status: DataUnderstandingResultStatus;
  readonly datasetCandidates: readonly UnderstandingCandidate[];
  readonly columnCandidates: readonly UnderstandingCandidate[];
  readonly relationshipHints: readonly UnderstandingCandidate[];
  readonly ambiguities: readonly UnderstandingAmbiguity[];
  readonly clarificationRequests: readonly ClarificationRequest[];
  readonly evidence: readonly UnderstandingEvidenceItem[];
  readonly summary: DataUnderstandingResultSummary;
  readonly boundaries: DataUnderstandingResultBoundaries;
  readonly readiness: string;
}

export interface FoundationValidationIssue {
  readonly code: string;
  readonly severity: "Blocking" | "Error" | "Warning";
  readonly message: string;
  readonly field: string | null;
}

export interface DataUnderstandingFoundationValidationResult {
  readonly valid: boolean;
  readonly status: FoundationValidationStatus;
  readonly issues: readonly FoundationValidationIssue[];
  readonly warnings: readonly FoundationValidationIssue[];
  readonly blockingIssueCount: number;
  readonly warningCount: number;
  readonly readiness: "ReadyForRegistry" | "NotReady";
}

export interface LifecycleTransitionResult {
  readonly ok: boolean;
  readonly from: UnderstandingLifecycleState;
  readonly to: UnderstandingLifecycleState;
  readonly failure: { readonly code: string; readonly message: string } | null;
}

export interface DataUnderstandingTerminology {
  readonly StructuralData: string;
  readonly ProvisionalMeaning: string;
  readonly SemanticEvidence: string;
  readonly Ambiguity: string;
  readonly ClarificationNeed: string;
  readonly UnderstandingCandidate: string;
  readonly UnderstandingResult: string;
}
