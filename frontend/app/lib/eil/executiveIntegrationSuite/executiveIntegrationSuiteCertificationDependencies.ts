/**
 * EIL-8:7 — Executive Integration Suite Certification Dependencies.
 *
 * Immutable dependency metadata. Sole upstream: EIL-8:6 Platform.
 * Metadata-only. No Freeze or Public Index dependency.
 *
 * Ownership: owned exclusively by EIL-8:7.
 */

import {
  ExecutiveIntegrationSuitePlatform,
  ExecutiveIntegrationSuitePlatformCanonicalId,
  ExecutiveIntegrationSuitePlatformIdentity,
} from "./executiveIntegrationSuitePlatform.ts";
import { ExecutiveIntegrationSuiteCertificationCanonicalId } from "./executiveIntegrationSuiteCertificationIdentity.ts";

/**
 * Immutable Certification dependency declarations.
 */
export const ExecutiveIntegrationSuiteCertificationDependencies = Object.freeze(
  {
    dependencyId: "EIL-8:7/Dependencies" as const,
    certificationCanonicalId: ExecutiveIntegrationSuiteCertificationCanonicalId,
    upstreamPhase: "EIL-8:6" as const,
    upstreamCanonicalId: ExecutiveIntegrationSuitePlatformCanonicalId,
    upstreamIdentity: ExecutiveIntegrationSuitePlatformIdentity,
    upstreamAggregate: ExecutiveIntegrationSuitePlatform,
    platformOnly: true as const,
    platformPublicSurfaceOnly: true as const,
    manifestDirectImport: false as const,
    validationDirectImport: false as const,
    modelDirectImport: false as const,
    registryDirectImport: false as const,
    foundationDirectImport: false as const,
    laterEil8PhaseImport: false as const,
    freezeDependency: false as const,
    publicIndexDependency: false as const,
    previousEilPlatformDependency: false as const,
    downstreamImplementationDependency: false as const,
    directPreviousPhaseModule: "executiveIntegrationSuitePlatform.ts" as const,
    packageEntry: "frontend/app/lib/eil/executiveIntegrationSuite" as const,
    canonicalPath:
      "EIL-8:7 → EIL-8:6 ExecutiveIntegrationSuitePlatform (exclusive)",
    runtimeBehavior: "None" as const,
    metadataOnly: true as const,
    immutable: true as const,
  },
);
