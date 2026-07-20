/**
 * NEA-2:2 — Channel Connectors Registry Policies.
 *
 * Immutable connector policy registry. Declarations only. No policy execution.
 *
 * Ownership: owned exclusively by NEA-2:2.
 */

import type { ChannelConnectorRegistryEntry } from "./channelConnectorRegistryTypes.ts";

const policy = (
  id: string,
  label: string,
  description: string,
  order: number,
): ChannelConnectorRegistryEntry =>
  Object.freeze({
    id: `NEA-2:2/Policy/${id}`,
    label,
    description,
    sourcePhase: "NEA-2:2" as const,
    foundationReference: null,
    executesRuntime: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

/** Canonical connector policy registry — declarations only. */
export const ChannelConnectorPolicyRegistry: readonly ChannelConnectorRegistryEntry[] =
  Object.freeze([
    policy(
      "DeclarationOnly",
      "Declaration Only",
      "Registry entries are declarative metadata and must not execute connectors.",
      1,
    ),
    policy(
      "FoundationReferencePreservation",
      "Foundation Reference Preservation",
      "Families, types, capabilities, and lifecycle must preserve Foundation references.",
      2,
    ),
    policy(
      "NoRuntimeConnectors",
      "No Runtime Connectors",
      "Registry must not implement Telegram, WhatsApp, Slack, Teams, email, voice, REST, MCP, or SDK runtimes.",
      3,
    ),
    policy(
      "NoAuthenticationExecution",
      "No Authentication Execution",
      "Authentication methods are declared only; OAuth, tokens, and certificates are not executed.",
      4,
    ),
    policy(
      "NoNetworkCommunication",
      "No Network Communication",
      "HTTP, WebSocket, SMTP, IMAP, and related transports must not be opened by Registry.",
      5,
    ),
    policy(
      "UniqueConnectorIdentities",
      "Unique Connector Identities",
      "Each connector identity id must be unique and deterministic.",
      6,
    ),
    policy(
      "CanonicalInventoryRule",
      "Canonical Inventory Rule",
      "Registry counts must be derived from canonical collections without hardcoding.",
      7,
    ),
    policy(
      "ReadyForModelOnly",
      "Ready For Model Only",
      "Registry readiness is ReadyForModel and must not claim runtime readiness.",
      8,
    ),
  ]);

/** Canonical immutable policy registry catalog. */
export const ChannelConnectorPolicyRegistryCatalog = Object.freeze({
  catalogId: "NEA-2:2/PolicyRegistry",
  sourcePhase: "NEA-2:2" as const,
  policies: ChannelConnectorPolicyRegistry,
  policyCount: ChannelConnectorPolicyRegistry.length,
  executesPolicies: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
