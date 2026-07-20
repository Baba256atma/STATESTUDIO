/**
 * NEA-2:5 — Channel Connectors Manifest Ownership.
 *
 * Ownership and boundary declarations for the Channel Connectors Manifest.
 * Metadata only — no runtime assignment.
 *
 * Ownership: owned exclusively by NEA-2:5.
 */

export const CHANNEL_CONNECTOR_MANIFEST_OWNS = Object.freeze([
  "Manifest Metadata",
  "Inventory Aggregation",
  "Manifest Summary",
  "Phase References",
  "Canonical Architecture Inventory",
  "Manifest Readiness",
] as const);

export const CHANNEL_CONNECTOR_MANIFEST_DOES_NOT_OWN = Object.freeze([
  "Foundation Contracts",
  "Registry Collections",
  "Domain Models",
  "Validation Rules",
  "Runtime Connectors",
  "Network Communication",
  "Authentication Execution",
  "Executive Gateway",
  "DKL",
  "Executive Engine",
  "Assistant",
  "Advisor",
  "Director",
  "EVE",
] as const);

export const CHANNEL_CONNECTOR_MANIFEST_PROHIBITED_SURFACES = Object.freeze([
  "Runtime connectors",
  "HTTP Requests",
  "REST Clients",
  "WebSocket Connections",
  "Telegram Bot",
  "WhatsApp API",
  "Slack API",
  "Microsoft Teams API",
  "Email Client",
  "Voice Engine",
  "MCP Runtime",
  "SDK Runtime",
  "OAuth Flow",
  "Token Validation",
  "Message Processing",
  "Event Processing",
  "Validation Engine",
  "Connector Routing",
  "Database",
  "Queue",
  "AI",
  "LLM",
  "Executive Gateway invocation",
  "DKL invocation",
  "Executive Engine invocation",
  "Assistant invocation",
  "React",
  "Next.js",
] as const);

/** Canonical immutable manifest ownership declaration. */
export const ChannelConnectorManifestOwnership = Object.freeze({
  ownershipId: "NEA-2:5/ChannelConnectorManifestOwnership",
  sourcePhase: "NEA-2:5" as const,
  owns: CHANNEL_CONNECTOR_MANIFEST_OWNS,
  doesNotOwn: CHANNEL_CONNECTOR_MANIFEST_DOES_NOT_OWN,
  ownsCount: CHANNEL_CONNECTOR_MANIFEST_OWNS.length,
  doesNotOwnCount: CHANNEL_CONNECTOR_MANIFEST_DOES_NOT_OWN.length,
  ownsFoundationContracts: false as const,
  ownsRegistryCollections: false as const,
  ownsDomainModels: false as const,
  ownsValidationRules: false as const,
  ownsRuntimeConnectors: false as const,
  ownsNetworkCommunication: false as const,
  runtimeBehavior: "None" as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

/** Canonical immutable manifest boundary declarations. */
export const ChannelConnectorManifestBoundaries = Object.freeze({
  boundariesId: "NEA-2:5/ChannelConnectorManifestBoundaries",
  sourcePhase: "NEA-2:5" as const,
  consumes: Object.freeze([
    "NEA-2:4 Channel Connectors Validation",
  ] as const),
  provides: Object.freeze(["Channel Connectors Manifest"] as const),
  prohibitedSurfaces: CHANNEL_CONNECTOR_MANIFEST_PROHIBITED_SURFACES,
  prohibitedSurfaceCount:
    CHANNEL_CONNECTOR_MANIFEST_PROHIBITED_SURFACES.length,
  implementsConnectors: false as const,
  implementsHttpRequests: false as const,
  implementsOAuthFlow: false as const,
  processesMessages: false as const,
  validationEngine: false as const,
  routingEngine: false as const,
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
