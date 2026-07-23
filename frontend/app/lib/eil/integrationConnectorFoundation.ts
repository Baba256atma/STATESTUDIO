/**
 * EIL-2:1 — Integration Connector Foundation.
 *
 * Immutable architectural foundation for the Integration Connector Platform.
 * Local metadata contracts only. Runtime-free. Ready for Registry.
 * Does not modify EIL-1.
 *
 * Ownership: owned exclusively by EIL-2:1.
 *
 * Public exports (exactly 8):
 *   IntegrationConnectorFoundationId
 *   IntegrationConnectorFoundationVersion
 *   IntegrationConnectorFoundationName
 *   IntegrationConnectorFoundationNamespace
 *   IntegrationConnectorFoundationStatus
 *   IntegrationConnectorFoundationReadiness
 *   IntegrationConnectorFoundationPlatform
 *   getIntegrationConnectorFoundationSummary()
 */

import {
  IntegrationConnectorFoundationCapabilities,
  IntegrationConnectorFoundationCapabilityCatalog,
} from "./integrationConnectorFoundationCapabilities.ts";
import {
  IntegrationConnectorFoundationContractNames,
  IntegrationConnectorFoundationContracts,
} from "./integrationConnectorFoundationContracts.ts";
import {
  IntegrationConnectorFoundationId,
  IntegrationConnectorFoundationIdentity,
  IntegrationConnectorFoundationName,
  IntegrationConnectorFoundationNamespace,
  IntegrationConnectorFoundationReadiness,
  IntegrationConnectorFoundationStatus,
  IntegrationConnectorFoundationVersion,
} from "./integrationConnectorFoundationIdentity.ts";
import { IntegrationConnectorFoundationLifecycle } from "./integrationConnectorFoundationLifecycle.ts";
import {
  IntegrationConnectorFoundationResponsibilities,
  IntegrationConnectorFoundationResponsibilityCatalog,
} from "./integrationConnectorFoundationResponsibilities.ts";
import type {
  IntegrationConnectorCategory,
  IntegrationConnectorCategoryKey,
  IntegrationConnectorFoundationInventory,
  IntegrationConnectorFoundationSummary,
} from "./integrationConnectorFoundationTypes.ts";

export {
  IntegrationConnectorFoundationId,
  IntegrationConnectorFoundationName,
  IntegrationConnectorFoundationNamespace,
  IntegrationConnectorFoundationReadiness,
  IntegrationConnectorFoundationStatus,
  IntegrationConnectorFoundationVersion,
};

