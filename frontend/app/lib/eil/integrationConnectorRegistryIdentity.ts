/**
 * EIL-2:2 — Integration Connector Registry Identity.
 *
 * Canonical immutable identity for the Integration Connector Registry.
 * Declares exactly one upstream phase dependency: EIL-2:1 Integration Connector Foundation.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by EIL-2:2.
 */

import type { IntegrationConnectorRegistryIdentityDescriptor } from "./integrationConnectorRegistryTypes.ts";

/** Canonical phase ID. */
export const IntegrationConnectorRegistryPhaseId = "EIL-2:2" as const;

/** Canonical registry ID. */
export const IntegrationConnectorRegistryCanonicalId =
  "EIL-2:2/IntegrationConnectorRegistry" as const;

/** Human-readable registry name. */
export const IntegrationConnectorRegistryName =
  "Integration Connector Registry" as const;

/** Semantic version. */
export const IntegrationConnectorRegistryVersion = "1.0.0" as const;

/** Canonical namespace. */
export const IntegrationConnectorRegistryNamespace =
  "nexora.eil.integration-connector.registry" as const;

/** Layer. */
export const IntegrationConnectorRegistryLayer = "EIL" as const;

/** Platform. */
export const IntegrationConnectorRegistryPlatformId = "EIL-2" as const;

/** Phase type. */
export const IntegrationConnectorRegistryPhaseType = "Registry" as const;

/** Registry status. */
export const IntegrationConnectorRegistryStatus = "Registry" as const;

/** Immediate next-phase readiness. */
export const IntegrationConnectorRegistryReadiness =
  "ReadyForModel" as const;

/** Sole upstream Foundation dependency. */
export const IntegrationConnectorRegistryFoundationDependency =
  "EIL-2:1/IntegrationConnectorFoundation" as const;

/** Sole Foundation aggregate entry point. */
export const IntegrationConnectorRegistryFoundationEntryPoint =
  "integrationConnectorFoundation.ts" as const;

/**
 * Immutable identity object for EIL-2:2 Integration Connector Registry.
 * Dependency list contains exactly one phase dependency.
 */
export const IntegrationConnectorRegistryIdentity: IntegrationConnectorRegistryIdentityDescriptor =
  Object.freeze({
    phaseId: IntegrationConnectorRegistryPhaseId,
    canonicalId: IntegrationConnectorRegistryCanonicalId,
    name: IntegrationConnectorRegistryName,
    version: IntegrationConnectorRegistryVersion,
    namespace: IntegrationConnectorRegistryNamespace,
    layer: IntegrationConnectorRegistryLayer,
    platform: IntegrationConnectorRegistryPlatformId,
    phaseType: IntegrationConnectorRegistryPhaseType,
    status: IntegrationConnectorRegistryStatus,
    readiness: IntegrationConnectorRegistryReadiness,
    foundationDependency:
      IntegrationConnectorRegistryFoundationDependency,
    foundationEntryPoint:
      IntegrationConnectorRegistryFoundationEntryPoint,
    description:
      "Canonical immutable registry converting Integration Connector Foundation categories, contracts, capabilities, responsibilities, and lifecycle declarations into deterministic lookup collections.",
    metadataOnly: true as const,
    immutable: true as const,
  });

/** Exactly one declared phase dependency. */
export const IntegrationConnectorRegistryDependencies = Object.freeze([
  Object.freeze({
    phaseId: IntegrationConnectorRegistryFoundationDependency,
    entryPoint: IntegrationConnectorRegistryFoundationEntryPoint,
    relationship: "SoleUpstreamFoundation" as const,
    metadataOnly: true as const,
    immutable: true as const,
  }),
] as const);
