/**
 * EIL-1:4 — Integration Validation Identity.
 *
 * Canonical immutable identity for the Executive Integration Validation phase.
 * Declares exactly one upstream phase dependency: EIL-1:3 Integration Model.
 * Metadata-only. No validation engine.
 *
 * Ownership: owned exclusively by EIL-1:4.
 */

import type { IntegrationValidationIdentityDescriptor } from "./integrationValidationTypes.ts";

/** Canonical phase ID. */
export const IntegrationValidationPhaseId = "EIL-1:4" as const;

/** Canonical validation ID. */
export const IntegrationValidationCanonicalId =
  "EIL-1:4/IntegrationValidation" as const;

/** Human-readable validation name. */
export const IntegrationValidationName = "Integration Validation" as const;

/** Semantic version. */
export const IntegrationValidationVersion = "1.0.0" as const;

/** Canonical namespace. */
export const IntegrationValidationNamespace =
  "nexora.eil.integration.validation" as const;

/** Layer. */
export const IntegrationValidationLayer = "EIL" as const;

/** Platform. */
export const IntegrationValidationPlatformId = "EIL-1" as const;

/** Phase type. */
export const IntegrationValidationPhaseType = "Validation" as const;

/** Validation status. */
export const IntegrationValidationStatus = "Validation" as const;

/** Immediate next-phase readiness. */
export const IntegrationValidationReadinessState =
  "ReadyForManifest" as const;

/** Sole upstream Model dependency. */
export const IntegrationValidationModelDependency =
  "EIL-1:3/IntegrationModel" as const;

/** Sole Model aggregate entry point. */
export const IntegrationValidationModelEntryPoint =
  "integrationModel.ts" as const;

/**
 * Immutable identity object for EIL-1:4 Integration Validation.
 * Dependency list contains exactly one phase dependency.
 */
export const IntegrationValidationIdentity: IntegrationValidationIdentityDescriptor =
  Object.freeze({
    phaseId: IntegrationValidationPhaseId,
    canonicalId: IntegrationValidationCanonicalId,
    name: IntegrationValidationName,
    version: IntegrationValidationVersion,
    namespace: IntegrationValidationNamespace,
    layer: IntegrationValidationLayer,
    platform: IntegrationValidationPlatformId,
    phaseType: IntegrationValidationPhaseType,
    status: IntegrationValidationStatus,
    readiness: IntegrationValidationReadinessState,
    modelDependency: IntegrationValidationModelDependency,
    modelEntryPoint: IntegrationValidationModelEntryPoint,
    description:
      "Canonical validation architecture declaring rules, categories, findings, and readiness gates for Integration Foundation, Registry, and Model metadata without executing validation.",
    metadataOnly: true as const,
    immutable: true as const,
  });

/** Exactly one declared phase dependency. */
export const IntegrationValidationDependencies = Object.freeze([
  Object.freeze({
    phaseId: IntegrationValidationModelDependency,
    entryPoint: IntegrationValidationModelEntryPoint,
    relationship: "SoleUpstreamModel" as const,
    metadataOnly: true as const,
    immutable: true as const,
  }),
] as const);
