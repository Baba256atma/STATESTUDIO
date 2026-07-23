/**
 * EIL-3:1 — Integration Routing Foundation.
 *
 * Immutable architectural foundation for the Integration Routing Platform.
 * Local metadata contracts only. Runtime-free. Ready for Registry.
 * Does not consume previous EIL platforms.
 *
 * Ownership: owned exclusively by EIL-3:1.
 *
 * Public exports (exactly 8):
 *   IntegrationRoutingFoundationIdentity
 *   IntegrationRoutingFoundationContracts
 *   IntegrationRoutingFoundationCapabilities
 *   IntegrationRoutingFoundationResponsibilities
 *   IntegrationRoutingFoundationLifecycle
 *   IntegrationRoutingFoundationCollections
 *   IntegrationRoutingFoundationSummary
 *   IntegrationRoutingFoundationPlatform
 */

import {
  IntegrationRoutingFoundationCapabilities,
  IntegrationRoutingFoundationCapabilityCatalog,
} from "./integrationRoutingFoundationCapabilities.ts";
import {
  IntegrationRoutingFoundationContractNames,
  IntegrationRoutingFoundationContracts,
} from "./integrationRoutingFoundationContracts.ts";
import {
  IntegrationRoutingFoundationId,
  IntegrationRoutingFoundationIdentity,
  IntegrationRoutingFoundationName,
  IntegrationRoutingFoundationNamespace,
  IntegrationRoutingFoundationReadinessValue,
  IntegrationRoutingFoundationStatusValue,
  IntegrationRoutingFoundationVersion,
} from "./integrationRoutingFoundationIdentity.ts";
import { IntegrationRoutingFoundationLifecycle } from "./integrationRoutingFoundationLifecycle.ts";
import {
  IntegrationRoutingFoundationResponsibilities,
  IntegrationRoutingFoundationResponsibilityCatalog,
} from "./integrationRoutingFoundationResponsibilities.ts";
import type {
  RoutingCategory,
  RoutingCategoryKey,
  RoutingFoundationInventory,
  RoutingFoundationSummary,
} from "./integrationRoutingFoundationTypes.ts";

export { IntegrationRoutingFoundationIdentity };
export { IntegrationRoutingFoundationContracts };
export { IntegrationRoutingFoundationCapabilities };
export { IntegrationRoutingFoundationResponsibilities };
export { IntegrationRoutingFoundationLifecycle };

