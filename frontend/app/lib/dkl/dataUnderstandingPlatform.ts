/**
 * DKL-3:6 — Data Understanding Platform.
 *
 * The canonical immutable Platform aggregate for the Data Understanding
 * Platform. Publishes exactly eight runtime exports and one five-section
 * platform namespace. Platform only — no new architecture, no understanding,
 * no validation execution, no Business Objects, no Knowledge Graph, no AI,
 * no Engine, no persistence.
 *
 * Ownership: owned exclusively by DKL-3:6.
 * Dependencies: DKL-2 Public Index, Pipeline platform, DKL-3:1–5 public APIs.
 */

import {
  DataUnderstandingBoundaries,
  DataUnderstandingContracts,
  DataUnderstandingEvidenceCatalog,
  DataUnderstandingFoundation,
  DataUnderstandingFoundationVersion,
  DataUnderstandingLifecycle,
  DataUnderstandingOwnership,
  validateDataUnderstandingFoundationInput,
} from "./dataUnderstandingFoundation.ts";
import {
  DataUnderstandingCandidateRegistry,
  DataUnderstandingClarificationRegistry,
  DataUnderstandingEvidenceRegistry,
  DataUnderstandingRegistry,
  DataUnderstandingRegistryIdentity,
  DataUnderstandingRegistryManifest,
  DataUnderstandingRegistryVersion,
  DataUnderstandingSubjectRegistry,
} from "./dataUnderstandingRegistry.ts";
import {
  DataUnderstandingCandidateModel,
  DataUnderstandingEvidenceModel,
  DataUnderstandingModel,
  DataUnderstandingModelIdentity,
  DataUnderstandingModelManifest,
  DataUnderstandingModelVersion,
  DataUnderstandingRelationshipModel,
  DataUnderstandingSnapshotModel,
} from "./dataUnderstandingModel.ts";
import {
  DataUnderstandingValidation,
  DataUnderstandingValidationBoundaries,
  DataUnderstandingValidationManifest,
  DataUnderstandingValidationOwnership,
  DataUnderstandingValidationReport,
  DataUnderstandingValidationRules,
  DataUnderstandingValidationVersion,
  validateDataUnderstandingModel,
} from "./dataUnderstandingValidation.ts";
import {
  DataUnderstandingManifest,
  DataUnderstandingManifestCompatibility,
  DataUnderstandingManifestDependencies,
  DataUnderstandingManifestIdentity,
  DataUnderstandingManifestInventory,
  DataUnderstandingManifestReadiness,
  DataUnderstandingManifestSummary,
  DataUnderstandingManifestVersion,
} from "./dataUnderstandingManifest.ts";
import {
  DATA_UNDERSTANDING_PLATFORM_IDENTITY,
  DATA_UNDERSTANDING_PLATFORM_VERSION,
  DataUnderstandingPlatformRegistry,
} from "./dataUnderstandingPlatformRegistry.ts";
import { DataUnderstandingPlatformCompatibility } from "./dataUnderstandingPlatformCompatibility.ts";
import { DataUnderstandingPlatformDependencies } from "./dataUnderstandingPlatformDependencies.ts";
import { DataUnderstandingPlatformReadiness } from "./dataUnderstandingPlatformReadiness.ts";
import { DataUnderstandingPlatformSummary } from "./dataUnderstandingPlatformSummary.ts";

export const DataUnderstandingPlatformVersion: string = DATA_UNDERSTANDING_PLATFORM_VERSION;

export const DataUnderstandingPlatformIdentity = DATA_UNDERSTANDING_PLATFORM_IDENTITY;

/**
 * Canonical five-section platform namespace.
 * Each section references official public APIs of its phase only.
 */
const PLATFORM_NAMESPACE = Object.freeze({
  foundation: Object.freeze({
    DataUnderstandingFoundation,
    DataUnderstandingContracts,
    DataUnderstandingOwnership,
    DataUnderstandingBoundaries,
    DataUnderstandingLifecycle,
    DataUnderstandingEvidenceCatalog,
    DataUnderstandingFoundationVersion,
    validateDataUnderstandingFoundationInput,
  }),
  registry: Object.freeze({
    DataUnderstandingRegistry,
    DataUnderstandingSubjectRegistry,
    DataUnderstandingCandidateRegistry,
    DataUnderstandingEvidenceRegistry,
    DataUnderstandingClarificationRegistry,
    DataUnderstandingRegistryManifest,
    DataUnderstandingRegistryVersion,
    DataUnderstandingRegistryIdentity,
  }),
  model: Object.freeze({
    DataUnderstandingModel,
    DataUnderstandingCandidateModel,
    DataUnderstandingEvidenceModel,
    DataUnderstandingRelationshipModel,
    DataUnderstandingSnapshotModel,
    DataUnderstandingModelManifest,
    DataUnderstandingModelVersion,
    DataUnderstandingModelIdentity,
  }),
  validation: Object.freeze({
    DataUnderstandingValidation,
    DataUnderstandingValidationRules,
    DataUnderstandingValidationOwnership,
    DataUnderstandingValidationBoundaries,
    DataUnderstandingValidationManifest,
    DataUnderstandingValidationReport,
    DataUnderstandingValidationVersion,
    validateDataUnderstandingModel,
  }),
  manifest: Object.freeze({
    DataUnderstandingManifest,
    DataUnderstandingManifestInventory,
    DataUnderstandingManifestDependencies,
    DataUnderstandingManifestCompatibility,
    DataUnderstandingManifestReadiness,
    DataUnderstandingManifestSummary,
    DataUnderstandingManifestVersion,
    DataUnderstandingManifestIdentity,
  }),
});

/** Canonical immutable Data Understanding Platform aggregate. */
export const DataUnderstandingPlatform = Object.freeze({
  identity: DataUnderstandingPlatformIdentity,
  version: DataUnderstandingPlatformVersion,
  namespace: PLATFORM_NAMESPACE,
  foundation: PLATFORM_NAMESPACE.foundation,
  registry: PLATFORM_NAMESPACE.registry,
  model: PLATFORM_NAMESPACE.model,
  validation: PLATFORM_NAMESPACE.validation,
  manifest: PLATFORM_NAMESPACE.manifest,
  platformRegistry: DataUnderstandingPlatformRegistry,
  compatibility: DataUnderstandingPlatformCompatibility,
  dependencies: DataUnderstandingPlatformDependencies,
  readiness: DataUnderstandingPlatformReadiness,
  summary: DataUnderstandingPlatformSummary,
  metadata: Object.freeze({
    metadataOnly: true,
    platformOnly: true,
    deterministic: true,
    immutable: true,
    noNewArchitecture: true,
    semanticUnderstandingPerformed: false,
    semanticInferencePerformed: false,
    candidateGenerationPerformed: false,
    validationExecuted: false,
    businessObjectsCreated: false,
    knowledgeGraphCreated: false,
    persistencePerformed: false,
    aiExecuted: false,
    engineReasoningPerformed: false,
  }),
  nextPhase: "DKL-3:7 — Data Understanding Certification",
  metadataOnly: true,
  platformOnly: true,
  immutable: true,
});

export {
  DataUnderstandingPlatformRegistry,
  DataUnderstandingPlatformCompatibility,
  DataUnderstandingPlatformDependencies,
  DataUnderstandingPlatformReadiness,
  DataUnderstandingPlatformSummary,
};
