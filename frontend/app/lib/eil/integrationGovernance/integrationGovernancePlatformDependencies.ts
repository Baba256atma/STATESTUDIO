/**
 * EIL-7:6 — Integration Governance Platform Dependencies.
 *
 * Immutable dependency metadata. Sole upstream: EIL-7:5 Manifest.
 * Metadata-only. No Certification or later-phase dependency.
 *
 * Ownership: owned exclusively by EIL-7:6.
 */

import {
  IntegrationGovernanceManifest,
  IntegrationGovernanceManifestCanonicalId,
  IntegrationGovernanceManifestIdentity,
} from "./integrationGovernanceManifest.ts";
import { IntegrationGovernancePlatformCanonicalId } from "./integrationGovernancePlatformIdentity.ts";

/**
 * Immutable Platform dependency declarations.
 */
export const IntegrationGovernancePlatformDependencies = Object.freeze({
  dependencyId: "EIL-7:6/Dependencies" as const,
  platformCanonicalId: IntegrationGovernancePlatformCanonicalId,
  upstreamPhase: "EIL-7:5" as const,
  upstreamCanonicalId: IntegrationGovernanceManifestCanonicalId,
  upstreamIdentity: IntegrationGovernanceManifestIdentity,
  upstreamAggregate: IntegrationGovernanceManifest,
  manifestOnly: true as const,
  manifestPublicSurfaceOnly: true as const,
  validationDirectImport: false as const,
  modelDirectImport: false as const,
  registryDirectImport: false as const,
  foundationDirectImport: false as const,
  laterEil7PhaseImport: false as const,
  previousEilPlatformDependency: false as const,
  certificationDependency: false as const,
  freezeDependency: false as const,
  publicIndexDependency: false as const,
  downstreamImplementationDependency: false as const,
  directPreviousPhaseModule: "integrationGovernanceManifest.ts" as const,
  packageEntry: "frontend/app/lib/eil/integrationGovernance" as const,
  canonicalPath:
    "EIL-7:6 → EIL-7:5 IntegrationGovernanceManifest (exclusive)",
  runtimeBehavior: "None" as const,
  metadataOnly: true as const,
  immutable: true as const,
});
