/**
 * EIL-3:2 — Integration Routing Registry Identity.
 *
 * Canonical immutable identity for the Integration Routing Registry.
 * Declares exactly one upstream phase dependency: EIL-3:1 Integration Routing Foundation.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by EIL-3:2.
 */

import type { RoutingRegistryIdentityDescriptor } from "./integrationRoutingRegistryTypes.ts";

/** Canonical phase ID. */
export const IntegrationRoutingRegistryPhaseId = "EIL-3:2" as const;

/** Canonical registry ID. */
export const IntegrationRoutingRegistryCanonicalId =
  "EIL-3:2/IntegrationRoutingRegistry" as const;

/** Human-readable registry name. */
export const IntegrationRoutingRegistryName =
  "Integration Routing Registry" as const;

/** Semantic version. */
export const IntegrationRoutingRegistryVersion = "1.0.0" as const;

/** Canonical namespace. */
export const IntegrationRoutingRegistryNamespace =
  "nexora.eil.integration-routing.registry" as const;

/** Layer. */
export const IntegrationRoutingRegistryLayer = "EIL" as const;

/** Platform. */
export const IntegrationRoutingRegistryPlatformId = "EIL-3" as const;

/** Phase type. */
export const IntegrationRoutingRegistryPhaseType = "Registry" as const;

/** Registry status. */
export const IntegrationRoutingRegistryStatusValue = "Registry" as const;

/** Immediate next-phase readiness. */
export const IntegrationRoutingRegistryReadinessValue =
  "ReadyForModel" as const;

/** Sole upstream Foundation dependency. */
export const IntegrationRoutingRegistryFoundationDependency =
  "EIL-3:1/IntegrationRoutingFoundation" as const;

/** Sole Foundation aggregate entry point. */
export const IntegrationRoutingRegistryFoundationEntryPoint =
  "integrationRoutingFoundation.ts" as const;

/**
 * Immutable identity object for EIL-3:2 Integration Routing Registry.
 * Dependency list contains exactly one phase dependency.
 */
export const IntegrationRoutingRegistryIdentity: RoutingRegistryIdentityDescriptor =
  Object.freeze({
    phaseId: IntegrationRoutingRegistryPhaseId,
    canonicalId: IntegrationRoutingRegistryCanonicalId,
    name: IntegrationRoutingRegistryName,
    version: IntegrationRoutingRegistryVersion,
    namespace: IntegrationRoutingRegistryNamespace,
    layer: IntegrationRoutingRegistryLayer,
    platform: IntegrationRoutingRegistryPlatformId,
    phaseType: IntegrationRoutingRegistryPhaseType,
    status: IntegrationRoutingRegistryStatusValue,
    readiness: IntegrationRoutingRegistryReadinessValue,
    foundationDependency: IntegrationRoutingRegistryFoundationDependency,
    foundationEntryPoint: IntegrationRoutingRegistryFoundationEntryPoint,
    description:
      "Canonical immutable registry converting Integration Routing Foundation categories, contracts, capabilities, responsibilities, and lifecycle declarations into deterministic lookup collections.",
    metadataOnly: true as const,
    immutable: true as const,
  });

/** Exactly one declared phase dependency. */
export const IntegrationRoutingRegistryDependencies = Object.freeze([
  Object.freeze({
    phaseId: IntegrationRoutingRegistryFoundationDependency,
    entryPoint: IntegrationRoutingRegistryFoundationEntryPoint,
    relationship: "SoleUpstreamFoundation" as const,
    metadataOnly: true as const,
    immutable: true as const,
  }),
] as const);
