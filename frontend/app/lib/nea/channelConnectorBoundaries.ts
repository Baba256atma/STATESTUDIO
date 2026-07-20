/**
 * NEA-2:1 — Channel Connector Boundaries.
 *
 * Architectural boundary and prohibited surface declarations.
 * Metadata only — no runtime enforcement.
 *
 * Ownership: owned exclusively by NEA-2:1.
 */

export const CHANNEL_CONNECTOR_PROHIBITED_SURFACES = Object.freeze([
  "Telegram Bot",
  "WhatsApp API",
  "Slack API",
  "Teams SDK",
  "Email Client",
  "SMTP",
  "IMAP",
  "Voice Processing",
  "REST Client",
  "REST Server",
  "MCP Runtime",
  "SDK Runtime",
  "HTTP Requests",
  "WebSockets",
  "OAuth",
  "JWT",
  "API Keys",
  "Database",
  "Queue",
  "Event Bus",
  "AI",
  "LLM",
  "DKL invocation",
  "Executive Engine invocation",
  "Assistant invocation",
  "Runtime communication",
] as const);

/** Canonical immutable boundary declarations. */
export const ChannelConnectorBoundaries = Object.freeze({
  boundariesId: "NEA-2:1/ChannelConnectorBoundaries",
  sourcePhase: "NEA-2:1" as const,
  consumes: Object.freeze([
    "NEA-1 Executive Gateway Public Index",
  ] as const),
  provides: Object.freeze([
    "Channel Connectors Foundation",
  ] as const),
  prohibitedSurfaces: CHANNEL_CONNECTOR_PROHIBITED_SURFACES,
  prohibitedSurfaceCount: CHANNEL_CONNECTOR_PROHIBITED_SURFACES.length,
  implementsConnectors: false as const,
  implementsTelegramBot: false as const,
  implementsWhatsAppApi: false as const,
  implementsSlackApi: false as const,
  implementsTeamsSdk: false as const,
  implementsEmailClient: false as const,
  implementsSmtp: false as const,
  implementsImap: false as const,
  implementsVoiceProcessing: false as const,
  implementsRestClient: false as const,
  implementsRestServer: false as const,
  implementsMcpRuntime: false as const,
  implementsSdkRuntime: false as const,
  implementsHttpRequests: false as const,
  implementsWebSockets: false as const,
  implementsOAuth: false as const,
  implementsJwt: false as const,
  storesApiKeys: false as const,
  accessesDatabase: false as const,
  implementsQueue: false as const,
  implementsEventBus: false as const,
  performsAi: false as const,
  callsLlm: false as const,
  invokesDkl: false as const,
  invokesEngine: false as const,
  invokesAssistant: false as const,
  runtimeCommunication: false as const,
  runtimeEnforcement: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
