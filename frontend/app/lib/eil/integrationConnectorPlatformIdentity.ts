/**
 * EIL-2:6 — Integration Connector Platform Identity.
 *
 * Canonical immutable identity for the Integration Connector Platform.
 * Declares exactly one upstream phase dependency: EIL-2:5 Integration Connector Manifest.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by EIL-2:6.
 */

import type { IntegrationConnectorPlatformIdentityDescriptor } from "./integrationConnectorPlatformTypes.ts";

/** Canonical phase ID. */
export const IntegrationConnectorPlatformPhaseId = "EIL-2:6" as const;

/** Canonical platform ID. */
export const IntegrationConnectorPlatformCanonicalId =
  "EIL-2:6/IntegrationConnectorPlatform" as const;

/** Human-readable platform name. */
export const IntegrationConnectorPlatformName =
  "Integration Connector Platform" as const;

/** Semantic version. */
export const IntegrationConnectorPlatformVersion = "1.0.0" as const;

/** Canonical namespace. */
export const IntegrationConnectorPlatformNamespace =
  "nexora.eil.integration-connector.platform" as const;

/** Layer. */
export const IntegrationConnectorPlatformLayer = "EIL" as const;

/** Platform. */
export const IntegrationConnectorPlatformPlatformId = "EIL-2" as const;

/** Phase type. */
export const IntegrationConnectorPlatformPhaseType = "Platform" as const;

/** Platform status. */
export const IntegrationConnectorPlatformStatus = "Platform" as const;

/** Immediate next-phase readiness. */
export const IntegrationConnectorPlatformReadinessState =
  "ReadyForCertification" as const;

/** Sole upstream Manifest dependency. */
export const IntegrationConnectorPlatformManifestDependency =
  "EIL-2:5/IntegrationConnectorManifest" as const;

/** Sole Manifest aggregate entry point. */
export const IntegrationConnectorPlatformManifestEntryPoint =
  "integrationConnectorManifest.ts" as const;

/**
 * Immutable identity object for EIL-2:6 Integration Connector Platform.
 * Dependency list contains exactly one phase dependency.
 */
export const IntegrationConnectorPlatformIdentity: IntegrationConnectorPlatformIdentityDescriptor =
  Object.freeze({
    phaseId: IntegrationConnectorPlatformPhaseId,
    canonicalId: IntegrationConnectorPlatformCanonicalId,
    name: IntegrationConnectorPlatformName,
    version: IntegrationConnectorPlatformVersion,
    namespace: IntegrationConnectorPlatformNamespace,
    layer: IntegrationConnectorPlatformLayer,
    platform: IntegrationConnectorPlatformPlatformId,
    phaseType: IntegrationConnectorPlatformPhaseType,
    status: IntegrationConnectorPlatformStatus,
    readiness: IntegrationConnectorPlatformReadinessState,
    manifestDependency: IntegrationConnectorPlatformManifestDependency,
    manifestEntryPoint: IntegrationConnectorPlatformManifestEntryPoint,
    description:
      "Authoritative architectural composition surface for EIL-2, publishing canonical platform identity, inventory, guarantees, and compatibility exclusively from the validated Manifest.",
    metadataOnly: true as const,
    immutable: true as const,
  });

/** Exactly one declared phase dependency. */
export const IntegrationConnectorPlatformDependencies = Object.freeze([
  Object.freeze({
    phaseId: IntegrationConnectorPlatformManifestDependency,
    entryPoint: IntegrationConnectorPlatformManifestEntryPoint,
    relationship: "SoleUpstreamManifest" as const,
    metadataOnly: true as const,
    immutable: true as const,
  }),
] as const);
