/**
 * NEA-4:2 — Security Gateway Registry Collections.
 *
 * Canonical immutable registry collections.
 * Foundation contracts and lifecycle are referenced — not duplicated.
 * Registry-owned vocabularies are declared here.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by NEA-4:2.
 */

import {
  SecurityGatewayFoundationId,
  SecurityGatewayFoundationPlatform,
} from "./securityGatewayFoundation.ts";
import type {
  SecurityAuthenticationMethodId,
  SecurityAuthorizationLevelId,
  SecurityClassificationId,
  SecurityConsentStateId,
  SecurityContextTypeId,
  SecurityEventId,
  SecurityGatewayRegistryEntry,
  SecurityIdentityDeclaration,
  SecurityPermissionDeclaration,
  SecurityPolicyVocabularyId,
  SecurityRoleId,
  SecurityStatusId,
  SecurityTrustLevelId,
} from "./securityGatewayRegistryTypes.ts";

const foundation = SecurityGatewayFoundationPlatform;

const entry = (
  id: string,
  label: string,
  description: string,
  sourcePhase: "NEA-4:1" | "NEA-4:2",
  foundationReference: string | null,
  order: number,
): SecurityGatewayRegistryEntry =>
  Object.freeze({
    id,
    label,
    description,
    sourcePhase,
    foundationReference,
    executesRuntime: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

/** Contract registry — Foundation canonical references preserved. */
export const SecurityContractRegistry: readonly SecurityGatewayRegistryEntry[] =
  Object.freeze(
    foundation.contracts.contracts.map((item) =>
      entry(
        item.contractId.split("/").at(-1) ?? item.contractId,
        item.contractName,
        item.description,
        "NEA-4:1",
        `${SecurityGatewayFoundationId}/contracts/${item.contractId.split("/").at(-1)}`,
        item.deterministicOrder,
      ),
    ),
  );

/** Lifecycle registry — Foundation canonical references preserved. */
export const SecurityLifecycleRegistry: readonly SecurityGatewayRegistryEntry[] =
  Object.freeze(
    foundation.lifecycle.states.map((state, index) =>
      entry(
        state,
        state,
        `Foundation security lifecycle state ${state}.`,
        "NEA-4:1",
        `${SecurityGatewayFoundationId}/lifecycle/${state}`,
        index + 1,
      ),
    ),
  );

const classification = (
  id: SecurityClassificationId,
  description: string,
  order: number,
): SecurityGatewayRegistryEntry =>
  entry(id, id, description, "NEA-4:2", null, order);

/** Security classification registry — Registry-owned. */
export const SecurityClassificationRegistry: readonly SecurityGatewayRegistryEntry[] =
  Object.freeze([
    classification("Public", "Public security classification.", 1),
    classification("Internal", "Internal security classification.", 2),
    classification("Confidential", "Confidential security classification.", 3),
    classification("Restricted", "Restricted security classification.", 4),
    classification("Secret", "Secret security classification.", 5),
    classification("TopSecret", "TopSecret security classification.", 6),
  ]);

const authMethod = (
  id: SecurityAuthenticationMethodId,
  description: string,
  order: number,
): SecurityGatewayRegistryEntry =>
  entry(id, id, description, "NEA-4:2", null, order);

/** Authentication method registry — metadata only. No authentication runtime. */
export const SecurityAuthenticationMethodRegistry: readonly SecurityGatewayRegistryEntry[] =
  Object.freeze([
    authMethod("Password", "Password authentication method declaration.", 1),
    authMethod("SSO", "Single sign-on authentication method declaration.", 2),
    authMethod("OAuth", "OAuth authentication method declaration.", 3),
    authMethod(
      "OpenIDConnect",
      "OpenID Connect authentication method declaration.",
      4,
    ),
    authMethod("SAML", "SAML authentication method declaration.", 5),
    authMethod("APIKey", "API key authentication method declaration.", 6),
    authMethod(
      "Certificate",
      "Certificate authentication method declaration.",
      7,
    ),
    authMethod("MFA", "Multi-factor authentication method declaration.", 8),
  ]);

const authzLevel = (
  id: SecurityAuthorizationLevelId,
  description: string,
  order: number,
): SecurityGatewayRegistryEntry =>
  entry(id, id, description, "NEA-4:2", null, order);

/** Authorization level registry — metadata only. No authorization runtime. */
export const SecurityAuthorizationLevelRegistry: readonly SecurityGatewayRegistryEntry[] =
  Object.freeze([
    authzLevel("None", "No authorization level.", 1),
    authzLevel("Read", "Read authorization level.", 2),
    authzLevel("Write", "Write authorization level.", 3),
    authzLevel("Execute", "Execute authorization level.", 4),
    authzLevel("Admin", "Admin authorization level.", 5),
    authzLevel("Owner", "Owner authorization level.", 6),
  ]);

const trustLevel = (
  id: SecurityTrustLevelId,
  description: string,
  order: number,
): SecurityGatewayRegistryEntry =>
  entry(id, id, description, "NEA-4:2", null, order);

/** Trust level registry — metadata only. No trust evaluation. */
export const SecurityTrustLevelRegistry: readonly SecurityGatewayRegistryEntry[] =
  Object.freeze([
    trustLevel("Unknown", "Unknown trust level.", 1),
    trustLevel("Low", "Low trust level.", 2),
    trustLevel("Medium", "Medium trust level.", 3),
    trustLevel("High", "High trust level.", 4),
    trustLevel("Verified", "Verified trust level.", 5),
  ]);

const consentState = (
  id: SecurityConsentStateId,
  description: string,
  order: number,
): SecurityGatewayRegistryEntry =>
  entry(id, id, description, "NEA-4:2", null, order);

/** Consent state registry — metadata only. No consent collection. */
export const SecurityConsentStateRegistry: readonly SecurityGatewayRegistryEntry[] =
  Object.freeze([
    consentState("Unknown", "Unknown consent state.", 1),
    consentState("Pending", "Pending consent state.", 2),
    consentState("Granted", "Granted consent state.", 3),
    consentState("Denied", "Denied consent state.", 4),
    consentState("Revoked", "Revoked consent state.", 5),
  ]);

const role = (
  id: SecurityRoleId,
  label: string,
  description: string,
  order: number,
): SecurityGatewayRegistryEntry =>
  entry(id, label, description, "NEA-4:2", null, order);

/** Role registry — architectural roles only. No role assignment. */
export const SecurityRoleRegistry: readonly SecurityGatewayRegistryEntry[] =
  Object.freeze([
    role("CEO", "CEO", "Chief executive architectural role.", 1),
    role("Executive", "Executive", "Executive architectural role.", 2),
    role("Manager", "Manager", "Manager architectural role.", 3),
    role("Employee", "Employee", "Employee architectural role.", 4),
    role("System", "System", "System architectural role.", 5),
    role("Service", "Service", "Service architectural role.", 6),
    role("Connector", "Connector", "Connector architectural role.", 7),
    role(
      "ExternalUser",
      "External User",
      "External user architectural role.",
      8,
    ),
  ]);

const securityPolicy = (
  id: SecurityPolicyVocabularyId,
  label: string,
  description: string,
  order: number,
): SecurityGatewayRegistryEntry =>
  entry(id, label, description, "NEA-4:2", null, order);

/** Security policy vocabulary registry — declarations only. No policy engine. */
export const SecurityPolicyVocabularyRegistry: readonly SecurityGatewayRegistryEntry[] =
  Object.freeze([
    securityPolicy(
      "LeastPrivilege",
      "Least Privilege",
      "Least privilege architectural policy declaration.",
      1,
    ),
    securityPolicy(
      "NeedToKnow",
      "Need To Know",
      "Need-to-know architectural policy declaration.",
      2,
    ),
    securityPolicy(
      "SeparationOfDuty",
      "Separation Of Duty",
      "Separation of duty architectural policy declaration.",
      3,
    ),
    securityPolicy(
      "ZeroTrust",
      "Zero Trust",
      "Zero trust architectural policy declaration.",
      4,
    ),
    securityPolicy(
      "AuditRequired",
      "Audit Required",
      "Audit-required architectural policy declaration.",
      5,
    ),
    securityPolicy(
      "TenantIsolation",
      "Tenant Isolation",
      "Tenant isolation architectural policy declaration.",
      6,
    ),
  ]);

const status = (
  id: SecurityStatusId,
  description: string,
  order: number,
): SecurityGatewayRegistryEntry =>
  entry(id, id, description, "NEA-4:2", null, order);

/** Security status registry — Registry-owned. */
export const SecurityStatusRegistry: readonly SecurityGatewayRegistryEntry[] =
  Object.freeze([
    status("Declared", "Architecture declared status.", 1),
    status("Registered", "Architecture registered status.", 2),
    status("Certified", "Architecture certified status.", 3),
    status("Frozen", "Architecture frozen status.", 4),
    status("Deprecated", "Architecture deprecated status.", 5),
  ]);

const event = (
  id: SecurityEventId,
  label: string,
  description: string,
  order: number,
): SecurityGatewayRegistryEntry =>
  entry(id, label, description, "NEA-4:2", null, order);

/** Security event registry — metadata only. No event processing. */
export const SecurityEventRegistry: readonly SecurityGatewayRegistryEntry[] =
  Object.freeze([
    event(
      "AuthenticationRequested",
      "Authentication Requested",
      "Declarative authentication-requested event.",
      1,
    ),
    event(
      "AuthorizationChecked",
      "Authorization Checked",
      "Declarative authorization-checked event.",
      2,
    ),
    event(
      "TrustEvaluated",
      "Trust Evaluated",
      "Declarative trust-evaluated event.",
      3,
    ),
    event(
      "ConsentVerified",
      "Consent Verified",
      "Declarative consent-verified event.",
      4,
    ),
    event(
      "PermissionEvaluated",
      "Permission Evaluated",
      "Declarative permission-evaluated event.",
      5,
    ),
    event(
      "PolicyMatched",
      "Policy Matched",
      "Declarative policy-matched event.",
      6,
    ),
  ]);

const contextType = (
  id: SecurityContextTypeId,
  description: string,
  order: number,
): SecurityGatewayRegistryEntry =>
  entry(id, id, description, "NEA-4:2", null, order);

/** Security context type registry — Registry-owned. */
export const SecurityContextTypeRegistry: readonly SecurityGatewayRegistryEntry[] =
  Object.freeze([
    contextType("Security", "Security context type classification.", 1),
    contextType(
      "Authentication",
      "Authentication context type classification.",
      2,
    ),
    contextType(
      "Authorization",
      "Authorization context type classification.",
      3,
    ),
    contextType("Trust", "Trust context type classification.", 4),
    contextType("Consent", "Consent context type classification.", 5),
    contextType("Permission", "Permission context type classification.", 6),
    contextType("Role", "Role context type classification.", 7),
    contextType("Policy", "Policy context type classification.", 8),
  ]);

const permission = (
  key: string,
  permissionName: string,
  description: string,
  order: number,
): SecurityPermissionDeclaration =>
  Object.freeze({
    permissionId: `NEA-4:2/Permission/${key}`,
    permissionName,
    description,
    enforcesPermission: false as const,
    executesRuntime: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

/** Permission registry — declarations only. No permission execution. */
export const SecurityPermissionRegistry: readonly SecurityPermissionDeclaration[] =
  Object.freeze([
    permission(
      "ReadSecurityMetadata",
      "Read Security Metadata",
      "Declarative permission to read security metadata.",
      1,
    ),
    permission(
      "DeclareIdentity",
      "Declare Identity",
      "Declarative permission to declare security identity metadata.",
      2,
    ),
    permission(
      "MatchPolicy",
      "Match Policy",
      "Declarative permission to declare policy matching metadata.",
      3,
    ),
    permission(
      "EvaluateTrust",
      "Evaluate Trust",
      "Declarative permission to declare trust evaluation metadata.",
      4,
    ),
    permission(
      "VerifyConsent",
      "Verify Consent",
      "Declarative permission to declare consent verification metadata.",
      5,
    ),
    permission(
      "EvaluatePermission",
      "Evaluate Permission",
      "Declarative permission to declare permission evaluation metadata.",
      6,
    ),
    permission(
      "ClassifySecurity",
      "Classify Security",
      "Declarative permission to declare security classification metadata.",
      7,
    ),
    permission(
      "AuditSecurity",
      "Audit Security",
      "Declarative permission to declare security audit metadata.",
      8,
    ),
  ]);

const securityIdentity = (
  key: string,
  securityName: string,
  classification: SecurityClassificationId,
  lifecycle: string,
  order: number,
): SecurityIdentityDeclaration =>
  Object.freeze({
    securityId: `NEA-4:2/SecurityIdentity/${key}`,
    securityName,
    version: "1.0.0" as const,
    classification,
    status: "Registered" as const,
    lifecycle,
    executesRuntime: false as const,
    managesRuntimeSecurity: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

/**
 * Security identity registry — declarative identities only.
 * No runtime authentication or identity verification.
 */
export const SecurityIdentityRegistry: readonly SecurityIdentityDeclaration[] =
  Object.freeze([
    securityIdentity(
      "ExecutivePrincipal",
      "Executive Principal",
      "Confidential",
      "Declared→Classified→Reviewed→Approved",
      1,
    ),
    securityIdentity(
      "ServicePrincipal",
      "Service Principal",
      "Internal",
      "Declared→Classified→Reviewed→Approved",
      2,
    ),
    securityIdentity(
      "ConnectorPrincipal",
      "Connector Principal",
      "Internal",
      "Declared→Classified→Reviewed→Approved",
      3,
    ),
    securityIdentity(
      "ExternalUserPrincipal",
      "External User Principal",
      "Restricted",
      "Declared→Classified→Reviewed→Approved",
      4,
    ),
    securityIdentity(
      "SystemPrincipal",
      "System Principal",
      "Secret",
      "Declared→Classified→Reviewed→Approved",
      5,
    ),
    securityIdentity(
      "TenantAdminPrincipal",
      "Tenant Admin Principal",
      "Confidential",
      "Declared→Classified→Reviewed→Approved",
      6,
    ),
    securityIdentity(
      "AuditPrincipal",
      "Audit Principal",
      "Restricted",
      "Declared→Classified→Reviewed→Approved",
      7,
    ),
    securityIdentity(
      "GuestPrincipal",
      "Guest Principal",
      "Public",
      "Declared→Classified→Reviewed",
      8,
    ),
  ]);

/** Aggregate collections object for platform composition. */
export const SecurityGatewayRegistryCollections = Object.freeze({
  collectionsId: "NEA-4:2/RegistryCollections",
  sourcePhase: "NEA-4:2" as const,
  securityIdentities: SecurityIdentityRegistry,
  classifications: SecurityClassificationRegistry,
  authenticationMethods: SecurityAuthenticationMethodRegistry,
  authorizationLevels: SecurityAuthorizationLevelRegistry,
  trustLevels: SecurityTrustLevelRegistry,
  consentStates: SecurityConsentStateRegistry,
  roles: SecurityRoleRegistry,
  permissions: SecurityPermissionRegistry,
  securityPolicies: SecurityPolicyVocabularyRegistry,
  statuses: SecurityStatusRegistry,
  events: SecurityEventRegistry,
  contextTypes: SecurityContextTypeRegistry,
  contracts: SecurityContractRegistry,
  lifecycleEntries: SecurityLifecycleRegistry,
  securityIdentityCount: SecurityIdentityRegistry.length,
  classificationCount: SecurityClassificationRegistry.length,
  authenticationMethodCount: SecurityAuthenticationMethodRegistry.length,
  authorizationLevelCount: SecurityAuthorizationLevelRegistry.length,
  trustLevelCount: SecurityTrustLevelRegistry.length,
  consentStateCount: SecurityConsentStateRegistry.length,
  roleCount: SecurityRoleRegistry.length,
  permissionCount: SecurityPermissionRegistry.length,
  securityPolicyCount: SecurityPolicyVocabularyRegistry.length,
  statusCount: SecurityStatusRegistry.length,
  eventCount: SecurityEventRegistry.length,
  contextTypeCount: SecurityContextTypeRegistry.length,
  contractCount: SecurityContractRegistry.length,
  lifecycleEntryCount: SecurityLifecycleRegistry.length,
  duplicatesFoundationValues: false as const,
  reconstructsFoundation: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
