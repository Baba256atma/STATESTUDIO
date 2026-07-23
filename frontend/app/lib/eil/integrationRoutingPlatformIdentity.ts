/**
 * EIL-3:6 — Integration Routing Platform Identity.
 *
 * Canonical immutable identity for the Integration Routing Platform.
 * Declares exactly one upstream phase dependency: EIL-3:5 Integration Routing Manifest.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by EIL-3:6.
 */

import type { RoutingPlatformIdentity } from "./integrationRoutingPlatformTypes.ts";

/** Canonical phase ID. */
export const IntegrationRoutingPlatformPhaseId = "EIL-3:6" as const;

/** Canonical platform ID. */
export const IntegrationRoutingPlatformCanonicalId =
  "EIL-3:6/IntegrationRoutingPlatform" as const;

/** Human-readable platform name. */
export const IntegrationRoutingPlatformName =
  "Integration Routing Platform" as const;

/** Semantic version. */
export const IntegrationRoutingPlatformVersion = "1.0.0" as const;

/** Canonical namespace. */
export const IntegrationRoutingPlatformNamespace =
  "nexora.eil.integration-routing.platform" as const;

/** Layer. */
export const IntegrationRoutingPlatformLayer = "EIL" as const;

/** Platform. */
export const IntegrationRoutingPlatformPlatformId = "EIL-3" as const;

/** Phase type. */
export const IntegrationRoutingPlatformPhaseType = "Platform" as const;

/** Platform status. */
export const IntegrationRoutingPlatformStatusValue = "Platform" as const;

/** Immediate next-phase readiness. */
export const IntegrationRoutingPlatformReadinessStateValue =
  "ReadyForCertification" as const;

/** Sole upstream Manifest dependency. */
export const IntegrationRoutingPlatformManifestDependency =
  "EIL-3:5/IntegrationRoutingManifest" as const;

/** Sole Manifest aggregate entry point. */
export const IntegrationRoutingPlatformManifestEntryPoint =
  "integrationRoutingManifest.ts" as const;

/**
 * Immutable identity object for EIL-3:6 Integration Routing Platform.
 * Dependency list contains exactly one phase dependency.
 */
export const IntegrationRoutingPlatformIdentity: RoutingPlatformIdentity =
  Object.freeze({
    phaseId: IntegrationRoutingPlatformPhaseId,
    canonicalId: IntegrationRoutingPlatformCanonicalId,
    name: IntegrationRoutingPlatformName,
    version: IntegrationRoutingPlatformVersion,
    namespace: IntegrationRoutingPlatformNamespace,
    layer: IntegrationRoutingPlatformLayer,
    platform: IntegrationRoutingPlatformPlatformId,
    phaseType: IntegrationRoutingPlatformPhaseType,
    status: IntegrationRoutingPlatformStatusValue,
    readiness: IntegrationRoutingPlatformReadinessStateValue,
    manifestDependency: IntegrationRoutingPlatformManifestDependency,
    manifestEntryPoint: IntegrationRoutingPlatformManifestEntryPoint,
    description:
      "Authoritative architectural composition surface for EIL-3, publishing canonical platform identity, inventory, guarantees, and compatibility exclusively from the validated Manifest.",
    metadataOnly: true as const,
    immutable: true as const,
  });

/** Exactly one declared phase dependency. */
export const IntegrationRoutingPlatformDependencies = Object.freeze([
  Object.freeze({
    phaseId: IntegrationRoutingPlatformManifestDependency,
    entryPoint: IntegrationRoutingPlatformManifestEntryPoint,
    relationship: "SoleUpstreamManifest" as const,
    metadataOnly: true as const,
    immutable: true as const,
  }),
] as const);
