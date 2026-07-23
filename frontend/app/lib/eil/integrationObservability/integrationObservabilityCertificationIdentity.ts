/**
 * EIL-6:7 — Integration Observability Certification Identity.
 *
 * Canonical immutable identity for Integration Observability Certification.
 * Declares exclusive upstream dependency on EIL-6:6 Platform.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by EIL-6:7.
 */

import { IntegrationObservabilityPlatformCanonicalId } from "./integrationObservabilityPlatform.ts";

/** Canonical phase ID. */
export const IntegrationObservabilityCertificationPhaseId = "EIL-6:7" as const;

/** Canonical certification ID. */
export const IntegrationObservabilityCertificationCanonicalId =
  "EIL-6:7/IntegrationObservabilityCertification" as const;

/** Human-readable certification name. */
export const IntegrationObservabilityCertificationName =
  "Integration Observability Certification" as const;

/** Semantic version. */
export const IntegrationObservabilityCertificationVersion = "1.0.0" as const;

/** Canonical namespace. */
export const IntegrationObservabilityCertificationNamespace =
  "nexora.eil.integration-observability.certification" as const;

/** Certification status. */
export const IntegrationObservabilityCertificationStatusValue =
  "Certification" as const;

/** Immediate next-phase readiness. */
export const IntegrationObservabilityCertificationReadinessValue =
  "ReadyForFreeze" as const;

/**
 * Immutable identity for EIL-6:7 Integration Observability Certification.
 */
export const IntegrationObservabilityCertificationIdentity = Object.freeze({
  phaseId: IntegrationObservabilityCertificationPhaseId,
  canonicalId: IntegrationObservabilityCertificationCanonicalId,
  name: IntegrationObservabilityCertificationName,
  version: IntegrationObservabilityCertificationVersion,
  namespace: IntegrationObservabilityCertificationNamespace,
  layer: "EIL" as const,
  platform: "EIL-6" as const,
  phaseType: "Certification" as const,
  status: IntegrationObservabilityCertificationStatusValue,
  readiness: IntegrationObservabilityCertificationReadinessValue,
  platformDependency: IntegrationObservabilityPlatformCanonicalId,
  platformEntryPoint: "integrationObservabilityPlatform.ts" as const,
  description:
    "Canonical immutable certification of Integration Observability Platform architectural integrity.",
  metadataOnly: true as const,
  immutable: true as const,
});
