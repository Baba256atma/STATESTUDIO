/**
 * NEA-1:2 — Executive Gateway Registry Ownership.
 *
 * Ownership and boundary declarations for the Executive Gateway Registry.
 * Metadata only — no runtime assignment.
 *
 * Ownership: owned exclusively by NEA-1:2.
 */

export const EXECUTIVE_GATEWAY_REGISTRY_OWNS = Object.freeze([
  "Registry Definitions",
  "Registry Collections",
  "Canonical Lookup Values",
  "Registry Metadata",
  "Source Family Registry",
  "Channel Registry",
  "Interaction Registry",
  "Sender Registry",
  "Authentication Method Registry",
  "Authorization Status Registry",
  "Trust Level Registry",
  "Consent Status Registry",
  "Validation Status Registry",
  "Routing Registry",
  "Lifecycle Registry",
  "Capability Registry",
  "Policy Registry",
  "Diagnostic Category Registry",
] as const);

export const EXECUTIVE_GATEWAY_REGISTRY_DOES_NOT_OWN = Object.freeze([
  "Gateway Models",
  "Runtime Logic",
  "Validation Rules",
  "Connectors",
  "Authentication Engine",
  "Authorization Engine",
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

export const EXECUTIVE_GATEWAY_REGISTRY_PROHIBITED_SURFACES = Object.freeze([
  "Runtime routing",
  "Runtime validation",
  "Runtime normalization",
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
  "Authentication Engine",
  "Authorization Engine",
  "DKL invocation",
  "Engine invocation",
  "Assistant invocation",
  "UI",
  "React",
  "Next.js",
] as const);

/** Canonical immutable registry ownership declaration. */
export const ExecutiveGatewayRegistryOwnership = Object.freeze({
  ownershipId: "NEA-1:2/ExecutiveGatewayRegistryOwnership",
  sourcePhase: "NEA-1:2" as const,
  owns: EXECUTIVE_GATEWAY_REGISTRY_OWNS,
  doesNotOwn: EXECUTIVE_GATEWAY_REGISTRY_DOES_NOT_OWN,
  ownsCount: EXECUTIVE_GATEWAY_REGISTRY_OWNS.length,
  doesNotOwnCount: EXECUTIVE_GATEWAY_REGISTRY_DOES_NOT_OWN.length,
  ownsGatewayModels: false as const,
  ownsRuntimeLogic: false as const,
  ownsValidationRules: false as const,
  ownsConnectors: false as const,
  ownsAuthenticationEngine: false as const,
  ownsAuthorizationEngine: false as const,
  runtimeBehavior: "None" as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

/** Canonical immutable registry boundary declarations. */
export const ExecutiveGatewayRegistryBoundaries = Object.freeze({
  boundariesId: "NEA-1:2/ExecutiveGatewayRegistryBoundaries",
  sourcePhase: "NEA-1:2" as const,
  consumes: Object.freeze([
    "NEA-1:1 Executive Gateway Foundation",
  ] as const),
  provides: Object.freeze([
    "Executive Gateway Registry",
  ] as const),
  prohibitedSurfaces: EXECUTIVE_GATEWAY_REGISTRY_PROHIBITED_SURFACES,
  prohibitedSurfaceCount: EXECUTIVE_GATEWAY_REGISTRY_PROHIBITED_SURFACES.length,
  runtimeEnforcement: false as const,
  runtimeRouting: false as const,
  runtimeValidation: false as const,
  runtimeNormalization: false as const,
  implementsHttp: false as const,
  implementsRest: false as const,
  implementsWebhooks: false as const,
  implementsConnectors: false as const,
  accessesDatabase: false as const,
  implementsQueue: false as const,
  implementsEventBus: false as const,
  performsAi: false as const,
  callsLlm: false as const,
  executesAuthentication: false as const,
  executesAuthorization: false as const,
  invokesDkl: false as const,
  invokesEngine: false as const,
  invokesAssistant: false as const,
  uiComponents: false as const,
  reactComponents: false as const,
  nextJsRoutes: false as const,
  reconstructsFoundation: false as const,
  duplicatesFoundationInventory: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
