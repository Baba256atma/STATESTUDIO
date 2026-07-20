/**
 * NEA-4:1 — Security Gateway Ownership.
 *
 * Ownership and non-ownership declarations for Security Gateway Foundation.
 * Metadata only — no runtime assignment.
 *
 * Ownership: owned exclusively by NEA-4:1.
 */

export const SECURITY_GATEWAY_OWNS = Object.freeze([
  "Security architecture",
  "Security metadata",
  "Security contracts",
  "Security lifecycle",
  "Security vocabulary",
  "Security capabilities",
  "Ownership",
  "Architectural Boundaries",
] as const);

export const SECURITY_GATEWAY_DOES_NOT_OWN = Object.freeze([
  "Authentication Engine",
  "Authorization Engine",
  "Identity Provider",
  "OAuth",
  "JWT",
  "API Keys",
  "Encryption",
  "Secrets",
  "Tokens",
  "Runtime Sessions",
  "Runtime Conversations",
  "Connector Execution",
  "Executive Routing",
  "DKL",
  "Engine",
  "Assistant",
  "Advisor",
  "Director",
  "EVE",
  "Runtime authentication",
  "Runtime authorization",
  "Login",
  "Token generation",
  "Identity verification",
  "Key management",
  "API gateway",
  "Firewall",
  "Runtime security",
] as const);

/** Canonical immutable ownership declaration. */
export const SecurityGatewayOwnership = Object.freeze({
  ownershipId: "NEA-4:1/SecurityGatewayOwnership",
  sourcePhase: "NEA-4:1" as const,
  owns: SECURITY_GATEWAY_OWNS,
  doesNotOwn: SECURITY_GATEWAY_DOES_NOT_OWN,
  ownsCount: SECURITY_GATEWAY_OWNS.length,
  doesNotOwnCount: SECURITY_GATEWAY_DOES_NOT_OWN.length,
  ownsAuthenticationEngine: false as const,
  ownsAuthorizationEngine: false as const,
  ownsIdentityProvider: false as const,
  ownsOAuth: false as const,
  ownsJwt: false as const,
  ownsApiKeys: false as const,
  ownsEncryption: false as const,
  ownsSecrets: false as const,
  ownsTokens: false as const,
  ownsRuntimeSessions: false as const,
  ownsRuntimeConversations: false as const,
  ownsConnectorExecution: false as const,
  ownsExecutiveRouting: false as const,
  ownsDkl: false as const,
  ownsEngine: false as const,
  ownsAssistant: false as const,
  ownsRuntimeAuthentication: false as const,
  ownsRuntimeAuthorization: false as const,
  ownsLogin: false as const,
  ownsTokenGeneration: false as const,
  ownsEncryptionRuntime: false as const,
  ownsKeyManagement: false as const,
  ownsApiGateway: false as const,
  ownsFirewall: false as const,
  ownsRuntimeSecurity: false as const,
  runtimeBehavior: "None" as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
