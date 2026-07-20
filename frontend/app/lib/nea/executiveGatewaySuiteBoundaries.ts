/**
 * NEA-8:1 — Executive Gateway Suite Boundaries.
 *
 * Explicit immutable boundaries separating suite composition from runtime
 * gateway, connector, session, security, routing, and operations surfaces.
 *
 * Ownership: owned exclusively by NEA-8:1.
 */

export const EXECUTIVE_GATEWAY_SUITE_PROHIBITED_SURFACES = Object.freeze([
  "Runtime Gateway",
  "Runtime Connectors",
  "Runtime Sessions",
  "Runtime Security",
  "Runtime Routing",
  "Runtime Operations",
  "HTTP",
  "REST",
  "WebSockets",
  "Database",
  "Queue",
  "Authentication",
  "Authorization",
  "AI",
  "LLM",
  "DKL invocation",
  "Executive Engine invocation",
  "Assistant invocation",
  "React",
  "Next.js",
  "Lower-level NEA Foundation imports",
  "Lower-level NEA Registry imports",
  "Lower-level NEA Model imports",
  "Lower-level NEA Validation imports",
  "Lower-level NEA Manifest imports",
  "Lower-level NEA Platform imports",
  "Lower-level NEA Certification imports",
  "Lower-level NEA Freeze imports",
] as const);

/** Canonical immutable suite boundary declarations. */
export const ExecutiveGatewaySuiteBoundaries = Object.freeze({
  boundariesId: "NEA-8:1/ExecutiveGatewaySuiteBoundaries",
  sourcePhase: "NEA-8:1" as const,
  consumes: Object.freeze([
    "NEA-1 Executive Gateway Public Index",
    "NEA-2 Channel Connectors Public Index",
    "NEA-3 Session & Conversation Public Index",
    "NEA-4 Security Gateway Public Index",
    "NEA-5 Gateway Routing Public Index",
    "NEA-6 Message Normalization Public Index",
    "NEA-7 Intake Orchestration Public Index",
  ] as const),
  provides: Object.freeze([
    "Executive Gateway Suite Foundation",
  ] as const),
  prohibitedSurfaces: EXECUTIVE_GATEWAY_SUITE_PROHIBITED_SURFACES,
  prohibitedSurfaceCount: EXECUTIVE_GATEWAY_SUITE_PROHIBITED_SURFACES.length,
  aggregatesReleasedNeaPlatforms: true as const,
  ownsRuntimeExecution: false as const,
  ownsConnectors: false as const,
  ownsRouting: false as const,
  ownsSecurityExecution: false as const,
  ownsSessionExecution: false as const,
  runtimeEnforcement: false as const,
  implementsHttp: false as const,
  implementsRest: false as const,
  implementsWebSockets: false as const,
  accessesDatabase: false as const,
  implementsQueue: false as const,
  executesAuthentication: false as const,
  executesAuthorization: false as const,
  performsAi: false as const,
  callsLlm: false as const,
  invokesDkl: false as const,
  invokesExecutiveEngine: false as const,
  invokesAssistant: false as const,
  reactComponents: false as const,
  nextJsRoutes: false as const,
  duplicatesUpstreamMetadata: false as const,
  reconstructsInventories: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
