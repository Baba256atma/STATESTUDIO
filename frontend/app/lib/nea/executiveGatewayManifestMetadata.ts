/**
 * NEA-1:5 — Executive Gateway Manifest Metadata.
 *
 * Immutable manifest metadata envelope.
 * Counts are derived exclusively from canonical inventory collections.
 *
 * Ownership: owned exclusively by NEA-1:5.
 */

import { ExecutiveGatewayManifestInventoryCatalog } from "./executiveGatewayManifestInventory.ts";
import {
  ExecutiveGatewayManifestBoundaries,
  ExecutiveGatewayManifestOwnership,
} from "./executiveGatewayManifestOwnership.ts";
import { ExecutiveGatewayManifestReadinessDeclaration } from "./executiveGatewayManifestReadiness.ts";
import {
  ExecutiveGatewayValidationId,
  ExecutiveGatewayValidationVersion,
} from "./executiveGatewayValidation.ts";

/** Canonical immutable manifest metadata. */
export const ExecutiveGatewayManifestMetadata = Object.freeze({
  metadataId: "NEA-1:5/ExecutiveGatewayManifestMetadata",
  sourcePhase: "NEA-1:5" as const,
  manifestVersion: "1.0.0" as const,
  generatedArchitectureVersion: "NEA-1.0.0" as const,
  upstreamValidationId: ExecutiveGatewayValidationId,
  upstreamValidationVersion: ExecutiveGatewayValidationVersion,
  upstreamPhaseReferences:
    ExecutiveGatewayManifestInventoryCatalog.phaseReferences,
  inventoryStatus: "DerivedFromCanonicalCollections" as const,
  readinessStatus: ExecutiveGatewayManifestReadinessDeclaration.readiness,
  inventory: ExecutiveGatewayManifestInventoryCatalog,
  phaseReferenceCount:
    ExecutiveGatewayManifestInventoryCatalog.phaseReferenceCount,
  inventoryEntryCount:
    ExecutiveGatewayManifestInventoryCatalog.inventoryEntryCount,
  totalArchitectureCount:
    ExecutiveGatewayManifestInventoryCatalog.totalArchitectureCount,
  ownershipCount: ExecutiveGatewayManifestOwnership.ownsCount,
  nonOwnershipCount: ExecutiveGatewayManifestOwnership.doesNotOwnCount,
  prohibitedSurfaceCount:
    ExecutiveGatewayManifestBoundaries.prohibitedSurfaceCount,
  countsHardcoded: false as const,
  countsReconstructed: false as const,
  duplicatesUpstreamCollections: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
