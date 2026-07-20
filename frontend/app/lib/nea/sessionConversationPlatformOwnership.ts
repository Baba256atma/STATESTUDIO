/**
 * NEA-3:6 — Session & Conversation Platform Ownership.
 *
 * Ownership and boundary declarations for the Session & Conversation Platform.
 * Metadata only — no runtime assignment.
 *
 * Ownership: owned exclusively by NEA-3:6.
 */

export const SESSION_CONVERSATION_PLATFORM_OWNS = Object.freeze([
  "Platform Composition",
  "Platform Namespace",
  "Platform Metadata",
  "Consumer Readiness",
  "Consumer Platform Surface",
  "Platform Summary",
] as const);

export const SESSION_CONVERSATION_PLATFORM_DOES_NOT_OWN = Object.freeze([
  "Foundation Contracts",
  "Registry Collections",
  "Domain Models",
  "Validation Rules",
  "Manifest Inventory",
  "Runtime Sessions",
  "Runtime Conversations",
  "Message Processing",
  "Connector Execution",
  "Persistence",
  "Executive Gateway Routing",
  "DKL",
  "Executive Engine",
  "Assistant",
  "Advisor",
  "Director",
  "EVE",
] as const);

export const SESSION_CONVERSATION_PLATFORM_PROHIBITED_SURFACES = Object.freeze([
  "Runtime Sessions",
  "Runtime Conversations",
  "Message Processing",
  "Connector Execution",
  "HTTP",
  "REST",
  "WebSockets",
  "Database",
  "Queue",
  "Event Bus",
  "Authentication",
  "Authorization",
  "AI",
  "LLM",
  "Executive Gateway Routing",
  "DKL invocation",
  "Executive Engine invocation",
  "Assistant invocation",
  "React",
  "Next.js",
] as const);

/** Canonical immutable platform ownership declaration. */
export const SessionConversationPlatformOwnership = Object.freeze({
  ownershipId: "NEA-3:6/SessionConversationPlatformOwnership",
  sourcePhase: "NEA-3:6" as const,
  owns: SESSION_CONVERSATION_PLATFORM_OWNS,
  doesNotOwn: SESSION_CONVERSATION_PLATFORM_DOES_NOT_OWN,
  ownsCount: SESSION_CONVERSATION_PLATFORM_OWNS.length,
  doesNotOwnCount: SESSION_CONVERSATION_PLATFORM_DOES_NOT_OWN.length,
  ownsFoundationContracts: false as const,
  ownsRegistryCollections: false as const,
  ownsDomainModels: false as const,
  ownsValidationRules: false as const,
  ownsManifestInventory: false as const,
  ownsRuntimeSessions: false as const,
  ownsRuntimeConversations: false as const,
  ownsMessageProcessing: false as const,
  ownsConnectorExecution: false as const,
  ownsPersistence: false as const,
  runtimeBehavior: "None" as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

/** Canonical immutable platform boundary declarations. */
export const SessionConversationPlatformBoundaries = Object.freeze({
  boundariesId: "NEA-3:6/SessionConversationPlatformBoundaries",
  sourcePhase: "NEA-3:6" as const,
  consumes: Object.freeze([
    "NEA-3:5 Session & Conversation Manifest",
  ] as const),
  provides: Object.freeze(["Session & Conversation Platform"] as const),
  consumerAccessRule:
    "Consumers shall access NEA-3 through SessionConversationPlatform only.",
  prohibitedSurfaces: SESSION_CONVERSATION_PLATFORM_PROHIBITED_SURFACES,
  prohibitedSurfaceCount:
    SESSION_CONVERSATION_PLATFORM_PROHIBITED_SURFACES.length,
  runtimeEnforcement: false as const,
  executesValidation: false as const,
  managesRuntimeSessions: false as const,
  managesRuntimeConversations: false as const,
  processesMessages: false as const,
  executesConnectors: false as const,
  implementsHttpRequests: false as const,
  implementsWebSockets: false as const,
  persistenceBehavior: false as const,
  invokesDkl: false as const,
  invokesEngine: false as const,
  invokesAssistant: false as const,
  reactComponents: false as const,
  nextJsRoutes: false as const,
  duplicatesUpstreamArchitecture: false as const,
  redefinesPriorPhases: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
