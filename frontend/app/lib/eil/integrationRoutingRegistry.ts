/**
 * EIL-3:2 — Integration Routing Registry.
 *
 * Canonical immutable registry for Integration Routing Foundation vocabularies.
 * Consumes only the EIL-3:1 Integration Routing Foundation aggregate public surface.
 * Metadata-only. Runtime-free. Ready for Model.
 *
 * Ownership: owned exclusively by EIL-3:2.
 *
 * Public exports (exactly 8):
 *   IntegrationRoutingRegistryIdentity
 *   IntegrationRoutingCategoryRegistry
 *   IntegrationRoutingContractRegistry
 *   IntegrationRoutingCapabilityRegistry
 *   IntegrationRoutingResponsibilityRegistry
 *   IntegrationRoutingRegistryCollections
 *   IntegrationRoutingRegistrySummary
 *   IntegrationRoutingRegistryPlatform
 */

import { IntegrationRoutingFoundationPlatform } from "./integrationRoutingFoundation.ts";
import { IntegrationRoutingCapabilityRegistry } from "./integrationRoutingCapabilityRegistry.ts";
import { IntegrationRoutingCategoryRegistry } from "./integrationRoutingCategoryRegistry.ts";
import { IntegrationRoutingContractRegistry } from "./integrationRoutingContractRegistry.ts";
import {
  IntegrationRoutingRegistryDependencies,
  IntegrationRoutingRegistryIdentity,
  IntegrationRoutingRegistryReadinessValue,
  IntegrationRoutingRegistryStatusValue,
} from "./integrationRoutingRegistryIdentity.ts";
import { IntegrationRoutingResponsibilityRegistry } from "./integrationRoutingResponsibilityRegistry.ts";
import type {
  RoutingRegistryCollections,
  RoutingRegistryInventory,
  RoutingRegistrySummary,
} from "./integrationRoutingRegistryTypes.ts";

export { IntegrationRoutingRegistryIdentity } from "./integrationRoutingRegistryIdentity.ts";
export { IntegrationRoutingCategoryRegistry } from "./integrationRoutingCategoryRegistry.ts";
export { IntegrationRoutingContractRegistry } from "./integrationRoutingContractRegistry.ts";
export { IntegrationRoutingCapabilityRegistry } from "./integrationRoutingCapabilityRegistry.ts";
export { IntegrationRoutingResponsibilityRegistry } from "./integrationRoutingResponsibilityRegistry.ts";

const foundation = IntegrationRoutingFoundationPlatform;
const foundationId = foundation.identity.foundationId;
const foundationVersion = foundation.identity.foundationVersion;
const foundationNamespace = foundation.identity.foundationNamespace;

