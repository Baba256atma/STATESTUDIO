/**
 * EIL-1:3 — Integration Model.
 *
 * Canonical immutable architectural model for the Executive Integration Layer.
 * Consumes only the EIL-1:2 Integration Registry aggregate public surface.
 * Metadata-only. Runtime-free. Ready for Validation.
 *
 * Ownership: owned exclusively by EIL-1:3.
 *
 * Public exports (exactly 8):
 *   IntegrationModelIdentity
 *   IntegrationDomainModels
 *   IntegrationRelationshipModels
 *   IntegrationTopologyModels
 *   IntegrationLifecycleModels
 *   IntegrationModelCollections
 *   IntegrationModelSummary
 *   IntegrationModelPlatform
 */

import { IntegrationDomainModels } from "./integrationDomainModels.ts";
import { IntegrationLifecycleModels } from "./integrationLifecycleModels.ts";
import {
  IntegrationModelDependencies,
  IntegrationModelIdentity,
  IntegrationModelReadiness,
  IntegrationModelStatus,
} from "./integrationModelIdentity.ts";
import { IntegrationRelationshipModels } from "./integrationRelationshipModels.ts";
import { IntegrationTopologyModels } from "./integrationTopologyModels.ts";
import type {
  IntegrationBoundaryModel,
  IntegrationDependencyModel,
  IntegrationModelInventory,
  IntegrationModelSummaryDescriptor,
} from "./integrationModelTypes.ts";
import {
  IntegrationRegistryIdentity,
  IntegrationRegistryPlatform,
  IntegrationRegistrySummary,
} from "./integrationRegistry.ts";

export { IntegrationModelIdentity } from "./integrationModelIdentity.ts";
export { IntegrationDomainModels } from "./integrationDomainModels.ts";
export { IntegrationRelationshipModels } from "./integrationRelationshipModels.ts";
export { IntegrationTopologyModels } from "./integrationTopologyModels.ts";
export { IntegrationLifecycleModels } from "./integrationLifecycleModels.ts";

const dependencyModel: IntegrationDependencyModel = Object.freeze({
  dependencyModelId: "EIL-1:3/Dependency/RegistryOnly",
  registryOnly: true as const,
  registryId: "EIL-1:2/IntegrationRegistry",
  entryPoint: "integrationRegistry.ts",
  laterEilPhaseImport: false as const,
  foundationDirectImport: false as const,
  registryInternalImport: false as const,
  metadataOnly: true as const,
  immutable: true as const,
});

const boundaryModel: IntegrationBoundaryModel = Object.freeze({
  boundaryModelId: "EIL-1:3/Boundary/Model",
  owns: Object.freeze([
    "integration models",
    "architectural relationships",
    "topology metadata",
    "lifecycle mappings",
    "dependency metadata",
    "compatibility mappings",
  ]),
  doesNotOwn: Object.freeze([
    "validation",
    "manifests",
    "platform composition",
    "certification",
    "freeze",
    "runtime routing",
    "orchestration",
    "event dispatch",
    "networking",
    "connectors",
    "APIs",
    "services",
  ]),
  metadataOnly: true as const,
  immutable: true as const,
});

/**
 * Canonical collections aggregate.
 * Counts are derived exclusively from model arrays.
 */
