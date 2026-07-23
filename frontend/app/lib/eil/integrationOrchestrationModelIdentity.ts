/**
 * EIL-4:3 — Integration Orchestration Model Identity.
 *
 * Canonical immutable identity for the Integration Orchestration Model.
 * Declares exactly one upstream phase dependency: EIL-4:2 Integration Orchestration Registry.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by EIL-4:3.
 */

import type { IntegrationOrchestrationModelIdentity as OrchestrationModelIdentityDescriptor } from "./integrationOrchestrationModelTypes.ts";

/** Canonical phase ID. */
export const IntegrationOrchestrationModelPhaseId = "EIL-4:3" as const;

/** Canonical model ID. */
export const IntegrationOrchestrationModelCanonicalId =
  "EIL-4:3/IntegrationOrchestrationModel" as const;

/** Human-readable model name. */
export const IntegrationOrchestrationModelName =
  "Integration Orchestration Model" as const;

/** Semantic version. */
export const IntegrationOrchestrationModelVersion = "1.0.0" as const;

/** Canonical namespace. */
export const IntegrationOrchestrationModelNamespace =
  "nexora.eil.integration-orchestration.model" as const;

/** Layer. */
export const IntegrationOrchestrationModelLayer = "EIL" as const;

/** Platform. */
export const IntegrationOrchestrationModelPlatformId = "EIL-4" as const;

/** Phase type. */
export const IntegrationOrchestrationModelPhaseType = "Model" as const;

/** Model status. */
export const IntegrationOrchestrationModelStatusValue = "Model" as const;

/** Immediate next-phase readiness. */
export const IntegrationOrchestrationModelReadinessValue =
  "ReadyForValidation" as const;

/** Sole upstream Registry dependency. */
export const IntegrationOrchestrationModelRegistryDependency =
  "EIL-4:2/IntegrationOrchestrationRegistry" as const;

/** Sole Registry aggregate entry point. */
export const IntegrationOrchestrationModelRegistryEntryPoint =
  "integrationOrchestrationRegistry.ts" as const;

/**
 * Immutable identity object for EIL-4:3 Integration Orchestration Model.
 * Dependency list contains exactly one phase dependency.
 */
export const IntegrationOrchestrationModelIdentity: OrchestrationModelIdentityDescriptor =
  Object.freeze({
    phaseId: IntegrationOrchestrationModelPhaseId,
    canonicalId: IntegrationOrchestrationModelCanonicalId,
    name: IntegrationOrchestrationModelName,
    version: IntegrationOrchestrationModelVersion,
    namespace: IntegrationOrchestrationModelNamespace,
    layer: IntegrationOrchestrationModelLayer,
    platform: IntegrationOrchestrationModelPlatformId,
    phaseType: IntegrationOrchestrationModelPhaseType,
    status: IntegrationOrchestrationModelStatusValue,
    readiness: IntegrationOrchestrationModelReadinessValue,
    registryDependency: IntegrationOrchestrationModelRegistryDependency,
    registryEntryPoint: IntegrationOrchestrationModelRegistryEntryPoint,
    description:
      "Canonical architectural model transforming Integration Orchestration Registry collections into deterministic domain, relationship, topology, and lifecycle model metadata.",
    metadataOnly: true as const,
    immutable: true as const,
  });

/** Exactly one declared phase dependency. */
export const IntegrationOrchestrationModelDependencies = Object.freeze([
  Object.freeze({
    phaseId: IntegrationOrchestrationModelRegistryDependency,
    entryPoint: IntegrationOrchestrationModelRegistryEntryPoint,
    relationship: "SoleUpstreamRegistry" as const,
    metadataOnly: true as const,
    immutable: true as const,
  }),
] as const);
