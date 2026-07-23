/**
 * EIL-5:2 — Integration Policy & Governance Registry.
 *
 * Canonical immutable registry for Integration Policy & Governance Foundation vocabularies.
 * Consumes only the EIL-5:1 Integration Policy & Governance Foundation aggregate public surface.
 * Metadata-only. Runtime-free. Ready for Model.
 *
 * Ownership: owned exclusively by EIL-5:2.
 *
 * Public exports (exactly 8):
 *   IntegrationPolicyGovernanceRegistryIdentity
 *   IntegrationPolicyGovernanceCategoryRegistry
 *   IntegrationPolicyGovernanceContractRegistry
 *   IntegrationPolicyGovernanceCapabilityRegistry
 *   IntegrationPolicyGovernanceResponsibilityRegistry
 *   IntegrationPolicyGovernanceRegistryCollections
 *   IntegrationPolicyGovernanceRegistrySummary
 *   IntegrationPolicyGovernanceRegistryPlatform
 */

import { IntegrationPolicyGovernanceFoundationPlatform } from "./integrationPolicyGovernanceFoundation.ts";
import { IntegrationPolicyGovernanceCapabilityRegistry } from "./integrationPolicyGovernanceCapabilityRegistry.ts";
import { IntegrationPolicyGovernanceCategoryRegistry } from "./integrationPolicyGovernanceCategoryRegistry.ts";
import { IntegrationPolicyGovernanceContractRegistry } from "./integrationPolicyGovernanceContractRegistry.ts";
import {
  IntegrationPolicyGovernanceRegistryDependencies,
  IntegrationPolicyGovernanceRegistryIdentity,
  IntegrationPolicyGovernanceRegistryReadinessValue,
  IntegrationPolicyGovernanceRegistryStatusValue,
} from "./integrationPolicyGovernanceRegistryIdentity.ts";
import { IntegrationPolicyGovernanceResponsibilityRegistry } from "./integrationPolicyGovernanceResponsibilityRegistry.ts";
import type {
  IntegrationPolicyGovernanceRegistryCollections as PolicyGovernanceRegistryCollectionsDescriptor,
  IntegrationPolicyGovernanceRegistryInventory as PolicyGovernanceRegistryInventoryDescriptor,
  IntegrationPolicyGovernanceRegistryReference,
  IntegrationPolicyGovernanceRegistrySummary as PolicyGovernanceRegistrySummaryDescriptor,
} from "./integrationPolicyGovernanceRegistryTypes.ts";

export { IntegrationPolicyGovernanceRegistryIdentity } from "./integrationPolicyGovernanceRegistryIdentity.ts";
export { IntegrationPolicyGovernanceCategoryRegistry } from "./integrationPolicyGovernanceCategoryRegistry.ts";
export { IntegrationPolicyGovernanceContractRegistry } from "./integrationPolicyGovernanceContractRegistry.ts";
export { IntegrationPolicyGovernanceCapabilityRegistry } from "./integrationPolicyGovernanceCapabilityRegistry.ts";
export { IntegrationPolicyGovernanceResponsibilityRegistry } from "./integrationPolicyGovernanceResponsibilityRegistry.ts";

const foundation = IntegrationPolicyGovernanceFoundationPlatform;
const foundationId = foundation.identity.foundationId;
const foundationVersion = foundation.identity.foundationVersion;
const foundationNamespace = foundation.identity.foundationNamespace;

