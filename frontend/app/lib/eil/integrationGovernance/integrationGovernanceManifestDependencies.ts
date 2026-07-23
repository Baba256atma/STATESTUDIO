/**
 * EIL-7:5 — Integration Governance Manifest Dependencies.
 *
 * Immutable dependency metadata. Sole upstream: EIL-7:4 Validation.
 * Metadata-only. No downstream implementation dependency.
 *
 * Ownership: owned exclusively by EIL-7:5.
 */

import {
  IntegrationGovernanceValidation,
  IntegrationGovernanceValidationCanonicalId,
  IntegrationGovernanceValidationIdentity,
} from "./integrationGovernanceValidation.ts";
import { IntegrationGovernanceManifestCanonicalId } from "./integrationGovernanceManifestIdentity.ts";

/**
 * Immutable Manifest dependency declarations.
 */
export const IntegrationGovernanceManifestDependencies = Object.freeze({
  dependencyId: "EIL-7:5/Dependencies" as const,
  manifestCanonicalId: IntegrationGovernanceManifestCanonicalId,
  upstreamPhase: "EIL-7:4" as const,
  upstreamCanonicalId: IntegrationGovernanceValidationCanonicalId,
  upstreamIdentity: IntegrationGovernanceValidationIdentity,
  upstreamAggregate: IntegrationGovernanceValidation,
  validationOnly: true as const,
  validationPublicSurfaceOnly: true as const,
  modelDirectImport: false as const,
  registryDirectImport: false as const,
  foundationDirectImport: false as const,
  laterEil7PhaseImport: false as const,
  previousEilPlatformDependency: false as const,
  downstreamImplementationDependency: false as const,
  directPreviousPhaseModule: "integrationGovernanceValidation.ts" as const,
  packageEntry: "frontend/app/lib/eil/integrationGovernance" as const,
  canonicalPath:
    "EIL-7:5 → EIL-7:4 IntegrationGovernanceValidation (exclusive)",
  runtimeBehavior: "None" as const,
  metadataOnly: true as const,
  immutable: true as const,
});
