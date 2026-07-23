/**
 * EIL-7:1 — Integration Governance Foundation.
 *
 * Immutable architectural foundation for the Integration Governance Platform.
 * Local metadata contracts only. Runtime-free. Ready for Registry.
 * Does not consume previous EIL platforms or later EIL-7 phases.
 *
 * Ownership: owned exclusively by EIL-7:1.
 *
 * Aggregate surfaces (consumed via index.ts):
 *   IntegrationGovernanceFoundationIdentity
 *   IntegrationGovernanceFoundationCollections
 *   IntegrationGovernanceFoundationSummary
 *   IntegrationGovernanceFoundationPlatform
 */

import {
  IntegrationGovernanceFoundationCapabilities,
  IntegrationGovernanceFoundationCapabilityCatalog,
} from "./integrationGovernanceCapabilities.ts";
import { IntegrationGovernanceComplianceCategories } from "./integrationGovernanceComplianceCategories.ts";
import {
  IntegrationGovernanceFoundationContractNames,
  IntegrationGovernanceFoundationContracts,
} from "./integrationGovernanceContracts.ts";
import { IntegrationGovernanceFoundationDomains } from "./integrationGovernanceDomains.ts";
import { IntegrationGovernanceFoundationLifecycle } from "./integrationGovernanceLifecycle.ts";
import { IntegrationGovernancePolicyCategories } from "./integrationGovernancePolicyCategories.ts";

/** Canonical phase ID. */
export const IntegrationGovernanceFoundationPhaseId = "EIL-7:1" as const;

/** Canonical foundation ID. */
export const IntegrationGovernanceFoundationId =
  "EIL-7:1/IntegrationGovernanceFoundation" as const;

/** Human-readable foundation name. */
export const IntegrationGovernanceFoundationName =
  "Integration Governance Foundation" as const;

/** Semantic version. */
export const IntegrationGovernanceFoundationVersion = "1.0.0" as const;

/** Canonical namespace. */
export const IntegrationGovernanceFoundationNamespace =
  "nexora.eil.integration-governance.foundation" as const;

/** Layer. */
export const IntegrationGovernanceFoundationLayer = "EIL" as const;

/** Platform. */
export const IntegrationGovernanceFoundationPlatformId = "EIL-7" as const;

/** Phase type. */
export const IntegrationGovernanceFoundationPhaseType = "Foundation" as const;

/** Foundation status. */
export const IntegrationGovernanceFoundationStatusValue = "Foundation" as const;

/** Immediate next-phase readiness. */
export const IntegrationGovernanceFoundationReadinessValue =
  "ReadyForRegistry" as const;

/**
 * Immutable identity object for EIL-7:1 Integration Governance Foundation.
 */
export const IntegrationGovernanceFoundationIdentity = Object.freeze({
  phaseId: IntegrationGovernanceFoundationPhaseId,
  foundationId: IntegrationGovernanceFoundationId,
  canonicalId: IntegrationGovernanceFoundationId,
  name: IntegrationGovernanceFoundationName,
  version: IntegrationGovernanceFoundationVersion,
  namespace: IntegrationGovernanceFoundationNamespace,
  foundationNamespace: IntegrationGovernanceFoundationNamespace,
  foundationVersion: IntegrationGovernanceFoundationVersion,
  layer: IntegrationGovernanceFoundationLayer,
  platform: IntegrationGovernanceFoundationPlatformId,
  phaseType: IntegrationGovernanceFoundationPhaseType,
  status: IntegrationGovernanceFoundationStatusValue,
  readiness: IntegrationGovernanceFoundationReadinessValue,
  description:
    "Canonical immutable architectural foundation for Integration Governance metadata across policies, compliance, versioning, compatibility, standards, approvals, audit, and risk.",
  metadataOnly: true as const,
  immutable: true as const,
});

const dependency = Object.freeze({
  dependencyId: "EIL-7:1/Dependency/None",
  phaseDependencyCount: 0,
  laterEil7PhaseImport: false as const,
  previousEilPlatformDependency: false as const,
  eilSharedStandardsOnly: true as const,
  canonicalPath: "EIL-7:1 IntegrationGovernanceFoundation (root)",
  runtimeBehavior: "None" as const,
  metadataOnly: true as const,
});

const owns = Object.freeze([
  "Integration Governance identity",
  "architectural contracts",
  "capability declarations",
  "governance domains",
  "lifecycle definitions",
  "policy categories",
  "compliance categories",
  "architectural boundaries",
] as const);

