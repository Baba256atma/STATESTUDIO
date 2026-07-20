/**
 * NEA-4:2 — Security Gateway Registry Ownership.
 *
 * Ownership and boundary declarations for the Security Gateway Registry.
 * Metadata only — no runtime assignment.
 *
 * Ownership: owned exclusively by NEA-4:2.
 */

export const SECURITY_GATEWAY_REGISTRY_OWNS = Object.freeze([
  "Registry Collections",
  "Identity Registry",
  "Role Registry",
  "Permission Registry",
  "Policy Registry",
  "Registry Metadata",
  "Classification Registry",
  "Authentication Method Registry",
  "Authorization Level Registry",
  "Trust Level Registry",
  "Consent Registry",
  "Status Registry",
  "Event Registry",
  "Context Type Registry",
] as const);

export const SECURITY_GATEWAY_REGISTRY_DOES_NOT_OWN = Object.freeze([
  "Authentication Engine",
  "Authorization Engine",
  "Login",
  "OAuth",
  "JWT",
  "Identity Providers",
  "Encryption",
  "Secret Management",
  "Runtime Sessions",
  "Runtime Security",
  "Connector Execution",
  "Executive Routing",
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

export const SECURITY_GATEWAY_REGISTRY_PROHIBITED_SURFACES = Object.freeze([
  "Login",
  "Logout",
  "Authentication",
  "Authorization",
  "OAuth",
  "JWT",
  "MFA execution",
  "Encryption",
  "Secret Management",
  "Token Generation",
  "Identity Verification",
  "HTTP",
  "REST",
  "Databases",
  "AI",
  "LLM",
  "DKL invocation",
  "Engine invocation",
  "Assistant invocation",
  "React",
  "Next.js",
] as const);

/** Canonical immutable registry ownership declaration. */
export const SecurityGatewayRegistryOwnership = Object.freeze({
  ownershipId: "NEA-4:2/SecurityGatewayRegistryOwnership",
  sourcePhase: "NEA-4:2" as const,
  owns: SECURITY_GATEWAY_REGISTRY_OWNS,
  doesNotOwn: SECURITY_GATEWAY_REGISTRY_DOES_NOT_OWN,
  ownsCount: SECURITY_GATEWAY_REGISTRY_OWNS.length,
  doesNotOwnCount: SECURITY_GATEWAY_REGISTRY_DOES_NOT_OWN.length,
  ownsAuthenticationEngine: false as const,
  ownsAuthorizationEngine: false as const,
  ownsLogin: false as const,
  ownsOAuth: false as const,
  ownsJwt: false as const,
  ownsIdentityProviders: false as const,
  ownsEncryption: false as const,
  ownsSecretManagement: false as const,
  ownsRuntimeSessions: false as const,
  ownsRuntimeSecurity: false as const,
  ownsFoundationContracts: false as const,
  runtimeBehavior: "None" as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

/** Canonical immutable registry boundary declarations. */
export const SecurityGatewayRegistryBoundaries = Object.freeze({
  boundariesId: "NEA-4:2/SecurityGatewayRegistryBoundaries",
  sourcePhase: "NEA-4:2" as const,
  consumes: Object.freeze([
    "NEA-4:1 Security Gateway Foundation",
  ] as const),
  provides: Object.freeze(["Security Gateway Registry"] as const),
  prohibitedSurfaces: SECURITY_GATEWAY_REGISTRY_PROHIBITED_SURFACES,
  prohibitedSurfaceCount:
    SECURITY_GATEWAY_REGISTRY_PROHIBITED_SURFACES.length,
  implementsLogin: false as const,
  implementsLogout: false as const,
  executesAuthentication: false as const,
  executesAuthorization: false as const,
  implementsOAuth: false as const,
  implementsJwt: false as const,
  executesMfa: false as const,
  implementsEncryption: false as const,
  managesSecrets: false as const,
  generatesTokens: false as const,
  verifiesIdentity: false as const,
  implementsHttp: false as const,
  implementsRest: false as const,
  accessesDatabase: false as const,
  performsAi: false as const,
  callsLlm: false as const,
  invokesDkl: false as const,
  invokesEngine: false as const,
  invokesAssistant: false as const,
  uiComponents: false as const,
  reactComponents: false as const,
  nextJsRoutes: false as const,
  duplicatesFoundationValues: false as const,
  reconstructsFoundation: false as const,
  runtimeEnforcement: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
