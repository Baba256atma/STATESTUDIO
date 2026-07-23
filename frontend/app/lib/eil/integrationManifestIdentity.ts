/**
 * EIL-1:5 — Integration Manifest Identity.
 *
 * Canonical immutable identity for the Executive Integration Manifest.
 * Declares exactly one upstream phase dependency: EIL-1:4 Integration Validation.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by EIL-1:5.
 */

import type { IntegrationManifestIdentityDescriptor } from "./integrationManifestTypes.ts";

/** Canonical phase ID. */
export const IntegrationManifestPhaseId = "EIL-1:5" as const;

/** Canonical manifest ID. */
export const IntegrationManifestCanonicalId =
  "EIL-1:5/IntegrationManifest" as const;

/** Human-readable manifest name. */
export const IntegrationManifestName = "Integration Manifest" as const;

/** Semantic version. */
export const IntegrationManifestVersion = "1.0.0" as const;

/** Canonical namespace. */
export const IntegrationManifestNamespace =
  "nexora.eil.integration.manifest" as const;

/** Layer. */
export const IntegrationManifestLayer = "EIL" as const;

/** Platform. */
export const IntegrationManifestPlatformId = "EIL-1" as const;

/** Phase type. */
export const IntegrationManifestPhaseType = "Manifest" as const;

/** Manifest status. */
export const IntegrationManifestStatus = "Manifest" as const;

/** Immediate next-phase readiness. */
export const IntegrationManifestReadinessState =
  "ReadyForPlatform" as const;

/** Sole upstream Validation dependency. */
export const IntegrationManifestValidationDependency =
  "EIL-1:4/IntegrationValidation" as const;

/** Sole Validation aggregate entry point. */
export const IntegrationManifestValidationEntryPoint =
  "integrationValidation.ts" as const;

/**
 * Immutable identity object for EIL-1:5 Integration Manifest.
 * Dependency list contains exactly one phase dependency.
 */
export const IntegrationManifestIdentity: IntegrationManifestIdentityDescriptor =
  Object.freeze({
    phaseId: IntegrationManifestPhaseId,
    canonicalId: IntegrationManifestCanonicalId,
    name: IntegrationManifestName,
    version: IntegrationManifestVersion,
    namespace: IntegrationManifestNamespace,
    layer: IntegrationManifestLayer,
    platform: IntegrationManifestPlatformId,
    phaseType: IntegrationManifestPhaseType,
    status: IntegrationManifestStatus,
    readiness: IntegrationManifestReadinessState,
    validationDependency: IntegrationManifestValidationDependency,
    validationEntryPoint: IntegrationManifestValidationEntryPoint,
    description:
      "Canonical architectural inventory and readiness declaration publishing validated Integration Foundation, Registry, Model, and Validation metadata.",
    metadataOnly: true as const,
    immutable: true as const,
  });

/** Exactly one declared phase dependency. */
export const IntegrationManifestDependencies = Object.freeze([
  Object.freeze({
    phaseId: IntegrationManifestValidationDependency,
    entryPoint: IntegrationManifestValidationEntryPoint,
    relationship: "SoleUpstreamValidation" as const,
    metadataOnly: true as const,
    immutable: true as const,
  }),
] as const);
