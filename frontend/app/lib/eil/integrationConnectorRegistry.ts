/**
 * EIL-2:2 — Integration Connector Registry.
 *
 * Canonical immutable registry for Integration Connector Foundation vocabularies.
 * Consumes only the EIL-2:1 Integration Connector Foundation aggregate public surface.
 * Metadata-only. Runtime-free. Ready for Model.
 *
 * Ownership: owned exclusively by EIL-2:2.
 *
 * Public exports (exactly 8):
 *   IntegrationConnectorRegistryIdentity
 *   IntegrationConnectorCategoryRegistry
 *   IntegrationConnectorContractRegistry
 *   IntegrationConnectorCapabilityRegistry
 *   IntegrationConnectorResponsibilityRegistry
 *   IntegrationConnectorRegistryCollections
 *   IntegrationConnectorRegistrySummary
 *   IntegrationConnectorRegistryPlatform
 */

import { IntegrationConnectorCapabilityRegistry } from "./integrationConnectorCapabilityRegistry.ts";
import { IntegrationConnectorCategoryRegistry } from "./integrationConnectorCategoryRegistry.ts";
import { IntegrationConnectorContractRegistry } from "./integrationConnectorContractRegistry.ts";
import {
  IntegrationConnectorFoundationId,
  IntegrationConnectorFoundationNamespace,
  IntegrationConnectorFoundationPlatform,
  IntegrationConnectorFoundationVersion,
} from "./integrationConnectorFoundation.ts";
import {
  IntegrationConnectorRegistryDependencies,
  IntegrationConnectorRegistryIdentity,
  IntegrationConnectorRegistryReadiness,
  IntegrationConnectorRegistryStatus,
} from "./integrationConnectorRegistryIdentity.ts";
import { IntegrationConnectorResponsibilityRegistry } from "./integrationConnectorResponsibilityRegistry.ts";
import type {
  IntegrationConnectorRegistryCollectionsDescriptor,
  IntegrationConnectorRegistryInventory,
  IntegrationConnectorRegistrySummaryDescriptor,
} from "./integrationConnectorRegistryTypes.ts";

export { IntegrationConnectorRegistryIdentity } from "./integrationConnectorRegistryIdentity.ts";
export { IntegrationConnectorCategoryRegistry } from "./integrationConnectorCategoryRegistry.ts";
export { IntegrationConnectorContractRegistry } from "./integrationConnectorContractRegistry.ts";
export { IntegrationConnectorCapabilityRegistry } from "./integrationConnectorCapabilityRegistry.ts";
export { IntegrationConnectorResponsibilityRegistry } from "./integrationConnectorResponsibilityRegistry.ts";

const lifecycleCoverage = Object.freeze(
  IntegrationConnectorFoundationPlatform.lifecycle.states.map((state) =>
    Object.freeze({
      state,
      registered: true as const,
      sourceReference:
        `${IntegrationConnectorFoundationId}/lifecycle/states/${state}`,
      metadataOnly: true as const,
      immutable: true as const,
    }),
  ),
);

const ownershipCoverage = Object.freeze(
  IntegrationConnectorFoundationPlatform.ownership.owns.map((item, index) =>
    Object.freeze({
      ownershipKey: item,
      registered: true as const,
      ordinal: index + 1,
      sourceReference:
        `${IntegrationConnectorFoundationId}/ownership/owns/${index + 1}`,
      metadataOnly: true as const,
      immutable: true as const,
    }),
  ),
);

/**
 * Canonical collections aggregate.
 * Counts are derived exclusively from registry arrays.
 */
export const IntegrationConnectorRegistryCollections: IntegrationConnectorRegistryCollectionsDescriptor =
  Object.freeze({
    collectionsId: "EIL-2:2/Collections",
    sourcePhase: "EIL-2:2" as const,
    categories: IntegrationConnectorCategoryRegistry,
    contracts: IntegrationConnectorContractRegistry,
    capabilities: IntegrationConnectorCapabilityRegistry,
    responsibilities: IntegrationConnectorResponsibilityRegistry,
    categoryCount: IntegrationConnectorCategoryRegistry.length,
    contractCount: IntegrationConnectorContractRegistry.length,
    capabilityCount: IntegrationConnectorCapabilityRegistry.length,
    responsibilityCount: IntegrationConnectorResponsibilityRegistry.length,
    lifecycleStateCount:
      IntegrationConnectorFoundationPlatform.lifecycle.stateCount,
    totalRegistryEntryCount:
      IntegrationConnectorCategoryRegistry.length +
      IntegrationConnectorContractRegistry.length +
      IntegrationConnectorCapabilityRegistry.length +
      IntegrationConnectorResponsibilityRegistry.length,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });

