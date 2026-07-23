/**
 * EIL-9:6 — Executive Integration Layer Platform Dependencies.
 *
 * Immutable dependency metadata. Sole upstream: EIL-9:5 Manifest.
 * Metadata-only. No Certification or later-phase dependency.
 *
 * Ownership: owned exclusively by EIL-9:6.
 */

import {
  ExecutiveIntegrationLayerManifest,
  ExecutiveIntegrationLayerManifestCanonicalId,
  ExecutiveIntegrationLayerManifestIdentity,
} from "./executiveIntegrationLayerManifest.ts";
import { ExecutiveIntegrationLayerPlatformCanonicalId } from "./executiveIntegrationLayerPlatformIdentity.ts";

/**
 * Immutable Platform dependency declarations.
 */
export const ExecutiveIntegrationLayerPlatformDependencies = Object.freeze({
  dependencyId: "EIL-9:6/Dependencies" as const,
  platformCanonicalId: ExecutiveIntegrationLayerPlatformCanonicalId,
  upstreamPhase: "EIL-9:5" as const,
  upstreamCanonicalId: ExecutiveIntegrationLayerManifestCanonicalId,
  upstreamIdentity: ExecutiveIntegrationLayerManifestIdentity,
  upstreamAggregate: ExecutiveIntegrationLayerManifest,
  manifestOnly: true as const,
  manifestPublicSurfaceOnly: true as const,
  validationDirectImport: false as const,
  modelDirectImport: false as const,
  registryDirectImport: false as const,
  foundationDirectImport: false as const,
  laterEil9PhaseImport: false as const,
  eil8DirectImport: false as const,
  eil1ThroughEil7DirectImport: false as const,
  previousEilPlatformDependency: false as const,
  certificationDependency: false as const,
  freezeDependency: false as const,
  publicIndexDependency: false as const,
  downstreamImplementationDependency: false as const,
  directPreviousPhaseModule: "executiveIntegrationLayerManifest.ts" as const,
  packageEntry: "frontend/app/lib/eil/executiveIntegrationLayer" as const,
  canonicalPath:
    "EIL-9:6 → EIL-9:5 ExecutiveIntegrationLayerManifest (exclusive)",
  runtimeBehavior: "None" as const,
  metadataOnly: true as const,
  immutable: true as const,
});
