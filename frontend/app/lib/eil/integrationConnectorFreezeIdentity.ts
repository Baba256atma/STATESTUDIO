/**
 * EIL-2:8 — Integration Connector Freeze Identity.
 *
 * Canonical immutable identity for the Integration Connector Freeze phase.
 * Declares exactly one upstream phase dependency: EIL-2:7 Integration Connector Certification.
 * Metadata-only. No runtime freeze enforcement.
 *
 * Ownership: owned exclusively by EIL-2:8.
 */

import type { IntegrationConnectorFreezeIdentityDescriptor } from "./integrationConnectorFreezeTypes.ts";

/** Canonical phase ID. */
export const IntegrationConnectorFreezePhaseId = "EIL-2:8" as const;

/** Canonical freeze ID. */
export const IntegrationConnectorFreezeCanonicalId =
  "EIL-2:8/IntegrationConnectorFreeze" as const;

/** Human-readable freeze name. */
export const IntegrationConnectorFreezeName =
  "Integration Connector Freeze" as const;

/** Semantic version. */
export const IntegrationConnectorFreezeVersion = "1.0.0" as const;

/** Canonical namespace. */
export const IntegrationConnectorFreezeNamespace =
  "nexora.eil.integration-connector.freeze" as const;

/** Layer. */
export const IntegrationConnectorFreezeLayer = "EIL" as const;

/** Platform. */
export const IntegrationConnectorFreezePlatformId = "EIL-2" as const;

/** Phase type. */
export const IntegrationConnectorFreezePhaseType = "Freeze" as const;

/** Freeze status. */
export const IntegrationConnectorFreezeStatus = "Frozen" as const;

/** Immediate next-phase readiness. */
export const IntegrationConnectorFreezeReadinessState =
  "ReadyForPublicIndex" as const;

/** Sole upstream Certification dependency. */
export const IntegrationConnectorFreezeCertificationDependency =
  "EIL-2:7/IntegrationConnectorCertification" as const;

/** Sole Certification aggregate entry point. */
export const IntegrationConnectorFreezeCertificationEntryPoint =
  "integrationConnectorCertification.ts" as const;

/**
 * Immutable identity object for EIL-2:8 Integration Connector Freeze.
 * Dependency list contains exactly one phase dependency.
 */
export const IntegrationConnectorFreezeIdentity: IntegrationConnectorFreezeIdentityDescriptor =
  Object.freeze({
    phaseId: IntegrationConnectorFreezePhaseId,
    canonicalId: IntegrationConnectorFreezeCanonicalId,
    name: IntegrationConnectorFreezeName,
    version: IntegrationConnectorFreezeVersion,
    namespace: IntegrationConnectorFreezeNamespace,
    layer: IntegrationConnectorFreezeLayer,
    platform: IntegrationConnectorFreezePlatformId,
    phaseType: IntegrationConnectorFreezePhaseType,
    status: IntegrationConnectorFreezeStatus,
    readiness: IntegrationConnectorFreezeReadinessState,
    certificationDependency:
      IntegrationConnectorFreezeCertificationDependency,
    certificationEntryPoint:
      IntegrationConnectorFreezeCertificationEntryPoint,
    description:
      "Permanent architectural freeze establishing the immutable EIL-2 Integration Connector Platform baseline for Public Index publication.",
    metadataOnly: true as const,
    immutable: true as const,
  });

/** Exactly one declared phase dependency. */
export const IntegrationConnectorFreezeDependencies = Object.freeze([
  Object.freeze({
    phaseId: IntegrationConnectorFreezeCertificationDependency,
    entryPoint: IntegrationConnectorFreezeCertificationEntryPoint,
    relationship: "SoleUpstreamCertification" as const,
    metadataOnly: true as const,
    immutable: true as const,
  }),
] as const);
