/**
 * NEA-4:2 — Security Gateway Registry Types.
 *
 * Readonly contracts and closed vocabularies for the Security Gateway Registry.
 * Metadata-only. No runtime authentication, authorization, or encryption.
 *
 * Ownership: owned exclusively by NEA-4:2.
 */

/** Registry status for NEA-4:2. */
export type SecurityGatewayRegistryStatus = "Registry";

/** Immediate downstream readiness — Model only. */
export type SecurityGatewayRegistryReadiness = "ReadyForModel";

/** Registry-owned security classification identifiers. */
export type SecurityClassificationId =
  | "Public"
  | "Internal"
  | "Confidential"
  | "Restricted"
  | "Secret"
  | "TopSecret";

/** Registry-owned authentication method identifiers. */
export type SecurityAuthenticationMethodId =
  | "Password"
  | "SSO"
  | "OAuth"
  | "OpenIDConnect"
  | "SAML"
  | "APIKey"
  | "Certificate"
  | "MFA";

/** Registry-owned authorization level identifiers. */
export type SecurityAuthorizationLevelId =
  | "None"
  | "Read"
  | "Write"
  | "Execute"
  | "Admin"
  | "Owner";

/** Registry-owned trust level identifiers. */
export type SecurityTrustLevelId =
  | "Unknown"
  | "Low"
  | "Medium"
  | "High"
  | "Verified";

/** Registry-owned consent state identifiers. */
export type SecurityConsentStateId =
  | "Unknown"
  | "Pending"
  | "Granted"
  | "Denied"
  | "Revoked";

/** Registry-owned architectural role identifiers. */
export type SecurityRoleId =
  | "CEO"
  | "Executive"
  | "Manager"
  | "Employee"
  | "System"
  | "Service"
  | "Connector"
  | "ExternalUser";

/** Registry-owned security status identifiers. */
export type SecurityStatusId =
  | "Declared"
  | "Registered"
  | "Certified"
  | "Frozen"
  | "Deprecated";

/** Registry-owned security event identifiers. */
export type SecurityEventId =
  | "AuthenticationRequested"
  | "AuthorizationChecked"
  | "TrustEvaluated"
  | "ConsentVerified"
  | "PermissionEvaluated"
  | "PolicyMatched";

/** Registry-owned security context type identifiers. */
export type SecurityContextTypeId =
  | "Security"
  | "Authentication"
  | "Authorization"
  | "Trust"
  | "Consent"
  | "Permission"
  | "Role"
  | "Policy";

/** Registry-owned security policy vocabulary identifiers. */
export type SecurityPolicyVocabularyId =
  | "LeastPrivilege"
  | "NeedToKnow"
  | "SeparationOfDuty"
  | "ZeroTrust"
  | "AuditRequired"
  | "TenantIsolation";

/** Base registry entry shape. */
export interface SecurityGatewayRegistryEntry {
  readonly id: string;
  readonly label: string;
  readonly description: string;
  readonly sourcePhase: "NEA-4:1" | "NEA-4:2";
  readonly foundationReference: string | null;
  readonly executesRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/** Declarative security identity registry entry. */
export interface SecurityIdentityDeclaration {
  readonly securityId: string;
  readonly securityName: string;
  readonly version: string;
  readonly classification: SecurityClassificationId;
  readonly status: SecurityStatusId;
  readonly lifecycle: string;
  readonly executesRuntime: false;
  readonly managesRuntimeSecurity: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/** Declarative permission registry entry. */
export interface SecurityPermissionDeclaration {
  readonly permissionId: string;
  readonly permissionName: string;
  readonly description: string;
  readonly enforcesPermission: false;
  readonly executesRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/** Canonical registry identity. */
export interface SecurityGatewayRegistryIdentity {
  readonly registryId: string;
  readonly registryName: string;
  readonly registryVersion: string;
  readonly registryNamespace: string;
  readonly layer: "NEA";
  readonly phase: "NEA-4:2";
  readonly stage: "Registry";
  readonly sourcePhase: "NEA-4:2";
  readonly owner: string;
  readonly status: SecurityGatewayRegistryStatus;
  readonly readiness: SecurityGatewayRegistryReadiness;
  readonly foundationId: string;
  readonly foundationVersion: string;
  readonly description: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Deterministic registry summary. */
export interface SecurityGatewayRegistrySummary {
  readonly registryId: string;
  readonly version: string;
  readonly name: string;
  readonly namespace: string;
  readonly layer: "NEA";
  readonly phase: "NEA-4:2";
  readonly status: SecurityGatewayRegistryStatus;
  readonly readiness: SecurityGatewayRegistryReadiness;
  readonly foundationId: string;
  readonly securityIdentityCount: number;
  readonly classificationCount: number;
  readonly authenticationMethodCount: number;
  readonly authorizationLevelCount: number;
  readonly trustLevelCount: number;
  readonly consentStateCount: number;
  readonly roleCount: number;
  readonly permissionCount: number;
  readonly securityPolicyCount: number;
  readonly statusCount: number;
  readonly eventCount: number;
  readonly contextTypeCount: number;
  readonly contractCount: number;
  readonly capabilityCount: number;
  readonly lifecycleEntryCount: number;
  readonly registryPolicyCount: number;
  readonly totalRegistryEntryCount: number;
  readonly publicExportCount: number;
  readonly sectionCount: number;
  readonly nextPhase: string;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}
