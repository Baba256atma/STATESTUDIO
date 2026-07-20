/**
 * NEA-3:6 — Session & Conversation Platform Metadata.
 *
 * Immutable platform metadata including version, composition, readiness,
 * ownership, and compatibility declarations.
 * Counts are derived exclusively from canonical upstream references.
 *
 * Ownership: owned exclusively by NEA-3:6.
 */

import {
  SessionConversationManifestId,
  SessionConversationManifestPlatform,
  SessionConversationManifestVersion,
} from "./sessionConversationManifest.ts";
import { SessionConversationPlatformNamespaceObject } from "./sessionConversationPlatformNamespace.ts";
import {
  SessionConversationPlatformBoundaries,
  SessionConversationPlatformOwnership,
} from "./sessionConversationPlatformOwnership.ts";
import { SessionConversationPlatformReadinessDeclaration } from "./sessionConversationPlatformReadiness.ts";

const manifest = SessionConversationManifestPlatform;
const ns = SessionConversationPlatformNamespaceObject;

/** Canonical immutable platform metadata. */
export const SessionConversationPlatformMetadata = Object.freeze({
  metadataId: "NEA-3:6/SessionConversationPlatformMetadata",
  sourcePhase: "NEA-3:6" as const,
  platformVersion: "1.0.0" as const,
  architectureVersion: "NEA-3.0.0" as const,
  upstreamManifestId: SessionConversationManifestId,
  upstreamManifestVersion: SessionConversationManifestVersion,
  phaseComposition: ns.composition,
  composedPhaseCount: ns.composedPhaseCount,
  namespaceSectionCount: ns.sectionCount,
  readiness: SessionConversationPlatformReadinessDeclaration.readiness,
  architectureStatus:
    SessionConversationPlatformReadinessDeclaration.architectureStatus,
  ownership: SessionConversationPlatformOwnership,
  compatibility: Object.freeze({
    compatibilityId: "NEA-3:6/Compatibility",
    requiresManifest: SessionConversationManifestId,
    requiresValidation: manifest.identity.validationId,
    compositionMode: "CanonicalReferenceOnly" as const,
    allowsReconstruction: false as const,
    allowsDuplication: false as const,
    metadataOnly: true as const,
  }),
  inventoryEntryCount: manifest.inventory.inventoryEntryCount,
  totalArchitectureCount: manifest.inventory.totalArchitectureCount,
  ownershipCount: SessionConversationPlatformOwnership.ownsCount,
  nonOwnershipCount: SessionConversationPlatformOwnership.doesNotOwnCount,
  prohibitedSurfaceCount:
    SessionConversationPlatformBoundaries.prohibitedSurfaceCount,
  countsHardcoded: false as const,
  countsReconstructed: false as const,
  duplicatesUpstreamArchitecture: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
