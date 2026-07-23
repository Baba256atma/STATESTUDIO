/**
 * EIL-6:5 — Integration Observability Manifest Readiness.
 *
 * Immutable readiness declaration for Platform publication.
 * Metadata-only. No runtime readiness evaluation.
 *
 * Ownership: owned exclusively by EIL-6:5.
 */

import {
  IntegrationObservabilityValidation,
  IntegrationObservabilityValidationReadiness,
} from "./integrationObservabilityValidation.ts";
import {
  IntegrationObservabilityManifestCanonicalId,
  IntegrationObservabilityManifestReadinessValue,
  IntegrationObservabilityManifestStatusValue,
} from "./integrationObservabilityManifestIdentity.ts";

/**
 * Immutable Manifest readiness declaration.
 */
export const IntegrationObservabilityManifestReadiness = Object.freeze({
  readinessId: "EIL-6:5/Readiness" as const,
  canonicalId: IntegrationObservabilityManifestCanonicalId,
  status: IntegrationObservabilityManifestStatusValue,
  readiness: IntegrationObservabilityManifestReadinessValue,
  nextPhase: "EIL-6:6 — Integration Observability Platform" as const,
  upstreamValidationReadiness: IntegrationObservabilityValidationReadiness,
  upstreamValidationAggregateResult:
    IntegrationObservabilityValidation.aggregateResult,
  claimsRuntimeReady: false as const,
  claimsReadyForCertification: false as const,
  claimsReadyForPlatform: true as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
