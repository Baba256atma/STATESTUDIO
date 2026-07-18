/**
 * DKL-3:3 — Data Understanding Model Types.
 *
 * Readonly contracts for the canonical immutable understanding models.
 * Models represent provisional meaning only. No runtime behavior.
 *
 * Ownership: owned exclusively by DKL-3:3.
 */

import type {
  ClarificationStatus,
  DataUnderstandingProcessingPolicy,
  DataUnderstandingResultStatus,
  EvidenceCategory,
  EvidenceStrength,
  UnderstandingAmbiguityLevel,
  UnderstandingCandidateStatus,
  UnderstandingCandidateType,
  UnderstandingConfidenceLevel,
  UnderstandingLifecycleState,
  UnderstandingScope,
  UnderstandingSubjectKind,
} from "./dataUnderstandingFoundationTypes.ts";
import type {
  ClarificationResolutionState,
  ClarificationType,
  EvidencePriorityTier,
} from "./dataUnderstandingRegistryTypes.ts";

export type UnderstandingRelationshipKind =
  | "supports"
  | "suggests"
  | "belongsToSubject"
  | "derivedFrom"
  | "references"
  | "requiresClarification";

export type ModelFieldCardinality = "one" | "many";

export interface ModelFieldDescriptor {
  readonly fieldName: string;
  readonly fieldKind: string;
  readonly required: boolean;
  readonly cardinality: ModelFieldCardinality;
  readonly description: string;
}

export interface ModelBoundaryMetadata {
  readonly provisionalOnly: true;
  readonly businessObjectForbidden: true;
  readonly knowledgeGraphForbidden: true;
  readonly persistenceForbidden: true;
  readonly aiForbidden: true;
  readonly engineReasoningForbidden: true;
}

export interface ModelOwnershipMetadata {
  readonly owner: string;
  readonly sourcePhase: "DKL-3:3";
  readonly metadataOnly: true;
  readonly modelOnly: true;
}

export interface FoundationReference {
  readonly referenceKind: "FoundationReference";
  readonly foundationId: string;
  readonly foundationVersion: string;
  readonly sourcePhase: "DKL-3:1";
  readonly readiness: "ReadyForRegistry";
}

export interface RegistryReference {
  readonly referenceKind: "RegistryReference";
  readonly registryId: string;
  readonly registryVersion: string;
  readonly sourcePhase: "DKL-3:2";
  readonly readiness: "ReadyForModel";
}

export interface PipelineReference {
  readonly referenceKind: "PipelineReference";
  readonly platformId: string;
  readonly targetPlatform: "DKL-3";
  readonly readiness: "ReadyForDKL3Intake";
  readonly contractValidRequired: true;
  readonly previewOnlyRequired: true;
}

export interface ValidationSummaryReference {
  readonly referenceKind: "ValidationSummaryReference";
  readonly validationPhase: "DKL-3:4";
  readonly status: "Pending" | "Valid" | "Invalid" | "Blocked";
  readonly readyForBusinessObjects: false;
  readonly summaryMessage: string;
}

export interface UnderstandingSubjectModel {
  readonly modelKind: "UnderstandingSubject";
  readonly subjectId: string;
  readonly subjectKind: UnderstandingSubjectKind;
  readonly registryEntryId: string;
  readonly description: string;
  readonly ownership: ModelOwnershipMetadata;
  readonly boundaries: ModelBoundaryMetadata;
}

export interface UnderstandingConfidenceModel {
  readonly modelKind: "UnderstandingConfidence";
  readonly confidenceLevel: UnderstandingConfidenceLevel;
  readonly registryEntryId: string;
  readonly ordinal: number;
  readonly guaranteedTruth: false;
  readonly ownership: ModelOwnershipMetadata;
  readonly boundaries: ModelBoundaryMetadata;
}

export interface UnderstandingAmbiguityModel {
  readonly modelKind: "UnderstandingAmbiguity";
  readonly ambiguityId: string;
  readonly subjectId: string;
  readonly ambiguityLevel: UnderstandingAmbiguityLevel;
  readonly description: string;
  readonly reasonCodes: readonly string[];
  readonly possibleInterpretations: readonly string[];
  readonly requiresClarification: boolean;
  readonly blocking: boolean;
  readonly ownership: ModelOwnershipMetadata;
  readonly boundaries: ModelBoundaryMetadata;
}

export interface UnderstandingClarificationModel {
  readonly modelKind: "UnderstandingClarification";
  readonly clarificationId: string;
  readonly subjectId: string;
  readonly clarificationType: ClarificationType;
  readonly status: ClarificationStatus;
  readonly resolutionState: ClarificationResolutionState;
  readonly question: string;
  readonly reason: string;
  readonly possibleAnswers: readonly string[];
  readonly required: boolean;
  readonly blocking: boolean;
  readonly ownership: ModelOwnershipMetadata;
  readonly boundaries: ModelBoundaryMetadata;
}

export interface UnderstandingEvidenceModel {
  readonly modelKind: "UnderstandingEvidence";
  readonly evidenceId: string;
  readonly category: EvidenceCategory;
  readonly priorityTier: EvidencePriorityTier;
  readonly subjectId: string;
  readonly description: string;
  readonly supportingSource: string;
  readonly limitations: string;
  readonly strength: EvidenceStrength;
  readonly confidenceAssociation: UnderstandingConfidenceLevel | null;
  readonly registryEntryId: string;
  readonly ownership: ModelOwnershipMetadata;
  readonly boundaries: ModelBoundaryMetadata;
}

