/**
 * EIL-2:3 — Integration Connector Model.
 *
 * Canonical immutable architectural model for the Integration Connector Platform.
 * Consumes only the EIL-2:2 Integration Connector Registry aggregate public surface.
 * Metadata-only. Runtime-free. Ready for Validation.
 *
 * Ownership: owned exclusively by EIL-2:3.
 *
 * Public exports (exactly 8):
 *   IntegrationConnectorModelIdentity
 *   IntegrationConnectorDomainModels
 *   IntegrationConnectorRelationshipModels
 *   IntegrationConnectorEndpointModels
 *   IntegrationConnectorProtocolModels
 *   IntegrationConnectorModelCollections
 *   IntegrationConnectorModelSummary
 *   IntegrationConnectorModelPlatform
 */

import { IntegrationConnectorDomainModels } from "./integrationConnectorDomainModels.ts";
import { IntegrationConnectorEndpointModels } from "./integrationConnectorEndpointModels.ts";
import {
  IntegrationConnectorModelDependencies,
  IntegrationConnectorModelIdentity,
  IntegrationConnectorModelReadiness,
  IntegrationConnectorModelStatus,
} from "./integrationConnectorModelIdentity.ts";
import { IntegrationConnectorProtocolModels } from "./integrationConnectorProtocolModels.ts";
import {
  IntegrationConnectorRelationshipModels,
  IntegrationConnectorRelationshipTypes,
} from "./integrationConnectorRelationshipModels.ts";
import type {
  IntegrationConnectorModelCollectionsDescriptor,
  IntegrationConnectorModelInventory,
  IntegrationConnectorModelSummaryDescriptor,
  IntegrationConnectorTopologyModel,
} from "./integrationConnectorModelTypes.ts";
import {
  IntegrationConnectorRegistryIdentity,
  IntegrationConnectorRegistryPlatform,
  IntegrationConnectorRegistrySummary,
} from "./integrationConnectorRegistry.ts";

export { IntegrationConnectorModelIdentity } from "./integrationConnectorModelIdentity.ts";
export { IntegrationConnectorDomainModels } from "./integrationConnectorDomainModels.ts";
export { IntegrationConnectorRelationshipModels } from "./integrationConnectorRelationshipModels.ts";
export { IntegrationConnectorEndpointModels } from "./integrationConnectorEndpointModels.ts";
export { IntegrationConnectorProtocolModels } from "./integrationConnectorProtocolModels.ts";

const topologyModel: IntegrationConnectorTopologyModel = Object.freeze({
  topologyModelId: "EIL-2:3/Topology/ConnectorTopology",
  canonicalKey: "ConnectorTopology",
  canonicalName: "Connector Topology",
  description:
    "Declarative topology metadata composing connector domain relationships without graph engines.",
  nodeKeys: Object.freeze(
    IntegrationConnectorDomainModels.map((item) => item.canonicalKey),
  ),
  relationshipTypeCount: IntegrationConnectorRelationshipTypes.length,
  sourceRegistryReference: Object.freeze({
    registryId: IntegrationConnectorRegistryIdentity.canonicalId,
    registryNamespace: IntegrationConnectorRegistryIdentity.namespace,
    entryPoint: "integrationConnectorRegistry.ts" as const,
    collection: "collections" as const,
    entryKey: "collections",
    preservesCanonicalReference: true as const,
    duplicatesRegistryValue: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  }),
  ownership: "EIL-2:3" as const,
  lifecycle: "Verified" as const,
  version: "1.0.0" as const,
  graphEngine: false as const,
  routingEngine: false as const,
  visualization: false as const,
  metadataOnly: true as const,
  immutable: true as const,
});

/**
 * Canonical collections aggregate.
 * Counts are derived exclusively from model arrays.
 */
export const IntegrationConnectorModelCollections: IntegrationConnectorModelCollectionsDescriptor =
  Object.freeze({
    collectionsId: "EIL-2:3/Collections",
    sourcePhase: "EIL-2:3" as const,
    domains: IntegrationConnectorDomainModels,
    relationships: IntegrationConnectorRelationshipModels,
    endpoints: IntegrationConnectorEndpointModels,
    protocols: IntegrationConnectorProtocolModels,
    domainModelCount: IntegrationConnectorDomainModels.length,
    relationshipCount: IntegrationConnectorRelationshipModels.length,
    endpointModelCount: IntegrationConnectorEndpointModels.length,
    protocolModelCount: IntegrationConnectorProtocolModels.length,
    totalModelEntryCount:
      IntegrationConnectorDomainModels.length +
      IntegrationConnectorRelationshipModels.length +
      IntegrationConnectorEndpointModels.length +
      IntegrationConnectorProtocolModels.length,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });

