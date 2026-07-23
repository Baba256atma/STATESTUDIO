/**
 * EIL-3:3 — Integration Routing Model.
 *
 * Canonical immutable architectural model for the Integration Routing Platform.
 * Consumes only the EIL-3:2 Integration Routing Registry aggregate public surface.
 * Metadata-only. Runtime-free. Ready for Validation.
 *
 * Ownership: owned exclusively by EIL-3:3.
 *
 * Public exports (exactly 8):
 *   IntegrationRoutingModelIdentity
 *   IntegrationRoutingDomainModels
 *   IntegrationRoutingRelationshipModels
 *   IntegrationRoutingTopologyModels
 *   IntegrationRoutingLifecycleModels
 *   IntegrationRoutingModelCollections
 *   IntegrationRoutingModelSummary
 *   IntegrationRoutingModelPlatform
 */

import { IntegrationRoutingDomainModels } from "./integrationRoutingDomainModels.ts";
import { IntegrationRoutingLifecycleModels } from "./integrationRoutingLifecycleModels.ts";
import {
  IntegrationRoutingModelDependencies,
  IntegrationRoutingModelIdentity,
  IntegrationRoutingModelReadinessValue,
  IntegrationRoutingModelStatusValue,
} from "./integrationRoutingModelIdentity.ts";
import {
  IntegrationRoutingRelationshipModels,
  IntegrationRoutingRelationshipTypes,
} from "./integrationRoutingRelationshipModels.ts";
import { IntegrationRoutingTopologyModels } from "./integrationRoutingTopologyModels.ts";
import type {
  RoutingModelCollections,
  RoutingModelInventory,
  RoutingModelSummary,
} from "./integrationRoutingModelTypes.ts";
import {
  IntegrationRoutingRegistryIdentity,
  IntegrationRoutingRegistryPlatform,
  IntegrationRoutingRegistrySummary,
} from "./integrationRoutingRegistry.ts";

export { IntegrationRoutingModelIdentity } from "./integrationRoutingModelIdentity.ts";
export { IntegrationRoutingDomainModels } from "./integrationRoutingDomainModels.ts";
export { IntegrationRoutingRelationshipModels } from "./integrationRoutingRelationshipModels.ts";
export { IntegrationRoutingTopologyModels } from "./integrationRoutingTopologyModels.ts";
export { IntegrationRoutingLifecycleModels } from "./integrationRoutingLifecycleModels.ts";

/**
 * Canonical collections aggregate.
 * Counts are derived exclusively from model arrays.
 */
export const IntegrationRoutingModelCollections: RoutingModelCollections =
  Object.freeze({
    collectionsId: "EIL-3:3/Collections",
    sourcePhase: "EIL-3:3" as const,
    domains: IntegrationRoutingDomainModels,
    relationships: IntegrationRoutingRelationshipModels,
    topologies: IntegrationRoutingTopologyModels,
    lifecycles: IntegrationRoutingLifecycleModels,
    domainModelCount: IntegrationRoutingDomainModels.length,
    relationshipCount: IntegrationRoutingRelationshipModels.length,
    topologyCount: IntegrationRoutingTopologyModels.length,
    lifecycleCount: IntegrationRoutingLifecycleModels.length,
    totalModelEntryCount:
      IntegrationRoutingDomainModels.length +
      IntegrationRoutingRelationshipModels.length +
      IntegrationRoutingTopologyModels.length +
      IntegrationRoutingLifecycleModels.length,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });

