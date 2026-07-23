/**
 * EIL-1:6 — Integration Platform Identity.
 *
 * Canonical immutable identity for the Executive Integration Platform.
 * Declares exactly one upstream phase dependency: EIL-1:5 Integration Manifest.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by EIL-1:6.
 */

import type { IntegrationPlatformIdentityDescriptor } from "./integrationPlatformTypes.ts";

/** Canonical phase ID. */
export const IntegrationPlatformPhaseId = "EIL-1:6" as const;

/** Canonical platform ID. */
export const IntegrationPlatformCanonicalId =
  "EIL-1:6/IntegrationPlatform" as const;

/** Human-readable platform name. */
export const IntegrationPlatformName = "Integration Platform" as const;

/** Semantic version. */
export const IntegrationPlatformVersion = "1.0.0" as const;

/** Canonical namespace. */
export const IntegrationPlatformNamespace =
  "nexora.eil.integration.platform" as const;

/** Layer. */
export const IntegrationPlatformLayer = "EIL" as const;

/** Platform. */
export const IntegrationPlatformPlatformId = "EIL-1" as const;

/** Phase type. */
export const IntegrationPlatformPhaseType = "Platform" as const;

/** Platform status. */
export const IntegrationPlatformStatus = "Platform" as const;

/** Immediate next-phase readiness. */
export const IntegrationPlatformReadinessState =
  "ReadyForCertification" as const;

/** Sole upstream Manifest dependency. */
export const IntegrationPlatformManifestDependency =
  "EIL-1:5/IntegrationManifest" as const;

/** Sole Manifest aggregate entry point. */
export const IntegrationPlatformManifestEntryPoint =
  "integrationManifest.ts" as const;

/**
 * Immutable identity object for EIL-1:6 Integration Platform.
 * Dependency list contains exactly one phase dependency.
 */
export const IntegrationPlatformIdentity: IntegrationPlatformIdentityDescriptor =
  Object.freeze({
    phaseId: IntegrationPlatformPhaseId,
    canonicalId: IntegrationPlatformCanonicalId,
    name: IntegrationPlatformName,
    version: IntegrationPlatformVersion,
    namespace: IntegrationPlatformNamespace,
    layer: IntegrationPlatformLayer,
    platform: IntegrationPlatformPlatformId,
    phaseType: IntegrationPlatformPhaseType,
    status: IntegrationPlatformStatus,
    readiness: IntegrationPlatformReadinessState,
    manifestDependency: IntegrationPlatformManifestDependency,
    manifestEntryPoint: IntegrationPlatformManifestEntryPoint,
    description:
      "Authoritative architectural composition surface for EIL-1, publishing canonical platform identity, inventory, guarantees, and compatibility exclusively from the validated Manifest.",
    metadataOnly: true as const,
    immutable: true as const,
  });

/** Exactly one declared phase dependency. */
export const IntegrationPlatformDependencies = Object.freeze([
  Object.freeze({
    phaseId: IntegrationPlatformManifestDependency,
    entryPoint: IntegrationPlatformManifestEntryPoint,
    relationship: "SoleUpstreamManifest" as const,
    metadataOnly: true as const,
    immutable: true as const,
  }),
] as const);
