/**
 * NEA-1:6 — Executive Gateway Platform Metadata.
 *
 * Immutable platform metadata including version, composition, readiness,
 * ownership, and compatibility declarations.
 * Counts are derived exclusively from canonical upstream references.
 *
 * Ownership: owned exclusively by NEA-1:6.
 */

import {
  ExecutiveGatewayManifestId,
  ExecutiveGatewayManifestPlatform,
  ExecutiveGatewayManifestVersion,
} from "./executiveGatewayManifest.ts";
import { ExecutiveGatewayPlatformNamespaceObject } from "./executiveGatewayPlatformNamespace.ts";
import {
  ExecutiveGatewayPlatformBoundaries,
  ExecutiveGatewayPlatformOwnership,
} from "./executiveGatewayPlatformOwnership.ts";
import { ExecutiveGatewayPlatformReadinessDeclaration } from "./executiveGatewayPlatformReadiness.ts";

const manifest = ExecutiveGatewayManifestPlatform;
const ns = ExecutiveGatewayPlatformNamespaceObject;

/** Canonical immutable platform metadata. */
export const ExecutiveGatewayPlatformMetadata = Object.freeze({
  metadataId: "NEA-1:6/ExecutiveGatewayPlatformMetadata",
  sourcePhase: "NEA-1:6" as const,
  platformVersion: "1.0.0" as const,
  architectureVersion: "NEA-1.0.0" as const,
  upstreamManifestId: ExecutiveGatewayManifestId,
  upstreamManifestVersion: ExecutiveGatewayManifestVersion,
  phaseComposition: ns.composition,
  composedPhaseCount: ns.composedPhaseCount,
  namespaceSectionCount: ns.sectionCount,
  readiness: ExecutiveGatewayPlatformReadinessDeclaration.readiness,
  architectureStatus:
    ExecutiveGatewayPlatformReadinessDeclaration.architectureStatus,
  ownership: ExecutiveGatewayPlatformOwnership,
  compatibility: Object.freeze({
    compatibilityId: "NEA-1:6/Compatibility",
    requiresManifest: ExecutiveGatewayManifestId,
    requiresValidation: manifest.identity.validationId,
    compositionMode: "CanonicalReferenceOnly" as const,
    allowsReconstruction: false as const,
    allowsDuplication: false as const,
    metadataOnly: true as const,
  }),
  inventoryEntryCount: manifest.inventory.inventoryEntryCount,
  totalArchitectureCount: manifest.inventory.totalArchitectureCount,
  ownershipCount: ExecutiveGatewayPlatformOwnership.ownsCount,
  nonOwnershipCount: ExecutiveGatewayPlatformOwnership.doesNotOwnCount,
  prohibitedSurfaceCount:
    ExecutiveGatewayPlatformBoundaries.prohibitedSurfaceCount,
  countsHardcoded: false as const,
  countsReconstructed: false as const,
  duplicatesUpstreamArchitecture: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
