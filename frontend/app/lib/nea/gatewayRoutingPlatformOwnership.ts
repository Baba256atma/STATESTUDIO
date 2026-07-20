/**
 * NEA-5:6 — Gateway Routing Platform Ownership.
 *
 * Ownership and boundary declarations for the Gateway Routing Platform.
 * Metadata only — no runtime assignment.
 *
 * Ownership: owned exclusively by NEA-5:6.
 */

export const GATEWAY_ROUTING_PLATFORM_OWNS = Object.freeze([
  "Platform Namespace",
  "Platform Metadata",
  "Platform Readiness",
  "Platform Summary",
  "Consumer Composition",
] as const);

export const GATEWAY_ROUTING_PLATFORM_DOES_NOT_OWN = Object.freeze([
  "Foundation Contracts",
  "Registry Collections",
  "Domain Models",
  "Validation Rules",
  "Manifest Inventory",
  "Runtime Routing",
  "Routing Algorithms",
  "Consumer Selection",
  "DKL",
  "Executive Engine",
  "Advisor",
  "Director",
  "EVE",
  "Persistence",
  "Networking",
] as const);

export const GATEWAY_ROUTING_PLATFORM_PROHIBITED_SURFACES = Object.freeze([
  "Runtime Routing",
  "Runtime Validation",
  "Routing Algorithms",
  "Strategy Execution",
  "Consumer Selection",
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
  "DKL invocation",
  "Executive Engine invocation",
  "Advisor invocation",
  "Director invocation",
  "EVE invocation",
  "React",
  "Next.js",
] as const);

/** Canonical immutable platform ownership declaration. */
export const GatewayRoutingPlatformOwnership = Object.freeze({
  ownershipId: "NEA-5:6/GatewayRoutingPlatformOwnership",
  sourcePhase: "NEA-5:6" as const,
  owns: GATEWAY_ROUTING_PLATFORM_OWNS,
  doesNotOwn: GATEWAY_ROUTING_PLATFORM_DOES_NOT_OWN,
  ownsCount: GATEWAY_ROUTING_PLATFORM_OWNS.length,
  doesNotOwnCount: GATEWAY_ROUTING_PLATFORM_DOES_NOT_OWN.length,
  ownsFoundationContracts: false as const,
  ownsRegistryCollections: false as const,
  ownsDomainModels: false as const,
  ownsValidationRules: false as const,
  ownsManifestInventory: false as const,
  ownsRuntimeRouting: false as const,
  ownsRoutingAlgorithms: false as const,
  ownsConsumerSelection: false as const,
  ownsPersistence: false as const,
  ownsNetworking: false as const,
  runtimeBehavior: "None" as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

/** Canonical immutable platform boundary declarations. */
export const GatewayRoutingPlatformBoundaries = Object.freeze({
  boundariesId: "NEA-5:6/GatewayRoutingPlatformBoundaries",
  sourcePhase: "NEA-5:6" as const,
  consumes: Object.freeze([
    "NEA-5:5 Gateway Routing Manifest",
  ] as const),
  provides: Object.freeze(["Gateway Routing Platform"] as const),
  consumerAccessRule:
    "Consumers shall access NEA-5 through GatewayRoutingPlatform only.",
  prohibitedSurfaces: GATEWAY_ROUTING_PLATFORM_PROHIBITED_SURFACES,
  prohibitedSurfaceCount:
    GATEWAY_ROUTING_PLATFORM_PROHIBITED_SURFACES.length,
  runtimeEnforcement: false as const,
  executesValidation: false as const,
  implementsRuntimeRouting: false as const,
  implementsRoutingAlgorithms: false as const,
  executesStrategies: false as const,
  implementsConsumerSelection: false as const,
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
  invokesExecutiveEngine: false as const,
  invokesAdvisor: false as const,
  invokesDirector: false as const,
  invokesEve: false as const,
  reactComponents: false as const,
  nextJsRoutes: false as const,
  duplicatesUpstreamArchitecture: false as const,
  redefinesPriorPhases: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
