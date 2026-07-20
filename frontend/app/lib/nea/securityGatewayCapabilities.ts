/**
 * NEA-4:1 — Security Gateway Capabilities.
 *
 * Immutable capability declarations for Security Gateway Foundation.
 * Capabilities are declarative only — no runtime execution.
 *
 * Ownership: owned exclusively by NEA-4:1.
 */

import type {
  SecurityGatewayCapabilityDeclaration,
  SecurityGatewayCapabilityId,
} from "./securityGatewayFoundationTypes.ts";

const capability = (
  capabilityId: SecurityGatewayCapabilityId,
  capabilityName: string,
  description: string,
  order: number,
): SecurityGatewayCapabilityDeclaration =>
  Object.freeze({
    capabilityId,
    capabilityName,
    description,
    executesRuntime: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

/** Canonical security capability catalog — exactly ten. */
export const SecurityGatewayCapabilities: readonly SecurityGatewayCapabilityDeclaration[] =
  Object.freeze([
    capability(
      "IdentityDeclaration",
      "Identity Declaration",
      "Declarative ability to declare security identity metadata.",
      1,
    ),
    capability(
      "AuthenticationDeclaration",
      "Authentication Declaration",
      "Declarative ability to declare authentication context vocabulary.",
      2,
    ),
    capability(
      "AuthorizationDeclaration",
      "Authorization Declaration",
      "Declarative ability to declare authorization context vocabulary.",
      3,
    ),
    capability(
      "PermissionDeclaration",
      "Permission Declaration",
      "Declarative ability to declare permission context vocabulary.",
      4,
    ),
    capability(
      "RoleDeclaration",
      "Role Declaration",
      "Declarative ability to declare role context vocabulary.",
      5,
    ),
    capability(
      "TrustDeclaration",
      "Trust Declaration",
      "Declarative ability to declare trust context vocabulary.",
      6,
    ),
    capability(
      "ConsentDeclaration",
      "Consent Declaration",
      "Declarative ability to declare consent context vocabulary.",
      7,
    ),
    capability(
      "PolicyDeclaration",
      "Policy Declaration",
      "Declarative ability to declare security policy metadata.",
      8,
    ),
    capability(
      "SecurityClassification",
      "Security Classification",
      "Declarative ability to declare security classification metadata.",
      9,
    ),
    capability(
      "SecurityMetadataManagement",
      "Security Metadata Management",
      "Declarative ability to manage security metadata surfaces.",
      10,
    ),
  ]);

/** Canonical immutable capability catalog. */
export const SecurityGatewayCapabilityCatalog = Object.freeze({
  catalogId: "NEA-4:1/CapabilityCatalog",
  sourcePhase: "NEA-4:1" as const,
  capabilities: SecurityGatewayCapabilities,
  capabilityCount: SecurityGatewayCapabilities.length,
  executesRuntime: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
