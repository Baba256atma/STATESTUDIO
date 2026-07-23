/**
 * EIL-1:3 — Integration Model Identity.
 *
 * Canonical immutable identity for the Executive Integration Model.
 * Declares exactly one upstream phase dependency: EIL-1:2 Integration Registry.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by EIL-1:3.
 */

import type { IntegrationModelIdentityDescriptor } from "./integrationModelTypes.ts";

/** Canonical phase ID. */
export const IntegrationModelPhaseId = "EIL-1:3" as const;

/** Canonical model ID. */
export const IntegrationModelCanonicalId =
  "EIL-1:3/IntegrationModel" as const;

/** Human-readable model name. */
export const IntegrationModelName = "Integration Model" as const;

/** Semantic version. */
export const IntegrationModelVersion = "1.0.0" as const;

/** Canonical namespace. */
export const IntegrationModelNamespace =
  "nexora.eil.integration.model" as const;

/** Layer. */
export const IntegrationModelLayer = "EIL" as const;

/** Platform. */
export const IntegrationModelPlatformId = "EIL-1" as const;

/** Phase type. */
export const IntegrationModelPhaseType = "Model" as const;

/** Model status. */
export const IntegrationModelStatus = "Model" as const;

/** Immediate next-phase readiness. */
export const IntegrationModelReadiness = "ReadyForValidation" as const;

/** Sole upstream Registry dependency. */
export const IntegrationModelRegistryDependency =
  "EIL-1:2/IntegrationRegistry" as const;

/** Sole Registry aggregate entry point. */
export const IntegrationModelRegistryEntryPoint =
  "integrationRegistry.ts" as const;

/**
 * Immutable identity object for EIL-1:3 Integration Model.
 * Dependency list contains exactly one phase dependency.
 */
export const IntegrationModelIdentity: IntegrationModelIdentityDescriptor =
  Object.freeze({
    phaseId: IntegrationModelPhaseId,
    canonicalId: IntegrationModelCanonicalId,
    name: IntegrationModelName,
    version: IntegrationModelVersion,
    namespace: IntegrationModelNamespace,
    layer: IntegrationModelLayer,
    platform: IntegrationModelPlatformId,
    phaseType: IntegrationModelPhaseType,
    status: IntegrationModelStatus,
    readiness: IntegrationModelReadiness,
    registryDependency: IntegrationModelRegistryDependency,
    registryEntryPoint: IntegrationModelRegistryEntryPoint,
    description:
      "Canonical architectural model transforming Integration Registry collections into deterministic domain, relationship, topology, and lifecycle model metadata.",
    metadataOnly: true as const,
    immutable: true as const,
  });

/** Exactly one declared phase dependency. */
export const IntegrationModelDependencies = Object.freeze([
  Object.freeze({
    phaseId: IntegrationModelRegistryDependency,
    entryPoint: IntegrationModelRegistryEntryPoint,
    relationship: "SoleUpstreamRegistry" as const,
    metadataOnly: true as const,
    immutable: true as const,
  }),
] as const);
