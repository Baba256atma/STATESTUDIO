/**
 * NEA-1:6 — Executive Gateway Platform Summary.
 *
 * Immutable summary helpers for Platform consumers.
 * Counts are derived exclusively from canonical upstream collections.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by NEA-1:6.
 */

import { ExecutiveGatewayManifestId } from "./executiveGatewayManifest.ts";
import { ExecutiveGatewayPlatformMetadata } from "./executiveGatewayPlatformMetadata.ts";
import { ExecutiveGatewayPlatformNamespaceObject } from "./executiveGatewayPlatformNamespace.ts";
import {
  ExecutiveGatewayPlatformBoundaries,
  ExecutiveGatewayPlatformOwnership,
} from "./executiveGatewayPlatformOwnership.ts";
import { ExecutiveGatewayPlatformReadinessDeclaration } from "./executiveGatewayPlatformReadiness.ts";
import type { ExecutiveGatewayPlatformSummary } from "./executiveGatewayPlatformTypes.ts";

/** Platform identity constants used by summary composition. */
export const EXECUTIVE_GATEWAY_PLATFORM_SUMMARY_IDENTITY = Object.freeze({
  platformId: "NEA-1:6/ExecutiveGatewayPlatform" as const,
  name: "Executive Gateway Platform" as const,
  version: "1.0.0" as const,
  namespace: "nexora.nea.executive-gateway.platform" as const,
  publicExportCount: 8 as const,
  sectionCount: 9 as const,
});

/**
 * Build deterministic frozen Platform summary.
 * Derived exclusively from canonical Platform collections.
 */
export function buildExecutiveGatewayPlatformSummary(): ExecutiveGatewayPlatformSummary {
  const identity = EXECUTIVE_GATEWAY_PLATFORM_SUMMARY_IDENTITY;
  const meta = ExecutiveGatewayPlatformMetadata;
  const ns = ExecutiveGatewayPlatformNamespaceObject;
  return Object.freeze({
    platformId: identity.platformId,
    version: identity.version,
    name: identity.name,
    namespace: identity.namespace,
    layer: "NEA" as const,
    phase: "NEA-1:6" as const,
    status: "Platform" as const,
    readiness: ExecutiveGatewayPlatformReadinessDeclaration.readiness,
    manifestId: ExecutiveGatewayManifestId,
    composedPhaseCount: ns.composedPhaseCount,
    namespaceSectionCount: ns.sectionCount,
    inventoryEntryCount: meta.inventoryEntryCount,
    totalArchitectureCount: meta.totalArchitectureCount,
    ownershipCount: ExecutiveGatewayPlatformOwnership.ownsCount,
    nonOwnershipCount: ExecutiveGatewayPlatformOwnership.doesNotOwnCount,
    prohibitedSurfaceCount:
      ExecutiveGatewayPlatformBoundaries.prohibitedSurfaceCount,
    publicExportCount: identity.publicExportCount,
    sectionCount: identity.sectionCount,
    nextPhase: ExecutiveGatewayPlatformReadinessDeclaration.nextPhase,
    architectureStatus:
      ExecutiveGatewayPlatformReadinessDeclaration.architectureStatus,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
}

/** Frozen summary catalog for composition consumers. */
export const ExecutiveGatewayPlatformSummaryCatalog = Object.freeze({
  catalogId: "NEA-1:6/PlatformSummaryCatalog",
  sourcePhase: "NEA-1:6" as const,
  buildSummary: buildExecutiveGatewayPlatformSummary,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
