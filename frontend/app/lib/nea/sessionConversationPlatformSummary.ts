/**
 * NEA-3:6 — Session & Conversation Platform Summary.
 *
 * Immutable summary helpers for Platform consumers.
 * Counts are derived exclusively from canonical upstream collections.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by NEA-3:6.
 */

import { SessionConversationManifestId } from "./sessionConversationManifest.ts";
import { SessionConversationPlatformMetadata } from "./sessionConversationPlatformMetadata.ts";
import { SessionConversationPlatformNamespaceObject } from "./sessionConversationPlatformNamespace.ts";
import {
  SessionConversationPlatformBoundaries,
  SessionConversationPlatformOwnership,
} from "./sessionConversationPlatformOwnership.ts";
import { SessionConversationPlatformReadinessDeclaration } from "./sessionConversationPlatformReadiness.ts";
import type { SessionConversationPlatformSummary } from "./sessionConversationPlatformTypes.ts";

/** Platform identity constants used by summary composition. */
export const SESSION_CONVERSATION_PLATFORM_SUMMARY_IDENTITY = Object.freeze({
  platformId: "NEA-3:6/SessionConversationPlatform" as const,
  name: "Session & Conversation Platform" as const,
  version: "1.0.0" as const,
  namespace: "nexora.nea.session-conversation.platform" as const,
  publicExportCount: 8 as const,
  sectionCount: 9 as const,
});

/**
 * Build deterministic frozen Platform summary.
 * Derived exclusively from canonical Platform collections.
 */
export function buildSessionConversationPlatformSummary(): SessionConversationPlatformSummary {
  const identity = SESSION_CONVERSATION_PLATFORM_SUMMARY_IDENTITY;
  const meta = SessionConversationPlatformMetadata;
  const ns = SessionConversationPlatformNamespaceObject;
  return Object.freeze({
    platformId: identity.platformId,
    version: identity.version,
    name: identity.name,
    namespace: identity.namespace,
    layer: "NEA" as const,
    phase: "NEA-3:6" as const,
    status: "Platform" as const,
    readiness: SessionConversationPlatformReadinessDeclaration.readiness,
    manifestId: SessionConversationManifestId,
    composedPhaseCount: ns.composedPhaseCount,
    namespaceSectionCount: ns.sectionCount,
    inventoryEntryCount: meta.inventoryEntryCount,
    totalArchitectureCount: meta.totalArchitectureCount,
    ownershipCount: SessionConversationPlatformOwnership.ownsCount,
    nonOwnershipCount: SessionConversationPlatformOwnership.doesNotOwnCount,
    prohibitedSurfaceCount:
      SessionConversationPlatformBoundaries.prohibitedSurfaceCount,
    publicExportCount: identity.publicExportCount,
    sectionCount: identity.sectionCount,
    nextPhase: SessionConversationPlatformReadinessDeclaration.nextPhase,
    architectureStatus:
      SessionConversationPlatformReadinessDeclaration.architectureStatus,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
}

/** Frozen summary catalog for composition consumers. */
export const SessionConversationPlatformSummaryCatalog = Object.freeze({
  catalogId: "NEA-3:6/PlatformSummaryCatalog",
  sourcePhase: "NEA-3:6" as const,
  buildSummary: buildSessionConversationPlatformSummary,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
