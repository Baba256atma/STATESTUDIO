/**
 * EIL-4:2 — Integration Orchestration Registry.
 *
 * Canonical immutable registry for Integration Orchestration Foundation vocabularies.
 * Consumes only the EIL-4:1 Integration Orchestration Foundation aggregate public surface.
 * Metadata-only. Runtime-free. Ready for Model.
 *
 * Ownership: owned exclusively by EIL-4:2.
 *
 * Public exports (exactly 8):
 *   IntegrationOrchestrationRegistryIdentity
 *   IntegrationOrchestrationCategoryRegistry
 *   IntegrationOrchestrationContractRegistry
 *   IntegrationOrchestrationCapabilityRegistry
 *   IntegrationOrchestrationResponsibilityRegistry
 *   IntegrationOrchestrationRegistryCollections
 *   IntegrationOrchestrationRegistrySummary
 *   IntegrationOrchestrationRegistryPlatform
 */

import { IntegrationOrchestrationFoundationPlatform } from "./integrationOrchestrationFoundation.ts";
import { IntegrationOrchestrationCapabilityRegistry } from "./integrationOrchestrationCapabilityRegistry.ts";
import { IntegrationOrchestrationCategoryRegistry } from "./integrationOrchestrationCategoryRegistry.ts";
import { IntegrationOrchestrationContractRegistry } from "./integrationOrchestrationContractRegistry.ts";
import {
  IntegrationOrchestrationRegistryDependencies,
  IntegrationOrchestrationRegistryIdentity,
  IntegrationOrchestrationRegistryReadinessValue,
  IntegrationOrchestrationRegistryStatusValue,
} from "./integrationOrchestrationRegistryIdentity.ts";
import { IntegrationOrchestrationResponsibilityRegistry } from "./integrationOrchestrationResponsibilityRegistry.ts";
import type {
  OrchestrationRegistryCollections,
  OrchestrationRegistryInventory,
  OrchestrationRegistryReference,
  OrchestrationRegistrySummary,
} from "./integrationOrchestrationRegistryTypes.ts";

export { IntegrationOrchestrationRegistryIdentity } from "./integrationOrchestrationRegistryIdentity.ts";
export { IntegrationOrchestrationCategoryRegistry } from "./integrationOrchestrationCategoryRegistry.ts";
export { IntegrationOrchestrationContractRegistry } from "./integrationOrchestrationContractRegistry.ts";
export { IntegrationOrchestrationCapabilityRegistry } from "./integrationOrchestrationCapabilityRegistry.ts";
export { IntegrationOrchestrationResponsibilityRegistry } from "./integrationOrchestrationResponsibilityRegistry.ts";

const foundation = IntegrationOrchestrationFoundationPlatform;
const foundationId = foundation.identity.foundationId;
const foundationVersion = foundation.identity.foundationVersion;
const foundationNamespace = foundation.identity.foundationNamespace;

const lifecycleCoverage: readonly OrchestrationRegistryReference[] =
  Object.freeze(
    foundation.lifecycle.states.map((state) =>
      Object.freeze({
        referenceId: `EIL-4:2/Reference/Lifecycle/${state}`,
        sourcePhase: "EIL-4:1/IntegrationOrchestrationFoundation" as const,
        sourceReference: `${foundationId}/lifecycle/states/${state}`,
        registered: true as const,
        metadataOnly: true as const,
        immutable: true as const,
      }),
    ),
  );

const ownershipCoverage = Object.freeze(
  foundation.ownership.owns.map((item, index) =>
    Object.freeze({
      ownershipKey: item,
      registered: true as const,
      ordinal: index + 1,
      sourceReference: `${foundationId}/ownership/owns/${index + 1}`,
      metadataOnly: true as const,
      immutable: true as const,
    }),
  ),
);

/**
 * Canonical collections aggregate.
 * Counts are derived exclusively from registry arrays and Foundation lifecycle.
 */
export const IntegrationOrchestrationRegistryCollections: OrchestrationRegistryCollections =
  Object.freeze({
    collectionsId: "EIL-4:2/Collections",
    sourcePhase: "EIL-4:2" as const,
    categories: IntegrationOrchestrationCategoryRegistry,
    contracts: IntegrationOrchestrationContractRegistry,
    capabilities: IntegrationOrchestrationCapabilityRegistry,
    responsibilities: IntegrationOrchestrationResponsibilityRegistry,
    categoryCount: IntegrationOrchestrationCategoryRegistry.length,
    contractCount: IntegrationOrchestrationContractRegistry.length,
    capabilityCount: IntegrationOrchestrationCapabilityRegistry.length,
    responsibilityCount:
      IntegrationOrchestrationResponsibilityRegistry.length,
    lifecycleStateCount: foundation.inventory.lifecycleStateCount,
    totalRegistryEntryCount:
      IntegrationOrchestrationCategoryRegistry.length +
      IntegrationOrchestrationContractRegistry.length +
      IntegrationOrchestrationCapabilityRegistry.length +
      IntegrationOrchestrationResponsibilityRegistry.length,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });

