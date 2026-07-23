/**
 * EIL-2:5 — Integration Connector Dependency Manifest.
 *
 * Immutable dependency direction and boundary declarations.
 * Sole upstream dependency: integrationConnectorValidation.ts.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by EIL-2:5.
 */

import { IntegrationConnectorValidationIdentity } from "./integrationConnectorValidation.ts";
import type { IntegrationConnectorDependencyManifestDescriptor } from "./integrationConnectorManifestTypes.ts";

/**
 * Canonical immutable dependency manifesto.
 */
export const IntegrationConnectorDependencyManifest: IntegrationConnectorDependencyManifestDescriptor =
  Object.freeze({
    dependencyId: "EIL-2:5/Dependency",
    upstreamDependency: IntegrationConnectorValidationIdentity.canonicalId,
    dependencyDirection: "Validation → Manifest",
    aggregateEntryPoint: "integrationConnectorValidation.ts",
    dependencyScope: "ValidationPublicSurfaceOnly",
    allowedImports: Object.freeze([
      "integrationConnectorValidation.ts",
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
      "other Nexora layers",
      "external packages",
    ]),
    architecturalBoundaries: Object.freeze([
      "Manifest consumes Validation public surface only",
      "No reconstruction of upstream inventories",
      "No direct Model/Registry/Foundation imports",
      "No later EIL-2 phase imports",
      "No EIL-1 dependency",
      "Metadata publication only",
    ]),
    phaseDependencyCount: 1,
    laterEil2PhaseImport: false as const,
    validationInternalImport: false as const,
    modelDirectImport: false as const,
    registryDirectImport: false as const,
    foundationDirectImport: false as const,
    eil1Dependency: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
