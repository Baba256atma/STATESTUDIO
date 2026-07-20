/**
 * NEA-2:5 — Channel Connectors Manifest Metadata.
 *
 * Immutable manifest metadata envelope.
 * Counts are derived exclusively from canonical inventory collections.
 *
 * Ownership: owned exclusively by NEA-2:5.
 */

import { ChannelConnectorManifestInventoryCatalog } from "./channelConnectorManifestInventory.ts";
import {
  ChannelConnectorManifestBoundaries,
  ChannelConnectorManifestOwnership,
} from "./channelConnectorManifestOwnership.ts";
import { ChannelConnectorManifestReadinessDeclaration } from "./channelConnectorManifestReadiness.ts";
import {
  ChannelConnectorValidationId,
  ChannelConnectorValidationVersion,
} from "./channelConnectorValidation.ts";

/** Canonical immutable manifest metadata. */
export const ChannelConnectorManifestMetadata = Object.freeze({
  metadataId: "NEA-2:5/ChannelConnectorManifestMetadata",
  sourcePhase: "NEA-2:5" as const,
  manifestVersion: "1.0.0" as const,
  architectureVersion: "NEA-2.0.0" as const,
  upstreamValidationId: ChannelConnectorValidationId,
  upstreamValidationVersion: ChannelConnectorValidationVersion,
  upstreamPhaseReferences:
    ChannelConnectorManifestInventoryCatalog.phaseReferences,
  inventoryStatus: "DerivedFromCanonicalCollections" as const,
  readinessStatus: ChannelConnectorManifestReadinessDeclaration.readiness,
  inventory: ChannelConnectorManifestInventoryCatalog,
  phaseReferenceCount:
    ChannelConnectorManifestInventoryCatalog.phaseReferenceCount,
  inventoryEntryCount:
    ChannelConnectorManifestInventoryCatalog.inventoryEntryCount,
  totalArchitectureCount:
    ChannelConnectorManifestInventoryCatalog.totalArchitectureCount,
  ownershipCount: ChannelConnectorManifestOwnership.ownsCount,
  nonOwnershipCount: ChannelConnectorManifestOwnership.doesNotOwnCount,
  prohibitedSurfaceCount:
    ChannelConnectorManifestBoundaries.prohibitedSurfaceCount,
  countsHardcoded: false as const,
  countsReconstructed: false as const,
  duplicatesUpstreamCollections: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
