/**
 * EIL-6:5 — Integration Observability Manifest Dependencies.
 *
 * Immutable dependency metadata. Sole upstream: EIL-6:4 Validation.
 * Metadata-only. No downstream implementation dependency.
 *
 * Ownership: owned exclusively by EIL-6:5.
 */

import {
  IntegrationObservabilityValidation,
  IntegrationObservabilityValidationCanonicalId,
  IntegrationObservabilityValidationIdentity,
} from "./integrationObservabilityValidation.ts";
import { IntegrationObservabilityManifestCanonicalId } from "./integrationObservabilityManifestIdentity.ts";

/**
 * Immutable Manifest dependency declarations.
 */
export const IntegrationObservabilityManifestDependencies = Object.freeze({
  dependencyId: "EIL-6:5/Dependencies" as const,
  manifestCanonicalId: IntegrationObservabilityManifestCanonicalId,
  upstreamPhase: "EIL-6:4" as const,
  upstreamCanonicalId: IntegrationObservabilityValidationCanonicalId,
  upstreamIdentity: IntegrationObservabilityValidationIdentity,
  upstreamAggregate: IntegrationObservabilityValidation,
  validationOnly: true as const,
  validationPublicSurfaceOnly: true as const,
  modelDirectImport: false as const,
  registryDirectImport: false as const,
  foundationDirectImport: false as const,
  laterEil6PhaseImport: false as const,
  previousEilPlatformDependency: false as const,
  downstreamImplementationDependency: false as const,
  directPreviousPhaseModule: "integrationObservabilityValidation.ts" as const,
  canonicalPath:
    "EIL-6:5 → EIL-6:4 IntegrationObservabilityValidation (exclusive)",
  runtimeBehavior: "None" as const,
  metadataOnly: true as const,
  immutable: true as const,
});
