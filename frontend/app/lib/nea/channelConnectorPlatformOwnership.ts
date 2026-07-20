/**
 * NEA-2:6 — Channel Connectors Platform Ownership.
 *
 * Ownership and boundary declarations for the Channel Connectors Platform.
 * Metadata only — no runtime assignment.
 *
 * Ownership: owned exclusively by NEA-2:6.
 */

export const CHANNEL_CONNECTOR_PLATFORM_OWNS = Object.freeze([
  "Platform Composition",
  "Platform Namespace",
  "Platform Metadata",
  "Consumer Readiness",
  "Consumer Platform Surface",
  "Platform Summary",
] as const);

export const CHANNEL_CONNECTOR_PLATFORM_DOES_NOT_OWN = Object.freeze([
  "Foundation Contracts",
  "Registry Collections",
  "Domain Models",
  "Validation Rules",
  "Manifest Inventory",
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

export const CHANNEL_CONNECTOR_PLATFORM_PROHIBITED_SURFACES = Object.freeze([
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

/** Canonical immutable platform ownership declaration. */
export const ChannelConnectorPlatformOwnership = Object.freeze({
  ownershipId: "NEA-2:6/ChannelConnectorPlatformOwnership",
  sourcePhase: "NEA-2:6" as const,
  owns: CHANNEL_CONNECTOR_PLATFORM_OWNS,
  doesNotOwn: CHANNEL_CONNECTOR_PLATFORM_DOES_NOT_OWN,
  ownsCount: CHANNEL_CONNECTOR_PLATFORM_OWNS.length,
  doesNotOwnCount: CHANNEL_CONNECTOR_PLATFORM_DOES_NOT_OWN.length,
  ownsFoundationContracts: false as const,
  ownsRegistryCollections: false as const,
  ownsDomainModels: false as const,
  ownsValidationRules: false as const,
  ownsManifestInventory: false as const,
  ownsRuntimeConnectors: false as const,
  ownsNetworkCommunication: false as const,
  ownsAuthenticationExecution: false as const,
  runtimeBehavior: "None" as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

/** Canonical immutable platform boundary declarations. */
export const ChannelConnectorPlatformBoundaries = Object.freeze({
  boundariesId: "NEA-2:6/ChannelConnectorPlatformBoundaries",
  sourcePhase: "NEA-2:6" as const,
  consumes: Object.freeze([
    "NEA-2:5 Channel Connectors Manifest",
  ] as const),
  provides: Object.freeze(["Channel Connectors Platform"] as const),
  consumerAccessRule:
    "Consumers shall access NEA-2 through ChannelConnectorPlatform only.",
  prohibitedSurfaces: CHANNEL_CONNECTOR_PLATFORM_PROHIBITED_SURFACES,
  prohibitedSurfaceCount: CHANNEL_CONNECTOR_PLATFORM_PROHIBITED_SURFACES.length,
  runtimeEnforcement: false as const,
  executesValidation: false as const,
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
  duplicatesUpstreamArchitecture: false as const,
  redefinesPriorPhases: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
