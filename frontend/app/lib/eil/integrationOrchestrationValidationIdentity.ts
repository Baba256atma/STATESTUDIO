/**
 * EIL-4:4 — Integration Orchestration Validation Identity.
 *
 * Canonical immutable identity for the Integration Orchestration Validation phase.
 * Declares exactly one upstream phase dependency: EIL-4:3 Integration Orchestration Model.
 * Metadata-only. No validation engine.
 *
 * Ownership: owned exclusively by EIL-4:4.
 */

import type { IntegrationOrchestrationValidationIdentity as OrchestrationValidationIdentityDescriptor } from "./integrationOrchestrationValidationTypes.ts";

/** Canonical phase ID. */
export const IntegrationOrchestrationValidationPhaseId = "EIL-4:4" as const;

/** Canonical validation ID. */
export const IntegrationOrchestrationValidationCanonicalId =
  "EIL-4:4/IntegrationOrchestrationValidation" as const;

/** Human-readable validation name. */
export const IntegrationOrchestrationValidationName =
  "Integration Orchestration Validation" as const;

/** Semantic version. */
export const IntegrationOrchestrationValidationVersion = "1.0.0" as const;

/** Canonical namespace. */
export const IntegrationOrchestrationValidationNamespace =
  "nexora.eil.integration-orchestration.validation" as const;

/** Layer. */
export const IntegrationOrchestrationValidationLayer = "EIL" as const;

/** Platform. */
export const IntegrationOrchestrationValidationPlatformId = "EIL-4" as const;

/** Phase type. */
export const IntegrationOrchestrationValidationPhaseType =
  "Validation" as const;

/** Validation status. */
export const IntegrationOrchestrationValidationStatusValue =
  "Validation" as const;

/** Immediate next-phase readiness. */
export const IntegrationOrchestrationValidationReadinessStateValue =
  "ReadyForManifest" as const;

/** Sole upstream Model dependency. */
export const IntegrationOrchestrationValidationModelDependency =
  "EIL-4:3/IntegrationOrchestrationModel" as const;

/** Sole Model aggregate entry point. */
export const IntegrationOrchestrationValidationModelEntryPoint =
  "integrationOrchestrationModel.ts" as const;

/**
 * Immutable identity object for EIL-4:4 Integration Orchestration Validation.
 * Dependency list contains exactly one phase dependency.
 */
export const IntegrationOrchestrationValidationIdentity: OrchestrationValidationIdentityDescriptor =
  Object.freeze({
    phaseId: IntegrationOrchestrationValidationPhaseId,
    canonicalId: IntegrationOrchestrationValidationCanonicalId,
    name: IntegrationOrchestrationValidationName,
    version: IntegrationOrchestrationValidationVersion,
    namespace: IntegrationOrchestrationValidationNamespace,
    layer: IntegrationOrchestrationValidationLayer,
    platform: IntegrationOrchestrationValidationPlatformId,
    phaseType: IntegrationOrchestrationValidationPhaseType,
    status: IntegrationOrchestrationValidationStatusValue,
    readiness: IntegrationOrchestrationValidationReadinessStateValue,
    modelDependency: IntegrationOrchestrationValidationModelDependency,
    modelEntryPoint: IntegrationOrchestrationValidationModelEntryPoint,
    description:
      "Canonical validation architecture declaring rules, categories, findings, and readiness gates for Integration Orchestration Foundation, Registry, and Model metadata without executing validation.",
    metadataOnly: true as const,
    immutable: true as const,
  });

/** Exactly one declared phase dependency. */
export const IntegrationOrchestrationValidationDependencies = Object.freeze([
  Object.freeze({
    phaseId: IntegrationOrchestrationValidationModelDependency,
    entryPoint: IntegrationOrchestrationValidationModelEntryPoint,
    relationship: "SoleUpstreamModel" as const,
    metadataOnly: true as const,
    immutable: true as const,
  }),
] as const);
