/**
 * DKL-3:3 — Data Understanding Model.
 *
 * The canonical immutable model aggregate for the Data Understanding Platform.
 * Publishes exactly eight runtime exports of model metadata. Model only —
 * no semantic understanding, no AI, no Engine reasoning, no Business Objects,
 * no Knowledge Graph, no persistence, no runtime interpretation.
 *
 * Ownership: owned exclusively by DKL-3:3.
 * Dependencies: DKL-2 Public Index, DKL-3:1, DKL-3:2, and Pipeline platform.
 */

import {
  DataSourceKnowledgeRegistryPublicIndexVersion,
} from "./dataSourceKnowledgeRegistryPublicIndex.ts";
import { PipelineUnderstandingPlatform } from "../pipeline/pipelineUnderstandingPlatform.ts";
import {
  DataUnderstandingBoundaries,
  DataUnderstandingContracts,
  DataUnderstandingFoundation,
  DataUnderstandingFoundationVersion,
  DataUnderstandingLifecycle,
  DataUnderstandingOwnership,
} from "./dataUnderstandingFoundation.ts";
import {
  DataUnderstandingRegistry,
  DataUnderstandingRegistryIdentity,
  DataUnderstandingRegistryVersion,
} from "./dataUnderstandingRegistry.ts";
import { DataUnderstandingCandidateModel } from "./dataUnderstandingCandidateModel.ts";
import { DataUnderstandingEvidenceModel } from "./dataUnderstandingEvidenceModel.ts";
import { DataUnderstandingRelationshipModel } from "./dataUnderstandingRelationshipModel.ts";
import { DataUnderstandingSnapshotModel } from "./dataUnderstandingSnapshotModel.ts";
import {
  DATA_UNDERSTANDING_MODEL_IDENTITY,
  DATA_UNDERSTANDING_MODEL_KINDS,
  DATA_UNDERSTANDING_MODEL_PUBLIC_API_NAMES,
  DATA_UNDERSTANDING_MODEL_VERSION,
  DataUnderstandingModelManifest,
} from "./dataUnderstandingModelManifest.ts";
import type {
  FoundationReference,
  ModelBoundaryMetadata,
  ModelOwnershipMetadata,
  PipelineReference,
  RegistryReference,
  ValidationSummaryReference,
} from "./dataUnderstandingModelTypes.ts";

