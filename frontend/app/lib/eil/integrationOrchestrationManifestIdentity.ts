/**
 * EIL-4:5 — Integration Orchestration Manifest Identity.
 *
 * Canonical immutable identity for the Integration Orchestration Manifest.
 * Declares exactly one upstream phase dependency: EIL-4:4 Integration Orchestration Validation.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by EIL-4:5.
 */

import type { IntegrationOrchestrationManifestIdentity as OrchestrationManifestIdentityDescriptor } from "./integrationOrchestrationManifestTypes.ts";

/** Canonical phase ID. */
export const IntegrationOrchestrationManifestPhaseId = "EIL-4:5" as const;

/** Canonical manifest ID. */
export const IntegrationOrchestrationManifestCanonicalId =
  "EIL-4:5/IntegrationOrchestrationManifest" as const;

/** Human-readable manifest name. */
export const IntegrationOrchestrationManifestName =
  "Integration Orchestration Manifest" as const;

/** Semantic version. */
export const IntegrationOrchestrationManifestVersion = "1.0.0" as const;

/** Canonical namespace. */
export const IntegrationOrchestrationManifestNamespace =
  "nexora.eil.integration-orchestration.manifest" as const;

/** Layer. */
export const IntegrationOrchestrationManifestLayer = "EIL" as const;

/** Platform. */
export const IntegrationOrchestrationManifestPlatformId = "EIL-4" as const;

/** Phase type. */
export const IntegrationOrchestrationManifestPhaseType = "Manifest" as const;

/** Manifest status. */
export const IntegrationOrchestrationManifestStatusValue = "Manifest" as const;

/** Immediate next-phase readiness. */
export const IntegrationOrchestrationManifestReadinessStateValue =
  "ReadyForPlatform" as const;

/** Sole upstream Validation dependency. */
export const IntegrationOrchestrationManifestValidationDependency =
  "EIL-4:4/IntegrationOrchestrationValidation" as const;

/** Sole Validation aggregate entry point. */
export const IntegrationOrchestrationManifestValidationEntryPoint =
  "integrationOrchestrationValidation.ts" as const;

/**
 * Immutable identity object for EIL-4:5 Integration Orchestration Manifest.
 * Dependency list contains exactly one phase dependency.
 */
export const IntegrationOrchestrationManifestIdentity: OrchestrationManifestIdentityDescriptor =
  Object.freeze({
    phaseId: IntegrationOrchestrationManifestPhaseId,
    canonicalId: IntegrationOrchestrationManifestCanonicalId,
    name: IntegrationOrchestrationManifestName,
    version: IntegrationOrchestrationManifestVersion,
    namespace: IntegrationOrchestrationManifestNamespace,
    layer: IntegrationOrchestrationManifestLayer,
    platform: IntegrationOrchestrationManifestPlatformId,
    phaseType: IntegrationOrchestrationManifestPhaseType,
    status: IntegrationOrchestrationManifestStatusValue,
    readiness: IntegrationOrchestrationManifestReadinessStateValue,
    validationDependency:
      IntegrationOrchestrationManifestValidationDependency,
    validationEntryPoint:
      IntegrationOrchestrationManifestValidationEntryPoint,
    description:
      "Canonical architectural inventory and readiness declaration publishing validated Integration Orchestration Foundation, Registry, Model, and Validation metadata.",
    metadataOnly: true as const,
    immutable: true as const,
  });

/** Exactly one declared phase dependency. */
export const IntegrationOrchestrationManifestDependencies = Object.freeze([
  Object.freeze({
    phaseId: IntegrationOrchestrationManifestValidationDependency,
    entryPoint: IntegrationOrchestrationManifestValidationEntryPoint,
    relationship: "SoleUpstreamValidation" as const,
    metadataOnly: true as const,
    immutable: true as const,
  }),
] as const);
