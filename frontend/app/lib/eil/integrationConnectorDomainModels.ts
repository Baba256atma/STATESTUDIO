/**
 * EIL-2:3 — Integration Connector Domain Models.
 *
 * Immutable architectural domain models derived from Registry references.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by EIL-2:3.
 */

import { IntegrationConnectorRegistryIdentity } from "./integrationConnectorRegistry.ts";
import type {
  IntegrationConnectorDomainModel,
  IntegrationConnectorModelCategory,
  IntegrationConnectorRegistryReference,
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

const domainModel = (
  key: string,
  canonicalName: string,
  category: IntegrationConnectorModelCategory,
  description: string,
  collection: IntegrationConnectorRegistryReference["collection"],
  entryKey: string,
  ordinal: number,
  tags: readonly string[],
): IntegrationConnectorDomainModel =>
  Object.freeze({
    modelId: `EIL-2:3/Model/${key}` as const,
    canonicalKey: key,
    canonicalName,
    description,
    category,
    sourceRegistryReference: registryRef(collection, entryKey),
    ownership: "EIL-2:3" as const,
    lifecycle: "Verified" as const,
    version: "1.0.0" as const,
    ordinal,
    tags: Object.freeze([...tags]),
    executesRuntime: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

/**
 * Exactly sixteen canonical connector domain model definitions.
 * Registry collections are referenced, never duplicated.
 */
export const IntegrationConnectorDomainModels: readonly IntegrationConnectorDomainModel[] =
  Object.freeze([
    domainModel(
      "Connector",
      "Connector",
      "Connector",
      "Root architectural model for an integration connector definition.",
      "collections",
      "collections",
      1,
      Object.freeze(["domain", "root"]),
    ),
    domainModel(
      "ConnectorEndpoint",
      "Connector Endpoint",
      "ConnectorEndpoint",
      "Architectural endpoint definition for a connector surface.",
      "contracts",
      "EndpointContract",
      2,
      Object.freeze(["domain", "endpoint"]),
    ),
    domainModel(
      "ConnectorProtocol",
      "Connector Protocol",
      "ConnectorProtocol",
      "Architectural protocol declaration for a connector surface.",
      "contracts",
      "ProtocolContract",
      3,
      Object.freeze(["domain", "protocol"]),
    ),
    domainModel(
      "ConnectorConfiguration",
      "Connector Configuration",
      "ConnectorConfiguration",
      "Architectural configuration metadata for a connector definition.",
      "contracts",
      "ConfigurationContract",
      4,
      Object.freeze(["domain", "configuration"]),
    ),
    domainModel(
      "ConnectorAuthentication",
      "Connector Authentication",
      "ConnectorAuthentication",
      "Architectural authentication metadata without credential handling.",
      "contracts",
      "AuthenticationContract",
      5,
      Object.freeze(["domain", "authentication"]),
    ),
    domainModel(
      "ConnectorAuthorization",
      "Connector Authorization",
      "ConnectorAuthorization",
      "Architectural authorization metadata without policy evaluation.",
      "contracts",
      "AuthorizationContract",
      6,
      Object.freeze(["domain", "authorization"]),
    ),
    domainModel(
      "ConnectorPayload",
      "Connector Payload",
      "ConnectorPayload",
      "Architectural payload shape metadata without transport.",
      "contracts",
      "PayloadContract",
      7,
      Object.freeze(["domain", "payload"]),
    ),
    domainModel(
      "ConnectorMapping",
      "Connector Mapping",
      "ConnectorMapping",
      "Architectural mapping metadata between connector payloads.",
      "contracts",
      "MappingContract",
      8,
      Object.freeze(["domain", "mapping"]),
    ),
    domainModel(
      "ConnectorCompatibility",
      "Connector Compatibility",
      "ConnectorCompatibility",
      "Architectural compatibility metadata for connector definitions.",
      "contracts",
      "CompatibilityContract",
      9,
      Object.freeze(["domain", "compatibility"]),
    ),
    domainModel(
      "ConnectorLifecycle",
      "Connector Lifecycle",
      "ConnectorLifecycle",
      "Architectural lifecycle mapping for connector definitions.",
      "contracts",
      "LifecycleContract",
      10,
      Object.freeze(["domain", "lifecycle"]),
    ),
    domainModel(
      "ConnectorCategory",
      "Connector Category",
      "ConnectorCategory",
      "Architectural category classification for connector definitions.",
      "categories",
      "ApiConnector",
      11,
      Object.freeze(["domain", "category"]),
    ),
    domainModel(
      "ConnectorOwnership",
      "Connector Ownership",
      "ConnectorOwnership",
      "Architectural ownership metadata for connector definitions.",
      "ownershipCoverage",
      "1",
      12,
      Object.freeze(["domain", "ownership"]),
    ),
    domainModel(
      "ConnectorDependency",
      "Connector Dependency",
      "ConnectorDependency",
      "Architectural dependency metadata preserving approved direction.",
      "responsibilities",
      "PreserveDependencyDirection",
      13,
      Object.freeze(["domain", "dependency"]),
    ),
    domainModel(
      "ConnectorContext",
      "Connector Context",
      "ConnectorContext",
      "Architectural context metadata surrounding a connector definition.",
      "capabilities",
      "ConnectorDiscoveryMetadata",
      14,
      Object.freeze(["domain", "context"]),
    ),
    domainModel(
      "ConnectorRoute",
      "Connector Route",
      "ConnectorRoute",
      "Architectural route metadata for connector coordination paths.",
      "capabilities",
      "EndpointDescription",
      15,
      Object.freeze(["domain", "route"]),
    ),
    domainModel(
      "ConnectorTopology",
      "Connector Topology",
      "ConnectorTopology",
      "Architectural topology metadata for connector relationships.",
      "collections",
      "collections",
      16,
      Object.freeze(["domain", "topology"]),
    ),
  ]);
