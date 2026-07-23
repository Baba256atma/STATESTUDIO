/**
 * EIL-4:2 — Integration Orchestration Registry Identity.
 *
 * Canonical immutable identity for the Integration Orchestration Registry.
 * Declares exactly one upstream phase dependency: EIL-4:1 Integration Orchestration Foundation.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by EIL-4:2.
 */

import type { OrchestrationRegistryIdentity } from "./integrationOrchestrationRegistryTypes.ts";

/** Canonical phase ID. */
export const IntegrationOrchestrationRegistryPhaseId = "EIL-4:2" as const;

/** Canonical registry ID. */
export const IntegrationOrchestrationRegistryCanonicalId =
  "EIL-4:2/IntegrationOrchestrationRegistry" as const;

/** Human-readable registry name. */
export const IntegrationOrchestrationRegistryName =
  "Integration Orchestration Registry" as const;

/** Semantic version. */
export const IntegrationOrchestrationRegistryVersion = "1.0.0" as const;

/** Canonical namespace. */
export const IntegrationOrchestrationRegistryNamespace =
  "nexora.eil.integration-orchestration.registry" as const;

/** Layer. */
export const IntegrationOrchestrationRegistryLayer = "EIL" as const;

/** Platform. */
export const IntegrationOrchestrationRegistryPlatformId = "EIL-4" as const;

/** Phase type. */
export const IntegrationOrchestrationRegistryPhaseType = "Registry" as const;

/** Registry status. */
export const IntegrationOrchestrationRegistryStatusValue = "Registry" as const;

/** Immediate next-phase readiness. */
export const IntegrationOrchestrationRegistryReadinessValue =
  "ReadyForModel" as const;

/** Sole upstream Foundation dependency. */
export const IntegrationOrchestrationRegistryFoundationDependency =
  "EIL-4:1/IntegrationOrchestrationFoundation" as const;

/** Sole Foundation aggregate entry point. */
export const IntegrationOrchestrationRegistryFoundationEntryPoint =
  "integrationOrchestrationFoundation.ts" as const;

/**
 * Immutable identity object for EIL-4:2 Integration Orchestration Registry.
 * Dependency list contains exactly one phase dependency.
 */
export const IntegrationOrchestrationRegistryIdentity: OrchestrationRegistryIdentity =
  Object.freeze({
    phaseId: IntegrationOrchestrationRegistryPhaseId,
    canonicalId: IntegrationOrchestrationRegistryCanonicalId,
    name: IntegrationOrchestrationRegistryName,
    version: IntegrationOrchestrationRegistryVersion,
    namespace: IntegrationOrchestrationRegistryNamespace,
    layer: IntegrationOrchestrationRegistryLayer,
    platform: IntegrationOrchestrationRegistryPlatformId,
    phaseType: IntegrationOrchestrationRegistryPhaseType,
    status: IntegrationOrchestrationRegistryStatusValue,
    readiness: IntegrationOrchestrationRegistryReadinessValue,
    foundationDependency:
      IntegrationOrchestrationRegistryFoundationDependency,
    foundationEntryPoint:
      IntegrationOrchestrationRegistryFoundationEntryPoint,
    description:
      "Canonical immutable registry converting Integration Orchestration Foundation categories, contracts, capabilities, responsibilities, and lifecycle declarations into deterministic lookup collections.",
    metadataOnly: true as const,
    immutable: true as const,
  });

/** Exactly one declared phase dependency. */
export const IntegrationOrchestrationRegistryDependencies = Object.freeze([
  Object.freeze({
    phaseId: IntegrationOrchestrationRegistryFoundationDependency,
    entryPoint: IntegrationOrchestrationRegistryFoundationEntryPoint,
    relationship: "SoleUpstreamFoundation" as const,
    metadataOnly: true as const,
    immutable: true as const,
  }),
] as const);
