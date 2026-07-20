/**
 * NEA-2:2 — Channel Connectors Registry.
 *
 * Canonical immutable registry for Channel Connector vocabularies and lookups.
 * Consumes only NEA-2:1 Channel Connectors Foundation public surface.
 * Metadata-only. Runtime-free. Ready for Model.
 *
 * Ownership: owned exclusively by NEA-2:2.
 *
 * Public exports (exactly 8):
 *   ChannelConnectorRegistryId
 *   ChannelConnectorRegistryVersion
 *   ChannelConnectorRegistryName
 *   ChannelConnectorRegistryNamespace
 *   ChannelConnectorRegistryStatus
 *   ChannelConnectorRegistryReadiness
 *   ChannelConnectorRegistryPlatform
 *   getChannelConnectorRegistrySummary()
 */

import {
  ChannelConnectorFoundationId,
  ChannelConnectorFoundationPlatform,
  ChannelConnectorFoundationVersion,
} from "./channelConnectorFoundation.ts";
import { ChannelConnectorCapabilityRegistryCatalog } from "./channelConnectorRegistryCapabilities.ts";
import { ChannelConnectorRegistryCollections } from "./channelConnectorRegistryCollections.ts";
import { ChannelConnectorRegistryMetadata } from "./channelConnectorRegistryMetadata.ts";
import {
  ChannelConnectorRegistryBoundaries,
  ChannelConnectorRegistryOwnership,
} from "./channelConnectorRegistryOwnership.ts";
import { ChannelConnectorPolicyRegistryCatalog } from "./channelConnectorRegistryPolicies.ts";
import type {
  ChannelConnectorRegistryIdentity,
  ChannelConnectorRegistrySummary,
} from "./channelConnectorRegistryTypes.ts";

/** Canonical registry identity. */
export const ChannelConnectorRegistryId =
  "NEA-2:2/ChannelConnectorRegistry" as const;

/** Human-readable registry name. */
export const ChannelConnectorRegistryName =
  "Channel Connectors Registry" as const;

/** Semantic version. */
export const ChannelConnectorRegistryVersion = "1.0.0" as const;

/** Canonical namespace. */
export const ChannelConnectorRegistryNamespace =
  "nexora.nea.channel-connectors.registry" as const;

/** Registry status. */
export const ChannelConnectorRegistryStatus = "Registry" as const;

/** Immediate next-phase readiness. */
export const ChannelConnectorRegistryReadiness = "ReadyForModel" as const;

const identity: ChannelConnectorRegistryIdentity = Object.freeze({
  registryId: ChannelConnectorRegistryId,
  registryName: ChannelConnectorRegistryName,
  registryVersion: ChannelConnectorRegistryVersion,
  registryNamespace: ChannelConnectorRegistryNamespace,
  layer: "NEA" as const,
  phase: "NEA-2:2" as const,
  stage: "Registry" as const,
  sourcePhase: "NEA-2:2" as const,
  owner: "NEA-2 Channel Connectors",
  status: ChannelConnectorRegistryStatus,
  readiness: ChannelConnectorRegistryReadiness,
  foundationId: ChannelConnectorFoundationId,
  foundationVersion: ChannelConnectorFoundationVersion,
  description:
    "Canonical immutable registry of Channel Connector families, types, identities, protocols, directions, authentication methods, capabilities, lifecycle, health, statuses, events, payloads, and policies.",
  metadataOnly: true as const,
  immutable: true as const,
});

const dependency = Object.freeze({
  dependencyId: "NEA-2:2/Dependency/NEA21Foundation",
  directPreviousPhaseModule: "channelConnectorFoundation.ts" as const,
  foundationOnly: true as const,
  foundationId: ChannelConnectorFoundationId,
  foundationVersion: ChannelConnectorFoundationVersion,
  foundationPublicSurfaceOnly: true as const,
  publicIndexDirectImport: false as const,
  laterNeaPhaseImport: false as const,
  dklInternalImport: false as const,
  engineInternalImport: false as const,
  assistantInternalImport: false as const,
  reconstructsFoundation: false as const,
  duplicatesFoundationValues: false as const,
  canonicalPath:
    "NEA-2:2 → NEA-2:1 ChannelConnectorFoundationPlatform (exclusive)",
  runtimeBehavior: "None" as const,
  metadataOnly: true as const,
});

const PLATFORM_SECTIONS = Object.freeze([
  "identity",
  "dependency",
  "collections",
  "capabilities",
  "policies",
  "metadata",
  "ownership",
  "boundaries",
  "readiness",
] as const);

