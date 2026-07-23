/**
 * EIL-2:3 — Integration Connector Model Identity.
 *
 * Canonical immutable identity for the Integration Connector Model.
 * Declares exactly one upstream phase dependency: EIL-2:2 Integration Connector Registry.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by EIL-2:3.
 */

import type { IntegrationConnectorModelIdentityDescriptor } from "./integrationConnectorModelTypes.ts";

/** Canonical phase ID. */
export const IntegrationConnectorModelPhaseId = "EIL-2:3" as const;

/** Canonical model ID. */
export const IntegrationConnectorModelCanonicalId =
  "EIL-2:3/IntegrationConnectorModel" as const;

/** Human-readable model name. */
export const IntegrationConnectorModelName =
  "Integration Connector Model" as const;

/** Semantic version. */
export const IntegrationConnectorModelVersion = "1.0.0" as const;

/** Canonical namespace. */
export const IntegrationConnectorModelNamespace =
  "nexora.eil.integration-connector.model" as const;

/** Layer. */
export const IntegrationConnectorModelLayer = "EIL" as const;

/** Platform. */
export const IntegrationConnectorModelPlatformId = "EIL-2" as const;

/** Phase type. */
export const IntegrationConnectorModelPhaseType = "Model" as const;

/** Model status. */
export const IntegrationConnectorModelStatus = "Model" as const;

/** Immediate next-phase readiness. */
export const IntegrationConnectorModelReadiness =
  "ReadyForValidation" as const;

/** Sole upstream Registry dependency. */
export const IntegrationConnectorModelRegistryDependency =
  "EIL-2:2/IntegrationConnectorRegistry" as const;

/** Sole Registry aggregate entry point. */
export const IntegrationConnectorModelRegistryEntryPoint =
  "integrationConnectorRegistry.ts" as const;

/**
 * Immutable identity object for EIL-2:3 Integration Connector Model.
 * Dependency list contains exactly one phase dependency.
 */
export const IntegrationConnectorModelIdentity: IntegrationConnectorModelIdentityDescriptor =
  Object.freeze({
    phaseId: IntegrationConnectorModelPhaseId,
    canonicalId: IntegrationConnectorModelCanonicalId,
    name: IntegrationConnectorModelName,
    version: IntegrationConnectorModelVersion,
    namespace: IntegrationConnectorModelNamespace,
    layer: IntegrationConnectorModelLayer,
    platform: IntegrationConnectorModelPlatformId,
    phaseType: IntegrationConnectorModelPhaseType,
    status: IntegrationConnectorModelStatus,
    readiness: IntegrationConnectorModelReadiness,
    registryDependency: IntegrationConnectorModelRegistryDependency,
    registryEntryPoint: IntegrationConnectorModelRegistryEntryPoint,
    description:
      "Canonical architectural model transforming Integration Connector Registry collections into deterministic domain, relationship, endpoint, and protocol model metadata.",
    metadataOnly: true as const,
    immutable: true as const,
  });

/** Exactly one declared phase dependency. */
export const IntegrationConnectorModelDependencies = Object.freeze([
  Object.freeze({
    phaseId: IntegrationConnectorModelRegistryDependency,
    entryPoint: IntegrationConnectorModelRegistryEntryPoint,
    relationship: "SoleUpstreamRegistry" as const,
    metadataOnly: true as const,
    immutable: true as const,
  }),
] as const);
