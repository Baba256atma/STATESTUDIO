/**
 * EIL-5:6 — Integration Policy & Governance Platform Identity.
 *
 * Canonical immutable identity for the Integration Policy & Governance Platform.
 * Declares exactly one upstream phase dependency: EIL-5:5 Integration Policy & Governance Manifest.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by EIL-5:6.
 */

import type { IntegrationPolicyGovernancePlatformIdentity as PolicyGovernancePlatformIdentityDescriptor } from "./integrationPolicyGovernancePlatformTypes.ts";

/** Canonical phase ID. */
export const IntegrationPolicyGovernancePlatformPhaseId = "EIL-5:6" as const;

/** Canonical platform ID. */
export const IntegrationPolicyGovernancePlatformCanonicalId =
  "EIL-5:6/IntegrationPolicyGovernancePlatform" as const;

/** Human-readable platform name. */
export const IntegrationPolicyGovernancePlatformName =
  "Integration Policy & Governance Platform" as const;

/** Semantic version. */
export const IntegrationPolicyGovernancePlatformVersion = "1.0.0" as const;

/** Canonical namespace. */
export const IntegrationPolicyGovernancePlatformNamespace =
  "nexora.eil.integration-policy-governance.platform" as const;

/** Layer. */
export const IntegrationPolicyGovernancePlatformLayer = "EIL" as const;

/** Platform. */
export const IntegrationPolicyGovernancePlatformPlatformId = "EIL-5" as const;

/** Phase type. */
export const IntegrationPolicyGovernancePlatformPhaseType =
  "Platform" as const;

/** Platform status. */
export const IntegrationPolicyGovernancePlatformStatusValue =
  "Platform" as const;

/** Immediate next-phase readiness. */
export const IntegrationPolicyGovernancePlatformReadinessStateValue =
  "ReadyForCertification" as const;

/** Sole upstream Manifest dependency. */
export const IntegrationPolicyGovernancePlatformManifestDependency =
  "EIL-5:5/IntegrationPolicyGovernanceManifest" as const;

/** Sole Manifest aggregate entry point. */
export const IntegrationPolicyGovernancePlatformManifestEntryPoint =
  "integrationPolicyGovernanceManifest.ts" as const;

/**
 * Immutable identity object for EIL-5:6 Integration Policy & Governance Platform.
 * Dependency list contains exactly one phase dependency.
 */
export const IntegrationPolicyGovernancePlatformIdentity: PolicyGovernancePlatformIdentityDescriptor =
  Object.freeze({
    phaseId: IntegrationPolicyGovernancePlatformPhaseId,
    canonicalId: IntegrationPolicyGovernancePlatformCanonicalId,
    name: IntegrationPolicyGovernancePlatformName,
    version: IntegrationPolicyGovernancePlatformVersion,
    namespace: IntegrationPolicyGovernancePlatformNamespace,
    layer: IntegrationPolicyGovernancePlatformLayer,
    platform: IntegrationPolicyGovernancePlatformPlatformId,
    phaseType: IntegrationPolicyGovernancePlatformPhaseType,
    status: IntegrationPolicyGovernancePlatformStatusValue,
    readiness: IntegrationPolicyGovernancePlatformReadinessStateValue,
    manifestDependency:
      IntegrationPolicyGovernancePlatformManifestDependency,
    manifestEntryPoint:
      IntegrationPolicyGovernancePlatformManifestEntryPoint,
    description:
      "Authoritative architectural composition surface for EIL-5, publishing canonical platform identity, inventory, guarantees, and compatibility exclusively from the validated Manifest.",
    metadataOnly: true as const,
    immutable: true as const,
  });

/** Exactly one declared phase dependency. */
export const IntegrationPolicyGovernancePlatformDependencies = Object.freeze([
  Object.freeze({
    phaseId: IntegrationPolicyGovernancePlatformManifestDependency,
    entryPoint: IntegrationPolicyGovernancePlatformManifestEntryPoint,
    relationship: "SoleUpstreamManifest" as const,
    metadataOnly: true as const,
    immutable: true as const,
  }),
] as const);
