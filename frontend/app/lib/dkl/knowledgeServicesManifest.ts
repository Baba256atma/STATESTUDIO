/**
 * DKL-7:5 — Knowledge Services Manifest.
 *
 * Canonical immutable architectural manifest for Knowledge Services
 * (DKL-7:1 through DKL-7:4). Consumes only the DKL-7:4 Validation public surface.
 * Metadata-only. Manifest-only. Runtime-free.
 *
 * Ownership: owned exclusively by DKL-7:5.
 *
 * Public exports (exactly 12):
 *   KnowledgeServicesManifest
 *   KnowledgeServicesManifestId
 *   KnowledgeServicesManifestName
 *   KnowledgeServicesManifestVersion
 *   KnowledgeServicesManifestNamespace
 *   KnowledgeServicesManifestStatus
 *   KnowledgeServicesManifestReadiness
 *   KnowledgeServicesManifestInventory
 *   KnowledgeServicesManifestCompatibility
 *   KnowledgeServicesManifestGuarantees
 *   getKnowledgeServicesManifestSummary()
 *   getKnowledgeServicesManifestInventoryCount()
 */

import {
  KnowledgeServicesValidation,
  KnowledgeServicesValidationId,
  KnowledgeServicesValidationVersion,
} from "./knowledgeServicesValidation.ts";
import { KnowledgeServicesManifestCompatibility } from "./knowledgeServicesManifestCompatibility.ts";
import { KnowledgeServicesManifestDependencies } from "./knowledgeServicesManifestDependencies.ts";
import { KnowledgeServicesManifestGuarantees } from "./knowledgeServicesManifestGuarantees.ts";
import {
  KnowledgeServicesManifestArchitecturePhases,
  KnowledgeServicesManifestBoundaries,
  KnowledgeServicesManifestCapabilities,
  KnowledgeServicesManifestChainIds,
  KnowledgeServicesManifestContracts,
  KnowledgeServicesManifestModelProfile,
  KnowledgeServicesManifestObservedCounts,
  KnowledgeServicesManifestOwnership,
  KnowledgeServicesManifestServices,
  KnowledgeServicesManifestValidationProfile,
} from "./knowledgeServicesManifestInventory.ts";
import {
  KnowledgeServicesManifestArchitectureStatus,
  KnowledgeServicesManifestPublicApis,
  KnowledgeServicesManifestReadiness,
} from "./knowledgeServicesManifestReadiness.ts";
import type {
  KnowledgeServicesManifestIdentity,
  KnowledgeServicesManifestInventory as ManifestInventoryRecord,
  KnowledgeServicesManifestMetadata,
  KnowledgeServicesManifestSummary,
} from "./knowledgeServicesManifestTypes.ts";

export const KnowledgeServicesManifestId =
  "DKL-7:5/KnowledgeServicesManifest" as const;

export const KnowledgeServicesManifestName =
  "Knowledge Services Manifest" as const;

export const KnowledgeServicesManifestVersion = "1.0.0" as const;

export const KnowledgeServicesManifestNamespace =
  "nexora.dkl.knowledge-services.manifest" as const;

export const KnowledgeServicesManifestStatus = "ManifestComplete" as const;

export {
  KnowledgeServicesManifestReadiness,
  KnowledgeServicesManifestCompatibility,
  KnowledgeServicesManifestGuarantees,
};

/**
 * Counting rule for getKnowledgeServicesManifestInventoryCount():
 * completedPhases + futurePhases + dependencies + owned + nonOwned +
 * prohibitedSurfaces + services + capabilities + contracts + lifecycleStages +
 * requestCategories + responseCategories + accessModes +
 * serviceCapabilityRelationships + modelInventory + validationGroups +
 * validationRules + validationEvidence + validationResults +
 * compatibility + guarantees + publicApis
 *
 * Documented addends sum to 447.
 */
const COUNTING_RULE =
  "5+4+10+owned+nonOwned+prohibited+services+capabilities+contracts+lifecycle+requestCategories+responseCategories+accessModes+serviceCapabilityRelationships+modelInventory+validationGroups+validationRules+validationEvidence+validationResults+compatibility+guarantees+publicApis";

const counts = KnowledgeServicesManifestObservedCounts;
const chain = KnowledgeServicesManifestChainIds;

