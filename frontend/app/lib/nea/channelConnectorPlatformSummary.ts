/**
 * NEA-2:6 — Channel Connectors Platform Summary.
 *
 * Immutable summary helpers for Platform consumers.
 * Counts are derived exclusively from canonical upstream collections.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by NEA-2:6.
 */

import { ChannelConnectorManifestId } from "./channelConnectorManifest.ts";
import { ChannelConnectorPlatformMetadata } from "./channelConnectorPlatformMetadata.ts";
import { ChannelConnectorPlatformNamespaceObject } from "./channelConnectorPlatformNamespace.ts";
import {
  ChannelConnectorPlatformBoundaries,
  ChannelConnectorPlatformOwnership,
} from "./channelConnectorPlatformOwnership.ts";
import { ChannelConnectorPlatformReadinessDeclaration } from "./channelConnectorPlatformReadiness.ts";
import type { ChannelConnectorPlatformSummary } from "./channelConnectorPlatformTypes.ts";

/** Platform identity constants used by summary composition. */
export const CHANNEL_CONNECTOR_PLATFORM_SUMMARY_IDENTITY = Object.freeze({
  platformId: "NEA-2:6/ChannelConnectorPlatform" as const,
  name: "Channel Connectors Platform" as const,
  version: "1.0.0" as const,
  namespace: "nexora.nea.channel-connectors.platform" as const,
  publicExportCount: 8 as const,
  sectionCount: 9 as const,
});

/**
 * Build deterministic frozen Platform summary.
 * Derived exclusively from canonical Platform collections.
 */
export function buildChannelConnectorPlatformSummary(): ChannelConnectorPlatformSummary {
  const identity = CHANNEL_CONNECTOR_PLATFORM_SUMMARY_IDENTITY;
  const meta = ChannelConnectorPlatformMetadata;
  const ns = ChannelConnectorPlatformNamespaceObject;
  return Object.freeze({
    platformId: identity.platformId,
    version: identity.version,
    name: identity.name,
    namespace: identity.namespace,
    layer: "NEA" as const,
    phase: "NEA-2:6" as const,
    status: "Platform" as const,
    readiness: ChannelConnectorPlatformReadinessDeclaration.readiness,
    manifestId: ChannelConnectorManifestId,
    composedPhaseCount: ns.composedPhaseCount,
    namespaceSectionCount: ns.sectionCount,
    inventoryEntryCount: meta.inventoryEntryCount,
    totalArchitectureCount: meta.totalArchitectureCount,
    ownershipCount: ChannelConnectorPlatformOwnership.ownsCount,
    nonOwnershipCount: ChannelConnectorPlatformOwnership.doesNotOwnCount,
    prohibitedSurfaceCount:
      ChannelConnectorPlatformBoundaries.prohibitedSurfaceCount,
    publicExportCount: identity.publicExportCount,
    sectionCount: identity.sectionCount,
    nextPhase: ChannelConnectorPlatformReadinessDeclaration.nextPhase,
    architectureStatus:
      ChannelConnectorPlatformReadinessDeclaration.architectureStatus,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
}

/** Frozen summary catalog for composition consumers. */
export const ChannelConnectorPlatformSummaryCatalog = Object.freeze({
  catalogId: "NEA-2:6/PlatformSummaryCatalog",
  sourcePhase: "NEA-2:6" as const,
  buildSummary: buildChannelConnectorPlatformSummary,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
