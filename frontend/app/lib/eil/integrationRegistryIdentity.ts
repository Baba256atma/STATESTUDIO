/**
 * EIL-1:2 — Integration Registry Identity.
 *
 * Canonical immutable identity for the Executive Integration Registry.
 * Declares exactly one upstream phase dependency: EIL-1:1 Integration Foundation.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by EIL-1:2.
 */

import type { IntegrationRegistryIdentityDescriptor } from "./integrationRegistryTypes.ts";

/** Canonical phase ID. */
export const IntegrationRegistryPhaseId = "EIL-1:2" as const;

/** Canonical registry ID. */
export const IntegrationRegistryCanonicalId =
  "EIL-1:2/IntegrationRegistry" as const;

/** Human-readable registry name. */
export const IntegrationRegistryName = "Integration Registry" as const;

/** Semantic version. */
export const IntegrationRegistryVersion = "1.0.0" as const;

/** Canonical namespace. */
export const IntegrationRegistryNamespace =
  "nexora.eil.integration.registry" as const;

/** Layer. */
export const IntegrationRegistryLayer = "EIL" as const;

/** Platform. */
export const IntegrationRegistryPlatformId = "EIL-1" as const;

/** Phase type. */
export const IntegrationRegistryPhaseType = "Registry" as const;

/** Registry status. */
export const IntegrationRegistryStatus = "Registry" as const;

/** Immediate next-phase readiness. */
export const IntegrationRegistryReadiness = "ReadyForModel" as const;

/** Sole upstream Foundation dependency. */
export const IntegrationRegistryFoundationDependency =
  "EIL-1:1/IntegrationFoundation" as const;

/** Sole Foundation aggregate entry point. */
export const IntegrationRegistryFoundationEntryPoint =
  "integrationFoundation.ts" as const;

/**
 * Immutable identity object for EIL-1:2 Integration Registry.
 * Dependency list contains exactly one phase dependency.
 */
export const IntegrationRegistryIdentity: IntegrationRegistryIdentityDescriptor =
  Object.freeze({
    phaseId: IntegrationRegistryPhaseId,
    canonicalId: IntegrationRegistryCanonicalId,
    name: IntegrationRegistryName,
    version: IntegrationRegistryVersion,
    namespace: IntegrationRegistryNamespace,
    layer: IntegrationRegistryLayer,
    platform: IntegrationRegistryPlatformId,
    phaseType: IntegrationRegistryPhaseType,
    status: IntegrationRegistryStatus,
    readiness: IntegrationRegistryReadiness,
    foundationDependency: IntegrationRegistryFoundationDependency,
    foundationEntryPoint: IntegrationRegistryFoundationEntryPoint,
    description:
      "Canonical immutable registry converting Integration Foundation vocabularies, contracts, capabilities, responsibilities, and lifecycle declarations into deterministic lookup collections.",
    metadataOnly: true as const,
    immutable: true as const,
  });

/** Exactly one declared phase dependency. */
export const IntegrationRegistryDependencies = Object.freeze([
  Object.freeze({
    phaseId: IntegrationRegistryFoundationDependency,
    entryPoint: IntegrationRegistryFoundationEntryPoint,
    relationship: "SoleUpstreamFoundation" as const,
    metadataOnly: true as const,
    immutable: true as const,
  }),
] as const);
