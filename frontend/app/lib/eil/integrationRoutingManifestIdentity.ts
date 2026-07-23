/**
 * EIL-3:5 — Integration Routing Manifest Identity.
 *
 * Canonical immutable identity for the Integration Routing Manifest.
 * Declares exactly one upstream phase dependency: EIL-3:4 Integration Routing Validation.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by EIL-3:5.
 */

import type { RoutingManifestIdentity } from "./integrationRoutingManifestTypes.ts";

/** Canonical phase ID. */
export const IntegrationRoutingManifestPhaseId = "EIL-3:5" as const;

/** Canonical manifest ID. */
export const IntegrationRoutingManifestCanonicalId =
  "EIL-3:5/IntegrationRoutingManifest" as const;

/** Human-readable manifest name. */
export const IntegrationRoutingManifestName =
  "Integration Routing Manifest" as const;

/** Semantic version. */
export const IntegrationRoutingManifestVersion = "1.0.0" as const;

/** Canonical namespace. */
export const IntegrationRoutingManifestNamespace =
  "nexora.eil.integration-routing.manifest" as const;

/** Layer. */
export const IntegrationRoutingManifestLayer = "EIL" as const;

/** Platform. */
export const IntegrationRoutingManifestPlatformId = "EIL-3" as const;

/** Phase type. */
export const IntegrationRoutingManifestPhaseType = "Manifest" as const;

/** Manifest status. */
export const IntegrationRoutingManifestStatusValue = "Manifest" as const;

/** Immediate next-phase readiness. */
export const IntegrationRoutingManifestReadinessStateValue =
  "ReadyForPlatform" as const;

/** Sole upstream Validation dependency. */
export const IntegrationRoutingManifestValidationDependency =
  "EIL-3:4/IntegrationRoutingValidation" as const;

/** Sole Validation aggregate entry point. */
export const IntegrationRoutingManifestValidationEntryPoint =
  "integrationRoutingValidation.ts" as const;

/**
 * Immutable identity object for EIL-3:5 Integration Routing Manifest.
 * Dependency list contains exactly one phase dependency.
 */
export const IntegrationRoutingManifestIdentity: RoutingManifestIdentity =
  Object.freeze({
    phaseId: IntegrationRoutingManifestPhaseId,
    canonicalId: IntegrationRoutingManifestCanonicalId,
    name: IntegrationRoutingManifestName,
    version: IntegrationRoutingManifestVersion,
    namespace: IntegrationRoutingManifestNamespace,
    layer: IntegrationRoutingManifestLayer,
    platform: IntegrationRoutingManifestPlatformId,
    phaseType: IntegrationRoutingManifestPhaseType,
    status: IntegrationRoutingManifestStatusValue,
    readiness: IntegrationRoutingManifestReadinessStateValue,
    validationDependency: IntegrationRoutingManifestValidationDependency,
    validationEntryPoint: IntegrationRoutingManifestValidationEntryPoint,
    description:
      "Canonical architectural inventory and readiness declaration publishing validated Integration Routing Foundation, Registry, Model, and Validation metadata.",
    metadataOnly: true as const,
    immutable: true as const,
  });

/** Exactly one declared phase dependency. */
export const IntegrationRoutingManifestDependencies = Object.freeze([
  Object.freeze({
    phaseId: IntegrationRoutingManifestValidationDependency,
    entryPoint: IntegrationRoutingManifestValidationEntryPoint,
    relationship: "SoleUpstreamValidation" as const,
    metadataOnly: true as const,
    immutable: true as const,
  }),
] as const);