const OWNERSHIP: ModelOwnershipMetadata = Object.freeze({
  owner: DATA_UNDERSTANDING_MODEL_IDENTITY.owner,
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

const FOUNDATION_REFERENCE: FoundationReference = Object.freeze({
  referenceKind: "FoundationReference",
  foundationId: DataUnderstandingFoundation.identity.foundationId,
  foundationVersion: DataUnderstandingFoundationVersion,
  sourcePhase: "DKL-3:1",
  readiness: "ReadyForRegistry",
});

const REGISTRY_REFERENCE: RegistryReference = Object.freeze({
  referenceKind: "RegistryReference",
  registryId: DataUnderstandingRegistryIdentity.registryId,
  registryVersion: DataUnderstandingRegistryVersion,
  sourcePhase: "DKL-3:2",
  readiness: "ReadyForModel",
});

const PIPELINE_REFERENCE: PipelineReference = Object.freeze({
  referenceKind: "PipelineReference",
  platformId: PipelineUnderstandingPlatform.summary.platformId,
  targetPlatform: "DKL-3",
  readiness: "ReadyForDKL3Intake",
  contractValidRequired: true,
  previewOnlyRequired: true,
});

const VALIDATION_SUMMARY_REFERENCE: ValidationSummaryReference = Object.freeze({
  referenceKind: "ValidationSummaryReference",
  validationPhase: "DKL-3:4",
  status: "Pending",
  readyForBusinessObjects: false,
  summaryMessage:
    "Validation is owned by DKL-3:4. The model layer provides the envelope only.",
});

const SUBJECT_MODEL = Object.freeze({
  modelId: "DKL-3:3/UnderstandingSubject",
  modelKind: "UnderstandingSubject",
  allowedSubjectKinds: DataUnderstandingContracts.subjectKinds,
  subjectCount: DataUnderstandingContracts.subjectKinds.length,
  registrySubjectCount: DataUnderstandingRegistry.subjects.entryCount,
  ownership: OWNERSHIP,
  boundaries: BOUNDARIES,
  metadataOnly: true,
  modelOnly: true,
  immutable: true,
});

const AMBIGUITY_MODEL = Object.freeze({
  modelId: "DKL-3:3/UnderstandingAmbiguity",
  modelKind: "UnderstandingAmbiguity",
  allowedAmbiguityLevels: DataUnderstandingContracts.ambiguityLevels,
  ambiguityLevelCount: DataUnderstandingContracts.ambiguityLevels.length,
  preserveAmbiguity: true,
  ownership: OWNERSHIP,
  boundaries: BOUNDARIES,
  metadataOnly: true,
  modelOnly: true,
  immutable: true,
});

const CLARIFICATION_MODEL = Object.freeze({
  modelId: "DKL-3:3/UnderstandingClarification",
  modelKind: "UnderstandingClarification",
  allowedStatuses: DataUnderstandingContracts.clarificationStatuses,
  clarificationTypeCount: DataUnderstandingRegistry.clarifications.clarificationTypeCount,
  resolutionStateCount: DataUnderstandingRegistry.clarifications.resolutionStateCount,
  clarificationEngineForbidden: true,
  ownership: OWNERSHIP,
  boundaries: BOUNDARIES,
  metadataOnly: true,
  modelOnly: true,
  immutable: true,
});

const CONFIDENCE_MODEL = Object.freeze({
  modelId: "DKL-3:3/UnderstandingConfidence",
  modelKind: "UnderstandingConfidence",
  allowedConfidenceLevels: DataUnderstandingContracts.confidenceLevels,
  confidenceLevelCount: DataUnderstandingContracts.confidenceLevels.length,
  floatingPointForbidden: true,
  guaranteedTruthForbidden: true,
  ownership: OWNERSHIP,
  boundaries: BOUNDARIES,
  metadataOnly: true,
  modelOnly: true,
  immutable: true,
});

const SCOPE_MODEL = Object.freeze({
  modelId: "DKL-3:3/UnderstandingScope",
  modelKind: "UnderstandingScope",
  allowedScopes: DataUnderstandingContracts.understandingScopes,
  scopeCount: DataUnderstandingContracts.understandingScopes.length,
  ownership: OWNERSHIP,
  boundaries: BOUNDARIES,
  metadataOnly: true,
  modelOnly: true,
  immutable: true,
});

const LIFECYCLE_MODEL = Object.freeze({
  modelId: "DKL-3:3/UnderstandingLifecycle",
  modelKind: "UnderstandingLifecycle",
  allowedStates: DataUnderstandingLifecycle.states,
  stateCount: DataUnderstandingLifecycle.stateCount,
  ownership: OWNERSHIP,
  boundaries: BOUNDARIES,
  metadataOnly: true,
  modelOnly: true,
  immutable: true,
});

const PROCESSING_POLICY_MODEL = Object.freeze({
  modelId: "DKL-3:3/UnderstandingProcessingPolicy",
  modelKind: "UnderstandingProcessingPolicy",
  policies: DataUnderstandingContracts.processingPolicies,
  ownership: OWNERSHIP,
  boundaries: BOUNDARIES,
  metadataOnly: true,
  modelOnly: true,
  immutable: true,
});

const CONTEXT_MODEL = Object.freeze({
  modelId: "DKL-3:3/UnderstandingContext",
  modelKind: "UnderstandingContext",
  fields: DataUnderstandingSnapshotModel.contextFields,
  fieldCount: DataUnderstandingSnapshotModel.contextFieldCount,
  ownership: OWNERSHIP,
  boundaries: BOUNDARIES,
  metadataOnly: true,
  modelOnly: true,
  immutable: true,
});

const RESULT_MODEL = Object.freeze({
  modelId: "DKL-3:3/UnderstandingResult",
  modelKind: "UnderstandingResult",
  fields: DataUnderstandingSnapshotModel.resultFields,
  fieldCount: DataUnderstandingSnapshotModel.resultFieldCount,
  allowedStatuses: DataUnderstandingContracts.resultStatuses,
  readiness: "ReadyForValidation",
  ownership: OWNERSHIP,
  boundaries: BOUNDARIES,
  metadataOnly: true,
  modelOnly: true,
  immutable: true,
});

/** The stable model version. */
export const DataUnderstandingModelVersion: string = DATA_UNDERSTANDING_MODEL_VERSION;

/** The stable model identity. */
export const DataUnderstandingModelIdentity = DATA_UNDERSTANDING_MODEL_IDENTITY;

/** Canonical immutable Data Understanding Model aggregate. */
export const DataUnderstandingModel = Object.freeze({
  identity: DATA_UNDERSTANDING_MODEL_IDENTITY,
  version: DATA_UNDERSTANDING_MODEL_VERSION,
  modelKinds: DATA_UNDERSTANDING_MODEL_KINDS,
  modelKindCount: DATA_UNDERSTANDING_MODEL_KINDS.length,
  publicApiNames: DATA_UNDERSTANDING_MODEL_PUBLIC_API_NAMES,
  subject: SUBJECT_MODEL,
  candidate: DataUnderstandingCandidateModel,
  evidence: DataUnderstandingEvidenceModel,
  relationship: DataUnderstandingRelationshipModel,
  snapshot: DataUnderstandingSnapshotModel,
  context: CONTEXT_MODEL,
  ambiguity: AMBIGUITY_MODEL,
  clarification: CLARIFICATION_MODEL,
  confidence: CONFIDENCE_MODEL,
  scope: SCOPE_MODEL,
  lifecycle: LIFECYCLE_MODEL,
  processingPolicy: PROCESSING_POLICY_MODEL,
  result: RESULT_MODEL,
  foundationReference: FOUNDATION_REFERENCE,
  registryReference: REGISTRY_REFERENCE,
  pipelineReference: PIPELINE_REFERENCE,
  validationSummaryReference: VALIDATION_SUMMARY_REFERENCE,
  ownership: DataUnderstandingOwnership,
  boundaries: DataUnderstandingBoundaries,
  dependencies: Object.freeze({
    dkl2PublicIndex: Object.freeze({
      module: "dataSourceKnowledgeRegistryPublicIndex.ts",
      version: DataSourceKnowledgeRegistryPublicIndexVersion,
    }),
    dkl31Foundation: Object.freeze({
      module: "dataUnderstandingFoundation.ts",
      version: DataUnderstandingFoundationVersion,
      readyForRegistry: DataUnderstandingFoundation.readiness.ReadyForRegistry === true,
    }),
    dkl32Registry: Object.freeze({
      module: "dataUnderstandingRegistry.ts",
      version: DataUnderstandingRegistryVersion,
      readyForModel: DataUnderstandingRegistry.readiness.ReadyForModel === true,
    }),
    pipelineUnderstandingPlatform: Object.freeze({
      module: "pipelineUnderstandingPlatform.ts",
      readyForDKL3Intake:
        PipelineUnderstandingPlatform.readiness.ReadyForDKL3Intake === true,
    }),
    forbidden: Object.freeze([
      "DKL-3:4+",
      "DKL-4",
      "Engine",
      "Advisor",
      "Scene",
      "Business Objects",
      "Knowledge Graph",
      "Persistence",
      "AI",
      "Database",
      "Parser internals",
      "Pipeline internals",
      "UI",
      "External packages",
    ]),
  }),
  manifest: DataUnderstandingModelManifest,
  readiness: Object.freeze({
    ModelComplete: true,
    FoundationConsistent: true,
    RegistryConsistent: true,
    MetadataOnly: true,
    ModelOnly: true,
    Deterministic: true,
    Immutable: true,
    SemanticInferenceForbidden: true,
    BusinessObjectCreationForbidden: true,
    KnowledgeGraphForbidden: true,
    PersistenceForbidden: true,
    AIFree: true,
    EngineFree: true,
    ReadyForValidation: true,
  }),
  nextPhase: "DKL-3:4 — Data Understanding Validation",
  metadataOnly: true,
  modelOnly: true,
  immutable: true,
});

export {
  DataUnderstandingCandidateModel,
  DataUnderstandingEvidenceModel,
  DataUnderstandingRelationshipModel,
  DataUnderstandingSnapshotModel,
  DataUnderstandingModelManifest,
};
