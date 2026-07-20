/**
 * NEA-4:6 — Security Gateway Platform Ownership.
 *
 * Ownership and boundary declarations for the Security Gateway Platform.
 * Metadata only — no runtime assignment.
 *
 * Ownership: owned exclusively by NEA-4:6.
 */

export const SECURITY_GATEWAY_PLATFORM_OWNS = Object.freeze([
  "Platform Namespace",
  "Platform Metadata",
  "Platform Readiness",
  "Platform Summary",
  "Consumer Composition",
] as const);

export const SECURITY_GATEWAY_PLATFORM_DOES_NOT_OWN = Object.freeze([
  "Foundation Contracts",
  "Registry Collections",
  "Domain Models",
  "Validation Rules",
  "Manifest Inventory",
  "Authentication",
  "Authorization",
  "Permission Evaluation",
  "Encryption",
  "Runtime Security",
  "Gateway Routing",
  "DKL",
  "Executive Engine",
  "Assistant",
  "Advisor",
  "Director",
  "EVE",
] as const);

export const SECURITY_GATEWAY_PLATFORM_PROHIBITED_SURFACES = Object.freeze([
  "Authentication",
  "Authorization",
  "Permission Evaluation",
  "Trust Evaluation",
  "Consent Enforcement",
  "Login",
  "Logout",
  "OAuth",
  "JWT",
  "MFA",
  "Encryption",
  "Secret Management",
  "Runtime Security",
  "HTTP",
  "REST",
  "Database",
  "Queue",
  "Event Bus",
  "Gateway Routing",
  "AI / LLM",
  "DKL invocation",
  "Executive Engine invocation",
  "Assistant invocation",
  "React",
  "Next.js",
] as const);

/** Canonical immutable platform ownership declaration. */
export const SecurityGatewayPlatformOwnership = Object.freeze({
  ownershipId: "NEA-4:6/SecurityGatewayPlatformOwnership",
  sourcePhase: "NEA-4:6" as const,
  owns: SECURITY_GATEWAY_PLATFORM_OWNS,
  doesNotOwn: SECURITY_GATEWAY_PLATFORM_DOES_NOT_OWN,
  ownsCount: SECURITY_GATEWAY_PLATFORM_OWNS.length,
  doesNotOwnCount: SECURITY_GATEWAY_PLATFORM_DOES_NOT_OWN.length,
  ownsFoundationContracts: false as const,
  ownsRegistryCollections: false as const,
  ownsDomainModels: false as const,
  ownsValidationRules: false as const,
  ownsManifestInventory: false as const,
  ownsAuthentication: false as const,
  ownsAuthorization: false as const,
  ownsEncryption: false as const,
  ownsRuntimeSecurity: false as const,
  runtimeBehavior: "None" as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

/** Canonical immutable platform boundary declarations. */
export const SecurityGatewayPlatformBoundaries = Object.freeze({
  boundariesId: "NEA-4:6/SecurityGatewayPlatformBoundaries",
  sourcePhase: "NEA-4:6" as const,
  consumes: Object.freeze([
    "NEA-4:5 Security Gateway Manifest",
  ] as const),
  provides: Object.freeze(["Security Gateway Platform"] as const),
  consumerAccessRule:
    "Consumers shall access NEA-4 through SecurityGatewayPlatform only.",
  prohibitedSurfaces: SECURITY_GATEWAY_PLATFORM_PROHIBITED_SURFACES,
  prohibitedSurfaceCount:
    SECURITY_GATEWAY_PLATFORM_PROHIBITED_SURFACES.length,
  runtimeEnforcement: false as const,
  executesValidation: false as const,
  executesAuthentication: false as const,
  executesAuthorization: false as const,
  evaluatesPermissions: false as const,
  evaluatesTrust: false as const,
  enforcesConsent: false as const,
  implementsLogin: false as const,
  implementsLogout: false as const,
  implementsOAuth: false as const,
  implementsJwt: false as const,
  implementsMfa: false as const,
  implementsEncryption: false as const,
  managesSecrets: false as const,
  runtimeSecurity: false as const,
  implementsHttp: false as const,
  implementsRest: false as const,
  accessesDatabase: false as const,
  implementsQueue: false as const,
  implementsEventBus: false as const,
  gatewayRouting: false as const,
  performsAi: false as const,
  callsLlm: false as const,
  invokesDkl: false as const,
  invokesEngine: false as const,
  invokesAssistant: false as const,
  reactComponents: false as const,
  nextJsRoutes: false as const,
  duplicatesUpstreamArchitecture: false as const,
  redefinesPriorPhases: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
