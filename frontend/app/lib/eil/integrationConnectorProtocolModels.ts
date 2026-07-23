/**
 * EIL-2:3 — Integration Connector Protocol Models.
 *
 * Immutable protocol architectural metadata derived from Registry references.
 * Descriptive only — no protocol implementation or networking.
 *
 * Ownership: owned exclusively by EIL-2:3.
 */

import { IntegrationConnectorRegistryIdentity } from "./integrationConnectorRegistry.ts";
import type {
  IntegrationConnectorProtocolFamily,
  IntegrationConnectorProtocolModel,
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

const protocol = (
  key: string,
  canonicalName: string,
  description: string,
  protocolFamily: IntegrationConnectorProtocolFamily,
  classification: string,
  compatibility: string,
  scope: string,
  ordinal: number,
  tags: readonly string[],
): IntegrationConnectorProtocolModel =>
  Object.freeze({
    protocolModelId: `EIL-2:3/Protocol/${key}` as const,
    canonicalKey: key,
    canonicalName,
    description,
    protocolFamily,
    classification,
    compatibility,
    lifecycle: "Verified" as const,
    ownership: "EIL-2:3" as const,
    scope,
    protocolVersionMetadata: "1.0.0" as const,
    sourceRegistryReference: registryRef("contracts", "ProtocolContract"),
    version: "1.0.0" as const,
    ordinal,
    tags: Object.freeze([...tags]),
    implementsProtocol: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

/**
 * Exactly eight connector protocol models.
 * Descriptive metadata only.
 */
export const IntegrationConnectorProtocolModels: readonly IntegrationConnectorProtocolModel[] =
  Object.freeze([
    protocol(
      "ApiProtocolMetadata",
      "API Protocol Metadata",
      "Declarative API protocol family metadata without HTTP clients.",
      "ApiMetadata",
      "ApiFamily",
      "ApiCompatible",
      "ConnectorApiSurface",
      1,
      Object.freeze(["protocol", "api"]),
    ),
    protocol(
      "EventProtocolMetadata",
      "Event Protocol Metadata",
      "Declarative event protocol family metadata without event buses.",
      "EventMetadata",
      "EventFamily",
      "EventCompatible",
      "ConnectorEventSurface",
      2,
      Object.freeze(["protocol", "event"]),
    ),
    protocol(
      "MessageProtocolMetadata",
      "Message Protocol Metadata",
      "Declarative message protocol family metadata without brokers.",
      "MessageMetadata",
      "MessageFamily",
      "MessageCompatible",
      "ConnectorMessageSurface",
      3,
      Object.freeze(["protocol", "message"]),
    ),
    protocol(
      "FileProtocolMetadata",
      "File Protocol Metadata",
      "Declarative file protocol family metadata without filesystem I/O.",
      "FileMetadata",
      "FileFamily",
      "FileCompatible",
      "ConnectorFileSurface",
      4,
      Object.freeze(["protocol", "file"]),
    ),
    protocol(
      "DatabaseProtocolMetadata",
      "Database Protocol Metadata",
      "Declarative database protocol family metadata without persistence.",
      "DatabaseMetadata",
      "DatabaseFamily",
      "DatabaseCompatible",
      "ConnectorDatabaseSurface",
      5,
      Object.freeze(["protocol", "database"]),
    ),
    protocol(
      "ServiceProtocolMetadata",
      "Service Protocol Metadata",
      "Declarative service protocol family metadata without service runtime.",
      "ServiceMetadata",
      "ServiceFamily",
      "ServiceCompatible",
      "ConnectorServiceSurface",
      6,
      Object.freeze(["protocol", "service"]),
    ),
    protocol(
      "GatewayProtocolMetadata",
      "Gateway Protocol Metadata",
      "Declarative gateway protocol family metadata without gateway runtime.",
      "GatewayMetadata",
      "GatewayFamily",
      "GatewayCompatible",
      "ConnectorGatewaySurface",
      7,
      Object.freeze(["protocol", "gateway"]),
    ),
    protocol(
      "CustomProtocolMetadata",
      "Custom Protocol Metadata",
      "Declarative custom protocol family metadata without custom adapters.",
      "CustomMetadata",
      "CustomFamily",
      "CustomCompatible",
      "ConnectorCustomSurface",
      8,
      Object.freeze(["protocol", "custom"]),
    ),
  ]);
