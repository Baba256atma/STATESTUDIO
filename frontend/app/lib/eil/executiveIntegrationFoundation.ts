/**
 * EIL-1:1 — Executive Integration Foundation.
 *
 * Immutable architectural foundation for the Executive Integration Layer.
 * Consumes only released Public Indexes from certified Nexora platforms.
 * Metadata-only. Runtime-free. Ready for Registry.
 *
 * Ownership: owned exclusively by EIL-1:1.
 *
 * Public exports (exactly 8):
 *   ExecutiveIntegrationFoundationId
 *   ExecutiveIntegrationFoundationVersion
 *   ExecutiveIntegrationFoundationName
 *   ExecutiveIntegrationFoundationNamespace
 *   ExecutiveIntegrationFoundationStatus
 *   ExecutiveIntegrationFoundationReadiness
 *   ExecutiveIntegrationFoundationPlatform
 *   getExecutiveIntegrationFoundationSummary()
 */

import {
  ExecutiveBusinessIntelligencePublicIndexId,
  ExecutiveBusinessIntelligencePublicIndexName,
  ExecutiveBusinessIntelligencePublicIndexNamespace,
  ExecutiveBusinessIntelligencePublicIndexVersion,
} from "../bus/executiveBusinessIntelligencePublicIndex.ts";
import {
  DataKnowledgeSuitePublicIndexId,
  DataKnowledgeSuitePublicIndexName,
  DataKnowledgeSuitePublicIndexNamespace,
  DataKnowledgeSuitePublicIndexVersion,
} from "../dkl/dataKnowledgeSuitePublicIndex.ts";
import {
  ExecutiveOrchestrationPublicIndexId,
  ExecutiveOrchestrationPublicIndexName,
  ExecutiveOrchestrationPublicIndexNamespace,
  ExecutiveOrchestrationPublicIndexVersion,
} from "../engine/executiveOrchestrationPublicIndex.ts";
import {
  ExecutiveOperationsSuitePublicIndexId,
  ExecutiveOperationsSuitePublicIndexName,
  ExecutiveOperationsSuitePublicIndexNamespace,
  ExecutiveOperationsSuitePublicIndexVersion,
} from "../ops/executiveOperationsSuitePublicIndex.ts";
import { ExecutiveIntegrationBoundaries } from "./executiveIntegrationBoundaries.ts";
import {
  ExecutiveIntegrationContractNames,
  ExecutiveIntegrationContracts,
} from "./executiveIntegrationContracts.ts";
import type {
  ExecutiveIntegrationPlatform,
  IntegrationIdentity,
  IntegrationMetadata,
  IntegrationNode,
  IntegrationRoute,
  ExecutiveIntegrationFoundationSummary,
} from "./executiveIntegrationFoundationTypes.ts";
import { ExecutiveIntegrationLifecycle } from "./executiveIntegrationLifecycle.ts";
import { ExecutiveIntegrationOwnership } from "./executiveIntegrationOwnership.ts";
import {
  ExecutiveIntegrationCapabilityCatalog,
  ExecutiveIntegrationResponsibilityCatalog,
  ExecutiveIntegrationResponsibilities,
} from "./executiveIntegrationResponsibilities.ts";

export const ExecutiveIntegrationFoundationId =
  "EIL-1:1/ExecutiveIntegrationFoundation" as const;

export const ExecutiveIntegrationFoundationName =
  "Executive Integration Foundation" as const;

export const ExecutiveIntegrationFoundationVersion = "1.0.0" as const;

export const ExecutiveIntegrationFoundationNamespace =
  "nexora.eil.foundation" as const;

export const ExecutiveIntegrationFoundationStatus = "Foundation" as const;

export const ExecutiveIntegrationFoundationReadiness =
  "ReadyForRegistry" as const;

