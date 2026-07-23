/**
 * EIL-5:8 — Integration Policy & Governance Freeze Identity.
 *
 * Canonical immutable identity for the Integration Policy & Governance Freeze phase.
 * Declares exactly one upstream phase dependency: EIL-5:7 Integration Policy & Governance Certification.
 * Metadata-only. No runtime freeze enforcement.
 *
 * Ownership: owned exclusively by EIL-5:8.
 */

import type { IntegrationPolicyGovernanceFreezeIdentity as PolicyGovernanceFreezeIdentityDescriptor } from "./integrationPolicyGovernanceFreezeTypes.ts";

/** Canonical phase ID. */
export const IntegrationPolicyGovernanceFreezePhaseId = "EIL-5:8" as const;

/** Canonical freeze ID. */
export const IntegrationPolicyGovernanceFreezeCanonicalId =
  "EIL-5:8/IntegrationPolicyGovernanceFreeze" as const;

/** Human-readable freeze name. */
export const IntegrationPolicyGovernanceFreezeName =
  "Integration Policy & Governance Freeze" as const;

/** Semantic version. */
export const IntegrationPolicyGovernanceFreezeVersion = "1.0.0" as const;

/** Canonical namespace. */
export const IntegrationPolicyGovernanceFreezeNamespace =
  "nexora.eil.integration-policy-governance.freeze" as const;

/** Layer. */
export const IntegrationPolicyGovernanceFreezeLayer = "EIL" as const;

/** Platform. */
export const IntegrationPolicyGovernanceFreezePlatformId = "EIL-5" as const;

/** Phase type. */
export const IntegrationPolicyGovernanceFreezePhaseType = "Freeze" as const;

/** Freeze status. */
export const IntegrationPolicyGovernanceFreezeStatusValue = "Frozen" as const;

/** Immediate next-phase readiness. */
export const IntegrationPolicyGovernanceFreezeReadinessStateValue =
  "ReadyForPublicIndex" as const;

/** Sole upstream Certification dependency. */
export const IntegrationPolicyGovernanceFreezeCertificationDependency =
  "EIL-5:7/IntegrationPolicyGovernanceCertification" as const;

/** Sole Certification aggregate entry point. */
export const IntegrationPolicyGovernanceFreezeCertificationEntryPoint =
  "integrationPolicyGovernanceCertification.ts" as const;

/**
 * Immutable identity object for EIL-5:8 Integration Policy & Governance Freeze.
 * Dependency list contains exactly one phase dependency.
 */
export const IntegrationPolicyGovernanceFreezeIdentity: PolicyGovernanceFreezeIdentityDescriptor =
  Object.freeze({
    phaseId: IntegrationPolicyGovernanceFreezePhaseId,
    canonicalId: IntegrationPolicyGovernanceFreezeCanonicalId,
    name: IntegrationPolicyGovernanceFreezeName,
    version: IntegrationPolicyGovernanceFreezeVersion,
    namespace: IntegrationPolicyGovernanceFreezeNamespace,
    layer: IntegrationPolicyGovernanceFreezeLayer,
    platform: IntegrationPolicyGovernanceFreezePlatformId,
    phaseType: IntegrationPolicyGovernanceFreezePhaseType,
    status: IntegrationPolicyGovernanceFreezeStatusValue,
    readiness: IntegrationPolicyGovernanceFreezeReadinessStateValue,
    certificationDependency:
      IntegrationPolicyGovernanceFreezeCertificationDependency,
    certificationEntryPoint:
      IntegrationPolicyGovernanceFreezeCertificationEntryPoint,
    description:
      "Permanent architectural freeze establishing the immutable EIL-5 Integration Policy & Governance Platform baseline for Public Index publication.",
    metadataOnly: true as const,
    immutable: true as const,
  });

/** Exactly one declared phase dependency. */
export const IntegrationPolicyGovernanceFreezeDependencies = Object.freeze([
  Object.freeze({
    phaseId: IntegrationPolicyGovernanceFreezeCertificationDependency,
    entryPoint: IntegrationPolicyGovernanceFreezeCertificationEntryPoint,
    relationship: "SoleUpstreamCertification" as const,
    metadataOnly: true as const,
    immutable: true as const,
  }),
] as const);
