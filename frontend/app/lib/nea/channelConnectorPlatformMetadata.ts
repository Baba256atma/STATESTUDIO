/**
 * NEA-2:6 — Channel Connectors Platform Metadata.
 *
 * Immutable platform metadata including version, composition, readiness,
 * ownership, and compatibility declarations.
 * Counts are derived exclusively from canonical upstream references.
 *
 * Ownership: owned exclusively by NEA-2:6.
 */

import {
  ChannelConnectorManifestId,
  ChannelConnectorManifestPlatform,
  ChannelConnectorManifestVersion,
} from "./channelConnectorManifest.ts";
import { ChannelConnectorPlatformNamespaceObject } from "./channelConnectorPlatformNamespace.ts";
import {
  ChannelConnectorPlatformBoundaries,
  ChannelConnectorPlatformOwnership,
} from "./channelConnectorPlatformOwnership.ts";
import { ChannelConnectorPlatformReadinessDeclaration } from "./channelConnectorPlatformReadiness.ts";

const manifest = ChannelConnectorManifestPlatform;
const ns = ChannelConnectorPlatformNamespaceObject;

/** Canonical immutable platform metadata. */
export const ChannelConnectorPlatformMetadata = Object.freeze({
  metadataId: "NEA-2:6/ChannelConnectorPlatformMetadata",
  sourcePhase: "NEA-2:6" as const,
  platformVersion: "1.0.0" as const,
  architectureVersion: "NEA-2.0.0" as const,
  upstreamManifestId: ChannelConnectorManifestId,
  upstreamManifestVersion: ChannelConnectorManifestVersion,
  phaseComposition: ns.composition,
  composedPhaseCount: ns.composedPhaseCount,
  namespaceSectionCount: ns.sectionCount,
  readiness: ChannelConnectorPlatformReadinessDeclaration.readiness,
  architectureStatus:
    ChannelConnectorPlatformReadinessDeclaration.architectureStatus,
  ownership: ChannelConnectorPlatformOwnership,
  compatibility: Object.freeze({
    compatibilityId: "NEA-2:6/Compatibility",
    requiresManifest: ChannelConnectorManifestId,
    requiresValidation: manifest.identity.validationId,
    compositionMode: "CanonicalReferenceOnly" as const,
    allowsReconstruction: false as const,
    allowsDuplication: false as const,
    metadataOnly: true as const,
  }),
  inventoryEntryCount: manifest.inventory.inventoryEntryCount,
  totalArchitectureCount: manifest.inventory.totalArchitectureCount,
  ownershipCount: ChannelConnectorPlatformOwnership.ownsCount,
  nonOwnershipCount: ChannelConnectorPlatformOwnership.doesNotOwnCount,
  prohibitedSurfaceCount:
    ChannelConnectorPlatformBoundaries.prohibitedSurfaceCount,
  countsHardcoded: false as const,
  countsReconstructed: false as const,
  duplicatesUpstreamArchitecture: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
