/**
 * DKL-9:3 — Data Knowledge Suite Model.
 *
 * Canonical immutable structural model for Suite composition.
 * Consumes only DataKnowledgeSuiteRegistryPlatform.
 * Metadata-only. Runtime-free. Ready for Validation.
 *
 * Ownership: owned exclusively by DKL-9:3.
 *
 * Public exports (exactly 8):
 *   DataKnowledgeSuiteModelId
 *   DataKnowledgeSuiteModelVersion
 *   DataKnowledgeSuiteModelName
 *   DataKnowledgeSuiteModelNamespace
 *   DataKnowledgeSuiteModelStatus
 *   DataKnowledgeSuiteModelReadiness
 *   DataKnowledgeSuiteModelPlatform
 *   getDataKnowledgeSuiteModelSummary()
 */

import {
  DataKnowledgeSuiteRegistryId,
  DataKnowledgeSuiteRegistryPlatform,
  DataKnowledgeSuiteRegistryVersion,
} from "./dataKnowledgeSuiteRegistry.ts";
import {
  DataKnowledgeSuiteCapabilityModels,
  DataKnowledgeSuiteCapabilityOrderingModels,
  DataKnowledgeSuiteCapabilityReadinessModels,
  DataKnowledgeSuiteCapabilityReferenceModels,
  DataKnowledgeSuiteCapabilityStatusModels,
  DataKnowledgeSuiteCapabilityVersionModels,
  DataKnowledgeSuiteCompositionModelKinds,
  DataKnowledgeSuiteSuiteModels,
} from "./dataKnowledgeSuiteCompositionModels.ts";
import {
  DataKnowledgeSuiteCapabilityDependencyModels,
  DataKnowledgeSuiteDependencyModelKinds,
} from "./dataKnowledgeSuiteDependencyModels.ts";
import type {
  DataKnowledgeSuiteModelKindDescriptor,
  DataKnowledgeSuiteModelSummary,
} from "./dataKnowledgeSuiteModelTypes.ts";
import {
  DataKnowledgeSuiteReferenceModelKinds,
  DataKnowledgeSuiteBoundaryReferenceModels,
  DataKnowledgeSuiteIntegrationContractReferenceModels,
  DataKnowledgeSuiteOwnershipReferenceModels,
  DataKnowledgeSuitePublicApiRegistryReferenceModels,
  DataKnowledgeSuitePublicPlatformReferenceModels,
} from "./dataKnowledgeSuiteReferenceModels.ts";
import {
  DataKnowledgeSuiteReleaseModelKinds,
  DataKnowledgeSuiteReleaseModels,
  DataKnowledgeSuiteResultModels,
  DataKnowledgeSuiteSnapshotModels,
} from "./dataKnowledgeSuiteReleaseModels.ts";
import {
  DataKnowledgeSuiteModelGuarantees,
  DataKnowledgeSuiteRelationshipKinds,
} from "./dataKnowledgeSuiteRelationshipModels.ts";

export const DataKnowledgeSuiteModelId =
  "DKL-9:3/DataKnowledgeSuiteModel" as const;

export const DataKnowledgeSuiteModelName =
  "Data Knowledge Suite Model" as const;

export const DataKnowledgeSuiteModelVersion = "1.0.0" as const;

export const DataKnowledgeSuiteModelNamespace =
  "nexora.dkl.data-knowledge-suite.model" as const;

export const DataKnowledgeSuiteModelStatus = "ModelDefined" as const;

export const DataKnowledgeSuiteModelReadiness =
  "ReadyForValidation" as const;

const registry = DataKnowledgeSuiteRegistryPlatform;

const modelKinds: readonly DataKnowledgeSuiteModelKindDescriptor[] =
  Object.freeze([
    ...DataKnowledgeSuiteCompositionModelKinds,
    ...DataKnowledgeSuiteReferenceModelKinds,
    ...DataKnowledgeSuiteDependencyModelKinds,
    ...DataKnowledgeSuiteReleaseModelKinds,
  ]);

const PLATFORM_SECTIONS = Object.freeze([
  "identity",
  "dependency",
  "modelKinds",
  "suite",
  "capabilities",
  "capabilityReferences",
  "capabilityDependencies",
  "capabilityOrdering",
  "capabilityVersions",
  "capabilityStatuses",
  "capabilityReadiness",
  "publicPlatformReferences",
  "publicApiRegistryReferences",
  "integrationContractReferences",
  "ownershipReferences",
  "boundaryReferences",
  "releases",
  "snapshots",
  "results",
  "relationships",
  "guarantees",
  "inventory",
  "readiness",
] as const);

