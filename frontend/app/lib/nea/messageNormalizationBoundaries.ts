/**
 * NEA-6:1 — Message Normalization Boundaries.
 *
 * Architectural boundary and prohibited surface declarations.
 * Metadata only — no runtime enforcement.
 *
 * Ownership: owned exclusively by NEA-6:1.
 */

export const MESSAGE_NORMALIZATION_PROHIBITED_SURFACES = Object.freeze([
  "Runtime Normalization",
  "Message Parsing",
  "AI",
  "LLM",
  "Intent Recognition",
  "Entity Extraction",
  "Business Understanding",
  "Routing",
  "HTTP",
  "REST",
  "WebSockets",
  "OAuth",
  "Authentication",
  "Database",
  "Queue",
  "Event Bus",
  "Storage",
  "React",
  "Next.js",
  "DKL invocation",
  "Executive Engine invocation",
  "Advisor invocation",
  "Director invocation",
  "EVE invocation",
] as const);

/** Canonical immutable boundary declarations. */
export const MessageNormalizationBoundaries = Object.freeze({
  boundariesId: "NEA-6:1/MessageNormalizationBoundaries",
  sourcePhase: "NEA-6:1" as const,
  consumes: Object.freeze([
    "NEA-5 Gateway Routing Public Index",
  ] as const),
  provides: Object.freeze(["Message Normalization Foundation"] as const),
  prohibitedSurfaces: MESSAGE_NORMALIZATION_PROHIBITED_SURFACES,
  prohibitedSurfaceCount: MESSAGE_NORMALIZATION_PROHIBITED_SURFACES.length,
  implementsRuntimeNormalization: false as const,
  parsesMessages: false as const,
  performsAi: false as const,
  callsLlm: false as const,
  recognizesIntent: false as const,
  extractsEntities: false as const,
  interpretsBusinessMeaning: false as const,
  modifiesUserIntent: false as const,
  implementsRouting: false as const,
  implementsHttp: false as const,
  implementsRest: false as const,
  implementsWebSockets: false as const,
  implementsOauth: false as const,
  executesAuthentication: false as const,
  accessesDatabase: false as const,
  implementsQueue: false as const,
  implementsEventBus: false as const,
  implementsStorage: false as const,
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
