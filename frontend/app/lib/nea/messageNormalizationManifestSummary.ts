/**
 * NEA-6:5 — Message Normalization Manifest Summary.
 *
 * Immutable summary helpers for Manifest consumers.
 * Counts are derived exclusively from canonical metadata collections.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by NEA-6:5.
 */

import { MessageNormalizationManifestInventoryCatalog } from "./messageNormalizationManifestInventory.ts";
import {
  MessageNormalizationManifestBoundaries,
  MessageNormalizationManifestOwnership,
} from "./messageNormalizationManifestOwnership.ts";
import { MessageNormalizationManifestReadinessDeclaration } from "./messageNormalizationManifestReadiness.ts";
import type { MessageNormalizationManifestSummary } from "./messageNormalizationManifestTypes.ts";
import { MessageNormalizationValidationId } from "./messageNormalizationValidation.ts";

/** Manifest identity constants used by summary composition. */
export const MESSAGE_NORMALIZATION_MANIFEST_SUMMARY_IDENTITY = Object.freeze({
  manifestId: "NEA-6:5/MessageNormalizationManifest" as const,
  name: "Message Normalization Manifest" as const,
  version: "1.0.0" as const,
  namespace: "nexora.nea.message-normalization.manifest" as const,
  publicExportCount: 8 as const,
  sectionCount: 9 as const,
});

/**
 * Build deterministic frozen Manifest summary.
 * Derived exclusively from canonical Manifest collections.
 */
export function buildMessageNormalizationManifestSummary(): MessageNormalizationManifestSummary {
  const identity = MESSAGE_NORMALIZATION_MANIFEST_SUMMARY_IDENTITY;
  const inventory = MessageNormalizationManifestInventoryCatalog;
  return Object.freeze({
    manifestId: identity.manifestId,
    version: identity.version,
    name: identity.name,
    namespace: identity.namespace,
    layer: "NEA" as const,
    phase: "NEA-6:5" as const,
    status: "Manifest" as const,
    readiness: MessageNormalizationManifestReadinessDeclaration.readiness,
    validationId: MessageNormalizationValidationId,
    phaseReferenceCount: inventory.phaseReferenceCount,
    inventoryEntryCount: inventory.inventoryEntryCount,
    totalArchitectureCount: inventory.totalArchitectureCount,
    ownershipCount: MessageNormalizationManifestOwnership.ownsCount,
    nonOwnershipCount: MessageNormalizationManifestOwnership.doesNotOwnCount,
    prohibitedSurfaceCount:
      MessageNormalizationManifestBoundaries.prohibitedSurfaceCount,
    publicExportCount: identity.publicExportCount,
    sectionCount: identity.sectionCount,
    nextPhase: MessageNormalizationManifestReadinessDeclaration.nextPhase,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
}

/** Frozen summary snapshot for catalog consumers. */
export const MessageNormalizationManifestSummaryCatalog = Object.freeze({
  catalogId: "NEA-6:5/ManifestSummaryCatalog",
  sourcePhase: "NEA-6:5" as const,
  architectureSummary: Object.freeze({
    phaseReferenceCount:
      MessageNormalizationManifestInventoryCatalog.phaseReferenceCount,
    compositionMode: "CanonicalReferenceOnly" as const,
  }),
  inventorySummary: Object.freeze({
    inventoryEntryCount:
      MessageNormalizationManifestInventoryCatalog.inventoryEntryCount,
    totalArchitectureCount:
      MessageNormalizationManifestInventoryCatalog.totalArchitectureCount,
  }),
  canonicalDependencySummary: Object.freeze({
    countingRule: MessageNormalizationManifestInventoryCatalog.countingRule,
    validationId: MessageNormalizationValidationId,
  }),
  readinessSummary: Object.freeze({
    readiness: MessageNormalizationManifestReadinessDeclaration.readiness,
    nextPhase: MessageNormalizationManifestReadinessDeclaration.nextPhase,
  }),
  buildSummary: buildMessageNormalizationManifestSummary,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
