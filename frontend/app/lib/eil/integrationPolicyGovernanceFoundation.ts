/**
 * EIL-5:1 — Integration Policy & Governance Foundation.
 *
 * Immutable architectural foundation for the Integration Policy & Governance Platform.
 * Local metadata contracts only. Runtime-free. Ready for Registry.
 * Does not consume previous EIL platforms.
 *
 * Ownership: owned exclusively by EIL-5:1.
 *
 * Public exports (exactly 8):
 *   IntegrationPolicyGovernanceFoundationIdentity
 *   IntegrationPolicyGovernanceFoundationContracts
 *   IntegrationPolicyGovernanceFoundationCapabilities
 *   IntegrationPolicyGovernanceFoundationResponsibilities
 *   IntegrationPolicyGovernanceFoundationLifecycle
 *   IntegrationPolicyGovernanceFoundationCollections
 *   IntegrationPolicyGovernanceFoundationSummary
 *   IntegrationPolicyGovernanceFoundationPlatform
 */

import {
  IntegrationPolicyGovernanceFoundationCapabilities,
  IntegrationPolicyGovernanceFoundationCapabilityCatalog,
} from "./integrationPolicyGovernanceFoundationCapabilities.ts";
import {
  IntegrationPolicyGovernanceFoundationContractNames,
  IntegrationPolicyGovernanceFoundationContracts,
} from "./integrationPolicyGovernanceFoundationContracts.ts";
import {
  IntegrationPolicyGovernanceFoundationId,
  IntegrationPolicyGovernanceFoundationIdentity,
  IntegrationPolicyGovernanceFoundationName,
  IntegrationPolicyGovernanceFoundationNamespace,
  IntegrationPolicyGovernanceFoundationReadinessValue,
  IntegrationPolicyGovernanceFoundationStatusValue,
  IntegrationPolicyGovernanceFoundationVersion,
} from "./integrationPolicyGovernanceFoundationIdentity.ts";
import { IntegrationPolicyGovernanceFoundationLifecycle } from "./integrationPolicyGovernanceFoundationLifecycle.ts";
import {
  IntegrationPolicyGovernanceFoundationResponsibilities,
  IntegrationPolicyGovernanceFoundationResponsibilityCatalog,
} from "./integrationPolicyGovernanceFoundationResponsibilities.ts";
import type {
  IntegrationPolicyGovernanceCategory,
  IntegrationPolicyGovernanceInventory,
  PolicyGovernanceCategoryKey,
  PolicyGovernanceFoundationSummary,
} from "./integrationPolicyGovernanceFoundationTypes.ts";

export { IntegrationPolicyGovernanceFoundationIdentity };
export { IntegrationPolicyGovernanceFoundationContracts };
export { IntegrationPolicyGovernanceFoundationCapabilities };
export { IntegrationPolicyGovernanceFoundationResponsibilities };
export { IntegrationPolicyGovernanceFoundationLifecycle };

