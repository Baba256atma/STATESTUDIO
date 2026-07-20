/**
 * NEA-6:6 — Message Normalization Platform Summary.
 *
 * Immutable summary helpers for Platform consumers.
 * Counts are derived exclusively from canonical Manifest and Platform collections.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by NEA-6:6.
 */

import { MessageNormalizationManifestId } from "./messageNormalizationManifest.ts";
import { MessageNormalizationPlatformMetadata } from "./messageNormalizationPlatformMetadata.ts";
import { MessageNormalizationPlatformNamespaceObject } from "./messageNormalizationPlatformNamespace.ts";
import {
  MessageNormalizationPlatformBoundaries,
  MessageNormalizationPlatformOwnership,
} from "./messageNormalizationPlatformOwnership.ts";
import { MessageNormalizationPlatformReadinessDeclaration } from "./messageNormalizationPlatformReadiness.ts";
import type { MessageNormalizationPlatformSummary } from "./messageNormalizationPlatformTypes.ts";

/** Platform identity constants used by summary composition. */
export const MESSAGE_NORMALIZATION_PLATFORM_SUMMARY_IDENTITY = Object.freeze({
  platformId: "NEA-6:6/MessageNormalizationPlatform" as const,
  name: "Message Normalization Platform" as const,
  version: "1.0.0" as const,
  namespace: "nexora.nea.message-normalization.platform" as const,
  publicExportCount: 8 as const,
  sectionCount: 9 as const,
});

/**
 * Build deterministic frozen Platform summary.
 * Derived exclusively from canonical Platform and Manifest collections.
 */
export function buildMessageNormalizationPlatformSummary(): MessageNormalizationPlatformSummary {
  const identity = MESSAGE_NORMALIZATION_PLATFORM_SUMMARY_IDENTITY;
  const meta = MessageNormalizationPlatformMetadata;
  const ns = MessageNormalizationPlatformNamespaceObject;
  return Object.freeze({
    platformId: identity.platformId,
    version: identity.version,
    name: identity.name,
    namespace: identity.namespace,
    layer: "NEA" as const,
    phase: "NEA-6:6" as const,
    status: "Platform" as const,
    readiness: MessageNormalizationPlatformReadinessDeclaration.readiness,
    manifestId: MessageNormalizationManifestId,
    composedPhaseCount: ns.composedPhaseCount,
    namespaceSectionCount: ns.sectionCount,
    phaseReferenceCount: meta.phaseReferenceCount,
    inventoryEntryCount: meta.inventoryEntryCount,
    totalArchitectureCount: meta.totalArchitectureCount,
    ownershipCount: MessageNormalizationPlatformOwnership.ownsCount,
    nonOwnershipCount: MessageNormalizationPlatformOwnership.doesNotOwnCount,
    prohibitedSurfaceCount:
      MessageNormalizationPlatformBoundaries.prohibitedSurfaceCount,
    publicExportCount: identity.publicExportCount,
    sectionCount: identity.sectionCount,
    nextPhase: MessageNormalizationPlatformReadinessDeclaration.nextPhase,
    architectureStatus:
      MessageNormalizationPlatformReadinessDeclaration.architectureStatus,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
}

/** Frozen summary catalog for composition consumers. */
export const MessageNormalizationPlatformSummaryCatalog = Object.freeze({
  catalogId: "NEA-6:6/PlatformSummaryCatalog",
  sourcePhase: "NEA-6:6" as const,
  architectureSummary: Object.freeze({
    architectureStatus:
      MessageNormalizationPlatformReadinessDeclaration.architectureStatus,
    architectureVersion: MessageNormalizationPlatformMetadata.architectureVersion,
    compositionMode: MessageNormalizationPlatformMetadata.compositionMode,
  }),
  namespaceSummary: Object.freeze({
    sectionCount: MessageNormalizationPlatformNamespaceObject.sectionCount,
    composedPhaseCount:
      MessageNormalizationPlatformNamespaceObject.composedPhaseCount,
    sectionOrder: MessageNormalizationPlatformNamespaceObject.sectionOrder,
  }),
  inventorySummary: Object.freeze({
    phaseReferenceCount:
      MessageNormalizationPlatformMetadata.phaseReferenceCount,
    inventoryEntryCount:
      MessageNormalizationPlatformMetadata.inventoryEntryCount,
    totalArchitectureCount:
      MessageNormalizationPlatformMetadata.totalArchitectureCount,
  }),
  dependencySummary: Object.freeze({
    dependencyChain: MessageNormalizationPlatformMetadata.dependencyChain,
    upstreamManifestId:
      MessageNormalizationPlatformMetadata.upstreamManifestId,
  }),
  consumerSummary: Object.freeze({
    consumerEntryPoint: MessageNormalizationPlatformMetadata.consumerEntryPoint,
    consumerReady: MessageNormalizationPlatformReadinessDeclaration.consumerReady,
    readiness: MessageNormalizationPlatformReadinessDeclaration.readiness,
  }),
  buildSummary: buildMessageNormalizationPlatformSummary,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
