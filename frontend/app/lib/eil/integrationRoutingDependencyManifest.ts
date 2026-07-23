/**
 * EIL-3:5 — Integration Routing Dependency Manifest.
 *
 * Immutable dependency direction and boundary declarations.
 * Sole upstream dependency: integrationRoutingValidation.ts.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by EIL-3:5.
 */

import { IntegrationRoutingValidationIdentity } from "./integrationRoutingValidation.ts";
import type { RoutingDependencyManifest } from "./integrationRoutingManifestTypes.ts";

/**
 * Canonical immutable dependency manifesto.
 */
export const IntegrationRoutingDependencyManifest: RoutingDependencyManifest =
  Object.freeze({
    dependencyId: "EIL-3:5/Dependency",
    upstreamDependency: IntegrationRoutingValidationIdentity.canonicalId,
    dependencyDirection: "Validation → Manifest",
    aggregateEntryPoint: "integrationRoutingValidation.ts",
    dependencyScope: "ValidationPublicSurfaceOnly",
    allowedImports: Object.freeze([
      "integrationRoutingValidation.ts",
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
      "other Nexora layers",
      "external packages",
    ]),
    architecturalBoundaries: Object.freeze([
      "Manifest consumes Validation public surface only",
      "No reconstruction of upstream inventories",
      "No direct Model/Registry/Foundation imports",
      "No later EIL-3 phase imports",
      "No previous EIL platform dependency",
      "Metadata publication only",
    ]),
    phaseDependencyCount: 1,
    laterEil3PhaseImport: false as const,
    validationInternalImport: false as const,
    modelDirectImport: false as const,
    registryDirectImport: false as const,
    foundationDirectImport: false as const,
    previousEilPlatformDependency: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
