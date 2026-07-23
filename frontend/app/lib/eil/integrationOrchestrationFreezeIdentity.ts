/**
 * EIL-4:8 — Integration Orchestration Freeze Identity.
 *
 * Canonical immutable identity for the Integration Orchestration Freeze phase.
 * Declares exactly one upstream phase dependency: EIL-4:7 Integration Orchestration Certification.
 * Metadata-only. No runtime freeze enforcement.
 *
 * Ownership: owned exclusively by EIL-4:8.
 */

import type { IntegrationOrchestrationFreezeIdentity as OrchestrationFreezeIdentityDescriptor } from "./integrationOrchestrationFreezeTypes.ts";

/** Canonical phase ID. */
export const IntegrationOrchestrationFreezePhaseId = "EIL-4:8" as const;

/** Canonical freeze ID. */
export const IntegrationOrchestrationFreezeCanonicalId =
  "EIL-4:8/IntegrationOrchestrationFreeze" as const;

/** Human-readable freeze name. */
export const IntegrationOrchestrationFreezeName =
  "Integration Orchestration Freeze" as const;

/** Semantic version. */
export const IntegrationOrchestrationFreezeVersion = "1.0.0" as const;

/** Canonical namespace. */
export const IntegrationOrchestrationFreezeNamespace =
  "nexora.eil.integration-orchestration.freeze" as const;

/** Layer. */
export const IntegrationOrchestrationFreezeLayer = "EIL" as const;

/** Platform. */
export const IntegrationOrchestrationFreezePlatformId = "EIL-4" as const;

/** Phase type. */
export const IntegrationOrchestrationFreezePhaseType = "Freeze" as const;

/** Freeze status. */
export const IntegrationOrchestrationFreezeStatusValue = "Frozen" as const;

/** Immediate next-phase readiness. */
export const IntegrationOrchestrationFreezeReadinessStateValue =
  "ReadyForPublicIndex" as const;

/** Sole upstream Certification dependency. */
export const IntegrationOrchestrationFreezeCertificationDependency =
  "EIL-4:7/IntegrationOrchestrationCertification" as const;

/** Sole Certification aggregate entry point. */
export const IntegrationOrchestrationFreezeCertificationEntryPoint =
  "integrationOrchestrationCertification.ts" as const;

/**
 * Immutable identity object for EIL-4:8 Integration Orchestration Freeze.
 * Dependency list contains exactly one phase dependency.
 */
export const IntegrationOrchestrationFreezeIdentity: OrchestrationFreezeIdentityDescriptor =
  Object.freeze({
    phaseId: IntegrationOrchestrationFreezePhaseId,
    canonicalId: IntegrationOrchestrationFreezeCanonicalId,
    name: IntegrationOrchestrationFreezeName,
    version: IntegrationOrchestrationFreezeVersion,
    namespace: IntegrationOrchestrationFreezeNamespace,
    layer: IntegrationOrchestrationFreezeLayer,
    platform: IntegrationOrchestrationFreezePlatformId,
    phaseType: IntegrationOrchestrationFreezePhaseType,
    status: IntegrationOrchestrationFreezeStatusValue,
    readiness: IntegrationOrchestrationFreezeReadinessStateValue,
    certificationDependency:
      IntegrationOrchestrationFreezeCertificationDependency,
    certificationEntryPoint:
      IntegrationOrchestrationFreezeCertificationEntryPoint,
    description:
      "Permanent architectural freeze establishing the immutable EIL-4 Integration Orchestration Platform baseline for Public Index publication.",
    metadataOnly: true as const,
    immutable: true as const,
  });

/** Exactly one declared phase dependency. */
export const IntegrationOrchestrationFreezeDependencies = Object.freeze([
  Object.freeze({
    phaseId: IntegrationOrchestrationFreezeCertificationDependency,
    entryPoint: IntegrationOrchestrationFreezeCertificationEntryPoint,
    relationship: "SoleUpstreamCertification" as const,
    metadataOnly: true as const,
    immutable: true as const,
  }),
] as const);
