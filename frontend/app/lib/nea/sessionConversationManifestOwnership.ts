/**
 * NEA-3:5 — Session & Conversation Manifest Ownership.
 *
 * Ownership and boundary declarations for the Session & Conversation Manifest.
 * Metadata only — no runtime assignment.
 *
 * Ownership: owned exclusively by NEA-3:5.
 */

export const SESSION_CONVERSATION_MANIFEST_OWNS = Object.freeze([
  "Manifest Metadata",
  "Inventory Aggregation",
  "Manifest Summary",
  "Phase References",
  "Canonical Architecture Inventory",
  "Manifest Readiness",
] as const);

export const SESSION_CONVERSATION_MANIFEST_DOES_NOT_OWN = Object.freeze([
  "Foundation Contracts",
  "Registry Collections",
  "Domain Models",
  "Validation Rules",
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

export const SESSION_CONVERSATION_MANIFEST_PROHIBITED_SURFACES = Object.freeze([
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

/** Canonical immutable manifest ownership declaration. */
export const SessionConversationManifestOwnership = Object.freeze({
  ownershipId: "NEA-3:5/SessionConversationManifestOwnership",
  sourcePhase: "NEA-3:5" as const,
  owns: SESSION_CONVERSATION_MANIFEST_OWNS,
  doesNotOwn: SESSION_CONVERSATION_MANIFEST_DOES_NOT_OWN,
  ownsCount: SESSION_CONVERSATION_MANIFEST_OWNS.length,
  doesNotOwnCount: SESSION_CONVERSATION_MANIFEST_DOES_NOT_OWN.length,
  ownsFoundationContracts: false as const,
  ownsRegistryCollections: false as const,
  ownsDomainModels: false as const,
  ownsValidationRules: false as const,
  ownsRuntimeSessions: false as const,
  ownsRuntimeConversations: false as const,
  runtimeBehavior: "None" as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

/** Canonical immutable manifest boundary declarations. */
export const SessionConversationManifestBoundaries = Object.freeze({
  boundariesId: "NEA-3:5/SessionConversationManifestBoundaries",
  sourcePhase: "NEA-3:5" as const,
  consumes: Object.freeze([
    "NEA-3:4 Session & Conversation Validation",
  ] as const),
  provides: Object.freeze(["Session & Conversation Manifest"] as const),
  prohibitedSurfaces: SESSION_CONVERSATION_MANIFEST_PROHIBITED_SURFACES,
  prohibitedSurfaceCount:
    SESSION_CONVERSATION_MANIFEST_PROHIBITED_SURFACES.length,
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
  reactComponents: false as const,
  nextJsRoutes: false as const,
  duplicatesUpstreamCollections: false as const,
  redefinesPriorPhases: false as const,
  runtimeEnforcement: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