const totalModelInstanceCount =
  DataKnowledgeSuiteSuiteModels.length +
  DataKnowledgeSuiteCapabilityModels.length +
  DataKnowledgeSuiteCapabilityReferenceModels.length +
  DataKnowledgeSuiteCapabilityDependencyModels.length +
  DataKnowledgeSuiteCapabilityOrderingModels.length +
  DataKnowledgeSuiteCapabilityVersionModels.length +
  DataKnowledgeSuiteCapabilityStatusModels.length +
  DataKnowledgeSuiteCapabilityReadinessModels.length +
  DataKnowledgeSuitePublicPlatformReferenceModels.length +
  DataKnowledgeSuitePublicApiRegistryReferenceModels.length +
  DataKnowledgeSuiteIntegrationContractReferenceModels.length +
  DataKnowledgeSuiteOwnershipReferenceModels.length +
  DataKnowledgeSuiteBoundaryReferenceModels.length +
  DataKnowledgeSuiteReleaseModels.length +
  DataKnowledgeSuiteSnapshotModels.length +
  DataKnowledgeSuiteResultModels.length;

const inventory = Object.freeze({
  inventoryId: "DKL-9:3/DataKnowledgeSuiteModelInventory",
  modelKindCount: modelKinds.length,
  relationshipKindCount: DataKnowledgeSuiteRelationshipKinds.length,
  suiteModelCount: DataKnowledgeSuiteSuiteModels.length,
  capabilityModelCount: DataKnowledgeSuiteCapabilityModels.length,
  capabilityReferenceModelCount:
    DataKnowledgeSuiteCapabilityReferenceModels.length,
  dependencyModelCount: DataKnowledgeSuiteCapabilityDependencyModels.length,
  orderingModelCount: DataKnowledgeSuiteCapabilityOrderingModels.length,
  versionModelCount: DataKnowledgeSuiteCapabilityVersionModels.length,
  statusModelCount: DataKnowledgeSuiteCapabilityStatusModels.length,
  readinessModelCount: DataKnowledgeSuiteCapabilityReadinessModels.length,
  publicPlatformReferenceCount:
    DataKnowledgeSuitePublicPlatformReferenceModels.length,
  publicApiRegistryReferenceCount:
    DataKnowledgeSuitePublicApiRegistryReferenceModels.length,
  integrationContractReferenceCount:
    DataKnowledgeSuiteIntegrationContractReferenceModels.length,
  ownershipReferenceCount: DataKnowledgeSuiteOwnershipReferenceModels.length,
  boundaryReferenceCount: DataKnowledgeSuiteBoundaryReferenceModels.length,
  releaseModelCount: DataKnowledgeSuiteReleaseModels.length,
  snapshotModelCount: DataKnowledgeSuiteSnapshotModels.length,
  resultModelCount: DataKnowledgeSuiteResultModels.length,
  guaranteeCount: DataKnowledgeSuiteModelGuarantees.length,
  totalModelInstanceCount,
  publicApiInventoryTotal: registry.inventory.publicApiInventoryTotal,
  registryTotalEntryCount: registry.inventory.totalEntryCount,
  registryInventory: registry.inventory,
  sourcedThroughRegistry: true as const,
  reconstructed: false as const,
  hardcoded: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

const identity = Object.freeze({
  modelId: DataKnowledgeSuiteModelId,
  modelName: DataKnowledgeSuiteModelName,
  modelVersion: DataKnowledgeSuiteModelVersion,
  modelNamespace: DataKnowledgeSuiteModelNamespace,
  layer: "Data Knowledge Layer" as const,
  phase: "DKL-9" as const,
  stage: "Model" as const,
  sourcePhase: "DKL-9:3" as const,
  owner: "DKL-9 Data Knowledge Suite",
  status: DataKnowledgeSuiteModelStatus,
  readiness: DataKnowledgeSuiteModelReadiness,
  registryId: DataKnowledgeSuiteRegistryId,
  registryVersion: DataKnowledgeSuiteRegistryVersion,
  metadataOnly: true as const,
  immutable: true as const,
});

const dependency = Object.freeze({
  dependencyId: "DKL-9:3/Dependency/DKL92Registry",
  directPreviousPhaseModule: "dataKnowledgeSuiteRegistry.ts" as const,
  registryOnly: true as const,
  registryId: DataKnowledgeSuiteRegistryId,
  registryVersion: DataKnowledgeSuiteRegistryVersion,
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
  reconstructsRegistry: false as const,
  reconstructsUpstreamModels: false as const,
  duplicatesUpstreamModels: false as const,
  canonicalPath:
    "DKL-9:3 → DKL-9:2 Registry → DKL-9:1 Foundation → DKL-1..DKL-8 Public Indexes",
  runtimeBehavior: "None" as const,
  metadataOnly: true as const,
});

const modelApi = (
  exportName: string,
  kind:
    | "Aggregate"
    | "IdentityConstant"
    | "MetadataConstant"
    | "Helper",
) =>
  Object.freeze({
    id: `DKL-9:3/PublicApi/${exportName}`,
    exportName,
    phase: "DKL-9:3" as const,
    section: "Model" as const,
    kind,
    version: DataKnowledgeSuiteModelVersion,
    status: DataKnowledgeSuiteModelStatus,
    stability: "Stable" as const,
    public: true as const,
    sourceReference: "dataKnowledgeSuiteModel.ts" as const,
  });

/** Additive public-surface registry — exactly eight top-level exports. */
const DataKnowledgeSuiteModelApiRegistry = Object.freeze([
  modelApi("DataKnowledgeSuiteModelId", "IdentityConstant"),
  modelApi("DataKnowledgeSuiteModelVersion", "IdentityConstant"),
  modelApi("DataKnowledgeSuiteModelName", "IdentityConstant"),
  modelApi("DataKnowledgeSuiteModelNamespace", "IdentityConstant"),
  modelApi("DataKnowledgeSuiteModelStatus", "MetadataConstant"),
  modelApi("DataKnowledgeSuiteModelReadiness", "MetadataConstant"),
  modelApi("DataKnowledgeSuiteModelPlatform", "Aggregate"),
  modelApi("getDataKnowledgeSuiteModelSummary", "Helper"),
]);

/**
 * Canonical immutable Data Knowledge Suite Model platform.
 */
export const DataKnowledgeSuiteModelPlatform = Object.freeze({
  identity,
  dependency,
  modelKinds,
  suite: DataKnowledgeSuiteSuiteModels,
  capabilities: DataKnowledgeSuiteCapabilityModels,
  capabilityReferences: DataKnowledgeSuiteCapabilityReferenceModels,
  capabilityDependencies: DataKnowledgeSuiteCapabilityDependencyModels,
  capabilityOrdering: DataKnowledgeSuiteCapabilityOrderingModels,
  capabilityVersions: DataKnowledgeSuiteCapabilityVersionModels,
  capabilityStatuses: DataKnowledgeSuiteCapabilityStatusModels,
  capabilityReadiness: DataKnowledgeSuiteCapabilityReadinessModels,
  publicPlatformReferences: DataKnowledgeSuitePublicPlatformReferenceModels,
  publicApiRegistryReferences:
    DataKnowledgeSuitePublicApiRegistryReferenceModels,
  integrationContractReferences:
    DataKnowledgeSuiteIntegrationContractReferenceModels,
  ownershipReferences: DataKnowledgeSuiteOwnershipReferenceModels,
  boundaryReferences: DataKnowledgeSuiteBoundaryReferenceModels,
  releases: DataKnowledgeSuiteReleaseModels,
  snapshots: DataKnowledgeSuiteSnapshotModels,
  results: DataKnowledgeSuiteResultModels,
  relationships: DataKnowledgeSuiteRelationshipKinds,
  guarantees: DataKnowledgeSuiteModelGuarantees,
  inventory,
  readiness: DataKnowledgeSuiteModelReadiness,
  apiRegistry: DataKnowledgeSuiteModelApiRegistry,
  sectionOrder: PLATFORM_SECTIONS,
  sectionCount: PLATFORM_SECTIONS.length,
  status: DataKnowledgeSuiteModelStatus,
  nextPhase: "DKL-9:4 — Data Knowledge Suite Validation",
  registry,
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
  duplicatesUpstreamModels: false as const,
  immutable: true as const,
  deterministic: true as const,
});

/** Deterministic frozen Data Knowledge Suite Model summary. */
export function getDataKnowledgeSuiteModelSummary(): DataKnowledgeSuiteModelSummary {
  return Object.freeze({
    modelId: DataKnowledgeSuiteModelId,
    version: DataKnowledgeSuiteModelVersion,
    name: DataKnowledgeSuiteModelName,
    namespace: DataKnowledgeSuiteModelNamespace,
    status: DataKnowledgeSuiteModelStatus,
    readiness: DataKnowledgeSuiteModelReadiness,
    registryId: DataKnowledgeSuiteRegistryId,
    modelKindCount: modelKinds.length,
    relationshipKindCount: DataKnowledgeSuiteRelationshipKinds.length,
    suiteModelCount: DataKnowledgeSuiteSuiteModels.length,
    capabilityModelCount: DataKnowledgeSuiteCapabilityModels.length,
    referenceModelCount:
      DataKnowledgeSuiteCapabilityReferenceModels.length +
      DataKnowledgeSuitePublicPlatformReferenceModels.length +
      DataKnowledgeSuitePublicApiRegistryReferenceModels.length +
      DataKnowledgeSuiteIntegrationContractReferenceModels.length +
      DataKnowledgeSuiteOwnershipReferenceModels.length +
      DataKnowledgeSuiteBoundaryReferenceModels.length,
    dependencyModelCount: DataKnowledgeSuiteCapabilityDependencyModels.length,
    releaseModelCount:
      DataKnowledgeSuiteReleaseModels.length +
      DataKnowledgeSuiteSnapshotModels.length +
      DataKnowledgeSuiteResultModels.length,
    publicApiInventoryTotal: registry.inventory.publicApiInventoryTotal,
    registryTotalEntryCount: registry.inventory.totalEntryCount,
    totalModelInstanceCount,
    sectionCount: PLATFORM_SECTIONS.length,
    nextPhase: "DKL-9:4 — Data Knowledge Suite Validation",
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
}