const lifecycleCoverage: readonly IntegrationPolicyGovernanceRegistryReference[] =
  Object.freeze(
    foundation.lifecycle.states.map((state) =>
      Object.freeze({
        referenceId: `EIL-5:2/Reference/Lifecycle/${state}`,
        sourcePhase:
          "EIL-5:1/IntegrationPolicyGovernanceFoundation" as const,
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
export const IntegrationPolicyGovernanceRegistryCollections: PolicyGovernanceRegistryCollectionsDescriptor =
  Object.freeze({
    collectionsId: "EIL-5:2/Collections",
    sourcePhase: "EIL-5:2" as const,
    categories: IntegrationPolicyGovernanceCategoryRegistry,
    contracts: IntegrationPolicyGovernanceContractRegistry,
    capabilities: IntegrationPolicyGovernanceCapabilityRegistry,
    responsibilities: IntegrationPolicyGovernanceResponsibilityRegistry,
    categoryCount: IntegrationPolicyGovernanceCategoryRegistry.length,
    contractCount: IntegrationPolicyGovernanceContractRegistry.length,
    capabilityCount: IntegrationPolicyGovernanceCapabilityRegistry.length,
    responsibilityCount:
      IntegrationPolicyGovernanceResponsibilityRegistry.length,
    lifecycleStateCount: foundation.inventory.lifecycleStateCount,
    totalRegistryEntryCount:
      IntegrationPolicyGovernanceCategoryRegistry.length +
      IntegrationPolicyGovernanceContractRegistry.length +
      IntegrationPolicyGovernanceCapabilityRegistry.length +
      IntegrationPolicyGovernanceResponsibilityRegistry.length,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });

const inventory: PolicyGovernanceRegistryInventoryDescriptor = Object.freeze({
  inventoryId: "EIL-5:2/Inventory",
  categoryCount: IntegrationPolicyGovernanceRegistryCollections.categoryCount,
  contractCount: IntegrationPolicyGovernanceRegistryCollections.contractCount,
  capabilityCount:
    IntegrationPolicyGovernanceRegistryCollections.capabilityCount,
  responsibilityCount:
    IntegrationPolicyGovernanceRegistryCollections.responsibilityCount,
  lifecycleStateCount:
    IntegrationPolicyGovernanceRegistryCollections.lifecycleStateCount,
  totalRegistryEntryCount:
    IntegrationPolicyGovernanceRegistryCollections.totalRegistryEntryCount,
  countsDerivedFromCollections: true as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

/**
 * Deterministic frozen Integration Policy & Governance Registry summary.
 * Inventory counts are derived from canonical collections only.
 */
export const IntegrationPolicyGovernanceRegistrySummary: PolicyGovernanceRegistrySummaryDescriptor =
  Object.freeze({
    registryId: "EIL-5:2/IntegrationPolicyGovernanceRegistry",
    version: "1.0.0",
    name: "Integration Policy & Governance Registry",
    namespace: "nexora.eil.integration-policy-governance.registry",
    status: IntegrationPolicyGovernanceRegistryStatusValue,
    readiness: IntegrationPolicyGovernanceRegistryReadinessValue,
    foundationId,
    categoryCount: IntegrationPolicyGovernanceRegistryCollections.categoryCount,
    contractCount: IntegrationPolicyGovernanceRegistryCollections.contractCount,
    capabilityCount:
      IntegrationPolicyGovernanceRegistryCollections.capabilityCount,
    responsibilityCount:
      IntegrationPolicyGovernanceRegistryCollections.responsibilityCount,
    lifecycleStateCount:
      IntegrationPolicyGovernanceRegistryCollections.lifecycleStateCount,
    totalRegistryEntryCount:
      IntegrationPolicyGovernanceRegistryCollections.totalRegistryEntryCount,
    nextPhase: "EIL-5:3 — Integration Policy & Governance Model",
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });

const dependency = Object.freeze({
  dependencyId: "EIL-5:2/Dependency/EIL51Foundation",
  phaseDependencies: IntegrationPolicyGovernanceRegistryDependencies,
  phaseDependencyCount: IntegrationPolicyGovernanceRegistryDependencies.length,
  directPreviousPhaseModule:
    "integrationPolicyGovernanceFoundation.ts" as const,
  foundationOnly: true as const,
  foundationId,
  foundationVersion,
  foundationNamespace,
  foundationPublicSurfaceOnly: true as const,
  foundationInternalImport: false as const,
  previousEilPlatformDependency: false as const,
  laterEil5PhaseImport: false as const,
  reconstructsFoundation: false as const,
  duplicatesFoundationInventory: false as const,
  canonicalPath:
    "EIL-5:2 → EIL-5:1 IntegrationPolicyGovernanceFoundationPlatform (exclusive)",
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
 * Canonical immutable Integration Policy & Governance Registry platform.
 * Twelve ordered sections. Metadata only.
 */
export const IntegrationPolicyGovernanceRegistryPlatform = Object.freeze({
  identity: IntegrationPolicyGovernanceRegistryIdentity,
  dependency,
  foundationIdentity: foundation.identity,
  categories: IntegrationPolicyGovernanceCategoryRegistry,
  contracts: IntegrationPolicyGovernanceContractRegistry,
  capabilities: IntegrationPolicyGovernanceCapabilityRegistry,
  responsibilities: IntegrationPolicyGovernanceResponsibilityRegistry,
  lifecycleCoverage,
  ownershipCoverage,
  collections: IntegrationPolicyGovernanceRegistryCollections,
  inventory,
  readiness: IntegrationPolicyGovernanceRegistryReadinessValue,
  summary: IntegrationPolicyGovernanceRegistrySummary,
  sources: Object.freeze({
    foundationId,
    foundationEntryPoint: "integrationPolicyGovernanceFoundation.ts" as const,
    foundationNamespace,
  }),
  sectionOrder: PLATFORM_SECTIONS,
  sectionCount: PLATFORM_SECTIONS.length,
  status: IntegrationPolicyGovernanceRegistryStatusValue,
  nextPhase: "EIL-5:3 — Integration Policy & Governance Model",
  foundationPlatform: foundation,
  metadataOnly: true as const,
  runtimeBehavior: false as const,
  runtimeEnforcement: false as const,
  governanceEngine: false as const,
  policyEnforcement: false as const,
  authorizationEngine: false as const,
  complianceEngine: false as const,
  orchestrationRuntime: false as const,
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
  importsLaterEil5Phases: false as const,
  immutable: true as const,
  deterministic: true as const,
});
