/**
 * NEA-4:5 — Security Gateway Manifest Summary.
 *
 * Immutable summary helpers for Manifest consumers.
 * Counts are derived exclusively from canonical metadata collections.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by NEA-4:5.
 */

import { SecurityGatewayManifestInventoryCatalog } from "./securityGatewayManifestInventory.ts";
import {
  SecurityGatewayManifestBoundaries,
  SecurityGatewayManifestOwnership,
} from "./securityGatewayManifestOwnership.ts";
import { SecurityGatewayManifestReadinessDeclaration } from "./securityGatewayManifestReadiness.ts";
import type { SecurityGatewayManifestSummary } from "./securityGatewayManifestTypes.ts";
import { SecurityGatewayValidationId } from "./securityGatewayValidation.ts";

/** Manifest identity constants used by summary composition. */
export const SECURITY_GATEWAY_MANIFEST_SUMMARY_IDENTITY = Object.freeze({
  manifestId: "NEA-4:5/SecurityGatewayManifest" as const,
  name: "Security Gateway Manifest" as const,
  version: "1.0.0" as const,
  namespace: "nexora.nea.security-gateway.manifest" as const,
  publicExportCount: 8 as const,
  sectionCount: 9 as const,
});

/**
 * Build deterministic frozen Manifest summary.
 * Derived exclusively from canonical Manifest collections.
 */
export function buildSecurityGatewayManifestSummary(): SecurityGatewayManifestSummary {
  const identity = SECURITY_GATEWAY_MANIFEST_SUMMARY_IDENTITY;
  const inventory = SecurityGatewayManifestInventoryCatalog;
  return Object.freeze({
    manifestId: identity.manifestId,
    version: identity.version,
    name: identity.name,
    namespace: identity.namespace,
    layer: "NEA" as const,
    phase: "NEA-4:5" as const,
    status: "Manifest" as const,
    readiness: SecurityGatewayManifestReadinessDeclaration.readiness,
    validationId: SecurityGatewayValidationId,
    phaseReferenceCount: inventory.phaseReferenceCount,
    inventoryEntryCount: inventory.inventoryEntryCount,
    totalArchitectureCount: inventory.totalArchitectureCount,
    ownershipCount: SecurityGatewayManifestOwnership.ownsCount,
    nonOwnershipCount: SecurityGatewayManifestOwnership.doesNotOwnCount,
    prohibitedSurfaceCount:
      SecurityGatewayManifestBoundaries.prohibitedSurfaceCount,
    publicExportCount: identity.publicExportCount,
    sectionCount: identity.sectionCount,
    nextPhase: SecurityGatewayManifestReadinessDeclaration.nextPhase,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
}

/** Frozen summary snapshot for catalog consumers. */
export const SecurityGatewayManifestSummaryCatalog = Object.freeze({
  catalogId: "NEA-4:5/ManifestSummaryCatalog",
  sourcePhase: "NEA-4:5" as const,
  buildSummary: buildSecurityGatewayManifestSummary,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