const totalEntryCount =
  5 +
  4 +
  KnowledgeServicesManifestDependencies.length +
  counts.ownedResponsibilityCount +
  counts.nonOwnedResponsibilityCount +
  counts.prohibitedSurfaceCount +
  counts.serviceCount +
  counts.capabilityCount +
  counts.contractCount +
  counts.lifecycleStageCount +
  counts.requestCategoryCount +
  counts.responseCategoryCount +
  counts.accessModeCount +
  counts.serviceCapabilityRelationshipCount +
  counts.modelInventoryCount +
  counts.validationGroupCount +
  counts.validationRuleCount +
  counts.validationEvidenceCount +
  counts.validationResultCount +
  KnowledgeServicesManifestCompatibility.length +
  KnowledgeServicesManifestGuarantees.length +
  KnowledgeServicesManifestPublicApis.length;

export const KnowledgeServicesManifestInventory: ManifestInventoryRecord =
  Object.freeze({
    inventoryId: "DKL-7:5/KnowledgeServicesManifestInventory",
    completedPhaseCount: 5 as const,
    futurePhaseCount: 4 as const,
    totalDkl7PhaseCount: 9 as const,
    dependencyCount: 10 as const,
    ownedResponsibilityCount: counts.ownedResponsibilityCount,
    nonOwnedResponsibilityCount: counts.nonOwnedResponsibilityCount,
    prohibitedSurfaceCount: counts.prohibitedSurfaceCount,
    serviceCount: counts.serviceCount,
    capabilityCount: counts.capabilityCount,
    contractCount: counts.contractCount,
    lifecycleStageCount: counts.lifecycleStageCount,
    requestCategoryCount: counts.requestCategoryCount,
    responseCategoryCount: counts.responseCategoryCount,
    accessModeCount: counts.accessModeCount,
    mutationModeCount: 0 as const,
    serviceCapabilityRelationshipCount:
      counts.serviceCapabilityRelationshipCount,
    modelInventoryCount: counts.modelInventoryCount,
    validationGroupCount: counts.validationGroupCount,
    validationRuleCount: counts.validationRuleCount,
    validationEvidenceCount: counts.validationEvidenceCount,
    validationResultCount: counts.validationResultCount,
    compatibilityCount: 12 as const,
    guaranteeCount: 18 as const,
    publicApiCount: 12 as const,
    sectionCount: 18 as const,
    totalEntryCount,
    countingRule: COUNTING_RULE,
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  });

const identity: KnowledgeServicesManifestIdentity = Object.freeze({
  manifestId: KnowledgeServicesManifestId,
  manifestName: KnowledgeServicesManifestName,
  manifestVersion: KnowledgeServicesManifestVersion,
  manifestNamespace: KnowledgeServicesManifestNamespace,
  layer: "Data Knowledge Layer",
  phase: "DKL-7",
  stage: "Manifest",
  sourcePhase: "DKL-7:5",
  owner: "DKL-7 Knowledge Services",
  status: KnowledgeServicesManifestStatus,
  validationResult: "Pass",
  architectureStatus: KnowledgeServicesManifestArchitectureStatus,
  readiness: KnowledgeServicesManifestReadiness,
  validationId: KnowledgeServicesValidationId,
  validationVersion: KnowledgeServicesValidationVersion,
  modelId: chain.modelId,
  registryId: chain.registryId,
  foundationId: chain.foundationId,
  dkl6PublicIndexId: chain.dkl6PublicIndexId,
  metadataOnly: true,
  immutable: true,
});

const metadata: KnowledgeServicesManifestMetadata = Object.freeze({
  metadataId: "DKL-7:5/KnowledgeServicesManifestMetadata",
  manifestId: KnowledgeServicesManifestId,
  description:
    "Canonical immutable architectural manifest for Knowledge Services DKL-7:1 through DKL-7:4.",
  metadataOnly: true,
  declarationOnly: true,
  runtimeBehavior: false,
  transportNeutral: true,
  persistenceNeutral: true,
  immutable: true,
  deterministic: true,
});

const dependencyDeclarations = Object.freeze({
  directPreviousPhaseModule: "knowledgeServicesValidation.ts" as const,
  validationOnly: true as const,
  modelDirectImport: false as const,
  registryDirectImport: false as const,
  foundationDirectImport: false as const,
  dkl6DirectImport: false as const,
  modelReachedThroughValidation: true as const,
  registryReachedThroughModel: true as const,
  foundationReachedThroughRegistry: true as const,
  dkl6ReachedThroughFoundation: true as const,
});

