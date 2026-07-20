/**
 * NEA-4:5 — Security Gateway Manifest Ownership.
 *
 * Ownership and boundary declarations for the Security Gateway Manifest.
 * Metadata only — no runtime assignment.
 *
 * Ownership: owned exclusively by NEA-4:5.
 */

export const SECURITY_GATEWAY_MANIFEST_OWNS = Object.freeze([
  "Manifest Metadata",
  "Phase References",
  "Inventory Publication",
  "Manifest Summary",
  "Readiness Declaration",
] as const);

export const SECURITY_GATEWAY_MANIFEST_DOES_NOT_OWN = Object.freeze([
  "Foundation Contracts",
  "Registry Collections",
  "Domain Models",
  "Validation Rules",
  "Authentication",
  "Authorization",
  "Encryption",
  "Token Management",
  "Runtime Security",
  "Gateway Routing",
  "DKL",
  "Executive Engine",
  "Assistant",
  "Advisor",
  "Director",
  "EVE",
] as const);

export const SECURITY_GATEWAY_MANIFEST_PROHIBITED_SURFACES = Object.freeze([
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

/** Canonical immutable manifest ownership declaration. */
export const SecurityGatewayManifestOwnership = Object.freeze({
  ownershipId: "NEA-4:5/SecurityGatewayManifestOwnership",
  sourcePhase: "NEA-4:5" as const,
  owns: SECURITY_GATEWAY_MANIFEST_OWNS,
  doesNotOwn: SECURITY_GATEWAY_MANIFEST_DOES_NOT_OWN,
  ownsCount: SECURITY_GATEWAY_MANIFEST_OWNS.length,
  doesNotOwnCount: SECURITY_GATEWAY_MANIFEST_DOES_NOT_OWN.length,
  ownsFoundationContracts: false as const,
  ownsRegistryCollections: false as const,
  ownsDomainModels: false as const,
  ownsValidationRules: false as const,
  ownsAuthentication: false as const,
  ownsAuthorization: false as const,
  ownsEncryption: false as const,
  ownsRuntimeSecurity: false as const,
  runtimeBehavior: "None" as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

/** Canonical immutable manifest boundary declarations. */
export const SecurityGatewayManifestBoundaries = Object.freeze({
  boundariesId: "NEA-4:5/SecurityGatewayManifestBoundaries",
  sourcePhase: "NEA-4:5" as const,
  consumes: Object.freeze([
    "NEA-4:4 Security Gateway Validation",
  ] as const),
  provides: Object.freeze(["Security Gateway Manifest"] as const),
  prohibitedSurfaces: SECURITY_GATEWAY_MANIFEST_PROHIBITED_SURFACES,
  prohibitedSurfaceCount:
    SECURITY_GATEWAY_MANIFEST_PROHIBITED_SURFACES.length,
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
  duplicatesUpstreamCollections: false as const,
  redefinesPriorPhases: false as const,
  runtimeEnforcement: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
