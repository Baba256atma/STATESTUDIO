/**
 * EIL-6:6 — Integration Observability Platform Readiness.
 *
 * Immutable readiness declaration for Certification publication.
 * Metadata-only. No runtime readiness evaluation.
 *
 * Ownership: owned exclusively by EIL-6:6.
 */

import {
  IntegrationObservabilityManifest,
  IntegrationObservabilityManifestReadinessValue,
} from "./integrationObservabilityManifest.ts";
import {
  IntegrationObservabilityPlatformCanonicalId,
  IntegrationObservabilityPlatformReadinessValue,
  IntegrationObservabilityPlatformStatusValue,
} from "./integrationObservabilityPlatformIdentity.ts";

/**
 * Immutable Platform readiness declaration.
 */
export const IntegrationObservabilityPlatformReadiness = Object.freeze({
  readinessId: "EIL-6:6/Readiness" as const,
  canonicalId: IntegrationObservabilityPlatformCanonicalId,
  status: IntegrationObservabilityPlatformStatusValue,
  readiness: IntegrationObservabilityPlatformReadinessValue,
  nextPhase: "EIL-6:7 — Integration Observability Certification" as const,
  upstreamManifestReadiness: IntegrationObservabilityManifestReadinessValue,
  upstreamValidationReadiness:
    IntegrationObservabilityManifest.validationDerivedInventory
      .validationReadiness,
  upstreamValidationAggregateResult:
    IntegrationObservabilityManifest.validationDerivedInventory
      .validationAggregateResult,
  claimsRuntimeReady: false as const,
  claimsReadyForFreeze: false as const,
  claimsReadyForCertification: true as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
