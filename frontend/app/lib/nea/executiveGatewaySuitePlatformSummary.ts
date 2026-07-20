/**
 * NEA-8:6 — Executive Gateway Suite Platform Summary.
 *
 * Immutable summary helpers for Platform consumers.
 * Counts are derived exclusively from canonical Manifest and Platform collections.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by NEA-8:6.
 */

import { ExecutiveGatewaySuiteManifestId } from "./executiveGatewaySuiteManifest.ts";
import { ExecutiveGatewaySuitePlatformMetadata } from "./executiveGatewaySuitePlatformMetadata.ts";
import { ExecutiveGatewaySuitePlatformNamespaceObject } from "./executiveGatewaySuitePlatformNamespace.ts";
import {
  ExecutiveGatewaySuitePlatformBoundaries,
  ExecutiveGatewaySuitePlatformOwnership,
} from "./executiveGatewaySuitePlatformOwnership.ts";
import { ExecutiveGatewaySuitePlatformReadinessDeclaration } from "./executiveGatewaySuitePlatformReadiness.ts";
import type { ExecutiveGatewaySuitePlatformSummary } from "./executiveGatewaySuitePlatformTypes.ts";

/** Platform identity constants used by summary composition. */
export const EXECUTIVE_GATEWAY_SUITE_PLATFORM_SUMMARY_IDENTITY = Object.freeze({
  platformId: "NEA-8:6/ExecutiveGatewaySuitePlatform" as const,
  name: "Executive Gateway Suite Platform" as const,
  version: "1.0.0" as const,
  namespace: "nexora.nea.executive-gateway-suite.platform" as const,
  publicExportCount: 8 as const,
  sectionCount: 9 as const,
});

/**
 * Build deterministic frozen Platform summary.
 * Derived exclusively from canonical Platform and Manifest collections.
 */
export function buildExecutiveGatewaySuitePlatformSummary(): ExecutiveGatewaySuitePlatformSummary {
  const identity = EXECUTIVE_GATEWAY_SUITE_PLATFORM_SUMMARY_IDENTITY;
  const meta = ExecutiveGatewaySuitePlatformMetadata;
  const ns = ExecutiveGatewaySuitePlatformNamespaceObject;
  return Object.freeze({
    platformId: identity.platformId,
    version: identity.version,
    name: identity.name,
    namespace: identity.namespace,
    layer: "NEA" as const,
    phase: "NEA-8:6" as const,
    status: "Platform" as const,
    readiness: ExecutiveGatewaySuitePlatformReadinessDeclaration.readiness,
    architectureVersion: meta.architectureVersion,
    compositionMode: meta.compositionMode,
    canonicalReferenceMode: meta.canonicalReferenceMode,
    runtimeBehavior: meta.runtimeBehavior,
    manifestId: ExecutiveGatewaySuiteManifestId,
    suiteName: "Executive Gateway Suite" as const,
    composedPhaseCount: ns.composedPhaseCount,
    namespaceSectionCount: ns.sectionCount,
    suiteComponentCount: ns.suiteComponentCount,
    phaseReferenceCount: meta.phaseReferenceCount,
    inventoryEntryCount: meta.inventoryEntryCount,
    totalArchitectureCount: meta.totalArchitectureCount,
    publicApiInventoryTotal: meta.publicApiInventoryTotal,
    ownershipCount: ExecutiveGatewaySuitePlatformOwnership.ownsCount,
    nonOwnershipCount: ExecutiveGatewaySuitePlatformOwnership.doesNotOwnCount,
    prohibitedSurfaceCount:
      ExecutiveGatewaySuitePlatformBoundaries.prohibitedSurfaceCount,
    publicExportCount: identity.publicExportCount,
    sectionCount: identity.sectionCount,
    nextPhase: ExecutiveGatewaySuitePlatformReadinessDeclaration.nextPhase,
    architectureStatus:
      ExecutiveGatewaySuitePlatformReadinessDeclaration.architectureStatus,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
}

/** Frozen summary catalog for composition consumers. */
export const ExecutiveGatewaySuitePlatformSummaryCatalog = Object.freeze({
  catalogId: "NEA-8:6/PlatformSummaryCatalog",
  sourcePhase: "NEA-8:6" as const,
  architectureSummary: Object.freeze({
    architectureStatus:
      ExecutiveGatewaySuitePlatformReadinessDeclaration.architectureStatus,
    architectureVersion:
      ExecutiveGatewaySuitePlatformMetadata.architectureVersion,
    compositionMode: ExecutiveGatewaySuitePlatformMetadata.compositionMode,
    canonicalReferenceMode:
      ExecutiveGatewaySuitePlatformMetadata.canonicalReferenceMode,
    runtimeBehavior: ExecutiveGatewaySuitePlatformMetadata.runtimeBehavior,
  }),
  namespaceSummary: Object.freeze({
    sectionCount: ExecutiveGatewaySuitePlatformNamespaceObject.sectionCount,
    composedPhaseCount:
      ExecutiveGatewaySuitePlatformNamespaceObject.composedPhaseCount,
    sectionOrder: ExecutiveGatewaySuitePlatformNamespaceObject.sectionOrder,
    suiteComponentCount:
      ExecutiveGatewaySuitePlatformNamespaceObject.suiteComponentCount,
  }),
  inventorySummary: Object.freeze({
    phaseReferenceCount:
      ExecutiveGatewaySuitePlatformMetadata.phaseReferenceCount,
    inventoryEntryCount:
      ExecutiveGatewaySuitePlatformMetadata.inventoryEntryCount,
    totalArchitectureCount:
      ExecutiveGatewaySuitePlatformMetadata.totalArchitectureCount,
    publicApiInventoryTotal:
      ExecutiveGatewaySuitePlatformMetadata.publicApiInventoryTotal,
  }),
  dependencySummary: Object.freeze({
    dependencyChain: ExecutiveGatewaySuitePlatformMetadata.dependencyChain,
    upstreamManifestId:
      ExecutiveGatewaySuitePlatformMetadata.upstreamManifestId,
  }),
  consumerSummary: Object.freeze({
    consumerEntryPoint:
      ExecutiveGatewaySuitePlatformMetadata.consumerEntryPoint,
    consumerReady:
      ExecutiveGatewaySuitePlatformReadinessDeclaration.consumerReady,
    readiness: ExecutiveGatewaySuitePlatformReadinessDeclaration.readiness,
  }),
  buildSummary: buildExecutiveGatewaySuitePlatformSummary,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
