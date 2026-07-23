/**
 * EIL-4:3 — Integration Orchestration Model.
 *
 * Canonical immutable architectural model for the Integration Orchestration Platform.
 * Consumes only the EIL-4:2 Integration Orchestration Registry aggregate public surface.
 * Metadata-only. Runtime-free. Ready for Validation.
 *
 * Ownership: owned exclusively by EIL-4:3.
 *
 * Public exports (exactly 8):
 *   IntegrationOrchestrationModelIdentity
 *   IntegrationOrchestrationDomainModels
 *   IntegrationOrchestrationRelationshipModels
 *   IntegrationOrchestrationTopologyModels
 *   IntegrationOrchestrationLifecycleModels
 *   IntegrationOrchestrationModelCollections
 *   IntegrationOrchestrationModelSummary
 *   IntegrationOrchestrationModelPlatform
 */

import { IntegrationOrchestrationDomainModels } from "./integrationOrchestrationDomainModels.ts";
import { IntegrationOrchestrationLifecycleModels } from "./integrationOrchestrationLifecycleModels.ts";
import {
  IntegrationOrchestrationModelDependencies,
  IntegrationOrchestrationModelIdentity,
  IntegrationOrchestrationModelReadinessValue,
  IntegrationOrchestrationModelStatusValue,
} from "./integrationOrchestrationModelIdentity.ts";
import {
  IntegrationOrchestrationRelationshipModels,
  IntegrationOrchestrationRelationshipTypes,
} from "./integrationOrchestrationRelationshipModels.ts";
import { IntegrationOrchestrationTopologyModels } from "./integrationOrchestrationTopologyModels.ts";
import type {
  IntegrationOrchestrationModelCollections as OrchestrationModelCollectionsDescriptor,
  IntegrationOrchestrationModelInventory,
  IntegrationOrchestrationModelSummary as OrchestrationModelSummaryDescriptor,
} from "./integrationOrchestrationModelTypes.ts";
import {
  IntegrationOrchestrationRegistryIdentity,
  IntegrationOrchestrationRegistryPlatform,
  IntegrationOrchestrationRegistrySummary,
} from "./integrationOrchestrationRegistry.ts";

export { IntegrationOrchestrationModelIdentity } from "./integrationOrchestrationModelIdentity.ts";
export { IntegrationOrchestrationDomainModels } from "./integrationOrchestrationDomainModels.ts";
export { IntegrationOrchestrationRelationshipModels } from "./integrationOrchestrationRelationshipModels.ts";
export { IntegrationOrchestrationTopologyModels } from "./integrationOrchestrationTopologyModels.ts";
export { IntegrationOrchestrationLifecycleModels } from "./integrationOrchestrationLifecycleModels.ts";

/**
 * Canonical collections aggregate.
 * Counts are derived exclusively from model arrays.
 */
export const IntegrationOrchestrationModelCollections: OrchestrationModelCollectionsDescriptor =
  Object.freeze({
    collectionsId: "EIL-4:3/Collections",
    sourcePhase: "EIL-4:3" as const,
    domains: IntegrationOrchestrationDomainModels,
    relationships: IntegrationOrchestrationRelationshipModels,
    topologies: IntegrationOrchestrationTopologyModels,
    lifecycles: IntegrationOrchestrationLifecycleModels,
    domainModelCount: IntegrationOrchestrationDomainModels.length,
    relationshipCount: IntegrationOrchestrationRelationshipModels.length,
    topologyCount: IntegrationOrchestrationTopologyModels.length,
    lifecycleCount: IntegrationOrchestrationLifecycleModels.length,
    totalModelEntryCount:
      IntegrationOrchestrationDomainModels.length +
      IntegrationOrchestrationRelationshipModels.length +
      IntegrationOrchestrationTopologyModels.length +
      IntegrationOrchestrationLifecycleModels.length,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });

