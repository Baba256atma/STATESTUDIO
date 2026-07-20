/**
 * NEA-4:3 — Security Gateway Domain Models.
 *
 * Immutable domain model kind declarations composed from Registry references.
 * Strongly typed structure only. No security execution. No runtime behavior.
 *
 * Ownership: owned exclusively by NEA-4:3.
 */

import {
  SecurityGatewayRegistryId,
  SecurityGatewayRegistryPlatform,
} from "./securityGatewayRegistry.ts";
import type {
  SecurityGatewayModelKindDescriptor,
  SecurityIdentityModel,
  SecurityPrincipalModel,
} from "./securityGatewayModelTypes.ts";

const registry = SecurityGatewayRegistryPlatform;

const kind = (
  modelKind: SecurityGatewayModelKindDescriptor["modelKind"],
  modelName: string,
  description: string,
  registryCollections: SecurityGatewayModelKindDescriptor["registryCollections"],
  fieldCount: number,
  composesModels: SecurityGatewayModelKindDescriptor["composesModels"],
  order: number,
): SecurityGatewayModelKindDescriptor =>
  Object.freeze({
    modelKind,
    modelName,
    description,
    registryCollections: Object.freeze([...registryCollections]),
    fieldCount,
    composesModels: Object.freeze([...composesModels]),
    executesRuntime: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

/**
 * Exactly twenty Security Gateway domain model kinds.
 * Registry collections are referenced, never duplicated.
 */
export const SecurityGatewayDomainModels: readonly SecurityGatewayModelKindDescriptor[] =
  Object.freeze([
    kind(
      "SecurityIdentity",
      "Security Identity Model",
      "Immutable security identity structure.",
      Object.freeze(["securityIdentities", "classifications", "statuses"]),
      5,
      Object.freeze([]),
      1,
    ),
    kind(
      "SecurityPrincipal",
      "Security Principal Model",
      "Principal associated with a security identity — no identity verification.",
      Object.freeze(["roles"]),
      4,
      Object.freeze([]),
      2,
    ),
    kind(
      "SecurityContext",
      "Security Context Model",
      "Composed declarative security context references.",
      Object.freeze([
        "securityIdentities",
        "roles",
        "permissions",
        "securityPolicies",
        "contextTypes",
      ]),
      14,
      Object.freeze([
        "SecurityIdentity",
        "SecurityPrincipal",
        "AuthenticationContext",
        "AuthorizationContext",
        "TrustContext",
        "ConsentContext",
        "Role",
        "Permission",
        "SecurityPolicy",
        "SecurityMetadata",
      ]),
      3,
    ),
    kind(
      "AuthenticationContext",
      "Authentication Context Model",
      "Authentication method and assurance metadata — no authentication execution.",
      Object.freeze(["authenticationMethods", "statuses"]),
      5,
      Object.freeze([]),
      4,
    ),
    kind(
      "AuthorizationContext",
      "Authorization Context Model",
      "Authorization level and declaration metadata — no authorization execution.",
      Object.freeze([
        "authorizationLevels",
        "roles",
        "permissions",
        "securityPolicies",
      ]),
      7,
      Object.freeze([
        "SecurityResource",
        "SecurityAction",
        "Role",
        "Permission",
        "SecurityPolicy",
      ]),
      5,
    ),
    kind(
      "TrustContext",
      "Trust Context Model",
      "Trust level and source metadata — no trust calculation.",
      Object.freeze(["trustLevels"]),
      5,
      Object.freeze([]),
      6,
    ),
    kind(
      "ConsentContext",
      "Consent Context Model",
      "Consent state and scope metadata — no consent enforcement.",
      Object.freeze(["consentStates"]),
      6,
      Object.freeze([]),
      7,
    ),
    kind(
      "Role",
      "Role Model",
      "Canonical Registry role metadata — no runtime role assignment.",
      Object.freeze(["roles"]),
      3,
      Object.freeze([]),
      8,
    ),
    kind(
      "Permission",
      "Permission Model",
      "Immutable permission declarations — no permission evaluation.",
      Object.freeze(["permissions"]),
      6,
      Object.freeze(["SecurityResource", "SecurityAction", "SecurityConstraint"]),
      9,
    ),
    kind(
      "SecurityClassification",
      "Security Classification Model",
      "Canonical classification values and metadata.",
      Object.freeze(["classifications"]),
      3,
      Object.freeze([]),
      10,
    ),
    kind(
      "SecurityPolicy",
      "Security Policy Model",
      "Architectural policy declarations — no policy execution.",
      Object.freeze(["securityPolicies"]),
      4,
      Object.freeze(["SecurityConstraint"]),
      11,
    ),
    kind(
      "SecurityEvent",
      "Security Event Model",
      "Security event declarations only — no event processing.",
      Object.freeze(["events"]),
      3,
      Object.freeze([]),
      12,
    ),
    kind(
      "SecurityMetadata",
      "Security Metadata Model",
      "Immutable security metadata structure.",
      Object.freeze(["securityIdentities", "statuses", "lifecycleEntries"]),
      5,
      Object.freeze(["SecurityIdentity"]),
      13,
    ),
    kind(
      "SecurityDecisionDeclaration",
      "Security Decision Declaration Model",
      "Declared security outcome structure — no decision calculation.",
      Object.freeze(["statuses", "authorizationLevels"]),
      4,
      Object.freeze(["AuthorizationContext"]),
      14,
    ),
    kind(
      "SecurityResource",
      "Security Resource Model",
      "Protected resource by immutable reference.",
      Object.freeze(["contextTypes"]),
      3,
      Object.freeze([]),
      15,
    ),
    kind(
      "SecurityAction",
      "Security Action Model",
      "Requested action by canonical declaration.",
      Object.freeze(["authorizationLevels"]),
      3,
      Object.freeze([]),
      16,
    ),
    kind(
      "SecurityConstraint",
      "Security Constraint Model",
      "Declarative restriction metadata — no constraint execution.",
      Object.freeze([
        "roles",
        "permissions",
        "classifications",
        "securityPolicies",
      ]),
      7,
      Object.freeze([]),
      17,
    ),
    kind(
      "SecurityDiagnostic",
      "Security Diagnostic Model",
      "Security errors, warnings, missing context, and conflicts metadata.",
      Object.freeze(["statuses", "events"]),
      5,
      Object.freeze([]),
      18,
    ),
    kind(
      "SecurityResult",
      "Security Result Model",
      "Structural result of future security processing — no processing.",
      Object.freeze(["statuses"]),
      5,
      Object.freeze(["SecurityDecisionDeclaration", "SecurityDiagnostic"]),
      19,
    ),
    kind(
      "SecuritySummary",
      "Security Summary Model",
      "Immutable aggregate metadata for a security context.",
      Object.freeze(["securityIdentities", "statuses"]),
      6,
      Object.freeze(["SecurityContext", "SecurityResult"]),
      20,
    ),
  ]);

/**
 * Security identity model instances derived from Registry security identities.
 * Structure only — no runtime security.
 */
export const SecurityIdentityModels: readonly SecurityIdentityModel[] =
  Object.freeze(
    registry.collections.securityIdentities.map((item) =>
      Object.freeze({
        modelKind: "SecurityIdentity" as const,
        securityId: item.securityId,
        version: item.version,
        classification: item.classification,
        status: item.status,
        lifecycle: item.lifecycle,
        registryIdentityRef: item.securityId,
        managesRuntimeSecurity: false as const,
        metadataOnly: true as const,
        immutable: true as const,
        deterministicOrder: item.deterministicOrder,
      }),
    ),
  );

/**
 * Security principal model instances derived from Registry roles.
 * Structure only — no identity verification.
 */
export const SecurityPrincipalModels: readonly SecurityPrincipalModel[] =
  Object.freeze(
    registry.collections.roles.map((item) =>
      Object.freeze({
        modelKind: "SecurityPrincipal" as const,
        principalId: `NEA-4:3/Principal/${item.id}`,
        principalName: item.label,
        principalCategory: item.id,
        registryRoleRef: item.id,
        verifiesIdentity: false as const,
        metadataOnly: true as const,
        immutable: true as const,
        deterministicOrder: item.deterministicOrder,
      }),
    ),
  );

/** Registry anchors — counts derived from Registry collections by reference. */
export const SecurityGatewayModelRegistryAnchors = Object.freeze({
  registryId: SecurityGatewayRegistryId,
  sourcePhase: "NEA-4:3" as const,
  securityIdentityCount: registry.collections.securityIdentityCount,
  classificationCount: registry.collections.classificationCount,
  authenticationMethodCount: registry.collections.authenticationMethodCount,
  authorizationLevelCount: registry.collections.authorizationLevelCount,
  trustLevelCount: registry.collections.trustLevelCount,
  consentStateCount: registry.collections.consentStateCount,
  roleCount: registry.collections.roleCount,
  permissionCount: registry.collections.permissionCount,
  securityPolicyCount: registry.collections.securityPolicyCount,
  statusCount: registry.collections.statusCount,
  eventCount: registry.collections.eventCount,
  contextTypeCount: registry.collections.contextTypeCount,
  contractCount: registry.collections.contractCount,
  lifecycleEntryCount: registry.collections.lifecycleEntryCount,
  capabilityCount: registry.capabilities.capabilityCount,
  registryPolicyCount: registry.policies.policyCount,
  duplicatesRegistryValues: false as const,
  preservesCanonicalReferences: true as const,
  metadataOnly: true as const,
  immutable: true as const,
});

/** Canonical immutable domain model catalog. */
export const SecurityGatewayDomainModelCatalog = Object.freeze({
  catalogId: "NEA-4:3/DomainModelCatalog",
  sourcePhase: "NEA-4:3" as const,
  models: SecurityGatewayDomainModels,
  modelCount: SecurityGatewayDomainModels.length,
  securityIdentityModels: SecurityIdentityModels,
  securityIdentityModelCount: SecurityIdentityModels.length,
  securityPrincipalModels: SecurityPrincipalModels,
  securityPrincipalModelCount: SecurityPrincipalModels.length,
  registryAnchors: SecurityGatewayModelRegistryAnchors,
  executesRuntime: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
