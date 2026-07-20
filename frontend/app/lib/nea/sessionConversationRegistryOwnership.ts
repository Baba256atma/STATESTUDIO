/**
 * NEA-3:2 — Session & Conversation Registry Ownership.
 *
 * Ownership and boundary declarations for the Session & Conversation Registry.
 * Metadata only — no runtime assignment.
 *
 * Ownership: owned exclusively by NEA-3:2.
 */

export const SESSION_CONVERSATION_REGISTRY_OWNS = Object.freeze([
  "Registry Definitions",
  "Registry Collections",
  "Identity Registries",
  "Registry Metadata",
  "Session Identity Registry",
  "Conversation Identity Registry",
  "Conversation Type Registry",
  "Message Reference Registry",
  "Correlation Registry",
  "Trace Registry",
  "Status Registry",
  "Policy Registry",
] as const);

export const SESSION_CONVERSATION_REGISTRY_DOES_NOT_OWN = Object.freeze([
  "Domain Models",
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
  "Foundation Contracts",
  "Foundation Ownership",
  "Foundation Boundaries",
] as const);

export const SESSION_CONVERSATION_REGISTRY_PROHIBITED_SURFACES = Object.freeze([
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

/** Canonical immutable registry ownership declaration. */
export const SessionConversationRegistryOwnership = Object.freeze({
  ownershipId: "NEA-3:2/SessionConversationRegistryOwnership",
  sourcePhase: "NEA-3:2" as const,
  owns: SESSION_CONVERSATION_REGISTRY_OWNS,
  doesNotOwn: SESSION_CONVERSATION_REGISTRY_DOES_NOT_OWN,
  ownsCount: SESSION_CONVERSATION_REGISTRY_OWNS.length,
  doesNotOwnCount: SESSION_CONVERSATION_REGISTRY_DOES_NOT_OWN.length,
  ownsDomainModels: false as const,
  ownsRuntimeSessions: false as const,
  ownsRuntimeConversations: false as const,
  ownsMessageProcessing: false as const,
  ownsFoundationContracts: false as const,
  runtimeBehavior: "None" as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

/** Canonical immutable registry boundary declarations. */
export const SessionConversationRegistryBoundaries = Object.freeze({
  boundariesId: "NEA-3:2/SessionConversationRegistryBoundaries",
  sourcePhase: "NEA-3:2" as const,
  consumes: Object.freeze([
    "NEA-3:1 Session & Conversation Foundation",
  ] as const),
  provides: Object.freeze(["Session & Conversation Registry"] as const),
  prohibitedSurfaces: SESSION_CONVERSATION_REGISTRY_PROHIBITED_SURFACES,
  prohibitedSurfaceCount:
    SESSION_CONVERSATION_REGISTRY_PROHIBITED_SURFACES.length,
  managesRuntimeSessions: false as const,
  managesRuntimeConversations: false as const,
  processesMessages: false as const,
  executesConnectors: false as const,
  implementsHttp: false as const,
  implementsRest: false as const,
  implementsWebSockets: false as const,
  accessesDatabase: false as const,
  implementsQueue: false as const,
  implementsEventBus: false as const,
  executesAuthentication: false as const,
  executesAuthorization: false as const,
  performsAi: false as const,
  callsLlm: false as const,
  invokesDkl: false as const,
  invokesEngine: false as const,
  invokesAssistant: false as const,
  uiComponents: false as const,
  reactComponents: false as const,
  nextJsRoutes: false as const,
  duplicatesFoundationValues: false as const,
  reconstructsFoundation: false as const,
  runtimeEnforcement: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
