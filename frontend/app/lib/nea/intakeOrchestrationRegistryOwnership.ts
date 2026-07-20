/**
 * NEA-7:2 — Intake Orchestration Registry Ownership.
 *
 * Ownership and boundary declarations for the Intake Orchestration Registry.
 * Metadata only — no runtime assignment.
 *
 * Ownership: owned exclusively by NEA-7:2.
 */

export const INTAKE_ORCHESTRATION_REGISTRY_OWNS = Object.freeze([
  "Intake Identity Registry",
  "Category Registry",
  "Priority Registry",
  "Status Registry",
  "Reference Type Registry",
  "Registry Metadata",
  "Registry Policies",
] as const);

export const INTAKE_ORCHESTRATION_REGISTRY_DOES_NOT_OWN = Object.freeze([
  "Foundation Contracts",
  "Foundation Lifecycle",
  "Foundation Capabilities",
  "DKL",
  "Routing",
  "Normalization",
  "Authentication",
  "Sessions",
  "Conversations",
  "Connectors",
  "AI",
  "Runtime",
  "Runtime Orchestration",
  "Runtime Assembly",
  "Runtime Publishing",
  "Business Objects",
  "Storage",
  "Queue",
  "HTTP",
  "REST",
  "Database",
  "React",
  "Executive Engine",
] as const);

export const INTAKE_ORCHESTRATION_REGISTRY_PROHIBITED_SURFACES = Object.freeze([
  "Runtime Orchestration",
  "Runtime Assembly",
  "Runtime Routing",
  "Runtime Validation",
  "Runtime Publishing",
  "DKL invocation",
  "Engine invocation",
  "Business Objects",
  "Storage",
  "Queue",
  "HTTP",
  "REST",
  "React",
  "Database",
  "AI",
  "LLM",
  "WebSockets",
  "Authentication",
  "Authorization",
  "Next.js",
] as const);

/** Canonical immutable registry ownership declaration. */
export const IntakeOrchestrationRegistryOwnership = Object.freeze({
  ownershipId: "NEA-7:2/IntakeOrchestrationRegistryOwnership",
  sourcePhase: "NEA-7:2" as const,
  owns: INTAKE_ORCHESTRATION_REGISTRY_OWNS,
  doesNotOwn: INTAKE_ORCHESTRATION_REGISTRY_DOES_NOT_OWN,
  ownsCount: INTAKE_ORCHESTRATION_REGISTRY_OWNS.length,
  doesNotOwnCount: INTAKE_ORCHESTRATION_REGISTRY_DOES_NOT_OWN.length,
  ownsFoundationContracts: false as const,
  ownsFoundationLifecycle: false as const,
  ownsFoundationCapabilities: false as const,
  ownsDkl: false as const,
  ownsRouting: false as const,
  ownsNormalization: false as const,
  ownsAuthentication: false as const,
  ownsSessions: false as const,
  ownsConversations: false as const,
  ownsConnectors: false as const,
  ownsAi: false as const,
  ownsRuntime: false as const,
  ownsRuntimeOrchestration: false as const,
  ownsRuntimeAssembly: false as const,
  ownsBusinessObjects: false as const,
  ownsStorage: false as const,
  ownsQueue: false as const,
  ownsHttp: false as const,
  ownsRest: false as const,
  ownsDatabase: false as const,
  ownsReact: false as const,
  ownsExecutiveEngine: false as const,
  runtimeBehavior: "None" as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

/** Canonical immutable registry boundary declarations. */
export const IntakeOrchestrationRegistryBoundaries = Object.freeze({
  boundariesId: "NEA-7:2/IntakeOrchestrationRegistryBoundaries",
  sourcePhase: "NEA-7:2" as const,
  consumes: Object.freeze([
    "NEA-7:1 Intake Orchestration Foundation",
  ] as const),
  provides: Object.freeze(["Intake Orchestration Registry"] as const),
  prohibitedSurfaces: INTAKE_ORCHESTRATION_REGISTRY_PROHIBITED_SURFACES,
  prohibitedSurfaceCount:
    INTAKE_ORCHESTRATION_REGISTRY_PROHIBITED_SURFACES.length,
  executesOrchestration: false as const,
  assemblesRuntimePackage: false as const,
  executesRouting: false as const,
  executesValidation: false as const,
  executesPublishing: false as const,
  invokesDkl: false as const,
  invokesExecutiveEngine: false as const,
  buildsBusinessObjects: false as const,
  implementsStorage: false as const,
  implementsQueue: false as const,
  implementsHttp: false as const,
  implementsRest: false as const,
  reactComponents: false as const,
  accessesDatabase: false as const,
  performsAi: false as const,
  callsLlm: false as const,
  duplicatesFoundationValues: false as const,
  reconstructsFoundation: false as const,
  runtimeEnforcement: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
