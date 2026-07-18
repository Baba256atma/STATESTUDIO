/**
 * DKL-9:5 — Data Knowledge Suite Manifest.
 *
 * Canonical immutable architectural manifest for the Data Knowledge Suite
 * (DKL-9:1 through DKL-9:4). Consumes only DataKnowledgeSuiteValidationPlatform.
 * Metadata-only. Manifest-only. Runtime-free.
 *
 * Ownership: owned exclusively by DKL-9:5.
 *
 * Public exports (exactly 8):
 *   DataKnowledgeSuiteManifestId
 *   DataKnowledgeSuiteManifestVersion
 *   DataKnowledgeSuiteManifestName
 *   DataKnowledgeSuiteManifestNamespace
 *   DataKnowledgeSuiteManifestStatus
 *   DataKnowledgeSuiteManifestReadiness
 *   DataKnowledgeSuiteManifestPlatform
 *   getDataKnowledgeSuiteManifestSummary()
 */

import { DataKnowledgeSuiteValidationPlatform } from "./dataKnowledgeSuiteValidation.ts";
import {
  DATA_KNOWLEDGE_SUITE_MANIFEST_COUNTING_RULE,
  DataKnowledgeSuiteManifestObservedCounts,
} from "./dataKnowledgeSuiteManifestCounts.ts";
import { DataKnowledgeSuiteManifestGuarantees } from "./dataKnowledgeSuiteManifestGuarantees.ts";
import {
  DataKnowledgeSuiteManifestApiInventory,
  DataKnowledgeSuiteManifestBoundaryInventory,
  DataKnowledgeSuiteManifestCapabilityInventory,
  DataKnowledgeSuiteManifestChainIds,
  DataKnowledgeSuiteManifestDependencyInventory,
  DataKnowledgeSuiteManifestOwnershipInventory,
  DataKnowledgeSuiteManifestPlatformInventory,
  DataKnowledgeSuiteManifestUpstreamSurfaces,
  DataKnowledgeSuiteManifestValidationInventory,
} from "./dataKnowledgeSuiteManifestInventory.ts";
import {
  DataKnowledgeSuiteManifestArchitecturePhases,
  DataKnowledgeSuiteManifestMetadata,
} from "./dataKnowledgeSuiteManifestMetadata.ts";
import {
  DataKnowledgeSuiteManifestArchitectureStatus,
  DataKnowledgeSuiteManifestPublicApis,
  DataKnowledgeSuiteManifestReadinessValue,
} from "./dataKnowledgeSuiteManifestReadiness.ts";
import type { DataKnowledgeSuiteManifestSummary } from "./dataKnowledgeSuiteManifestTypes.ts";

const validation = DataKnowledgeSuiteValidationPlatform;
const counts = DataKnowledgeSuiteManifestObservedCounts;

export const DataKnowledgeSuiteManifestId =
  "DKL-9:5/DataKnowledgeSuiteManifest" as const;

export const DataKnowledgeSuiteManifestName =
  "Data Knowledge Suite Manifest" as const;

export const DataKnowledgeSuiteManifestVersion = "1.0.0" as const;

export const DataKnowledgeSuiteManifestNamespace =
  "nexora.dkl.data-knowledge-suite.manifest" as const;

export const DataKnowledgeSuiteManifestStatus = "ManifestDefined" as const;

export const DataKnowledgeSuiteManifestReadiness =
  DataKnowledgeSuiteManifestReadinessValue;

const PLATFORM_SECTIONS = Object.freeze([
  "identity",
  "metadata",
  "dependency",
  "architecture",
  "capabilityInventory",
  "platformInventory",
  "apiInventory",
  "dependencyInventory",
  "ownershipInventory",
  "boundaryInventory",
  "validationInventory",
  "upstream",
  "inventory",
  "counts",
  "guarantees",
  "publicApi",
  "readiness",
] as const);

const totalEntryCount =
  counts.capabilityCount +
  counts.publicPlatformReferenceCount +
  counts.publicApiRegistryReferenceCount +
  counts.dependencyCount +
  counts.ownershipReferenceCount +
  counts.boundaryReferenceCount +
  counts.validationRuleCount +
  counts.validationGateCount +
  counts.validationCategoryCount +
  DataKnowledgeSuiteManifestGuarantees.length +
  DataKnowledgeSuiteManifestPublicApis.length;

