/**
 * EIL-5:5 — Integration Policy & Governance Dependency Manifest.
 *
 * Immutable dependency direction and boundary declarations.
 * Sole upstream dependency: integrationPolicyGovernanceValidation.ts.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by EIL-5:5.
 */

import { IntegrationPolicyGovernanceValidationIdentity } from "./integrationPolicyGovernanceValidation.ts";
import type { IntegrationPolicyGovernanceDependencyManifest as PolicyGovernanceDependencyManifestDescriptor } from "./integrationPolicyGovernanceManifestTypes.ts";

/**
 * Canonical immutable dependency manifesto.
 */
export const IntegrationPolicyGovernanceDependencyManifest: PolicyGovernanceDependencyManifestDescriptor =
  Object.freeze({
    dependencyId: "EIL-5:5/Dependency",
    upstreamDependency:
      IntegrationPolicyGovernanceValidationIdentity.canonicalId,
    dependencyDirection: "Validation → Manifest",
    aggregateEntryPoint: "integrationPolicyGovernanceValidation.ts",
    dependencyScope: "ValidationPublicSurfaceOnly",
    allowedImports: Object.freeze([
      "integrationPolicyGovernanceValidation.ts",
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
      "EIL-4",
      "other Nexora layers",
      "external packages",
    ]),
    architecturalBoundaries: Object.freeze([
      "Manifest consumes Validation public surface only",
      "No reconstruction of upstream inventories",
      "No direct Model/Registry/Foundation imports",
      "No later EIL-5 phase imports",
      "No previous EIL platform dependency",
      "Metadata publication only",
    ]),
    phaseDependencyCount: 1,
    laterEil5PhaseImport: false as const,
    validationInternalImport: false as const,
    modelDirectImport: false as const,
    registryDirectImport: false as const,
    foundationDirectImport: false as const,
    previousEilPlatformDependency: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
