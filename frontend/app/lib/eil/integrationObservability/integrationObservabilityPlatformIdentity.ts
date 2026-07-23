/**
 * EIL-6:6 — Integration Observability Platform Identity.
 *
 * Canonical immutable identity for the Integration Observability Platform.
 * Declares exclusive upstream dependency on EIL-6:5 Manifest.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by EIL-6:6.
 */

import { IntegrationObservabilityManifestCanonicalId } from "./integrationObservabilityManifest.ts";

/** Canonical phase ID. */
export const IntegrationObservabilityPlatformPhaseId = "EIL-6:6" as const;

/** Canonical platform ID. */
export const IntegrationObservabilityPlatformCanonicalId =
  "EIL-6:6/IntegrationObservabilityPlatform" as const;

/** Human-readable platform name. */
export const IntegrationObservabilityPlatformName =
  "Integration Observability Platform" as const;

/** Semantic version. */
export const IntegrationObservabilityPlatformVersion = "1.0.0" as const;

/** Canonical namespace. */
export const IntegrationObservabilityPlatformNamespace =
  "nexora.eil.integration-observability.platform" as const;

/** Platform status. */
export const IntegrationObservabilityPlatformStatusValue = "Platform" as const;

/** Immediate next-phase readiness. */
export const IntegrationObservabilityPlatformReadinessValue =
  "ReadyForCertification" as const;

/**
 * Immutable identity for EIL-6:6 Integration Observability Platform.
 */
export const IntegrationObservabilityPlatformIdentity = Object.freeze({
  phaseId: IntegrationObservabilityPlatformPhaseId,
  canonicalId: IntegrationObservabilityPlatformCanonicalId,
  name: IntegrationObservabilityPlatformName,
  version: IntegrationObservabilityPlatformVersion,
  namespace: IntegrationObservabilityPlatformNamespace,
  layer: "EIL" as const,
  platform: "EIL-6" as const,
  phaseType: "Platform" as const,
  status: IntegrationObservabilityPlatformStatusValue,
  readiness: IntegrationObservabilityPlatformReadinessValue,
  manifestDependency: IntegrationObservabilityManifestCanonicalId,
  manifestEntryPoint: "integrationObservabilityManifest.ts" as const,
  description:
    "Canonical immutable Platform metadata package composing Foundation through Manifest Integration Observability architecture.",
  metadataOnly: true as const,
  immutable: true as const,
});
