/**
 * EIL-3:3 — Integration Routing Model Identity.
 *
 * Canonical immutable identity for the Integration Routing Model.
 * Declares exactly one upstream phase dependency: EIL-3:2 Integration Routing Registry.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by EIL-3:3.
 */

import type { RoutingModelIdentity } from "./integrationRoutingModelTypes.ts";

/** Canonical phase ID. */
export const IntegrationRoutingModelPhaseId = "EIL-3:3" as const;

/** Canonical model ID. */
export const IntegrationRoutingModelCanonicalId =
  "EIL-3:3/IntegrationRoutingModel" as const;

/** Human-readable model name. */
export const IntegrationRoutingModelName =
  "Integration Routing Model" as const;

/** Semantic version. */
export const IntegrationRoutingModelVersion = "1.0.0" as const;

/** Canonical namespace. */
export const IntegrationRoutingModelNamespace =
  "nexora.eil.integration-routing.model" as const;

/** Layer. */
export const IntegrationRoutingModelLayer = "EIL" as const;

/** Platform. */
export const IntegrationRoutingModelPlatformId = "EIL-3" as const;

/** Phase type. */
export const IntegrationRoutingModelPhaseType = "Model" as const;

/** Model status. */
export const IntegrationRoutingModelStatusValue = "Model" as const;

/** Immediate next-phase readiness. */
export const IntegrationRoutingModelReadinessValue =
  "ReadyForValidation" as const;

/** Sole upstream Registry dependency. */
export const IntegrationRoutingModelRegistryDependency =
  "EIL-3:2/IntegrationRoutingRegistry" as const;

/** Sole Registry aggregate entry point. */
export const IntegrationRoutingModelRegistryEntryPoint =
  "integrationRoutingRegistry.ts" as const;

/**
 * Immutable identity object for EIL-3:3 Integration Routing Model.
 * Dependency list contains exactly one phase dependency.
 */
export const IntegrationRoutingModelIdentity: RoutingModelIdentity =
  Object.freeze({
    phaseId: IntegrationRoutingModelPhaseId,
    canonicalId: IntegrationRoutingModelCanonicalId,
    name: IntegrationRoutingModelName,
    version: IntegrationRoutingModelVersion,
    namespace: IntegrationRoutingModelNamespace,
    layer: IntegrationRoutingModelLayer,
    platform: IntegrationRoutingModelPlatformId,
    phaseType: IntegrationRoutingModelPhaseType,
    status: IntegrationRoutingModelStatusValue,
    readiness: IntegrationRoutingModelReadinessValue,
    registryDependency: IntegrationRoutingModelRegistryDependency,
    registryEntryPoint: IntegrationRoutingModelRegistryEntryPoint,
    description:
      "Canonical architectural model transforming Integration Routing Registry collections into deterministic domain, relationship, topology, and lifecycle model metadata.",
    metadataOnly: true as const,
    immutable: true as const,
  });

/** Exactly one declared phase dependency. */
export const IntegrationRoutingModelDependencies = Object.freeze([
  Object.freeze({
    phaseId: IntegrationRoutingModelRegistryDependency,
    entryPoint: IntegrationRoutingModelRegistryEntryPoint,
    relationship: "SoleUpstreamRegistry" as const,
    metadataOnly: true as const,
    immutable: true as const,
  }),
] as const);
