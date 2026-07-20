/**
 * NEA-6:6 — Message Normalization Platform Ownership.
 *
 * Ownership and boundary declarations for the Message Normalization Platform.
 * Metadata only — no runtime assignment.
 *
 * Ownership: owned exclusively by NEA-6:6.
 */

export const MESSAGE_NORMALIZATION_PLATFORM_OWNS = Object.freeze([
  "Platform Namespace",
  "Platform Metadata",
  "Platform Readiness",
  "Platform Summary",
  "Consumer Composition",
] as const);

export const MESSAGE_NORMALIZATION_PLATFORM_DOES_NOT_OWN = Object.freeze([
  "Foundation Contracts",
  "Registry Collections",
  "Domain Models",
  "Validation Rules",
  "Manifest Inventories",
  "Runtime Normalization",
  "Runtime Validation",
  "Parsing",
  "AI",
  "DKL",
  "Executive Engine",
  "Storage",
  "Routing",
  "Security",
  "Connector Runtime",
] as const);

export const MESSAGE_NORMALIZATION_PLATFORM_PROHIBITED_SURFACES = Object.freeze([
  "Runtime Normalization",
  "Runtime Validation",
  "Parsing",
  "AI",
  "LLM",
  "Business Understanding",
  "Routing",
  "HTTP",
  "REST",
  "WebSockets",
  "Database",
  "Queue",
  "Event Bus",
  "Authentication",
  "Authorization",
  "Storage",
  "React",
  "Next.js",
  "DKL invocation",
  "Executive Engine invocation",
] as const);

/** Canonical immutable platform ownership declaration. */
export const MessageNormalizationPlatformOwnership = Object.freeze({
  ownershipId: "NEA-6:6/MessageNormalizationPlatformOwnership",
  sourcePhase: "NEA-6:6" as const,
  owns: MESSAGE_NORMALIZATION_PLATFORM_OWNS,
  doesNotOwn: MESSAGE_NORMALIZATION_PLATFORM_DOES_NOT_OWN,
  ownsCount: MESSAGE_NORMALIZATION_PLATFORM_OWNS.length,
  doesNotOwnCount: MESSAGE_NORMALIZATION_PLATFORM_DOES_NOT_OWN.length,
  ownsFoundationContracts: false as const,
  ownsRegistryCollections: false as const,
  ownsDomainModels: false as const,
  ownsValidationRules: false as const,
  ownsManifestInventories: false as const,
  ownsRuntimeNormalization: false as const,
  ownsRuntimeValidation: false as const,
  ownsParsing: false as const,
  ownsAi: false as const,
  ownsDkl: false as const,
  ownsExecutiveEngine: false as const,
  ownsStorage: false as const,
  ownsRouting: false as const,
  ownsSecurity: false as const,
  ownsConnectorRuntime: false as const,
  runtimeBehavior: "None" as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

/** Canonical immutable platform boundary declarations. */
export const MessageNormalizationPlatformBoundaries = Object.freeze({
  boundariesId: "NEA-6:6/MessageNormalizationPlatformBoundaries",
  sourcePhase: "NEA-6:6" as const,
  consumes: Object.freeze([
    "NEA-6:5 Message Normalization Manifest",
  ] as const),
  provides: Object.freeze(["Message Normalization Platform"] as const),
  consumerAccessRule:
    "Consumers shall access NEA-6 through MessageNormalizationPlatform only.",
  prohibitedSurfaces: MESSAGE_NORMALIZATION_PLATFORM_PROHIBITED_SURFACES,
  prohibitedSurfaceCount:
    MESSAGE_NORMALIZATION_PLATFORM_PROHIBITED_SURFACES.length,
  runtimeEnforcement: false as const,
  executesValidation: false as const,
  implementsRuntimeNormalization: false as const,
  parsesPayloads: false as const,
  processesMessages: false as const,
  interpretsBusinessMeaning: false as const,
  implementsRouting: false as const,
  implementsHttp: false as const,
  implementsRest: false as const,
  implementsWebSockets: false as const,
  accessesDatabase: false as const,
  implementsQueue: false as const,
  implementsEventBus: false as const,
  executesAuthentication: false as const,
  executesAuthorization: false as const,
  implementsStorage: false as const,
  performsAi: false as const,
  callsLlm: false as const,
  invokesDkl: false as const,
  invokesExecutiveEngine: false as const,
  reactComponents: false as const,
  nextJsRoutes: false as const,
  duplicatesUpstreamArchitecture: false as const,
  redefinesPriorPhases: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
