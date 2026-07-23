/**
 * EIL-5:1 — Integration Policy & Governance Foundation Capabilities.
 *
 * Descriptive capability declarations for the Integration Policy & Governance Foundation.
 * No runtime execution.
 *
 * Ownership: owned exclusively by EIL-5:1.
 */

import type {
  IntegrationPolicyGovernanceCapability,
  PolicyGovernanceCapabilityId,
} from "./integrationPolicyGovernanceFoundationTypes.ts";

const capability = (
  capabilityKey: PolicyGovernanceCapabilityId,
  capabilityName: string,
  description: string,
  order: number,
): IntegrationPolicyGovernanceCapability =>
  Object.freeze({
    capabilityId: `EIL-5:1/Capability/${capabilityKey}` as const,
    capabilityKey,
    capabilityName,
    description,
    ownedByEil5: true as const,
    executesRuntime: false as const,
    performsGovernance: false as const,
    performsNetworking: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

/**
 * Exactly ten descriptive Integration Policy & Governance Foundation capabilities.
 * Canonical collection for derived inventory counts.
 */
export const IntegrationPolicyGovernanceFoundationCapabilities: readonly IntegrationPolicyGovernanceCapability[] =
  Object.freeze([
    capability(
      "PolicyDescription",
      "Policy description",
      "Declare policy description metadata without policy execution.",
      1,
    ),
    capability(
      "GovernanceClassification",
      "Governance classification",
      "Declare governance classification metadata without classification engines.",
      2,
    ),
    capability(
      "ComplianceDeclaration",
      "Compliance declaration",
      "Declare compliance declaration metadata without compliance execution.",
      3,
    ),
    capability(
      "DependencyDeclaration",
      "Dependency declaration",
      "Declare governance dependency-direction metadata without resolution engines.",
      4,
    ),
    capability(
      "CompatibilityDeclaration",
      "Compatibility declaration",
      "Declare governance compatibility metadata without validation engines.",
      5,
    ),
    capability(
      "LifecycleDescription",
      "Lifecycle description",
      "Declare policy lifecycle description metadata without state machines.",
      6,
    ),
    capability(
      "MetadataPublication",
      "Metadata publication",
      "Declare governance metadata publication surfaces without persistence engines.",
      7,
    ),
    capability(
      "InventorySupport",
      "Inventory support",
      "Declare governance inventory support metadata derived from canonical collections.",
      8,
    ),
    capability(
      "GovernanceReadiness",
      "Governance readiness",
      "Declare governance readiness metadata for future registry phases.",
      9,
    ),
    capability(
      "ArchitecturalConsistency",
      "Architectural consistency",
      "Declare architectural consistency metadata across the EIL-5 ladder.",
      10,
    ),
  ]);

/** Canonical immutable capabilities catalog. */
export const IntegrationPolicyGovernanceFoundationCapabilityCatalog =
  Object.freeze({
    catalogId: "EIL-5:1/IntegrationPolicyGovernanceFoundationCapabilities",
    sourcePhase: "EIL-5:1" as const,
    capabilities: IntegrationPolicyGovernanceFoundationCapabilities,
    capabilityCount:
      IntegrationPolicyGovernanceFoundationCapabilities.length,
    executesRuntime: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
