/**
 * EIL-4:1 — Integration Orchestration Foundation.
 *
 * Immutable architectural foundation for the Integration Orchestration Platform.
 * Local metadata contracts only. Runtime-free. Ready for Registry.
 * Does not consume previous EIL platforms.
 *
 * Ownership: owned exclusively by EIL-4:1.
 *
 * Public exports (exactly 8):
 *   IntegrationOrchestrationFoundationIdentity
 *   IntegrationOrchestrationFoundationContracts
 *   IntegrationOrchestrationFoundationCapabilities
 *   IntegrationOrchestrationFoundationResponsibilities
 *   IntegrationOrchestrationFoundationLifecycle
 *   IntegrationOrchestrationFoundationCollections
 *   IntegrationOrchestrationFoundationSummary
 *   IntegrationOrchestrationFoundationPlatform
 */

import {
  IntegrationOrchestrationFoundationCapabilities,
  IntegrationOrchestrationFoundationCapabilityCatalog,
} from "./integrationOrchestrationFoundationCapabilities.ts";
import {
  IntegrationOrchestrationFoundationContractNames,
  IntegrationOrchestrationFoundationContracts,
} from "./integrationOrchestrationFoundationContracts.ts";
import {
  IntegrationOrchestrationFoundationId,
  IntegrationOrchestrationFoundationIdentity,
  IntegrationOrchestrationFoundationName,
  IntegrationOrchestrationFoundationNamespace,
  IntegrationOrchestrationFoundationReadinessValue,
  IntegrationOrchestrationFoundationStatusValue,
  IntegrationOrchestrationFoundationVersion,
} from "./integrationOrchestrationFoundationIdentity.ts";
import { IntegrationOrchestrationFoundationLifecycle } from "./integrationOrchestrationFoundationLifecycle.ts";
import {
  IntegrationOrchestrationFoundationResponsibilities,
  IntegrationOrchestrationFoundationResponsibilityCatalog,
} from "./integrationOrchestrationFoundationResponsibilities.ts";
import type {
  OrchestrationCategory,
  OrchestrationCategoryKey,
  OrchestrationFoundationInventory,
  OrchestrationFoundationSummary,
} from "./integrationOrchestrationFoundationTypes.ts";

export { IntegrationOrchestrationFoundationIdentity };
export { IntegrationOrchestrationFoundationContracts };
export { IntegrationOrchestrationFoundationCapabilities };
export { IntegrationOrchestrationFoundationResponsibilities };
export { IntegrationOrchestrationFoundationLifecycle };

