/**
 * DKL-3:3 — Understanding Snapshot Model.
 *
 * Canonical immutable model schema for one understanding snapshot and the
 * complete Understanding Result envelope. Metadata only.
 *
 * Ownership: owned exclusively by DKL-3:3.
 */

import { DataUnderstandingContracts } from "./dataUnderstandingFoundation.ts";
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

const SNAPSHOT_SECTIONS: readonly ModelFieldDescriptor[] = Object.freeze([
  field("snapshotId", "Identity", true, "one", "Stable snapshot identity."),
  field("context", "UnderstandingContext", true, "one", "Tenant/workspace/session context."),
  field("scope", "UnderstandingScope", true, "one", "Requested understanding scope."),
  field("lifecycle", "UnderstandingLifecycle", true, "one", "Current lifecycle state."),
  field("subjects", "UnderstandingSubject", true, "many", "Understanding subjects."),
  field("candidates", "UnderstandingCandidate", true, "many", "Provisional candidates."),
  field("evidence", "UnderstandingEvidence", true, "many", "Evidence references."),
  field("relationships", "UnderstandingRelationship", true, "many", "Provisional relationships."),
  field("clarifications", "UnderstandingClarification", true, "many", "Clarification requests."),
  field("ambiguities", "UnderstandingAmbiguity", true, "many", "Preserved ambiguities."),
  field("confidenceCatalog", "UnderstandingConfidence", true, "many", "Confidence catalog."),
  field("processingPolicy", "UnderstandingProcessingPolicy", true, "one", "Bound policies."),
  field("foundationReference", "FoundationReference", true, "one", "DKL-3:1 reference."),
  field("registryReference", "RegistryReference", true, "one", "DKL-3:2 reference."),
  field("pipelineReference", "PipelineReference", true, "one", "Pipeline platform reference."),
  field("validationSummary", "ValidationSummaryReference", true, "one", "Future DKL-3:4 summary."),
  field("ownership", "OwnershipMetadata", true, "one", "Model ownership metadata."),
  field("boundaries", "BoundaryMetadata", true, "one", "Model boundary metadata."),
]);

const RESULT_FIELDS: readonly ModelFieldDescriptor[] = Object.freeze([
  field("resultId", "Identity", true, "one", "Stable result identity."),
  field("intakeId", "IntakeReference", true, "one", "Pipeline intake identity."),
  field("tenantId", "Identity", true, "one", "Tenant boundary identity."),
  field("workspaceId", "Identity", true, "one", "Workspace boundary identity."),
  field("sessionId", "Identity", true, "one", "Session boundary identity."),
  field("datasetId", "Identity", true, "one", "Dataset identity."),
  field("status", "ResultStatus", true, "one", "Understanding result status."),
  field("snapshot", "UnderstandingSnapshot", true, "one", "Immutable understanding snapshot."),
  field("foundationReference", "FoundationReference", true, "one", "DKL-3:1 reference."),
  field("registryReference", "RegistryReference", true, "one", "DKL-3:2 reference."),
  field("pipelineReference", "PipelineReference", true, "one", "Pipeline platform reference."),
  field("validationSummary", "ValidationSummaryReference", true, "one", "Validation summary."),
  field("readiness", "Readiness", true, "one", "Always ReadyForValidation at model layer."),
  field("ownership", "OwnershipMetadata", true, "one", "Model ownership metadata."),
  field("boundaries", "BoundaryMetadata", true, "one", "Model boundary metadata."),
]);

const CONTEXT_FIELDS: readonly ModelFieldDescriptor[] = Object.freeze([
  field("contextId", "Identity", true, "one", "Stable context identity."),
  field("tenantId", "Identity", true, "one", "Tenant identity."),
  field("workspaceId", "Identity", true, "one", "Workspace identity."),
  field("sessionId", "Identity", true, "one", "Session identity."),
  field("datasetId", "Identity", true, "one", "Dataset identity."),
  field("intakeId", "IntakeReference", true, "one", "Intake identity."),
  field("consumerId", "ConsumerReference", true, "one", "Consumer identity."),
  field("consumerPhase", "Phase", true, "one", "Consumer phase."),
]);

/** Canonical immutable Understanding Snapshot and Result model schemas. */
export const DataUnderstandingSnapshotModel = Object.freeze({
  modelId: "DKL-3:3/UnderstandingSnapshot",
  modelKind: "UnderstandingSnapshot",
  modelName: "Understanding Snapshot Model",
  description:
    "One immutable understanding snapshot containing subjects, candidates, evidence, and references.",
  snapshotSections: SNAPSHOT_SECTIONS,
  snapshotSectionCount: SNAPSHOT_SECTIONS.length,
  resultModelId: "DKL-3:3/UnderstandingResult",
  resultModelKind: "UnderstandingResult",
  resultFields: RESULT_FIELDS,
  resultFieldCount: RESULT_FIELDS.length,
  contextFields: CONTEXT_FIELDS,
  contextFieldCount: CONTEXT_FIELDS.length,
  allowedScopes: DataUnderstandingContracts.understandingScopes,
  allowedResultStatuses: DataUnderstandingContracts.resultStatuses,
  allowedSubjectKinds: DataUnderstandingContracts.subjectKinds,
  forbiddenOutputs: Object.freeze([
    "BusinessObjects",
    "KnowledgeGraph",
    "PersistenceRecords",
    "EngineDecisions",
    "AIResults",
  ]),
  ownership: OWNERSHIP,
  boundaries: BOUNDARIES,
  metadataOnly: true,
  modelOnly: true,
  immutable: true,
});
