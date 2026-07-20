/**
 * NEA-4:2 — Security Gateway Registry Policies.
 *
 * Immutable security registry architectural policies.
 * Declarations only. No policy execution.
 *
 * Ownership: owned exclusively by NEA-4:2.
 */

import type { SecurityGatewayRegistryEntry } from "./securityGatewayRegistryTypes.ts";

const policy = (
  id: string,
  label: string,
  description: string,
  order: number,
): SecurityGatewayRegistryEntry =>
  Object.freeze({
    id: `NEA-4:2/Policy/${id}`,
    label,
    description,
    sourcePhase: "NEA-4:2" as const,
    foundationReference: null,
    executesRuntime: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

/** Canonical security registry architectural policy registry. */
export const SecurityGatewayRegistryPolicyRegistry: readonly SecurityGatewayRegistryEntry[] =
  Object.freeze([
    policy(
      "DeclarationOnly",
      "Declaration Only",
      "Registry entries are declarative metadata and must not execute authentication or authorization.",
      1,
    ),
    policy(
      "FoundationReferencePreservation",
      "Foundation Reference Preservation",
      "Contracts, capabilities, and lifecycle must preserve Foundation references.",
      2,
    ),
    policy(
      "NoRuntimeAuthentication",
      "No Runtime Authentication",
      "Registry must not implement login, logout, OAuth, JWT, or MFA execution.",
      3,
    ),
    policy(
      "NoRuntimeAuthorization",
      "No Runtime Authorization",
      "Registry must not enforce permissions, roles, or authorization decisions.",
      4,
    ),
    policy(
      "NoEncryptionOrSecrets",
      "No Encryption Or Secrets",
      "Registry must not implement encryption, secret management, or token generation.",
      5,
    ),
    policy(
      "UniqueSecurityIdentities",
      "Unique Security Identities",
      "Each security identity id must be unique and deterministic.",
      6,
    ),
    policy(
      "UniquePermissions",
      "Unique Permissions",
      "Each permission id must be unique and deterministic.",
      7,
    ),
    policy(
      "CanonicalInventoryRule",
      "Canonical Inventory Rule",
      "Registry counts must be derived from canonical collections without hardcoding.",
      8,
    ),
    policy(
      "ReadyForModelOnly",
      "Ready For Model Only",
      "Registry readiness is ReadyForModel and must not claim runtime readiness.",
      9,
    ),
  ]);

/** Canonical immutable policy registry catalog. */
export const SecurityGatewayRegistryPolicyCatalog = Object.freeze({
  catalogId: "NEA-4:2/PolicyRegistry",
  sourcePhase: "NEA-4:2" as const,
  policies: SecurityGatewayRegistryPolicyRegistry,
  policyCount: SecurityGatewayRegistryPolicyRegistry.length,
  executesPolicies: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
