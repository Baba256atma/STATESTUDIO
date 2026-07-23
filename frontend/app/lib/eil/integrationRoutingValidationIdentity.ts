/**
 * EIL-3:4 — Integration Routing Validation Identity.
 *
 * Canonical immutable identity for the Integration Routing Validation phase.
 * Declares exactly one upstream phase dependency: EIL-3:3 Integration Routing Model.
 * Metadata-only. No validation engine.
 *
 * Ownership: owned exclusively by EIL-3:4.
 */

import type { RoutingValidationIdentity } from "./integrationRoutingValidationTypes.ts";

/** Canonical phase ID. */
export const IntegrationRoutingValidationPhaseId = "EIL-3:4" as const;

/** Canonical validation ID. */
export const IntegrationRoutingValidationCanonicalId =
  "EIL-3:4/IntegrationRoutingValidation" as const;

/** Human-readable validation name. */
export const IntegrationRoutingValidationName =
  "Integration Routing Validation" as const;

/** Semantic version. */
export const IntegrationRoutingValidationVersion = "1.0.0" as const;

/** Canonical namespace. */
export const IntegrationRoutingValidationNamespace =
  "nexora.eil.integration-routing.validation" as const;

/** Layer. */
export const IntegrationRoutingValidationLayer = "EIL" as const;

/** Platform. */
export const IntegrationRoutingValidationPlatformId = "EIL-3" as const;

/** Phase type. */
export const IntegrationRoutingValidationPhaseType = "Validation" as const;

/** Validation status. */
export const IntegrationRoutingValidationStatusValue = "Validation" as const;

/** Immediate next-phase readiness. */
export const IntegrationRoutingValidationReadinessStateValue =
  "ReadyForManifest" as const;

/** Sole upstream Model dependency. */
export const IntegrationRoutingValidationModelDependency =
  "EIL-3:3/IntegrationRoutingModel" as const;

/** Sole Model aggregate entry point. */
export const IntegrationRoutingValidationModelEntryPoint =
  "integrationRoutingModel.ts" as const;

/**
 * Immutable identity object for EIL-3:4 Integration Routing Validation.
 * Dependency list contains exactly one phase dependency.
 */
export const IntegrationRoutingValidationIdentity: RoutingValidationIdentity =
  Object.freeze({
    phaseId: IntegrationRoutingValidationPhaseId,
    canonicalId: IntegrationRoutingValidationCanonicalId,
    name: IntegrationRoutingValidationName,
    version: IntegrationRoutingValidationVersion,
    namespace: IntegrationRoutingValidationNamespace,
    layer: IntegrationRoutingValidationLayer,
    platform: IntegrationRoutingValidationPlatformId,
    phaseType: IntegrationRoutingValidationPhaseType,
    status: IntegrationRoutingValidationStatusValue,
    readiness: IntegrationRoutingValidationReadinessStateValue,
    modelDependency: IntegrationRoutingValidationModelDependency,
    modelEntryPoint: IntegrationRoutingValidationModelEntryPoint,
    description:
      "Canonical validation architecture declaring rules, categories, findings, and readiness gates for Integration Routing Foundation, Registry, and Model metadata without executing validation.",
    metadataOnly: true as const,
    immutable: true as const,
  });

/** Exactly one declared phase dependency. */
export const IntegrationRoutingValidationDependencies = Object.freeze([
  Object.freeze({
    phaseId: IntegrationRoutingValidationModelDependency,
    entryPoint: IntegrationRoutingValidationModelEntryPoint,
    relationship: "SoleUpstreamModel" as const,
    metadataOnly: true as const,
    immutable: true as const,
  }),
] as const);
