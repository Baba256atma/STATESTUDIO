/**
 * EIL-9:5 — Executive Integration Layer Manifest Dependencies.
 *
 * Immutable dependency metadata. Sole upstream: EIL-9:4 Validation.
 * Metadata-only. No downstream implementation dependency.
 *
 * Ownership: owned exclusively by EIL-9:5.
 */

import {
  ExecutiveIntegrationLayerValidation,
  ExecutiveIntegrationLayerValidationCanonicalId,
  ExecutiveIntegrationLayerValidationIdentity,
} from "./executiveIntegrationLayerValidation.ts";
import { ExecutiveIntegrationLayerManifestCanonicalId } from "./executiveIntegrationLayerManifestIdentity.ts";

/**
 * Immutable Manifest dependency declarations.
 */
export const ExecutiveIntegrationLayerManifestDependencies = Object.freeze({
  dependencyId: "EIL-9:5/Dependencies" as const,
  manifestCanonicalId: ExecutiveIntegrationLayerManifestCanonicalId,
  upstreamPhase: "EIL-9:4" as const,
  upstreamCanonicalId: ExecutiveIntegrationLayerValidationCanonicalId,
  upstreamIdentity: ExecutiveIntegrationLayerValidationIdentity,
  upstreamAggregate: ExecutiveIntegrationLayerValidation,
  validationOnly: true as const,
  validationPublicSurfaceOnly: true as const,
  modelDirectImport: false as const,
  registryDirectImport: false as const,
  foundationDirectImport: false as const,
  laterEil9PhaseImport: false as const,
  eil8DirectImport: false as const,
  eil1ThroughEil7DirectImport: false as const,
  previousEilPlatformDependency: false as const,
  downstreamImplementationDependency: false as const,
  directPreviousPhaseModule: "executiveIntegrationLayerValidation.ts" as const,
  packageEntry: "frontend/app/lib/eil/executiveIntegrationLayer" as const,
  canonicalPath:
    "EIL-9:5 → EIL-9:4 ExecutiveIntegrationLayerValidation (exclusive)",
  runtimeBehavior: "None" as const,
  metadataOnly: true as const,
  immutable: true as const,
});
