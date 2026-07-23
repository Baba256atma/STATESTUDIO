/**
 * EIL-6:6 — Integration Observability Platform Dependencies.
 *
 * Immutable dependency metadata. Sole upstream: EIL-6:5 Manifest.
 * Metadata-only. No Certification or later-phase dependency.
 *
 * Ownership: owned exclusively by EIL-6:6.
 */

import {
  IntegrationObservabilityManifest,
  IntegrationObservabilityManifestCanonicalId,
  IntegrationObservabilityManifestIdentity,
} from "./integrationObservabilityManifest.ts";
import { IntegrationObservabilityPlatformCanonicalId } from "./integrationObservabilityPlatformIdentity.ts";

/**
 * Immutable Platform dependency declarations.
 */
export const IntegrationObservabilityPlatformDependencies = Object.freeze({
  dependencyId: "EIL-6:6/Dependencies" as const,
  platformCanonicalId: IntegrationObservabilityPlatformCanonicalId,
  upstreamPhase: "EIL-6:5" as const,
  upstreamCanonicalId: IntegrationObservabilityManifestCanonicalId,
  upstreamIdentity: IntegrationObservabilityManifestIdentity,
  upstreamAggregate: IntegrationObservabilityManifest,
  manifestOnly: true as const,
  manifestPublicSurfaceOnly: true as const,
  validationDirectImport: false as const,
  modelDirectImport: false as const,
  registryDirectImport: false as const,
  foundationDirectImport: false as const,
  laterEil6PhaseImport: false as const,
  previousEilPlatformDependency: false as const,
  certificationDependency: false as const,
  freezeDependency: false as const,
  publicIndexDependency: false as const,
  directPreviousPhaseModule: "integrationObservabilityManifest.ts" as const,
  canonicalPath:
    "EIL-6:6 → EIL-6:5 IntegrationObservabilityManifest (exclusive)",
  runtimeBehavior: "None" as const,
  metadataOnly: true as const,
  immutable: true as const,
});
