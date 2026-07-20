/**
 * NEA-3:5 — Session & Conversation Manifest Metadata.
 *
 * Immutable manifest metadata envelope.
 * Counts are derived exclusively from canonical inventory collections.
 *
 * Ownership: owned exclusively by NEA-3:5.
 */

import { SessionConversationManifestInventoryCatalog } from "./sessionConversationManifestInventory.ts";
import {
  SessionConversationManifestBoundaries,
  SessionConversationManifestOwnership,
} from "./sessionConversationManifestOwnership.ts";
import { SessionConversationManifestReadinessDeclaration } from "./sessionConversationManifestReadiness.ts";
import {
  SessionConversationValidationId,
  SessionConversationValidationVersion,
} from "./sessionConversationValidation.ts";

/** Canonical immutable manifest metadata. */
export const SessionConversationManifestMetadata = Object.freeze({
  metadataId: "NEA-3:5/SessionConversationManifestMetadata",
  sourcePhase: "NEA-3:5" as const,
  manifestVersion: "1.0.0" as const,
  architectureVersion: "NEA-3.0.0" as const,
  upstreamValidationId: SessionConversationValidationId,
  upstreamValidationVersion: SessionConversationValidationVersion,
  upstreamPhaseReferences:
    SessionConversationManifestInventoryCatalog.phaseReferences,
  inventoryStatus: "DerivedFromCanonicalCollections" as const,
  readinessStatus: SessionConversationManifestReadinessDeclaration.readiness,
  inventory: SessionConversationManifestInventoryCatalog,
  phaseReferenceCount:
    SessionConversationManifestInventoryCatalog.phaseReferenceCount,
  inventoryEntryCount:
    SessionConversationManifestInventoryCatalog.inventoryEntryCount,
  totalArchitectureCount:
    SessionConversationManifestInventoryCatalog.totalArchitectureCount,
  ownershipCount: SessionConversationManifestOwnership.ownsCount,
  nonOwnershipCount: SessionConversationManifestOwnership.doesNotOwnCount,
  prohibitedSurfaceCount:
    SessionConversationManifestBoundaries.prohibitedSurfaceCount,
  countsHardcoded: false as const,
  countsReconstructed: false as const,
  duplicatesUpstreamCollections: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
