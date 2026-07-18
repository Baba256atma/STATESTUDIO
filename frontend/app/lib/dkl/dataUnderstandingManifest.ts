/**
 * DKL-3:5 — Data Understanding Manifest.
 *
 * The canonical immutable Manifest aggregate for the Data Understanding
 * Platform. Publishes exactly eight runtime exports of manifesto metadata.
 * Manifest only — no understanding, no validation execution, no Business
 * Objects, no Knowledge Graph, no AI, no Engine, no persistence.
 *
 * Ownership: owned exclusively by DKL-3:5.
 */

import { DataUnderstandingContracts, DataUnderstandingLifecycle } from "./dataUnderstandingFoundation.ts";
import { DataUnderstandingEvidenceRegistry } from "./dataUnderstandingRegistry.ts";
import { DataUnderstandingModel, DataUnderstandingRelationshipModel } from "./dataUnderstandingModel.ts";
import { DataUnderstandingValidationRules } from "./dataUnderstandingValidation.ts";
import { DataUnderstandingManifestInventory } from "./dataUnderstandingManifestInventory.ts";
import { DataUnderstandingManifestDependencies } from "./dataUnderstandingManifestDependencies.ts";
import { DataUnderstandingManifestCompatibility } from "./dataUnderstandingManifestCompatibility.ts";
import { DataUnderstandingManifestReadiness } from "./dataUnderstandingManifestReadiness.ts";
import { DataUnderstandingManifestSummary } from "./dataUnderstandingManifestSummary.ts";
import type {
  DataUnderstandingManifestIdentityDescriptor,
  ManifestInventoryCounts,
} from "./dataUnderstandingManifestTypes.ts";

export const DataUnderstandingManifestVersion = "1.0.0";

export const DataUnderstandingManifestIdentity: DataUnderstandingManifestIdentityDescriptor =
  Object.freeze({
    manifestId: "DKL-3:5/DataUnderstandingManifest",
    manifestVersion: DataUnderstandingManifestVersion,
    manifestName: "Data Understanding Manifest",
    manifestNamespace: "nexora.dkl.data-understanding.manifest",
    owner: "DKL-3 Data Understanding Platform",
    sourcePhase: "DKL-3:5",
    platformId: "DKL-3",
    status: "ManifestComplete",
    readiness: "ReadyForPlatform",
  });

const COUNTS: ManifestInventoryCounts = Object.freeze({
  foundationPhaseCount: 1,
  registryPhaseCount: 1,
  modelPhaseCount: 1,
  validationPhaseCount: 1,
  subjectCount: DataUnderstandingContracts.subjectKinds.length,
  candidateTypeCount: DataUnderstandingContracts.candidateTypes.length,
  candidateStatusCount: DataUnderstandingContracts.candidateStatuses.length,
  evidenceCategoryCount: DataUnderstandingEvidenceRegistry.entryCount,
  evidencePriorityTierCount: DataUnderstandingEvidenceRegistry.priorityTierCount,
  relationshipKindCount: DataUnderstandingRelationshipModel.relationshipKindCount,
  clarificationTypeCount: DataUnderstandingManifestInventory.clarificationTypes.length,
  clarificationStatusCount: DataUnderstandingContracts.clarificationStatuses.length,
  confidenceLevelCount: DataUnderstandingContracts.confidenceLevels.length,
  ambiguityLevelCount: DataUnderstandingContracts.ambiguityLevels.length,
  lifecycleStateCount: DataUnderstandingLifecycle.stateCount,
  processingPolicyCount: Object.keys(DataUnderstandingContracts.processingPolicies).length,
  understandingScopeCount: DataUnderstandingContracts.understandingScopes.length,
  resultStatusCount: DataUnderstandingContracts.resultStatuses.length,
  validationRuleCount: DataUnderstandingValidationRules.length,
  modelKindCount: DataUnderstandingModel.modelKindCount,
  registryEntryFamilyCount: 8,
  referenceKindCount: DataUnderstandingManifestInventory.references.length,
  publicApiCount: DataUnderstandingManifestSummary.totalPublicApis,
  dependencyCount: DataUnderstandingManifestDependencies.entryCount,
  compatibilityCount: DataUnderstandingManifestCompatibility.entryCount,
  componentCount: DataUnderstandingManifestInventory.componentCount,
});

/** Canonical immutable Data Understanding Manifest aggregate. */
export const DataUnderstandingManifest = Object.freeze({
  identity: DataUnderstandingManifestIdentity,
  version: DataUnderstandingManifestVersion,
  inventory: DataUnderstandingManifestInventory,
  dependencies: DataUnderstandingManifestDependencies,
  compatibility: DataUnderstandingManifestCompatibility,
  readiness: DataUnderstandingManifestReadiness,
  summary: DataUnderstandingManifestSummary,
  counts: COUNTS,
  metadata: Object.freeze({
    metadataOnly: true,
    manifestOnly: true,
    deterministic: true,
    immutable: true,
    semanticUnderstandingPerformed: false,
    validationExecuted: false,
    businessObjectsCreated: false,
    knowledgeGraphCreated: false,
    persistencePerformed: false,
    aiExecuted: false,
    engineReasoningPerformed: false,
  }),
  nextPhase: "DKL-3:6 — Data Understanding Platform",
  metadataOnly: true,
  manifestOnly: true,
  immutable: true,
});

export {
  DataUnderstandingManifestInventory,
  DataUnderstandingManifestDependencies,
  DataUnderstandingManifestCompatibility,
  DataUnderstandingManifestReadiness,
  DataUnderstandingManifestSummary,
};
