/**
 * DKL-3:2 — Data Understanding Registry Manifest.
 *
 * Immutable manifest describing the complete registry surface: counts,
 * identity, boundaries, and readiness. Metadata only.
 *
 * Ownership: owned exclusively by DKL-3:2.
 */

import { DataUnderstandingContracts, DataUnderstandingLifecycle } from "./dataUnderstandingFoundation.ts";
import { DataUnderstandingSubjectRegistry } from "./dataUnderstandingSubjectRegistry.ts";
import { DataUnderstandingCandidateRegistry } from "./dataUnderstandingCandidateRegistry.ts";
import { DataUnderstandingEvidenceRegistry } from "./dataUnderstandingEvidenceRegistry.ts";
import { DataUnderstandingClarificationRegistry } from "./dataUnderstandingClarificationRegistry.ts";
import type {
  DataUnderstandingRegistryIdentityDescriptor,
  DataUnderstandingRegistryManifestDescriptor,
} from "./dataUnderstandingRegistryTypes.ts";

export const DATA_UNDERSTANDING_REGISTRY_VERSION = "1.0.0";

export const DATA_UNDERSTANDING_REGISTRY_IDENTITY: DataUnderstandingRegistryIdentityDescriptor =
  Object.freeze({
    registryId: "DKL-3:2/DataUnderstandingRegistry",
    registryVersion: DATA_UNDERSTANDING_REGISTRY_VERSION,
    registryName: "Data Understanding Registry",
    registryNamespace: "nexora.dkl.data-understanding.registry",
    owner: "DKL-3 Data Understanding Platform",
    sourcePhase: "DKL-3:2",
    platformId: "DKL-3",
    status: "RegistryComplete",
    readiness: "ReadyForModel",
  });

export const DATA_UNDERSTANDING_PUBLIC_API_NAMES: readonly string[] = Object.freeze([
  "DataUnderstandingRegistry",
  "DataUnderstandingSubjectRegistry",
  "DataUnderstandingCandidateRegistry",
  "DataUnderstandingEvidenceRegistry",
  "DataUnderstandingClarificationRegistry",
  "DataUnderstandingRegistryManifest",
  "DataUnderstandingRegistryVersion",
  "DataUnderstandingRegistryIdentity",
]);

/** Canonical immutable registry manifest. */
export const DataUnderstandingRegistryManifest: DataUnderstandingRegistryManifestDescriptor =
  Object.freeze({
    registryId: DATA_UNDERSTANDING_REGISTRY_IDENTITY.registryId,
    version: DATA_UNDERSTANDING_REGISTRY_VERSION,
    name: DATA_UNDERSTANDING_REGISTRY_IDENTITY.registryName,
    owner: DATA_UNDERSTANDING_REGISTRY_IDENTITY.owner,
    sourcePhase: "DKL-3:2",
    subjectCount: DataUnderstandingSubjectRegistry.entryCount,
    candidateTypeCount: DataUnderstandingCandidateRegistry.candidateTypeCount,
    candidateStatusCount: DataUnderstandingCandidateRegistry.candidateStatusCount,
    evidenceCategoryCount: DataUnderstandingEvidenceRegistry.entryCount,
    evidencePriorityTierCount: DataUnderstandingEvidenceRegistry.priorityTierCount,
    confidenceLevelCount: DataUnderstandingCandidateRegistry.confidenceLevelCount,
    ambiguityLevelCount: DataUnderstandingContracts.ambiguityLevels.length,
    clarificationTypeCount: DataUnderstandingClarificationRegistry.clarificationTypeCount,
    clarificationStatusCount: DataUnderstandingClarificationRegistry.clarificationStatusCount,
    clarificationResolutionStateCount:
      DataUnderstandingClarificationRegistry.resolutionStateCount,
    processingPolicyCount: Object.keys(DataUnderstandingContracts.processingPolicies).length,
    lifecycleStateCount: DataUnderstandingLifecycle.stateCount,
    understandingScopeCount: DataUnderstandingContracts.understandingScopes.length,
    resultStatusCount: DataUnderstandingContracts.resultStatuses.length,
    validationResultStatusCount: 3,
    publicApiCount: DATA_UNDERSTANDING_PUBLIC_API_NAMES.length,
    metadataOnly: true,
    registryOnly: true,
    deterministic: true,
    immutable: true,
    semanticUnderstandingPerformed: false,
    candidateGenerationPerformed: false,
    businessObjectsCreated: false,
    persistencePerformed: false,
    aiExecuted: false,
    engineReasoningPerformed: false,
    readiness: "ReadyForModel",
    nextPhase: "DKL-3:3",
  });
