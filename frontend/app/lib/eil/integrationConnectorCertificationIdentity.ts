/**
 * EIL-2:7 — Integration Connector Certification Identity.
 *
 * Canonical immutable identity for the Integration Connector Certification phase.
 * Declares exactly one upstream phase dependency: EIL-2:6 Integration Connector Platform.
 * Metadata-only. No certification engine.
 *
 * Ownership: owned exclusively by EIL-2:7.
 */

import type { IntegrationConnectorCertificationIdentityDescriptor } from "./integrationConnectorCertificationTypes.ts";

/** Canonical phase ID. */
export const IntegrationConnectorCertificationPhaseId = "EIL-2:7" as const;

/** Canonical certification ID. */
export const IntegrationConnectorCertificationCanonicalId =
  "EIL-2:7/IntegrationConnectorCertification" as const;

/** Human-readable certification name. */
export const IntegrationConnectorCertificationName =
  "Integration Connector Certification" as const;

/** Semantic version. */
export const IntegrationConnectorCertificationVersion = "1.0.0" as const;

/** Canonical namespace. */
export const IntegrationConnectorCertificationNamespace =
  "nexora.eil.integration-connector.certification" as const;

/** Layer. */
export const IntegrationConnectorCertificationLayer = "EIL" as const;

/** Platform. */
export const IntegrationConnectorCertificationPlatformId = "EIL-2" as const;

/** Phase type. */
export const IntegrationConnectorCertificationPhaseType =
  "Certification" as const;

/** Certification status. */
export const IntegrationConnectorCertificationStatus =
  "Certification" as const;

/** Immediate next-phase readiness. */
export const IntegrationConnectorCertificationReadinessState =
  "ReadyForFreeze" as const;

/** Sole upstream Platform dependency. */
export const IntegrationConnectorCertificationPlatformDependency =
  "EIL-2:6/IntegrationConnectorPlatform" as const;

/** Sole Platform aggregate entry point. */
export const IntegrationConnectorCertificationPlatformEntryPoint =
  "integrationConnectorPlatform.ts" as const;

/**
 * Immutable identity object for EIL-2:7 Integration Connector Certification.
 * Dependency list contains exactly one phase dependency.
 */
export const IntegrationConnectorCertificationIdentity: IntegrationConnectorCertificationIdentityDescriptor =
  Object.freeze({
    phaseId: IntegrationConnectorCertificationPhaseId,
    canonicalId: IntegrationConnectorCertificationCanonicalId,
    name: IntegrationConnectorCertificationName,
    version: IntegrationConnectorCertificationVersion,
    namespace: IntegrationConnectorCertificationNamespace,
    layer: IntegrationConnectorCertificationLayer,
    platform: IntegrationConnectorCertificationPlatformId,
    phaseType: IntegrationConnectorCertificationPhaseType,
    status: IntegrationConnectorCertificationStatus,
    readiness: IntegrationConnectorCertificationReadinessState,
    platformDependency: IntegrationConnectorCertificationPlatformDependency,
    platformEntryPoint: IntegrationConnectorCertificationPlatformEntryPoint,
    description:
      "Canonical certification metadata declaring that the EIL-2 Integration Connector Platform satisfies architectural certification requirements and is eligible for Freeze.",
    metadataOnly: true as const,
    immutable: true as const,
  });

/** Exactly one declared phase dependency. */
export const IntegrationConnectorCertificationDependencies = Object.freeze([
  Object.freeze({
    phaseId: IntegrationConnectorCertificationPlatformDependency,
    entryPoint: IntegrationConnectorCertificationPlatformEntryPoint,
    relationship: "SoleUpstreamPlatform" as const,
    metadataOnly: true as const,
    immutable: true as const,
  }),
] as const);
