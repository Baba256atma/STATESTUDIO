/**
 * EIL-7:7 — Integration Governance Certification Dependencies.
 *
 * Immutable dependency metadata. Sole upstream: EIL-7:6 Platform.
 * Metadata-only. No Freeze or Public Index dependency.
 *
 * Ownership: owned exclusively by EIL-7:7.
 */

import {
  IntegrationGovernancePlatform,
  IntegrationGovernancePlatformCanonicalId,
  IntegrationGovernancePlatformIdentity,
} from "./integrationGovernancePlatform.ts";
import { IntegrationGovernanceCertificationCanonicalId } from "./integrationGovernanceCertificationIdentity.ts";

/**
 * Immutable Certification dependency declarations.
 */
export const IntegrationGovernanceCertificationDependencies = Object.freeze({
  dependencyId: "EIL-7:7/Dependencies" as const,
  certificationCanonicalId: IntegrationGovernanceCertificationCanonicalId,
  upstreamPhase: "EIL-7:6" as const,
  upstreamCanonicalId: IntegrationGovernancePlatformCanonicalId,
  upstreamIdentity: IntegrationGovernancePlatformIdentity,
  upstreamAggregate: IntegrationGovernancePlatform,
  platformOnly: true as const,
  platformPublicSurfaceOnly: true as const,
  manifestDirectImport: false as const,
  validationDirectImport: false as const,
  modelDirectImport: false as const,
  registryDirectImport: false as const,
  foundationDirectImport: false as const,
  laterEil7PhaseImport: false as const,
  freezeDependency: false as const,
  publicIndexDependency: false as const,
  previousEilPlatformDependency: false as const,
  downstreamImplementationDependency: false as const,
  directPreviousPhaseModule: "integrationGovernancePlatform.ts" as const,
  packageEntry: "frontend/app/lib/eil/integrationGovernance" as const,
  canonicalPath:
    "EIL-7:7 → EIL-7:6 IntegrationGovernancePlatform (exclusive)",
  runtimeBehavior: "None" as const,
  metadataOnly: true as const,
  immutable: true as const,
});
