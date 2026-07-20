/**
 * NEA-3:5 — Session & Conversation Manifest Summary.
 *
 * Immutable summary helpers for Manifest consumers.
 * Counts are derived exclusively from canonical metadata collections.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by NEA-3:5.
 */

import { SessionConversationManifestInventoryCatalog } from "./sessionConversationManifestInventory.ts";
import {
  SessionConversationManifestBoundaries,
  SessionConversationManifestOwnership,
} from "./sessionConversationManifestOwnership.ts";
import { SessionConversationManifestReadinessDeclaration } from "./sessionConversationManifestReadiness.ts";
import type { SessionConversationManifestSummary } from "./sessionConversationManifestTypes.ts";
import { SessionConversationValidationId } from "./sessionConversationValidation.ts";

/** Manifest identity constants used by summary composition. */
export const SESSION_CONVERSATION_MANIFEST_SUMMARY_IDENTITY = Object.freeze({
  manifestId: "NEA-3:5/SessionConversationManifest" as const,
  name: "Session & Conversation Manifest" as const,
  version: "1.0.0" as const,
  namespace: "nexora.nea.session-conversation.manifest" as const,
  publicExportCount: 8 as const,
  sectionCount: 9 as const,
});

/**
 * Build deterministic frozen Manifest summary.
 * Derived exclusively from canonical Manifest collections.
 */
export function buildSessionConversationManifestSummary(): SessionConversationManifestSummary {
  const identity = SESSION_CONVERSATION_MANIFEST_SUMMARY_IDENTITY;
  const inventory = SessionConversationManifestInventoryCatalog;
  return Object.freeze({
    manifestId: identity.manifestId,
    version: identity.version,
    name: identity.name,
    namespace: identity.namespace,
    layer: "NEA" as const,
    phase: "NEA-3:5" as const,
    status: "Manifest" as const,
    readiness: SessionConversationManifestReadinessDeclaration.readiness,
    validationId: SessionConversationValidationId,
    phaseReferenceCount: inventory.phaseReferenceCount,
    inventoryEntryCount: inventory.inventoryEntryCount,
    totalArchitectureCount: inventory.totalArchitectureCount,
    ownershipCount: SessionConversationManifestOwnership.ownsCount,
    nonOwnershipCount: SessionConversationManifestOwnership.doesNotOwnCount,
    prohibitedSurfaceCount:
      SessionConversationManifestBoundaries.prohibitedSurfaceCount,
    publicExportCount: identity.publicExportCount,
    sectionCount: identity.sectionCount,
    nextPhase: SessionConversationManifestReadinessDeclaration.nextPhase,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
}

/** Frozen summary snapshot for catalog consumers. */
export const SessionConversationManifestSummaryCatalog = Object.freeze({
  catalogId: "NEA-3:5/ManifestSummaryCatalog",
  sourcePhase: "NEA-3:5" as const,
  buildSummary: buildSessionConversationManifestSummary,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