const inventory: IntegrationConnectorModelInventory = Object.freeze({
  inventoryId: "EIL-2:3/Inventory",
  domainModelCount: IntegrationConnectorModelCollections.domainModelCount,
  relationshipCount: IntegrationConnectorModelCollections.relationshipCount,
  endpointModelCount: IntegrationConnectorModelCollections.endpointModelCount,
  protocolModelCount: IntegrationConnectorModelCollections.protocolModelCount,
  relationshipTypeCount: IntegrationConnectorRelationshipTypes.length,
  totalModelEntryCount:
    IntegrationConnectorModelCollections.totalModelEntryCount,
  countsDerivedFromCollections: true as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

/**
 * Deterministic frozen Integration Connector Model summary.
 */
export const IntegrationConnectorModelSummary: IntegrationConnectorModelSummaryDescriptor =
  Object.freeze({
    modelId: "EIL-2:3/IntegrationConnectorModel",
    version: "1.0.0",
    name: "Integration Connector Model",
    namespace: "nexora.eil.integration-connector.model",
    status: IntegrationConnectorModelStatus,
    readiness: IntegrationConnectorModelReadiness,
    registryId: "EIL-2:2/IntegrationConnectorRegistry",
    domainModelCount: IntegrationConnectorModelCollections.domainModelCount,
    relationshipCount: IntegrationConnectorModelCollections.relationshipCount,
    endpointModelCount:
      IntegrationConnectorModelCollections.endpointModelCount,
    protocolModelCount:
      IntegrationConnectorModelCollections.protocolModelCount,
    totalModelEntryCount:
      IntegrationConnectorModelCollections.totalModelEntryCount,
    nextPhase: "EIL-2:4 — Integration Connector Validation",
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });

const dependency = Object.freeze({
  dependencyId: "EIL-2:3/Dependency/EIL22Registry",
  phaseDependencies: IntegrationConnectorModelDependencies,
  phaseDependencyCount: IntegrationConnectorModelDependencies.length,
  directPreviousPhaseModule: "integrationConnectorRegistry.ts" as const,
  registryOnly: true as const,
  registryId: IntegrationConnectorRegistryIdentity.canonicalId,
  registryVersion: IntegrationConnectorRegistryIdentity.version,
  registryNamespace: IntegrationConnectorRegistryIdentity.namespace,
  registryPublicSurfaceOnly: true as const,
  foundationDirectImport: false as const,
  registryInternalImport: false as const,
  eil1Dependency: false as const,
  laterEil2PhaseImport: false as const,
  reconstructsRegistry: false as const,
  duplicatesRegistryValues: false as const,
  canonicalPath:
    "EIL-2:3 → EIL-2:2 IntegrationConnectorRegistryPlatform (exclusive)",
  runtimeBehavior: "None" as const,
  metadataOnly: true as const,
});

const boundaryModel = Object.freeze({
  boundaryModelId: "EIL-2:3/Boundary/Model",
  owns: Object.freeze([
    "connector domain models",
    "connector relationships",
    "endpoint metadata",
    "protocol metadata",
    "topology metadata",
    "model summaries",
  ]),
  doesNotOwn: Object.freeze([
    "validation",
    "manifests",
    "platform composition",
    "runtime connectors",
    "endpoint execution",
    "protocol implementation",
    "networking",
    "authentication logic",
    "authorization logic",
    "persistence",
    "services",
    "SDK runtime",
    "AI",
    "UI",
  ]),
  metadataOnly: true as const,
  immutable: true as const,
});

const PLATFORM_SECTIONS = Object.freeze([
  "identity",
  "dependency",
  "registryIdentity",
  "domains",
  "relationships",
  "endpoints",
  "protocols",
  "topology",
  "collections",
  "inventory",
  "boundaries",
  "readiness",
] as const);

/**
 * Canonical immutable Integration Connector Model platform.
 * Twelve ordered sections. Metadata only.
 */
export const IntegrationConnectorModelPlatform = Object.freeze({
  identity: IntegrationConnectorModelIdentity,
  dependency,
  registryIdentity: IntegrationConnectorRegistryIdentity,
  domains: IntegrationConnectorDomainModels,
  relationships: IntegrationConnectorRelationshipModels,
  endpoints: IntegrationConnectorEndpointModels,
  protocols: IntegrationConnectorProtocolModels,
  topology: topologyModel,
  collections: IntegrationConnectorModelCollections,
  inventory,
  boundaries: boundaryModel,
  readiness: IntegrationConnectorModelReadiness,
  summary: IntegrationConnectorModelSummary,
  relationshipTypes: IntegrationConnectorRelationshipTypes,
  sources: Object.freeze({
    registryId: IntegrationConnectorRegistryIdentity.canonicalId,
    registryEntryPoint: "integrationConnectorRegistry.ts" as const,
    registryNamespace: IntegrationConnectorRegistryIdentity.namespace,
    registrySummary: IntegrationConnectorRegistrySummary,
  }),
  sectionOrder: PLATFORM_SECTIONS,
  sectionCount: PLATFORM_SECTIONS.length,
  status: IntegrationConnectorModelStatus,
  nextPhase: "EIL-2:4 — Integration Connector Validation",
  registryPlatform: IntegrationConnectorRegistryPlatform,
  metadataOnly: true as const,
  runtimeBehavior: false as const,
  runtimeEnforcement: false as const,
  connectorRuntime: false as const,
  endpointCommunication: false as const,
  httpClientBehavior: false as const,
  restBehavior: false as const,
  graphqlBehavior: false as const,
  websocketBehavior: false as const,
  grpcBehavior: false as const,
  messageBrokerBehavior: false as const,
  eventBus: false as const,
  protocolExecution: false as const,
  serviceDiscoveryRuntime: false as const,
  authenticationLogic: false as const,
  authorizationLogic: false as const,
  encryptionBehavior: false as const,
  adapterBehavior: false as const,
  dependencyInjection: false as const,
  persistenceBehavior: false as const,
  storageBehavior: false as const,
  cacheBehavior: false as const,
  filesystemBehavior: false as const,
  networkingBehavior: false as const,
  loggingRuntime: false as const,
  monitoringRuntime: false as const,
  telemetryRuntime: false as const,
  aiBehavior: false as const,
  llmBehavior: false as const,
  uiBehavior: false as const,
  reactBehavior: false as const,
  stateMutation: false as const,
  validationEngine: false as const,
  eil1Dependency: false as const,
  importsLaterEil2Phases: false as const,
  immutable: true as const,
  deterministic: true as const,
});