export interface UnderstandingCandidateModel {
  readonly modelKind: "UnderstandingCandidate";
  readonly candidateId: string;
  readonly candidateType: UnderstandingCandidateType;
  readonly candidateStatus: UnderstandingCandidateStatus;
  readonly candidateLabel: string;
  readonly description: string;
  readonly subjectId: string;
  readonly subjectKind: UnderstandingSubjectKind;
  readonly confidenceLevel: UnderstandingConfidenceLevel;
  readonly ambiguityLevel: UnderstandingAmbiguityLevel;
  readonly evidenceIds: readonly string[];
  readonly clarificationIds: readonly string[];
  readonly sourceReference: string;
  readonly lifecycleState: UnderstandingLifecycleState;
  readonly processingPolicy: DataUnderstandingProcessingPolicy;
  readonly registryCandidateTypeId: string;
  readonly ownership: ModelOwnershipMetadata;
  readonly boundaries: ModelBoundaryMetadata;
}

export interface UnderstandingRelationshipModel {
  readonly modelKind: "UnderstandingRelationship";
  readonly relationshipId: string;
  readonly relationshipKind: UnderstandingRelationshipKind;
  readonly fromSubjectId: string;
  readonly toSubjectId: string;
  readonly description: string;
  readonly provisional: true;
  readonly ownership: ModelOwnershipMetadata;
  readonly boundaries: ModelBoundaryMetadata;
}

export interface UnderstandingScopeModel {
  readonly modelKind: "UnderstandingScope";
  readonly scope: UnderstandingScope;
  readonly registryEntryId: string;
  readonly ownership: ModelOwnershipMetadata;
  readonly boundaries: ModelBoundaryMetadata;
}

export interface UnderstandingLifecycleModel {
  readonly modelKind: "UnderstandingLifecycle";
  readonly state: UnderstandingLifecycleState;
  readonly ordinal: number;
  readonly registryEntryId: string;
  readonly ownership: ModelOwnershipMetadata;
  readonly boundaries: ModelBoundaryMetadata;
}

export interface UnderstandingProcessingPolicyModel {
  readonly modelKind: "UnderstandingProcessingPolicy";
  readonly policies: DataUnderstandingProcessingPolicy;
  readonly ownership: ModelOwnershipMetadata;
  readonly boundaries: ModelBoundaryMetadata;
}

export interface UnderstandingContextModel {
  readonly modelKind: "UnderstandingContext";
  readonly contextId: string;
  readonly tenantId: string;
  readonly workspaceId: string;
  readonly sessionId: string;
  readonly datasetId: string;
  readonly intakeId: string;
  readonly consumerId: string;
  readonly consumerPhase: string;
  readonly ownership: ModelOwnershipMetadata;
  readonly boundaries: ModelBoundaryMetadata;
}

export interface UnderstandingSnapshotModel {
  readonly modelKind: "UnderstandingSnapshot";
  readonly snapshotId: string;
  readonly context: UnderstandingContextModel;
  readonly scope: UnderstandingScopeModel;
  readonly lifecycle: UnderstandingLifecycleModel;
  readonly subjects: readonly UnderstandingSubjectModel[];
  readonly candidates: readonly UnderstandingCandidateModel[];
  readonly evidence: readonly UnderstandingEvidenceModel[];
  readonly relationships: readonly UnderstandingRelationshipModel[];
  readonly clarifications: readonly UnderstandingClarificationModel[];
  readonly ambiguities: readonly UnderstandingAmbiguityModel[];
  readonly confidenceCatalog: readonly UnderstandingConfidenceModel[];
  readonly processingPolicy: UnderstandingProcessingPolicyModel;
  readonly foundationReference: FoundationReference;
  readonly registryReference: RegistryReference;
  readonly pipelineReference: PipelineReference;
  readonly validationSummary: ValidationSummaryReference;
  readonly ownership: ModelOwnershipMetadata;
  readonly boundaries: ModelBoundaryMetadata;
}

export interface UnderstandingResultModel {
  readonly modelKind: "UnderstandingResult";
  readonly resultId: string;
  readonly intakeId: string;
  readonly tenantId: string;
  readonly workspaceId: string;
  readonly sessionId: string;
  readonly datasetId: string;
  readonly status: DataUnderstandingResultStatus;
  readonly snapshot: UnderstandingSnapshotModel;
  readonly foundationReference: FoundationReference;
  readonly registryReference: RegistryReference;
  readonly pipelineReference: PipelineReference;
  readonly validationSummary: ValidationSummaryReference;
  readonly readiness: "ReadyForValidation";
  readonly ownership: ModelOwnershipMetadata;
  readonly boundaries: ModelBoundaryMetadata;
}

export interface DataUnderstandingModelIdentityDescriptor {
  readonly modelId: string;
  readonly modelVersion: string;
  readonly modelName: string;
  readonly modelNamespace: string;
  readonly owner: string;
  readonly sourcePhase: "DKL-3:3";
  readonly platformId: "DKL-3";
  readonly status: "ModelComplete";
  readonly readiness: "ReadyForValidation";
}

export interface DataUnderstandingModelManifestDescriptor {
  readonly modelId: string;
  readonly version: string;
  readonly name: string;
  readonly owner: string;
  readonly sourcePhase: "DKL-3:3";
  readonly modelKindCount: number;
  readonly relationshipKindCount: number;
  readonly candidateFieldCount: number;
  readonly evidenceFieldCount: number;
  readonly snapshotSectionCount: number;
  readonly resultFieldCount: number;
  readonly metadataOnly: true;
  readonly modelOnly: true;
  readonly deterministic: true;
  readonly immutable: true;
  readonly semanticInferencePerformed: false;
  readonly businessObjectsCreated: false;
  readonly knowledgeGraphCreated: false;
  readonly persistencePerformed: false;
  readonly aiExecuted: false;
  readonly engineReasoningPerformed: false;
  readonly readiness: "ReadyForValidation";
  readonly nextPhase: "DKL-3:4";
}
