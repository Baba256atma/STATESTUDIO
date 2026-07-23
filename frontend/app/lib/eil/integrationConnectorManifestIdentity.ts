/**
 * EIL-2:5 — Integration Connector Manifest Identity.
 *
 * Canonical immutable identity for the Integration Connector Manifest.
 * Declares exactly one upstream phase dependency: EIL-2:4 Integration Connector Validation.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by EIL-2:5.
 */

import type { IntegrationConnectorManifestIdentityDescriptor } from "./integrationConnectorManifestTypes.ts";

/** Canonical phase ID. */
export const IntegrationConnectorManifestPhaseId = "EIL-2:5" as const;

/** Canonical manifest ID. */
export const IntegrationConnectorManifestCanonicalId =
  "EIL-2:5/IntegrationConnectorManifest" as const;

/** Human-readable manifest name. */
export const IntegrationConnectorManifestName =
  "Integration Connector Manifest" as const;

/** Semantic version. */
export const IntegrationConnectorManifestVersion = "1.0.0" as const;

/** Canonical namespace. */
export const IntegrationConnectorManifestNamespace =
  "nexora.eil.integration-connector.manifest" as const;

/** Layer. */
export const IntegrationConnectorManifestLayer = "EIL" as const;

/** Platform. */
export const IntegrationConnectorManifestPlatformId = "EIL-2" as const;

/** Phase type. */
export const IntegrationConnectorManifestPhaseType = "Manifest" as const;

/** Manifest status. */
export const IntegrationConnectorManifestStatus = "Manifest" as const;

/** Immediate next-phase readiness. */
export const IntegrationConnectorManifestReadinessState =
  "ReadyForPlatform" as const;

/** Sole upstream Validation dependency. */
export const IntegrationConnectorManifestValidationDependency =
  "EIL-2:4/IntegrationConnectorValidation" as const;

/** Sole Validation aggregate entry point. */
export const IntegrationConnectorManifestValidationEntryPoint =
  "integrationConnectorValidation.ts" as const;

/**
 * Immutable identity object for EIL-2:5 Integration Connector Manifest.
 * Dependency list contains exactly one phase dependency.
 */
export const IntegrationConnectorManifestIdentity: IntegrationConnectorManifestIdentityDescriptor =
  Object.freeze({
    phaseId: IntegrationConnectorManifestPhaseId,
    canonicalId: IntegrationConnectorManifestCanonicalId,
    name: IntegrationConnectorManifestName,
    version: IntegrationConnectorManifestVersion,
    namespace: IntegrationConnectorManifestNamespace,
    layer: IntegrationConnectorManifestLayer,
    platform: IntegrationConnectorManifestPlatformId,
    phaseType: IntegrationConnectorManifestPhaseType,
    status: IntegrationConnectorManifestStatus,
    readiness: IntegrationConnectorManifestReadinessState,
    validationDependency:
      IntegrationConnectorManifestValidationDependency,
    validationEntryPoint:
      IntegrationConnectorManifestValidationEntryPoint,
    description:
      "Canonical architectural inventory and readiness declaration publishing validated Integration Connector Foundation, Registry, Model, and Validation metadata.",
    metadataOnly: true as const,
    immutable: true as const,
  });

/** Exactly one declared phase dependency. */
export const IntegrationConnectorManifestDependencies = Object.freeze([
  Object.freeze({
    phaseId: IntegrationConnectorManifestValidationDependency,
    entryPoint: IntegrationConnectorManifestValidationEntryPoint,
    relationship: "SoleUpstreamValidation" as const,
    metadataOnly: true as const,
    immutable: true as const,
  }),
] as const);
