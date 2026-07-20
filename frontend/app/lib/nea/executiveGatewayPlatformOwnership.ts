/**
 * NEA-1:6 — Executive Gateway Platform Ownership.
 *
 * Ownership and boundary declarations for the Executive Gateway Platform.
 * Metadata only — no runtime assignment.
 *
 * Ownership: owned exclusively by NEA-1:6.
 */

export const EXECUTIVE_GATEWAY_PLATFORM_OWNS = Object.freeze([
  "Platform Composition",
  "Platform Namespace",
  "Platform Metadata",
  "Consumer Readiness",
  "Consumer Platform Surface",
  "Platform Summary",
] as const);

export const EXECUTIVE_GATEWAY_PLATFORM_DOES_NOT_OWN = Object.freeze([
  "Foundation Contracts",
  "Registry Collections",
  "Domain Models",
  "Validation Rules",
  "Manifest Inventory",
  "Runtime Processing",
  "Connectors",
  "Persistence",
  "DKL",
  "Executive Engine",
  "Assistant",
  "Advisor",
  "Director",
  "EVE",
] as const);

export const EXECUTIVE_GATEWAY_PLATFORM_PROHIBITED_SURFACES = Object.freeze([
  "Runtime processing",
  "Validation execution",
  "Routing execution",
  "Authentication",
  "Authorization",
  "Connectors",
  "HTTP",
  "REST",
  "Webhooks",
  "Telegram Bot",
  "WhatsApp API",
  "Slack API",
  "Teams API",
  "Email Client",
  "Voice Processing",
  "SDK Runtime",
  "MCP Runtime",
  "Database",
  "Queue",
  "Event Bus",
  "AI",
  "LLM",
  "DKL invocation",
  "Executive Engine invocation",
  "Assistant invocation",
  "Advisor",
  "Director",
  "EVE",
  "React",
  "Next.js",
] as const);

/** Canonical immutable platform ownership declaration. */
export const ExecutiveGatewayPlatformOwnership = Object.freeze({
  ownershipId: "NEA-1:6/ExecutiveGatewayPlatformOwnership",
  sourcePhase: "NEA-1:6" as const,
  owns: EXECUTIVE_GATEWAY_PLATFORM_OWNS,
  doesNotOwn: EXECUTIVE_GATEWAY_PLATFORM_DOES_NOT_OWN,
  ownsCount: EXECUTIVE_GATEWAY_PLATFORM_OWNS.length,
  doesNotOwnCount: EXECUTIVE_GATEWAY_PLATFORM_DOES_NOT_OWN.length,
  ownsFoundationContracts: false as const,
  ownsRegistryCollections: false as const,
  ownsDomainModels: false as const,
  ownsValidationRules: false as const,
  ownsManifestInventory: false as const,
  ownsRuntimeProcessing: false as const,
  ownsConnectors: false as const,
  ownsPersistence: false as const,
  runtimeBehavior: "None" as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

/** Canonical immutable platform boundary declarations. */
export const ExecutiveGatewayPlatformBoundaries = Object.freeze({
  boundariesId: "NEA-1:6/ExecutiveGatewayPlatformBoundaries",
  sourcePhase: "NEA-1:6" as const,
  consumes: Object.freeze([
    "NEA-1:5 Executive Gateway Manifest",
  ] as const),
  provides: Object.freeze([
    "Executive Gateway Platform",
  ] as const),
  consumerAccessRule:
    "Consumers shall access NEA-1 through ExecutiveGatewayPlatform only.",
  prohibitedSurfaces: EXECUTIVE_GATEWAY_PLATFORM_PROHIBITED_SURFACES,
  prohibitedSurfaceCount: EXECUTIVE_GATEWAY_PLATFORM_PROHIBITED_SURFACES.length,
  runtimeEnforcement: false as const,
  executesValidation: false as const,
  executesRouting: false as const,
  executesAuthentication: false as const,
  executesAuthorization: false as const,
  implementsConnectors: false as const,
  implementsHttp: false as const,
  implementsRest: false as const,
  implementsWebhooks: false as const,
  accessesDatabase: false as const,
  implementsQueue: false as const,
  implementsEventBus: false as const,
  performsAi: false as const,
  callsLlm: false as const,
  invokesDkl: false as const,
  invokesEngine: false as const,
  invokesAssistant: false as const,
  uiComponents: false as const,
  reactComponents: false as const,
  nextJsRoutes: false as const,
  duplicatesUpstreamArchitecture: false as const,
  redefinesPriorPhases: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
