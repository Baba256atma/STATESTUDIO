/**
 * DKL-9:1 — Data Knowledge Suite Foundation.
 *
 * Immutable architectural foundation for the Data Knowledge Suite.
 * Consumes only DKL-1 through DKL-8 Public Indexes.
 * Metadata-only. Runtime-free. Ready for Registry.
 *
 * Ownership: owned exclusively by DKL-9:1.
 *
 * Public exports (exactly 8):
 *   DataKnowledgeSuiteFoundationId
 *   DataKnowledgeSuiteFoundationVersion
 *   DataKnowledgeSuiteFoundationName
 *   DataKnowledgeSuiteFoundationNamespace
 *   DataKnowledgeSuiteFoundationStatus
 *   DataKnowledgeSuiteFoundationReadiness
 *   DataKnowledgeSuiteFoundationPlatform
 *   getDataKnowledgeSuiteFoundationSummary()
 */

import { DataKnowledgeSuiteBoundaries } from "./dataKnowledgeSuiteBoundaries.ts";
import {
  DataKnowledgeSuiteCapabilityCatalog,
  DataKnowledgeSuiteCapabilityPublicApiInventory,
} from "./dataKnowledgeSuiteCapabilityCatalog.ts";
import {
  DataKnowledgeSuiteContracts,
  DataKnowledgeSuiteIntegrationContracts,
} from "./dataKnowledgeSuiteContracts.ts";
import type {
  DataKnowledgeSuiteFoundationSummary,
  DataKnowledgeSuiteIdentity,
} from "./dataKnowledgeSuiteFoundationTypes.ts";
import { DataKnowledgeSuiteLifecycle } from "./dataKnowledgeSuiteLifecycle.ts";
import { DataKnowledgeSuiteOwnership } from "./dataKnowledgeSuiteOwnership.ts";

export const DataKnowledgeSuiteFoundationId =
  "DKL-9:1/DataKnowledgeSuiteFoundation" as const;

export const DataKnowledgeSuiteFoundationName =
  "Data Knowledge Suite Foundation" as const;

export const DataKnowledgeSuiteFoundationVersion = "1.0.0" as const;

export const DataKnowledgeSuiteFoundationNamespace =
  "nexora.dkl.data-knowledge-suite.foundation" as const;

export const DataKnowledgeSuiteFoundationStatus =
  "FoundationDefined" as const;

export const DataKnowledgeSuiteFoundationReadiness =
  "ReadyForRegistry" as const;

const identity: DataKnowledgeSuiteIdentity = Object.freeze({
  foundationId: DataKnowledgeSuiteFoundationId,
  foundationName: DataKnowledgeSuiteFoundationName,
  foundationVersion: DataKnowledgeSuiteFoundationVersion,
  foundationNamespace: DataKnowledgeSuiteFoundationNamespace,
  layer: "Data Knowledge Layer" as const,
  phase: "DKL-9" as const,
  stage: "Foundation" as const,
  sourcePhase: "DKL-9:1" as const,
  owner: "DKL-9 Data Knowledge Suite",
  status: DataKnowledgeSuiteFoundationStatus,
  readiness: DataKnowledgeSuiteFoundationReadiness,
  suiteName: "Data Knowledge Suite" as const,
  capabilityCount: 8 as const,
  metadataOnly: true as const,
  immutable: true as const,
});

const dependency = Object.freeze({
  dependencyId: "DKL-9:1/Dependency/PublicIndexes",
  publicIndexOnly: true as const,
  directPreviousPhaseModules: Object.freeze([
    "dataKnowledgeFoundationPublicIndex.ts",
    "dataSourceKnowledgeRegistryPublicIndex.ts",
    "dataUnderstandingPublicIndex.ts",
    "knowledgeModelingPublicIndex.ts",
    "knowledgeValidationPublicIndex.ts",
    "knowledgeRepositoryPublicIndex.ts",
    "knowledgeServicesPublicIndex.ts",
    "knowledgeGovernancePublicIndex.ts",
  ] as const),
  dkl1PublicIndex: true as const,
  dkl2PublicIndex: true as const,
  dkl3PublicIndex: true as const,
  dkl4PublicIndex: true as const,
  dkl5PublicIndex: true as const,
  dkl6PublicIndex: true as const,
  dkl7PublicIndex: true as const,
  dkl8PublicIndex: true as const,
  foundationDirectImport: false as const,
  registryDirectImport: false as const,
  modelDirectImport: false as const,
  validationDirectImport: false as const,
  manifestDirectImport: false as const,
  platformDirectImport: false as const,
  certificationDirectImport: false as const,
  freezeDirectImport: false as const,
  reconstructsUpstream: false as const,
  introducesNewKnowledgeCapability: false as const,
  canonicalPath:
    "DKL-9:1 → DKL-1..DKL-8 Public Indexes (exclusive Public Index composition)",
  runtimeBehavior: "None" as const,
  metadataOnly: true as const,
});