const doesNotOwn = Object.freeze([
  "governance engine",
  "policy engine",
  "compliance engine",
  "approval workflow",
  "audit execution",
  "risk engine",
  "version manager",
  "compatibility resolver",
  "networking",
  "persistence",
  "execution logic",
] as const);

const ownership = Object.freeze({
  ownershipId: "EIL-7:1/Ownership",
  owns,
  doesNotOwn,
  ownsCount: owns.length,
  doesNotOwnCount: doesNotOwn.length,
  metadataOnly: true as const,
  immutable: true as const,
});

const boundaries = Object.freeze({
  boundariesId: "EIL-7:1/Boundaries",
  architecturalBoundaries: Object.freeze([
    "Foundation owns governance metadata only",
    "No governance, policy, or compliance engines",
    "No approval workflows or audit execution",
    "No later EIL-7 phase imports",
    "No previous EIL platform dependency",
    "Platform-independent metadata declarations",
  ]),
  metadataOnly: true as const,
  immutable: true as const,
});

const compatibility = Object.freeze({
  compatibilityId: "EIL-7:1/Compatibility",
  scopes: Object.freeze([
    "Namespace",
    "Version",
    "Architecture",
    "MetadataOnly",
  ]),
  runtimeValidated: false as const,
  metadataOnly: true as const,
  immutable: true as const,
});

const terminology = Object.freeze({
  terminologyId: "EIL-7:1/Terminology",
  terms: Object.freeze([
    "Governance",
    "Policy",
    "Compliance",
    "Versioning",
    "Compatibility",
    "Standard",
    "Approval",
    "Audit",
    "Risk",
    "Lifecycle",
  ]),
  metadataOnly: true as const,
  immutable: true as const,
});

