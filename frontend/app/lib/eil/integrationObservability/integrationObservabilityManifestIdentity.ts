/**
 * EIL-6:5 — Integration Observability Manifest Identity.
 *
 * Canonical immutable identity for the Integration Observability Manifest.
 * Declares exclusive upstream dependency on EIL-6:4 Validation.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by EIL-6:5.
 */

import { IntegrationObservabilityValidationCanonicalId } from "./integrationObservabilityValidation.ts";

/** Canonical phase ID. */
export const IntegrationObservabilityManifestPhaseId = "EIL-6:5" as const;

/** Canonical manifest ID. */
export const IntegrationObservabilityManifestCanonicalId =
  "EIL-6:5/IntegrationObservabilityManifest" as const;

/** Human-readable manifest name. */
export const IntegrationObservabilityManifestName =
  "Integration Observability Manifest" as const;

/** Semantic version. */
export const IntegrationObservabilityManifestVersion = "1.0.0" as const;

/** Canonical namespace. */
export const IntegrationObservabilityManifestNamespace =
  "nexora.eil.integration-observability.manifest" as const;

/** Manifest status. */
export const IntegrationObservabilityManifestStatusValue = "Manifest" as const;

/** Immediate next-phase readiness. */
export const IntegrationObservabilityManifestReadinessValue =
  "ReadyForPlatform" as const;

/**
 * Immutable identity for EIL-6:5 Integration Observability Manifest.
 */
export const IntegrationObservabilityManifestIdentity = Object.freeze({
  phaseId: IntegrationObservabilityManifestPhaseId,
  canonicalId: IntegrationObservabilityManifestCanonicalId,
  name: IntegrationObservabilityManifestName,
  version: IntegrationObservabilityManifestVersion,
  namespace: IntegrationObservabilityManifestNamespace,
  layer: "EIL" as const,
  platform: "EIL-6" as const,
  phaseType: "Manifest" as const,
  status: IntegrationObservabilityManifestStatusValue,
  readiness: IntegrationObservabilityManifestReadinessValue,
  validationDependency: IntegrationObservabilityValidationCanonicalId,
  validationEntryPoint: "integrationObservabilityValidation.ts" as const,
  description:
    "Canonical immutable architectural publication of validated Integration Observability metadata.",
  metadataOnly: true as const,
  immutable: true as const,
});
