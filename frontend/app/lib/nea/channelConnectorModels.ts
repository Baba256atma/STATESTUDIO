/**
 * NEA-2:3 — Channel Connector Domain Models.
 *
 * Immutable domain model kind declarations composed from Registry references.
 * Strongly typed structure only. No business logic. No runtime behavior.
 *
 * Ownership: owned exclusively by NEA-2:3.
 */

import {
  ChannelConnectorRegistryId,
  ChannelConnectorRegistryPlatform,
} from "./channelConnectorRegistry.ts";
import type {
  ChannelConnectorModelKindDescriptor,
  ConnectorIdentityModel,
} from "./channelConnectorModelTypes.ts";

const registry = ChannelConnectorRegistryPlatform;

const kind = (
  modelKind: ChannelConnectorModelKindDescriptor["modelKind"],
  modelName: string,
  description: string,
  registryCollections: ChannelConnectorModelKindDescriptor["registryCollections"],
  fieldCount: number,
  composesModels: ChannelConnectorModelKindDescriptor["composesModels"],
  order: number,
): ChannelConnectorModelKindDescriptor =>
  Object.freeze({
    modelKind,
    modelName,
    description,
    registryCollections: Object.freeze([...registryCollections]),
    fieldCount,
    composesModels: Object.freeze([...composesModels]),
    executesRuntime: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

/**
 * Exactly twenty Channel Connector domain model kinds.
 * Registry collections are referenced, never duplicated.
 */
export const ChannelConnectorDomainModels: readonly ChannelConnectorModelKindDescriptor[] =
  Object.freeze([
    kind(
      "ConnectorIdentity",
      "Connector Identity Model",
      "Immutable connector identity structure.",
      Object.freeze(["identities"]),
      8,
      Object.freeze([]),
      1,
    ),
    kind(
      "ConnectorDefinition",
      "Connector Definition Model",
      "Complete connector declaration composed from Registry references.",
      Object.freeze(["identities", "families", "types", "capabilities"]),
      10,
      Object.freeze([
        "ConnectorIdentity",
        "ConnectorFamily",
        "ConnectorType",
        "ConnectorCapability",
      ]),
      2,
    ),
    kind(
      "ConnectorFamily",
      "Connector Family Model",
      "Connector family metadata from Registry.",
      Object.freeze(["families"]),
      3,
      Object.freeze([]),
      3,
    ),
    kind(
      "ConnectorType",
      "Connector Type Model",
      "Connector type metadata from Registry.",
      Object.freeze(["types"]),
      4,
      Object.freeze(["ConnectorFamily"]),
      4,
    ),
    kind(
      "ConnectorProtocol",
      "Connector Protocol Model",
      "Protocol metadata only — no protocol implementation.",
      Object.freeze(["protocols"]),
      3,
      Object.freeze([]),
      5,
    ),
    kind(
      "ConnectorDirection",
      "Connector Direction Model",
      "Communication direction metadata.",
      Object.freeze(["directions"]),
      2,
      Object.freeze([]),
      6,
    ),
    kind(
      "ConnectorCapability",
      "Connector Capability Model",
      "Capability metadata — no execution.",
      Object.freeze(["capabilities"]),
      3,
      Object.freeze([]),
      7,
    ),
    kind(
      "ConnectorAuthentication",
      "Connector Authentication Model",
      "Authentication metadata only — no OAuth or token implementation.",
      Object.freeze(["authenticationMethods"]),
      3,
      Object.freeze([]),
      8,
    ),
    kind(
      "ConnectorHealth",
      "Connector Health Model",
      "Connector health metadata from Registry.",
      Object.freeze(["healthStates"]),
      2,
      Object.freeze([]),
      9,
    ),
    kind(
      "ConnectorStatus",
      "Connector Status Model",
      "Connector lifecycle status metadata.",
      Object.freeze(["statuses", "lifecycleStates"]),
      3,
      Object.freeze([]),
      10,
    ),
    kind(
      "ConnectorEvent",
      "Connector Event Model",
      "Supported connector events — no event processing.",
      Object.freeze(["eventTypes"]),
      3,
      Object.freeze([]),
      11,
    ),
    kind(
      "ConnectorPayload",
      "Connector Payload Model",
      "Payload category metadata — no payload parsing.",
      Object.freeze(["payloadTypes"]),
      3,
      Object.freeze([]),
      12,
    ),
    kind(
      "ConnectorPolicy",
      "Connector Policy Model",
      "Connector policy metadata — no policy execution.",
      Object.freeze(["policies"]),
      3,
      Object.freeze([]),
      13,
    ),
    kind(
      "ConnectorEndpoint",
      "Connector Endpoint Model",
      "Endpoint description only — no network communication.",
      Object.freeze(["protocols", "directions"]),
      4,
      Object.freeze(["ConnectorProtocol", "ConnectorDirection"]),
      14,
    ),
    kind(
      "ConnectorSession",
      "Connector Session Model",
      "Session metadata — no runtime session management.",
      Object.freeze(["identities"]),
      4,
      Object.freeze(["ConnectorIdentity"]),
      15,
    ),
    kind(
      "ConnectorMetadata",
      "Connector Metadata Model",
      "Immutable connector metadata structure.",
      Object.freeze(["identities"]),
      5,
      Object.freeze(["ConnectorIdentity"]),
      16,
    ),
    kind(
      "ConnectorConfiguration",
      "Connector Configuration Model",
      "Immutable configuration metadata — no executable configuration.",
      Object.freeze(["protocols", "authenticationMethods"]),
      6,
      Object.freeze(["ConnectorEndpoint", "ConnectorAuthentication"]),
      17,
    ),
    kind(
      "ConnectorDiagnostics",
      "Connector Diagnostics Model",
      "Connector diagnostics metadata structure.",
      Object.freeze(["healthStates", "eventTypes"]),
      4,
      Object.freeze(["ConnectorHealth", "ConnectorEvent"]),
      18,
    ),
    kind(
      "ConnectorResult",
      "Connector Result Model",
      "Connector processing metadata — no execution.",
      Object.freeze(["statuses", "eventTypes"]),
      5,
      Object.freeze(["ConnectorStatus", "ConnectorDiagnostics"]),
      19,
    ),
    kind(
      "ConnectorSummary",
      "Connector Summary Model",
      "Immutable connector summary composed from domain models.",
      Object.freeze(["identities", "capabilities", "statuses"]),
      8,
      Object.freeze([
        "ConnectorIdentity",
        "ConnectorDefinition",
        "ConnectorResult",
      ]),
      20,
    ),
  ]);

/**
 * Connector identity model instances derived from Registry identities.
 * Structure only — no connector implementation.
 */
export const ChannelConnectorIdentityModels: readonly ConnectorIdentityModel[] =
  Object.freeze(
    registry.collections.identities.map((item) =>
      Object.freeze({
        modelKind: "ConnectorIdentity" as const,
        connectorId: item.connectorId,
        connectorName: item.connectorName,
        connectorVersion: item.connectorVersion,
        connectorFamily: item.connectorFamily,
        connectorType: item.connectorType,
        connectorProtocol: item.connectorProtocol,
        connectorDirection: item.connectorDirection,
        connectorStatus: item.connectorStatus,
        registryIdentityRef: item.connectorId,
        implementsConnector: false as const,
        metadataOnly: true as const,
        immutable: true as const,
        deterministicOrder: item.deterministicOrder,
      }),
    ),
  );

/** Registry anchors — counts derived from Registry collections by reference. */
export const ChannelConnectorModelRegistryAnchors = Object.freeze({
  registryId: ChannelConnectorRegistryId,
  sourcePhase: "NEA-2:3" as const,
  familyCount: registry.collections.familyCount,
  typeCount: registry.collections.typeCount,
  identityCount: registry.collections.identityCount,
  protocolCount: registry.collections.protocolCount,
  directionCount: registry.collections.directionCount,
  authenticationMethodCount: registry.collections.authenticationMethodCount,
  lifecycleStateCount: registry.collections.lifecycleStateCount,
  healthStateCount: registry.collections.healthStateCount,
  statusCount: registry.collections.statusCount,
  eventTypeCount: registry.collections.eventTypeCount,
  payloadTypeCount: registry.collections.payloadTypeCount,
  capabilityCount: registry.capabilities.capabilityCount,
  policyCount: registry.policies.policyCount,
  duplicatesRegistryValues: false as const,
  preservesCanonicalReferences: true as const,
  metadataOnly: true as const,
  immutable: true as const,
});

/** Canonical immutable domain model catalog. */
export const ChannelConnectorDomainModelCatalog = Object.freeze({
  catalogId: "NEA-2:3/DomainModelCatalog",
  sourcePhase: "NEA-2:3" as const,
  models: ChannelConnectorDomainModels,
  modelCount: ChannelConnectorDomainModels.length,
  identityModels: ChannelConnectorIdentityModels,
  identityModelCount: ChannelConnectorIdentityModels.length,
  registryAnchors: ChannelConnectorModelRegistryAnchors,
  executesRuntime: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
