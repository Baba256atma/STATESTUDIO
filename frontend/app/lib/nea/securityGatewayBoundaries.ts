/**
 * NEA-4:1 — Security Gateway Boundaries.
 *
 * Architectural boundary and prohibited surface declarations.
 * Metadata only — no runtime enforcement.
 *
 * Ownership: owned exclusively by NEA-4:1.
 */

export const SECURITY_GATEWAY_PROHIBITED_SURFACES = Object.freeze([
  "Login",
  "Logout",
  "Authentication",
  "Authorization",
  "OAuth",
  "JWT",
  "SAML",
  "OpenID Connect",
  "API Keys",
  "Encryption",
  "Secret Management",
  "Token Generation",
  "HTTP",
  "REST",
  "Database",
  "AI",
  "LLM",
  "DKL invocation",
  "Engine invocation",
  "Assistant invocation",
  "React",
  "Next.js",
] as const);

/** Canonical immutable boundary declarations. */
export const SecurityGatewayBoundaries = Object.freeze({
  boundariesId: "NEA-4:1/SecurityGatewayBoundaries",
  sourcePhase: "NEA-4:1" as const,
  consumes: Object.freeze([
    "NEA-3 Session & Conversation Public Index",
  ] as const),
  provides: Object.freeze(["Security Gateway Foundation"] as const),
  prohibitedSurfaces: SECURITY_GATEWAY_PROHIBITED_SURFACES,
  prohibitedSurfaceCount: SECURITY_GATEWAY_PROHIBITED_SURFACES.length,
  implementsLogin: false as const,
  implementsLogout: false as const,
  executesAuthentication: false as const,
  executesAuthorization: false as const,
  implementsOAuth: false as const,
  implementsJwt: false as const,
  implementsSaml: false as const,
  implementsOpenIdConnect: false as const,
  implementsApiKeys: false as const,
  implementsEncryption: false as const,
  managesSecrets: false as const,
  generatesTokens: false as const,
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
  runtimeEnforcement: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
