/**
 * EIL-9:7 — Executive Integration Layer Certification Dependencies.
 *
 * Immutable dependency metadata. Sole upstream: EIL-9:6 Platform.
 * Metadata-only. No Freeze or Public Index dependency.
 *
 * Ownership: owned exclusively by EIL-9:7.
 */

import {
  ExecutiveIntegrationLayerPlatform,
  ExecutiveIntegrationLayerPlatformCanonicalId,
  ExecutiveIntegrationLayerPlatformIdentity,
} from "./executiveIntegrationLayerPlatform.ts";
import { ExecutiveIntegrationLayerCertificationCanonicalId } from "./executiveIntegrationLayerCertificationIdentity.ts";

/**
 * Immutable Certification dependency declarations.
 */
export const ExecutiveIntegrationLayerCertificationDependencies = Object.freeze(
  {
    dependencyId: "EIL-9:7/Dependencies" as const,
    certificationCanonicalId: ExecutiveIntegrationLayerCertificationCanonicalId,
    upstreamPhase: "EIL-9:6" as const,
    upstreamCanonicalId: ExecutiveIntegrationLayerPlatformCanonicalId,
    upstreamIdentity: ExecutiveIntegrationLayerPlatformIdentity,
    upstreamAggregate: ExecutiveIntegrationLayerPlatform,
    platformOnly: true as const,
    platformPublicSurfaceOnly: true as const,
    manifestDirectImport: false as const,
    validationDirectImport: false as const,
    modelDirectImport: false as const,
    registryDirectImport: false as const,
    foundationDirectImport: false as const,
    laterEil9PhaseImport: false as const,
    eil8DirectImport: false as const,
    eil1ThroughEil7DirectImport: false as const,
    freezeDependency: false as const,
    publicIndexDependency: false as const,
    previousEilPlatformDependency: false as const,
    downstreamImplementationDependency: false as const,
    directPreviousPhaseModule: "executiveIntegrationLayerPlatform.ts" as const,
    packageEntry: "frontend/app/lib/eil/executiveIntegrationLayer" as const,
    canonicalPath:
      "EIL-9:7 → EIL-9:6 ExecutiveIntegrationLayerPlatform (exclusive)",
    runtimeBehavior: "None" as const,
    metadataOnly: true as const,
    immutable: true as const,
  },
);
