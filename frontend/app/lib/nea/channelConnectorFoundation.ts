/**
 * NEA-2:1 — Channel Connectors Foundation.
 *
 * Immutable architectural foundation for Executive Gateway Channel Connectors.
 * Consumes only NEA-1 Executive Gateway Public Index.
 * Metadata-only. Runtime-free. Ready for Registry.
 *
 * Ownership: owned exclusively by NEA-2:1.
 *
 * Public exports (exactly 8):
 *   ChannelConnectorFoundationId
 *   ChannelConnectorFoundationVersion
 *   ChannelConnectorFoundationName
 *   ChannelConnectorFoundationNamespace
 *   ChannelConnectorFoundationStatus
 *   ChannelConnectorFoundationReadiness
 *   ChannelConnectorFoundationPlatform
 *   getChannelConnectorFoundationSummary()
 */

import { ChannelConnectorBoundaries } from "./channelConnectorBoundaries.ts";
import { ChannelConnectorCapabilityCatalog } from "./channelConnectorCapabilities.ts";
import { ChannelConnectorContractCatalog } from "./channelConnectorContracts.ts";
import type {
  ChannelConnectorFoundationIdentity,
  ChannelConnectorFoundationSummary,
} from "./channelConnectorFoundationTypes.ts";
import { ChannelConnectorLifecycle } from "./channelConnectorLifecycle.ts";
import { ChannelConnectorOwnership } from "./channelConnectorOwnership.ts";
import {
  ExecutiveGatewayPublicIndexId,
  ExecutiveGatewayPublicIndexNamespace,
  ExecutiveGatewayPublicIndexVersion,
} from "./executiveGatewayPublicIndex.ts";

/** Canonical foundation identity. */
export const ChannelConnectorFoundationId =
  "NEA-2:1/ChannelConnectorFoundation" as const;

/** Human-readable foundation name. */
export const ChannelConnectorFoundationName =
  "Channel Connectors Foundation" as const;

/** Semantic version. */
export const ChannelConnectorFoundationVersion = "1.0.0" as const;

/** Canonical namespace. */
export const ChannelConnectorFoundationNamespace =
  "nexora.nea.channel-connectors.foundation" as const;

/** Foundation status. */
export const ChannelConnectorFoundationStatus = "Foundation" as const;

/** Immediate next-phase readiness. */
export const ChannelConnectorFoundationReadiness =
  "ReadyForRegistry" as const;

const identity: ChannelConnectorFoundationIdentity = Object.freeze({
  foundationId: ChannelConnectorFoundationId,
  foundationName: ChannelConnectorFoundationName,
  foundationVersion: ChannelConnectorFoundationVersion,
  foundationNamespace: ChannelConnectorFoundationNamespace,
  layer: "NEA" as const,
  phase: "NEA-2:1" as const,
  stage: "Foundation" as const,
  sourcePhase: "NEA-2:1" as const,
  owner: "NEA-2 Channel Connectors",
  status: ChannelConnectorFoundationStatus,
  readiness: ChannelConnectorFoundationReadiness,
  description:
    "Immutable architectural foundation defining contracts, identities, capabilities, lifecycle, ownership, and boundaries for Executive Gateway channel connectors without implementing any real connector or network communication.",
  publicIndexId: ExecutiveGatewayPublicIndexId,
  metadataOnly: true as const,
  immutable: true as const,
});

const dependency = Object.freeze({
  dependencyId: "NEA-2:1/Dependency/NEA1PublicIndex",
  directPreviousPhaseModule: "executiveGatewayPublicIndex.ts" as const,
  publicIndexOnly: true as const,
  publicIndexId: ExecutiveGatewayPublicIndexId,
  publicIndexVersion: ExecutiveGatewayPublicIndexVersion,
  publicIndexNamespace: ExecutiveGatewayPublicIndexNamespace,
  freezeDirectImport: false as const,
  certificationDirectImport: false as const,
  platformDirectImport: false as const,
  laterNeaPhaseImport: false as const,
  dklInternalImport: false as const,
  engineInternalImport: false as const,
  assistantInternalImport: false as const,
  circularDependency: false as const,
  canonicalPath:
    "NEA-2:1 → NEA-1 ExecutiveGatewayPublicIndex (exclusive)",
  runtimeBehavior: "None" as const,
  metadataOnly: true as const,
});

const PLATFORM_SECTIONS = Object.freeze([
  "identity",
  "dependency",
  "contracts",
  "families",
  "types",
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
    id: `NEA-2:1/PublicApi/${exportName}`,
    exportName,
    phase: "NEA-2:1" as const,
    section: "Foundation" as const,
    kind,
    version: ChannelConnectorFoundationVersion,
    status: ChannelConnectorFoundationStatus,
    stability: "Stable" as const,
    public: true as const,
    sourceReference: "channelConnectorFoundation.ts" as const,
  });

/** Additive public-surface registry — exactly eight top-level exports. */
const ChannelConnectorFoundationApiRegistry = Object.freeze([
  foundationApi("ChannelConnectorFoundationId", "IdentityConstant"),
  foundationApi("ChannelConnectorFoundationVersion", "IdentityConstant"),
  foundationApi("ChannelConnectorFoundationName", "IdentityConstant"),
  foundationApi("ChannelConnectorFoundationNamespace", "IdentityConstant"),
  foundationApi("ChannelConnectorFoundationStatus", "MetadataConstant"),
  foundationApi("ChannelConnectorFoundationReadiness", "MetadataConstant"),
  foundationApi("ChannelConnectorFoundationPlatform", "Aggregate"),
  foundationApi("getChannelConnectorFoundationSummary", "Helper"),
]);

