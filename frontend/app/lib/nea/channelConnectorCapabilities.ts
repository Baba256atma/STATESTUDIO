/**
 * NEA-2:1 — Channel Connector Capabilities.
 *
 * Immutable capability declarations for Channel Connectors Foundation.
 * Capabilities are declarative only — no runtime execution.
 *
 * Ownership: owned exclusively by NEA-2:1.
 */

import type {
  ChannelConnectorCapabilityDeclaration,
  ChannelConnectorCapabilityId,
} from "./channelConnectorFoundationTypes.ts";

const capability = (
  capabilityId: ChannelConnectorCapabilityId,
  capabilityName: string,
  description: string,
  order: number,
): ChannelConnectorCapabilityDeclaration =>
  Object.freeze({
    capabilityId,
    capabilityName,
    description,
    executesRuntime: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

/** Canonical connector capability catalog — exactly nine. */
export const ChannelConnectorCapabilities: readonly ChannelConnectorCapabilityDeclaration[] =
  Object.freeze([
    capability(
      "ReceiveMessages",
      "Receive Messages",
      "Declarative ability to receive inbound messages.",
      1,
    ),
    capability(
      "SendMessages",
      "Send Messages",
      "Declarative ability to send outbound messages.",
      2,
    ),
    capability(
      "ReceiveFiles",
      "Receive Files",
      "Declarative ability to receive inbound files.",
      3,
    ),
    capability(
      "SendFiles",
      "Send Files",
      "Declarative ability to send outbound files.",
      4,
    ),
    capability(
      "SessionSupport",
      "Session Support",
      "Declarative ability to reference connector sessions.",
      5,
    ),
    capability(
      "AuthenticationSupport",
      "Authentication Support",
      "Declarative ability to reference authentication metadata.",
      6,
    ),
    capability(
      "HealthMonitoring",
      "Health Monitoring",
      "Declarative ability to declare connector health status.",
      7,
    ),
    capability(
      "EventReception",
      "Event Reception",
      "Declarative ability to receive inbound events.",
      8,
    ),
    capability(
      "MetadataExchange",
      "Metadata Exchange",
      "Declarative ability to exchange connector metadata.",
      9,
    ),
  ]);

/** Canonical immutable capability catalog. */
export const ChannelConnectorCapabilityCatalog = Object.freeze({
  catalogId: "NEA-2:1/CapabilityCatalog",
  sourcePhase: "NEA-2:1" as const,
  capabilities: ChannelConnectorCapabilities,
  capabilityCount: ChannelConnectorCapabilities.length,
  executesRuntime: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
