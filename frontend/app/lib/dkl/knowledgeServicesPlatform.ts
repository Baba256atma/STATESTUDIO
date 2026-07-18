/**
 * DKL-7:6 — Knowledge Services Platform.
 *
 * Canonical immutable platform surface for Knowledge Services through DKL-7:5.
 * Consumes only the DKL-7:5 Manifest public surface. Metadata-only. Runtime-free.
 *
 * Ownership: owned exclusively by DKL-7:6.
 *
 * Public exports (exactly 12):
 *   KnowledgeServicesPlatform
 *   KnowledgeServicesPlatformId
 *   KnowledgeServicesPlatformName
 *   KnowledgeServicesPlatformVersion
 *   KnowledgeServicesPlatformNamespace
 *   KnowledgeServicesPlatformStatus
 *   KnowledgeServicesPlatformReadiness
 *   KnowledgeServicesPlatformInventory
 *   KnowledgeServicesPlatformCompatibility
 *   KnowledgeServicesPlatformGuarantees
 *   getKnowledgeServicesPlatformSummary()
 *   getKnowledgeServicesPlatformInventoryCount()
 */

import {
  KnowledgeServicesManifest,
  KnowledgeServicesManifestId,
  KnowledgeServicesManifestStatus,
  KnowledgeServicesManifestVersion,
} from "./knowledgeServicesManifest.ts";
import {
  KnowledgeServicesPlatformBoundaries,
  KnowledgeServicesPlatformCapabilities,
  KnowledgeServicesPlatformChainIds,
  KnowledgeServicesPlatformContracts,
  KnowledgeServicesPlatformFoundationSurface,
  KnowledgeServicesPlatformModelSurface,
  KnowledgeServicesPlatformObservedCounts,
  KnowledgeServicesPlatformOwnership,
  KnowledgeServicesPlatformPhases,
  KnowledgeServicesPlatformRegistrySurface,
  KnowledgeServicesPlatformServices,
  KnowledgeServicesPlatformValidationSurface,
} from "./knowledgeServicesPlatformArchitecture.ts";
import { KnowledgeServicesPlatformCompatibility } from "./knowledgeServicesPlatformCompatibility.ts";
import { KnowledgeServicesPlatformDependencies } from "./knowledgeServicesPlatformDependencies.ts";
import { KnowledgeServicesPlatformGuarantees } from "./knowledgeServicesPlatformGuarantees.ts";
import {
  KnowledgeServicesPlatformArchitectureStatus,
  KnowledgeServicesPlatformConsumers,
  KnowledgeServicesPlatformPublicApis,
  KnowledgeServicesPlatformReadiness,
} from "./knowledgeServicesPlatformReadiness.ts";
import type {
  KnowledgeServicesPlatformIdentity,
  KnowledgeServicesPlatformInventory as PlatformInventoryRecord,
  KnowledgeServicesPlatformMetadata,
  KnowledgeServicesPlatformSummary,
} from "./knowledgeServicesPlatformTypes.ts";

export const KnowledgeServicesPlatformId =
  "DKL-7:6/KnowledgeServicesPlatform" as const;

export const KnowledgeServicesPlatformName =
  "Knowledge Services Platform" as const;

export const KnowledgeServicesPlatformVersion = "1.0.0" as const;

export const KnowledgeServicesPlatformNamespace =
  "nexora.dkl.knowledge-services.platform" as const;

export const KnowledgeServicesPlatformStatus = "PlatformComplete" as const;

export {
  KnowledgeServicesPlatformReadiness,
  KnowledgeServicesPlatformCompatibility,
  KnowledgeServicesPlatformGuarantees,
};

/**
 * Counting rule for getKnowledgeServicesPlatformInventoryCount():
 * completedPhases + futurePhases + platformDependencies + owned + nonOwned +
 * prohibited + services + capabilities + contracts + lifecycle +
 * requestCategories + responseCategories + accessModes +
 * serviceCapabilityRelationships + modelInventory + validationGroups +
 * validationRules + validationEvidence + validationResults +
 * manifestSections + manifestDependencies + manifestCompatibility +
 * manifestGuarantees + manifestPublicApis + platformCompatibility +
 * consumers + platformGuarantees + platformPublicApis
 *
 * Documented addends sum to 527.
 */