const configurationContract = Object.freeze({
  endpointRef: "NEA-2:1/Config/EndpointRef",
  protocolRef: "NEA-2:1/Config/ProtocolRef",
  versionRef: "NEA-2:1/Config/VersionRef",
  timeoutRef: "NEA-2:1/Config/TimeoutRef",
  retryPolicyRef: "NEA-2:1/Config/RetryPolicyRef",
  credentialRef: "NEA-2:1/Config/CredentialRef",
  loadsConfiguration: false as const,
  metadataOnly: true as const,
});

const metadata = Object.freeze({
  metadataId: "NEA-2:1/ChannelConnectorFoundationMetadata",
  sourcePhase: "NEA-2:1" as const,
  foundationStatus: ChannelConnectorFoundationStatus,
  foundationVersion: ChannelConnectorFoundationVersion,
  publicIndexId: ExecutiveGatewayPublicIndexId,
  architectureVersion: "NEA-2.0.0" as const,
  contractCount: ChannelConnectorContractCatalog.contractCount,
  familyCount: ChannelConnectorContractCatalog.familyCount,
  typeCount: ChannelConnectorContractCatalog.typeCount,
  capabilityCount: ChannelConnectorCapabilityCatalog.capabilityCount,
  lifecycleStateCount: ChannelConnectorLifecycle.stateCount,
  healthStatusCount: ChannelConnectorLifecycle.healthStatusCount,
  nextPhase: "NEA-2:2 — Channel Connectors Registry",
  countsHardcoded: false as const,
  implementsConnectors: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

/**
 * Build deterministic frozen Foundation summary.
 * Counts are derived exclusively from canonical foundation collections.
 */
function buildChannelConnectorFoundationSummary(): ChannelConnectorFoundationSummary {
  return Object.freeze({
    foundationId: ChannelConnectorFoundationId,
    version: ChannelConnectorFoundationVersion,
    name: ChannelConnectorFoundationName,
    namespace: ChannelConnectorFoundationNamespace,
    layer: "NEA" as const,
    phase: "NEA-2:1" as const,
    status: ChannelConnectorFoundationStatus,
    readiness: ChannelConnectorFoundationReadiness,
    publicIndexId: ExecutiveGatewayPublicIndexId,
    contractCount: ChannelConnectorContractCatalog.contractCount,
    familyCount: ChannelConnectorContractCatalog.familyCount,
    typeCount: ChannelConnectorContractCatalog.typeCount,
    capabilityCount: ChannelConnectorCapabilityCatalog.capabilityCount,
    lifecycleStateCount: ChannelConnectorLifecycle.stateCount,
    healthStatusCount: ChannelConnectorLifecycle.healthStatusCount,
    ownershipCount: ChannelConnectorOwnership.ownsCount,
    nonOwnershipCount: ChannelConnectorOwnership.doesNotOwnCount,
    prohibitedSurfaceCount: ChannelConnectorBoundaries.prohibitedSurfaceCount,
    publicExportCount: 8 as const,
    sectionCount: PLATFORM_SECTIONS.length,
    nextPhase: metadata.nextPhase,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
}

/**
 * Canonical immutable Channel Connectors Foundation platform.
 * Metadata only. No runtime connectors.
 */
export const ChannelConnectorFoundationPlatform = Object.freeze({
  identity,
  dependency,
  contracts: ChannelConnectorContractCatalog,
  families: ChannelConnectorContractCatalog.families,
  types: ChannelConnectorContractCatalog.types,
  capabilities: ChannelConnectorCapabilityCatalog,
  lifecycle: ChannelConnectorLifecycle,
  ownership: ChannelConnectorOwnership,
  boundaries: ChannelConnectorBoundaries,
  metadata,
  summary: buildChannelConnectorFoundationSummary(),
  readiness: Object.freeze({
    readinessId: "NEA-2:1/FoundationReadiness",
    readiness: ChannelConnectorFoundationReadiness,
    nextPhase: metadata.nextPhase,
    claimsReadyForRegistry: true as const,
    claimsReadyForRuntime: false as const,
    claimsConnectorsImplemented: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  }),
  configuration: configurationContract,
  apiRegistry: ChannelConnectorFoundationApiRegistry,
  sectionOrder: PLATFORM_SECTIONS,
  sectionCount: PLATFORM_SECTIONS.length,
  status: ChannelConnectorFoundationStatus,
  nextPhase: metadata.nextPhase,
  downstreamReadiness: ChannelConnectorFoundationReadiness,
  metadataOnly: true as const,
  runtimeBehavior: false as const,
  runtimeEnforcement: false as const,
  implementsConnectors: false as const,
  networkCommunication: false as const,
  authenticationExecution: false as const,
  messageProcessing: false as const,
  aiReasoning: false as const,
  immutable: true as const,
  deterministic: true as const,
});

/**
 * Deterministic frozen Channel Connectors Foundation summary.
 * Counts are derived exclusively from canonical foundation collections.
 */
export function getChannelConnectorFoundationSummary(): ChannelConnectorFoundationSummary {
  return buildChannelConnectorFoundationSummary();
}
