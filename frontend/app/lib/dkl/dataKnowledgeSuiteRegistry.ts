/**
 * DKL-9:2 — Data Knowledge Suite Registry.
 *
 * Canonical immutable registry for Suite-level composition metadata.
 * Consumes only DataKnowledgeSuiteFoundationPlatform.
 * Metadata-only. Runtime-free. Ready for Model.
 *
 * Ownership: owned exclusively by DKL-9:2.
 *
 * Public exports (exactly 8):
 *   DataKnowledgeSuiteRegistryId
 *   DataKnowledgeSuiteRegistryVersion
 *   DataKnowledgeSuiteRegistryName
 *   DataKnowledgeSuiteRegistryNamespace
 *   DataKnowledgeSuiteRegistryStatus
 *   DataKnowledgeSuiteRegistryReadiness
 *   DataKnowledgeSuiteRegistryPlatform
 *   getDataKnowledgeSuiteRegistrySummary()
 */

import {
  DataKnowledgeSuiteFoundationId,
  DataKnowledgeSuiteFoundationPlatform,
  DataKnowledgeSuiteFoundationVersion,
} from "./dataKnowledgeSuiteFoundation.ts";
import {
  DataKnowledgeSuiteCapabilityOrder,
  DataKnowledgeSuiteCapabilityReferenceRegistry,
  DataKnowledgeSuiteCapabilityRegistry,
  DataKnowledgeSuitePublicApiCountRegistry,
  DataKnowledgeSuitePublicApiRegistryRefs,
  DataKnowledgeSuitePublicPlatformRegistry,
  DataKnowledgeSuiteReadinessRegistry,
  DataKnowledgeSuiteStatusRegistry,
  DataKnowledgeSuiteVersionRegistry,
} from "./dataKnowledgeSuiteCapabilityRegistry.ts";
import {
  DataKnowledgeSuiteContractRegistry,
  DataKnowledgeSuiteIntegrationContractRegistry,
} from "./dataKnowledgeSuiteContractRegistry.ts";
import {
  DataKnowledgeSuiteCompatibilityRegistry,
  DataKnowledgeSuiteDependencyRegistry,
} from "./dataKnowledgeSuiteDependencyRegistry.ts";
import {
  DataKnowledgeSuiteLifecycleAggregate,
  DataKnowledgeSuiteLifecycleStateRegistry,
  DataKnowledgeSuiteRegistryGuarantees,
} from "./dataKnowledgeSuiteLifecycleRegistry.ts";
import {
  DataKnowledgeSuiteBoundariesAggregate,
  DataKnowledgeSuiteBoundaryRegistry,
  DataKnowledgeSuiteOwnershipAggregate,
  DataKnowledgeSuiteOwnershipRegistry,
} from "./dataKnowledgeSuiteOwnershipRegistry.ts";
import type {
  DataKnowledgeSuiteRegistryEntryBase,
  DataKnowledgeSuiteRegistrySummary,
} from "./dataKnowledgeSuiteRegistryTypes.ts";

export const DataKnowledgeSuiteRegistryId =
  "DKL-9:2/DataKnowledgeSuiteRegistry" as const;

export const DataKnowledgeSuiteRegistryName =
  "Data Knowledge Suite Registry" as const;

export const DataKnowledgeSuiteRegistryVersion = "1.0.0" as const;

export const DataKnowledgeSuiteRegistryNamespace =
  "nexora.dkl.data-knowledge-suite.registry" as const;

export const DataKnowledgeSuiteRegistryStatus = "RegistryDefined" as const;

export const DataKnowledgeSuiteRegistryReadiness = "ReadyForModel" as const;

const foundation = DataKnowledgeSuiteFoundationPlatform;

const findById = <T extends DataKnowledgeSuiteRegistryEntryBase>(
  collection: readonly T[],
  id: string,
): T | undefined => collection.find((item) => item.id === id);

const PLATFORM_SECTIONS = Object.freeze([
  "identity",
  "dependency",
  "capabilities",
  "capabilityReferences",
  "capabilityOrder",
  "publicPlatforms",
  "publicApiRegistryRefs",
  "publicApiCounts",
  "versions",
  "statuses",
  "readinessEntries",
  "dependencies",
  "ownership",
  "boundaries",
  "compatibility",
  "lifecycle",
  "contracts",
  "integrationContracts",
  "guarantees",
  "inventory",
  "readiness",
] as const);

