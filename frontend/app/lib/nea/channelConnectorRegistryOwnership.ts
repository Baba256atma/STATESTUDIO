/**
 * NEA-2:2 — Channel Connectors Registry Ownership.
 *
 * Ownership and boundary declarations for the Channel Connectors Registry.
 * Metadata only — no runtime assignment.
 *
 * Ownership: owned exclusively by NEA-2:2.
 */

export const CHANNEL_CONNECTOR_REGISTRY_OWNS = Object.freeze([
  "Registry Definitions",
  "Registry Collections",
  "Connector Identity Registry",
  "Registry Metadata",
  "Protocol Registry",
  "Direction Registry",
  "Authentication Method Registry",
  "Status Registry",
  "Health Registry",
  "Event Type Registry",
  "Payload Type Registry",
  "Policy Registry",
] as const);

export const CHANNEL_CONNECTOR_REGISTRY_DOES_NOT_OWN = Object.freeze([
  "Connector Models",
  "Runtime Connectors",
  "HTTP Clients",
  "OAuth",
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
  "Foundation Contracts",
  "Foundation Ownership",
  "Foundation Boundaries",
] as const);

export const CHANNEL_CONNECTOR_REGISTRY_PROHIBITED_SURFACES = Object.freeze([
  "Runtime connectors",
  "Telegram Bot",
  "WhatsApp API",
  "Slack API",
  "Teams API",
  "Email Client",
  "Voice Engine",
  "REST Client",
  "MCP Runtime",
  "SDK Runtime",
  "OAuth Flow",
  "Token Validation",
  "HTTP Requests",
  "WebSocket Connections",
  "Message Processing",
  "Queue Processing",
  "Database",
  "AI",
  "LLM",
  "Executive Gateway Routing",
  "DKL invocation",
  "Executive Engine invocation",
  "Assistant invocation",
  "UI",
  "React",
  "Next.js",
] as const);

/** Canonical immutable registry ownership declaration. */
export const ChannelConnectorRegistryOwnership = Object.freeze({
  ownershipId: "NEA-2:2/ChannelConnectorRegistryOwnership",
  sourcePhase: "NEA-2:2" as const,
  owns: CHANNEL_CONNECTOR_REGISTRY_OWNS,
  doesNotOwn: CHANNEL_CONNECTOR_REGISTRY_DOES_NOT_OWN,
  ownsCount: CHANNEL_CONNECTOR_REGISTRY_OWNS.length,
  doesNotOwnCount: CHANNEL_CONNECTOR_REGISTRY_DOES_NOT_OWN.length,
  ownsConnectorModels: false as const,
  ownsRuntimeConnectors: false as const,
  ownsHttpClients: false as const,
  ownsOAuth: false as const,
  ownsMessageProcessing: false as const,
  ownsFoundationContracts: false as const,
  runtimeBehavior: "None" as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

/** Canonical immutable registry boundary declarations. */
export const ChannelConnectorRegistryBoundaries = Object.freeze({
  boundariesId: "NEA-2:2/ChannelConnectorRegistryBoundaries",
  sourcePhase: "NEA-2:2" as const,
  consumes: Object.freeze([
    "NEA-2:1 Channel Connectors Foundation",
  ] as const),
  provides: Object.freeze(["Channel Connectors Registry"] as const),
  prohibitedSurfaces: CHANNEL_CONNECTOR_REGISTRY_PROHIBITED_SURFACES,
  prohibitedSurfaceCount:
    CHANNEL_CONNECTOR_REGISTRY_PROHIBITED_SURFACES.length,
  implementsConnectors: false as const,
  implementsHttpRequests: false as const,
  implementsOAuthFlow: false as const,
  implementsWebSocketConnections: false as const,
  processesMessages: false as const,
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
