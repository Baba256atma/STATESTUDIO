/**
 * DKL-3:3 — Data Understanding Model Manifest.
 *
 * Immutable manifest describing the complete model surface: kinds, counts,
 * identity, and readiness. Metadata only.
 *
 * Ownership: owned exclusively by DKL-3:3.
 */

import { DataUnderstandingCandidateModel } from "./dataUnderstandingCandidateModel.ts";
import { DataUnderstandingEvidenceModel } from "./dataUnderstandingEvidenceModel.ts";
import { DataUnderstandingRelationshipModel } from "./dataUnderstandingRelationshipModel.ts";
import { DataUnderstandingSnapshotModel } from "./dataUnderstandingSnapshotModel.ts";
import type {
  DataUnderstandingModelIdentityDescriptor,
  DataUnderstandingModelManifestDescriptor,
} from "./dataUnderstandingModelTypes.ts";

export const DATA_UNDERSTANDING_MODEL_VERSION = "1.0.0";

export const DATA_UNDERSTANDING_MODEL_IDENTITY: DataUnderstandingModelIdentityDescriptor =
  Object.freeze({
    modelId: "DKL-3:3/DataUnderstandingModel",
    modelVersion: DATA_UNDERSTANDING_MODEL_VERSION,
    modelName: "Data Understanding Model",
    modelNamespace: "nexora.dkl.data-understanding.model",
    owner: "DKL-3 Data Understanding Platform",
    sourcePhase: "DKL-3:3",
    platformId: "DKL-3",
    status: "ModelComplete",
    readiness: "ReadyForValidation",
  });

export const DATA_UNDERSTANDING_MODEL_KINDS: readonly string[] = Object.freeze([
  "UnderstandingSubject",
  "UnderstandingCandidate",
  "UnderstandingEvidence",
  "UnderstandingRelationship",
  "UnderstandingSnapshot",
  "UnderstandingContext",
  "UnderstandingAmbiguity",
  "UnderstandingClarification",
  "UnderstandingConfidence",
  "UnderstandingScope",
  "UnderstandingLifecycle",
  "UnderstandingProcessingPolicy",
  "UnderstandingResult",
  "ValidationSummaryReference",
  "PipelineReference",
  "RegistryReference",
  "FoundationReference",
]);

export const DATA_UNDERSTANDING_MODEL_PUBLIC_API_NAMES: readonly string[] = Object.freeze([
  "DataUnderstandingModel",
  "DataUnderstandingCandidateModel",
  "DataUnderstandingEvidenceModel",
  "DataUnderstandingRelationshipModel",
  "DataUnderstandingSnapshotModel",
  "DataUnderstandingModelManifest",
  "DataUnderstandingModelVersion",
  "DataUnderstandingModelIdentity",
]);

/** Canonical immutable model manifest. */
export const DataUnderstandingModelManifest: DataUnderstandingModelManifestDescriptor =
  Object.freeze({
    modelId: DATA_UNDERSTANDING_MODEL_IDENTITY.modelId,
    version: DATA_UNDERSTANDING_MODEL_VERSION,
    name: DATA_UNDERSTANDING_MODEL_IDENTITY.modelName,
    owner: DATA_UNDERSTANDING_MODEL_IDENTITY.owner,
    sourcePhase: "DKL-3:3",
    modelKindCount: DATA_UNDERSTANDING_MODEL_KINDS.length,
    relationshipKindCount: DataUnderstandingRelationshipModel.relationshipKindCount,
    candidateFieldCount: DataUnderstandingCandidateModel.fieldCount,
    evidenceFieldCount: DataUnderstandingEvidenceModel.fieldCount,
    snapshotSectionCount: DataUnderstandingSnapshotModel.snapshotSectionCount,
    resultFieldCount: DataUnderstandingSnapshotModel.resultFieldCount,
    metadataOnly: true,
    modelOnly: true,
    deterministic: true,
    immutable: true,
    semanticInferencePerformed: false,
    businessObjectsCreated: false,
    knowledgeGraphCreated: false,
    persistencePerformed: false,
    aiExecuted: false,
    engineReasoningPerformed: false,
    readiness: "ReadyForValidation",
    nextPhase: "DKL-3:4",
  });