const COUNTING_RULE =
  "6+3+12+owned+nonOwned+prohibited+services+capabilities+contracts+lifecycle+requestCategories+responseCategories+accessModes+serviceCapabilityRelationships+modelInventory+validationGroups+validationRules+validationEvidence+validationResults+manifestSections+manifestDependencies+manifestCompatibility+manifestGuarantees+manifestPublicApis+platformCompatibility+consumers+platformGuarantees+platformPublicApis";

const counts = KnowledgeServicesPlatformObservedCounts;
const chain = KnowledgeServicesPlatformChainIds;

const totalEntryCount =
  6 +
  3 +
  KnowledgeServicesPlatformDependencies.length +
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
  counts.manifestSectionCount +
  counts.manifestDependencyCount +
  counts.manifestCompatibilityCount +
  counts.manifestGuaranteeCount +
  counts.manifestPublicApiCount +
  KnowledgeServicesPlatformCompatibility.length +
  KnowledgeServicesPlatformConsumers.length +
  KnowledgeServicesPlatformGuarantees.length +
  KnowledgeServicesPlatformPublicApis.length;

export const KnowledgeServicesPlatformInventory: PlatformInventoryRecord =
  Object.freeze({
    inventoryId: "DKL-7:6/KnowledgeServicesPlatformInventory",
    completedPhaseCount: 6 as const,
    futurePhaseCount: 3 as const,
    totalPhaseCount: 9 as const,
    sectionCount: 20 as const,
    dependencyCount: 12 as const,
    compatibilityCount: 14 as const,
    consumerCount: 4 as const,
    guaranteeCount: 20 as const,
    publicApiCount: 12 as const,
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
    manifestSectionCount: counts.manifestSectionCount,
    manifestDependencyCount: counts.manifestDependencyCount,
    manifestCompatibilityCount: counts.manifestCompatibilityCount,
    manifestGuaranteeCount: counts.manifestGuaranteeCount,
    manifestPublicApiCount: counts.manifestPublicApiCount,
    manifestInventoryCount: counts.manifestInventoryCount,
    totalEntryCount,
    countingRule: COUNTING_RULE,
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  });

const identity: KnowledgeServicesPlatformIdentity = Object.freeze({
  platformId: KnowledgeServicesPlatformId,
  platformName: KnowledgeServicesPlatformName,
  platformVersion: KnowledgeServicesPlatformVersion,
  platformNamespace: KnowledgeServicesPlatformNamespace,
  layer: "Data Knowledge Layer",
  phase: "DKL-7",
  stage: "Platform",
  sourcePhase: "DKL-7:6",
  owner: "DKL-7 Knowledge Services",
  status: KnowledgeServicesPlatformStatus,
  architectureStatus: KnowledgeServicesPlatformArchitectureStatus,
  validationResult: "Pass",
  manifestStatus: KnowledgeServicesManifestStatus,
  readiness: KnowledgeServicesPlatformReadiness,
  manifestId: KnowledgeServicesManifestId,
  manifestVersion: KnowledgeServicesManifestVersion,
  validationId: chain.validationId,
  modelId: chain.modelId,
  registryId: chain.registryId,
  foundationId: chain.foundationId,
  dkl6PublicIndexId: chain.dkl6PublicIndexId,
  metadataOnly: true,
  immutable: true,
});

const metadata: KnowledgeServicesPlatformMetadata = Object.freeze({
  metadataId: "DKL-7:6/KnowledgeServicesPlatformMetadata",
  platformId: KnowledgeServicesPlatformId,
  description:
    "Canonical immutable platform surface assembling Foundation through Manifest for Knowledge Services.",
  metadataOnly: true,
  declarationOnly: true,
  runtimeBehavior: false,
  transportNeutral: true,
  persistenceNeutral: true,
  immutable: true,
  deterministic: true,
});

const dependencyDeclarations = Object.freeze({
  directPreviousPhaseModule: "knowledgeServicesManifest.ts" as const,
  manifestOnly: true as const,
  validationDirectImport: false as const,
  modelDirectImport: false as const,
  registryDirectImport: false as const,
  foundationDirectImport: false as const,
  dkl6DirectImport: false as const,
  validationReachedThroughManifest: true as const,
  modelReachedThroughValidation: true as const,
  registryReachedThroughModel: true as const,
  foundationReachedThroughRegistry: true as const,
  dkl6ReachedThroughFoundation: true as const,
});

