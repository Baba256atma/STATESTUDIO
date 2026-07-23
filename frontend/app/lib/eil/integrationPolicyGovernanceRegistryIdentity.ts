/**
 * EIL-5:2 — Integration Policy & Governance Registry Identity.
 *
 * Canonical immutable identity for the Integration Policy & Governance Registry.
 * Declares exactly one upstream phase dependency: EIL-5:1 Integration Policy & Governance Foundation.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by EIL-5:2.
 */

import type { IntegrationPolicyGovernanceRegistryIdentity as PolicyGovernanceRegistryIdentityDescriptor } from "./integrationPolicyGovernanceRegistryTypes.ts";

/** Canonical phase ID. */
export const IntegrationPolicyGovernanceRegistryPhaseId = "EIL-5:2" as const;

/** Canonical registry ID. */
export const IntegrationPolicyGovernanceRegistryCanonicalId =
  "EIL-5:2/IntegrationPolicyGovernanceRegistry" as const;

/** Human-readable registry name. */
export const IntegrationPolicyGovernanceRegistryName =
  "Integration Policy & Governance Registry" as const;

/** Semantic version. */
export const IntegrationPolicyGovernanceRegistryVersion = "1.0.0" as const;

/** Canonical namespace. */
export const IntegrationPolicyGovernanceRegistryNamespace =
  "nexora.eil.integration-policy-governance.registry" as const;

/** Layer. */
export const IntegrationPolicyGovernanceRegistryLayer = "EIL" as const;

/** Platform. */
export const IntegrationPolicyGovernanceRegistryPlatformId = "EIL-5" as const;

/** Phase type. */
export const IntegrationPolicyGovernanceRegistryPhaseType = "Registry" as const;

/** Registry status. */
export const IntegrationPolicyGovernanceRegistryStatusValue =
  "Registry" as const;

/** Immediate next-phase readiness. */
export const IntegrationPolicyGovernanceRegistryReadinessValue =
  "ReadyForModel" as const;

/** Sole upstream Foundation dependency. */
export const IntegrationPolicyGovernanceRegistryFoundationDependency =
  "EIL-5:1/IntegrationPolicyGovernanceFoundation" as const;

/** Sole Foundation aggregate entry point. */
export const IntegrationPolicyGovernanceRegistryFoundationEntryPoint =
  "integrationPolicyGovernanceFoundation.ts" as const;

/**
 * Immutable identity object for EIL-5:2 Integration Policy & Governance Registry.
 * Dependency list contains exactly one phase dependency.
 */
export const IntegrationPolicyGovernanceRegistryIdentity: PolicyGovernanceRegistryIdentityDescriptor =
  Object.freeze({
    phaseId: IntegrationPolicyGovernanceRegistryPhaseId,
    canonicalId: IntegrationPolicyGovernanceRegistryCanonicalId,
    name: IntegrationPolicyGovernanceRegistryName,
    version: IntegrationPolicyGovernanceRegistryVersion,
    namespace: IntegrationPolicyGovernanceRegistryNamespace,
    layer: IntegrationPolicyGovernanceRegistryLayer,
    platform: IntegrationPolicyGovernanceRegistryPlatformId,
    phaseType: IntegrationPolicyGovernanceRegistryPhaseType,
    status: IntegrationPolicyGovernanceRegistryStatusValue,
    readiness: IntegrationPolicyGovernanceRegistryReadinessValue,
    foundationDependency:
      IntegrationPolicyGovernanceRegistryFoundationDependency,
    foundationEntryPoint:
      IntegrationPolicyGovernanceRegistryFoundationEntryPoint,
    description:
      "Canonical immutable registry converting Integration Policy & Governance Foundation categories, contracts, capabilities, responsibilities, and lifecycle declarations into deterministic lookup collections.",
    metadataOnly: true as const,
    immutable: true as const,
  });

/** Exactly one declared phase dependency. */
export const IntegrationPolicyGovernanceRegistryDependencies = Object.freeze([
  Object.freeze({
    phaseId: IntegrationPolicyGovernanceRegistryFoundationDependency,
    entryPoint: IntegrationPolicyGovernanceRegistryFoundationEntryPoint,
    relationship: "SoleUpstreamFoundation" as const,
    metadataOnly: true as const,
    immutable: true as const,
  }),
] as const);
