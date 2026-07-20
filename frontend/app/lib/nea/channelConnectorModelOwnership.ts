/**
 * NEA-2:3 — Channel Connector Model Ownership.
 *
 * Ownership and boundary declarations for the Channel Connectors Model.
 * Metadata only — no runtime assignment.
 *
 * Ownership: owned exclusively by NEA-2:3.
 */

export const CHANNEL_CONNECTOR_MODEL_OWNS = Object.freeze([
  "Domain Models",
  "Model Composition",
  "Model Relationships",
  "Model Metadata",
  "Identity Model Instances",
  "Model Lifecycle",
  "Model Summary",
] as const);

export const CHANNEL_CONNECTOR_MODEL_DOES_NOT_OWN = Object.freeze([
  "Runtime Connectors",
  "HTTP Clients",
  "OAuth Flows",
  "Message Processing",
  "Connector Validation",
  "Connector Routing",
  "Persistence",
  "Executive Gateway",
  "DKL",
  "Executive Engine",
  "Assistant",
  "Advisor",
  "Director",
  "EVE",
  "Registry Collections",
  "Foundation Contracts",
] as const);

export const CHANNEL_CONNECTOR_MODEL_PROHIBITED_SURFACES = Object.freeze([
  "Telegram Bot",
  "WhatsApp API",
  "Slack API",
  "Microsoft Teams API",
  "Email Client",
  "Voice Engine",
  "REST Client",
  "MCP Runtime",
  "SDK Runtime",
  "HTTP Requests",
  "WebSocket Connections",
  "OAuth Flow",
  "Token Validation",
  "Message Processing",
  "Event Processing",
  "Queue Processing",
  "Database",
  "AI",
  "LLM",
  "Connector Validation Engine",
  "Connector Routing Engine",
  "Executive Gateway invocation",
  "DKL invocation",
  "Executive Engine invocation",
  "Assistant invocation",
  "React",
  "Next.js",
] as const);

/** Canonical immutable model ownership declaration. */
export const ChannelConnectorModelOwnership = Object.freeze({
  ownershipId: "NEA-2:3/ChannelConnectorModelOwnership",
  sourcePhase: "NEA-2:3" as const,
  owns: CHANNEL_CONNECTOR_MODEL_OWNS,
  doesNotOwn: CHANNEL_CONNECTOR_MODEL_DOES_NOT_OWN,
  ownsCount: CHANNEL_CONNECTOR_MODEL_OWNS.length,
  doesNotOwnCount: CHANNEL_CONNECTOR_MODEL_DOES_NOT_OWN.length,
  ownsRuntimeConnectors: false as const,
  ownsHttpClients: false as const,
  ownsOAuthFlows: false as const,
  ownsMessageProcessing: false as const,
  ownsConnectorValidation: false as const,
  ownsRegistryCollections: false as const,
  runtimeBehavior: "None" as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

/** Canonical immutable model boundary declarations. */
export const ChannelConnectorModelBoundaries = Object.freeze({
  boundariesId: "NEA-2:3/ChannelConnectorModelBoundaries",
  sourcePhase: "NEA-2:3" as const,
  consumes: Object.freeze([
    "NEA-2:2 Channel Connectors Registry",
  ] as const),
  provides: Object.freeze(["Channel Connectors Model"] as const),
  prohibitedSurfaces: CHANNEL_CONNECTOR_MODEL_PROHIBITED_SURFACES,
  prohibitedSurfaceCount: CHANNEL_CONNECTOR_MODEL_PROHIBITED_SURFACES.length,
  implementsConnectors: false as const,
  implementsHttpRequests: false as const,
  implementsOAuthFlow: false as const,
  processesMessages: false as const,
  processesEvents: false as const,
  validationEngine: false as const,
  routingEngine: false as const,
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
