/**
 * NEA-1:5 — Executive Gateway Manifest Summary.
 *
 * Immutable summary helpers for Manifest consumers.
 * Counts are derived exclusively from canonical metadata collections.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by NEA-1:5.
 */

import { ExecutiveGatewayManifestInventoryCatalog } from "./executiveGatewayManifestInventory.ts";
import {
  ExecutiveGatewayManifestBoundaries,
  ExecutiveGatewayManifestOwnership,
} from "./executiveGatewayManifestOwnership.ts";
import { ExecutiveGatewayManifestReadinessDeclaration } from "./executiveGatewayManifestReadiness.ts";
import type { ExecutiveGatewayManifestSummary } from "./executiveGatewayManifestTypes.ts";
import { ExecutiveGatewayValidationId } from "./executiveGatewayValidation.ts";

/** Manifest identity constants used by summary composition. */
export const EXECUTIVE_GATEWAY_MANIFEST_SUMMARY_IDENTITY = Object.freeze({
  manifestId: "NEA-1:5/ExecutiveGatewayManifest" as const,
  name: "Executive Gateway Manifest" as const,
  version: "1.0.0" as const,
  namespace: "nexora.nea.executive-gateway.manifest" as const,
  publicExportCount: 8 as const,
  sectionCount: 9 as const,
});

/**
 * Build deterministic frozen Manifest summary.
 * Derived exclusively from canonical Manifest collections.
 */
export function buildExecutiveGatewayManifestSummary(): ExecutiveGatewayManifestSummary {
  const identity = EXECUTIVE_GATEWAY_MANIFEST_SUMMARY_IDENTITY;
  const inventory = ExecutiveGatewayManifestInventoryCatalog;
  return Object.freeze({
    manifestId: identity.manifestId,
    version: identity.version,
    name: identity.name,
    namespace: identity.namespace,
    layer: "NEA" as const,
    phase: "NEA-1:5" as const,
    status: "Manifest" as const,
    readiness: ExecutiveGatewayManifestReadinessDeclaration.readiness,
    validationId: ExecutiveGatewayValidationId,
    phaseReferenceCount: inventory.phaseReferenceCount,
    inventoryEntryCount: inventory.inventoryEntryCount,
    totalArchitectureCount: inventory.totalArchitectureCount,
    ownershipCount: ExecutiveGatewayManifestOwnership.ownsCount,
    nonOwnershipCount: ExecutiveGatewayManifestOwnership.doesNotOwnCount,
    prohibitedSurfaceCount:
      ExecutiveGatewayManifestBoundaries.prohibitedSurfaceCount,
    publicExportCount: identity.publicExportCount,
    sectionCount: identity.sectionCount,
    nextPhase: ExecutiveGatewayManifestReadinessDeclaration.nextPhase,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
}

/** Frozen summary snapshot for catalog consumers. */
export const ExecutiveGatewayManifestSummaryCatalog = Object.freeze({
  catalogId: "NEA-1:5/ManifestSummaryCatalog",
  sourcePhase: "NEA-1:5" as const,
  buildSummary: buildExecutiveGatewayManifestSummary,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
