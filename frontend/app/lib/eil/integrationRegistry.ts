/**
 * EIL-1:2 — Integration Registry.
 *
 * Canonical immutable registry for Integration Foundation vocabularies.
 * Consumes only the EIL-1:1 Integration Foundation aggregate public surface.
 * Metadata-only. Runtime-free. Ready for Model.
 *
 * Ownership: owned exclusively by EIL-1:2.
 *
 * Public exports (exactly 8):
 *   IntegrationRegistryIdentity
 *   IntegrationTypeRegistry
 *   IntegrationContractRegistry
 *   IntegrationCapabilityRegistry
 *   IntegrationResponsibilityRegistry
 *   IntegrationRegistryCollections
 *   IntegrationRegistrySummary
 *   IntegrationRegistryPlatform
 */

import {
  IntegrationFoundationId,
  IntegrationFoundationNamespace,
  IntegrationFoundationPlatform,
  IntegrationFoundationVersion,
} from "./integrationFoundation.ts";
import { IntegrationCapabilityRegistry } from "./integrationCapabilityRegistry.ts";
import { IntegrationContractRegistry } from "./integrationContractRegistry.ts";
import {
  IntegrationRegistryDependencies,
  IntegrationRegistryIdentity,
  IntegrationRegistryReadiness,
  IntegrationRegistryStatus,
} from "./integrationRegistryIdentity.ts";
import { IntegrationResponsibilityRegistry } from "./integrationResponsibilityRegistry.ts";
import {
  IntegrationTypeRegistry,
  IntegrationTypeRegistryCatalog,
} from "./integrationTypeRegistry.ts";
import type {
  IntegrationRegistrySummaryDescriptor,
  IntegrationRegistryValidationSummary,
} from "./integrationRegistryTypes.ts";

export { IntegrationRegistryIdentity } from "./integrationRegistryIdentity.ts";
export { IntegrationTypeRegistry } from "./integrationTypeRegistry.ts";
export { IntegrationContractRegistry } from "./integrationContractRegistry.ts";
export { IntegrationCapabilityRegistry } from "./integrationCapabilityRegistry.ts";
export { IntegrationResponsibilityRegistry } from "./integrationResponsibilityRegistry.ts";

const REGISTRY_CATEGORIES = Object.freeze([
  "IntegrationType",
  "PlatformRole",
  "Contract",
  "Capability",
  "Responsibility",
  "Coordination",
  "Routing",
  "Compatibility",
  "Lifecycle",
  "Ownership",
] as const);

const lifecycleCoverage = Object.freeze(
  IntegrationFoundationPlatform.lifecycle.states.map((state) =>
    Object.freeze({
      state,
      registered: true as const,
      sourceReference:
        `${IntegrationFoundationId}/lifecycle/states/${state}`,
      metadataOnly: true as const,
      immutable: true as const,
    }),
  ),
);