/** Canonical immutable Knowledge Services Platform aggregate. */
export const KnowledgeServicesPlatform = Object.freeze({
  identity,
  metadata,
  manifest: KnowledgeServicesManifest,
  architecture: Object.freeze({
    status: KnowledgeServicesPlatformArchitectureStatus,
    phases: KnowledgeServicesPlatformPhases,
    completedPhaseCount: 6 as const,
    futurePhaseCount: 3 as const,
    totalPhaseCount: 9 as const,
  }),
  foundation: KnowledgeServicesPlatformFoundationSurface,
  registry: KnowledgeServicesPlatformRegistrySurface,
  model: KnowledgeServicesPlatformModelSurface,
  validation: KnowledgeServicesPlatformValidationSurface,
  services: KnowledgeServicesPlatformServices,
  capabilities: KnowledgeServicesPlatformCapabilities,
  contracts: KnowledgeServicesPlatformContracts,
  dependencies: KnowledgeServicesPlatformDependencies,
  ownership: KnowledgeServicesPlatformOwnership,
  boundaries: KnowledgeServicesPlatformBoundaries,
  compatibility: KnowledgeServicesPlatformCompatibility,
  consumers: KnowledgeServicesPlatformConsumers,
  inventory: KnowledgeServicesPlatformInventory,
  guarantees: KnowledgeServicesPlatformGuarantees,
  status: KnowledgeServicesPlatformStatus,
  readiness: KnowledgeServicesPlatformReadiness,
  publicApi: KnowledgeServicesPlatformPublicApis,
  dependencyDeclarations,
  architectureStatus: KnowledgeServicesPlatformArchitectureStatus,
  validationResult: "Pass" as const,
  manifestStatus: KnowledgeServicesManifestStatus,
  nextPhase: "DKL-7:7 — Knowledge Services Certification",
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

/** Deterministic Platform inventory count from canonical inventory fields. */
export function getKnowledgeServicesPlatformInventoryCount(): number {
  return KnowledgeServicesPlatformInventory.totalEntryCount;
}

/** Deterministic frozen Platform summary. */
export function getKnowledgeServicesPlatformSummary(): KnowledgeServicesPlatformSummary {
  return Object.freeze({
    platformId: KnowledgeServicesPlatformId,
    version: KnowledgeServicesPlatformVersion,
    status: KnowledgeServicesPlatformStatus,
    readiness: KnowledgeServicesPlatformReadiness,
    architectureStatus: KnowledgeServicesPlatformArchitectureStatus,
    validationResult: "Pass",
    manifestStatus: KnowledgeServicesManifestStatus,
    manifestId: chain.manifestId,
    validationId: chain.validationId,
    modelId: chain.modelId,
    registryId: chain.registryId,
    foundationId: chain.foundationId,
    dkl6PublicIndexId: chain.dkl6PublicIndexId,
    completedPhaseCount: 6,
    futurePhaseCount: 3,
    sectionCount: 20,
    serviceCount: counts.serviceCount,
    capabilityCount: counts.capabilityCount,
    contractCount: counts.contractCount,
    lifecycleCount: counts.lifecycleStageCount,
    ownedCount: counts.ownedResponsibilityCount,
    nonOwnedCount: counts.nonOwnedResponsibilityCount,
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
    modelInventoryCount: counts.modelInventoryCount,
    validationGroupCount: counts.validationGroupCount,
    validationRuleCount: counts.validationRuleCount,
    validationPassCount: counts.validationPassCount,
    validationFailCount: counts.validationFailCount,
    manifestInventoryCount: counts.manifestInventoryCount,
    platformDependencyCount: KnowledgeServicesPlatformDependencies.length,
    compatibilityCount: KnowledgeServicesPlatformCompatibility.length,
    consumerCount: KnowledgeServicesPlatformConsumers.length,
    guaranteeCount: KnowledgeServicesPlatformGuarantees.length,
    publicApiCount: KnowledgeServicesPlatformPublicApis.length,
    platformInventoryCount: KnowledgeServicesPlatformInventory.totalEntryCount,
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  });
}