const category = (
  categoryKey: RoutingCategoryKey,
  canonicalName: string,
  description: string,
  order: number,
): RoutingCategory =>
  Object.freeze({
    categoryId: `EIL-3:1/Category/${categoryKey}` as const,
    categoryKey,
    canonicalName,
    description,
    runtimeImplemented: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

/**
 * Exactly ten canonical routing categories.
 * Metadata only — no routing engine.
 */
const integrationRoutingCategories: readonly RoutingCategory[] = Object.freeze([
  category(
    "DirectRoute",
    "Direct Route",
    "Declarative category for direct point-to-point route definitions.",
    1,
  ),
  category(
    "ConditionalRoute",
    "Conditional Route",
    "Declarative category for condition-oriented route definitions.",
    2,
  ),
  category(
    "SequentialRoute",
    "Sequential Route",
    "Declarative category for sequential multi-step route definitions.",
    3,
  ),
  category(
    "ParallelRoute",
    "Parallel Route",
    "Declarative category for parallel fan-out route definitions.",
    4,
  ),
  category(
    "EventRoute",
    "Event Route",
    "Declarative category for event-oriented route definitions.",
    5,
  ),
  category(
    "RequestRoute",
    "Request Route",
    "Declarative category for request-oriented route definitions.",
    6,
  ),
  category(
    "ResponseRoute",
    "Response Route",
    "Declarative category for response-oriented route definitions.",
    7,
  ),
  category(
    "ScheduledRoute",
    "Scheduled Route",
    "Declarative category for schedule-oriented route definitions.",
    8,
  ),
  category(
    "GatewayRoute",
    "Gateway Route",
    "Declarative category for gateway-oriented route definitions.",
    9,
  ),
  category(
    "CompositeRoute",
    "Composite Route",
    "Declarative category for composite multi-route definitions.",
    10,
  ),
]);

const ROUTING_FOUNDATION_OWNS = Object.freeze([
  "Routing metadata",
  "Routing terminology",
  "Routing contracts",
  "Routing capabilities",
  "Routing responsibilities",
  "Routing lifecycle",
] as const);

const ROUTING_FOUNDATION_DOES_NOT_OWN = Object.freeze([
  "Routing engine",
  "Connector execution",
  "Orchestration",
  "Scheduling",
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
  "Message execution",
  "Previous EIL platforms",
  "Later EIL-3 phases",
] as const);

const IntegrationRoutingFoundationOwnership = Object.freeze({
  ownershipId: "EIL-3:1/IntegrationRoutingFoundationOwnership",
  sourcePhase: "EIL-3:1" as const,
  owns: ROUTING_FOUNDATION_OWNS,
  doesNotOwn: ROUTING_FOUNDATION_DOES_NOT_OWN,
  ownsCount: ROUTING_FOUNDATION_OWNS.length,
  doesNotOwnCount: ROUTING_FOUNDATION_DOES_NOT_OWN.length,
  ownsRoutingEngine: false as const,
  ownsNetworking: false as const,
  ownsBusinessLogic: false as const,
  consumesPreviousEilPlatforms: false as const,
  runtimeBehavior: "None" as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

const ROUTING_FOUNDATION_PROHIBITED_SURFACES = Object.freeze([
  "Routing engine",
  "Runtime routing",
  "Orchestration engine",
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
  "Message execution",
  "Connector execution",
  "Previous EIL platform imports",
  "Later EIL-3 phase imports",
] as const);

const IntegrationRoutingFoundationBoundaries = Object.freeze({
  boundariesId: "EIL-3:1/IntegrationRoutingFoundationBoundaries",
  sourcePhase: "EIL-3:1" as const,
  consumes: Object.freeze(["Approved NPA standards"] as const),
  provides: Object.freeze(["Integration Routing Foundation"] as const),
  prohibitedSurfaces: ROUTING_FOUNDATION_PROHIBITED_SURFACES,
  prohibitedSurfaceCount: ROUTING_FOUNDATION_PROHIBITED_SURFACES.length,
  dependencyRules: Object.freeze([
    "ApprovedNpaStandardsOnly",
    "NoPreviousEilPlatformDependency",
    "NoLaterEil3PhaseImport",
    "NoRoutingEngineImport",
    "NoNetworkingLibraryImport",
    "NoCircularRouteOwnership",
  ] as const),
  layerSeparation: Object.freeze({
    eil3OwnsRoutingMetadataOnly: true as const,
    previousEilPlatformsUnconsumed: true as const,
    runtimeLayersDeferred: true as const,
  }),
  runtimeEnforcement: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

const IntegrationRoutingFoundationCompatibility = Object.freeze({
  compatibilityId: "EIL-3:1/IntegrationRoutingFoundationCompatibility",
  sourcePhase: "EIL-3:1" as const,
  declarations: Object.freeze([
    "EIL-3 does not consume previous EIL platforms",
    "Route definitions are metadata-only at Foundation",
    "Compatibility is declarative, never runtime-validated here",
    "No illegal coupling across platform boundaries via routes",
    "Dependency direction is preserved and one-way at declaration time",
  ] as const),
  runtimeValidation: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

const IntegrationRoutingFoundationTerminology = Object.freeze({
  terminologyId: "EIL-3:1/IntegrationRoutingFoundationTerminology",
  sourcePhase: "EIL-3:1" as const,
  terms: Object.freeze([
    Object.freeze({
      term: "EIL-3",
      definition:
        "Integration Routing Platform — defines routing metadata architecture without routing engine runtime.",
    }),
    Object.freeze({
      term: "Integration Routing Foundation",
      definition:
        "Immutable metadata foundation establishing routing identities, categories, contracts, capabilities, and boundaries.",
    }),
    Object.freeze({
      term: "Routing Category",
      definition:
        "Declarative classification for a route definition without runtime implementation.",
    }),
    Object.freeze({
      term: "Route Contract",
      definition:
        "Declarative metadata contract describing route architecture without path evaluation or message execution.",
    }),
    Object.freeze({
      term: "Compatibility Declaration",
      definition:
        "Declarative compatibility rule for routes without runtime validation.",
    }),
    Object.freeze({
      term: "ReadyForRegistry",
      definition:
        "Foundation readiness indicating the phase may advance to EIL-3:2 Registry.",
    }),
  ]),
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

const dependency = Object.freeze({
  dependencyId: "EIL-3:1/Dependency/None",
  upstreamDependencies: Object.freeze([] as const),
  downstreamDependencies: Object.freeze([] as const),
  previousEilPlatformDependency: false as const,
  laterEil3PhaseImport: false as const,
  routingEngineImport: false as const,
  networkingLibraryImport: false as const,
  circularDependency: false as const,
  prefersLocalContracts: true as const,
  approvedNpaStandardsOnly: true as const,
  canonicalPath: "EIL-3:1 → local routing foundation contracts only",
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
    id: `EIL-3:1/PublicApi/${exportName}`,
    exportName,
    phase: "EIL-3:1" as const,
    section: "Foundation" as const,
    kind,
    version: IntegrationRoutingFoundationVersion,
    status: IntegrationRoutingFoundationStatusValue,
    stability: "Stable" as const,
    public: true as const,
    sourceReference: "integrationRoutingFoundation.ts" as const,
  });

const IntegrationRoutingFoundationApiRegistry = Object.freeze([
  foundationApi("IntegrationRoutingFoundationIdentity", "IdentityConstant"),
  foundationApi("IntegrationRoutingFoundationContracts", "MetadataConstant"),
  foundationApi("IntegrationRoutingFoundationCapabilities", "MetadataConstant"),
  foundationApi(
    "IntegrationRoutingFoundationResponsibilities",
    "MetadataConstant",
  ),
  foundationApi("IntegrationRoutingFoundationLifecycle", "MetadataConstant"),
  foundationApi("IntegrationRoutingFoundationCollections", "Collection"),
  foundationApi("IntegrationRoutingFoundationSummary", "Aggregate"),
  foundationApi("IntegrationRoutingFoundationPlatform", "Aggregate"),
]);

const inventory: RoutingFoundationInventory = Object.freeze({
  inventoryId: "EIL-3:1/Inventory",
  routingCategoryCount: integrationRoutingCategories.length,
  contractCount: IntegrationRoutingFoundationContracts.length,
  capabilityCount: IntegrationRoutingFoundationCapabilities.length,
  responsibilityCount: IntegrationRoutingFoundationResponsibilities.length,
  lifecycleStateCount: IntegrationRoutingFoundationLifecycle.stateCount,
  totalFoundationEntryCount:
    integrationRoutingCategories.length +
    IntegrationRoutingFoundationContracts.length +
    IntegrationRoutingFoundationCapabilities.length +
    IntegrationRoutingFoundationResponsibilities.length +
    IntegrationRoutingFoundationLifecycle.stateCount,
  countsDerivedFromCollections: true as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

/**
 * Canonical immutable collections for Integration Routing Foundation.
 * Inventory counts are dynamically derived from collection lengths.
 */
export const IntegrationRoutingFoundationCollections = Object.freeze({
  collectionsId: "EIL-3:1/Collections",
  sourcePhase: "EIL-3:1" as const,
  categories: integrationRoutingCategories,
  contracts: IntegrationRoutingFoundationContracts,
  capabilities: IntegrationRoutingFoundationCapabilities,
  responsibilities: IntegrationRoutingFoundationResponsibilities,
  lifecycleStates: IntegrationRoutingFoundationLifecycle.states,
  routingCategoryCount: integrationRoutingCategories.length,
  contractCount: IntegrationRoutingFoundationContracts.length,
  capabilityCount: IntegrationRoutingFoundationCapabilities.length,
  responsibilityCount: IntegrationRoutingFoundationResponsibilities.length,
  lifecycleStateCount: IntegrationRoutingFoundationLifecycle.stateCount,
  countsDerivedFromCollections: true as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

/**
 * Canonical immutable Integration Routing Foundation summary.
 * Inventory values are dynamically derived from canonical collections.
 */
export const IntegrationRoutingFoundationSummary: RoutingFoundationSummary =
  Object.freeze({
    foundationId: IntegrationRoutingFoundationId,
    version: IntegrationRoutingFoundationVersion,
    name: IntegrationRoutingFoundationName,
    namespace: IntegrationRoutingFoundationNamespace,
    status: IntegrationRoutingFoundationStatusValue,
    readiness: IntegrationRoutingFoundationReadinessValue,
    routingCategoryCount: integrationRoutingCategories.length,
    contractCount: IntegrationRoutingFoundationContracts.length,
    capabilityCount: IntegrationRoutingFoundationCapabilities.length,
    responsibilityCount: IntegrationRoutingFoundationResponsibilities.length,
    lifecycleStateCount: IntegrationRoutingFoundationLifecycle.stateCount,
    ownershipCount: IntegrationRoutingFoundationOwnership.ownsCount,
    nonOwnershipCount: IntegrationRoutingFoundationOwnership.doesNotOwnCount,
    terminologyCount: IntegrationRoutingFoundationTerminology.terms.length,
    sectionCount: PLATFORM_SECTIONS.length,
    nextPhase: "EIL-3:2 — Integration Routing Registry",
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });

/**
 * Canonical immutable Integration Routing Foundation platform.
 * Twelve ordered sections. Metadata only.
 */
export const IntegrationRoutingFoundationPlatform = Object.freeze({
  identity: IntegrationRoutingFoundationIdentity,
  dependency,
  categories: integrationRoutingCategories,
  contracts: IntegrationRoutingFoundationContracts,
  capabilities: IntegrationRoutingFoundationCapabilityCatalog,
  responsibilities: IntegrationRoutingFoundationResponsibilityCatalog,
  lifecycle: IntegrationRoutingFoundationLifecycle,
  ownership: IntegrationRoutingFoundationOwnership,
  boundaries: IntegrationRoutingFoundationBoundaries,
  compatibility: IntegrationRoutingFoundationCompatibility,
  terminology: IntegrationRoutingFoundationTerminology,
  readiness: IntegrationRoutingFoundationReadinessValue,
  contractNames: IntegrationRoutingFoundationContractNames,
  capabilityDeclarations: IntegrationRoutingFoundationCapabilities,
  responsibilityDeclarations: IntegrationRoutingFoundationResponsibilities,
  collections: IntegrationRoutingFoundationCollections,
  inventory,
  apiRegistry: IntegrationRoutingFoundationApiRegistry,
  sectionOrder: PLATFORM_SECTIONS,
  sectionCount: PLATFORM_SECTIONS.length,
  status: IntegrationRoutingFoundationStatusValue,
  nextPhase: "EIL-3:2 — Integration Routing Registry",
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
  consumesPreviousEilPlatforms: false as const,
  importsLaterEil3Phases: false as const,
  immutable: true as const,
  deterministic: true as const,
});