const registryApi = (
  exportName: string,
  kind:
    | "Aggregate"
    | "IdentityConstant"
    | "MetadataConstant"
    | "Helper",
) =>
  Object.freeze({
    id: `NEA-2:2/PublicApi/${exportName}`,
    exportName,
    phase: "NEA-2:2" as const,
    section: "Registry" as const,
    kind,
    version: ChannelConnectorRegistryVersion,
    status: ChannelConnectorRegistryStatus,
    stability: "Stable" as const,
    public: true as const,
    sourceReference: "channelConnectorRegistry.ts" as const,
  });

/** Additive public-surface registry — exactly eight top-level exports. */
const ChannelConnectorRegistryApiRegistry = Object.freeze([
  registryApi("ChannelConnectorRegistryId", "IdentityConstant"),
  registryApi("ChannelConnectorRegistryVersion", "IdentityConstant"),
  registryApi("ChannelConnectorRegistryName", "IdentityConstant"),
  registryApi("ChannelConnectorRegistryNamespace", "IdentityConstant"),
  registryApi("ChannelConnectorRegistryStatus", "MetadataConstant"),
  registryApi("ChannelConnectorRegistryReadiness", "MetadataConstant"),
  registryApi("ChannelConnectorRegistryPlatform", "Aggregate"),
  registryApi("getChannelConnectorRegistrySummary", "Helper"),
]);

/**
 * Canonical immutable Channel Connectors Registry platform.
 * Nine ordered sections. Metadata only.
 */
export const ChannelConnectorRegistryPlatform = Object.freeze({
  identity,
  dependency,
  collections: ChannelConnectorRegistryCollections,
  capabilities: ChannelConnectorCapabilityRegistryCatalog,
  policies: ChannelConnectorPolicyRegistryCatalog,
  metadata: ChannelConnectorRegistryMetadata,
  ownership: ChannelConnectorRegistryOwnership,
  boundaries: ChannelConnectorRegistryBoundaries,
  readiness: Object.freeze({
    readinessId: "NEA-2:2/RegistryReadiness",
    readiness: ChannelConnectorRegistryReadiness,
    nextPhase: ChannelConnectorRegistryMetadata.nextPhase,
    claimsReadyForModel: true as const,
    claimsReadyForRuntime: false as const,
    claimsConnectorsImplemented: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  }),
  apiRegistry: ChannelConnectorRegistryApiRegistry,
  sectionOrder: PLATFORM_SECTIONS,
  sectionCount: PLATFORM_SECTIONS.length,
  status: ChannelConnectorRegistryStatus,
  nextPhase: ChannelConnectorRegistryMetadata.nextPhase,
  downstreamReadiness: ChannelConnectorRegistryReadiness,
  foundationPlatform: ChannelConnectorFoundationPlatform,
  metadataOnly: true as const,
  runtimeBehavior: false as const,
  runtimeEnforcement: false as const,
  implementsConnectors: false as const,
  networkingBehavior: false as const,
  oauthFlow: false as const,
  messageProcessing: false as const,
  persistenceBehavior: false as const,
  aiReasoning: false as const,
  immutable: true as const,
  deterministic: true as const,
});

/**
 * Deterministic frozen Channel Connectors Registry summary.
 * Counts are derived exclusively from canonical registry collections.
 */
export function getChannelConnectorRegistrySummary(): ChannelConnectorRegistrySummary {
  const meta = ChannelConnectorRegistryMetadata;
  return Object.freeze({
    registryId: ChannelConnectorRegistryId,
    version: ChannelConnectorRegistryVersion,
    name: ChannelConnectorRegistryName,
    namespace: ChannelConnectorRegistryNamespace,
    layer: "NEA" as const,
    phase: "NEA-2:2" as const,
    status: ChannelConnectorRegistryStatus,
    readiness: ChannelConnectorRegistryReadiness,
    foundationId: ChannelConnectorFoundationId,
    familyCount: meta.familyCount,
    typeCount: meta.typeCount,
    identityCount: meta.identityCount,
    protocolCount: meta.protocolCount,
    directionCount: meta.directionCount,
    authenticationMethodCount: meta.authenticationMethodCount,
    capabilityCount: meta.capabilityCount,
    lifecycleStateCount: meta.lifecycleStateCount,
    healthStateCount: meta.healthStateCount,
    statusCount: meta.statusCount,
    eventTypeCount: meta.eventTypeCount,
    payloadTypeCount: meta.payloadTypeCount,
    policyCount: meta.policyCount,
    totalRegistryEntryCount: meta.totalEntryCount,
    publicExportCount: 8 as const,
    sectionCount: PLATFORM_SECTIONS.length,
    nextPhase: meta.nextPhase,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
}