const PLATFORM_SECTIONS = Object.freeze([
  "identity",
  "dependency",
  "contracts",
  "integrationContracts",
  "ownership",
  "capabilityCatalog",
  "lifecycle",
  "boundaries",
  "inventory",
  "readiness",
] as const);

const foundationApi = (
  exportName: string,
  kind:
    | "Aggregate"
    | "IdentityConstant"
    | "MetadataConstant"
    | "Helper",
) =>
  Object.freeze({
    id: `DKL-9:1/PublicApi/${exportName}`,
    exportName,
    phase: "DKL-9:1" as const,
    section: "Foundation" as const,
    kind,
    version: DataKnowledgeSuiteFoundationVersion,
    status: DataKnowledgeSuiteFoundationStatus,
    stability: "Stable" as const,
    public: true as const,
    sourceReference: "dataKnowledgeSuiteFoundation.ts" as const,
  });

/** Additive public-surface registry — exactly eight top-level exports. */
const DataKnowledgeSuiteFoundationApiRegistry = Object.freeze([
  foundationApi("DataKnowledgeSuiteFoundationId", "IdentityConstant"),
  foundationApi("DataKnowledgeSuiteFoundationVersion", "IdentityConstant"),
  foundationApi("DataKnowledgeSuiteFoundationName", "IdentityConstant"),
  foundationApi("DataKnowledgeSuiteFoundationNamespace", "IdentityConstant"),
  foundationApi("DataKnowledgeSuiteFoundationStatus", "MetadataConstant"),
  foundationApi("DataKnowledgeSuiteFoundationReadiness", "MetadataConstant"),
  foundationApi("DataKnowledgeSuiteFoundationPlatform", "Aggregate"),
  foundationApi("getDataKnowledgeSuiteFoundationSummary", "Helper"),
]);

/**
 * Canonical immutable Data Knowledge Suite Foundation platform.
 * Ten ordered sections. Metadata only.
 */
export const DataKnowledgeSuiteFoundationPlatform = Object.freeze({
  identity,
  dependency,
  contracts: DataKnowledgeSuiteContracts,
  integrationContracts: DataKnowledgeSuiteIntegrationContracts,
  ownership: DataKnowledgeSuiteOwnership,
  capabilityCatalog: DataKnowledgeSuiteCapabilityCatalog,
  lifecycle: DataKnowledgeSuiteLifecycle,
  boundaries: DataKnowledgeSuiteBoundaries,
  inventory: DataKnowledgeSuiteCapabilityPublicApiInventory,
  readiness: DataKnowledgeSuiteFoundationReadiness,
  apiRegistry: DataKnowledgeSuiteFoundationApiRegistry,
  sectionOrder: PLATFORM_SECTIONS,
  sectionCount: PLATFORM_SECTIONS.length,
  status: DataKnowledgeSuiteFoundationStatus,
  nextPhase: "DKL-9:2 — Data Knowledge Suite Registry",
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
  retrievesKnowledge: false as const,
  storesKnowledge: false as const,
  executesGovernance: false as const,
  executesValidation: false as const,
  constructsBusinessObjects: false as const,
  immutable: true as const,
  deterministic: true as const,
});

/** Deterministic frozen Data Knowledge Suite Foundation summary. */
export function getDataKnowledgeSuiteFoundationSummary(): DataKnowledgeSuiteFoundationSummary {
  return Object.freeze({
    foundationId: DataKnowledgeSuiteFoundationId,
    version: DataKnowledgeSuiteFoundationVersion,
    name: DataKnowledgeSuiteFoundationName,
    namespace: DataKnowledgeSuiteFoundationNamespace,
    status: DataKnowledgeSuiteFoundationStatus,
    readiness: DataKnowledgeSuiteFoundationReadiness,
    capabilityCount: DataKnowledgeSuiteCapabilityCatalog.length,
    contractCount: DataKnowledgeSuiteContracts.length,
    integrationContractCount: DataKnowledgeSuiteIntegrationContracts.length,
    ownershipCount: DataKnowledgeSuiteOwnership.ownsCount,
    nonOwnershipCount: DataKnowledgeSuiteOwnership.doesNotOwnCount,
    lifecycleStateCount: DataKnowledgeSuiteLifecycle.stateCount,
    prohibitedSurfaceCount:
      DataKnowledgeSuiteBoundaries.prohibitedSurfaceCount,
    publicApiInventoryTotal:
      DataKnowledgeSuiteCapabilityPublicApiInventory.publicApiInventoryTotal,
    sectionCount: PLATFORM_SECTIONS.length,
    nextPhase: "DKL-9:2 — Data Knowledge Suite Registry",
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
}
