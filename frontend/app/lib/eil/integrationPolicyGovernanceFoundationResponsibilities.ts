/**
 * EIL-5:1 — Integration Policy & Governance Foundation Responsibilities.
 *
 * Declared architectural responsibilities for the Integration Policy & Governance Platform.
 * Metadata only — no runtime execution.
 *
 * Ownership: owned exclusively by EIL-5:1.
 */

import type {
  IntegrationPolicyGovernanceResponsibility,
  PolicyGovernanceResponsibilityId,
} from "./integrationPolicyGovernanceFoundationTypes.ts";

const responsibility = (
  responsibilityId: PolicyGovernanceResponsibilityId,
  responsibilityName: string,
  description: string,
  order: number,
): IntegrationPolicyGovernanceResponsibility =>
  Object.freeze({
    responsibilityId,
    responsibilityName,
    description,
    ownedByEil5: true as const,
    executesRuntime: false as const,
    performsBusinessLogic: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

/**
 * Exactly eight declared Integration Policy & Governance Foundation responsibilities.
 */
export const IntegrationPolicyGovernanceFoundationResponsibilities: readonly IntegrationPolicyGovernanceResponsibility[] =
  Object.freeze([
    responsibility(
      "PreserveGovernanceIdentity",
      "Preserve governance identity",
      "Preserve canonical governance identities across EIL-5 without mutation.",
      1,
    ),
    responsibility(
      "PreserveArchitecturalBoundaries",
      "Preserve architectural boundaries",
      "Preserve Nexora architectural boundaries when declaring governance metadata.",
      2,
    ),
    responsibility(
      "PublishGovernanceMetadata",
      "Publish governance metadata",
      "Publish canonical governance categories, contracts, and terminology for downstream phases.",
      3,
    ),
    responsibility(
      "PreserveDependencyDirection",
      "Preserve dependency direction",
      "Preserve approved dependency direction without circular governance ownership.",
      4,
    ),
    responsibility(
      "PreserveCompatibility",
      "Preserve compatibility",
      "Preserve declarative compatibility rules for governance definitions.",
      5,
    ),
    responsibility(
      "PreserveDeterministicInventories",
      "Preserve deterministic inventories",
      "Preserve deterministic inventories derived from canonical governance collections.",
      6,
    ),
    responsibility(
      "SupportFutureRuntimePlatforms",
      "Support future runtime platforms",
      "Support future governance runtime platforms by freezing metadata without implementing them.",
      7,
    ),
    responsibility(
      "PreserveArchitecturalConsistency",
      "Preserve architectural consistency",
      "Preserve architectural consistency of governance metadata across the EIL-5 ladder.",
      8,
    ),
  ]);

/** Canonical immutable responsibilities catalog. */
export const IntegrationPolicyGovernanceFoundationResponsibilityCatalog =
  Object.freeze({
    catalogId: "EIL-5:1/IntegrationPolicyGovernanceFoundationResponsibilities",
    sourcePhase: "EIL-5:1" as const,
    responsibilities: IntegrationPolicyGovernanceFoundationResponsibilities,
    responsibilityCount:
      IntegrationPolicyGovernanceFoundationResponsibilities.length,
    executesRuntime: false as const,
    performsBusinessLogic: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
