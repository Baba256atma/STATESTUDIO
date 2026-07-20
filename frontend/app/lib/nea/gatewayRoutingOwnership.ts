/**
 * NEA-5:1 — Gateway Routing Ownership.
 *
 * Ownership and non-ownership declarations for Gateway Routing Foundation.
 * Metadata only — no runtime assignment.
 *
 * Ownership: owned exclusively by NEA-5:1.
 */

export const GATEWAY_ROUTING_OWNS = Object.freeze([
  "Routing declarations",
  "Destination declarations",
  "Routing capabilities",
  "Routing lifecycle",
  "Routing metadata",
  "Routing ownership",
  "Routing Contracts",
  "Architectural Boundaries",
] as const);

export const GATEWAY_ROUTING_DOES_NOT_OWN = Object.freeze([
  "Runtime routing",
  "Runtime security",
  "Session management",
  "Connector execution",
  "Authentication",
  "Authorization",
  "Business understanding",
  "DKL",
  "Executive Engine",
  "Advisor",
  "Director",
  "EVE",
  "Persistence",
  "Networking",
  "Routing Algorithms",
  "Consumer Selection Logic",
  "Message Processing",
  "HTTP",
  "REST",
  "WebSockets",
  "Database",
  "Queue",
  "Event Bus",
  "AI",
  "LLM",
] as const);

/** Canonical immutable ownership declaration. */
export const GatewayRoutingOwnership = Object.freeze({
  ownershipId: "NEA-5:1/GatewayRoutingOwnership",
  sourcePhase: "NEA-5:1" as const,
  owns: GATEWAY_ROUTING_OWNS,
  doesNotOwn: GATEWAY_ROUTING_DOES_NOT_OWN,
  ownsCount: GATEWAY_ROUTING_OWNS.length,
  doesNotOwnCount: GATEWAY_ROUTING_DOES_NOT_OWN.length,
  ownsRuntimeRouting: false as const,
  ownsRuntimeSecurity: false as const,
  ownsSessionManagement: false as const,
  ownsConnectorExecution: false as const,
  ownsAuthentication: false as const,
  ownsAuthorization: false as const,
  ownsBusinessUnderstanding: false as const,
  ownsDkl: false as const,
  ownsExecutiveEngine: false as const,
  ownsAdvisor: false as const,
  ownsDirector: false as const,
  ownsEve: false as const,
  ownsPersistence: false as const,
  ownsNetworking: false as const,
  ownsRoutingAlgorithms: false as const,
  ownsConsumerSelectionLogic: false as const,
  ownsMessageProcessing: false as const,
  ownsHttp: false as const,
  ownsRest: false as const,
  ownsWebSockets: false as const,
  ownsDatabase: false as const,
  ownsQueue: false as const,
  ownsEventBus: false as const,
  ownsAi: false as const,
  ownsLlm: false as const,
  runtimeBehavior: "None" as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
