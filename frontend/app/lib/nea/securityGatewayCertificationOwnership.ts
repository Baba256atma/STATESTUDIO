/**
 * NEA-4:7 — Security Gateway Certification Ownership.
 *
 * Ownership and boundary declarations for Security Gateway Certification.
 * Metadata only — no runtime assignment.
 *
 * Ownership: owned exclusively by NEA-4:7.
 */

export const SECURITY_GATEWAY_CERTIFICATION_OWNS = Object.freeze([
  "Certification Gates",
  "Compliance Metadata",
  "Certification Summary",
  "Certification Status",
] as const);

export const SECURITY_GATEWAY_CERTIFICATION_DOES_NOT_OWN = Object.freeze([
  "Foundation Contracts",
  "Registry Collections",
  "Domain Models",
  "Validation Rules",
  "Manifest Inventory",
  "Platform Composition",
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
  "Gateway Routing",
  "DKL",
  "Executive Engine",
  "Assistant",
  "Advisor",
  "Director",
  "EVE",
] as const);

export const SECURITY_GATEWAY_CERTIFICATION_PROHIBITED_SURFACES =
  Object.freeze([
    "Authentication",
    "Authorization",
    "Permission Evaluation",
    "Trust Evaluation",
    "Consent Enforcement",
    "Login",
    "Logout",
    "OAuth",
    "JWT",
    "SAML",
    "OpenID Connect",
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

/** Canonical immutable certification ownership declaration. */
export const SecurityGatewayCertificationOwnership = Object.freeze({
  ownershipId: "NEA-4:7/SecurityGatewayCertificationOwnership",
  sourcePhase: "NEA-4:7" as const,
  owns: SECURITY_GATEWAY_CERTIFICATION_OWNS,
  doesNotOwn: SECURITY_GATEWAY_CERTIFICATION_DOES_NOT_OWN,
  ownsCount: SECURITY_GATEWAY_CERTIFICATION_OWNS.length,
  doesNotOwnCount: SECURITY_GATEWAY_CERTIFICATION_DOES_NOT_OWN.length,
  ownsFoundationContracts: false as const,
  ownsRegistryCollections: false as const,
  ownsDomainModels: false as const,
  ownsValidationRules: false as const,
  ownsManifestInventory: false as const,
  ownsPlatformComposition: false as const,
  ownsAuthentication: false as const,
  ownsAuthorization: false as const,
  ownsEncryption: false as const,
  ownsRuntimeSecurity: false as const,
  runtimeBehavior: "None" as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

/** Canonical immutable certification boundary declarations. */
export const SecurityGatewayCertificationBoundaries = Object.freeze({
  boundariesId: "NEA-4:7/SecurityGatewayCertificationBoundaries",
  sourcePhase: "NEA-4:7" as const,
  consumes: Object.freeze([
    "NEA-4:6 Security Gateway Platform",
  ] as const),
  provides: Object.freeze([
    "Security Gateway Certification",
  ] as const),
  prohibitedSurfaces: SECURITY_GATEWAY_CERTIFICATION_PROHIBITED_SURFACES,
  prohibitedSurfaceCount:
    SECURITY_GATEWAY_CERTIFICATION_PROHIBITED_SURFACES.length,
  runtimeEnforcement: false as const,
  runtimeCertification: false as const,
  runtimeValidation: false as const,
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
  networkingBehavior: false as const,
  persistenceBehavior: false as const,
  accessesDatabase: false as const,
  implementsQueue: false as const,
  gatewayRouting: false as const,
  performsAi: false as const,
  callsLlm: false as const,
  invokesDkl: false as const,
  invokesEngine: false as const,
  invokesAssistant: false as const,
  reactComponents: false as const,
  nextJsRoutes: false as const,
  duplicatesPlatformArchitecture: false as const,
  redefinesPriorPhases: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
