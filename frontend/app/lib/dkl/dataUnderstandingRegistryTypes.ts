/**
 * DKL-3:2 — Data Understanding Registry Types.
 *
 * Readonly contracts for the immutable metadata registries of the Data
 * Understanding Platform. Registry entries only. No runtime behavior.
 *
 * Ownership: owned exclusively by DKL-3:2.
 */

import type {
  ClarificationStatus,
  DataUnderstandingResultStatus,
  EvidenceCategory,
  UnderstandingAmbiguityLevel,
  UnderstandingCandidateStatus,
  UnderstandingCandidateType,
  UnderstandingConfidenceLevel,
  UnderstandingLifecycleState,
  UnderstandingScope,
  UnderstandingSubjectKind,
} from "./dataUnderstandingFoundationTypes.ts";

export type RegistryEntryKind =
  | "UnderstandingSubject"
  | "CandidateType"
  | "CandidateStatus"
  | "EvidenceCategory"
  | "EvidencePriority"
  | "ConfidenceLevel"
  | "AmbiguityLevel"
  | "ClarificationType"
  | "ClarificationStatus"
  | "ClarificationResolutionState"
  | "ProcessingPolicy"
  | "LifecycleState"
  | "UnderstandingScope"
  | "ResultStatus"
  | "ValidationResultStatus"
  | "PublicApi";

export type EvidencePriorityTier = "Primary" | "Secondary" | "Contextual";

export type ClarificationType =
  | "ColumnMeaning"
  | "DatasetPurpose"
  | "AmbiguousFormat"
  | "ConflictingEvidence"
  | "MissingContext"
  | "RelationshipConfirmation";

export type ClarificationResolutionState =
  | "Unresolved"
  | "ResolvedByUser"
  | "ResolvedByPolicy"
  | "DismissedWithoutResolution";

export interface RegistryEntryIdentity {
  readonly registryEntryId: string;
  readonly registryEntryKind: RegistryEntryKind;
  readonly registryEntryName: string;
  readonly owner: string;
  readonly sourcePhase: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface UnderstandingSubjectRegistryEntry {
  readonly identity: RegistryEntryIdentity;
  readonly subjectKind: UnderstandingSubjectKind;
  readonly description: string;
}

export interface CandidateTypeRegistryEntry {
  readonly identity: RegistryEntryIdentity;
  readonly candidateType: UnderstandingCandidateType;
  readonly provisional: true;
  readonly isBusinessObject: false;
}

export interface CandidateStatusRegistryEntry {
  readonly identity: RegistryEntryIdentity;
  readonly candidateStatus: UnderstandingCandidateStatus;
}

export interface EvidenceCategoryRegistryEntry {
  readonly identity: RegistryEntryIdentity;
  readonly category: EvidenceCategory;
  readonly description: string;
  readonly limitationsRequired: true;
  readonly exampleLimitation: string;
  readonly priorityTier: EvidencePriorityTier;
}

export interface ConfidenceLevelRegistryEntry {
  readonly identity: RegistryEntryIdentity;
  readonly confidenceLevel: UnderstandingConfidenceLevel;
  readonly ordinal: number;
  readonly guaranteedTruth: false;
}

export interface AmbiguityLevelRegistryEntry {
  readonly identity: RegistryEntryIdentity;
  readonly ambiguityLevel: UnderstandingAmbiguityLevel;
  readonly ordinal: number;
  readonly blocking: boolean;
}

export interface ClarificationTypeRegistryEntry {
  readonly identity: RegistryEntryIdentity;
  readonly clarificationType: ClarificationType;
  readonly description: string;
}

export interface ClarificationStatusRegistryEntry {
  readonly identity: RegistryEntryIdentity;
  readonly clarificationStatus: ClarificationStatus;
}

export interface ClarificationResolutionRegistryEntry {
  readonly identity: RegistryEntryIdentity;
  readonly resolutionState: ClarificationResolutionState;
  readonly terminal: boolean;
}

export interface LifecycleStateRegistryEntry {
  readonly identity: RegistryEntryIdentity;
  readonly state: UnderstandingLifecycleState;
  readonly ordinal: number;
}

export interface ScopeRegistryEntry {
  readonly identity: RegistryEntryIdentity;
  readonly scope: UnderstandingScope;
}

export interface ResultStatusRegistryEntry {
  readonly identity: RegistryEntryIdentity;
  readonly resultStatus: DataUnderstandingResultStatus;
}

export interface ValidationResultStatusRegistryEntry {
  readonly identity: RegistryEntryIdentity;
  readonly validationStatus: "Valid" | "Invalid" | "Blocked";
}

export interface ProcessingPolicyRegistryEntry {
  readonly identity: RegistryEntryIdentity;
  readonly policyKey: string;
  readonly policyValue: boolean;
}

export interface PublicApiRegistryEntry {
  readonly identity: RegistryEntryIdentity;
  readonly apiName: string;
  readonly apiKind: "ImmutableObject" | "ImmutableValue";
}

export interface DataUnderstandingRegistryIdentityDescriptor {
  readonly registryId: string;
  readonly registryVersion: string;
  readonly registryName: string;
  readonly registryNamespace: string;
  readonly owner: string;
  readonly sourcePhase: "DKL-3:2";
  readonly platformId: "DKL-3";
  readonly status: "RegistryComplete";
  readonly readiness: "ReadyForModel";
}

export interface DataUnderstandingRegistryManifestDescriptor {
  readonly registryId: string;
  readonly version: string;
  readonly name: string;
  readonly owner: string;
  readonly sourcePhase: "DKL-3:2";
  readonly subjectCount: number;
  readonly candidateTypeCount: number;
  readonly candidateStatusCount: number;
  readonly evidenceCategoryCount: number;
  readonly evidencePriorityTierCount: number;
  readonly confidenceLevelCount: number;
  readonly ambiguityLevelCount: number;
  readonly clarificationTypeCount: number;
  readonly clarificationStatusCount: number;
  readonly clarificationResolutionStateCount: number;
  readonly processingPolicyCount: number;
  readonly lifecycleStateCount: number;
  readonly understandingScopeCount: number;
  readonly resultStatusCount: number;
  readonly validationResultStatusCount: number;
  readonly publicApiCount: number;
  readonly metadataOnly: true;
  readonly registryOnly: true;
  readonly deterministic: true;
  readonly immutable: true;
  readonly semanticUnderstandingPerformed: false;
  readonly candidateGenerationPerformed: false;
  readonly businessObjectsCreated: false;
  readonly persistencePerformed: false;
  readonly aiExecuted: false;
  readonly engineReasoningPerformed: false;
  readonly readiness: "ReadyForModel";
  readonly nextPhase: "DKL-3:3";
}
