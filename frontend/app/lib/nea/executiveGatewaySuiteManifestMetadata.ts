/**
 * NEA-8:5 — Executive Gateway Suite Manifest Metadata.
 *
 * Immutable manifest metadata envelope.
 * Counts are derived exclusively from canonical inventory collections.
 *
 * Ownership: owned exclusively by NEA-8:5.
 */

import { ExecutiveGatewaySuiteManifestInventoryCatalog } from "./executiveGatewaySuiteManifestInventory.ts";
import {
  ExecutiveGatewaySuiteManifestBoundaries,
  ExecutiveGatewaySuiteManifestOwnership,
} from "./executiveGatewaySuiteManifestOwnership.ts";
import { ExecutiveGatewaySuiteManifestReadinessDeclaration } from "./executiveGatewaySuiteManifestReadiness.ts";
import {
  ExecutiveGatewaySuiteValidationId,
  ExecutiveGatewaySuiteValidationVersion,
} from "./executiveGatewaySuiteValidation.ts";

/** Canonical immutable manifest metadata. */
export const ExecutiveGatewaySuiteManifestMetadata = Object.freeze({
  metadataId: "NEA-8:5/ExecutiveGatewaySuiteManifestMetadata",
  sourcePhase: "NEA-8:5" as const,
  architectureVersion: "NEA-8.0.0" as const,
  manifestVersion: "1.0.0" as const,
  inventoryVersion: "1.0.0" as const,
  namespace: "nexora.nea.executive-gateway-suite.manifest" as const,
  phase: "NEA-8:5" as const,
  status: "Manifest" as const,
  readiness: ExecutiveGatewaySuiteManifestReadinessDeclaration.readiness,
  compositionMode: "CanonicalReferenceOnly" as const,
  canonicalReferenceMode: "ValidationChainOnly" as const,
  upstreamValidationId: ExecutiveGatewaySuiteValidationId,
  upstreamValidationVersion: ExecutiveGatewaySuiteValidationVersion,
  upstreamPhaseReferences:
    ExecutiveGatewaySuiteManifestInventoryCatalog.phaseReferences,
  inventoryStatus: "DerivedFromCanonicalCollections" as const,
  readinessStatus: ExecutiveGatewaySuiteManifestReadinessDeclaration.readiness,
  dependencyChain:
    "NEA-8:5 → NEA-8:4 Validation → NEA-8:3 Model → NEA-8:2 Registry → NEA-8:1 Foundation",
  inventorySummary: Object.freeze({
    inventoryEntryCount:
      ExecutiveGatewaySuiteManifestInventoryCatalog.inventoryEntryCount,
    totalArchitectureCount:
      ExecutiveGatewaySuiteManifestInventoryCatalog.totalArchitectureCount,
    publicApiInventoryTotal:
      ExecutiveGatewaySuiteManifestInventoryCatalog.publicApiInventoryTotal,
    phaseReferenceCount:
      ExecutiveGatewaySuiteManifestInventoryCatalog.phaseReferenceCount,
  }),
  ownershipSummary: Object.freeze({
    ownsCount: ExecutiveGatewaySuiteManifestOwnership.ownsCount,
    doesNotOwnCount: ExecutiveGatewaySuiteManifestOwnership.doesNotOwnCount,
    prohibitedSurfaceCount:
      ExecutiveGatewaySuiteManifestBoundaries.prohibitedSurfaceCount,
  }),
  inventory: ExecutiveGatewaySuiteManifestInventoryCatalog,
  phaseReferenceCount:
    ExecutiveGatewaySuiteManifestInventoryCatalog.phaseReferenceCount,
  inventoryEntryCount:
    ExecutiveGatewaySuiteManifestInventoryCatalog.inventoryEntryCount,
  totalArchitectureCount:
    ExecutiveGatewaySuiteManifestInventoryCatalog.totalArchitectureCount,
  publicApiInventoryTotal:
    ExecutiveGatewaySuiteManifestInventoryCatalog.publicApiInventoryTotal,
  ownershipCount: ExecutiveGatewaySuiteManifestOwnership.ownsCount,
  nonOwnershipCount: ExecutiveGatewaySuiteManifestOwnership.doesNotOwnCount,
  prohibitedSurfaceCount:
    ExecutiveGatewaySuiteManifestBoundaries.prohibitedSurfaceCount,
  countsHardcoded: false as const,
  countsReconstructed: false as const,
  duplicatesUpstreamCollections: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