const lifecycleCoverage = Object.freeze(
  foundation.lifecycle.states.map((state) =>
    Object.freeze({
      state,
      registered: true as const,
      sourceReference: `${foundationId}/lifecycle/states/${state}`,
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
 * Counts are derived exclusively from registry arrays.
 */
export const IntegrationRoutingRegistryCollections: RoutingRegistryCollections =
  Object.freeze({
    collectionsId: "EIL-3:2/Collections",
    sourcePhase: "EIL-3:2" as const,
    categories: IntegrationRoutingCategoryRegistry,
    contracts: IntegrationRoutingContractRegistry,
    capabilities: IntegrationRoutingCapabilityRegistry,
    responsibilities: IntegrationRoutingResponsibilityRegistry,
    categoryCount: IntegrationRoutingCategoryRegistry.length,
    contractCount: IntegrationRoutingContractRegistry.length,
    capabilityCount: IntegrationRoutingCapabilityRegistry.length,
    responsibilityCount: IntegrationRoutingResponsibilityRegistry.length,
    lifecycleStateCount: foundation.lifecycle.stateCount,
    totalRegistryEntryCount:
      IntegrationRoutingCategoryRegistry.length +
      IntegrationRoutingContractRegistry.length +
      IntegrationRoutingCapabilityRegistry.length +
      IntegrationRoutingResponsibilityRegistry.length,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });

const inventory: RoutingRegistryInventory = Object.freeze({
  inventoryId: "EIL-3:2/Inventory",
  categoryCount: IntegrationRoutingRegistryCollections.categoryCount,
  contractCount: IntegrationRoutingRegistryCollections.contractCount,
  capabilityCount: IntegrationRoutingRegistryCollections.capabilityCount,
  responsibilityCount:
    IntegrationRoutingRegistryCollections.responsibilityCount,
  lifecycleStateCount:
    IntegrationRoutingRegistryCollections.lifecycleStateCount,
  totalRegistryEntryCount:
    IntegrationRoutingRegistryCollections.totalRegistryEntryCount,
  countsDerivedFromCollections: true as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

/**
 * Deterministic frozen Integration Routing Registry summary.
 * Inventory counts are derived from canonical collections only.
 */
export const IntegrationRoutingRegistrySummary: RoutingRegistrySummary =
  Object.freeze({
    registryId: "EIL-3:2/IntegrationRoutingRegistry",
    version: "1.0.0",
    name: "Integration Routing Registry",
    namespace: "nexora.eil.integration-routing.registry",
    status: IntegrationRoutingRegistryStatusValue,
    readiness: IntegrationRoutingRegistryReadinessValue,
    foundationId,
    categoryCount: IntegrationRoutingRegistryCollections.categoryCount,
    contractCount: IntegrationRoutingRegistryCollections.contractCount,
    capabilityCount: IntegrationRoutingRegistryCollections.capabilityCount,
    responsibilityCount:
      IntegrationRoutingRegistryCollections.responsibilityCount,
    lifecycleStateCount:
      IntegrationRoutingRegistryCollections.lifecycleStateCount,
    totalRegistryEntryCount:
      IntegrationRoutingRegistryCollections.totalRegistryEntryCount,
    nextPhase: "EIL-3:3 — Integration Routing Model",
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });

const dependency = Object.freeze({
  dependencyId: "EIL-3:2/Dependency/EIL31Foundation",
  phaseDependencies: IntegrationRoutingRegistryDependencies,
  phaseDependencyCount: IntegrationRoutingRegistryDependencies.length,
  directPreviousPhaseModule: "integrationRoutingFoundation.ts" as const,
  foundationOnly: true as const,
  foundationId,
  foundationVersion,
  foundationNamespace,
  foundationPublicSurfaceOnly: true as const,
  foundationInternalImport: false as const,
  previousEilPlatformDependency: false as const,
  laterEil3PhaseImport: false as const,
  reconstructsFoundation: false as const,
  duplicatesFoundationInventory: false as const,
  canonicalPath:
    "EIL-3:2 → EIL-3:1 IntegrationRoutingFoundationPlatform (exclusive)",
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
 * Canonical immutable Integration Routing Registry platform.
 * Twelve ordered sections. Metadata only.
 */
export const IntegrationRoutingRegistryPlatform = Object.freeze({
  identity: IntegrationRoutingRegistryIdentity,
  dependency,
  foundationIdentity: foundation.identity,
  categories: IntegrationRoutingCategoryRegistry,
  contracts: IntegrationRoutingContractRegistry,
  capabilities: IntegrationRoutingCapabilityRegistry,
  responsibilities: IntegrationRoutingResponsibilityRegistry,
  lifecycleCoverage,
  ownershipCoverage,
  collections: IntegrationRoutingRegistryCollections,
  inventory,
  readiness: IntegrationRoutingRegistryReadinessValue,
  summary: IntegrationRoutingRegistrySummary,
  sources: Object.freeze({
    foundationId,
    foundationEntryPoint: "integrationRoutingFoundation.ts" as const,
    foundationNamespace,
  }),
  sectionOrder: PLATFORM_SECTIONS,
  sectionCount: PLATFORM_SECTIONS.length,
  status: IntegrationRoutingRegistryStatusValue,
  nextPhase: "EIL-3:3 — Integration Routing Model",
  foundationPlatform: foundation,
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
  previousEilPlatformDependency: false as const,
  importsLaterEil3Phases: false as const,
  immutable: true as const,
  deterministic: true as const,
});
