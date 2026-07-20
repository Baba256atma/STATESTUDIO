/**
 * NEA-7:1 — Intake Orchestration Boundaries.
 *
 * Architectural boundary and prohibited surface declarations.
 * Metadata only — no runtime enforcement.
 *
 * Ownership: owned exclusively by NEA-7:1.
 */

export const INTAKE_ORCHESTRATION_PROHIBITED_SURFACES = Object.freeze([
  "Runtime Orchestration",
  "Runtime Routing",
  "Runtime Normalization",
  "Runtime Validation",
  "Business Object Construction",
  "Business Understanding",
  "DKL invocation",
  "Executive Engine invocation",
  "Persistence",
  "API Calls",
  "Database",
  "Queue",
  "Workflow Execution",
  "Message Parsing",
  "AI",
  "LLM",
  "HTTP",
  "REST",
  "WebSockets",
  "Authentication",
  "Authorization",
  "Storage",
  "React",
  "Next.js",
] as const);

/** Canonical immutable boundary declarations. */
export const IntakeOrchestrationBoundaries = Object.freeze({
  boundariesId: "NEA-7:1/IntakeOrchestrationBoundaries",
  sourcePhase: "NEA-7:1" as const,
  consumes: Object.freeze([
    "NEA-6 Message Normalization Public Index",
  ] as const),
  provides: Object.freeze(["Intake Orchestration Foundation"] as const),
  prohibitedSurfaces: INTAKE_ORCHESTRATION_PROHIBITED_SURFACES,
  prohibitedSurfaceCount: INTAKE_ORCHESTRATION_PROHIBITED_SURFACES.length,
  executesOrchestration: false as const,
  executesRouting: false as const,
  executesNormalization: false as const,
  executesValidation: false as const,
  buildsBusinessObjects: false as const,
  interpretsBusinessMeaning: false as const,
  invokesDkl: false as const,
  invokesExecutiveEngine: false as const,
  persistsData: false as const,
  callsApis: false as const,
  accessesDatabase: false as const,
  implementsQueue: false as const,
  executesWorkflows: false as const,
  parsesMessages: false as const,
  performsAi: false as const,
  callsLlm: false as const,
  implementsHttp: false as const,
  implementsRest: false as const,
  implementsWebSockets: false as const,
  executesAuthentication: false as const,
  executesAuthorization: false as const,
  implementsStorage: false as const,
  reactComponents: false as const,
  nextJsRoutes: false as const,
  runtimeEnforcement: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
