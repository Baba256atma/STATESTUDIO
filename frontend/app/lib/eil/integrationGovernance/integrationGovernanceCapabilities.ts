/**
 * EIL-7:1 — Integration Governance Foundation Capabilities.
 *
 * Descriptive capability declarations for the Integration Governance Foundation.
 * No runtime execution. No governance, policy, or compliance engines.
 *
 * Ownership: owned exclusively by EIL-7:1.
 */

/** Closed capability-key vocabulary. */
export type GovernanceCapabilityKey =
  | "PolicyDefinition"
  | "ComplianceDefinition"
  | "GovernanceDefinition"
  | "VersionDefinition"
  | "CompatibilityDefinition"
  | "ApprovalDefinition"
  | "AuditDefinition"
  | "RiskDefinition"
  | "StandardDefinition"
  | "GovernanceReporting";

/** Immutable governance capability descriptor. */
export interface IntegrationGovernanceCapability {
  readonly capabilityId: `EIL-7:1/Capability/${GovernanceCapabilityKey}`;
  readonly capabilityKey: GovernanceCapabilityKey;
  readonly capabilityName: string;
  readonly description: string;
  readonly ownedByEil7: true;
  readonly executesRuntime: false;
  readonly performsGovernance: false;
  readonly performsPolicyExecution: false;
  readonly performsComplianceEvaluation: false;
  readonly performsNetworking: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

const capability = (
  capabilityKey: GovernanceCapabilityKey,
  capabilityName: string,
  description: string,
  order: number,
): IntegrationGovernanceCapability =>
  Object.freeze({
    capabilityId: `EIL-7:1/Capability/${capabilityKey}` as const,
    capabilityKey,
    capabilityName,
    description,
    ownedByEil7: true as const,
    executesRuntime: false as const,
    performsGovernance: false as const,
    performsPolicyExecution: false as const,
    performsComplianceEvaluation: false as const,
    performsNetworking: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

/**
 * Exactly ten descriptive Integration Governance Foundation capabilities.
 */
export const IntegrationGovernanceFoundationCapabilities: readonly IntegrationGovernanceCapability[] =
  Object.freeze([
    capability(
      "PolicyDefinition",
      "Policy Definition",
      "Declare policy definition metadata without policy engine execution.",
      1,
    ),
    capability(
      "ComplianceDefinition",
      "Compliance Definition",
      "Declare compliance definition metadata without compliance evaluation.",
      2,
    ),
    capability(
      "GovernanceDefinition",
      "Governance Definition",
      "Declare governance definition metadata without governance runtime.",
      3,
    ),
    capability(
      "VersionDefinition",
      "Version Definition",
      "Declare version definition metadata without version managers.",
      4,
    ),
    capability(
      "CompatibilityDefinition",
      "Compatibility Definition",
      "Declare compatibility definition metadata without compatibility resolvers.",
      5,
    ),
    capability(
      "ApprovalDefinition",
      "Approval Definition",
      "Declare approval definition metadata without approval workflows.",
      6,
    ),
    capability(
      "AuditDefinition",
      "Audit Definition",
      "Declare audit definition metadata without audit execution.",
      7,
    ),
    capability(
      "RiskDefinition",
      "Risk Definition",
      "Declare risk definition metadata without risk engines.",
      8,
    ),
    capability(
      "StandardDefinition",
      "Standard Definition",
      "Declare integration standard definition metadata without enforcement.",
      9,
    ),
    capability(
      "GovernanceReporting",
      "Governance Reporting",
      "Declare governance reporting metadata without reporting runtimes.",
      10,
    ),
  ]);

/**
 * Capability catalog envelope for Foundation aggregate composition.
 */
export const IntegrationGovernanceFoundationCapabilityCatalog = Object.freeze({
  catalogId: "EIL-7:1/CapabilityCatalog" as const,
  capabilities: IntegrationGovernanceFoundationCapabilities,
  capabilityCount: IntegrationGovernanceFoundationCapabilities.length,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
