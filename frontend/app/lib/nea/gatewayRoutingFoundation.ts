/**
 * NEA-5:1 — Gateway Routing Foundation.
 *
 * Immutable architectural foundation for Gateway Routing.
 * Consumes only NEA-4 Security Gateway Public Index.
 * Metadata-only. Runtime-free. Ready for Registry.
 *
 * Ownership: owned exclusively by NEA-5:1.
 *
 * Public exports (exactly 8):
 *   GatewayRoutingFoundationId
 *   GatewayRoutingFoundationVersion
 *   GatewayRoutingFoundationName
 *   GatewayRoutingFoundationNamespace
 *   GatewayRoutingFoundationStatus
 *   GatewayRoutingFoundationReadiness
 *   GatewayRoutingFoundationPlatform
 *   getGatewayRoutingFoundationSummary()
 */

import { GatewayRoutingBoundaries } from "./gatewayRoutingBoundaries.ts";
import { GatewayRoutingCapabilityCatalog } from "./gatewayRoutingCapabilities.ts";
import { GatewayRoutingContractCatalog } from "./gatewayRoutingContracts.ts";
import type {
  GatewayRoutingFoundationIdentity,
  GatewayRoutingFoundationSummary,
} from "./gatewayRoutingFoundationTypes.ts";
import { GatewayRoutingLifecycle } from "./gatewayRoutingLifecycle.ts";
import { GatewayRoutingOwnership } from "./gatewayRoutingOwnership.ts";
import {
  SecurityGatewayPublicIndexId,
  SecurityGatewayPublicIndexNamespace,
  SecurityGatewayPublicIndexVersion,
} from "./securityGatewayPublicIndex.ts";

/** Canonical foundation identity. */
export const GatewayRoutingFoundationId =
  "NEA-5:1/GatewayRoutingFoundation" as const;

/** Human-readable foundation name. */
export const GatewayRoutingFoundationName =
  "Gateway Routing Foundation" as const;

/** Semantic version. */
export const GatewayRoutingFoundationVersion = "1.0.0" as const;

/** Canonical namespace. */
export const GatewayRoutingFoundationNamespace =
  "nexora.nea.gateway-routing.foundation" as const;

/** Foundation status. */
export const GatewayRoutingFoundationStatus = "Foundation" as const;

/** Immediate next-phase readiness. */
export const GatewayRoutingFoundationReadiness = "ReadyForRegistry" as const;

const identity: GatewayRoutingFoundationIdentity = Object.freeze({
  foundationId: GatewayRoutingFoundationId,
  foundationName: GatewayRoutingFoundationName,
  foundationVersion: GatewayRoutingFoundationVersion,
  foundationNamespace: GatewayRoutingFoundationNamespace,
  layer: "NEA" as const,
  phase: "NEA-5:1" as const,
  stage: "Foundation" as const,
  sourcePhase: "NEA-5:1" as const,
  owner: "NEA-5 Gateway Routing",
  status: GatewayRoutingFoundationStatus,
  readiness: GatewayRoutingFoundationReadiness,
  description:
    "Immutable architectural foundation defining routing contracts, destinations, decisions, capabilities, lifecycle, ownership, and boundaries for Gateway Routing without implementing runtime routing, consumer selection, or networking.",
  publicIndexId: SecurityGatewayPublicIndexId,
  metadataOnly: true as const,
  immutable: true as const,
});

const dependency = Object.freeze({
  dependencyId: "NEA-5:1/Dependency/NEA4PublicIndex",
  directPreviousPhaseModule: "securityGatewayPublicIndex.ts" as const,
  publicIndexOnly: true as const,
  publicIndexId: SecurityGatewayPublicIndexId,
  publicIndexVersion: SecurityGatewayPublicIndexVersion,
  publicIndexNamespace: SecurityGatewayPublicIndexNamespace,
  freezeDirectImport: false as const,
  certificationDirectImport: false as const,
  platformDirectImport: false as const,
  laterNeaPhaseImport: false as const,
  dklInternalImport: false as const,
  engineInternalImport: false as const,
  assistantInternalImport: false as const,
  circularDependency: false as const,
  canonicalPath:
    "NEA-5:1 → NEA-4 SecurityGatewayPublicIndex (exclusive)",
  runtimeBehavior: "None" as const,
  metadataOnly: true as const,
});

const PLATFORM_SECTIONS = Object.freeze([
  "identity",
  "dependency",
  "contracts",
  "destinations",
  "capabilities",
  "lifecycle",
  "ownership",
  "boundaries",
  "metadata",
  "summary",
  "readiness",
] as const);

const foundationApi = (
  exportName: string,
  kind:
    | "Aggregate"
    | "IdentityConstant"
    | "MetadataConstant"
    | "Helper",
) =>
  Object.freeze({
    id: `NEA-5:1/PublicApi/${exportName}`,
    exportName,
    phase: "NEA-5:1" as const,
    section: "Foundation" as const,
    kind,
    version: GatewayRoutingFoundationVersion,
    status: GatewayRoutingFoundationStatus,
    stability: "Stable" as const,
    public: true as const,
    sourceReference: "gatewayRoutingFoundation.ts" as const,
  });

/** Additive public-surface registry — exactly eight top-level exports. */
const GatewayRoutingFoundationApiRegistry = Object.freeze([
  foundationApi("GatewayRoutingFoundationId", "IdentityConstant"),
  foundationApi("GatewayRoutingFoundationVersion", "IdentityConstant"),
  foundationApi("GatewayRoutingFoundationName", "IdentityConstant"),
  foundationApi("GatewayRoutingFoundationNamespace", "IdentityConstant"),
  foundationApi("GatewayRoutingFoundationStatus", "MetadataConstant"),
  foundationApi("GatewayRoutingFoundationReadiness", "MetadataConstant"),
  foundationApi("GatewayRoutingFoundationPlatform", "Aggregate"),
  foundationApi("getGatewayRoutingFoundationSummary", "Helper"),
]);

