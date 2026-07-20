/**
 * NEA-3:1 — Session & Conversation Ownership.
 *
 * Ownership and non-ownership declarations for Session & Conversation Foundation.
 * Metadata only — no runtime assignment.
 *
 * Ownership: owned exclusively by NEA-3:1.
 */

export const SESSION_CONVERSATION_OWNS = Object.freeze([
  "Session Contracts",
  "Conversation Contracts",
  "Conversation Context",
  "Lifecycle Definitions",
  "Capabilities",
  "Ownership",
  "Boundaries",
  "Session Metadata",
  "Conversation Metadata",
  "References",
] as const);

export const SESSION_CONVERSATION_DOES_NOT_OWN = Object.freeze([
  "Runtime Sessions",
  "Runtime Conversations",
  "Message Transport",
  "Connector Implementations",
  "Authentication",
  "Authorization",
  "Persistence",
  "Executive Gateway Routing",
  "DKL",
  "Executive Engine",
  "Assistant",
  "Advisor",
  "Director",
  "EVE",
] as const);

/** Canonical immutable ownership declaration. */
export const SessionConversationOwnership = Object.freeze({
  ownershipId: "NEA-3:1/SessionConversationOwnership",
  sourcePhase: "NEA-3:1" as const,
  owns: SESSION_CONVERSATION_OWNS,
  doesNotOwn: SESSION_CONVERSATION_DOES_NOT_OWN,
  ownsCount: SESSION_CONVERSATION_OWNS.length,
  doesNotOwnCount: SESSION_CONVERSATION_DOES_NOT_OWN.length,
  ownsRuntimeSessions: false as const,
  ownsRuntimeConversations: false as const,
  ownsMessageTransport: false as const,
  ownsConnectorImplementations: false as const,
  ownsAuthentication: false as const,
  ownsAuthorization: false as const,
  ownsPersistence: false as const,
  ownsExecutiveGatewayRouting: false as const,
  ownsDkl: false as const,
  ownsExecutiveEngine: false as const,
  ownsAssistant: false as const,
  runtimeBehavior: "None" as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
