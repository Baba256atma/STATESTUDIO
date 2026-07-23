/**
 * EIL-1:7 — Integration Certification Identity.
 *
 * Canonical immutable identity for the Executive Integration Certification phase.
 * Declares exactly one upstream phase dependency: EIL-1:6 Integration Platform.
 * Metadata-only. No certification engine.
 *
 * Ownership: owned exclusively by EIL-1:7.
 */

import type { IntegrationCertificationIdentityDescriptor } from "./integrationCertificationTypes.ts";

/** Canonical phase ID. */
export const IntegrationCertificationPhaseId = "EIL-1:7" as const;

/** Canonical certification ID. */
export const IntegrationCertificationCanonicalId =
  "EIL-1:7/IntegrationCertification" as const;

/** Human-readable certification name. */
export const IntegrationCertificationName =
  "Integration Certification" as const;

/** Semantic version. */
export const IntegrationCertificationVersion = "1.0.0" as const;

/** Canonical namespace. */
export const IntegrationCertificationNamespace =
  "nexora.eil.integration.certification" as const;

/** Layer. */
export const IntegrationCertificationLayer = "EIL" as const;

/** Platform. */
export const IntegrationCertificationPlatformId = "EIL-1" as const;

/** Phase type. */
export const IntegrationCertificationPhaseType = "Certification" as const;

/** Certification status. */
export const IntegrationCertificationStatus = "Certification" as const;

/** Immediate next-phase readiness. */
export const IntegrationCertificationReadinessState =
  "ReadyForFreeze" as const;

/** Sole upstream Platform dependency. */
export const IntegrationCertificationPlatformDependency =
  "EIL-1:6/IntegrationPlatform" as const;

/** Sole Platform aggregate entry point. */
export const IntegrationCertificationPlatformEntryPoint =
  "integrationPlatform.ts" as const;

/**
 * Immutable identity object for EIL-1:7 Integration Certification.
 * Dependency list contains exactly one phase dependency.
 */
export const IntegrationCertificationIdentity: IntegrationCertificationIdentityDescriptor =
  Object.freeze({
    phaseId: IntegrationCertificationPhaseId,
    canonicalId: IntegrationCertificationCanonicalId,
    name: IntegrationCertificationName,
    version: IntegrationCertificationVersion,
    namespace: IntegrationCertificationNamespace,
    layer: IntegrationCertificationLayer,
    platform: IntegrationCertificationPlatformId,
    phaseType: IntegrationCertificationPhaseType,
    status: IntegrationCertificationStatus,
    readiness: IntegrationCertificationReadinessState,
    platformDependency: IntegrationCertificationPlatformDependency,
    platformEntryPoint: IntegrationCertificationPlatformEntryPoint,
    description:
      "Canonical certification metadata declaring that the EIL-1 Integration Platform satisfies architectural certification requirements and is eligible for Freeze.",
    metadataOnly: true as const,
    immutable: true as const,
  });

/** Exactly one declared phase dependency. */
export const IntegrationCertificationDependencies = Object.freeze([
  Object.freeze({
    phaseId: IntegrationCertificationPlatformDependency,
    entryPoint: IntegrationCertificationPlatformEntryPoint,
    relationship: "SoleUpstreamPlatform" as const,
    metadataOnly: true as const,
    immutable: true as const,
  }),
] as const);
