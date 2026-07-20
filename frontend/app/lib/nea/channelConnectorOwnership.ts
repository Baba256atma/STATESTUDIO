/**
 * NEA-2:1 — Channel Connector Ownership.
 *
 * Ownership and non-ownership declarations for Channel Connectors Foundation.
 * Metadata only — no runtime assignment.
 *
 * Ownership: owned exclusively by NEA-2:1.
 */

export const CHANNEL_CONNECTOR_OWNS = Object.freeze([
  "Connector Foundation Contracts",
  "Connector Identity",
  "Connector Boundaries",
  "Connector Lifecycle",
  "Connector Capabilities",
  "Connector Families",
  "Connector Types",
  "Connector Metadata",
] as const);

export const CHANNEL_CONNECTOR_DOES_NOT_OWN = Object.freeze([
  "Connector Registry",
  "Runtime Connectors",
  "Network Communication",
  "Authentication Execution",
  "Message Processing",
  "DKL",
  "Executive Engine",
  "Assistant",
  "Advisor",
  "Director",
  "EVE",
] as const);

/** Canonical immutable ownership declaration. */
export const ChannelConnectorOwnership = Object.freeze({
  ownershipId: "NEA-2:1/ChannelConnectorOwnership",
  sourcePhase: "NEA-2:1" as const,
  owns: CHANNEL_CONNECTOR_OWNS,
  doesNotOwn: CHANNEL_CONNECTOR_DOES_NOT_OWN,
  ownsCount: CHANNEL_CONNECTOR_OWNS.length,
  doesNotOwnCount: CHANNEL_CONNECTOR_DOES_NOT_OWN.length,
  ownsConnectorRegistry: false as const,
  ownsRuntimeConnectors: false as const,
  ownsNetworkCommunication: false as const,
  ownsAuthenticationExecution: false as const,
  ownsMessageProcessing: false as const,
  ownsDkl: false as const,
  ownsExecutiveEngine: false as const,
  ownsAssistant: false as const,
  runtimeBehavior: "None" as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
