/**
 * NEA-2:1 — Channel Connectors Foundation Types.
 *
 * Readonly contracts and closed vocabularies for Executive Gateway
 * Channel Connectors. Metadata-only. No runtime connectors.
 *
 * Ownership: owned exclusively by NEA-2:1.
 */

/** Foundation status for NEA-2:1. */
export type ChannelConnectorFoundationStatus = "Foundation";

/** Immediate downstream readiness — Registry only. */
export type ChannelConnectorFoundationReadiness = "ReadyForRegistry";

/** Connector family classifications. */
export type ChannelConnectorFamily =
  | "Messaging"
  | "Collaboration"
  | "Email"
  | "Voice"
  | "API"
  | "SDK"
  | "Enterprise"
  | "Custom";

/** Connector type classifications — declaration only. */
export type ChannelConnectorType =
  | "Telegram"
  | "WhatsApp"
  | "MicrosoftTeams"
  | "Slack"
  | "Email"
  | "Voice"
  | "RestApi"
  | "MCP"
  | "SDK"
  | "Webhook"
  | "EnterpriseConnector"
  | "CustomConnector";

/** Declarative connector capability identifiers. */
export type ChannelConnectorCapabilityId =
  | "ReceiveMessages"
  | "SendMessages"
  | "ReceiveFiles"
  | "SendFiles"
  | "SessionSupport"
  | "AuthenticationSupport"
  | "HealthMonitoring"
  | "EventReception"
  | "MetadataExchange";

/** Immutable connector lifecycle states. */
export type ChannelConnectorLifecycleState =
  | "Declared"
  | "Registered"
  | "Configured"
  | "Certified"
  | "Frozen"
  | "Released"
  | "Deprecated"
  | "Retired";

/** Declarative connector health status values. */
export type ChannelConnectorHealthStatus =
  | "Unknown"
  | "Healthy"
  | "Warning"
  | "Unavailable"
  | "Disabled";

/** Contract declaration for a connector foundation surface. */
export interface ChannelConnectorContractDeclaration {
  readonly contractId: string;
  readonly contractName: string;
  readonly description: string;
  readonly fields: readonly string[];
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly runtimeBehavior: "None";
  readonly deterministicOrder: number;
}

/** Capability declaration. */
export interface ChannelConnectorCapabilityDeclaration {
  readonly capabilityId: ChannelConnectorCapabilityId;
  readonly capabilityName: string;
  readonly description: string;
  readonly executesRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/** Family declaration. */
export interface ChannelConnectorFamilyDeclaration {
  readonly familyId: ChannelConnectorFamily;
  readonly familyName: string;
  readonly description: string;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/** Type declaration. */
export interface ChannelConnectorTypeDeclaration {
  readonly typeId: ChannelConnectorType;
  readonly typeName: string;
  readonly family: ChannelConnectorFamily;
  readonly description: string;
  readonly implementsConnector: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/** Configuration metadata shape — references only. */
export interface ChannelConnectorConfigurationContract {
  readonly endpointRef: string;
  readonly protocolRef: string;
  readonly versionRef: string;
  readonly timeoutRef: string;
  readonly retryPolicyRef: string;
  readonly credentialRef: string;
  readonly loadsConfiguration: false;
  readonly metadataOnly: true;
}

/** Canonical foundation identity. */
export interface ChannelConnectorFoundationIdentity {
  readonly foundationId: string;
  readonly foundationName: string;
  readonly foundationVersion: string;
  readonly foundationNamespace: string;
  readonly layer: "NEA";
  readonly phase: "NEA-2:1";
  readonly stage: "Foundation";
  readonly sourcePhase: "NEA-2:1";
  readonly owner: string;
  readonly status: ChannelConnectorFoundationStatus;
  readonly readiness: ChannelConnectorFoundationReadiness;
  readonly description: string;
  readonly publicIndexId: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Deterministic foundation summary. */
export interface ChannelConnectorFoundationSummary {
  readonly foundationId: string;
  readonly version: string;
  readonly name: string;
  readonly namespace: string;
  readonly layer: "NEA";
  readonly phase: "NEA-2:1";
  readonly status: ChannelConnectorFoundationStatus;
  readonly readiness: ChannelConnectorFoundationReadiness;
  readonly publicIndexId: string;
  readonly contractCount: number;
  readonly familyCount: number;
  readonly typeCount: number;
  readonly capabilityCount: number;
  readonly lifecycleStateCount: number;
  readonly healthStatusCount: number;
  readonly ownershipCount: number;
  readonly nonOwnershipCount: number;
  readonly prohibitedSurfaceCount: number;
  readonly publicExportCount: number;
  readonly sectionCount: number;
  readonly nextPhase: string;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}