const destinations = Object.freeze({
  catalogId: "NEA-5:1/DestinationCatalog",
  sourcePhase: "NEA-5:1" as const,
  destinations: GatewayRoutingContractCatalog.destinations,
  destinationCount: GatewayRoutingContractCatalog.destinationCount,
  decisions: GatewayRoutingContractCatalog.decisions,
  decisionCount: GatewayRoutingContractCatalog.decisionCount,
  contextDimensions: GatewayRoutingContractCatalog.contextDimensions,
  contextDimensionCount: GatewayRoutingContractCatalog.contextDimensionCount,
  routesAtRuntime: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

const metadata = Object.freeze({
  metadataId: "NEA-5:1/GatewayRoutingFoundationMetadata",
  sourcePhase: "NEA-5:1" as const,
  foundationStatus: GatewayRoutingFoundationStatus,
  foundationVersion: GatewayRoutingFoundationVersion,
  publicIndexId: SecurityGatewayPublicIndexId,
  architectureVersion: "NEA-5.0.0" as const,
  contractCount: GatewayRoutingContractCatalog.contractCount,
  destinationCount: GatewayRoutingContractCatalog.destinationCount,
  decisionCount: GatewayRoutingContractCatalog.decisionCount,
  contextDimensionCount: GatewayRoutingContractCatalog.contextDimensionCount,
  capabilityCount: GatewayRoutingCapabilityCatalog.capabilityCount,
  lifecycleStateCount: GatewayRoutingLifecycle.stateCount,
  nextPhase: "NEA-5:2 — Gateway Routing Registry",
  countsHardcoded: false as const,
  implementsRuntimeRouting: false as const,
  implementsRoutingAlgorithms: false as const,
  implementsConsumerSelectionLogic: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

/**
 * Build deterministic frozen Foundation summary.
 * Counts are derived exclusively from canonical foundation collections.
 */
function buildGatewayRoutingFoundationSummary(): GatewayRoutingFoundationSummary {
  return Object.freeze({
    foundationId: GatewayRoutingFoundationId,
    version: GatewayRoutingFoundationVersion,
    name: GatewayRoutingFoundationName,
    namespace: GatewayRoutingFoundationNamespace,
    layer: "NEA" as const,
    phase: "NEA-5:1" as const,
    status: GatewayRoutingFoundationStatus,
    readiness: GatewayRoutingFoundationReadiness,
    publicIndexId: SecurityGatewayPublicIndexId,
    contractCount: GatewayRoutingContractCatalog.contractCount,
    destinationCount: GatewayRoutingContractCatalog.destinationCount,
    decisionCount: GatewayRoutingContractCatalog.decisionCount,
    contextDimensionCount: GatewayRoutingContractCatalog.contextDimensionCount,
    capabilityCount: GatewayRoutingCapabilityCatalog.capabilityCount,
    lifecycleStateCount: GatewayRoutingLifecycle.stateCount,
    ownershipCount: GatewayRoutingOwnership.ownsCount,
    nonOwnershipCount: GatewayRoutingOwnership.doesNotOwnCount,
    prohibitedSurfaceCount: GatewayRoutingBoundaries.prohibitedSurfaceCount,
    publicExportCount: 8 as const,
    sectionCount: PLATFORM_SECTIONS.length,
    nextPhase: metadata.nextPhase,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
}

/**
 * Canonical immutable Gateway Routing Foundation platform.
 * Metadata only. No runtime routing, consumer selection, or networking.
 */
export const GatewayRoutingFoundationPlatform = Object.freeze({
  identity,
  dependency,
  contracts: GatewayRoutingContractCatalog,
  destinations,
  capabilities: GatewayRoutingCapabilityCatalog,
  lifecycle: GatewayRoutingLifecycle,
  ownership: GatewayRoutingOwnership,
  boundaries: GatewayRoutingBoundaries,
  metadata,
  summary: buildGatewayRoutingFoundationSummary(),
  readiness: Object.freeze({
    readinessId: "NEA-5:1/FoundationReadiness",
    readiness: GatewayRoutingFoundationReadiness,
    nextPhase: metadata.nextPhase,
    claimsReadyForRegistry: true as const,
    claimsReadyForRuntime: false as const,
    claimsRuntimeRoutingImplemented: false as const,
    claimsRoutingAlgorithmsImplemented: false as const,
    claimsConsumerSelectionImplemented: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  }),
  apiRegistry: GatewayRoutingFoundationApiRegistry,
  sectionOrder: PLATFORM_SECTIONS,
  sectionCount: PLATFORM_SECTIONS.length,
  status: GatewayRoutingFoundationStatus,
  nextPhase: metadata.nextPhase,
  downstreamReadiness: GatewayRoutingFoundationReadiness,
  metadataOnly: true as const,
  runtimeBehavior: false as const,
  runtimeEnforcement: false as const,
  implementsRuntimeRouting: false as const,
  implementsRoutingAlgorithms: false as const,
  implementsConsumerSelectionLogic: false as const,
  processesMessages: false as const,
  executesConnectors: false as const,
  implementsHttp: false as const,
  implementsRest: false as const,
  implementsWebSockets: false as const,
  persistenceBehavior: false as const,
  aiReasoning: false as const,
  immutable: true as const,
  deterministic: true as const,
});

/**
 * Deterministic frozen Gateway Routing Foundation summary.
 * Counts are derived exclusively from canonical foundation collections.
 */
export function getGatewayRoutingFoundationSummary(): GatewayRoutingFoundationSummary {
  return buildGatewayRoutingFoundationSummary();
}
