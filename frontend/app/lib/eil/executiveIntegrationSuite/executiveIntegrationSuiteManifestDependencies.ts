/**
 * EIL-8:5 — Executive Integration Suite Manifest Dependencies.
 *
 * Immutable dependency metadata. Sole upstream: EIL-8:4 Validation.
 * Metadata-only. No downstream implementation dependency.
 *
 * Ownership: owned exclusively by EIL-8:5.
 */

import {
  ExecutiveIntegrationSuiteValidation,
  ExecutiveIntegrationSuiteValidationCanonicalId,
  ExecutiveIntegrationSuiteValidationIdentity,
} from "./executiveIntegrationSuiteValidation.ts";
import { ExecutiveIntegrationSuiteManifestCanonicalId } from "./executiveIntegrationSuiteManifestIdentity.ts";

/**
 * Immutable Manifest dependency declarations.
 */
export const ExecutiveIntegrationSuiteManifestDependencies = Object.freeze({
  dependencyId: "EIL-8:5/Dependencies" as const,
  manifestCanonicalId: ExecutiveIntegrationSuiteManifestCanonicalId,
  upstreamPhase: "EIL-8:4" as const,
  upstreamCanonicalId: ExecutiveIntegrationSuiteValidationCanonicalId,
  upstreamIdentity: ExecutiveIntegrationSuiteValidationIdentity,
  upstreamAggregate: ExecutiveIntegrationSuiteValidation,
  validationOnly: true as const,
  validationPublicSurfaceOnly: true as const,
  modelDirectImport: false as const,
  registryDirectImport: false as const,
  foundationDirectImport: false as const,
  laterEil8PhaseImport: false as const,
  previousEilPlatformDependency: false as const,
  downstreamImplementationDependency: false as const,
  directPreviousPhaseModule: "executiveIntegrationSuiteValidation.ts" as const,
  packageEntry: "frontend/app/lib/eil/executiveIntegrationSuite" as const,
  canonicalPath:
    "EIL-8:5 → EIL-8:4 ExecutiveIntegrationSuiteValidation (exclusive)",
  runtimeBehavior: "None" as const,
  metadataOnly: true as const,
  immutable: true as const,
});
