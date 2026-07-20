/**
 * NEA-5:6 — Gateway Routing Platform Summary.
 *
 * Immutable summary helpers for Platform consumers.
 * Counts are derived exclusively from canonical Manifest and Platform collections.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by NEA-5:6.
 */

import { GatewayRoutingManifestId } from "./gatewayRoutingManifest.ts";
import { GatewayRoutingPlatformMetadata } from "./gatewayRoutingPlatformMetadata.ts";
import { GatewayRoutingPlatformNamespaceObject } from "./gatewayRoutingPlatformNamespace.ts";
import {
  GatewayRoutingPlatformBoundaries,
  GatewayRoutingPlatformOwnership,
} from "./gatewayRoutingPlatformOwnership.ts";
import { GatewayRoutingPlatformReadinessDeclaration } from "./gatewayRoutingPlatformReadiness.ts";
import type { GatewayRoutingPlatformSummary } from "./gatewayRoutingPlatformTypes.ts";

/** Platform identity constants used by summary composition. */
export const GATEWAY_ROUTING_PLATFORM_SUMMARY_IDENTITY = Object.freeze({
  platformId: "NEA-5:6/GatewayRoutingPlatform" as const,
  name: "Gateway Routing Platform" as const,
  version: "1.0.0" as const,
  namespace: "nexora.nea.gateway-routing.platform" as const,
  publicExportCount: 8 as const,
  sectionCount: 9 as const,
});

/**
 * Build deterministic frozen Platform summary.
 * Derived exclusively from canonical Platform and Manifest collections.
 */
export function buildGatewayRoutingPlatformSummary(): GatewayRoutingPlatformSummary {
  const identity = GATEWAY_ROUTING_PLATFORM_SUMMARY_IDENTITY;
  const meta = GatewayRoutingPlatformMetadata;
  const ns = GatewayRoutingPlatformNamespaceObject;
  return Object.freeze({
    platformId: identity.platformId,
    version: identity.version,
    name: identity.name,
    namespace: identity.namespace,
    layer: "NEA" as const,
    phase: "NEA-5:6" as const,
    status: "Platform" as const,
    readiness: GatewayRoutingPlatformReadinessDeclaration.readiness,
    manifestId: GatewayRoutingManifestId,
    composedPhaseCount: ns.composedPhaseCount,
    namespaceSectionCount: ns.sectionCount,
    phaseReferenceCount: meta.phaseReferenceCount,
    inventoryEntryCount: meta.inventoryEntryCount,
    totalArchitectureCount: meta.totalArchitectureCount,
    ownershipCount: GatewayRoutingPlatformOwnership.ownsCount,
    nonOwnershipCount: GatewayRoutingPlatformOwnership.doesNotOwnCount,
    prohibitedSurfaceCount:
      GatewayRoutingPlatformBoundaries.prohibitedSurfaceCount,
    publicExportCount: identity.publicExportCount,
    sectionCount: identity.sectionCount,
    nextPhase: GatewayRoutingPlatformReadinessDeclaration.nextPhase,
    architectureStatus:
      GatewayRoutingPlatformReadinessDeclaration.architectureStatus,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
}

/** Frozen summary catalog for composition consumers. */
export const GatewayRoutingPlatformSummaryCatalog = Object.freeze({
  catalogId: "NEA-5:6/PlatformSummaryCatalog",
  sourcePhase: "NEA-5:6" as const,
  buildSummary: buildGatewayRoutingPlatformSummary,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
