/**
 * NEA-4:5 — Security Gateway Manifest Metadata.
 *
 * Immutable manifest metadata envelope.
 * Counts are derived exclusively from canonical inventory collections.
 *
 * Ownership: owned exclusively by NEA-4:5.
 */

import { SecurityGatewayManifestInventoryCatalog } from "./securityGatewayManifestInventory.ts";
import {
  SecurityGatewayManifestBoundaries,
  SecurityGatewayManifestOwnership,
} from "./securityGatewayManifestOwnership.ts";
import { SecurityGatewayManifestReadinessDeclaration } from "./securityGatewayManifestReadiness.ts";
import {
  SecurityGatewayValidationId,
  SecurityGatewayValidationVersion,
} from "./securityGatewayValidation.ts";

/** Canonical immutable manifest metadata. */
export const SecurityGatewayManifestMetadata = Object.freeze({
  metadataId: "NEA-4:5/SecurityGatewayManifestMetadata",
  sourcePhase: "NEA-4:5" as const,
  architectureVersion: "NEA-4.0.0" as const,
  manifestVersion: "1.0.0" as const,
  namespace: "nexora.nea.security-gateway.manifest" as const,
  phase: "NEA-4:5" as const,
  status: "Manifest" as const,
  readiness: SecurityGatewayManifestReadinessDeclaration.readiness,
  compositionMode: "CanonicalReferenceOnly" as const,
  upstreamValidationId: SecurityGatewayValidationId,
  upstreamValidationVersion: SecurityGatewayValidationVersion,
  upstreamPhaseReferences:
    SecurityGatewayManifestInventoryCatalog.phaseReferences,
  inventoryStatus: "DerivedFromCanonicalCollections" as const,
  readinessStatus: SecurityGatewayManifestReadinessDeclaration.readiness,
  inventory: SecurityGatewayManifestInventoryCatalog,
  phaseReferenceCount:
    SecurityGatewayManifestInventoryCatalog.phaseReferenceCount,
  inventoryEntryCount:
    SecurityGatewayManifestInventoryCatalog.inventoryEntryCount,
  totalArchitectureCount:
    SecurityGatewayManifestInventoryCatalog.totalArchitectureCount,
  ownershipCount: SecurityGatewayManifestOwnership.ownsCount,
  nonOwnershipCount: SecurityGatewayManifestOwnership.doesNotOwnCount,
  prohibitedSurfaceCount:
    SecurityGatewayManifestBoundaries.prohibitedSurfaceCount,
  countsHardcoded: false as const,
  countsReconstructed: false as const,
  duplicatesUpstreamCollections: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
