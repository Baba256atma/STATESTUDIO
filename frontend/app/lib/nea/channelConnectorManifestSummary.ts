/**
 * NEA-2:5 — Channel Connectors Manifest Summary.
 *
 * Immutable summary helpers for Manifest consumers.
 * Counts are derived exclusively from canonical metadata collections.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by NEA-2:5.
 */

import { ChannelConnectorManifestInventoryCatalog } from "./channelConnectorManifestInventory.ts";
import {
  ChannelConnectorManifestBoundaries,
  ChannelConnectorManifestOwnership,
} from "./channelConnectorManifestOwnership.ts";
import { ChannelConnectorManifestReadinessDeclaration } from "./channelConnectorManifestReadiness.ts";
import type { ChannelConnectorManifestSummary } from "./channelConnectorManifestTypes.ts";
import { ChannelConnectorValidationId } from "./channelConnectorValidation.ts";

/** Manifest identity constants used by summary composition. */
export const CHANNEL_CONNECTOR_MANIFEST_SUMMARY_IDENTITY = Object.freeze({
  manifestId: "NEA-2:5/ChannelConnectorManifest" as const,
  name: "Channel Connectors Manifest" as const,
  version: "1.0.0" as const,
  namespace: "nexora.nea.channel-connectors.manifest" as const,
  publicExportCount: 8 as const,
  sectionCount: 9 as const,
});

/**
 * Build deterministic frozen Manifest summary.
 * Derived exclusively from canonical Manifest collections.
 */
export function buildChannelConnectorManifestSummary(): ChannelConnectorManifestSummary {
  const identity = CHANNEL_CONNECTOR_MANIFEST_SUMMARY_IDENTITY;
  const inventory = ChannelConnectorManifestInventoryCatalog;
  return Object.freeze({
    manifestId: identity.manifestId,
    version: identity.version,
    name: identity.name,
    namespace: identity.namespace,
    layer: "NEA" as const,
    phase: "NEA-2:5" as const,
    status: "Manifest" as const,
    readiness: ChannelConnectorManifestReadinessDeclaration.readiness,
    validationId: ChannelConnectorValidationId,
    phaseReferenceCount: inventory.phaseReferenceCount,
    inventoryEntryCount: inventory.inventoryEntryCount,
    totalArchitectureCount: inventory.totalArchitectureCount,
    ownershipCount: ChannelConnectorManifestOwnership.ownsCount,
    nonOwnershipCount: ChannelConnectorManifestOwnership.doesNotOwnCount,
    prohibitedSurfaceCount:
      ChannelConnectorManifestBoundaries.prohibitedSurfaceCount,
    publicExportCount: identity.publicExportCount,
    sectionCount: identity.sectionCount,
    nextPhase: ChannelConnectorManifestReadinessDeclaration.nextPhase,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
}

/** Frozen summary snapshot for catalog consumers. */
export const ChannelConnectorManifestSummaryCatalog = Object.freeze({
  catalogId: "NEA-2:5/ManifestSummaryCatalog",
  sourcePhase: "NEA-2:5" as const,
  buildSummary: buildChannelConnectorManifestSummary,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