const inventory: IntegrationOrchestrationModelInventory = Object.freeze({
  inventoryId: "EIL-4:3/Inventory",
  domainModelCount: IntegrationOrchestrationModelCollections.domainModelCount,
  relationshipCount: IntegrationOrchestrationModelCollections.relationshipCount,
  topologyCount: IntegrationOrchestrationModelCollections.topologyCount,
  lifecycleCount: IntegrationOrchestrationModelCollections.lifecycleCount,
  totalModelEntryCount:
    IntegrationOrchestrationModelCollections.totalModelEntryCount,
  countsDerivedFromCollections: true as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

/**
 * Deterministic frozen Integration Orchestration Model summary.
 */
export const IntegrationOrchestrationModelSummary: OrchestrationModelSummaryDescriptor =
  Object.freeze({
    modelId: "EIL-4:3/IntegrationOrchestrationModel",
    version: "1.0.0",
    name: "Integration Orchestration Model",
    namespace: "nexora.eil.integration-orchestration.model",
    status: IntegrationOrchestrationModelStatusValue,
    readiness: IntegrationOrchestrationModelReadinessValue,
    registryId: "EIL-4:2/IntegrationOrchestrationRegistry",
    domainModelCount: IntegrationOrchestrationModelCollections.domainModelCount,
    relationshipCount:
      IntegrationOrchestrationModelCollections.relationshipCount,
    topologyCount: IntegrationOrchestrationModelCollections.topologyCount,
    lifecycleCount: IntegrationOrchestrationModelCollections.lifecycleCount,
    totalModelEntryCount:
      IntegrationOrchestrationModelCollections.totalModelEntryCount,
    nextPhase: "EIL-4:4 — Integration Orchestration Validation",
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });

const dependency = Object.freeze({
  dependencyId: "EIL-4:3/Dependency/EIL42Registry",
  phaseDependencies: IntegrationOrchestrationModelDependencies,
  phaseDependencyCount: IntegrationOrchestrationModelDependencies.length,
  directPreviousPhaseModule: "integrationOrchestrationRegistry.ts" as const,
  registryOnly: true as const,
  registryId: IntegrationOrchestrationRegistryIdentity.canonicalId,
  registryVersion: IntegrationOrchestrationRegistryIdentity.version,
  registryNamespace: IntegrationOrchestrationRegistryIdentity.namespace,
  registryPublicSurfaceOnly: true as const,
  foundationDirectImport: false as const,
  registryInternalImport: false as const,
  previousEilPlatformDependency: false as const,
  laterEil4PhaseImport: false as const,
  reconstructsRegistry: false as const,
  duplicatesRegistryValues: false as const,
  canonicalPath:
    "EIL-4:3 → EIL-4:2 IntegrationOrchestrationRegistryPlatform (exclusive)",
  runtimeBehavior: "None" as const,
  metadataOnly: true as const,
});

const boundaryModel = Object.freeze({
  boundaryModelId: "EIL-4:3/Boundary/Model",
  owns: Object.freeze([
    "orchestration domain models",
    "orchestration relationship models",
    "orchestration topology models",
    "orchestration lifecycle models",
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
    "orchestration runtime",
    "workflow execution",
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
  compatibilityId: "EIL-4:3/Compatibility/Model",
  sourcePhase: "EIL-4:3" as const,
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
 * Canonical immutable Integration Orchestration Model platform.
 * Twelve ordered sections. Metadata only.
 */
export const IntegrationOrchestrationModelPlatform = Object.freeze({
  identity: IntegrationOrchestrationModelIdentity,
  dependency,
  registryIdentity: IntegrationOrchestrationRegistryIdentity,
  domains: IntegrationOrchestrationDomainModels,
  relationships: IntegrationOrchestrationRelationshipModels,
  topologies: IntegrationOrchestrationTopologyModels,
  lifecycles: IntegrationOrchestrationLifecycleModels,
  collections: IntegrationOrchestrationModelCollections,
  inventory,
  boundaries: boundaryModel,
  compatibility,
  readiness: IntegrationOrchestrationModelReadinessValue,
  summary: IntegrationOrchestrationModelSummary,
  relationshipTypes: IntegrationOrchestrationRelationshipTypes,
  sources: Object.freeze({
    registryId: IntegrationOrchestrationRegistryIdentity.canonicalId,
    registryEntryPoint: "integrationOrchestrationRegistry.ts" as const,
    registryNamespace: IntegrationOrchestrationRegistryIdentity.namespace,
    registrySummary: IntegrationOrchestrationRegistrySummary,
  }),
  sectionOrder: PLATFORM_SECTIONS,
  sectionCount: PLATFORM_SECTIONS.length,
  status: IntegrationOrchestrationModelStatusValue,
  nextPhase: "EIL-4:4 — Integration Orchestration Validation",
  registryPlatform: IntegrationOrchestrationRegistryPlatform,
  metadataOnly: true as const,
  runtimeBehavior: false as const,
  runtimeEnforcement: false as const,
  orchestrationEngine: false as const,
  workflowExecution: false as const,
  routingExecution: false as const,
  schedulingBehavior: false as const,
  triggerProcessing: false as const,
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
  previousEilPlatformDependency: false as const,
  importsLaterEil4Phases: false as const,
  immutable: true as const,
  deterministic: true as const,
});
