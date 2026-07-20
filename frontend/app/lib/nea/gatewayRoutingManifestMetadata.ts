/**
 * NEA-5:5 — Gateway Routing Manifest Metadata.
 *
 * Immutable manifest metadata envelope.
 * Counts are derived exclusively from canonical inventory collections.
 *
 * Ownership: owned exclusively by NEA-5:5.
 */

import { GatewayRoutingManifestInventoryCatalog } from "./gatewayRoutingManifestInventory.ts";
import {
  GatewayRoutingManifestBoundaries,
  GatewayRoutingManifestOwnership,
} from "./gatewayRoutingManifestOwnership.ts";
import { GatewayRoutingManifestReadinessDeclaration } from "./gatewayRoutingManifestReadiness.ts";
import {
  GatewayRoutingValidationId,
  GatewayRoutingValidationVersion,
} from "./gatewayRoutingValidation.ts";

/** Canonical immutable manifest metadata. */
export const GatewayRoutingManifestMetadata = Object.freeze({
  metadataId: "NEA-5:5/GatewayRoutingManifestMetadata",
  sourcePhase: "NEA-5:5" as const,
  architectureVersion: "NEA-5.0.0" as const,
  manifestVersion: "1.0.0" as const,
  namespace: "nexora.nea.gateway-routing.manifest" as const,
  phase: "NEA-5:5" as const,
  status: "Manifest" as const,
  readiness: GatewayRoutingManifestReadinessDeclaration.readiness,
  compositionMode: "CanonicalReferenceOnly" as const,
  upstreamValidationId: GatewayRoutingValidationId,
  upstreamValidationVersion: GatewayRoutingValidationVersion,
  upstreamPhaseReferences:
    GatewayRoutingManifestInventoryCatalog.phaseReferences,
  inventoryStatus: "DerivedFromCanonicalCollections" as const,
  readinessStatus: GatewayRoutingManifestReadinessDeclaration.readiness,
  inventory: GatewayRoutingManifestInventoryCatalog,
  phaseReferenceCount:
    GatewayRoutingManifestInventoryCatalog.phaseReferenceCount,
  inventoryEntryCount:
    GatewayRoutingManifestInventoryCatalog.inventoryEntryCount,
  totalArchitectureCount:
    GatewayRoutingManifestInventoryCatalog.totalArchitectureCount,
  ownershipCount: GatewayRoutingManifestOwnership.ownsCount,
  nonOwnershipCount: GatewayRoutingManifestOwnership.doesNotOwnCount,
  prohibitedSurfaceCount:
    GatewayRoutingManifestBoundaries.prohibitedSurfaceCount,
  countsHardcoded: false as const,
  countsReconstructed: false as const,
  duplicatesUpstreamCollections: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
