/**
 * NEA-6:6 — Message Normalization Platform Metadata.
 *
 * Immutable platform metadata including version, composition, readiness,
 * ownership, and compatibility declarations.
 * Counts are derived exclusively from canonical Manifest references.
 *
 * Ownership: owned exclusively by NEA-6:6.
 */

import {
  MessageNormalizationManifestId,
  MessageNormalizationManifestPlatform,
  MessageNormalizationManifestVersion,
} from "./messageNormalizationManifest.ts";
import { MessageNormalizationPlatformNamespaceObject } from "./messageNormalizationPlatformNamespace.ts";
import {
  MessageNormalizationPlatformBoundaries,
  MessageNormalizationPlatformOwnership,
} from "./messageNormalizationPlatformOwnership.ts";
import { MessageNormalizationPlatformReadinessDeclaration } from "./messageNormalizationPlatformReadiness.ts";

const manifest = MessageNormalizationManifestPlatform;
const ns = MessageNormalizationPlatformNamespaceObject;

/** Canonical immutable platform metadata. */
export const MessageNormalizationPlatformMetadata = Object.freeze({
  metadataId: "NEA-6:6/MessageNormalizationPlatformMetadata",
  sourcePhase: "NEA-6:6" as const,
  platformVersion: "1.0.0" as const,
  architectureVersion: "NEA-6.0.0" as const,
  namespaceVersion: "1.0.0" as const,
  namespace: "nexora.nea.message-normalization.platform" as const,
  status: "Platform" as const,
  readiness: MessageNormalizationPlatformReadinessDeclaration.readiness,
  consumerReadiness: MessageNormalizationPlatformReadinessDeclaration.readiness,
  compositionMode: "CanonicalReferenceOnly" as const,
  dependencyChain:
    "NEA-6:6 → NEA-6:5 Manifest → NEA-6:4 Validation → NEA-6:3 Model → NEA-6:2 Registry → NEA-6:1 Foundation",
  upstreamManifestId: MessageNormalizationManifestId,
  upstreamManifestVersion: MessageNormalizationManifestVersion,
  consumerEntryPoint: "messageNormalizationPlatform.ts" as const,
  phaseComposition: ns.composition,
  composedPhaseCount: ns.composedPhaseCount,
  namespaceSectionCount: ns.sectionCount,
  architectureStatus:
    MessageNormalizationPlatformReadinessDeclaration.architectureStatus,
  ownership: MessageNormalizationPlatformOwnership,
  compatibility: Object.freeze({
    compatibilityId: "NEA-6:6/Compatibility",
    requiresManifest: MessageNormalizationManifestId,
    requiresValidation: manifest.identity.validationId,
    compositionMode: "CanonicalReferenceOnly" as const,
    allowsReconstruction: false as const,
    allowsDuplication: false as const,
    metadataOnly: true as const,
  }),
  phaseReferenceCount: manifest.inventory.phaseReferenceCount,
  inventoryEntryCount: manifest.inventory.inventoryEntryCount,
  totalArchitectureCount: manifest.inventory.totalArchitectureCount,
  ownershipCount: MessageNormalizationPlatformOwnership.ownsCount,
  nonOwnershipCount: MessageNormalizationPlatformOwnership.doesNotOwnCount,
  prohibitedSurfaceCount:
    MessageNormalizationPlatformBoundaries.prohibitedSurfaceCount,
  countsHardcoded: false as const,
  countsReconstructed: false as const,
  duplicatesUpstreamArchitecture: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
