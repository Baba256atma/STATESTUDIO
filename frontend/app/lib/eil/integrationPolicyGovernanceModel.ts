/**
 * EIL-5:3 — Integration Policy & Governance Model.
 *
 * Canonical immutable architectural model for the Integration Policy & Governance Platform.
 * Consumes only the EIL-5:2 Integration Policy & Governance Registry aggregate public surface.
 * Metadata-only. Runtime-free. Ready for Validation.
 *
 * Ownership: owned exclusively by EIL-5:3.
 *
 * Public exports (exactly 8):
 *   IntegrationPolicyGovernanceModelIdentity
 *   IntegrationPolicyGovernanceDomainModels
 *   IntegrationPolicyGovernanceRelationshipModels
 *   IntegrationPolicyGovernanceTopologyModels
 *   IntegrationPolicyGovernanceLifecycleModels
 *   IntegrationPolicyGovernanceModelCollections
 *   IntegrationPolicyGovernanceModelSummary
 *   IntegrationPolicyGovernanceModelPlatform
 */

import { IntegrationPolicyGovernanceDomainModels } from "./integrationPolicyGovernanceDomainModels.ts";
import { IntegrationPolicyGovernanceLifecycleModels } from "./integrationPolicyGovernanceLifecycleModels.ts";
import {
  IntegrationPolicyGovernanceModelDependencies,
  IntegrationPolicyGovernanceModelIdentity,
  IntegrationPolicyGovernanceModelReadinessValue,
  IntegrationPolicyGovernanceModelStatusValue,
} from "./integrationPolicyGovernanceModelIdentity.ts";
import {
  IntegrationPolicyGovernanceRelationshipModels,
  IntegrationPolicyGovernanceRelationshipTypes,
} from "./integrationPolicyGovernanceRelationshipModels.ts";
import { IntegrationPolicyGovernanceTopologyModels } from "./integrationPolicyGovernanceTopologyModels.ts";
import type {
  IntegrationPolicyGovernanceModelCollections as PolicyGovernanceModelCollectionsDescriptor,
  IntegrationPolicyGovernanceModelInventory,
  IntegrationPolicyGovernanceModelSummary as PolicyGovernanceModelSummaryDescriptor,
} from "./integrationPolicyGovernanceModelTypes.ts";
import {
  IntegrationPolicyGovernanceRegistryIdentity,
  IntegrationPolicyGovernanceRegistryPlatform,
  IntegrationPolicyGovernanceRegistrySummary,
} from "./integrationPolicyGovernanceRegistry.ts";

export { IntegrationPolicyGovernanceModelIdentity } from "./integrationPolicyGovernanceModelIdentity.ts";
export { IntegrationPolicyGovernanceDomainModels } from "./integrationPolicyGovernanceDomainModels.ts";
export { IntegrationPolicyGovernanceRelationshipModels } from "./integrationPolicyGovernanceRelationshipModels.ts";
export { IntegrationPolicyGovernanceTopologyModels } from "./integrationPolicyGovernanceTopologyModels.ts";
export { IntegrationPolicyGovernanceLifecycleModels } from "./integrationPolicyGovernanceLifecycleModels.ts";

/**
 * Canonical collections aggregate.
 * Counts are derived exclusively from model arrays.
 */
export const IntegrationPolicyGovernanceModelCollections: PolicyGovernanceModelCollectionsDescriptor =
  Object.freeze({
    collectionsId: "EIL-5:3/Collections",
    sourcePhase: "EIL-5:3" as const,
    domains: IntegrationPolicyGovernanceDomainModels,
    relationships: IntegrationPolicyGovernanceRelationshipModels,
    topologies: IntegrationPolicyGovernanceTopologyModels,
    lifecycles: IntegrationPolicyGovernanceLifecycleModels,
    domainModelCount: IntegrationPolicyGovernanceDomainModels.length,
    relationshipModelCount:
      IntegrationPolicyGovernanceRelationshipModels.length,
    topologyModelCount: IntegrationPolicyGovernanceTopologyModels.length,
    lifecycleModelCount: IntegrationPolicyGovernanceLifecycleModels.length,
    totalModelEntryCount:
      IntegrationPolicyGovernanceDomainModels.length +
      IntegrationPolicyGovernanceRelationshipModels.length +
      IntegrationPolicyGovernanceTopologyModels.length +
      IntegrationPolicyGovernanceLifecycleModels.length,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });

const inventory: IntegrationPolicyGovernanceModelInventory = Object.freeze({
  inventoryId: "EIL-5:3/Inventory",
  domainModelCount:
    IntegrationPolicyGovernanceModelCollections.domainModelCount,
  relationshipModelCount:
    IntegrationPolicyGovernanceModelCollections.relationshipModelCount,
  topologyModelCount:
    IntegrationPolicyGovernanceModelCollections.topologyModelCount,
  lifecycleModelCount:
    IntegrationPolicyGovernanceModelCollections.lifecycleModelCount,
  totalModelEntryCount:
    IntegrationPolicyGovernanceModelCollections.totalModelEntryCount,
  countsDerivedFromCollections: true as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

/**
 * Deterministic frozen Integration Policy & Governance Model summary.
 */
export const IntegrationPolicyGovernanceModelSummary: PolicyGovernanceModelSummaryDescriptor =
  Object.freeze({
    modelId: "EIL-5:3/IntegrationPolicyGovernanceModel",
    version: "1.0.0",
    name: "Integration Policy & Governance Model",
    namespace: "nexora.eil.integration-policy-governance.model",
    status: IntegrationPolicyGovernanceModelStatusValue,
    readiness: IntegrationPolicyGovernanceModelReadinessValue,
    registryId: "EIL-5:2/IntegrationPolicyGovernanceRegistry",
    domainModelCount:
      IntegrationPolicyGovernanceModelCollections.domainModelCount,
    relationshipModelCount:
      IntegrationPolicyGovernanceModelCollections.relationshipModelCount,
    topologyModelCount:
      IntegrationPolicyGovernanceModelCollections.topologyModelCount,
    lifecycleModelCount:
      IntegrationPolicyGovernanceModelCollections.lifecycleModelCount,
    totalModelEntryCount:
      IntegrationPolicyGovernanceModelCollections.totalModelEntryCount,
    nextPhase: "EIL-5:4 — Integration Policy & Governance Validation",
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });

const dependency = Object.freeze({
  dependencyId: "EIL-5:3/Dependency/EIL52Registry",
  phaseDependencies: IntegrationPolicyGovernanceModelDependencies,
  phaseDependencyCount: IntegrationPolicyGovernanceModelDependencies.length,
  directPreviousPhaseModule: "integrationPolicyGovernanceRegistry.ts" as const,
  registryOnly: true as const,
  registryId: IntegrationPolicyGovernanceRegistryIdentity.canonicalId,
  registryVersion: IntegrationPolicyGovernanceRegistryIdentity.version,
  registryNamespace: IntegrationPolicyGovernanceRegistryIdentity.namespace,
  registryPublicSurfaceOnly: true as const,
  foundationDirectImport: false as const,
  registryInternalImport: false as const,
  previousEilPlatformDependency: false as const,
  laterEil5PhaseImport: false as const,
  reconstructsRegistry: false as const,
  duplicatesRegistryValues: false as const,
  canonicalPath:
    "EIL-5:3 → EIL-5:2 IntegrationPolicyGovernanceRegistryPlatform (exclusive)",
  runtimeBehavior: "None" as const,
  metadataOnly: true as const,
});

const boundaryModel = Object.freeze({
  boundaryModelId: "EIL-5:3/Boundary/Model",
  owns: Object.freeze([
    "governance domain models",
    "governance relationship models",
    "governance topology models",
    "governance lifecycle models",
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
    "governance enforcement",
    "policy execution",
    "authorization execution",
    "compliance execution",
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
  compatibilityId: "EIL-5:3/Compatibility/Model",
  sourcePhase: "EIL-5:3" as const,
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
 * Canonical immutable Integration Policy & Governance Model platform.
 * Twelve ordered sections. Metadata only.
 */
export const IntegrationPolicyGovernanceModelPlatform = Object.freeze({
  identity: IntegrationPolicyGovernanceModelIdentity,
  dependency,
  registryIdentity: IntegrationPolicyGovernanceRegistryIdentity,
  domains: IntegrationPolicyGovernanceDomainModels,
  relationships: IntegrationPolicyGovernanceRelationshipModels,
  topologies: IntegrationPolicyGovernanceTopologyModels,
  lifecycles: IntegrationPolicyGovernanceLifecycleModels,
  collections: IntegrationPolicyGovernanceModelCollections,
  inventory,
  boundaries: boundaryModel,
  compatibility,
  readiness: IntegrationPolicyGovernanceModelReadinessValue,
  summary: IntegrationPolicyGovernanceModelSummary,
  relationshipTypes: IntegrationPolicyGovernanceRelationshipTypes,
  sources: Object.freeze({
    registryId: IntegrationPolicyGovernanceRegistryIdentity.canonicalId,
    registryEntryPoint: "integrationPolicyGovernanceRegistry.ts" as const,
    registryNamespace: IntegrationPolicyGovernanceRegistryIdentity.namespace,
    registrySummary: IntegrationPolicyGovernanceRegistrySummary,
  }),
  sectionOrder: PLATFORM_SECTIONS,
  sectionCount: PLATFORM_SECTIONS.length,
  status: IntegrationPolicyGovernanceModelStatusValue,
  nextPhase: "EIL-5:4 — Integration Policy & Governance Validation",
  registryPlatform: IntegrationPolicyGovernanceRegistryPlatform,
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