const category = (
  categoryKey: OrchestrationCategoryKey,
  canonicalName: string,
  description: string,
  order: number,
): OrchestrationCategory =>
  Object.freeze({
    categoryId: `EIL-4:1/Category/${categoryKey}` as const,
    categoryKey,
    canonicalName,
    description,
    runtimeImplemented: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

/**
 * Exactly ten canonical orchestration categories.
 * Metadata only — no orchestration engine.
 */
const integrationOrchestrationCategories: readonly OrchestrationCategory[] =
  Object.freeze([
    category(
      "SequentialFlow",
      "Sequential Flow",
      "Declarative category for sequential multi-step orchestration flow definitions.",
      1,
    ),
    category(
      "ParallelFlow",
      "Parallel Flow",
      "Declarative category for parallel fan-out orchestration flow definitions.",
      2,
    ),
    category(
      "ConditionalFlow",
      "Conditional Flow",
      "Declarative category for condition-oriented orchestration flow definitions.",
      3,
    ),
    category(
      "EventDrivenFlow",
      "Event-driven Flow",
      "Declarative category for event-oriented orchestration flow definitions.",
      4,
    ),
    category(
      "ScheduledFlow",
      "Scheduled Flow",
      "Declarative category for schedule-oriented orchestration flow definitions.",
      5,
    ),
    category(
      "ApprovalFlow",
      "Approval Flow",
      "Declarative category for approval-oriented orchestration flow definitions.",
      6,
    ),
    category(
      "RecoveryFlow",
      "Recovery Flow",
      "Declarative category for recovery-oriented orchestration flow definitions.",
      7,
    ),
    category(
      "CompensationFlow",
      "Compensation Flow",
      "Declarative category for compensation-oriented orchestration flow definitions.",
      8,
    ),
    category(
      "CompositeFlow",
      "Composite Flow",
      "Declarative category for composite multi-flow orchestration definitions.",
      9,
    ),
    category(
      "ExecutiveFlow",
      "Executive Flow",
      "Declarative category for executive-level orchestration flow definitions.",
      10,
    ),
  ]);

const ORCHESTRATION_FOUNDATION_OWNS = Object.freeze([
  "Orchestration metadata",
  "Orchestration terminology",
  "Orchestration contracts",
  "Orchestration capabilities",
  "Orchestration responsibilities",
  "Orchestration lifecycle",
] as const);

const ORCHESTRATION_FOUNDATION_DOES_NOT_OWN = Object.freeze([
  "Orchestration engine",
  "Workflow execution",
  "Routing execution",
  "Scheduling",
  "Connector runtime",
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
  "Later EIL-4 phases",
] as const);

const IntegrationOrchestrationFoundationOwnership = Object.freeze({
  ownershipId: "EIL-4:1/IntegrationOrchestrationFoundationOwnership",
  sourcePhase: "EIL-4:1" as const,
  owns: ORCHESTRATION_FOUNDATION_OWNS,
  doesNotOwn: ORCHESTRATION_FOUNDATION_DOES_NOT_OWN,
  ownsCount: ORCHESTRATION_FOUNDATION_OWNS.length,
  doesNotOwnCount: ORCHESTRATION_FOUNDATION_DOES_NOT_OWN.length,
  ownsOrchestrationEngine: false as const,
  ownsNetworking: false as const,
  ownsBusinessLogic: false as const,
  consumesPreviousEilPlatforms: false as const,
  runtimeBehavior: "None" as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

const ORCHESTRATION_FOUNDATION_PROHIBITED_SURFACES = Object.freeze([
  "Orchestration engine",
  "Workflow execution",
  "Routing engine",
  "Scheduler",
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
  "Connector execution",
  "Previous EIL platform imports",
  "Later EIL-4 phase imports",
] as const);

const IntegrationOrchestrationFoundationBoundaries = Object.freeze({
  boundariesId: "EIL-4:1/IntegrationOrchestrationFoundationBoundaries",
  sourcePhase: "EIL-4:1" as const,
  consumes: Object.freeze(["Approved NPA standards"] as const),
  provides: Object.freeze(["Integration Orchestration Foundation"] as const),
  prohibitedSurfaces: ORCHESTRATION_FOUNDATION_PROHIBITED_SURFACES,
  prohibitedSurfaceCount: ORCHESTRATION_FOUNDATION_PROHIBITED_SURFACES.length,
  dependencyRules: Object.freeze([
    "ApprovedNpaStandardsOnly",
    "NoPreviousEilPlatformDependency",
    "NoLaterEil4PhaseImport",
    "NoOrchestrationEngineImport",
    "NoNetworkingLibraryImport",
    "NoCircularOrchestrationOwnership",
  ] as const),
  layerSeparation: Object.freeze({
    eil4OwnsOrchestrationMetadataOnly: true as const,
    previousEilPlatformsUnconsumed: true as const,
    runtimeLayersDeferred: true as const,
  }),
  runtimeEnforcement: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

const IntegrationOrchestrationFoundationCompatibility = Object.freeze({
  compatibilityId: "EIL-4:1/IntegrationOrchestrationFoundationCompatibility",
  sourcePhase: "EIL-4:1" as const,
  declarations: Object.freeze([
    "EIL-4 does not consume previous EIL platforms",
    "Orchestration definitions are metadata-only at Foundation",
    "Compatibility is declarative, never runtime-validated here",
    "No illegal coupling across platform boundaries via orchestration",
    "Dependency direction is preserved and one-way at declaration time",
  ] as const),
  runtimeValidation: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

const IntegrationOrchestrationFoundationTerminology = Object.freeze({
  terminologyId: "EIL-4:1/IntegrationOrchestrationFoundationTerminology",
  sourcePhase: "EIL-4:1" as const,
  terms: Object.freeze([
    Object.freeze({
      term: "EIL-4",
      definition:
        "Integration Orchestration Platform — defines orchestration metadata architecture without orchestration engine runtime.",
    }),
    Object.freeze({
      term: "Integration Orchestration Foundation",
      definition:
        "Immutable metadata foundation establishing orchestration identities, categories, contracts, capabilities, and boundaries.",
    }),
    Object.freeze({
      term: "Orchestration Category",
      definition:
        "Declarative classification for an orchestration flow definition without runtime implementation.",
    }),
    Object.freeze({
      term: "Orchestration Contract",
      definition:
        "Declarative metadata contract describing orchestration architecture without workflow execution.",
    }),
    Object.freeze({
      term: "Flow",
      definition:
        "Declarative coordination of routes, connectors, and execution stages as a single orchestration definition.",
    }),
    Object.freeze({
      term: "ReadyForRegistry",
      definition:
        "Foundation readiness indicating the phase may advance to EIL-4:2 Registry.",
    }),
  ]),
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

const dependency = Object.freeze({
  dependencyId: "EIL-4:1/Dependency/None",
  upstreamDependencies: Object.freeze([] as const),
  downstreamDependencies: Object.freeze([] as const),
  previousEilPlatformDependency: false as const,
  laterEil4PhaseImport: false as const,
  orchestrationEngineImport: false as const,
  networkingLibraryImport: false as const,
  circularDependency: false as const,
  prefersLocalContracts: true as const,
  approvedNpaStandardsOnly: true as const,
  canonicalPath: "EIL-4:1 → local orchestration foundation contracts only",
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
    id: `EIL-4:1/PublicApi/${exportName}`,
    exportName,
    phase: "EIL-4:1" as const,
    section: "Foundation" as const,
    kind,
    version: IntegrationOrchestrationFoundationVersion,
    status: IntegrationOrchestrationFoundationStatusValue,
    stability: "Stable" as const,
    public: true as const,
    sourceReference: "integrationOrchestrationFoundation.ts" as const,
  });

const IntegrationOrchestrationFoundationApiRegistry = Object.freeze([
  foundationApi(
    "IntegrationOrchestrationFoundationIdentity",
    "IdentityConstant",
  ),
  foundationApi(
    "IntegrationOrchestrationFoundationContracts",
    "MetadataConstant",
  ),
  foundationApi(
    "IntegrationOrchestrationFoundationCapabilities",
    "MetadataConstant",
  ),
  foundationApi(
    "IntegrationOrchestrationFoundationResponsibilities",
    "MetadataConstant",
  ),
  foundationApi(
    "IntegrationOrchestrationFoundationLifecycle",
    "MetadataConstant",
  ),
  foundationApi("IntegrationOrchestrationFoundationCollections", "Collection"),
  foundationApi("IntegrationOrchestrationFoundationSummary", "Aggregate"),
  foundationApi("IntegrationOrchestrationFoundationPlatform", "Aggregate"),
]);

const inventory: OrchestrationFoundationInventory = Object.freeze({
  inventoryId: "EIL-4:1/Inventory",
  orchestrationCategoryCount: integrationOrchestrationCategories.length,
  contractCount: IntegrationOrchestrationFoundationContracts.length,
  capabilityCount: IntegrationOrchestrationFoundationCapabilities.length,
  responsibilityCount:
    IntegrationOrchestrationFoundationResponsibilities.length,
  lifecycleStateCount: IntegrationOrchestrationFoundationLifecycle.stateCount,
  totalFoundationEntryCount:
    integrationOrchestrationCategories.length +
    IntegrationOrchestrationFoundationContracts.length +
    IntegrationOrchestrationFoundationCapabilities.length +
    IntegrationOrchestrationFoundationResponsibilities.length +
    IntegrationOrchestrationFoundationLifecycle.stateCount,
  countsDerivedFromCollections: true as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

/**
 * Canonical immutable collections for Integration Orchestration Foundation.
 * Inventory counts are dynamically derived from collection lengths.
 */
export const IntegrationOrchestrationFoundationCollections = Object.freeze({
  collectionsId: "EIL-4:1/Collections",
  sourcePhase: "EIL-4:1" as const,
  categories: integrationOrchestrationCategories,
  contracts: IntegrationOrchestrationFoundationContracts,
  capabilities: IntegrationOrchestrationFoundationCapabilities,
  responsibilities: IntegrationOrchestrationFoundationResponsibilities,
  lifecycleStates: IntegrationOrchestrationFoundationLifecycle.states,
  orchestrationCategoryCount: integrationOrchestrationCategories.length,
  contractCount: IntegrationOrchestrationFoundationContracts.length,
  capabilityCount: IntegrationOrchestrationFoundationCapabilities.length,
  responsibilityCount:
    IntegrationOrchestrationFoundationResponsibilities.length,
  lifecycleStateCount: IntegrationOrchestrationFoundationLifecycle.stateCount,
  countsDerivedFromCollections: true as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

/**
 * Canonical immutable Integration Orchestration Foundation summary.
 * Inventory values are dynamically derived from canonical collections.
 */
export const IntegrationOrchestrationFoundationSummary: OrchestrationFoundationSummary =
  Object.freeze({
    foundationId: IntegrationOrchestrationFoundationId,
    version: IntegrationOrchestrationFoundationVersion,
    name: IntegrationOrchestrationFoundationName,
    namespace: IntegrationOrchestrationFoundationNamespace,
    status: IntegrationOrchestrationFoundationStatusValue,
    readiness: IntegrationOrchestrationFoundationReadinessValue,
    orchestrationCategoryCount: integrationOrchestrationCategories.length,
    contractCount: IntegrationOrchestrationFoundationContracts.length,
    capabilityCount: IntegrationOrchestrationFoundationCapabilities.length,
    responsibilityCount:
      IntegrationOrchestrationFoundationResponsibilities.length,
    lifecycleStateCount: IntegrationOrchestrationFoundationLifecycle.stateCount,
    ownershipCount: IntegrationOrchestrationFoundationOwnership.ownsCount,
    nonOwnershipCount:
      IntegrationOrchestrationFoundationOwnership.doesNotOwnCount,
    terminologyCount:
      IntegrationOrchestrationFoundationTerminology.terms.length,
    sectionCount: PLATFORM_SECTIONS.length,
    nextPhase: "EIL-4:2 — Integration Orchestration Registry",
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });

/**
 * Canonical immutable Integration Orchestration Foundation platform.
 * Twelve ordered sections. Metadata only.
 */
export const IntegrationOrchestrationFoundationPlatform = Object.freeze({
  identity: IntegrationOrchestrationFoundationIdentity,
  dependency,
  categories: integrationOrchestrationCategories,
  contracts: IntegrationOrchestrationFoundationContracts,
  capabilities: IntegrationOrchestrationFoundationCapabilityCatalog,
  responsibilities: IntegrationOrchestrationFoundationResponsibilityCatalog,
  lifecycle: IntegrationOrchestrationFoundationLifecycle,
  ownership: IntegrationOrchestrationFoundationOwnership,
  boundaries: IntegrationOrchestrationFoundationBoundaries,
  compatibility: IntegrationOrchestrationFoundationCompatibility,
  terminology: IntegrationOrchestrationFoundationTerminology,
  readiness: IntegrationOrchestrationFoundationReadinessValue,
  contractNames: IntegrationOrchestrationFoundationContractNames,
  capabilityDeclarations: IntegrationOrchestrationFoundationCapabilities,
  responsibilityDeclarations: IntegrationOrchestrationFoundationResponsibilities,
  collections: IntegrationOrchestrationFoundationCollections,
  inventory,
  apiRegistry: IntegrationOrchestrationFoundationApiRegistry,
  sectionOrder: PLATFORM_SECTIONS,
  sectionCount: PLATFORM_SECTIONS.length,
  status: IntegrationOrchestrationFoundationStatusValue,
  nextPhase: "EIL-4:2 — Integration Orchestration Registry",
  metadataOnly: true as const,
  runtimeBehavior: false as const,
  runtimeEnforcement: false as const,
  orchestrationEngine: false as const,
  workflowExecution: false as const,
  routingExecution: false as const,
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
  importsLaterEil4Phases: false as const,
  immutable: true as const,
  deterministic: true as const,
});