const inventory: IntegrationConnectorRegistryInventory = Object.freeze({
  inventoryId: "EIL-2:2/Inventory",
  categoryCount: IntegrationConnectorRegistryCollections.categoryCount,
  contractCount: IntegrationConnectorRegistryCollections.contractCount,
  capabilityCount: IntegrationConnectorRegistryCollections.capabilityCount,
  responsibilityCount:
    IntegrationConnectorRegistryCollections.responsibilityCount,
  lifecycleStateCount:
    IntegrationConnectorRegistryCollections.lifecycleStateCount,
  totalRegistryEntryCount:
    IntegrationConnectorRegistryCollections.totalRegistryEntryCount,
  countsDerivedFromCollections: true as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

/**
 * Deterministic frozen Integration Connector Registry summary.
 * Inventory counts are derived from canonical collections only.
 */
export const IntegrationConnectorRegistrySummary: IntegrationConnectorRegistrySummaryDescriptor =
  Object.freeze({
    registryId: "EIL-2:2/IntegrationConnectorRegistry",
    version: "1.0.0",
    name: "Integration Connector Registry",
    namespace: "nexora.eil.integration-connector.registry",
    status: IntegrationConnectorRegistryStatus,
    readiness: IntegrationConnectorRegistryReadiness,
    foundationId: IntegrationConnectorFoundationId,
    categoryCount: IntegrationConnectorRegistryCollections.categoryCount,
    contractCount: IntegrationConnectorRegistryCollections.contractCount,
    capabilityCount: IntegrationConnectorRegistryCollections.capabilityCount,
    responsibilityCount:
      IntegrationConnectorRegistryCollections.responsibilityCount,
    lifecycleStateCount:
      IntegrationConnectorRegistryCollections.lifecycleStateCount,
    totalRegistryEntryCount:
      IntegrationConnectorRegistryCollections.totalRegistryEntryCount,
    nextPhase: "EIL-2:3 — Integration Connector Model",
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });

const dependency = Object.freeze({
  dependencyId: "EIL-2:2/Dependency/EIL21Foundation",
  phaseDependencies: IntegrationConnectorRegistryDependencies,
  phaseDependencyCount: IntegrationConnectorRegistryDependencies.length,
  directPreviousPhaseModule: "integrationConnectorFoundation.ts" as const,
  foundationOnly: true as const,
  foundationId: IntegrationConnectorFoundationId,
  foundationVersion: IntegrationConnectorFoundationVersion,
  foundationNamespace: IntegrationConnectorFoundationNamespace,
  foundationPublicSurfaceOnly: true as const,
  foundationInternalImport: false as const,
  eil1Dependency: false as const,
  laterEil2PhaseImport: false as const,
  reconstructsFoundation: false as const,
  duplicatesFoundationInventory: false as const,
  canonicalPath:
    "EIL-2:2 → EIL-2:1 IntegrationConnectorFoundationPlatform (exclusive)",
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
 * Canonical immutable Integration Connector Registry platform.
 * Twelve ordered sections. Metadata only.
 */
export const IntegrationConnectorRegistryPlatform = Object.freeze({
  identity: IntegrationConnectorRegistryIdentity,
  dependency,
  foundationIdentity: IntegrationConnectorFoundationPlatform.identity,
  categories: IntegrationConnectorCategoryRegistry,
  contracts: IntegrationConnectorContractRegistry,
  capabilities: IntegrationConnectorCapabilityRegistry,
  responsibilities: IntegrationConnectorResponsibilityRegistry,
  lifecycleCoverage,
  ownershipCoverage,
  collections: IntegrationConnectorRegistryCollections,
  inventory,
  readiness: IntegrationConnectorRegistryReadiness,
  summary: IntegrationConnectorRegistrySummary,
  sources: Object.freeze({
    foundationId: IntegrationConnectorFoundationId,
    foundationEntryPoint: "integrationConnectorFoundation.ts" as const,
    foundationNamespace: IntegrationConnectorFoundationNamespace,
  }),
  sectionOrder: PLATFORM_SECTIONS,
  sectionCount: PLATFORM_SECTIONS.length,
  status: IntegrationConnectorRegistryStatus,
  nextPhase: "EIL-2:3 — Integration Connector Model",
  foundationPlatform: IntegrationConnectorFoundationPlatform,
  metadataOnly: true as const,
  runtimeBehavior: false as const,
  runtimeEnforcement: false as const,
  connectorRuntime: false as const,
  protocolExecution: false as const,
  restBehavior: false as const,
  graphqlBehavior: false as const,
  websocketBehavior: false as const,
  httpClientBehavior: false as const,
  messageBrokerBehavior: false as const,
  eventBus: false as const,
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
  eil1Dependency: false as const,
  importsLaterEil2Phases: false as const,
  immutable: true as const,
  deterministic: true as const,
});
