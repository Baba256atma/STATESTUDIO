/**
 * EIL-4:5 — Integration Orchestration Dependency Manifest.
 *
 * Immutable dependency direction and boundary declarations.
 * Sole upstream dependency: integrationOrchestrationValidation.ts.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by EIL-4:5.
 */

import { IntegrationOrchestrationValidationIdentity } from "./integrationOrchestrationValidation.ts";
import type { IntegrationOrchestrationDependencyManifest as OrchestrationDependencyManifestDescriptor } from "./integrationOrchestrationManifestTypes.ts";

/**
 * Canonical immutable dependency manifesto.
 */
export const IntegrationOrchestrationDependencyManifest: OrchestrationDependencyManifestDescriptor =
  Object.freeze({
    dependencyId: "EIL-4:5/Dependency",
    upstreamDependency: IntegrationOrchestrationValidationIdentity.canonicalId,
    dependencyDirection: "Validation → Manifest",
    aggregateEntryPoint: "integrationOrchestrationValidation.ts",
    dependencyScope: "ValidationPublicSurfaceOnly",
    allowedImports: Object.freeze([
      "integrationOrchestrationValidation.ts",
      "local Manifest files",
      "TypeScript type-only imports",
    ]),
    prohibitedImports: Object.freeze([
      "Validation internals",
      "Model internals",
      "Registry internals",
      "Foundation internals",
      "Platform",
      "Certification",
      "Freeze",
      "Public Index",
      "EIL-1",
      "EIL-2",
      "EIL-3",
      "other Nexora layers",
      "external packages",
    ]),
    architecturalBoundaries: Object.freeze([
      "Manifest consumes Validation public surface only",
      "No reconstruction of upstream inventories",
      "No direct Model/Registry/Foundation imports",
      "No later EIL-4 phase imports",
      "No previous EIL platform dependency",
      "Metadata publication only",
    ]),
    phaseDependencyCount: 1,
    laterEil4PhaseImport: false as const,
    validationInternalImport: false as const,
    modelDirectImport: false as const,
    registryDirectImport: false as const,
    foundationDirectImport: false as const,
    previousEilPlatformDependency: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