const inventory: OrchestrationRegistryInventory = Object.freeze({
  inventoryId: "EIL-4:2/Inventory",
  categoryCount: IntegrationOrchestrationRegistryCollections.categoryCount,
  contractCount: IntegrationOrchestrationRegistryCollections.contractCount,
  capabilityCount:
    IntegrationOrchestrationRegistryCollections.capabilityCount,
  responsibilityCount:
    IntegrationOrchestrationRegistryCollections.responsibilityCount,
  lifecycleStateCount:
    IntegrationOrchestrationRegistryCollections.lifecycleStateCount,
  totalRegistryEntryCount:
    IntegrationOrchestrationRegistryCollections.totalRegistryEntryCount,
  countsDerivedFromCollections: true as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

/**
 * Deterministic frozen Integration Orchestration Registry summary.
 * Inventory counts are derived from canonical collections only.
 */
export const IntegrationOrchestrationRegistrySummary: OrchestrationRegistrySummary =
  Object.freeze({
    registryId: "EIL-4:2/IntegrationOrchestrationRegistry",
    version: "1.0.0",
    name: "Integration Orchestration Registry",
    namespace: "nexora.eil.integration-orchestration.registry",
    status: IntegrationOrchestrationRegistryStatusValue,
    readiness: IntegrationOrchestrationRegistryReadinessValue,
    foundationId,
    categoryCount: IntegrationOrchestrationRegistryCollections.categoryCount,
    contractCount: IntegrationOrchestrationRegistryCollections.contractCount,
    capabilityCount:
      IntegrationOrchestrationRegistryCollections.capabilityCount,
    responsibilityCount:
      IntegrationOrchestrationRegistryCollections.responsibilityCount,
    lifecycleStateCount:
      IntegrationOrchestrationRegistryCollections.lifecycleStateCount,
    totalRegistryEntryCount:
      IntegrationOrchestrationRegistryCollections.totalRegistryEntryCount,
    nextPhase: "EIL-4:3 — Integration Orchestration Model",
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });

const dependency = Object.freeze({
  dependencyId: "EIL-4:2/Dependency/EIL41Foundation",
  phaseDependencies: IntegrationOrchestrationRegistryDependencies,
  phaseDependencyCount: IntegrationOrchestrationRegistryDependencies.length,
  directPreviousPhaseModule: "integrationOrchestrationFoundation.ts" as const,
  foundationOnly: true as const,
  foundationId,
  foundationVersion,
  foundationNamespace,
  foundationPublicSurfaceOnly: true as const,
  foundationInternalImport: false as const,
  previousEilPlatformDependency: false as const,
  laterEil4PhaseImport: false as const,
  reconstructsFoundation: false as const,
  duplicatesFoundationInventory: false as const,
  canonicalPath:
    "EIL-4:2 → EIL-4:1 IntegrationOrchestrationFoundationPlatform (exclusive)",
  runtimeBehavior: "None" as const,
  metadataOnly: true as const,
});

const PLATFORM_SECTIONS = Object.freeze([
  "identity",
  "dependency",
  "foundationIdentity",
  "categories",
  "contracts",
  "capabilities",
  "responsibilities",
  "lifecycleCoverage",
  "ownershipCoverage",
  "collections",
  "inventory",
  "readiness",
] as const);

/**
 * Canonical immutable Integration Orchestration Registry platform.
 * Twelve ordered sections. Metadata only.
 */
export const IntegrationOrchestrationRegistryPlatform = Object.freeze({
  identity: IntegrationOrchestrationRegistryIdentity,
  dependency,
  foundationIdentity: foundation.identity,
  categories: IntegrationOrchestrationCategoryRegistry,
  contracts: IntegrationOrchestrationContractRegistry,
  capabilities: IntegrationOrchestrationCapabilityRegistry,
  responsibilities: IntegrationOrchestrationResponsibilityRegistry,
  lifecycleCoverage,
  ownershipCoverage,
  collections: IntegrationOrchestrationRegistryCollections,
  inventory,
  readiness: IntegrationOrchestrationRegistryReadinessValue,
  summary: IntegrationOrchestrationRegistrySummary,
  sources: Object.freeze({
    foundationId,
    foundationEntryPoint: "integrationOrchestrationFoundation.ts" as const,
    foundationNamespace,
  }),
  sectionOrder: PLATFORM_SECTIONS,
  sectionCount: PLATFORM_SECTIONS.length,
  status: IntegrationOrchestrationRegistryStatusValue,
  nextPhase: "EIL-4:3 — Integration Orchestration Model",
  foundationPlatform: foundation,
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
