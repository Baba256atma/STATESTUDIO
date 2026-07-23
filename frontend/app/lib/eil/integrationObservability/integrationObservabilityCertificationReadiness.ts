/**
 * EIL-6:7 — Integration Observability Certification Readiness.
 *
 * Immutable readiness declaration for Freeze publication.
 * Metadata-only. No runtime readiness evaluation.
 *
 * Ownership: owned exclusively by EIL-6:7.
 */

import {
  IntegrationObservabilityPlatform,
  IntegrationObservabilityPlatformReadinessValue,
} from "./integrationObservabilityPlatform.ts";
import {
  IntegrationObservabilityCertificationCanonicalId,
  IntegrationObservabilityCertificationReadinessValue,
  IntegrationObservabilityCertificationStatusValue,
} from "./integrationObservabilityCertificationIdentity.ts";
import { IntegrationObservabilityCertificationAggregateResult } from "./integrationObservabilityCertificationResults.ts";

/**
 * Immutable Certification readiness declaration.
 */
export const IntegrationObservabilityCertificationReadiness = Object.freeze({
  readinessId: "EIL-6:7/Readiness" as const,
  canonicalId: IntegrationObservabilityCertificationCanonicalId,
  status: IntegrationObservabilityCertificationStatusValue,
  readiness: IntegrationObservabilityCertificationReadinessValue,
  nextPhase: "EIL-6:8 — Integration Observability Freeze" as const,
  upstreamPlatformReadiness: IntegrationObservabilityPlatformReadinessValue,
  upstreamValidationReadiness:
    IntegrationObservabilityPlatform.manifestDerivedInventory
      .validationReadiness,
  upstreamValidationAggregateResult:
    IntegrationObservabilityPlatform.manifestDerivedInventory
      .validationAggregateResult,
  aggregateCertificationResult:
    IntegrationObservabilityCertificationAggregateResult,
  claimsRuntimeReady: false as const,
  claimsReadyForPublicIndex: false as const,
  claimsReadyForFreeze: true as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
