/**
 * NEA-5:2 — Gateway Routing Registry Ownership.
 *
 * Ownership and boundary declarations for the Gateway Routing Registry.
 * Metadata only — no runtime assignment.
 *
 * Ownership: owned exclusively by NEA-5:2.
 */

export const GATEWAY_ROUTING_REGISTRY_OWNS = Object.freeze([
  "Registry Collections",
  "Routing Identity Registry",
  "Strategy Registry",
  "Status Registry",
  "Metadata Registry",
  "Registry Summary",
  "Priority Registry",
  "Result Registry",
  "Policy Registry",
] as const);

export const GATEWAY_ROUTING_REGISTRY_DOES_NOT_OWN = Object.freeze([
  "Runtime Routing",
  "Routing Algorithms",
  "Consumer Selection",
  "Foundation Contracts",
  "Domain Models",
  "Validation Rules",
  "DKL",
  "Executive Engine",
  "Advisor",
  "Director",
  "EVE",
  "Persistence",
  "Networking",
  "Message Processing",
  "Connector Execution",
  "HTTP",
  "REST",
  "WebSockets",
  "Foundation Ownership",
  "Foundation Boundaries",
] as const);

export const GATEWAY_ROUTING_REGISTRY_PROHIBITED_SURFACES = Object.freeze([
  "Runtime Routing",
  "Routing Algorithms",
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

/** Canonical immutable registry ownership declaration. */
export const GatewayRoutingRegistryOwnership = Object.freeze({
  ownershipId: "NEA-5:2/GatewayRoutingRegistryOwnership",
  sourcePhase: "NEA-5:2" as const,
  owns: GATEWAY_ROUTING_REGISTRY_OWNS,
  doesNotOwn: GATEWAY_ROUTING_REGISTRY_DOES_NOT_OWN,
  ownsCount: GATEWAY_ROUTING_REGISTRY_OWNS.length,
  doesNotOwnCount: GATEWAY_ROUTING_REGISTRY_DOES_NOT_OWN.length,
  ownsRuntimeRouting: false as const,
  ownsRoutingAlgorithms: false as const,
  ownsConsumerSelection: false as const,
  ownsFoundationContracts: false as const,
  ownsDomainModels: false as const,
  ownsValidationRules: false as const,
  ownsDkl: false as const,
  ownsExecutiveEngine: false as const,
  ownsAdvisor: false as const,
  ownsDirector: false as const,
  ownsEve: false as const,
  ownsPersistence: false as const,
  ownsNetworking: false as const,
  runtimeBehavior: "None" as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

/** Canonical immutable registry boundary declarations. */
export const GatewayRoutingRegistryBoundaries = Object.freeze({
  boundariesId: "NEA-5:2/GatewayRoutingRegistryBoundaries",
  sourcePhase: "NEA-5:2" as const,
  consumes: Object.freeze([
    "NEA-5:1 Gateway Routing Foundation",
  ] as const),
  provides: Object.freeze(["Gateway Routing Registry"] as const),
  prohibitedSurfaces: GATEWAY_ROUTING_REGISTRY_PROHIBITED_SURFACES,
  prohibitedSurfaceCount:
    GATEWAY_ROUTING_REGISTRY_PROHIBITED_SURFACES.length,
  implementsRuntimeRouting: false as const,
  implementsRoutingAlgorithms: false as const,
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
