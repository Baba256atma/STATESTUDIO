/**
 * EIL-1:8 — Integration Freeze Identity.
 *
 * Canonical immutable identity for the Executive Integration Freeze phase.
 * Declares exactly one upstream phase dependency: EIL-1:7 Integration Certification.
 * Metadata-only. No runtime freeze enforcement.
 *
 * Ownership: owned exclusively by EIL-1:8.
 */

import type { IntegrationFreezeIdentityDescriptor } from "./integrationFreezeTypes.ts";

/** Canonical phase ID. */
export const IntegrationFreezePhaseId = "EIL-1:8" as const;

/** Canonical freeze ID. */
export const IntegrationFreezeCanonicalId =
  "EIL-1:8/IntegrationFreeze" as const;

/** Human-readable freeze name. */
export const IntegrationFreezeName = "Integration Freeze" as const;

/** Semantic version. */
export const IntegrationFreezeVersion = "1.0.0" as const;

/** Canonical namespace. */
export const IntegrationFreezeNamespace =
  "nexora.eil.integration.freeze" as const;

/** Layer. */
export const IntegrationFreezeLayer = "EIL" as const;

/** Platform. */
export const IntegrationFreezePlatformId = "EIL-1" as const;

/** Phase type. */
export const IntegrationFreezePhaseType = "Freeze" as const;

/** Freeze status. */
export const IntegrationFreezeStatus = "Frozen" as const;

/** Immediate next-phase readiness. */
export const IntegrationFreezeReadinessState =
  "ReadyForPublicIndex" as const;

/** Sole upstream Certification dependency. */
export const IntegrationFreezeCertificationDependency =
  "EIL-1:7/IntegrationCertification" as const;

/** Sole Certification aggregate entry point. */
export const IntegrationFreezeCertificationEntryPoint =
  "integrationCertification.ts" as const;

/**
 * Immutable identity object for EIL-1:8 Integration Freeze.
 * Dependency list contains exactly one phase dependency.
 */
export const IntegrationFreezeIdentity: IntegrationFreezeIdentityDescriptor =
  Object.freeze({
    phaseId: IntegrationFreezePhaseId,
    canonicalId: IntegrationFreezeCanonicalId,
    name: IntegrationFreezeName,
    version: IntegrationFreezeVersion,
    namespace: IntegrationFreezeNamespace,
    layer: IntegrationFreezeLayer,
    platform: IntegrationFreezePlatformId,
    phaseType: IntegrationFreezePhaseType,
    status: IntegrationFreezeStatus,
    readiness: IntegrationFreezeReadinessState,
    certificationDependency: IntegrationFreezeCertificationDependency,
    certificationEntryPoint: IntegrationFreezeCertificationEntryPoint,
    description:
      "Permanent architectural freeze establishing the immutable EIL-1 Integration Platform baseline for Public Index publication.",
    metadataOnly: true as const,
    immutable: true as const,
  });

/** Exactly one declared phase dependency. */
export const IntegrationFreezeDependencies = Object.freeze([
  Object.freeze({
    phaseId: IntegrationFreezeCertificationDependency,
    entryPoint: IntegrationFreezeCertificationEntryPoint,
    relationship: "SoleUpstreamCertification" as const,
    metadataOnly: true as const,
    immutable: true as const,
  }),
] as const);
