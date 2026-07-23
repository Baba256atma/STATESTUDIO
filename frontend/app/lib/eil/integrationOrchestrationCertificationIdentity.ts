/**
 * EIL-4:7 — Integration Orchestration Certification Identity.
 *
 * Canonical immutable identity for the Integration Orchestration Certification phase.
 * Declares exactly one upstream phase dependency: EIL-4:6 Integration Orchestration Platform.
 * Metadata-only. No certification engine.
 *
 * Ownership: owned exclusively by EIL-4:7.
 */

import type { IntegrationOrchestrationCertificationIdentity as OrchestrationCertificationIdentityDescriptor } from "./integrationOrchestrationCertificationTypes.ts";

/** Canonical phase ID. */
export const IntegrationOrchestrationCertificationPhaseId = "EIL-4:7" as const;

/** Canonical certification ID. */
export const IntegrationOrchestrationCertificationCanonicalId =
  "EIL-4:7/IntegrationOrchestrationCertification" as const;

/** Human-readable certification name. */
export const IntegrationOrchestrationCertificationName =
  "Integration Orchestration Certification" as const;

/** Semantic version. */
export const IntegrationOrchestrationCertificationVersion = "1.0.0" as const;

/** Canonical namespace. */
export const IntegrationOrchestrationCertificationNamespace =
  "nexora.eil.integration-orchestration.certification" as const;

/** Layer. */
export const IntegrationOrchestrationCertificationLayer = "EIL" as const;

/** Platform. */
export const IntegrationOrchestrationCertificationPlatformId = "EIL-4" as const;

/** Phase type. */
export const IntegrationOrchestrationCertificationPhaseType =
  "Certification" as const;

/** Certification status. */
export const IntegrationOrchestrationCertificationStatusValue =
  "Certification" as const;

/** Immediate next-phase readiness. */
export const IntegrationOrchestrationCertificationReadinessStateValue =
  "ReadyForFreeze" as const;

/** Sole upstream Platform dependency. */
export const IntegrationOrchestrationCertificationPlatformDependency =
  "EIL-4:6/IntegrationOrchestrationPlatform" as const;

/** Sole Platform aggregate entry point. */
export const IntegrationOrchestrationCertificationPlatformEntryPoint =
  "integrationOrchestrationPlatform.ts" as const;

/**
 * Immutable identity object for EIL-4:7 Integration Orchestration Certification.
 * Dependency list contains exactly one phase dependency.
 */
export const IntegrationOrchestrationCertificationIdentity: OrchestrationCertificationIdentityDescriptor =
  Object.freeze({
    phaseId: IntegrationOrchestrationCertificationPhaseId,
    canonicalId: IntegrationOrchestrationCertificationCanonicalId,
    name: IntegrationOrchestrationCertificationName,
    version: IntegrationOrchestrationCertificationVersion,
    namespace: IntegrationOrchestrationCertificationNamespace,
    layer: IntegrationOrchestrationCertificationLayer,
    platform: IntegrationOrchestrationCertificationPlatformId,
    phaseType: IntegrationOrchestrationCertificationPhaseType,
    status: IntegrationOrchestrationCertificationStatusValue,
    readiness: IntegrationOrchestrationCertificationReadinessStateValue,
    platformDependency: IntegrationOrchestrationCertificationPlatformDependency,
    platformEntryPoint:
      IntegrationOrchestrationCertificationPlatformEntryPoint,
    description:
      "Canonical certification metadata declaring that the EIL-4 Integration Orchestration Platform satisfies architectural certification requirements and is eligible for Freeze.",
    metadataOnly: true as const,
    immutable: true as const,
  });

/** Exactly one declared phase dependency. */
export const IntegrationOrchestrationCertificationDependencies = Object.freeze([
  Object.freeze({
    phaseId: IntegrationOrchestrationCertificationPlatformDependency,
    entryPoint: IntegrationOrchestrationCertificationPlatformEntryPoint,
    relationship: "SoleUpstreamPlatform" as const,
    metadataOnly: true as const,
    immutable: true as const,
  }),
] as const);