const inventory: RoutingModelInventory = Object.freeze({
  inventoryId: "EIL-3:3/Inventory",
  domainModelCount: IntegrationRoutingModelCollections.domainModelCount,
  relationshipCount: IntegrationRoutingModelCollections.relationshipCount,
  topologyCount: IntegrationRoutingModelCollections.topologyCount,
  lifecycleCount: IntegrationRoutingModelCollections.lifecycleCount,
  totalModelEntryCount:
    IntegrationRoutingModelCollections.totalModelEntryCount,
  countsDerivedFromCollections: true as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

/**
 * Deterministic frozen Integration Routing Model summary.
 */
export const IntegrationRoutingModelSummary: RoutingModelSummary =
  Object.freeze({
    modelId: "EIL-3:3/IntegrationRoutingModel",
    version: "1.0.0",
    name: "Integration Routing Model",
    namespace: "nexora.eil.integration-routing.model",
    status: IntegrationRoutingModelStatusValue,
    readiness: IntegrationRoutingModelReadinessValue,
    registryId: "EIL-3:2/IntegrationRoutingRegistry",
    domainModelCount: IntegrationRoutingModelCollections.domainModelCount,
    relationshipCount: IntegrationRoutingModelCollections.relationshipCount,
    topologyCount: IntegrationRoutingModelCollections.topologyCount,
    lifecycleCount: IntegrationRoutingModelCollections.lifecycleCount,
    totalModelEntryCount:
      IntegrationRoutingModelCollections.totalModelEntryCount,
    nextPhase: "EIL-3:4 — Integration Routing Validation",
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });

const dependency = Object.freeze({
  dependencyId: "EIL-3:3/Dependency/EIL32Registry",
  phaseDependencies: IntegrationRoutingModelDependencies,
  phaseDependencyCount: IntegrationRoutingModelDependencies.length,
  directPreviousPhaseModule: "integrationRoutingRegistry.ts" as const,
  registryOnly: true as const,
  registryId: IntegrationRoutingRegistryIdentity.canonicalId,
  registryVersion: IntegrationRoutingRegistryIdentity.version,
  registryNamespace: IntegrationRoutingRegistryIdentity.namespace,
  registryPublicSurfaceOnly: true as const,
  foundationDirectImport: false as const,
  registryInternalImport: false as const,
  previousEilPlatformDependency: false as const,
  laterEil3PhaseImport: false as const,
  reconstructsRegistry: false as const,
  duplicatesRegistryValues: false as const,
  canonicalPath:
    "EIL-3:3 → EIL-3:2 IntegrationRoutingRegistryPlatform (exclusive)",
  runtimeBehavior: "None" as const,
  metadataOnly: true as const,
});

const boundaryModel = Object.freeze({
  boundaryModelId: "EIL-3:3/Boundary/Model",
  owns: Object.freeze([
    "routing domain models",
    "routing relationship models",
    "routing topology models",
    "routing lifecycle models",
    "model inventories",
    "model summaries",
  ]),
  doesNotOwn: Object.freeze([
    "validation",
    "manifest",
    "platform",
    "certification",
    "freeze",
    "public index",
    "routing engine",
    "orchestration",
    "scheduling",
    "networking",
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
  "topologies",
  "lifecycles",
  "collections",
  "inventory",
  "boundaries",
  "compatibility",
  "readiness",
] as const);

const compatibility = Object.freeze({
  compatibilityId: "EIL-3:3/Compatibility/Model",
  sourcePhase: "EIL-3:3" as const,
  declarations: Object.freeze([
    "Model references Registry entries without duplicating values",
    "Domain relationships are descriptive metadata only",
    "Topology models describe architecture without graph engines",
    "Lifecycle mappings do not execute transitions",
  ] as const),
  runtimeValidation: false as const,
  metadataOnly: true as const,
  immutable: true as const,
});

/**
 * Canonical immutable Integration Routing Model platform.
 * Twelve ordered sections. Metadata only.
 */
export const IntegrationRoutingModelPlatform = Object.freeze({
  identity: IntegrationRoutingModelIdentity,
  dependency,
  registryIdentity: IntegrationRoutingRegistryIdentity,
  domains: IntegrationRoutingDomainModels,
  relationships: IntegrationRoutingRelationshipModels,
  topologies: IntegrationRoutingTopologyModels,
  lifecycles: IntegrationRoutingLifecycleModels,
  collections: IntegrationRoutingModelCollections,
  inventory,
  boundaries: boundaryModel,
  compatibility,
  readiness: IntegrationRoutingModelReadinessValue,
  summary: IntegrationRoutingModelSummary,
  relationshipTypes: IntegrationRoutingRelationshipTypes,
  sources: Object.freeze({
    registryId: IntegrationRoutingRegistryIdentity.canonicalId,
    registryEntryPoint: "integrationRoutingRegistry.ts" as const,
    registryNamespace: IntegrationRoutingRegistryIdentity.namespace,
    registrySummary: IntegrationRoutingRegistrySummary,
  }),
  sectionOrder: PLATFORM_SECTIONS,
  sectionCount: PLATFORM_SECTIONS.length,
  status: IntegrationRoutingModelStatusValue,
  nextPhase: "EIL-3:4 — Integration Routing Validation",
  registryPlatform: IntegrationRoutingRegistryPlatform,
  metadataOnly: true as const,
  runtimeBehavior: false as const,
  runtimeEnforcement: false as const,
  routingEngine: false as const,
  messageExecution: false as const,
  orchestrationBehavior: false as const,
  schedulingBehavior: false as const,
  networkingBehavior: false as const,
  restBehavior: false as const,
  graphqlBehavior: false as const,
  websocketBehavior: false as const,
  queueBehavior: false as const,
  connectorExecution: false as const,
  adapterBehavior: false as const,
  sdkRuntime: false as const,
  persistenceBehavior: false as const,
  storageBehavior: false as const,
  cacheBehavior: false as const,
  filesystemBehavior: false as const,
  serviceBehavior: false as const,
  dependencyInjection: false as const,
  loggingBehavior: false as const,
  monitoringBehavior: false as const,
  telemetryBehavior: false as const,
  aiBehavior: false as const,
  llmBehavior: false as const,
  uiBehavior: false as const,
  reactBehavior: false as const,
  businessLogicBehavior: false as const,
  stateMutation: false as const,
  validationEngine: false as const,
  previousEilPlatformDependency: false as const,
  importsLaterEil3Phases: false as const,
  immutable: true as const,
  deterministic: true as const,
});
