/**
 * EIL-1:5 — Integration Dependency Manifest.
 *
 * Immutable dependency direction and boundary declarations.
 * Sole upstream dependency: integrationValidation.ts.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by EIL-1:5.
 */

import { IntegrationValidationIdentity } from "./integrationValidation.ts";
import type { IntegrationDependencyManifestDescriptor } from "./integrationManifestTypes.ts";

/**
 * Canonical immutable dependency manifesto.
 */
export const IntegrationDependencyManifest: IntegrationDependencyManifestDescriptor =
  Object.freeze({
    dependencyId: "EIL-1:5/Dependency",
    upstreamDependency: IntegrationValidationIdentity.canonicalId,
    dependencyDirection: "Validation → Manifest",
    aggregateEntryPoint: "integrationValidation.ts",
    dependencyScope: "ValidationPublicSurfaceOnly",
    allowedImports: Object.freeze([
      "integrationValidation.ts",
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
      "other Nexora layers",
      "external packages",
    ]),
    architecturalBoundaries: Object.freeze([
      "Manifest consumes Validation public surface only",
      "No reconstruction of upstream inventories",
      "No direct Model/Registry/Foundation imports",
      "No later EIL phase imports",
      "Metadata publication only",
    ]),
    phaseDependencyCount: 1,
    laterEilPhaseImport: false as const,
    validationInternalImport: false as const,
    modelDirectImport: false as const,
    registryDirectImport: false as const,
    foundationDirectImport: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