/**
 * Counting rule:
 * capabilities + capabilityReferences + publicPlatforms + publicApiRegistryRefs +
 * publicApiCounts + versions + statuses + readinessEntries + dependencies +
 * ownership + boundaries + compatibility + lifecycleStates + contracts +
 * integrationContracts + guarantees
 */
const COUNTING_RULE =
  "capabilities + capabilityReferences + publicPlatforms + publicApiRegistryRefs + publicApiCounts + versions + statuses + readinessEntries + dependencies + ownership + boundaries + compatibility + lifecycleStates + contracts + integrationContracts + guarantees";

const totalEntryCount =
  DataKnowledgeSuiteCapabilityRegistry.length +
  DataKnowledgeSuiteCapabilityReferenceRegistry.length +
  DataKnowledgeSuitePublicPlatformRegistry.length +
  DataKnowledgeSuitePublicApiRegistryRefs.length +
  DataKnowledgeSuitePublicApiCountRegistry.length +
  DataKnowledgeSuiteVersionRegistry.length +
  DataKnowledgeSuiteStatusRegistry.length +
  DataKnowledgeSuiteReadinessRegistry.length +
  DataKnowledgeSuiteDependencyRegistry.length +
  DataKnowledgeSuiteOwnershipRegistry.length +
  DataKnowledgeSuiteBoundaryRegistry.length +
  DataKnowledgeSuiteCompatibilityRegistry.length +
  DataKnowledgeSuiteLifecycleStateRegistry.length +
  DataKnowledgeSuiteContractRegistry.length +
  DataKnowledgeSuiteIntegrationContractRegistry.length +
  DataKnowledgeSuiteRegistryGuarantees.length;

