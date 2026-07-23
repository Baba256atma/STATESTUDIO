/**
 * EIL-5:5 — Integration Policy & Governance Manifest Identity.
 *
 * Canonical immutable identity for the Integration Policy & Governance Manifest.
 * Declares exactly one upstream phase dependency: EIL-5:4 Integration Policy & Governance Validation.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by EIL-5:5.
 */

import type { IntegrationPolicyGovernanceManifestIdentity as PolicyGovernanceManifestIdentityDescriptor } from "./integrationPolicyGovernanceManifestTypes.ts";

/** Canonical phase ID. */
export const IntegrationPolicyGovernanceManifestPhaseId = "EIL-5:5" as const;

/** Canonical manifest ID. */
export const IntegrationPolicyGovernanceManifestCanonicalId =
  "EIL-5:5/IntegrationPolicyGovernanceManifest" as const;

/** Human-readable manifest name. */
export const IntegrationPolicyGovernanceManifestName =
  "Integration Policy & Governance Manifest" as const;

/** Semantic version. */
export const IntegrationPolicyGovernanceManifestVersion = "1.0.0" as const;

/** Canonical namespace. */
export const IntegrationPolicyGovernanceManifestNamespace =
  "nexora.eil.integration-policy-governance.manifest" as const;

/** Layer. */
export const IntegrationPolicyGovernanceManifestLayer = "EIL" as const;

/** Platform. */
export const IntegrationPolicyGovernanceManifestPlatformId = "EIL-5" as const;

/** Phase type. */
export const IntegrationPolicyGovernanceManifestPhaseType =
  "Manifest" as const;

/** Manifest status. */
export const IntegrationPolicyGovernanceManifestStatusValue =
  "Manifest" as const;

/** Immediate next-phase readiness. */
export const IntegrationPolicyGovernanceManifestReadinessStateValue =
  "ReadyForPlatform" as const;

/** Sole upstream Validation dependency. */
export const IntegrationPolicyGovernanceManifestValidationDependency =
  "EIL-5:4/IntegrationPolicyGovernanceValidation" as const;

/** Sole Validation aggregate entry point. */
export const IntegrationPolicyGovernanceManifestValidationEntryPoint =
  "integrationPolicyGovernanceValidation.ts" as const;

/**
 * Immutable identity object for EIL-5:5 Integration Policy & Governance Manifest.
 * Dependency list contains exactly one phase dependency.
 */
export const IntegrationPolicyGovernanceManifestIdentity: PolicyGovernanceManifestIdentityDescriptor =
  Object.freeze({
    phaseId: IntegrationPolicyGovernanceManifestPhaseId,
    canonicalId: IntegrationPolicyGovernanceManifestCanonicalId,
    name: IntegrationPolicyGovernanceManifestName,
    version: IntegrationPolicyGovernanceManifestVersion,
    namespace: IntegrationPolicyGovernanceManifestNamespace,
    layer: IntegrationPolicyGovernanceManifestLayer,
    platform: IntegrationPolicyGovernanceManifestPlatformId,
    phaseType: IntegrationPolicyGovernanceManifestPhaseType,
    status: IntegrationPolicyGovernanceManifestStatusValue,
    readiness: IntegrationPolicyGovernanceManifestReadinessStateValue,
    validationDependency:
      IntegrationPolicyGovernanceManifestValidationDependency,
    validationEntryPoint:
      IntegrationPolicyGovernanceManifestValidationEntryPoint,
    description:
      "Canonical architectural inventory and readiness declaration publishing validated Integration Policy & Governance Foundation, Registry, Model, and Validation metadata.",
    metadataOnly: true as const,
    immutable: true as const,
  });

/** Exactly one declared phase dependency. */
export const IntegrationPolicyGovernanceManifestDependencies = Object.freeze([
  Object.freeze({
    phaseId: IntegrationPolicyGovernanceManifestValidationDependency,
    entryPoint: IntegrationPolicyGovernanceManifestValidationEntryPoint,
    relationship: "SoleUpstreamValidation" as const,
    metadataOnly: true as const,
    immutable: true as const,
  }),
] as const);
