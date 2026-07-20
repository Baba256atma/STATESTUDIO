/**
 * NEA-2:2 — Channel Connectors Registry Collections.
 *
 * Canonical immutable registry collections.
 * Foundation families, types, and lifecycle are referenced — not duplicated.
 * Registry-owned vocabularies are declared here.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by NEA-2:2.
 */

import {
  ChannelConnectorFoundationId,
  ChannelConnectorFoundationPlatform,
} from "./channelConnectorFoundation.ts";
import type {
  ChannelConnectorAuthenticationMethodId,
  ChannelConnectorDirectionId,
  ChannelConnectorEventTypeId,
  ChannelConnectorIdentityDeclaration,
  ChannelConnectorPayloadTypeId,
  ChannelConnectorProtocolId,
  ChannelConnectorRegistryEntry,
  ChannelConnectorRegistryHealthId,
  ChannelConnectorStatusId,
} from "./channelConnectorRegistryTypes.ts";

const foundation = ChannelConnectorFoundationPlatform;

const entry = (
  id: string,
  label: string,
  description: string,
  sourcePhase: "NEA-2:1" | "NEA-2:2",
  foundationReference: string | null,
  order: number,
): ChannelConnectorRegistryEntry =>
  Object.freeze({
    id,
    label,
    description,
    sourcePhase,
    foundationReference,
    executesRuntime: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

/** Family registry — Foundation canonical references preserved. */
export const ChannelConnectorFamilyRegistry: readonly ChannelConnectorRegistryEntry[] =
  Object.freeze(
    foundation.families.map((item) =>
      entry(
        item.familyId,
        item.familyName,
        item.description,
        "NEA-2:1",
        `${ChannelConnectorFoundationId}/families/${item.familyId}`,
        item.deterministicOrder,
      ),
    ),
  );

/** Type registry — Foundation canonical references preserved. */
export const ChannelConnectorTypeRegistry: readonly ChannelConnectorRegistryEntry[] =
  Object.freeze(
    foundation.types.map((item) =>
      entry(
        item.typeId,
        item.typeName,
        item.description,
        "NEA-2:1",
        `${ChannelConnectorFoundationId}/types/${item.typeId}`,
        item.deterministicOrder,
      ),
    ),
  );

/** Lifecycle registry — Foundation canonical references preserved. */
export const ChannelConnectorLifecycleRegistry: readonly ChannelConnectorRegistryEntry[] =
  Object.freeze(
    foundation.lifecycle.states.map((state, index) =>
      entry(
        state,
        state,
        `Foundation lifecycle state ${state}.`,
        "NEA-2:1",
        `${ChannelConnectorFoundationId}/lifecycle/${state}`,
        index + 1,
      ),
    ),
  );

const protocol = (
  id: ChannelConnectorProtocolId,
  description: string,
  order: number,
): ChannelConnectorRegistryEntry =>
  entry(id, id, description, "NEA-2:2", null, order);

/** Protocol registry — Registry-owned. */
export const ChannelConnectorProtocolRegistry: readonly ChannelConnectorRegistryEntry[] =
  Object.freeze([
    protocol("HTTPS", "HTTPS protocol declaration.", 1),
    protocol("WebSocket", "WebSocket protocol declaration.", 2),
    protocol("SMTP", "SMTP protocol declaration.", 3),
    protocol("IMAP", "IMAP protocol declaration.", 4),
    protocol("POP3", "POP3 protocol declaration.", 5),
    protocol("SIP", "SIP protocol declaration.", 6),
    protocol("REST", "REST protocol declaration.", 7),
    protocol("MCP", "MCP protocol declaration.", 8),
    protocol("SDK", "SDK protocol declaration.", 9),
    protocol("Custom", "Custom protocol declaration.", 10),
  ]);

const direction = (
  id: ChannelConnectorDirectionId,
  description: string,
  order: number,
): ChannelConnectorRegistryEntry =>
  entry(id, id, description, "NEA-2:2", null, order);

/** Direction registry — Registry-owned. */
export const ChannelConnectorDirectionRegistry: readonly ChannelConnectorRegistryEntry[] =
  Object.freeze([
    direction("Inbound", "Inbound connector direction.", 1),
    direction("Outbound", "Outbound connector direction.", 2),
    direction("Bidirectional", "Bidirectional connector direction.", 3),
  ]);

const authMethod = (
  id: ChannelConnectorAuthenticationMethodId,
  label: string,
  description: string,
  order: number,
): ChannelConnectorRegistryEntry =>
  entry(id, label, description, "NEA-2:2", null, order);

/** Authentication method registry — declarations only. */
export const ChannelConnectorAuthenticationMethodRegistry: readonly ChannelConnectorRegistryEntry[] =
  Object.freeze([
    authMethod("OAuth2", "OAuth2", "OAuth2 authentication method declaration.", 1),
    authMethod("ApiKey", "API Key", "API key authentication method declaration.", 2),
    authMethod(
      "BearerToken",
      "Bearer Token",
      "Bearer token authentication method declaration.",
      3,
    ),
    authMethod(
      "BasicAuthentication",
      "Basic Authentication",
      "Basic authentication method declaration.",
      4,
    ),
    authMethod(
      "Certificate",
      "Certificate",
      "Certificate authentication method declaration.",
      5,
    ),
    authMethod(
      "Anonymous",
      "Anonymous",
      "Anonymous authentication method declaration.",
      6,
    ),
    authMethod("Custom", "Custom", "Custom authentication method declaration.", 7),
  ]);

const status = (
  id: ChannelConnectorStatusId,
  description: string,
  order: number,
): ChannelConnectorRegistryEntry =>
  entry(id, id, description, "NEA-2:2", null, order);

/** Status registry — Registry-owned. */
export const ChannelConnectorStatusRegistry: readonly ChannelConnectorRegistryEntry[] =
  Object.freeze([
    status("Declared", "Connector declared in architecture.", 1),
    status("Registered", "Connector registered in registry.", 2),
    status("Certified", "Connector certified for freeze baseline.", 3),
    status("Frozen", "Connector frozen as stable baseline.", 4),
    status("Deprecated", "Connector marked deprecated.", 5),
  ]);

const health = (
  id: ChannelConnectorRegistryHealthId,
  description: string,
  order: number,
): ChannelConnectorRegistryEntry =>
  entry(id, id, description, "NEA-2:2", null, order);

/** Health registry — Registry-owned. */
export const ChannelConnectorHealthRegistry: readonly ChannelConnectorRegistryEntry[] =
  Object.freeze([
    health("Healthy", "Connector health declared healthy.", 1),
    health("Degraded", "Connector health declared degraded.", 2),
    health("Offline", "Connector health declared offline.", 3),
    health("Maintenance", "Connector health declared maintenance.", 4),
    health("Unknown", "Connector health declared unknown.", 5),
  ]);

const eventType = (
  id: ChannelConnectorEventTypeId,
  description: string,
  order: number,
): ChannelConnectorRegistryEntry =>
  entry(id, id, description, "NEA-2:2", null, order);

/** Event type registry — Registry-owned. */
export const ChannelConnectorEventTypeRegistry: readonly ChannelConnectorRegistryEntry[] =
  Object.freeze([
    eventType("MessageReceived", "Inbound message received event.", 1),
    eventType("MessageSent", "Outbound message sent event.", 2),
    eventType("FileReceived", "Inbound file received event.", 3),
    eventType("FileSent", "Outbound file sent event.", 4),
    eventType("ConnectionEstablished", "Connection established event.", 5),
    eventType("ConnectionClosed", "Connection closed event.", 6),
    eventType(
      "AuthenticationRequested",
      "Authentication requested event.",
      7,
    ),
    eventType("HealthChanged", "Health status changed event.", 8),
  ]);

const payloadType = (
  id: ChannelConnectorPayloadTypeId,
  description: string,
  order: number,
): ChannelConnectorRegistryEntry =>
  entry(id, id, description, "NEA-2:2", null, order);

/** Payload type registry — Registry-owned. */
export const ChannelConnectorPayloadTypeRegistry: readonly ChannelConnectorRegistryEntry[] =
  Object.freeze([
    payloadType("Text", "Text payload category.", 1),
    payloadType("File", "File payload category.", 2),
    payloadType("Audio", "Audio payload category.", 3),
    payloadType("Image", "Image payload category.", 4),
    payloadType("Video", "Video payload category.", 5),
    payloadType("Command", "Command payload category.", 6),
    payloadType("Event", "Event payload category.", 7),
    payloadType("Metadata", "Metadata payload category.", 8),
  ]);

const ALL_CAPABILITY_IDS = Object.freeze(
  foundation.capabilities.capabilities.map((item) => item.capabilityId),
);

const identity = (
  typeId: string,
  typeName: string,
  family: string,
  protocol: ChannelConnectorProtocolId,
  directionId: ChannelConnectorDirectionId,
  order: number,
): ChannelConnectorIdentityDeclaration =>
  Object.freeze({
    connectorId: `NEA-2:2/Connector/${typeId}`,
    connectorName: typeName,
    connectorVersion: "1.0.0" as const,
    connectorFamily: family,
    connectorType: typeId,
    connectorProtocol: protocol,
    connectorDirection: directionId,
    connectorCapabilities: ALL_CAPABILITY_IDS,
    connectorStatus: "Registered" as const,
    implementsConnector: false as const,
    executesRuntime: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

/**
 * Connector identity registry — one declarative identity per Foundation type.
 * Identity is declarative only. No runtime connectors.
 */
export const ChannelConnectorIdentityRegistry: readonly ChannelConnectorIdentityDeclaration[] =
  Object.freeze([
    identity("Telegram", "Telegram", "Messaging", "HTTPS", "Bidirectional", 1),
    identity("WhatsApp", "WhatsApp", "Messaging", "HTTPS", "Bidirectional", 2),
    identity(
      "MicrosoftTeams",
      "Microsoft Teams",
      "Collaboration",
      "HTTPS",
      "Bidirectional",
      3,
    ),
    identity("Slack", "Slack", "Collaboration", "WebSocket", "Bidirectional", 4),
    identity("Email", "Email", "Email", "SMTP", "Bidirectional", 5),
    identity("Voice", "Voice", "Voice", "SIP", "Bidirectional", 6),
    identity("RestApi", "REST API", "API", "REST", "Bidirectional", 7),
    identity("MCP", "MCP", "SDK", "MCP", "Bidirectional", 8),
    identity("SDK", "SDK", "SDK", "SDK", "Bidirectional", 9),
    identity("Webhook", "Webhook", "API", "HTTPS", "Inbound", 10),
    identity(
      "EnterpriseConnector",
      "Enterprise Connector",
      "Enterprise",
      "Custom",
      "Bidirectional",
      11,
    ),
    identity(
      "CustomConnector",
      "Custom Connector",
      "Custom",
      "Custom",
      "Bidirectional",
      12,
    ),
  ]);

/** Aggregate collections object for platform composition. */
export const ChannelConnectorRegistryCollections = Object.freeze({
  collectionsId: "NEA-2:2/RegistryCollections",
  sourcePhase: "NEA-2:2" as const,
  families: ChannelConnectorFamilyRegistry,
  types: ChannelConnectorTypeRegistry,
  identities: ChannelConnectorIdentityRegistry,
  protocols: ChannelConnectorProtocolRegistry,
  directions: ChannelConnectorDirectionRegistry,
  authenticationMethods: ChannelConnectorAuthenticationMethodRegistry,
  lifecycleStates: ChannelConnectorLifecycleRegistry,
  healthStates: ChannelConnectorHealthRegistry,
  statuses: ChannelConnectorStatusRegistry,
  eventTypes: ChannelConnectorEventTypeRegistry,
  payloadTypes: ChannelConnectorPayloadTypeRegistry,
  familyCount: ChannelConnectorFamilyRegistry.length,
  typeCount: ChannelConnectorTypeRegistry.length,
  identityCount: ChannelConnectorIdentityRegistry.length,
  protocolCount: ChannelConnectorProtocolRegistry.length,
  directionCount: ChannelConnectorDirectionRegistry.length,
  authenticationMethodCount:
    ChannelConnectorAuthenticationMethodRegistry.length,
  lifecycleStateCount: ChannelConnectorLifecycleRegistry.length,
  healthStateCount: ChannelConnectorHealthRegistry.length,
  statusCount: ChannelConnectorStatusRegistry.length,
  eventTypeCount: ChannelConnectorEventTypeRegistry.length,
  payloadTypeCount: ChannelConnectorPayloadTypeRegistry.length,
  duplicatesFoundationValues: false as const,
  reconstructsFoundation: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
