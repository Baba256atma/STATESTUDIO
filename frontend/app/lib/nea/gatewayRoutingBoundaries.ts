/**
 * NEA-5:1 — Gateway Routing Boundaries.
 *
 * Architectural boundary and prohibited surface declarations.
 * Metadata only — no runtime enforcement.
 *
 * Ownership: owned exclusively by NEA-5:1.
 */

export const GATEWAY_ROUTING_PROHIBITED_SURFACES = Object.freeze([
  "Runtime Routing",
  "Routing Algorithms",
  "Consumer Selection Logic",
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

/** Canonical immutable boundary declarations. */
export const GatewayRoutingBoundaries = Object.freeze({
  boundariesId: "NEA-5:1/GatewayRoutingBoundaries",
  sourcePhase: "NEA-5:1" as const,
  consumes: Object.freeze([
    "NEA-4 Security Gateway Public Index",
  ] as const),
  provides: Object.freeze(["Gateway Routing Foundation"] as const),
  prohibitedSurfaces: GATEWAY_ROUTING_PROHIBITED_SURFACES,
  prohibitedSurfaceCount: GATEWAY_ROUTING_PROHIBITED_SURFACES.length,
  implementsRuntimeRouting: false as const,
  implementsRoutingAlgorithms: false as const,
  implementsConsumerSelectionLogic: false as const,
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
  runtimeEnforcement: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
