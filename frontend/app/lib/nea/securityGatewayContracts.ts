/**
 * NEA-4:1 — Security Gateway Contracts.
 *
 * Immutable contract declarations for Security Gateway Foundation surfaces.
 * Declarations only. No runtime authentication, authorization, or encryption.
 *
 * Ownership: owned exclusively by NEA-4:1.
 */

import type { SecurityGatewayContractDeclaration } from "./securityGatewayFoundationTypes.ts";

const contract = (
  key: string,
  contractName: string,
  description: string,
  fields: readonly string[],
  order: number,
): SecurityGatewayContractDeclaration =>
  Object.freeze({
    contractId: `NEA-4:1/Contract/${key}`,
    contractName,
    description,
    fields: Object.freeze([...fields]),
    metadataOnly: true as const,
    immutable: true as const,
    runtimeBehavior: "None" as const,
    deterministicOrder: order,
  });

/**
 * Exactly twelve security foundation contracts.
 * Order is deterministic and immutable.
 */
export const SecurityGatewayContracts: readonly SecurityGatewayContractDeclaration[] =
  Object.freeze([
    contract(
      "SecurityIdentity",
      "Security Identity",
      "Canonical identity fields for a declared security subject or principal.",
      Object.freeze([
        "securityIdentityId",
        "securityIdentityName",
        "securityIdentityVersion",
        "securityIdentityNamespace",
        "securityIdentityKind",
      ]),
      1,
    ),
    contract(
      "SecurityContext",
      "Security Context",
      "Declarative security context dimensions — no runtime security evaluation.",
      Object.freeze([
        "securityContextId",
        "tenant",
        "workspace",
        "classification",
        "trustLevel",
        "metadataOnly",
      ]),
      2,
    ),
    contract(
      "AuthenticationContext",
      "Authentication Context",
      "Declarative authentication context vocabulary — no login or token runtime.",
      Object.freeze([
        "authenticationContextId",
        "subjectRef",
        "methodRef",
        "assuranceLevel",
        "executesAuthentication",
      ]),
      3,
    ),
    contract(
      "AuthorizationContext",
      "Authorization Context",
      "Declarative authorization context vocabulary — no access-control runtime.",
      Object.freeze([
        "authorizationContextId",
        "subjectRef",
        "resourceRef",
        "actionRef",
        "executesAuthorization",
      ]),
      4,
    ),
    contract(
      "TrustContext",
      "Trust Context",
      "Declarative trust context dimensions — no trust evaluation engine.",
      Object.freeze([
        "trustContextId",
        "trustLevel",
        "trustSource",
        "trustScope",
        "evaluatesTrust",
      ]),
      5,
    ),
    contract(
      "ConsentContext",
      "Consent Context",
      "Declarative consent context vocabulary — no consent collection runtime.",
      Object.freeze([
        "consentContextId",
        "consentSubjectRef",
        "consentScope",
        "consentStatus",
        "collectsConsent",
      ]),
      6,
    ),
    contract(
      "PermissionContext",
      "Permission Context",
      "Declarative permission vocabulary — no permission enforcement runtime.",
      Object.freeze([
        "permissionContextId",
        "permissionId",
        "permissionName",
        "permissionScope",
        "enforcesPermission",
      ]),
      7,
    ),
    contract(
      "RoleContext",
      "Role Context",
      "Declarative role vocabulary — no role assignment runtime.",
      Object.freeze([
        "roleContextId",
        "roleId",
        "roleName",
        "roleScope",
        "assignsRole",
      ]),
      8,
    ),
    contract(
      "SecurityPolicy",
      "Security Policy",
      "Declarative security policy metadata — no policy engine execution.",
      Object.freeze([
        "policyId",
        "policyName",
        "policyScope",
        "policyClassification",
        "executesPolicy",
      ]),
      9,
    ),
    contract(
      "SecurityMetadata",
      "Security Metadata",
      "Immutable security metadata declarations without runtime state.",
      Object.freeze([
        "metadataId",
        "securityIdentityId",
        "classification",
        "ownerRef",
        "metadataOnly",
      ]),
      10,
    ),
    contract(
      "SecurityOwnership",
      "Security Ownership",
      "Declarative ownership boundary vocabulary for security architecture.",
      Object.freeze([
        "ownershipId",
        "owns",
        "doesNotOwn",
        "ownsCount",
        "runtimeBehavior",
      ]),
      11,
    ),
    contract(
      "SecurityBoundary",
      "Security Boundary",
      "Declarative prohibited-surface and boundary vocabulary — no enforcement.",
      Object.freeze([
        "boundariesId",
        "consumes",
        "provides",
        "prohibitedSurfaces",
        "runtimeEnforcement",
      ]),
      12,
    ),
  ]);

/** Canonical immutable contract catalog. */
export const SecurityGatewayContractCatalog = Object.freeze({
  catalogId: "NEA-4:1/ContractCatalog",
  sourcePhase: "NEA-4:1" as const,
  contracts: SecurityGatewayContracts,
  contractCount: SecurityGatewayContracts.length,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
