/**
 * EIL-3:8 — Integration Routing Freeze Identity.
 *
 * Canonical immutable identity for the Integration Routing Freeze phase.
 * Declares exactly one upstream phase dependency: EIL-3:7 Integration Routing Certification.
 * Metadata-only. No runtime freeze enforcement.
 *
 * Ownership: owned exclusively by EIL-3:8.
 */

import type { RoutingFreezeIdentity } from "./integrationRoutingFreezeTypes.ts";

/** Canonical phase ID. */
export const IntegrationRoutingFreezePhaseId = "EIL-3:8" as const;

/** Canonical freeze ID. */
export const IntegrationRoutingFreezeCanonicalId =
  "EIL-3:8/IntegrationRoutingFreeze" as const;

/** Human-readable freeze name. */
export const IntegrationRoutingFreezeName =
  "Integration Routing Freeze" as const;

/** Semantic version. */
export const IntegrationRoutingFreezeVersion = "1.0.0" as const;

/** Canonical namespace. */
export const IntegrationRoutingFreezeNamespace =
  "nexora.eil.integration-routing.freeze" as const;

/** Layer. */
export const IntegrationRoutingFreezeLayer = "EIL" as const;

/** Platform. */
export const IntegrationRoutingFreezePlatformId = "EIL-3" as const;

/** Phase type. */
export const IntegrationRoutingFreezePhaseType = "Freeze" as const;

/** Freeze status. */
export const IntegrationRoutingFreezeStatusValue = "Frozen" as const;

/** Immediate next-phase readiness. */
export const IntegrationRoutingFreezeReadinessStateValue =
  "ReadyForPublicIndex" as const;

/** Sole upstream Certification dependency. */
export const IntegrationRoutingFreezeCertificationDependency =
  "EIL-3:7/IntegrationRoutingCertification" as const;

/** Sole Certification aggregate entry point. */
export const IntegrationRoutingFreezeCertificationEntryPoint =
  "integrationRoutingCertification.ts" as const;

/**
 * Immutable identity object for EIL-3:8 Integration Routing Freeze.
 * Dependency list contains exactly one phase dependency.
 */
export const IntegrationRoutingFreezeIdentity: RoutingFreezeIdentity =
  Object.freeze({
    phaseId: IntegrationRoutingFreezePhaseId,
    canonicalId: IntegrationRoutingFreezeCanonicalId,
    name: IntegrationRoutingFreezeName,
    version: IntegrationRoutingFreezeVersion,
    namespace: IntegrationRoutingFreezeNamespace,
    layer: IntegrationRoutingFreezeLayer,
    platform: IntegrationRoutingFreezePlatformId,
    phaseType: IntegrationRoutingFreezePhaseType,
    status: IntegrationRoutingFreezeStatusValue,
    readiness: IntegrationRoutingFreezeReadinessStateValue,
    certificationDependency: IntegrationRoutingFreezeCertificationDependency,
    certificationEntryPoint: IntegrationRoutingFreezeCertificationEntryPoint,
    description:
      "Permanent architectural freeze establishing the immutable EIL-3 Integration Routing Platform baseline for Public Index publication.",
    metadataOnly: true as const,
    immutable: true as const,
  });

/** Exactly one declared phase dependency. */
export const IntegrationRoutingFreezeDependencies = Object.freeze([
  Object.freeze({
    phaseId: IntegrationRoutingFreezeCertificationDependency,
    entryPoint: IntegrationRoutingFreezeCertificationEntryPoint,
    relationship: "SoleUpstreamCertification" as const,
    metadataOnly: true as const,
    immutable: true as const,
  }),
] as const);