const inventory = Object.freeze({
  inventoryId: "DKL-9:2/DataKnowledgeSuiteRegistryInventory",
  capabilityCount: DataKnowledgeSuiteCapabilityRegistry.length,
  capabilityReferenceCount: DataKnowledgeSuiteCapabilityReferenceRegistry.length,
  publicPlatformCount: DataKnowledgeSuitePublicPlatformRegistry.length,
  publicApiRegistryRefCount: DataKnowledgeSuitePublicApiRegistryRefs.length,
  publicApiCountEntryCount: DataKnowledgeSuitePublicApiCountRegistry.length,
  versionCount: DataKnowledgeSuiteVersionRegistry.length,
  statusCount: DataKnowledgeSuiteStatusRegistry.length,
  readinessCount: DataKnowledgeSuiteReadinessRegistry.length,
  dependencyCount: DataKnowledgeSuiteDependencyRegistry.length,
  ownershipEntryCount: DataKnowledgeSuiteOwnershipRegistry.length,
  boundaryEntryCount: DataKnowledgeSuiteBoundaryRegistry.length,
  compatibilityCount: DataKnowledgeSuiteCompatibilityRegistry.length,
  lifecycleStateCount: DataKnowledgeSuiteLifecycleStateRegistry.length,
  contractCount: DataKnowledgeSuiteContractRegistry.length,
  integrationContractCount:
    DataKnowledgeSuiteIntegrationContractRegistry.length,
  guaranteeCount: DataKnowledgeSuiteRegistryGuarantees.length,
  publicApiInventoryTotal: foundation.inventory.publicApiInventoryTotal,
  foundationInventory: foundation.inventory,
  totalEntryCount,
  countingRule: COUNTING_RULE,
  sourcedThroughFoundation: true as const,
  reconstructed: false as const,
  hardcoded: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

const identity = Object.freeze({
  registryId: DataKnowledgeSuiteRegistryId,
  registryName: DataKnowledgeSuiteRegistryName,
  registryVersion: DataKnowledgeSuiteRegistryVersion,
  registryNamespace: DataKnowledgeSuiteRegistryNamespace,
  layer: "Data Knowledge Layer" as const,
  phase: "DKL-9" as const,
  stage: "Registry" as const,
  sourcePhase: "DKL-9:2" as const,
  owner: "DKL-9 Data Knowledge Suite",
  status: DataKnowledgeSuiteRegistryStatus,
  readiness: DataKnowledgeSuiteRegistryReadiness,
  foundationId: DataKnowledgeSuiteFoundationId,
  foundationVersion: DataKnowledgeSuiteFoundationVersion,
  metadataOnly: true as const,
  immutable: true as const,
});

const dependency = Object.freeze({
  dependencyId: "DKL-9:2/Dependency/DKL91Foundation",
  directPreviousPhaseModule: "dataKnowledgeSuiteFoundation.ts" as const,
  foundationOnly: true as const,
  foundationId: DataKnowledgeSuiteFoundationId,
  foundationVersion: DataKnowledgeSuiteFoundationVersion,
  publicIndexDirectImport: false as const,
  dkl1DirectImport: false as const,
  dkl2DirectImport: false as const,
  dkl3DirectImport: false as const,
  dkl4DirectImport: false as const,
  dkl5DirectImport: false as const,
  dkl6DirectImport: false as const,
  dkl7DirectImport: false as const,
  dkl8DirectImport: false as const,
  reconstructsFoundation: false as const,
  reconstructsUpstreamCapabilities: false as const,
  canonicalPath: "DKL-9:2 → DKL-9:1 Foundation → DKL-1..DKL-8 Public Indexes",
  runtimeBehavior: "None" as const,
  metadataOnly: true as const,
});

const lookups = Object.freeze({
  getCapabilityById: (id: string) =>
    findById(DataKnowledgeSuiteCapabilityRegistry, id),
  getCapabilityByCapabilityId: (capabilityId: string) =>
    DataKnowledgeSuiteCapabilityRegistry.find(
      (item) => item.capabilityId === capabilityId,
    ),
  getDependencyByCapabilityId: (capabilityId: string) =>
    DataKnowledgeSuiteDependencyRegistry.find(
      (item) => item.capabilityId === capabilityId,
    ),
  getPublicApiCountByCapabilityId: (capabilityId: string) =>
    DataKnowledgeSuitePublicApiCountRegistry.find(
      (item) => item.capabilityId === capabilityId,
    ),
  getCapabilityCount: () => DataKnowledgeSuiteCapabilityRegistry.length,
  getTotalEntryCount: () => totalEntryCount,
});

const registryApi = (
  exportName: string,
  kind:
    | "Aggregate"
    | "IdentityConstant"
    | "MetadataConstant"
    | "Helper",
) =>
  Object.freeze({
    id: `DKL-9:2/PublicApi/${exportName}`,
    exportName,
    phase: "DKL-9:2" as const,
    section: "Registry" as const,
    kind,
    version: DataKnowledgeSuiteRegistryVersion,
    status: DataKnowledgeSuiteRegistryStatus,
    stability: "Stable" as const,
    public: true as const,
    sourceReference: "dataKnowledgeSuiteRegistry.ts" as const,
  });

/** Additive public-surface registry — exactly eight top-level exports. */
const DataKnowledgeSuiteRegistryApiRegistry = Object.freeze([
  registryApi("DataKnowledgeSuiteRegistryId", "IdentityConstant"),
  registryApi("DataKnowledgeSuiteRegistryVersion", "IdentityConstant"),
  registryApi("DataKnowledgeSuiteRegistryName", "IdentityConstant"),
  registryApi("DataKnowledgeSuiteRegistryNamespace", "IdentityConstant"),
  registryApi("DataKnowledgeSuiteRegistryStatus", "MetadataConstant"),
  registryApi("DataKnowledgeSuiteRegistryReadiness", "MetadataConstant"),
  registryApi("DataKnowledgeSuiteRegistryPlatform", "Aggregate"),
  registryApi("getDataKnowledgeSuiteRegistrySummary", "Helper"),
]);

/**
 * Canonical immutable Data Knowledge Suite Registry platform.
 * Collections derived from Foundation. Canonical references preserved.
 */
export const DataKnowledgeSuiteRegistryPlatform = Object.freeze({
  identity,
  dependency,
  capabilities: DataKnowledgeSuiteCapabilityRegistry,
  capabilityReferences: DataKnowledgeSuiteCapabilityReferenceRegistry,
  capabilityOrder: DataKnowledgeSuiteCapabilityOrder,
  publicPlatforms: DataKnowledgeSuitePublicPlatformRegistry,
  publicApiRegistryRefs: DataKnowledgeSuitePublicApiRegistryRefs,
  publicApiCounts: DataKnowledgeSuitePublicApiCountRegistry,
  versions: DataKnowledgeSuiteVersionRegistry,
  statuses: DataKnowledgeSuiteStatusRegistry,
  readinessEntries: DataKnowledgeSuiteReadinessRegistry,
  dependencies: DataKnowledgeSuiteDependencyRegistry,
  ownership: Object.freeze({
    entries: DataKnowledgeSuiteOwnershipRegistry,
    aggregate: DataKnowledgeSuiteOwnershipAggregate,
    foundationOwnership: foundation.ownership,
  }),
  boundaries: Object.freeze({
    entries: DataKnowledgeSuiteBoundaryRegistry,
    aggregate: DataKnowledgeSuiteBoundariesAggregate,
    foundationBoundaries: foundation.boundaries,
  }),
  compatibility: DataKnowledgeSuiteCompatibilityRegistry,
  lifecycle: Object.freeze({
    states: DataKnowledgeSuiteLifecycleStateRegistry,
    aggregate: DataKnowledgeSuiteLifecycleAggregate,
    foundationLifecycle: foundation.lifecycle,
  }),
  contracts: DataKnowledgeSuiteContractRegistry,
  integrationContracts: DataKnowledgeSuiteIntegrationContractRegistry,
  guarantees: DataKnowledgeSuiteRegistryGuarantees,
  inventory,
  readiness: DataKnowledgeSuiteRegistryReadiness,
  lookups,
  apiRegistry: DataKnowledgeSuiteRegistryApiRegistry,
  sectionOrder: PLATFORM_SECTIONS,
  sectionCount: PLATFORM_SECTIONS.length,
  totalEntryCount,
  status: DataKnowledgeSuiteRegistryStatus,
  nextPhase: "DKL-9:3 — Data Knowledge Suite Model",
  foundation,
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
  duplicatesUpstreamRegistries: false as const,
  immutable: true as const,
  deterministic: true as const,
});

/** Deterministic frozen Data Knowledge Suite Registry summary. */
export function getDataKnowledgeSuiteRegistrySummary(): DataKnowledgeSuiteRegistrySummary {
  return Object.freeze({
    registryId: DataKnowledgeSuiteRegistryId,
    version: DataKnowledgeSuiteRegistryVersion,
    name: DataKnowledgeSuiteRegistryName,
    namespace: DataKnowledgeSuiteRegistryNamespace,
    status: DataKnowledgeSuiteRegistryStatus,
    readiness: DataKnowledgeSuiteRegistryReadiness,
    foundationId: DataKnowledgeSuiteFoundationId,
    capabilityCount: DataKnowledgeSuiteCapabilityRegistry.length,
    capabilityReferenceCount:
      DataKnowledgeSuiteCapabilityReferenceRegistry.length,
    publicPlatformCount: DataKnowledgeSuitePublicPlatformRegistry.length,
    publicApiRegistryRefCount: DataKnowledgeSuitePublicApiRegistryRefs.length,
    publicApiCountEntryCount: DataKnowledgeSuitePublicApiCountRegistry.length,
    versionCount: DataKnowledgeSuiteVersionRegistry.length,
    statusCount: DataKnowledgeSuiteStatusRegistry.length,
    readinessCount: DataKnowledgeSuiteReadinessRegistry.length,
    dependencyCount: DataKnowledgeSuiteDependencyRegistry.length,
    ownershipEntryCount: DataKnowledgeSuiteOwnershipRegistry.length,
    boundaryEntryCount: DataKnowledgeSuiteBoundaryRegistry.length,
    compatibilityCount: DataKnowledgeSuiteCompatibilityRegistry.length,
    lifecycleStateCount: DataKnowledgeSuiteLifecycleStateRegistry.length,
    contractCount: DataKnowledgeSuiteContractRegistry.length,
    integrationContractCount:
      DataKnowledgeSuiteIntegrationContractRegistry.length,
    publicApiInventoryTotal: foundation.inventory.publicApiInventoryTotal,
    totalEntryCount,
    sectionCount: PLATFORM_SECTIONS.length,
    nextPhase: "DKL-9:3 — Data Knowledge Suite Model",
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
}