const validationSummary: IntegrationRegistryValidationSummary = Object.freeze({
  validationId: "EIL-1:2/ValidationSummary",
  uniqueIds: true as const,
  uniqueKeys: true as const,
  deterministicOrdinals: true as const,
  foundationOrderPreserved: true as const,
  countsDerivedFromCollections: true as const,
  executableEntries: false as const,
  runtimeBehavior: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

/**
 * Canonical collections aggregate.
 * Counts are derived exclusively from registry arrays.
 */
export const IntegrationRegistryCollections = Object.freeze({
  collectionsId: "EIL-1:2/Collections",
  sourcePhase: "EIL-1:2" as const,
  types: IntegrationTypeRegistry,
  contracts: IntegrationContractRegistry,
  capabilities: IntegrationCapabilityRegistry,
  responsibilities: IntegrationResponsibilityRegistry,
  typeCount: IntegrationTypeRegistry.length,
  contractCount: IntegrationContractRegistry.length,
  capabilityCount: IntegrationCapabilityRegistry.length,
  responsibilityCount: IntegrationResponsibilityRegistry.length,
  lifecycleStateCount: IntegrationTypeRegistryCatalog.lifecycleStateCount,
  totalRegistryEntryCount:
    IntegrationTypeRegistry.length +
    IntegrationContractRegistry.length +
    IntegrationCapabilityRegistry.length +
    IntegrationResponsibilityRegistry.length,
  categories: REGISTRY_CATEGORIES,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

/**
 * Deterministic frozen Integration Registry summary.
 * Inventory counts are derived from canonical collections only.
 */
export const IntegrationRegistrySummary: IntegrationRegistrySummaryDescriptor =
  Object.freeze({
    registryId: "EIL-1:2/IntegrationRegistry",
    version: "1.0.0",
    name: "Integration Registry",
    namespace: "nexora.eil.integration.registry",
    status: IntegrationRegistryStatus,
    readiness: IntegrationRegistryReadiness,
    foundationId: IntegrationFoundationId,
    typeCount: IntegrationRegistryCollections.typeCount,
    contractCount: IntegrationRegistryCollections.contractCount,
    capabilityCount: IntegrationRegistryCollections.capabilityCount,
    responsibilityCount: IntegrationRegistryCollections.responsibilityCount,
    lifecycleStateCount: IntegrationRegistryCollections.lifecycleStateCount,
    totalRegistryEntryCount:
      IntegrationRegistryCollections.totalRegistryEntryCount,
    nextPhase: "EIL-1:3 — Integration Model",
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });

const dependency = Object.freeze({
  dependencyId: "EIL-1:2/Dependency/EIL11Foundation",
  phaseDependencies: IntegrationRegistryDependencies,
  phaseDependencyCount: IntegrationRegistryDependencies.length,
  directPreviousPhaseModule: "integrationFoundation.ts" as const,
  foundationOnly: true as const,
  foundationId: IntegrationFoundationId,
  foundationVersion: IntegrationFoundationVersion,
  foundationNamespace: IntegrationFoundationNamespace,
  foundationPublicSurfaceOnly: true as const,
  laterEilPhaseImport: false as const,
  reconstructsFoundation: false as const,
  duplicatesFoundationInventory: false as const,
  canonicalPath:
    "EIL-1:2 → EIL-1:1 IntegrationFoundationPlatform (exclusive)",
  runtimeBehavior: "None" as const,
  metadataOnly: true as const,
});

const PLATFORM_SECTIONS = Object.freeze([
  "identity",
  "dependency",
  "foundationIdentity",
  "types",
  "contracts",
  "capabilities",
  "responsibilities",
  "lifecycleCoverage",
  "categories",
  "collections",
  "validation",
  "readiness",
] as const);

/**
 * Canonical immutable Integration Registry platform.
 * Twelve ordered sections. Metadata only.
 */
export const IntegrationRegistryPlatform = Object.freeze({
  identity: IntegrationRegistryIdentity,
  dependency,
  foundationIdentity: IntegrationFoundationPlatform.identity,
  types: IntegrationTypeRegistry,
  contracts: IntegrationContractRegistry,
  capabilities: IntegrationCapabilityRegistry,
  responsibilities: IntegrationResponsibilityRegistry,
  lifecycleCoverage,
  categories: REGISTRY_CATEGORIES,
  collections: IntegrationRegistryCollections,
  validation: validationSummary,
  readiness: IntegrationRegistryReadiness,
  summary: IntegrationRegistrySummary,
  counts: Object.freeze({
    typeCount: IntegrationRegistryCollections.typeCount,
    contractCount: IntegrationRegistryCollections.contractCount,
    capabilityCount: IntegrationRegistryCollections.capabilityCount,
    responsibilityCount: IntegrationRegistryCollections.responsibilityCount,
    lifecycleStateCount: IntegrationRegistryCollections.lifecycleStateCount,
    totalRegistryEntryCount:
      IntegrationRegistryCollections.totalRegistryEntryCount,
    categoryCount: REGISTRY_CATEGORIES.length,
  }),
  sources: Object.freeze({
    foundationId: IntegrationFoundationId,
    foundationEntryPoint: "integrationFoundation.ts" as const,
    foundationNamespace: IntegrationFoundationNamespace,
  }),
  sectionOrder: PLATFORM_SECTIONS,
  sectionCount: PLATFORM_SECTIONS.length,
  status: IntegrationRegistryStatus,
  nextPhase: "EIL-1:3 — Integration Model",
  foundationPlatform: IntegrationFoundationPlatform,
  metadataOnly: true as const,
  runtimeBehavior: false as const,
  runtimeEnforcement: false as const,
  runtimeIntegration: false as const,
  serviceDiscoveryExecution: false as const,
  routingEngine: false as const,
  orchestrationEngine: false as const,
  eventBus: false as const,
  networkingBehavior: false as const,
  persistenceBehavior: false as const,
  connectorBehavior: false as const,
  adapterBehavior: false as const,
  serviceBehavior: false as const,
  factoryBehavior: false as const,
  dependencyInjection: false as const,
  aiBehavior: false as const,
  llmBehavior: false as const,
  uiBehavior: false as const,
  stateMutation: false as const,
  importsLaterEilPhases: false as const,
  immutable: true as const,
  deterministic: true as const,
});
