/**
 * EIL-3:7 — Integration Routing Certification Identity.
 *
 * Canonical immutable identity for the Integration Routing Certification phase.
 * Declares exactly one upstream phase dependency: EIL-3:6 Integration Routing Platform.
 * Metadata-only. No certification engine.
 *
 * Ownership: owned exclusively by EIL-3:7.
 */

import type { RoutingCertificationIdentity } from "./integrationRoutingCertificationTypes.ts";

/** Canonical phase ID. */
export const IntegrationRoutingCertificationPhaseId = "EIL-3:7" as const;

/** Canonical certification ID. */
export const IntegrationRoutingCertificationCanonicalId =
  "EIL-3:7/IntegrationRoutingCertification" as const;

/** Human-readable certification name. */
export const IntegrationRoutingCertificationName =
  "Integration Routing Certification" as const;

/** Semantic version. */
export const IntegrationRoutingCertificationVersion = "1.0.0" as const;

/** Canonical namespace. */
export const IntegrationRoutingCertificationNamespace =
  "nexora.eil.integration-routing.certification" as const;

/** Layer. */
export const IntegrationRoutingCertificationLayer = "EIL" as const;

/** Platform. */
export const IntegrationRoutingCertificationPlatformId = "EIL-3" as const;

/** Phase type. */
export const IntegrationRoutingCertificationPhaseType =
  "Certification" as const;

/** Certification status. */
export const IntegrationRoutingCertificationStatusValue =
  "Certification" as const;

/** Immediate next-phase readiness. */
export const IntegrationRoutingCertificationReadinessStateValue =
  "ReadyForFreeze" as const;

/** Sole upstream Platform dependency. */
export const IntegrationRoutingCertificationPlatformDependency =
  "EIL-3:6/IntegrationRoutingPlatform" as const;

/** Sole Platform aggregate entry point. */
export const IntegrationRoutingCertificationPlatformEntryPoint =
  "integrationRoutingPlatform.ts" as const;

/**
 * Immutable identity object for EIL-3:7 Integration Routing Certification.
 * Dependency list contains exactly one phase dependency.
 */
export const IntegrationRoutingCertificationIdentity: RoutingCertificationIdentity =
  Object.freeze({
    phaseId: IntegrationRoutingCertificationPhaseId,
    canonicalId: IntegrationRoutingCertificationCanonicalId,
    name: IntegrationRoutingCertificationName,
    version: IntegrationRoutingCertificationVersion,
    namespace: IntegrationRoutingCertificationNamespace,
    layer: IntegrationRoutingCertificationLayer,
    platform: IntegrationRoutingCertificationPlatformId,
    phaseType: IntegrationRoutingCertificationPhaseType,
    status: IntegrationRoutingCertificationStatusValue,
    readiness: IntegrationRoutingCertificationReadinessStateValue,
    platformDependency: IntegrationRoutingCertificationPlatformDependency,
    platformEntryPoint: IntegrationRoutingCertificationPlatformEntryPoint,
    description:
      "Canonical certification metadata declaring that the EIL-3 Integration Routing Platform satisfies architectural certification requirements and is eligible for Freeze.",
    metadataOnly: true as const,
    immutable: true as const,
  });

/** Exactly one declared phase dependency. */
export const IntegrationRoutingCertificationDependencies = Object.freeze([
  Object.freeze({
    phaseId: IntegrationRoutingCertificationPlatformDependency,
    entryPoint: IntegrationRoutingCertificationPlatformEntryPoint,
    relationship: "SoleUpstreamPlatform" as const,
    metadataOnly: true as const,
    immutable: true as const,
  }),
] as const);