export const IntegrationModelCollections = Object.freeze({
  collectionsId: "EIL-1:3/Collections",
  sourcePhase: "EIL-1:3" as const,
  domains: IntegrationDomainModels,
  relationships: IntegrationRelationshipModels,
  topology: IntegrationTopologyModels,
  lifecycle: IntegrationLifecycleModels,
  domainModelCount: IntegrationDomainModels.length,
  relationshipCount: IntegrationRelationshipModels.length,
  topologyCount: IntegrationTopologyModels.length,
  lifecycleCount: IntegrationLifecycleModels.length,
  totalModelEntryCount:
    IntegrationDomainModels.length +
    IntegrationRelationshipModels.length +
    IntegrationTopologyModels.length +
    IntegrationLifecycleModels.length,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

const inventory: IntegrationModelInventory = Object.freeze({
  inventoryId: "EIL-1:3/Inventory",
  domainModelCount: IntegrationModelCollections.domainModelCount,
  relationshipCount: IntegrationModelCollections.relationshipCount,
  topologyCount: IntegrationModelCollections.topologyCount,
  lifecycleCount: IntegrationModelCollections.lifecycleCount,
  totalModelEntryCount: IntegrationModelCollections.totalModelEntryCount,
  countsDerivedFromCollections: true as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

/**
 * Deterministic frozen Integration Model summary.
 * Inventory counts are derived from canonical collections only.
 */
export const IntegrationModelSummary: IntegrationModelSummaryDescriptor =
  Object.freeze({
    modelId: "EIL-1:3/IntegrationModel",
    version: "1.0.0",
    name: "Integration Model",
    namespace: "nexora.eil.integration.model",
    status: IntegrationModelStatus,
    readiness: IntegrationModelReadiness,
    registryId: "EIL-1:2/IntegrationRegistry",
    domainModelCount: IntegrationModelCollections.domainModelCount,
    relationshipCount: IntegrationModelCollections.relationshipCount,
    topologyCount: IntegrationModelCollections.topologyCount,
    lifecycleCount: IntegrationModelCollections.lifecycleCount,
    totalModelEntryCount: IntegrationModelCollections.totalModelEntryCount,
    nextPhase: "EIL-1:4 — Integration Validation",
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });

const dependency = Object.freeze({
  dependencyId: "EIL-1:3/Dependency/EIL12Registry",
  phaseDependencies: IntegrationModelDependencies,
  phaseDependencyCount: IntegrationModelDependencies.length,
  directPreviousPhaseModule: "integrationRegistry.ts" as const,
  registryOnly: true as const,
  registryId: IntegrationRegistryIdentity.canonicalId,
  registryVersion: IntegrationRegistryIdentity.version,
  registryNamespace: IntegrationRegistryIdentity.namespace,
  registryPublicSurfaceOnly: true as const,
  foundationDirectImport: false as const,
  registryInternalImport: false as const,
  laterEilPhaseImport: false as const,
  reconstructsRegistry: false as const,
  duplicatesRegistryValues: false as const,
  canonicalPath:
    "EIL-1:3 → EIL-1:2 IntegrationRegistryPlatform (exclusive)",
  runtimeBehavior: "None" as const,
  metadataOnly: true as const,
});

const PLATFORM_SECTIONS = Object.freeze([
  "identity",
  "dependency",
  "registryIdentity",
  "domains",
  "relationships",
  "topology",
  "lifecycle",
  "collections",
  "inventory",
  "boundaries",
  "dependencyModel",
  "readiness",
] as const);

/**
 * Canonical immutable Integration Model platform.
 * Twelve ordered sections. Metadata only.
 */
export const IntegrationModelPlatform = Object.freeze({
  identity: IntegrationModelIdentity,
  dependency,
  registryIdentity: IntegrationRegistryIdentity,
  domains: IntegrationDomainModels,
  relationships: IntegrationRelationshipModels,
  topology: IntegrationTopologyModels,
  lifecycle: IntegrationLifecycleModels,
  collections: IntegrationModelCollections,
  inventory,
  boundaries: boundaryModel,
  dependencyModel,
  readiness: IntegrationModelReadiness,
  summary: IntegrationModelSummary,
  counts: Object.freeze({
    domainModelCount: IntegrationModelCollections.domainModelCount,
    relationshipCount: IntegrationModelCollections.relationshipCount,
    topologyCount: IntegrationModelCollections.topologyCount,
    lifecycleCount: IntegrationModelCollections.lifecycleCount,
    totalModelEntryCount: IntegrationModelCollections.totalModelEntryCount,
  }),
  sources: Object.freeze({
    registryId: IntegrationRegistryIdentity.canonicalId,
    registryEntryPoint: "integrationRegistry.ts" as const,
    registryNamespace: IntegrationRegistryIdentity.namespace,
    registrySummary: IntegrationRegistrySummary,
  }),
  sectionOrder: PLATFORM_SECTIONS,
  sectionCount: PLATFORM_SECTIONS.length,
  status: IntegrationModelStatus,
  nextPhase: "EIL-1:4 — Integration Validation",
  registryPlatform: IntegrationRegistryPlatform,
  metadataOnly: true as const,
  runtimeBehavior: false as const,
  runtimeEnforcement: false as const,
  routingEngine: false as const,
  orchestrationEngine: false as const,
  workflowExecution: false as const,
  serviceDiscoveryRuntime: false as const,
  eventBus: false as const,
  messagingBehavior: false as const,
  networkingBehavior: false as const,
  restBehavior: false as const,
  graphqlBehavior: false as const,
  websocketBehavior: false as const,
  mcpRuntime: false as const,
  sdkRuntime: false as const,
  queueBehavior: false as const,
  adapterBehavior: false as const,
  connectorBehavior: false as const,
  dependencyInjection: false as const,
  persistenceBehavior: false as const,
  storageBehavior: false as const,
  cacheBehavior: false as const,
  filesystemBehavior: false as const,
  loggingRuntime: false as const,
  telemetryRuntime: false as const,
  aiBehavior: false as const,
  llmBehavior: false as const,
  uiBehavior: false as const,
  visualizationBehavior: false as const,
  graphRendering: false as const,
  stateMutation: false as const,
  validationEngine: false as const,
  importsLaterEilPhases: false as const,
  immutable: true as const,
  deterministic: true as const,
});
