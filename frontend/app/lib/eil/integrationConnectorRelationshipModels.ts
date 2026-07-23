/**
 * EIL-2:3 — Integration Connector Relationship Models.
 *
 * Canonical descriptive relationships between connector domain models.
 * Metadata only — no relationship resolution or execution.
 *
 * Ownership: owned exclusively by EIL-2:3.
 */

import { IntegrationConnectorRegistryIdentity } from "./integrationConnectorRegistry.ts";
import type {
  IntegrationConnectorRegistryReference,
  IntegrationConnectorRelationshipModel,
  IntegrationConnectorRelationshipType,
} from "./integrationConnectorModelTypes.ts";

const registryRef = (
  collection: IntegrationConnectorRegistryReference["collection"],
  entryKey: string,
): IntegrationConnectorRegistryReference =>
  Object.freeze({
    registryId: IntegrationConnectorRegistryIdentity.canonicalId,
    registryNamespace: IntegrationConnectorRegistryIdentity.namespace,
    entryPoint: "integrationConnectorRegistry.ts" as const,
    collection,
    entryKey,
    preservesCanonicalReference: true as const,
    duplicatesRegistryValue: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

const relationship = (
  key: string,
  relationshipType: IntegrationConnectorRelationshipType,
  canonicalName: string,
  description: string,
  sourceModelKey: string,
  targetModelKey: string,
  collection: IntegrationConnectorRegistryReference["collection"],
  entryKey: string,
  ordinal: number,
  tags: readonly string[],
): IntegrationConnectorRelationshipModel =>
  Object.freeze({
    relationshipId: `EIL-2:3/Relationship/${key}` as const,
    relationshipType,
    canonicalKey: key,
    canonicalName,
    description,
    sourceModelKey,
    targetModelKey,
    sourceRegistryReference: registryRef(collection, entryKey),
    ownership: "EIL-2:3" as const,
    lifecycle: "Verified" as const,
    version: "1.0.0" as const,
    ordinal,
    tags: Object.freeze([...tags]),
    resolvesRuntime: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

/**
 * Exactly twelve relationship declarations covering every relationship type.
 * Descriptive metadata only.
 */
export const IntegrationConnectorRelationshipModels: readonly IntegrationConnectorRelationshipModel[] =
  Object.freeze([
    relationship(
      "ConnectorOwnsEndpoint",
      "owns",
      "Connector → Endpoint",
      "Connector owns endpoint definition metadata.",
      "Connector",
      "ConnectorEndpoint",
      "contracts",
      "EndpointContract",
      1,
      Object.freeze(["owns", "endpoint"]),
    ),
    relationship(
      "ConnectorReferencesProtocol",
      "references",
      "Connector → Protocol",
      "Connector references protocol declaration metadata.",
      "Connector",
      "ConnectorProtocol",
      "contracts",
      "ProtocolContract",
      2,
      Object.freeze(["references", "protocol"]),
    ),
    relationship(
      "ConnectorDependsOnConfiguration",
      "dependsOn",
      "Connector → Configuration",
      "Connector depends on configuration metadata.",
      "Connector",
      "ConnectorConfiguration",
      "contracts",
      "ConfigurationContract",
      3,
      Object.freeze(["dependsOn", "configuration"]),
    ),
    relationship(
      "ConnectorCompatibleWithCategory",
      "compatibleWith",
      "Connector → Category",
      "Connector is compatible with category classification metadata.",
      "Connector",
      "ConnectorCategory",
      "categories",
      "ApiConnector",
      4,
      Object.freeze(["compatibleWith", "category"]),
    ),
    relationship(
      "PayloadMappedToMapping",
      "mappedTo",
      "Payload → Mapping",
      "Payload model maps to mapping model metadata.",
      "ConnectorPayload",
      "ConnectorMapping",
      "contracts",
      "MappingContract",
      5,
      Object.freeze(["mappedTo", "payload"]),
    ),
    relationship(
      "EndpointConnectedToRoute",
      "connectedTo",
      "Endpoint → Route",
      "Endpoint connects to route metadata.",
      "ConnectorEndpoint",
      "ConnectorRoute",
      "capabilities",
      "EndpointDescription",
      6,
      Object.freeze(["connectedTo", "route"]),
    ),
    relationship(
      "ConnectorExposesEndpoint",
      "exposes",
      "Connector → Endpoint",
      "Connector exposes endpoint surface metadata.",
      "Connector",
      "ConnectorEndpoint",
      "contracts",
      "ConnectorContract",
      7,
      Object.freeze(["exposes", "endpoint"]),
    ),
    relationship(
      "EndpointBelongsToConnector",
      "belongsTo",
      "Endpoint → Connector",
      "Endpoint belongs to connector definition metadata.",
      "ConnectorEndpoint",
      "Connector",
      "contracts",
      "EndpointContract",
      8,
      Object.freeze(["belongsTo", "connector"]),
    ),
    relationship(
      "CompatibilityExtendsLifecycle",
      "extends",
      "Compatibility → Lifecycle",
      "Compatibility metadata extends lifecycle mapping metadata.",
      "ConnectorCompatibility",
      "ConnectorLifecycle",
      "contracts",
      "LifecycleContract",
      9,
      Object.freeze(["extends", "lifecycle"]),
    ),
    relationship(
      "TopologyComposedOfRoutes",
      "composedOf",
      "Topology → Route",
      "Topology is composed of route metadata.",
      "ConnectorTopology",
      "ConnectorRoute",
      "collections",
      "collections",
      10,
      Object.freeze(["composedOf", "topology"]),
    ),
    relationship(
      "AuthenticationSecuresEndpoint",
      "secures",
      "Authentication → Endpoint",
      "Authentication metadata secures endpoint metadata.",
      "ConnectorAuthentication",
      "ConnectorEndpoint",
      "contracts",
      "AuthenticationContract",
      11,
      Object.freeze(["secures", "authentication"]),
    ),
    relationship(
      "ProtocolTransportsPayload",
      "transports",
      "Protocol → Payload",
      "Protocol metadata describes payload transport architecture only.",
      "ConnectorProtocol",
      "ConnectorPayload",
      "contracts",
      "PayloadContract",
      12,
      Object.freeze(["transports", "protocol"]),
    ),
  ]);

/** Exactly twelve relationship types covered by the relationship models. */
export const IntegrationConnectorRelationshipTypes = Object.freeze([
  "owns",
  "references",
  "dependsOn",
  "compatibleWith",
  "mappedTo",
  "connectedTo",
  "exposes",
  "belongsTo",
  "extends",
  "composedOf",
  "secures",
  "transports",
] as const satisfies readonly IntegrationConnectorRelationshipType[]);