const category = (
  categoryKey: PolicyGovernanceCategoryKey,
  canonicalName: string,
  description: string,
  order: number,
): IntegrationPolicyGovernanceCategory =>
  Object.freeze({
    categoryId: `EIL-5:1/Category/${categoryKey}` as const,
    categoryKey,
    canonicalName,
    description,
    runtimeImplemented: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

/**
 * Exactly ten canonical governance categories.
 * Metadata only — no governance engine.
 */
const integrationPolicyGovernanceCategories: readonly IntegrationPolicyGovernanceCategory[] =
  Object.freeze([
    category(
      "IdentityPolicy",
      "Identity Policy",
      "Declarative category for identity-oriented governance policy definitions.",
      1,
    ),
    category(
      "AccessPolicy",
      "Access Policy",
      "Declarative category for access-oriented governance policy definitions.",
      2,
    ),
    category(
      "DependencyPolicy",
      "Dependency Policy",
      "Declarative category for dependency-oriented governance policy definitions.",
      3,
    ),
    category(
      "CompatibilityPolicy",
      "Compatibility Policy",
      "Declarative category for compatibility-oriented governance policy definitions.",
      4,
    ),
    category(
      "VersionPolicy",
      "Version Policy",
      "Declarative category for version-oriented governance policy definitions.",
      5,
    ),
    category(
      "LifecyclePolicy",
      "Lifecycle Policy",
      "Declarative category for lifecycle-oriented governance policy definitions.",
      6,
    ),
    category(
      "InventoryPolicy",
      "Inventory Policy",
      "Declarative category for inventory-oriented governance policy definitions.",
      7,
    ),
    category(
      "CompliancePolicy",
      "Compliance Policy",
      "Declarative category for compliance-oriented governance policy definitions.",
      8,
    ),
    category(
      "SecurityPolicy",
      "Security Policy",
      "Declarative category for security-oriented governance policy definitions.",
      9,
    ),
    category(
      "ExecutiveGovernancePolicy",
      "Executive Governance Policy",
      "Declarative category for executive-level governance policy definitions.",
      10,
    ),
  ]);

const POLICY_GOVERNANCE_FOUNDATION_OWNS = Object.freeze([
  "Governance metadata",
  "Governance terminology",
  "Policy contracts",
  "Governance capabilities",
  "Governance responsibilities",
  "Governance lifecycle",
] as const);

const POLICY_GOVERNANCE_FOUNDATION_DOES_NOT_OWN = Object.freeze([
  "Governance engine",
  "Policy enforcement",
  "Authorization engine",
  "Compliance engine",
  "Orchestration runtime",
  "Networking",
  "Persistence",
  "Services",
  "SDK runtime",
  "AI",
  "UI",
  "REST",
  "GraphQL",
  "WebSocket",
  "Queues",
  "Connectors",
  "Adapters",
  "Dependency injection",
  "Storage",
  "Cache",
  "Filesystem",
  "Logging",
  "Monitoring",
  "Telemetry",
  "LLM",
  "React",
  "Business logic",
  "State mutation",
  "Previous EIL platforms",
  "Later EIL-5 phases",
] as const);

const IntegrationPolicyGovernanceFoundationOwnership = Object.freeze({
  ownershipId: "EIL-5:1/IntegrationPolicyGovernanceFoundationOwnership",
  sourcePhase: "EIL-5:1" as const,
  owns: POLICY_GOVERNANCE_FOUNDATION_OWNS,
  doesNotOwn: POLICY_GOVERNANCE_FOUNDATION_DOES_NOT_OWN,
  ownsCount: POLICY_GOVERNANCE_FOUNDATION_OWNS.length,
  doesNotOwnCount: POLICY_GOVERNANCE_FOUNDATION_DOES_NOT_OWN.length,
  ownsGovernanceEngine: false as const,
  ownsNetworking: false as const,
  ownsBusinessLogic: false as const,
  consumesPreviousEilPlatforms: false as const,
  runtimeBehavior: "None" as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

const POLICY_GOVERNANCE_FOUNDATION_PROHIBITED_SURFACES = Object.freeze([
  "Governance engine",
  "Policy enforcement",
  "Authorization engine",
  "Compliance engine",
  "REST",
  "GraphQL",
  "WebSocket",
  "Queues",
  "Connectors",
  "Adapters",
  "Dependency injection",
  "Persistence",
  "Storage",
  "Cache",
  "Filesystem",
  "Networking",
  "Logging",
  "Monitoring",
  "Telemetry",
  "AI",
  "LLM",
  "React",
  "UI",
  "Mutable state",
  "Orchestration runtime",
  "Previous EIL platform imports",
  "Later EIL-5 phase imports",
] as const);

const IntegrationPolicyGovernanceFoundationBoundaries = Object.freeze({
  boundariesId: "EIL-5:1/IntegrationPolicyGovernanceFoundationBoundaries",
  sourcePhase: "EIL-5:1" as const,
  consumes: Object.freeze(["Approved NPA standards"] as const),
  provides: Object.freeze([
    "Integration Policy & Governance Foundation",
  ] as const),
  prohibitedSurfaces: POLICY_GOVERNANCE_FOUNDATION_PROHIBITED_SURFACES,
  prohibitedSurfaceCount:
    POLICY_GOVERNANCE_FOUNDATION_PROHIBITED_SURFACES.length,
  dependencyRules: Object.freeze([
    "ApprovedNpaStandardsOnly",
    "NoPreviousEilPlatformDependency",
    "NoLaterEil5PhaseImport",
    "NoGovernanceEngineImport",
    "NoNetworkingLibraryImport",
    "NoCircularGovernanceOwnership",
  ] as const),
  layerSeparation: Object.freeze({
    eil5OwnsGovernanceMetadataOnly: true as const,
    previousEilPlatformsUnconsumed: true as const,
    runtimeLayersDeferred: true as const,
  }),
  runtimeEnforcement: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

const IntegrationPolicyGovernanceFoundationCompatibility = Object.freeze({
  compatibilityId: "EIL-5:1/IntegrationPolicyGovernanceFoundationCompatibility",
  sourcePhase: "EIL-5:1" as const,
  declarations: Object.freeze([
    "EIL-5 does not consume previous EIL platforms",
    "Governance definitions are metadata-only at Foundation",
    "Compatibility is declarative, never runtime-validated here",
    "No illegal coupling across platform boundaries via governance",
    "Dependency direction is preserved and one-way at declaration time",
  ] as const),
  runtimeValidation: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

const IntegrationPolicyGovernanceFoundationTerminology = Object.freeze({
  terminologyId: "EIL-5:1/IntegrationPolicyGovernanceFoundationTerminology",
  sourcePhase: "EIL-5:1" as const,
  terms: Object.freeze([
    Object.freeze({
      term: "EIL-5",
      definition:
        "Integration Policy & Governance Platform — defines governance metadata architecture without governance engine runtime.",
    }),
    Object.freeze({
      term: "Integration Policy & Governance Foundation",
      definition:
        "Immutable metadata foundation establishing governance identities, categories, contracts, capabilities, and boundaries.",
    }),
    Object.freeze({
      term: "Governance Category",
      definition:
        "Declarative classification for a governance policy definition without runtime implementation.",
    }),
    Object.freeze({
      term: "Policy Contract",
      definition:
        "Declarative metadata contract describing governance architecture without policy enforcement.",
    }),
    Object.freeze({
      term: "Policy",
      definition:
        "Declarative governance rule set describing allowed architectural behavior as metadata only.",
    }),
    Object.freeze({
      term: "ReadyForRegistry",
      definition:
        "Foundation readiness indicating the phase may advance to EIL-5:2 Registry.",
    }),
  ]),
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

const dependency = Object.freeze({
  dependencyId: "EIL-5:1/Dependency/None",
  upstreamDependencies: Object.freeze([] as const),
  downstreamDependencies: Object.freeze([] as const),
  previousEilPlatformDependency: false as const,
  laterEil5PhaseImport: false as const,
  governanceEngineImport: false as const,
  networkingLibraryImport: false as const,
  circularDependency: false as const,
  prefersLocalContracts: true as const,
  approvedNpaStandardsOnly: true as const,
  canonicalPath: "EIL-5:1 → local policy governance foundation contracts only",
  runtimeBehavior: "None" as const,
  metadataOnly: true as const,
});

const PLATFORM_SECTIONS = Object.freeze([
  "identity",
  "dependency",
  "categories",
  "contracts",
  "capabilities",
  "responsibilities",
  "lifecycle",
  "ownership",
  "boundaries",
  "compatibility",
  "terminology",
  "readiness",
] as const);

const foundationApi = (
  exportName: string,
  kind: "Aggregate" | "IdentityConstant" | "MetadataConstant" | "Collection",
) =>
  Object.freeze({
    id: `EIL-5:1/PublicApi/${exportName}`,
    exportName,
    phase: "EIL-5:1" as const,
    section: "Foundation" as const,
    kind,
    version: IntegrationPolicyGovernanceFoundationVersion,
    status: IntegrationPolicyGovernanceFoundationStatusValue,
    stability: "Stable" as const,
    public: true as const,
    sourceReference: "integrationPolicyGovernanceFoundation.ts" as const,
  });

const IntegrationPolicyGovernanceFoundationApiRegistry = Object.freeze([
  foundationApi(
    "IntegrationPolicyGovernanceFoundationIdentity",
    "IdentityConstant",
  ),
  foundationApi(
    "IntegrationPolicyGovernanceFoundationContracts",
    "MetadataConstant",
  ),
  foundationApi(
    "IntegrationPolicyGovernanceFoundationCapabilities",
    "MetadataConstant",
  ),
  foundationApi(
    "IntegrationPolicyGovernanceFoundationResponsibilities",
    "MetadataConstant",
  ),
  foundationApi(
    "IntegrationPolicyGovernanceFoundationLifecycle",
    "MetadataConstant",
  ),
  foundationApi(
    "IntegrationPolicyGovernanceFoundationCollections",
    "Collection",
  ),
  foundationApi("IntegrationPolicyGovernanceFoundationSummary", "Aggregate"),
  foundationApi("IntegrationPolicyGovernanceFoundationPlatform", "Aggregate"),
]);

const inventory: IntegrationPolicyGovernanceInventory = Object.freeze({
  inventoryId: "EIL-5:1/Inventory",
  governanceCategoryCount: integrationPolicyGovernanceCategories.length,
  contractCount: IntegrationPolicyGovernanceFoundationContracts.length,
  capabilityCount: IntegrationPolicyGovernanceFoundationCapabilities.length,
  responsibilityCount:
    IntegrationPolicyGovernanceFoundationResponsibilities.length,
  lifecycleStateCount:
    IntegrationPolicyGovernanceFoundationLifecycle.stateCount,
  totalFoundationEntryCount:
    integrationPolicyGovernanceCategories.length +
    IntegrationPolicyGovernanceFoundationContracts.length +
    IntegrationPolicyGovernanceFoundationCapabilities.length +
    IntegrationPolicyGovernanceFoundationResponsibilities.length +
    IntegrationPolicyGovernanceFoundationLifecycle.stateCount,
  countsDerivedFromCollections: true as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

/**
 * Canonical immutable collections for Integration Policy & Governance Foundation.
 * Inventory counts are dynamically derived from collection lengths.
 */
export const IntegrationPolicyGovernanceFoundationCollections = Object.freeze({
  collectionsId: "EIL-5:1/Collections",
  sourcePhase: "EIL-5:1" as const,
  categories: integrationPolicyGovernanceCategories,
  contracts: IntegrationPolicyGovernanceFoundationContracts,
  capabilities: IntegrationPolicyGovernanceFoundationCapabilities,
  responsibilities: IntegrationPolicyGovernanceFoundationResponsibilities,
  lifecycleStates: IntegrationPolicyGovernanceFoundationLifecycle.states,
  governanceCategoryCount: integrationPolicyGovernanceCategories.length,
  contractCount: IntegrationPolicyGovernanceFoundationContracts.length,
  capabilityCount: IntegrationPolicyGovernanceFoundationCapabilities.length,
  responsibilityCount:
    IntegrationPolicyGovernanceFoundationResponsibilities.length,
  lifecycleStateCount:
    IntegrationPolicyGovernanceFoundationLifecycle.stateCount,
  countsDerivedFromCollections: true as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

/**
 * Canonical immutable Integration Policy & Governance Foundation summary.
 * Inventory values are dynamically derived from canonical collections.
 */
export const IntegrationPolicyGovernanceFoundationSummary: PolicyGovernanceFoundationSummary =
  Object.freeze({
    foundationId: IntegrationPolicyGovernanceFoundationId,
    version: IntegrationPolicyGovernanceFoundationVersion,
    name: IntegrationPolicyGovernanceFoundationName,
    namespace: IntegrationPolicyGovernanceFoundationNamespace,
    status: IntegrationPolicyGovernanceFoundationStatusValue,
    readiness: IntegrationPolicyGovernanceFoundationReadinessValue,
    governanceCategoryCount: integrationPolicyGovernanceCategories.length,
    contractCount: IntegrationPolicyGovernanceFoundationContracts.length,
    capabilityCount: IntegrationPolicyGovernanceFoundationCapabilities.length,
    responsibilityCount:
      IntegrationPolicyGovernanceFoundationResponsibilities.length,
    lifecycleStateCount:
      IntegrationPolicyGovernanceFoundationLifecycle.stateCount,
    ownershipCount: IntegrationPolicyGovernanceFoundationOwnership.ownsCount,
    nonOwnershipCount:
      IntegrationPolicyGovernanceFoundationOwnership.doesNotOwnCount,
    terminologyCount:
      IntegrationPolicyGovernanceFoundationTerminology.terms.length,
    sectionCount: PLATFORM_SECTIONS.length,
    nextPhase: "EIL-5:2 — Integration Policy & Governance Registry",
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });

/**
 * Canonical immutable Integration Policy & Governance Foundation platform.
 * Twelve ordered sections. Metadata only.
 */
export const IntegrationPolicyGovernanceFoundationPlatform = Object.freeze({
  identity: IntegrationPolicyGovernanceFoundationIdentity,
  dependency,
  categories: integrationPolicyGovernanceCategories,
  contracts: IntegrationPolicyGovernanceFoundationContracts,
  capabilities: IntegrationPolicyGovernanceFoundationCapabilityCatalog,
  responsibilities: IntegrationPolicyGovernanceFoundationResponsibilityCatalog,
  lifecycle: IntegrationPolicyGovernanceFoundationLifecycle,
  ownership: IntegrationPolicyGovernanceFoundationOwnership,
  boundaries: IntegrationPolicyGovernanceFoundationBoundaries,
  compatibility: IntegrationPolicyGovernanceFoundationCompatibility,
  terminology: IntegrationPolicyGovernanceFoundationTerminology,
  readiness: IntegrationPolicyGovernanceFoundationReadinessValue,
  contractNames: IntegrationPolicyGovernanceFoundationContractNames,
  capabilityDeclarations: IntegrationPolicyGovernanceFoundationCapabilities,
  responsibilityDeclarations:
    IntegrationPolicyGovernanceFoundationResponsibilities,
  collections: IntegrationPolicyGovernanceFoundationCollections,
  inventory,
  apiRegistry: IntegrationPolicyGovernanceFoundationApiRegistry,
  sectionOrder: PLATFORM_SECTIONS,
  sectionCount: PLATFORM_SECTIONS.length,
  status: IntegrationPolicyGovernanceFoundationStatusValue,
  nextPhase: "EIL-5:2 — Integration Policy & Governance Registry",
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
  consumesPreviousEilPlatforms: false as const,
  importsLaterEil5Phases: false as const,
  immutable: true as const,
  deterministic: true as const,
});
