/**
 * EIL-2:3 — Integration Connector Endpoint Models.
 *
 * Immutable endpoint architectural metadata derived from Registry references.
 * Descriptions only — no communication or transport.
 *
 * Ownership: owned exclusively by EIL-2:3.
 */

import { IntegrationConnectorRegistryIdentity } from "./integrationConnectorRegistry.ts";
import type {
  IntegrationConnectorEndpointModel,
  IntegrationConnectorEndpointRole,
  IntegrationConnectorEndpointType,
  IntegrationConnectorEndpointVisibility,
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

const endpoint = (
  key: string,
  canonicalName: string,
  description: string,
  endpointType: IntegrationConnectorEndpointType,
  endpointRole: IntegrationConnectorEndpointRole,
  visibility: IntegrationConnectorEndpointVisibility,
  classification: string,
  compatibility: string,
  entryKey: string,
  ordinal: number,
  tags: readonly string[],
): IntegrationConnectorEndpointModel =>
  Object.freeze({
    endpointModelId: `EIL-2:3/Endpoint/${key}` as const,
    canonicalKey: key,
    canonicalName,
    description,
    endpointType,
    endpointRole,
    visibility,
    classification,
    compatibility,
    lifecycle: "Verified" as const,
    ownership: "EIL-2:3" as const,
    sourceRegistryReference: registryRef("contracts", entryKey),
    version: "1.0.0" as const,
    ordinal,
    tags: Object.freeze([...tags]),
    communicates: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

/**
 * Exactly eight connector endpoint models.
 * Architectural descriptions only.
 */
export const IntegrationConnectorEndpointModels: readonly IntegrationConnectorEndpointModel[] =
  Object.freeze([
    endpoint(
      "IngressApiEndpoint",
      "Ingress API Endpoint",
      "Declarative ingress API endpoint metadata.",
      "Ingress",
      "Consumer",
      "Internal",
      "ApiIngress",
      "ApiCompatible",
      "EndpointContract",
      1,
      Object.freeze(["endpoint", "ingress", "api"]),
    ),
    endpoint(
      "EgressApiEndpoint",
      "Egress API Endpoint",
      "Declarative egress API endpoint metadata.",
      "Egress",
      "Producer",
      "External",
      "ApiEgress",
      "ApiCompatible",
      "EndpointContract",
      2,
      Object.freeze(["endpoint", "egress", "api"]),
    ),
    endpoint(
      "BidirectionalGatewayEndpoint",
      "Bidirectional Gateway Endpoint",
      "Declarative bidirectional gateway endpoint metadata.",
      "Bidirectional",
      "Gateway",
      "Shared",
      "GatewayBridge",
      "GatewayCompatible",
      "EndpointContract",
      3,
      Object.freeze(["endpoint", "gateway"]),
    ),
    endpoint(
      "ControlPlaneEndpoint",
      "Control Plane Endpoint",
      "Declarative control-plane endpoint metadata.",
      "Control",
      "Observer",
      "Internal",
      "ControlPlane",
      "ControlCompatible",
      "EndpointContract",
      4,
      Object.freeze(["endpoint", "control"]),
    ),
    endpoint(
      "DataPlaneEndpoint",
      "Data Plane Endpoint",
      "Declarative data-plane endpoint metadata.",
      "Data",
      "Bridge",
      "Shared",
      "DataPlane",
      "DataCompatible",
      "EndpointContract",
      5,
      Object.freeze(["endpoint", "data"]),
    ),
    endpoint(
      "EventIngressEndpoint",
      "Event Ingress Endpoint",
      "Declarative event ingress endpoint metadata.",
      "Event",
      "Consumer",
      "Internal",
      "EventIngress",
      "EventCompatible",
      "EndpointContract",
      6,
      Object.freeze(["endpoint", "event"]),
    ),
    endpoint(
      "FileTransferEndpoint",
      "File Transfer Endpoint",
      "Declarative file-transfer endpoint metadata.",
      "File",
      "Producer",
      "External",
      "FileTransfer",
      "FileCompatible",
      "EndpointContract",
      7,
      Object.freeze(["endpoint", "file"]),
    ),
    endpoint(
      "ServiceBridgeEndpoint",
      "Service Bridge Endpoint",
      "Declarative service-bridge endpoint metadata.",
      "Service",
      "Bridge",
      "Shared",
      "ServiceBridge",
      "ServiceCompatible",
      "EndpointContract",
      8,
      Object.freeze(["endpoint", "service"]),
    ),
  ]);
