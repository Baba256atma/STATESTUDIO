/**
 * EIL-4:6 — Integration Orchestration Platform Identity.
 *
 * Canonical immutable identity for the Integration Orchestration Platform.
 * Declares exactly one upstream phase dependency: EIL-4:5 Integration Orchestration Manifest.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by EIL-4:6.
 */

import type { IntegrationOrchestrationPlatformIdentity as OrchestrationPlatformIdentityDescriptor } from "./integrationOrchestrationPlatformTypes.ts";

/** Canonical phase ID. */
export const IntegrationOrchestrationPlatformPhaseId = "EIL-4:6" as const;

/** Canonical platform ID. */
export const IntegrationOrchestrationPlatformCanonicalId =
  "EIL-4:6/IntegrationOrchestrationPlatform" as const;

/** Human-readable platform name. */
export const IntegrationOrchestrationPlatformName =
  "Integration Orchestration Platform" as const;

/** Semantic version. */
export const IntegrationOrchestrationPlatformVersion = "1.0.0" as const;

/** Canonical namespace. */
export const IntegrationOrchestrationPlatformNamespace =
  "nexora.eil.integration-orchestration.platform" as const;

/** Layer. */
export const IntegrationOrchestrationPlatformLayer = "EIL" as const;

/** Platform. */
export const IntegrationOrchestrationPlatformPlatformId = "EIL-4" as const;

/** Phase type. */
export const IntegrationOrchestrationPlatformPhaseType = "Platform" as const;

/** Platform status. */
export const IntegrationOrchestrationPlatformStatusValue = "Platform" as const;

/** Immediate next-phase readiness. */
export const IntegrationOrchestrationPlatformReadinessStateValue =
  "ReadyForCertification" as const;

/** Sole upstream Manifest dependency. */
export const IntegrationOrchestrationPlatformManifestDependency =
  "EIL-4:5/IntegrationOrchestrationManifest" as const;

/** Sole Manifest aggregate entry point. */
export const IntegrationOrchestrationPlatformManifestEntryPoint =
  "integrationOrchestrationManifest.ts" as const;

/**
 * Immutable identity object for EIL-4:6 Integration Orchestration Platform.
 * Dependency list contains exactly one phase dependency.
 */
export const IntegrationOrchestrationPlatformIdentity: OrchestrationPlatformIdentityDescriptor =
  Object.freeze({
    phaseId: IntegrationOrchestrationPlatformPhaseId,
    canonicalId: IntegrationOrchestrationPlatformCanonicalId,
    name: IntegrationOrchestrationPlatformName,
    version: IntegrationOrchestrationPlatformVersion,
    namespace: IntegrationOrchestrationPlatformNamespace,
    layer: IntegrationOrchestrationPlatformLayer,
    platform: IntegrationOrchestrationPlatformPlatformId,
    phaseType: IntegrationOrchestrationPlatformPhaseType,
    status: IntegrationOrchestrationPlatformStatusValue,
    readiness: IntegrationOrchestrationPlatformReadinessStateValue,
    manifestDependency: IntegrationOrchestrationPlatformManifestDependency,
    manifestEntryPoint: IntegrationOrchestrationPlatformManifestEntryPoint,
    description:
      "Authoritative architectural composition surface for EIL-4, publishing canonical platform identity, inventory, guarantees, and compatibility exclusively from the validated Manifest.",
    metadataOnly: true as const,
    immutable: true as const,
  });

/** Exactly one declared phase dependency. */
export const IntegrationOrchestrationPlatformDependencies = Object.freeze([
  Object.freeze({
    phaseId: IntegrationOrchestrationPlatformManifestDependency,
    entryPoint: IntegrationOrchestrationPlatformManifestEntryPoint,
    relationship: "SoleUpstreamManifest" as const,
    metadataOnly: true as const,
    immutable: true as const,
  }),
] as const);
