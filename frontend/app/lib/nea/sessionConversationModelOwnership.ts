/**
 * NEA-3:3 — Session & Conversation Model Ownership.
 *
 * Ownership and boundary declarations for the Session & Conversation Model.
 * Metadata only — no runtime assignment.
 *
 * Ownership: owned exclusively by NEA-3:3.
 */

export const SESSION_CONVERSATION_MODEL_OWNS = Object.freeze([
  "Domain Models",
  "Model Composition",
  "Model Relationships",
  "Model Metadata",
  "Session Identity Model Instances",
  "Conversation Identity Model Instances",
  "Model Lifecycle",
  "Model Summary",
] as const);

export const SESSION_CONVERSATION_MODEL_DOES_NOT_OWN = Object.freeze([
  "Runtime Sessions",
  "Runtime Conversations",
  "Message Transport",
  "Connector Execution",
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
  "Registry Collections",
  "Foundation Contracts",
] as const);

export const SESSION_CONVERSATION_MODEL_PROHIBITED_SURFACES = Object.freeze([
  "Runtime Sessions",
  "Runtime Conversations",
  "Message Processing",
  "Message Storage",
  "Connector Execution",
  "HTTP",
  "REST",
  "WebSockets",
  "Databases",
  "Queues",
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

/** Canonical immutable model ownership declaration. */
export const SessionConversationModelOwnership = Object.freeze({
  ownershipId: "NEA-3:3/SessionConversationModelOwnership",
  sourcePhase: "NEA-3:3" as const,
  owns: SESSION_CONVERSATION_MODEL_OWNS,
  doesNotOwn: SESSION_CONVERSATION_MODEL_DOES_NOT_OWN,
  ownsCount: SESSION_CONVERSATION_MODEL_OWNS.length,
  doesNotOwnCount: SESSION_CONVERSATION_MODEL_DOES_NOT_OWN.length,
  ownsRuntimeSessions: false as const,
  ownsRuntimeConversations: false as const,
  ownsMessageTransport: false as const,
  ownsConnectorExecution: false as const,
  ownsRegistryCollections: false as const,
  runtimeBehavior: "None" as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

/** Canonical immutable model boundary declarations. */
export const SessionConversationModelBoundaries = Object.freeze({
  boundariesId: "NEA-3:3/SessionConversationModelBoundaries",
  sourcePhase: "NEA-3:3" as const,
  consumes: Object.freeze([
    "NEA-3:2 Session & Conversation Registry",
  ] as const),
  provides: Object.freeze(["Session & Conversation Model"] as const),
  prohibitedSurfaces: SESSION_CONVERSATION_MODEL_PROHIBITED_SURFACES,
  prohibitedSurfaceCount:
    SESSION_CONVERSATION_MODEL_PROHIBITED_SURFACES.length,
  managesRuntimeSessions: false as const,
  managesRuntimeConversations: false as const,
  processesMessages: false as const,
  storesMessages: false as const,
  executesConnectors: false as const,
  implementsHttp: false as const,
  implementsRest: false as const,
  implementsWebSockets: false as const,
  accessesDatabase: false as const,
  implementsQueue: false as const,
  executesAuthentication: false as const,
  executesAuthorization: false as const,
  performsAi: false as const,
  callsLlm: false as const,
  invokesDkl: false as const,
  invokesEngine: false as const,
  invokesAssistant: false as const,
  reactComponents: false as const,
  nextJsRoutes: false as const,
  duplicatesRegistryValues: false as const,
  reconstructsRegistry: false as const,
  runtimeEnforcement: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
