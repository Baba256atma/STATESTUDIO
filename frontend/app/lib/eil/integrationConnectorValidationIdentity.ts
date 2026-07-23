/**
 * EIL-2:4 — Integration Connector Validation Identity.
 *
 * Canonical immutable identity for the Integration Connector Validation phase.
 * Declares exactly one upstream phase dependency: EIL-2:3 Integration Connector Model.
 * Metadata-only. No validation engine.
 *
 * Ownership: owned exclusively by EIL-2:4.
 */

import type { IntegrationConnectorValidationIdentityDescriptor } from "./integrationConnectorValidationTypes.ts";

/** Canonical phase ID. */
export const IntegrationConnectorValidationPhaseId = "EIL-2:4" as const;

/** Canonical validation ID. */
export const IntegrationConnectorValidationCanonicalId =
  "EIL-2:4/IntegrationConnectorValidation" as const;

/** Human-readable validation name. */
export const IntegrationConnectorValidationName =
  "Integration Connector Validation" as const;

/** Semantic version. */
export const IntegrationConnectorValidationVersion = "1.0.0" as const;

/** Canonical namespace. */
export const IntegrationConnectorValidationNamespace =
  "nexora.eil.integration-connector.validation" as const;

/** Layer. */
export const IntegrationConnectorValidationLayer = "EIL" as const;

/** Platform. */
export const IntegrationConnectorValidationPlatformId = "EIL-2" as const;

/** Phase type. */
export const IntegrationConnectorValidationPhaseType = "Validation" as const;

/** Validation status. */
export const IntegrationConnectorValidationStatus = "Validation" as const;

/** Immediate next-phase readiness. */
export const IntegrationConnectorValidationReadinessState =
  "ReadyForManifest" as const;

/** Sole upstream Model dependency. */
export const IntegrationConnectorValidationModelDependency =
  "EIL-2:3/IntegrationConnectorModel" as const;

/** Sole Model aggregate entry point. */
export const IntegrationConnectorValidationModelEntryPoint =
  "integrationConnectorModel.ts" as const;

/**
 * Immutable identity object for EIL-2:4 Integration Connector Validation.
 * Dependency list contains exactly one phase dependency.
 */
export const IntegrationConnectorValidationIdentity: IntegrationConnectorValidationIdentityDescriptor =
  Object.freeze({
    phaseId: IntegrationConnectorValidationPhaseId,
    canonicalId: IntegrationConnectorValidationCanonicalId,
    name: IntegrationConnectorValidationName,
    version: IntegrationConnectorValidationVersion,
    namespace: IntegrationConnectorValidationNamespace,
    layer: IntegrationConnectorValidationLayer,
    platform: IntegrationConnectorValidationPlatformId,
    phaseType: IntegrationConnectorValidationPhaseType,
    status: IntegrationConnectorValidationStatus,
    readiness: IntegrationConnectorValidationReadinessState,
    modelDependency: IntegrationConnectorValidationModelDependency,
    modelEntryPoint: IntegrationConnectorValidationModelEntryPoint,
    description:
      "Canonical validation architecture declaring rules, categories, findings, and readiness gates for Integration Connector Foundation, Registry, and Model metadata without executing validation.",
    metadataOnly: true as const,
    immutable: true as const,
  });

/** Exactly one declared phase dependency. */
export const IntegrationConnectorValidationDependencies = Object.freeze([
  Object.freeze({
    phaseId: IntegrationConnectorValidationModelDependency,
    entryPoint: IntegrationConnectorValidationModelEntryPoint,
    relationship: "SoleUpstreamModel" as const,
    metadataOnly: true as const,
    immutable: true as const,
  }),
] as const);