const category = (
  categoryKey: IntegrationConnectorCategoryKey,
  canonicalName: string,
  description: string,
  order: number,
): IntegrationConnectorCategory =>
  Object.freeze({
    categoryId: `EIL-2:1/Category/${categoryKey}` as const,
    categoryKey,
    canonicalName,
    description,
    runtimeImplemented: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

/**
 * Exactly ten canonical connector categories.
 * Metadata only — no connector runtime.
 */
const IntegrationConnectorFoundationCategories: readonly IntegrationConnectorCategory[] =
  Object.freeze([
    category(
      "InternalPlatformConnector",
      "Internal Platform Connector",
      "Declarative category for connectors targeting internal Nexora platforms.",
      1,
    ),
    category(
      "ExternalPlatformConnector",
      "External Platform Connector",
      "Declarative category for connectors targeting external systems.",
      2,
    ),
    category(
      "ApiConnector",
      "API Connector",
      "Declarative category for API-oriented connector definitions.",
      3,
    ),
    category(
      "EventConnector",
      "Event Connector",
      "Declarative category for event-oriented connector definitions.",
      4,
    ),
    category(
      "MessageConnector",
      "Message Connector",
      "Declarative category for message-oriented connector definitions.",
      5,
    ),
    category(
      "FileConnector",
      "File Connector",
      "Declarative category for file-oriented connector definitions.",
      6,
    ),
    category(
      "DatabaseConnector",
      "Database Connector",
      "Declarative category for database-oriented connector definitions.",
      7,
    ),
    category(
      "ServiceConnector",
      "Service Connector",
      "Declarative category for service-oriented connector definitions.",
      8,
    ),
    category(
      "IntegrationGatewayConnector",
      "Integration Gateway Connector",
      "Declarative category for integration-gateway connector definitions.",
      9,
    ),
    category(
      "CustomConnector",
      "Custom Connector",
      "Declarative category for custom connector definitions.",
      10,
    ),
  ]);

const CONNECTOR_FOUNDATION_OWNS = Object.freeze([
  "Connector identity",
  "Connector categories",
  "Canonical connector contracts",
  "Connector responsibilities",
  "Connector capabilities",
  "Connector lifecycle",
  "Ownership",
  "Architectural boundaries",
  "Compatibility declarations",
  "Terminology",
] as const);

const CONNECTOR_FOUNDATION_DOES_NOT_OWN = Object.freeze([
  "Connector runtime",
  "Networking",
  "REST",
  "GraphQL",
  "WebSocket",
  "gRPC",
  "HTTP clients",
  "SDK runtime",
  "Queues",
  "Message brokers",
  "Authentication logic",
  "Authorization logic",
  "Encryption",
  "Persistence",
  "Databases",
  "Cache",
  "Filesystem",
  "Adapters",
  "Services",
  "Dependency injection",
  "AI",
  "LLM",
  "UI",
  "React",
  "Business logic",
  "State mutation",
  "EIL-1 internals",
  "Later EIL-2 phases",
] as const);

const IntegrationConnectorFoundationOwnership = Object.freeze({
  ownershipId: "EIL-2:1/IntegrationConnectorFoundationOwnership",
  sourcePhase: "EIL-2:1" as const,
  owns: CONNECTOR_FOUNDATION_OWNS,
  doesNotOwn: CONNECTOR_FOUNDATION_DOES_NOT_OWN,
  ownsCount: CONNECTOR_FOUNDATION_OWNS.length,
  doesNotOwnCount: CONNECTOR_FOUNDATION_DOES_NOT_OWN.length,
  ownsConnectorRuntime: false as const,
  ownsNetworking: false as const,
  ownsBusinessLogic: false as const,
  modifiesEil1: false as const,
  runtimeBehavior: "None" as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

const CONNECTOR_FOUNDATION_PROHIBITED_SURFACES = Object.freeze([
  "Connector runtime",
  "Networking",
  "REST",
  "GraphQL",
  "WebSocket",
  "gRPC",
  "HTTP clients",
  "SDK runtime",
  "Queues",
  "Message brokers",
  "Authentication logic",
  "Authorization logic",
  "Encryption",
  "Persistence",
  "Databases",
  "Cache",
  "Filesystem",
  "Adapters",
  "Services",
  "Dependency injection",
  "AI",
  "LLM",
  "UI",
  "React",
  "Business logic",
  "State mutation",
  "Later EIL-2 phase imports",
  "EIL-1 modification",
] as const);

const IntegrationConnectorFoundationBoundaries = Object.freeze({
  boundariesId: "EIL-2:1/IntegrationConnectorFoundationBoundaries",
  sourcePhase: "EIL-2:1" as const,
  consumes: Object.freeze(["Approved NPA standards"] as const),
  provides: Object.freeze(["Integration Connector Foundation"] as const),
  prohibitedSurfaces: CONNECTOR_FOUNDATION_PROHIBITED_SURFACES,
  prohibitedSurfaceCount: CONNECTOR_FOUNDATION_PROHIBITED_SURFACES.length,
  dependencyRules: Object.freeze([
    "ApprovedNpaStandardsOnly",
    "NoEil1Dependency",
    "NoLaterEil2PhaseImport",
    "NoConnectorRuntimeImport",
    "NoNetworkingLibraryImport",
    "NoCircularConnectorOwnership",
  ] as const),
  layerSeparation: Object.freeze({
    eil2OwnsConnectorMetadataOnly: true as const,
    eil1RemainsUnmodified: true as const,
    runtimeLayersDeferred: true as const,
  }),
  runtimeEnforcement: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

const IntegrationConnectorFoundationCompatibility = Object.freeze({
  compatibilityId: "EIL-2:1/IntegrationConnectorFoundationCompatibility",
  sourcePhase: "EIL-2:1" as const,
  declarations: Object.freeze([
    "EIL-2 does not modify EIL-1",
    "Connector definitions are metadata-only at Foundation",
    "Compatibility is declarative, never runtime-validated here",
    "No illegal coupling across platform boundaries via connectors",
    "Dependency direction is preserved and one-way at declaration time",
  ] as const),
  runtimeValidation: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

const IntegrationConnectorFoundationTerminology = Object.freeze({
  terminologyId: "EIL-2:1/IntegrationConnectorFoundationTerminology",
  sourcePhase: "EIL-2:1" as const,
  terms: Object.freeze([
    Object.freeze({
      term: "EIL-2",
      definition:
        "Integration Connector Platform — defines connector metadata architecture without connector runtime.",
    }),
    Object.freeze({
      term: "Integration Connector Foundation",
      definition:
        "Immutable metadata foundation establishing connector identities, categories, contracts, capabilities, and boundaries.",
    }),
    Object.freeze({
      term: "Connector Category",
      definition:
        "Declarative classification for a connector definition without runtime implementation.",
    }),
    Object.freeze({
      term: "Connector Contract",
      definition:
        "Declarative metadata contract describing connector architecture without transport or auth logic.",
    }),
    Object.freeze({
      term: "Compatibility Declaration",
      definition:
        "Declarative compatibility rule for connectors without runtime validation.",
    }),
    Object.freeze({
      term: "ReadyForRegistry",
      definition:
        "Foundation readiness indicating the phase may advance to EIL-2:2 Registry.",
    }),
  ]),
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

const dependency = Object.freeze({
  dependencyId: "EIL-2:1/Dependency/None",
  upstreamDependencies: Object.freeze([] as const),
  downstreamDependencies: Object.freeze([] as const),
  eil1Dependency: false as const,
  laterEil2PhaseImport: false as const,
  connectorRuntimeImport: false as const,
  networkingLibraryImport: false as const,
  circularDependency: false as const,
  prefersLocalContracts: true as const,
  approvedNpaStandardsOnly: true as const,
  canonicalPath: "EIL-2:1 → local connector foundation contracts only",
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
  kind: "Aggregate" | "IdentityConstant" | "MetadataConstant" | "Helper",
) =>
  Object.freeze({
    id: `EIL-2:1/PublicApi/${exportName}`,
    exportName,
    phase: "EIL-2:1" as const,
    section: "Foundation" as const,
    kind,
    version: IntegrationConnectorFoundationVersion,
    status: IntegrationConnectorFoundationStatus,
    stability: "Stable" as const,
    public: true as const,
    sourceReference: "integrationConnectorFoundation.ts" as const,
  });

const IntegrationConnectorFoundationApiRegistry = Object.freeze([
  foundationApi("IntegrationConnectorFoundationId", "IdentityConstant"),
  foundationApi("IntegrationConnectorFoundationVersion", "IdentityConstant"),
  foundationApi("IntegrationConnectorFoundationName", "IdentityConstant"),
  foundationApi("IntegrationConnectorFoundationNamespace", "IdentityConstant"),
  foundationApi("IntegrationConnectorFoundationStatus", "MetadataConstant"),
  foundationApi("IntegrationConnectorFoundationReadiness", "MetadataConstant"),
  foundationApi("IntegrationConnectorFoundationPlatform", "Aggregate"),
  foundationApi("getIntegrationConnectorFoundationSummary", "Helper"),
]);

const inventory: IntegrationConnectorFoundationInventory = Object.freeze({
  inventoryId: "EIL-2:1/Inventory",
  categoryCount: IntegrationConnectorFoundationCategories.length,
  contractCount: IntegrationConnectorFoundationContracts.length,
  capabilityCount: IntegrationConnectorFoundationCapabilities.length,
  responsibilityCount:
    IntegrationConnectorFoundationResponsibilities.length,
  lifecycleStateCount: IntegrationConnectorFoundationLifecycle.stateCount,
  totalFoundationEntryCount:
    IntegrationConnectorFoundationCategories.length +
    IntegrationConnectorFoundationContracts.length +
    IntegrationConnectorFoundationCapabilities.length +
    IntegrationConnectorFoundationResponsibilities.length +
    IntegrationConnectorFoundationLifecycle.stateCount,
  countsDerivedFromCollections: true as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

/**
 * Canonical immutable Integration Connector Foundation platform.
 * Twelve ordered sections. Metadata only.
 */
export const IntegrationConnectorFoundationPlatform = Object.freeze({
  identity: IntegrationConnectorFoundationIdentity,
  dependency,
  categories: IntegrationConnectorFoundationCategories,
  contracts: IntegrationConnectorFoundationContracts,
  capabilities: IntegrationConnectorFoundationCapabilityCatalog,
  responsibilities: IntegrationConnectorFoundationResponsibilityCatalog,
  lifecycle: IntegrationConnectorFoundationLifecycle,
  ownership: IntegrationConnectorFoundationOwnership,
  boundaries: IntegrationConnectorFoundationBoundaries,
  compatibility: IntegrationConnectorFoundationCompatibility,
  terminology: IntegrationConnectorFoundationTerminology,
  readiness: IntegrationConnectorFoundationReadiness,
  contractNames: IntegrationConnectorFoundationContractNames,
  capabilityDeclarations: IntegrationConnectorFoundationCapabilities,
  responsibilityDeclarations:
    IntegrationConnectorFoundationResponsibilities,
  inventory,
  apiRegistry: IntegrationConnectorFoundationApiRegistry,
  sectionOrder: PLATFORM_SECTIONS,
  sectionCount: PLATFORM_SECTIONS.length,
  status: IntegrationConnectorFoundationStatus,
  nextPhase: "EIL-2:2 — Integration Connector Registry",
  metadataOnly: true as const,
  runtimeBehavior: false as const,
  runtimeEnforcement: false as const,
  connectorRuntime: false as const,
  networkingBehavior: false as const,
  restBehavior: false as const,
  graphqlBehavior: false as const,
  websocketBehavior: false as const,
  grpcBehavior: false as const,
  httpClientBehavior: false as const,
  sdkRuntime: false as const,
  queueBehavior: false as const,
  messageBrokerBehavior: false as const,
  authenticationLogic: false as const,
  authorizationLogic: false as const,
  encryptionBehavior: false as const,
  persistenceBehavior: false as const,
  databaseBehavior: false as const,
  cacheBehavior: false as const,
  filesystemBehavior: false as const,
  adapterBehavior: false as const,
  serviceBehavior: false as const,
  dependencyInjection: false as const,
  aiBehavior: false as const,
  llmBehavior: false as const,
  uiBehavior: false as const,
  reactBehavior: false as const,
  businessLogicBehavior: false as const,
  stateMutation: false as const,
  modifiesEil1: false as const,
  importsLaterEil2Phases: false as const,
  immutable: true as const,
  deterministic: true as const,
});

/** Deterministic frozen Integration Connector Foundation summary. */
export function getIntegrationConnectorFoundationSummary(): IntegrationConnectorFoundationSummary {
  return Object.freeze({
    foundationId: IntegrationConnectorFoundationId,
    version: IntegrationConnectorFoundationVersion,
    name: IntegrationConnectorFoundationName,
    namespace: IntegrationConnectorFoundationNamespace,
    status: IntegrationConnectorFoundationStatus,
    readiness: IntegrationConnectorFoundationReadiness,
    categoryCount: IntegrationConnectorFoundationCategories.length,
    contractCount: IntegrationConnectorFoundationContracts.length,
    capabilityCount: IntegrationConnectorFoundationCapabilities.length,
    responsibilityCount:
      IntegrationConnectorFoundationResponsibilities.length,
    lifecycleStateCount: IntegrationConnectorFoundationLifecycle.stateCount,
    ownershipCount: IntegrationConnectorFoundationOwnership.ownsCount,
    nonOwnershipCount: IntegrationConnectorFoundationOwnership.doesNotOwnCount,
    terminologyCount: IntegrationConnectorFoundationTerminology.terms.length,
    sectionCount: PLATFORM_SECTIONS.length,
    nextPhase: "EIL-2:2 — Integration Connector Registry",
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
}
