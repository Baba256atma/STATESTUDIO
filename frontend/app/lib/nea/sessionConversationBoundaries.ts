/**
 * NEA-3:1 — Session & Conversation Boundaries.
 *
 * Architectural boundary and prohibited surface declarations.
 * Metadata only — no runtime enforcement.
 *
 * Ownership: owned exclusively by NEA-3:1.
 */

export const SESSION_CONVERSATION_PROHIBITED_SURFACES = Object.freeze([
  "Runtime Sessions",
  "Runtime Conversations",
  "Message Processing",
  "Connector Execution",
  "HTTP",
  "REST",
  "WebSockets",
  "Databases",
  "Queues",
  "Event Bus",
  "Authentication",
  "Authorization",
  "AI",
  "LLM",
  "Executive Reasoning",
  "DKL invocation",
  "Executive Engine invocation",
  "Assistant invocation",
  "React",
  "Next.js",
] as const);

/** Canonical immutable boundary declarations. */
export const SessionConversationBoundaries = Object.freeze({
  boundariesId: "NEA-3:1/SessionConversationBoundaries",
  sourcePhase: "NEA-3:1" as const,
  consumes: Object.freeze([
    "NEA-2 Channel Connectors Public Index",
  ] as const),
  provides: Object.freeze([
    "Session & Conversation Foundation",
  ] as const),
  prohibitedSurfaces: SESSION_CONVERSATION_PROHIBITED_SURFACES,
  prohibitedSurfaceCount: SESSION_CONVERSATION_PROHIBITED_SURFACES.length,
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
  performsExecutiveReasoning: false as const,
  invokesDkl: false as const,
  invokesEngine: false as const,
  invokesAssistant: false as const,
  uiComponents: false as const,
  reactComponents: false as const,
  nextJsRoutes: false as const,
  runtimeEnforcement: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
