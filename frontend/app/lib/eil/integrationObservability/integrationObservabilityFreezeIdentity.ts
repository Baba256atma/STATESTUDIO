/**
 * EIL-6:8 — Integration Observability Freeze Identity.
 *
 * Canonical immutable identity for Integration Observability Freeze.
 * Declares exclusive upstream dependency on EIL-6:7 Certification.
 * Metadata-only. No runtime freeze enforcement.
 *
 * Ownership: owned exclusively by EIL-6:8.
 */

import { IntegrationObservabilityCertificationCanonicalId } from "./integrationObservabilityCertification.ts";

/** Canonical phase ID. */
export const IntegrationObservabilityFreezePhaseId = "EIL-6:8" as const;

/** Canonical freeze ID. */
export const IntegrationObservabilityFreezeCanonicalId =
  "EIL-6:8/IntegrationObservabilityFreeze" as const;

/** Human-readable freeze name. */
export const IntegrationObservabilityFreezeName =
  "Integration Observability Freeze" as const;

/** Semantic version. */
export const IntegrationObservabilityFreezeVersion = "1.0.0" as const;

/** Canonical namespace. */
export const IntegrationObservabilityFreezeNamespace =
  "nexora.eil.integration-observability.freeze" as const;

/** Freeze status. */
export const IntegrationObservabilityFreezeStatusValue = "Frozen" as const;

/** Immediate next-phase readiness. */
export const IntegrationObservabilityFreezeReadinessValue =
  "ReadyForPublicIndex" as const;

/** Canonical platform lock identifier. */
export const IntegrationObservabilityFreezeLockId =
  "EIL-6-INTEGRATION-OBSERVABILITY-LOCKED" as const;

/**
 * Immutable identity for EIL-6:8 Integration Observability Freeze.
 */
export const IntegrationObservabilityFreezeIdentity = Object.freeze({
  phaseId: IntegrationObservabilityFreezePhaseId,
  canonicalId: IntegrationObservabilityFreezeCanonicalId,
  name: IntegrationObservabilityFreezeName,
  version: IntegrationObservabilityFreezeVersion,
  namespace: IntegrationObservabilityFreezeNamespace,
  layer: "EIL" as const,
  platform: "EIL-6" as const,
  phaseType: "Freeze" as const,
  status: IntegrationObservabilityFreezeStatusValue,
  readiness: IntegrationObservabilityFreezeReadinessValue,
  lockId: IntegrationObservabilityFreezeLockId,
  certificationDependency: IntegrationObservabilityCertificationCanonicalId,
  certificationEntryPoint: "integrationObservabilityCertification.ts" as const,
  description:
    "Permanent architectural freeze establishing the immutable Integration Observability release baseline for Public Index publication.",
  metadataOnly: true as const,
  immutable: true as const,
});