const inventory = Object.freeze({
  inventoryId: "DKL-9:5/DataKnowledgeSuiteManifestInventory",
  capabilityCount: counts.capabilityCount,
  capabilityReferenceCount: counts.capabilityReferenceCount,
  publicPlatformReferenceCount: counts.publicPlatformReferenceCount,
  publicApiRegistryReferenceCount: counts.publicApiRegistryReferenceCount,
  publicApiInventoryTotal: counts.publicApiInventoryTotal,
  dependencyCount: counts.dependencyCount,
  relationshipKindCount: counts.relationshipKindCount,
  ownershipReferenceCount: counts.ownershipReferenceCount,
  boundaryReferenceCount: counts.boundaryReferenceCount,
  modelKindCount: counts.modelKindCount,
  suiteModelCount: counts.suiteModelCount,
  totalModelInstanceCount: counts.totalModelInstanceCount,
  validationRuleCount: counts.validationRuleCount,
  validationGateCount: counts.validationGateCount,
  validationCategoryCount: counts.validationCategoryCount,
  validationSeverityCount: counts.validationSeverityCount,
  validationOutcomeCount: counts.validationOutcomeCount,
  registryTotalEntryCount: counts.registryTotalEntryCount,
  registryContractCount: counts.registryContractCount,
  registryIntegrationContractCount: counts.registryIntegrationContractCount,
  lifecycleStateCount: counts.lifecycleStateCount,
  guaranteeCount: DataKnowledgeSuiteManifestGuarantees.length,
  publicApiCount: DataKnowledgeSuiteManifestPublicApis.length,
  completedPhaseCount: DataKnowledgeSuiteManifestMetadata.completedPhaseCount,
  futurePhaseCount: DataKnowledgeSuiteManifestMetadata.futurePhaseCount,
  totalDkl9PhaseCount: DataKnowledgeSuiteManifestMetadata.totalDkl9PhaseCount,
  sectionCount: PLATFORM_SECTIONS.length,
  totalEntryCount,
  countingRule: DATA_KNOWLEDGE_SUITE_MANIFEST_COUNTING_RULE,
  validationInventory: validation.inventory,
  modelInventory: validation.model.inventory,
  sourcedThroughValidation: true as const,
  reconstructed: false as const,
  hardcoded: false as const,
  duplicated: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

const identity = Object.freeze({
  manifestId: DataKnowledgeSuiteManifestId,
  manifestName: DataKnowledgeSuiteManifestName,
  manifestVersion: DataKnowledgeSuiteManifestVersion,
  manifestNamespace: DataKnowledgeSuiteManifestNamespace,
  layer: "Data Knowledge Layer" as const,
  phase: "DKL-9" as const,
  stage: "Manifest" as const,
  sourcePhase: "DKL-9:5" as const,
  owner: "DKL-9 Data Knowledge Suite",
  status: DataKnowledgeSuiteManifestStatus,
  readiness: DataKnowledgeSuiteManifestReadiness,
  validationId: validation.identity.validationId,
  validationVersion: validation.identity.validationVersion,
  architectureStatus: DataKnowledgeSuiteManifestArchitectureStatus,
  metadataOnly: true as const,
  immutable: true as const,
});

const dependency = Object.freeze({
  dependencyId: "DKL-9:5/Dependency/DKL94Validation",
  directPreviousPhaseModule: "dataKnowledgeSuiteValidation.ts" as const,
  validationOnly: true as const,
  validationId: validation.identity.validationId,
  validationVersion: validation.identity.validationVersion,
  modelDirectImport: false as const,
  registryDirectImport: false as const,
  foundationDirectImport: false as const,
  publicIndexDirectImport: false as const,
  dkl1DirectImport: false as const,
  dkl2DirectImport: false as const,
  dkl3DirectImport: false as const,
  dkl4DirectImport: false as const,
  dkl5DirectImport: false as const,
  dkl6DirectImport: false as const,
  dkl7DirectImport: false as const,
  dkl8DirectImport: false as const,
  reconstructsValidation: false as const,
  reconstructsUpstream: false as const,
  canonicalPath:
    "DKL-9:5 → DKL-9:4 Validation → DKL-9:3 Model → DKL-9:2 Registry → DKL-9:1 Foundation → DKL-1..DKL-8 Public Indexes",
  runtimeBehavior: "None" as const,
  metadataOnly: true as const,
});

/**
 * Canonical immutable Data Knowledge Suite Manifest platform.
 */
export const DataKnowledgeSuiteManifestPlatform = Object.freeze({
  identity,
  metadata: DataKnowledgeSuiteManifestMetadata,
  dependency,
  architecture: Object.freeze({
    phases: DataKnowledgeSuiteManifestArchitecturePhases,
    architectureStatus: DataKnowledgeSuiteManifestArchitectureStatus,
    chainIds: DataKnowledgeSuiteManifestChainIds,
    completedPhaseCount: DataKnowledgeSuiteManifestMetadata.completedPhaseCount,
    futurePhaseCount: DataKnowledgeSuiteManifestMetadata.futurePhaseCount,
    totalPhaseCount: DataKnowledgeSuiteManifestMetadata.totalDkl9PhaseCount,
  }),
  capabilityInventory: DataKnowledgeSuiteManifestCapabilityInventory,
  platformInventory: DataKnowledgeSuiteManifestPlatformInventory,
  apiInventory: DataKnowledgeSuiteManifestApiInventory,
  dependencyInventory: DataKnowledgeSuiteManifestDependencyInventory,
  ownershipInventory: DataKnowledgeSuiteManifestOwnershipInventory,
  boundaryInventory: DataKnowledgeSuiteManifestBoundaryInventory,
  validationInventory: DataKnowledgeSuiteManifestValidationInventory,
  upstream: DataKnowledgeSuiteManifestUpstreamSurfaces,
  inventory,
  counts: Object.freeze({
    ...counts,
    guaranteeCount: DataKnowledgeSuiteManifestGuarantees.length,
    publicApiCount: DataKnowledgeSuiteManifestPublicApis.length,
    totalEntryCount,
  }),
  guarantees: DataKnowledgeSuiteManifestGuarantees,
  publicApi: DataKnowledgeSuiteManifestPublicApis,
  apiRegistry: DataKnowledgeSuiteManifestPublicApis,
  readiness: DataKnowledgeSuiteManifestReadiness,
  sectionOrder: PLATFORM_SECTIONS,
  sectionCount: PLATFORM_SECTIONS.length,
  status: DataKnowledgeSuiteManifestStatus,
  nextPhase: "DKL-9:6 — Data Knowledge Suite Platform",
  upstreamValidation: validation,
  metadataOnly: true as const,
  runtimeBehavior: false as const,
  runtimeEnforcement: false as const,
  policyExecution: false as const,
  authenticationBehavior: false as const,
  authorizationBehavior: false as const,
  repositoryAccess: false as const,
  searchExecution: false as const,
  graphTraversal: false as const,
  aiBehavior: false as const,
  transportBehavior: false as const,
  engineReasoning: false as const,
  advisorBehavior: false as const,
  sceneBehavior: false as const,
  uiBehavior: false as const,
  reconstructsUpstream: false as const,
  duplicatesInventories: false as const,
  immutable: true as const,
  deterministic: true as const,
});

/** Deterministic frozen Data Knowledge Suite Manifest summary. */
export function getDataKnowledgeSuiteManifestSummary(): DataKnowledgeSuiteManifestSummary {
  return Object.freeze({
    manifestId: DataKnowledgeSuiteManifestId,
    version: DataKnowledgeSuiteManifestVersion,
    name: DataKnowledgeSuiteManifestName,
    namespace: DataKnowledgeSuiteManifestNamespace,
    status: DataKnowledgeSuiteManifestStatus,
    readiness: DataKnowledgeSuiteManifestReadiness,
    validationId: validation.identity.validationId,
    capabilityCount: counts.capabilityCount,
    publicApiInventoryTotal: counts.publicApiInventoryTotal,
    validationRuleCount: counts.validationRuleCount,
    validationGateCount: counts.validationGateCount,
    guaranteeCount: DataKnowledgeSuiteManifestGuarantees.length,
    totalEntryCount,
    sectionCount: PLATFORM_SECTIONS.length,
    nextPhase: "DKL-9:6 — Data Knowledge Suite Platform",
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
}
