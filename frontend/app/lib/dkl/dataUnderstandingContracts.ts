/**
 * DKL-3:1 — Data Understanding Contracts.
 *
 * Canonical definition, terminology, subjects, candidates, confidence,
 * ambiguity, clarification, and I/O envelopes. Contract definitions only.
 *
 * Ownership: owned exclusively by DKL-3:1.
 */

import type {
  ClarificationStatus,
  DataUnderstandingProcessingPolicy,
  DataUnderstandingResultStatus,
  DataUnderstandingTerminology,
  UnderstandingAmbiguityLevel,
  UnderstandingCandidateStatus,
  UnderstandingCandidateType,
  UnderstandingConfidenceLevel,
  UnderstandingScope,
  UnderstandingSubjectKind,
} from "./dataUnderstandingFoundationTypes.ts";
import { DATA_UNDERSTANDING_DEFINITION } from "./dataUnderstandingFoundationTypes.ts";

export const UNDERSTANDING_SUBJECT_KINDS: readonly UnderstandingSubjectKind[] = Object.freeze([
  "Dataset",
  "Column",
  "ValuePattern",
  "RowStructure",
  "RelationshipHint",
  "SourceContext",
  "DiagnosticContext",
]);

export const UNDERSTANDING_CANDIDATE_STATUSES: readonly UnderstandingCandidateStatus[] =
  Object.freeze(["Proposed", "Supported", "Ambiguous", "Rejected", "Confirmed"]);

export const UNDERSTANDING_CANDIDATE_TYPES: readonly UnderstandingCandidateType[] = Object.freeze([
  "DatasetPurpose",
  "ColumnRole",
  "Identifier",
  "Measure",
  "Dimension",
  "TemporalField",
  "CategoricalField",
  "TextField",
  "BooleanIndicator",
  "EntityReference",
  "RelationshipHint",
  "UnknownMeaning",
]);

export const UNDERSTANDING_CONFIDENCE_LEVELS: readonly UnderstandingConfidenceLevel[] =
  Object.freeze(["VeryLow", "Low", "Medium", "High", "VeryHigh"]);

export const UNDERSTANDING_AMBIGUITY_LEVELS: readonly UnderstandingAmbiguityLevel[] = Object.freeze([
  "None",
  "Low",
  "Moderate",
  "High",
  "Blocking",
]);

export const CLARIFICATION_STATUSES: readonly ClarificationStatus[] = Object.freeze([
  "Pending",
  "Answered",
  "Dismissed",
  "Resolved",
]);

export const UNDERSTANDING_SCOPES: readonly UnderstandingScope[] = Object.freeze([
  "DatasetOnly",
  "SelectedColumns",
  "DatasetAndSelectedColumns",
  "RelationshipHints",
]);

export const DATA_UNDERSTANDING_RESULT_STATUSES: readonly DataUnderstandingResultStatus[] =
  Object.freeze([
    "NotStarted",
    "UnderstandingInProgress",
    "UnderstandingComplete",
    "UnderstandingWithAmbiguities",
    "Blocked",
    "Failed",
  ]);

export const DATA_UNDERSTANDING_TERMINOLOGY: DataUnderstandingTerminology = Object.freeze({
  StructuralData:
    "Parser-derived shape, columns, samples, and diagnostics without semantic interpretation.",
  ProvisionalMeaning:
    "A candidate interpretation that remains evidence-backed and non-canonical.",
  SemanticEvidence:
    "Referenced observations that support or limit a provisional interpretation.",
  Ambiguity:
    "Preserved uncertainty when multiple meanings remain plausible or unsupported.",
  ClarificationNeed:
    "An explicit request for human or upstream clarification before meaning is advanced.",
  UnderstandingCandidate:
    "A provisional interpretation targeting exactly one understanding subject kind.",
  UnderstandingResult:
    "The envelope of candidates, evidence, ambiguities, and clarification needs for an intake.",
});

export const DATA_UNDERSTANDING_PROCESSING_POLICIES: DataUnderstandingProcessingPolicy =
  Object.freeze({
    previewOnlyInputRequired: true,
    preserveOriginalValues: true,
    preserveOriginalHeaders: true,
    allowSemanticCandidates: true,
    allowCanonicalBusinessObjects: false,
    allowPersistence: false,
    allowAiProviderCalls: false,
    allowExecutiveReasoning: false,
    requireEvidenceForCandidates: true,
    requireLimitationsForEvidence: true,
    preserveAmbiguity: true,
    requireClarificationForBlockingAmbiguity: true,
  });

/** Canonical immutable Data Understanding contracts aggregate. */
export const DataUnderstandingContracts = Object.freeze({
  definition: DATA_UNDERSTANDING_DEFINITION,
  terminology: DATA_UNDERSTANDING_TERMINOLOGY,
  subjectKinds: UNDERSTANDING_SUBJECT_KINDS,
  candidateStatuses: UNDERSTANDING_CANDIDATE_STATUSES,
  candidateTypes: UNDERSTANDING_CANDIDATE_TYPES,
  confidenceLevels: UNDERSTANDING_CONFIDENCE_LEVELS,
  ambiguityLevels: UNDERSTANDING_AMBIGUITY_LEVELS,
  clarificationStatuses: CLARIFICATION_STATUSES,
  understandingScopes: UNDERSTANDING_SCOPES,
  resultStatuses: DATA_UNDERSTANDING_RESULT_STATUSES,
  processingPolicies: DATA_UNDERSTANDING_PROCESSING_POLICIES,
  notes: Object.freeze({
    candidatesAreNotBusinessObjects: true,
    confidenceIsNotGuaranteedTruth: true,
    floatingPointConfidenceForbidden: true,
    dkl31DefinesContractsOnly: true,
    noRealCandidateGeneration: true,
  }),
});