const inventory = Object.freeze({
  inventoryId: "EIL-7:1/Inventory",
  domainCount: IntegrationGovernanceFoundationDomains.length,
  contractCount: IntegrationGovernanceFoundationContracts.length,
  capabilityCount: IntegrationGovernanceFoundationCapabilities.length,
  lifecycleStateCount: IntegrationGovernanceFoundationLifecycle.stateCount,
  policyCategoryCount: IntegrationGovernancePolicyCategories.length,
  complianceCategoryCount: IntegrationGovernanceComplianceCategories.length,
  totalFoundationEntryCount:
    IntegrationGovernanceFoundationDomains.length +
    IntegrationGovernanceFoundationContracts.length +
    IntegrationGovernanceFoundationCapabilities.length +
    IntegrationGovernanceFoundationLifecycle.stateCount +
    IntegrationGovernancePolicyCategories.length +
    IntegrationGovernanceComplianceCategories.length,
  countsDerivedFromCollections: true as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

/**
 * Canonical immutable collections for Integration Governance Foundation.
 * Inventory counts are dynamically derived from collection lengths.
 */
export const IntegrationGovernanceFoundationCollections = Object.freeze({
  collectionsId: "EIL-7:1/Collections",
  sourcePhase: "EIL-7:1" as const,
  domains: IntegrationGovernanceFoundationDomains,
  contracts: IntegrationGovernanceFoundationContracts,
  capabilities: IntegrationGovernanceFoundationCapabilities,
  lifecycleStates: IntegrationGovernanceFoundationLifecycle.states,
  policyCategories: IntegrationGovernancePolicyCategories,
  complianceCategories: IntegrationGovernanceComplianceCategories,
  domainCount: IntegrationGovernanceFoundationDomains.length,
  contractCount: IntegrationGovernanceFoundationContracts.length,
  capabilityCount: IntegrationGovernanceFoundationCapabilities.length,
  lifecycleStateCount: IntegrationGovernanceFoundationLifecycle.stateCount,
  policyCategoryCount: IntegrationGovernancePolicyCategories.length,
  complianceCategoryCount: IntegrationGovernanceComplianceCategories.length,
  countsDerivedFromCollections: true as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

/**
 * Canonical immutable Integration Governance Foundation summary.
 */
export const IntegrationGovernanceFoundationSummary = Object.freeze({
  foundationId: IntegrationGovernanceFoundationId,
  version: IntegrationGovernanceFoundationVersion,
  name: IntegrationGovernanceFoundationName,
  namespace: IntegrationGovernanceFoundationNamespace,
  status: IntegrationGovernanceFoundationStatusValue,
  readiness: IntegrationGovernanceFoundationReadinessValue,
  domainCount: IntegrationGovernanceFoundationDomains.length,
  contractCount: IntegrationGovernanceFoundationContracts.length,
  capabilityCount: IntegrationGovernanceFoundationCapabilities.length,
  lifecycleStateCount: IntegrationGovernanceFoundationLifecycle.stateCount,
  policyCategoryCount: IntegrationGovernancePolicyCategories.length,
  complianceCategoryCount: IntegrationGovernanceComplianceCategories.length,
  totalFoundationEntryCount: inventory.totalFoundationEntryCount,
  nextPhase: "EIL-7:2 — Integration Governance Registry",
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

const PLATFORM_SECTIONS = Object.freeze([
  "identity",
  "dependency",
  "domains",
  "contracts",
  "capabilities",
  "lifecycle",
  "policyCategories",
  "complianceCategories",
  "ownership",
  "boundaries",
  "collections",
  "summary",
] as const);

const foundationApi = (
  exportName: string,
  kind: "Aggregate" | "IdentityConstant" | "MetadataConstant" | "Collection",
) =>
  Object.freeze({
    id: `EIL-7:1/PublicApi/${exportName}`,
    exportName,
    phase: "EIL-7:1" as const,
    section: "Foundation" as const,
    kind,
    version: IntegrationGovernanceFoundationVersion,
    status: IntegrationGovernanceFoundationStatusValue,
    stability: "Stable" as const,
    public: true as const,
    sourceReference: "integrationGovernanceFoundation.ts" as const,
  });

const IntegrationGovernanceFoundationApiRegistry = Object.freeze([
  foundationApi("IntegrationGovernanceFoundationIdentity", "IdentityConstant"),
  foundationApi("IntegrationGovernanceFoundationContracts", "MetadataConstant"),
  foundationApi(
    "IntegrationGovernanceFoundationCapabilities",
    "MetadataConstant",
  ),
  foundationApi("IntegrationGovernanceFoundationDomains", "MetadataConstant"),
  foundationApi("IntegrationGovernanceFoundationLifecycle", "MetadataConstant"),
  foundationApi("IntegrationGovernancePolicyCategories", "MetadataConstant"),
  foundationApi(
    "IntegrationGovernanceComplianceCategories",
    "MetadataConstant",
  ),
  foundationApi("IntegrationGovernanceFoundationPlatform", "Aggregate"),
]);

/**
 * Canonical immutable Integration Governance Foundation platform.
 * Twelve ordered sections. Metadata only.
 */
export const IntegrationGovernanceFoundationPlatform = Object.freeze({
  identity: IntegrationGovernanceFoundationIdentity,
  dependency,
  domains: IntegrationGovernanceFoundationDomains,
  contracts: IntegrationGovernanceFoundationContracts,
  capabilities: IntegrationGovernanceFoundationCapabilityCatalog,
  lifecycle: IntegrationGovernanceFoundationLifecycle,
  policyCategories: IntegrationGovernancePolicyCategories,
  complianceCategories: IntegrationGovernanceComplianceCategories,
  ownership,
  boundaries,
  compatibility,
  terminology,
  readiness: IntegrationGovernanceFoundationReadinessValue,
  contractNames: IntegrationGovernanceFoundationContractNames,
  capabilityDeclarations: IntegrationGovernanceFoundationCapabilities,
  collections: IntegrationGovernanceFoundationCollections,
  inventory,
  apiRegistry: IntegrationGovernanceFoundationApiRegistry,
  sectionOrder: PLATFORM_SECTIONS,
  sectionCount: PLATFORM_SECTIONS.length,
  status: IntegrationGovernanceFoundationStatusValue,
  nextPhase: "EIL-7:2 — Integration Governance Registry",
  metadataOnly: true as const,
  runtimeBehavior: false as const,
  runtimeEnforcement: false as const,
  governanceEngine: false as const,
  policyEngine: false as const,
  complianceEngine: false as const,
  approvalWorkflow: false as const,
  auditExecution: false as const,
  riskEngine: false as const,
  versionManager: false as const,
  compatibilityResolver: false as const,
  securityEnforcement: false as const,
  dashboard: false as const,
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
  consumesPreviousEilPlatforms: false as const,
  importsLaterEil7Phases: false as const,
  immutable: true as const,
  deterministic: true as const,
});
