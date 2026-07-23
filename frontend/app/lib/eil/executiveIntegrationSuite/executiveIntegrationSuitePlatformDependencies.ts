/**
 * EIL-8:6 — Executive Integration Suite Platform Dependencies.
 *
 * Immutable dependency metadata. Sole upstream: EIL-8:5 Manifest.
 * Metadata-only. No Certification or later-phase dependency.
 *
 * Ownership: owned exclusively by EIL-8:6.
 */

import {
  ExecutiveIntegrationSuiteManifest,
  ExecutiveIntegrationSuiteManifestCanonicalId,
  ExecutiveIntegrationSuiteManifestIdentity,
} from "./executiveIntegrationSuiteManifest.ts";
import { ExecutiveIntegrationSuitePlatformCanonicalId } from "./executiveIntegrationSuitePlatformIdentity.ts";

/**
 * Immutable Platform dependency declarations.
 */
export const ExecutiveIntegrationSuitePlatformDependencies = Object.freeze({
  dependencyId: "EIL-8:6/Dependencies" as const,
  platformCanonicalId: ExecutiveIntegrationSuitePlatformCanonicalId,
  upstreamPhase: "EIL-8:5" as const,
  upstreamCanonicalId: ExecutiveIntegrationSuiteManifestCanonicalId,
  upstreamIdentity: ExecutiveIntegrationSuiteManifestIdentity,
  upstreamAggregate: ExecutiveIntegrationSuiteManifest,
  manifestOnly: true as const,
  manifestPublicSurfaceOnly: true as const,
  validationDirectImport: false as const,
  modelDirectImport: false as const,
  registryDirectImport: false as const,
  foundationDirectImport: false as const,
  laterEil8PhaseImport: false as const,
  previousEilPlatformDependency: false as const,
  certificationDependency: false as const,
  freezeDependency: false as const,
  publicIndexDependency: false as const,
  downstreamImplementationDependency: false as const,
  directPreviousPhaseModule: "executiveIntegrationSuiteManifest.ts" as const,
  packageEntry: "frontend/app/lib/eil/executiveIntegrationSuite" as const,
  canonicalPath:
    "EIL-8:6 → EIL-8:5 ExecutiveIntegrationSuiteManifest (exclusive)",
  runtimeBehavior: "None" as const,
  metadataOnly: true as const,
  immutable: true as const,
});
