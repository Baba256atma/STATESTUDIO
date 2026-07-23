/**
 * EIL-6:7 — Integration Observability Certification Dependencies.
 *
 * Immutable dependency metadata. Sole upstream: EIL-6:6 Platform.
 * Metadata-only. No Freeze or Public Index dependency.
 *
 * Ownership: owned exclusively by EIL-6:7.
 */

import {
  IntegrationObservabilityPlatform,
  IntegrationObservabilityPlatformCanonicalId,
  IntegrationObservabilityPlatformIdentity,
} from "./integrationObservabilityPlatform.ts";
import { IntegrationObservabilityCertificationCanonicalId } from "./integrationObservabilityCertificationIdentity.ts";

/**
 * Immutable Certification dependency declarations.
 */
export const IntegrationObservabilityCertificationDependencies = Object.freeze({
  dependencyId: "EIL-6:7/Dependencies" as const,
  certificationCanonicalId: IntegrationObservabilityCertificationCanonicalId,
  upstreamPhase: "EIL-6:6" as const,
  upstreamCanonicalId: IntegrationObservabilityPlatformCanonicalId,
  upstreamIdentity: IntegrationObservabilityPlatformIdentity,
  upstreamAggregate: IntegrationObservabilityPlatform,
  platformOnly: true as const,
  platformPublicSurfaceOnly: true as const,
  manifestDirectImport: false as const,
  validationDirectImport: false as const,
  modelDirectImport: false as const,
  registryDirectImport: false as const,
  foundationDirectImport: false as const,
  laterEil6PhaseImport: false as const,
  freezeDependency: false as const,
  publicIndexDependency: false as const,
  previousEilPlatformDependency: false as const,
  downstreamImplementationDependency: false as const,
  directPreviousPhaseModule: "integrationObservabilityPlatform.ts" as const,
  canonicalPath:
    "EIL-6:7 → EIL-6:6 IntegrationObservabilityPlatform (exclusive)",
  runtimeBehavior: "None" as const,
  metadataOnly: true as const,
  immutable: true as const,
});
