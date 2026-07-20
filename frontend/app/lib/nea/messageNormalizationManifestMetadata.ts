/**
 * NEA-6:5 — Message Normalization Manifest Metadata.
 *
 * Immutable manifest metadata envelope.
 * Counts are derived exclusively from canonical inventory collections.
 *
 * Ownership: owned exclusively by NEA-6:5.
 */

import { MessageNormalizationManifestInventoryCatalog } from "./messageNormalizationManifestInventory.ts";
import {
  MessageNormalizationManifestBoundaries,
  MessageNormalizationManifestOwnership,
} from "./messageNormalizationManifestOwnership.ts";
import { MessageNormalizationManifestReadinessDeclaration } from "./messageNormalizationManifestReadiness.ts";
import {
  MessageNormalizationValidationId,
  MessageNormalizationValidationVersion,
} from "./messageNormalizationValidation.ts";

/** Canonical immutable manifest metadata. */
export const MessageNormalizationManifestMetadata = Object.freeze({
  metadataId: "NEA-6:5/MessageNormalizationManifestMetadata",
  sourcePhase: "NEA-6:5" as const,
  architectureVersion: "NEA-6.0.0" as const,
  manifestVersion: "1.0.0" as const,
  namespace: "nexora.nea.message-normalization.manifest" as const,
  phase: "NEA-6:5" as const,
  status: "Manifest" as const,
  readiness: MessageNormalizationManifestReadinessDeclaration.readiness,
  compositionMode: "CanonicalReferenceOnly" as const,
  upstreamValidationId: MessageNormalizationValidationId,
  upstreamValidationVersion: MessageNormalizationValidationVersion,
  upstreamPhaseReferences:
    MessageNormalizationManifestInventoryCatalog.phaseReferences,
  inventoryStatus: "DerivedFromCanonicalCollections" as const,
  readinessStatus: MessageNormalizationManifestReadinessDeclaration.readiness,
  dependencyChain:
    "NEA-6:5 → NEA-6:4 Validation → NEA-6:3 Model → NEA-6:2 Registry → NEA-6:1 Foundation",
  inventorySummary: Object.freeze({
    inventoryEntryCount:
      MessageNormalizationManifestInventoryCatalog.inventoryEntryCount,
    totalArchitectureCount:
      MessageNormalizationManifestInventoryCatalog.totalArchitectureCount,
    phaseReferenceCount:
      MessageNormalizationManifestInventoryCatalog.phaseReferenceCount,
  }),
  ownershipSummary: Object.freeze({
    ownsCount: MessageNormalizationManifestOwnership.ownsCount,
    doesNotOwnCount: MessageNormalizationManifestOwnership.doesNotOwnCount,
    prohibitedSurfaceCount:
      MessageNormalizationManifestBoundaries.prohibitedSurfaceCount,
  }),
  inventory: MessageNormalizationManifestInventoryCatalog,
  phaseReferenceCount:
    MessageNormalizationManifestInventoryCatalog.phaseReferenceCount,
  inventoryEntryCount:
    MessageNormalizationManifestInventoryCatalog.inventoryEntryCount,
  totalArchitectureCount:
    MessageNormalizationManifestInventoryCatalog.totalArchitectureCount,
  ownershipCount: MessageNormalizationManifestOwnership.ownsCount,
  nonOwnershipCount: MessageNormalizationManifestOwnership.doesNotOwnCount,
  prohibitedSurfaceCount:
    MessageNormalizationManifestBoundaries.prohibitedSurfaceCount,
  countsHardcoded: false as const,
  countsReconstructed: false as const,
  duplicatesUpstreamCollections: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
