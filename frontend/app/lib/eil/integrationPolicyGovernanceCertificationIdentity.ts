/**
 * EIL-5:7 — Integration Policy & Governance Certification Identity.
 *
 * Canonical immutable identity for the Integration Policy & Governance Certification phase.
 * Declares exactly one upstream phase dependency: EIL-5:6 Integration Policy & Governance Platform.
 * Metadata-only. No certification engine.
 *
 * Ownership: owned exclusively by EIL-5:7.
 */

import type { IntegrationPolicyGovernanceCertificationIdentity as PolicyGovernanceCertificationIdentityDescriptor } from "./integrationPolicyGovernanceCertificationTypes.ts";

/** Canonical phase ID. */
export const IntegrationPolicyGovernanceCertificationPhaseId =
  "EIL-5:7" as const;

/** Canonical certification ID. */
export const IntegrationPolicyGovernanceCertificationCanonicalId =
  "EIL-5:7/IntegrationPolicyGovernanceCertification" as const;

/** Human-readable certification name. */
export const IntegrationPolicyGovernanceCertificationName =
  "Integration Policy & Governance Certification" as const;

/** Semantic version. */
export const IntegrationPolicyGovernanceCertificationVersion =
  "1.0.0" as const;

/** Canonical namespace. */
export const IntegrationPolicyGovernanceCertificationNamespace =
  "nexora.eil.integration-policy-governance.certification" as const;

/** Layer. */
export const IntegrationPolicyGovernanceCertificationLayer = "EIL" as const;

/** Platform. */
export const IntegrationPolicyGovernanceCertificationPlatformId =
  "EIL-5" as const;

/** Phase type. */
export const IntegrationPolicyGovernanceCertificationPhaseType =
  "Certification" as const;

/** Certification status. */
export const IntegrationPolicyGovernanceCertificationStatusValue =
  "Certification" as const;

/** Immediate next-phase readiness. */
export const IntegrationPolicyGovernanceCertificationReadinessStateValue =
  "ReadyForFreeze" as const;

/** Sole upstream Platform dependency. */
export const IntegrationPolicyGovernanceCertificationPlatformDependency =
  "EIL-5:6/IntegrationPolicyGovernancePlatform" as const;

/** Sole Platform aggregate entry point. */
export const IntegrationPolicyGovernanceCertificationPlatformEntryPoint =
  "integrationPolicyGovernancePlatform.ts" as const;

/**
 * Immutable identity object for EIL-5:7 Integration Policy & Governance Certification.
 * Dependency list contains exactly one phase dependency.
 */
export const IntegrationPolicyGovernanceCertificationIdentity: PolicyGovernanceCertificationIdentityDescriptor =
  Object.freeze({
    phaseId: IntegrationPolicyGovernanceCertificationPhaseId,
    canonicalId: IntegrationPolicyGovernanceCertificationCanonicalId,
    name: IntegrationPolicyGovernanceCertificationName,
    version: IntegrationPolicyGovernanceCertificationVersion,
    namespace: IntegrationPolicyGovernanceCertificationNamespace,
    layer: IntegrationPolicyGovernanceCertificationLayer,
    platform: IntegrationPolicyGovernanceCertificationPlatformId,
    phaseType: IntegrationPolicyGovernanceCertificationPhaseType,
    status: IntegrationPolicyGovernanceCertificationStatusValue,
    readiness: IntegrationPolicyGovernanceCertificationReadinessStateValue,
    platformDependency:
      IntegrationPolicyGovernanceCertificationPlatformDependency,
    platformEntryPoint:
      IntegrationPolicyGovernanceCertificationPlatformEntryPoint,
    description:
      "Canonical certification metadata declaring that the EIL-5 Integration Policy & Governance Platform satisfies architectural certification requirements and is eligible for Freeze.",
    metadataOnly: true as const,
    immutable: true as const,
  });

/** Exactly one declared phase dependency. */
export const IntegrationPolicyGovernanceCertificationDependencies =
  Object.freeze([
    Object.freeze({
      phaseId: IntegrationPolicyGovernanceCertificationPlatformDependency,
      entryPoint: IntegrationPolicyGovernanceCertificationPlatformEntryPoint,
      relationship: "SoleUpstreamPlatform" as const,
      metadataOnly: true as const,
      immutable: true as const,
    }),
  ] as const);