/** Canonical immutable Knowledge Services Manifest aggregate. */
export const KnowledgeServicesManifest = Object.freeze({
  identity,
  metadata,
  validation: KnowledgeServicesValidation,
  architecture: Object.freeze({
    status: KnowledgeServicesManifestArchitectureStatus,
    phases: KnowledgeServicesManifestArchitecturePhases,
    completedPhaseCount: 5 as const,
    futurePhaseCount: 4 as const,
    totalPhaseCount: 9 as const,
  }),
  dependencies: KnowledgeServicesManifestDependencies,
  ownership: KnowledgeServicesManifestOwnership,
  boundaries: KnowledgeServicesManifestBoundaries,
  services: KnowledgeServicesManifestServices,
  capabilities: KnowledgeServicesManifestCapabilities,
  contracts: KnowledgeServicesManifestContracts,
  models: KnowledgeServicesManifestModelProfile,
  validationProfile: KnowledgeServicesManifestValidationProfile,
  inventory: KnowledgeServicesManifestInventory,
  compatibility: KnowledgeServicesManifestCompatibility,
  guarantees: KnowledgeServicesManifestGuarantees,
  publicApi: KnowledgeServicesManifestPublicApis,
  status: KnowledgeServicesManifestStatus,
  readiness: KnowledgeServicesManifestReadiness,
  dependencyDeclarations,
  architectureStatus: KnowledgeServicesManifestArchitectureStatus,
  validationResult: "Pass" as const,
  nextPhase: "DKL-7:6 — Knowledge Services Platform",
  metadataOnly: true as const,
  runtimeBehavior: false as const,
  serviceExecution: false as const,
  repositoryAccess: false as const,
  searchExecution: false as const,
  graphTraversal: false as const,
  aiBehavior: false as const,
  transportBehavior: false as const,
  authenticationBehavior: false as const,
  authorizationBehavior: false as const,
  mutationBehavior: false as const,
  immutable: true as const,
  deterministic: true as const,
});

/** Deterministic Manifest inventory count from canonical inventory fields. */
export function getKnowledgeServicesManifestInventoryCount(): number {
  return KnowledgeServicesManifestInventory.totalEntryCount;
}

/** Deterministic frozen Manifest summary. */
export function getKnowledgeServicesManifestSummary(): KnowledgeServicesManifestSummary {
  return Object.freeze({
    manifestId: KnowledgeServicesManifestId,
    version: KnowledgeServicesManifestVersion,
    status: KnowledgeServicesManifestStatus,
    readiness: KnowledgeServicesManifestReadiness,
    architectureStatus: KnowledgeServicesManifestArchitectureStatus,
    validationResult: "Pass",
    validationId: chain.validationId,
    modelId: chain.modelId,
    registryId: chain.registryId,
    foundationId: chain.foundationId,
    dkl6PublicIndexId: chain.dkl6PublicIndexId,
    completedPhaseCount: 5,
    futurePhaseCount: 4,
    serviceCount: counts.serviceCount,
    capabilityCount: counts.capabilityCount,
    contractCount: counts.contractCount,
    lifecycleCount: counts.lifecycleStageCount,
    ownedResponsibilityCount: counts.ownedResponsibilityCount,
    nonOwnedResponsibilityCount: counts.nonOwnedResponsibilityCount,
    prohibitedSurfaceCount: counts.prohibitedSurfaceCount,
    requestCategoryCount: counts.requestCategoryCount,
    responseCategoryCount: counts.responseCategoryCount,
    accessModeCount: counts.accessModeCount,
    mutationModeCount: counts.mutationModeCount,
    requestModelCount: counts.requestModelCount,
    responseModelCount: counts.responseModelCount,
    resultModelCount: counts.resultModelCount,
    contextModelCount: counts.contextModelCount,
    referenceModelCount: counts.referenceModelCount,
    graphModelCount: counts.graphModelCount,
    relationshipCount: counts.relationshipCount,
    totalModelInventoryCount: counts.modelInventoryCount,
    validationGroupCount: counts.validationGroupCount,
    validationRuleCount: counts.validationRuleCount,
    validationEvidenceCount: counts.validationEvidenceCount,
    validationResultCount: counts.validationResultCount,
    validationPassCount: counts.validationPassCount,
    validationFailCount: counts.validationFailCount,
    validationFindingCount: counts.validationFindingCount,
    dependencyDeclarationCount: KnowledgeServicesManifestDependencies.length,
    compatibilityDeclarationCount:
      KnowledgeServicesManifestCompatibility.length,
    guaranteeCount: KnowledgeServicesManifestGuarantees.length,
    publicApiCount: KnowledgeServicesManifestPublicApis.length,
    totalManifestInventoryCount:
      KnowledgeServicesManifestInventory.totalEntryCount,
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  });
}
