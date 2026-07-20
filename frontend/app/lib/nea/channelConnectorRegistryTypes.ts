/**
 * NEA-2:2 — Channel Connectors Registry Types.
 *
 * Readonly contracts and closed vocabularies for the Channel Connectors Registry.
 * Metadata-only. No runtime enforcement.
 *
 * Ownership: owned exclusively by NEA-2:2.
 */

/** Registry status for NEA-2:2. */
export type ChannelConnectorRegistryStatus = "Registry";

/** Immediate downstream readiness — Model only. */
export type ChannelConnectorRegistryReadiness = "ReadyForModel";

/** Registry-owned connector protocol identifiers. */
export type ChannelConnectorProtocolId =
  | "HTTPS"
  | "WebSocket"
  | "SMTP"
  | "IMAP"
  | "POP3"
  | "SIP"
  | "REST"
  | "MCP"
  | "SDK"
  | "Custom";

/** Registry-owned connector direction identifiers. */
export type ChannelConnectorDirectionId =
  | "Inbound"
  | "Outbound"
  | "Bidirectional";

/** Registry-owned authentication method identifiers. */
export type ChannelConnectorAuthenticationMethodId =
  | "OAuth2"
  | "ApiKey"
  | "BearerToken"
  | "BasicAuthentication"
  | "Certificate"
  | "Anonymous"
  | "Custom";

/** Registry-owned connector status identifiers. */
export type ChannelConnectorStatusId =
  | "Declared"
  | "Registered"
  | "Certified"
  | "Frozen"
  | "Deprecated";

/** Registry-owned health state identifiers. */
export type ChannelConnectorRegistryHealthId =
  | "Healthy"
  | "Degraded"
  | "Offline"
  | "Maintenance"
  | "Unknown";

/** Registry-owned event type identifiers. */
export type ChannelConnectorEventTypeId =
  | "MessageReceived"
  | "MessageSent"
  | "FileReceived"
  | "FileSent"
  | "ConnectionEstablished"
  | "ConnectionClosed"
  | "AuthenticationRequested"
  | "HealthChanged";

/** Registry-owned payload type identifiers. */
export type ChannelConnectorPayloadTypeId =
  | "Text"
  | "File"
  | "Audio"
  | "Image"
  | "Video"
  | "Command"
  | "Event"
  | "Metadata";

/** Base registry entry shape. */
export interface ChannelConnectorRegistryEntry {
  readonly id: string;
  readonly label: string;
  readonly description: string;
  readonly sourcePhase: "NEA-2:1" | "NEA-2:2";
  readonly foundationReference: string | null;
  readonly executesRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/** Declarative connector identity registry entry. */
export interface ChannelConnectorIdentityDeclaration {
  readonly connectorId: string;
  readonly connectorName: string;
  readonly connectorVersion: string;
  readonly connectorFamily: string;
  readonly connectorType: string;
  readonly connectorProtocol: ChannelConnectorProtocolId;
  readonly connectorDirection: ChannelConnectorDirectionId;
  readonly connectorCapabilities: readonly string[];
  readonly connectorStatus: ChannelConnectorStatusId;
  readonly implementsConnector: false;
  readonly executesRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/** Canonical registry identity. */
export interface ChannelConnectorRegistryIdentity {
  readonly registryId: string;
  readonly registryName: string;
  readonly registryVersion: string;
  readonly registryNamespace: string;
  readonly layer: "NEA";
  readonly phase: "NEA-2:2";
  readonly stage: "Registry";
  readonly sourcePhase: "NEA-2:2";
  readonly owner: string;
  readonly status: ChannelConnectorRegistryStatus;
  readonly readiness: ChannelConnectorRegistryReadiness;
  readonly foundationId: string;
  readonly foundationVersion: string;
  readonly description: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Deterministic registry summary. */
export interface ChannelConnectorRegistrySummary {
  readonly registryId: string;
  readonly version: string;
  readonly name: string;
  readonly namespace: string;
  readonly layer: "NEA";
  readonly phase: "NEA-2:2";
  readonly status: ChannelConnectorRegistryStatus;
  readonly readiness: ChannelConnectorRegistryReadiness;
  readonly foundationId: string;
  readonly familyCount: number;
  readonly typeCount: number;
  readonly identityCount: number;
  readonly protocolCount: number;
  readonly directionCount: number;
  readonly authenticationMethodCount: number;
  readonly capabilityCount: number;
  readonly lifecycleStateCount: number;
  readonly healthStateCount: number;
  readonly statusCount: number;
  readonly eventTypeCount: number;
  readonly payloadTypeCount: number;
  readonly policyCount: number;
  readonly totalRegistryEntryCount: number;
  readonly publicExportCount: number;
  readonly sectionCount: number;
  readonly nextPhase: string;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}
