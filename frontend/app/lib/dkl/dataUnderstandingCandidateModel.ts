/**
 * DKL-3:3 — Understanding Candidate Model.
 *
 * Canonical immutable model schema for provisional understanding candidates.
 * Metadata only. No inference. No Business Objects.
 *
 * Ownership: owned exclusively by DKL-3:3.
 */

import { DataUnderstandingContracts } from "./dataUnderstandingFoundation.ts";
import { DataUnderstandingCandidateRegistry } from "./dataUnderstandingRegistry.ts";
import type {
  ModelBoundaryMetadata,
  ModelFieldDescriptor,
  ModelOwnershipMetadata,
} from "./dataUnderstandingModelTypes.ts";

const OWNERSHIP: ModelOwnershipMetadata = Object.freeze({
  owner: "DKL-3 Data Understanding Platform",
  sourcePhase: "DKL-3:3",
  metadataOnly: true,
  modelOnly: true,
});

const BOUNDARIES: ModelBoundaryMetadata = Object.freeze({
  provisionalOnly: true,
  businessObjectForbidden: true,
  knowledgeGraphForbidden: true,
  persistenceForbidden: true,
  aiForbidden: true,
  engineReasoningForbidden: true,
});

const field = (
  fieldName: string,
  fieldKind: string,
  required: boolean,
  cardinality: ModelFieldDescriptor["cardinality"],
  description: string,
): ModelFieldDescriptor =>
  Object.freeze({ fieldName, fieldKind, required, cardinality, description });

const CANDIDATE_FIELDS: readonly ModelFieldDescriptor[] = Object.freeze([
  field("candidateId", "Identity", true, "one", "Stable candidate identity."),
  field("candidateType", "CandidateType", true, "one", "Provisional interpretation category."),
  field("candidateStatus", "CandidateStatus", true, "one", "Lifecycle status of the candidate."),
  field("candidateLabel", "Label", true, "one", "Human-readable provisional label."),
  field("description", "Text", true, "one", "Description of the provisional meaning."),
  field("subjectId", "SubjectReference", true, "one", "Target understanding subject."),
  field("subjectKind", "SubjectKind", true, "one", "Kind of the target subject."),
  field("confidenceLevel", "ConfidenceLevel", true, "one", "Evidence-strength metadata."),
  field("ambiguityLevel", "AmbiguityLevel", true, "one", "Preserved uncertainty level."),
  field("evidenceIds", "EvidenceReference", true, "many", "Referenced evidence identities."),
  field("clarificationIds", "ClarificationReference", false, "many", "Referenced clarifications."),
  field("sourceReference", "SourceReference", true, "one", "Originating source reference."),
  field("lifecycleState", "LifecycleState", true, "one", "Understanding lifecycle state."),
  field("processingPolicy", "ProcessingPolicy", true, "one", "Bound processing policies."),
  field("registryCandidateTypeId", "RegistryReference", true, "one", "DKL-3:2 candidate-type id."),
  field("ownership", "OwnershipMetadata", true, "one", "Model ownership metadata."),
  field("boundaries", "BoundaryMetadata", true, "one", "Model boundary metadata."),
]);

const FORBIDDEN_CONTENTS: readonly string[] = Object.freeze([
  "BusinessObject",
  "Entity",
  "DatabaseRow",
  "KnowledgeNode",
  "EngineDecision",
  "AIResult",
  "PersistenceInformation",
]);

/** Canonical immutable Understanding Candidate model schema. */
export const DataUnderstandingCandidateModel = Object.freeze({
  modelId: "DKL-3:3/UnderstandingCandidate",
  modelKind: "UnderstandingCandidate",
  modelName: "Understanding Candidate Model",
  description:
    "A provisional interpretation of structural data. Candidates are not Business Objects.",
  fields: CANDIDATE_FIELDS,
  fieldCount: CANDIDATE_FIELDS.length,
  allowedCandidateTypes: DataUnderstandingContracts.candidateTypes,
  allowedCandidateStatuses: DataUnderstandingContracts.candidateStatuses,
  allowedConfidenceLevels: DataUnderstandingContracts.confidenceLevels,
  allowedAmbiguityLevels: DataUnderstandingContracts.ambiguityLevels,
  registry: Object.freeze({
    candidateTypeCount: DataUnderstandingCandidateRegistry.candidateTypeCount,
    candidateStatusCount: DataUnderstandingCandidateRegistry.candidateStatusCount,
    confidenceLevelCount: DataUnderstandingCandidateRegistry.confidenceLevelCount,
    candidatesAreNotBusinessObjects:
      DataUnderstandingCandidateRegistry.candidatesAreNotBusinessObjects,
  }),
  forbiddenContents: FORBIDDEN_CONTENTS,
  ownership: OWNERSHIP,
  boundaries: BOUNDARIES,
  metadataOnly: true,
  modelOnly: true,
  immutable: true,
});
