/**
 * NEA-5:5 — Gateway Routing Manifest Summary.
 *
 * Immutable summary helpers for Manifest consumers.
 * Counts are derived exclusively from canonical metadata collections.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by NEA-5:5.
 */

import { GatewayRoutingManifestInventoryCatalog } from "./gatewayRoutingManifestInventory.ts";
import {
  GatewayRoutingManifestBoundaries,
  GatewayRoutingManifestOwnership,
} from "./gatewayRoutingManifestOwnership.ts";
import { GatewayRoutingManifestReadinessDeclaration } from "./gatewayRoutingManifestReadiness.ts";
import type { GatewayRoutingManifestSummary } from "./gatewayRoutingManifestTypes.ts";
import { GatewayRoutingValidationId } from "./gatewayRoutingValidation.ts";

/** Manifest identity constants used by summary composition. */
export const GATEWAY_ROUTING_MANIFEST_SUMMARY_IDENTITY = Object.freeze({
  manifestId: "NEA-5:5/GatewayRoutingManifest" as const,
  name: "Gateway Routing Manifest" as const,
  version: "1.0.0" as const,
  namespace: "nexora.nea.gateway-routing.manifest" as const,
  publicExportCount: 8 as const,
  sectionCount: 9 as const,
});

/**
 * Build deterministic frozen Manifest summary.
 * Derived exclusively from canonical Manifest collections.
 */
export function buildGatewayRoutingManifestSummary(): GatewayRoutingManifestSummary {
  const identity = GATEWAY_ROUTING_MANIFEST_SUMMARY_IDENTITY;
  const inventory = GatewayRoutingManifestInventoryCatalog;
  return Object.freeze({
    manifestId: identity.manifestId,
    version: identity.version,
    name: identity.name,
    namespace: identity.namespace,
    layer: "NEA" as const,
    phase: "NEA-5:5" as const,
    status: "Manifest" as const,
    readiness: GatewayRoutingManifestReadinessDeclaration.readiness,
    validationId: GatewayRoutingValidationId,
    phaseReferenceCount: inventory.phaseReferenceCount,
    inventoryEntryCount: inventory.inventoryEntryCount,
    totalArchitectureCount: inventory.totalArchitectureCount,
    ownershipCount: GatewayRoutingManifestOwnership.ownsCount,
    nonOwnershipCount: GatewayRoutingManifestOwnership.doesNotOwnCount,
    prohibitedSurfaceCount:
      GatewayRoutingManifestBoundaries.prohibitedSurfaceCount,
    publicExportCount: identity.publicExportCount,
    sectionCount: identity.sectionCount,
    nextPhase: GatewayRoutingManifestReadinessDeclaration.nextPhase,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
}

/** Frozen summary snapshot for catalog consumers. */
export const GatewayRoutingManifestSummaryCatalog = Object.freeze({
  catalogId: "NEA-5:5/ManifestSummaryCatalog",
  sourcePhase: "NEA-5:5" as const,
  buildSummary: buildGatewayRoutingManifestSummary,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