const identity: IntegrationIdentity = Object.freeze({
  foundationId: ExecutiveIntegrationFoundationId,
  foundationName: ExecutiveIntegrationFoundationName,
  foundationVersion: ExecutiveIntegrationFoundationVersion,
  foundationNamespace: ExecutiveIntegrationFoundationNamespace,
  layer: "Executive Integration Layer" as const,
  phase: "EIL-1" as const,
  stage: "Foundation" as const,
  sourcePhase: "EIL-1:1" as const,
  owner: "EIL-1 Executive Integration",
  status: ExecutiveIntegrationFoundationStatus,
  readiness: ExecutiveIntegrationFoundationReadiness,
  metadataOnly: true as const,
  immutable: true as const,
});

const platform = (
  platformId: ExecutiveIntegrationPlatform["platformId"],
  platformName: string,
  publicIndexId: string,
  publicIndexVersion: string,
  publicIndexName: string,
  publicIndexNamespace: string,
  publicIndexModule: string,
  order: number,
): ExecutiveIntegrationPlatform =>
  Object.freeze({
    platformId,
    platformName,
    publicIndexId,
    publicIndexVersion,
    publicIndexName,
    publicIndexNamespace,
    publicIndexModule,
    certificationRequired: true as const,
    integrationMode: "PublicIndexOnly" as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

/** Certified platforms composed exclusively through Public Indexes. */
const ExecutiveIntegrationPlatforms: readonly ExecutiveIntegrationPlatform[] =
  Object.freeze([
    platform(
      "BUS",
      "Executive Business Intelligence",
      ExecutiveBusinessIntelligencePublicIndexId,
      ExecutiveBusinessIntelligencePublicIndexVersion,
      ExecutiveBusinessIntelligencePublicIndexName,
      ExecutiveBusinessIntelligencePublicIndexNamespace,
      "executiveBusinessIntelligencePublicIndex.ts",
      1,
    ),
    platform(
      "OPS",
      "Executive Operations Suite",
      ExecutiveOperationsSuitePublicIndexId,
      ExecutiveOperationsSuitePublicIndexVersion,
      ExecutiveOperationsSuitePublicIndexName,
      ExecutiveOperationsSuitePublicIndexNamespace,
      "executiveOperationsSuitePublicIndex.ts",
      2,
    ),
    platform(
      "ENG",
      "Executive Orchestration",
      ExecutiveOrchestrationPublicIndexId,
      ExecutiveOrchestrationPublicIndexVersion,
      ExecutiveOrchestrationPublicIndexName,
      ExecutiveOrchestrationPublicIndexNamespace,
      "executiveOrchestrationPublicIndex.ts",
      3,
    ),
    platform(
      "DKL",
      "Data Knowledge Suite",
      DataKnowledgeSuitePublicIndexId,
      DataKnowledgeSuitePublicIndexVersion,
      DataKnowledgeSuitePublicIndexName,
      DataKnowledgeSuitePublicIndexNamespace,
      "dataKnowledgeSuitePublicIndex.ts",
      4,
    ),
  ]);

const node = (
  platformId: IntegrationNode["platformId"],
  publicIndexId: string,
  role: IntegrationNode["role"],
  order: number,
): IntegrationNode =>
  Object.freeze({
    nodeId: `EIL-1:1/Node/${platformId}`,
    platformId,
    publicIndexId,
    role,
    discoversServices: false as const,
    executesRuntime: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

const ExecutiveIntegrationNodes: readonly IntegrationNode[] = Object.freeze([
  node("BUS", ExecutiveBusinessIntelligencePublicIndexId, "Producer", 1),
  node("OPS", ExecutiveOperationsSuitePublicIndexId, "Producer", 2),
  node("ENG", ExecutiveOrchestrationPublicIndexId, "Consumer", 3),
  node("DKL", DataKnowledgeSuitePublicIndexId, "Producer", 4),
]);

const route = (
  key: string,
  sourceNodeId: string,
  targetNodeId: string,
  coordinationKind: IntegrationRoute["coordinationKind"],
  order: number,
): IntegrationRoute =>
  Object.freeze({
    routeId: `EIL-1:1/Route/${key}`,
    sourceNodeId,
    targetNodeId,
    coordinationKind,
    transportImplemented: false as const,
    runtimeBehavior: "None" as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

const ExecutiveIntegrationRoutes: readonly IntegrationRoute[] = Object.freeze([
  route(
    "BUS-ENG",
    "EIL-1:1/Node/BUS",
    "EIL-1:1/Node/ENG",
    "CrossPlatformRouting",
    1,
  ),
  route(
    "OPS-ENG",
    "EIL-1:1/Node/OPS",
    "EIL-1:1/Node/ENG",
    "WorkflowCoordination",
    2,
  ),
  route(
    "DKL-ENG",
    "EIL-1:1/Node/DKL",
    "EIL-1:1/Node/ENG",
    "DependencyOrchestration",
    3,
  ),
  route(
    "BUS-OPS",
    "EIL-1:1/Node/BUS",
    "EIL-1:1/Node/OPS",
    "PlatformCoordination",
    4,
  ),
  route(
    "DKL-BUS",
    "EIL-1:1/Node/DKL",
    "EIL-1:1/Node/BUS",
    "EventCoordination",
    5,
  ),
]);
const dependency = Object.freeze({
  dependencyId: "EIL-1:1/Dependency/PublicIndexes",
  publicIndexOnly: true as const,
  certifiedPlatformsOnly: true as const,
  directPublicIndexModules: Object.freeze([
    "executiveBusinessIntelligencePublicIndex.ts",
    "executiveOperationsSuitePublicIndex.ts",
    "executiveOrchestrationPublicIndex.ts",
    "dataKnowledgeSuitePublicIndex.ts",
  ] as const),
  busPublicIndex: true as const,
  opsPublicIndex: true as const,
  engPublicIndex: true as const,
  dklPublicIndex: true as const,
  internalPhaseImport: false as const,
  foundationDirectImport: false as const,
  registryDirectImport: false as const,
  modelDirectImport: false as const,
  validationDirectImport: false as const,
  manifestDirectImport: false as const,
  platformDirectImport: false as const,
  certificationDirectImport: false as const,
  freezeDirectImport: false as const,
  reconstructsUpstream: false as const,
  reconstructsPreviousLayers: false as const,
  dependencyRules: ExecutiveIntegrationBoundaries.dependencyRules,
  extensionPolicy: ExecutiveIntegrationBoundaries.extensionPolicy,
  canonicalPath:
    "EIL-1:1 → BUS/OPS/ENG/DKL Public Indexes (exclusive Public Index composition)",
  runtimeBehavior: "None" as const,
  metadataOnly: true as const,
});

const integrationMetadata: IntegrationMetadata = Object.freeze({
  metadataId: "EIL-1:1/IntegrationMetadata",
  foundationId: ExecutiveIntegrationFoundationId,
  namespace: ExecutiveIntegrationFoundationNamespace,
  version: ExecutiveIntegrationFoundationVersion,
  status: ExecutiveIntegrationFoundationStatus,
  readiness: ExecutiveIntegrationFoundationReadiness,
  platformCount: ExecutiveIntegrationPlatforms.length,
  contractCount: ExecutiveIntegrationContracts.length,
  responsibilityCount: ExecutiveIntegrationResponsibilities.length,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

const PLATFORM_SECTIONS = Object.freeze([
  "identity",
  "dependency",
  "contracts",
  "platforms",
  "nodes",
  "routes",
  "ownership",
  "responsibilities",
  "lifecycle",
  "boundaries",
  "metadata",
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
    id: `EIL-1:1/PublicApi/${exportName}`,
    exportName,
    phase: "EIL-1:1" as const,
    section: "Foundation" as const,
    kind,
    version: ExecutiveIntegrationFoundationVersion,
    status: ExecutiveIntegrationFoundationStatus,
    stability: "Stable" as const,
    public: true as const,
    sourceReference: "executiveIntegrationFoundation.ts" as const,
  });

/** Additive public-surface registry — exactly eight top-level exports. */
const ExecutiveIntegrationFoundationApiRegistry = Object.freeze([
  foundationApi("ExecutiveIntegrationFoundationId", "IdentityConstant"),
  foundationApi("ExecutiveIntegrationFoundationVersion", "IdentityConstant"),
  foundationApi("ExecutiveIntegrationFoundationName", "IdentityConstant"),
  foundationApi("ExecutiveIntegrationFoundationNamespace", "IdentityConstant"),
  foundationApi("ExecutiveIntegrationFoundationStatus", "MetadataConstant"),
  foundationApi("ExecutiveIntegrationFoundationReadiness", "MetadataConstant"),
  foundationApi("ExecutiveIntegrationFoundationPlatform", "Aggregate"),
  foundationApi("getExecutiveIntegrationFoundationSummary", "Helper"),
]);

/**
 * Canonical immutable Executive Integration Foundation platform.
 * Twelve ordered sections. Metadata only.
 */
export const ExecutiveIntegrationFoundationPlatform = Object.freeze({
  identity,
  dependency,
  contracts: ExecutiveIntegrationContracts,
  platforms: ExecutiveIntegrationPlatforms,
  nodes: ExecutiveIntegrationNodes,
  routes: ExecutiveIntegrationRoutes,
  ownership: ExecutiveIntegrationOwnership,
  responsibilities: ExecutiveIntegrationResponsibilityCatalog,
  lifecycle: ExecutiveIntegrationLifecycle,
  boundaries: ExecutiveIntegrationBoundaries,
  metadata: integrationMetadata,
  readiness: ExecutiveIntegrationFoundationReadiness,
  contractNames: ExecutiveIntegrationContractNames,
  responsibilityDeclarations: ExecutiveIntegrationResponsibilities,
  capabilities: ExecutiveIntegrationCapabilityCatalog,
  apiRegistry: ExecutiveIntegrationFoundationApiRegistry,
  sectionOrder: PLATFORM_SECTIONS,
  sectionCount: PLATFORM_SECTIONS.length,
  status: ExecutiveIntegrationFoundationStatus,
  nextPhase: "EIL-1:2 — Executive Integration Registry",
  metadataOnly: true as const,
  runtimeBehavior: false as const,
  runtimeEnforcement: false as const,
  aiBehavior: false as const,
  reasoningBehavior: false as const,
  executiveDecisionBehavior: false as const,
  planningBehavior: false as const,
  knowledgeModelingBehavior: false as const,
  businessObjectConstruction: false as const,
  databaseAccess: false as const,
  persistenceBehavior: false as const,
  cachingBehavior: false as const,
  authenticationBehavior: false as const,
  authorizationBehavior: false as const,
  transportBehavior: false as const,
  uiBehavior: false as const,
  advisorBehavior: false as const,
  sceneBehavior: false as const,
  directorBehavior: false as const,
  eveBehavior: false as const,
  executionLogic: false as const,
  runtimeOrchestration: false as const,
  importsInternalPhases: false as const,
  immutable: true as const,
  deterministic: true as const,
});

/** Deterministic frozen Executive Integration Foundation summary. */
export function getExecutiveIntegrationFoundationSummary(): ExecutiveIntegrationFoundationSummary {
  return Object.freeze({
    foundationId: ExecutiveIntegrationFoundationId,
    version: ExecutiveIntegrationFoundationVersion,
    name: ExecutiveIntegrationFoundationName,
    namespace: ExecutiveIntegrationFoundationNamespace,
    status: ExecutiveIntegrationFoundationStatus,
    readiness: ExecutiveIntegrationFoundationReadiness,
    platformCount: ExecutiveIntegrationPlatforms.length,
    contractCount: ExecutiveIntegrationContracts.length,
    ownershipCount: ExecutiveIntegrationOwnership.ownsCount,
    nonOwnershipCount: ExecutiveIntegrationOwnership.doesNotOwnCount,
    responsibilityCount: ExecutiveIntegrationResponsibilities.length,
    lifecycleStateCount: ExecutiveIntegrationLifecycle.stateCount,
    prohibitedSurfaceCount:
      ExecutiveIntegrationBoundaries.prohibitedSurfaceCount,
    sectionCount: PLATFORM_SECTIONS.length,
    nextPhase: "EIL-1:2 — Executive Integration Registry",
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
}
