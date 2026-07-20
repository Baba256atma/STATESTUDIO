/**
 * NEA-4:6 — Security Gateway Platform Metadata.
 *
 * Immutable platform metadata including version, composition, readiness,
 * ownership, and compatibility declarations.
 * Counts are derived exclusively from canonical Manifest references.
 *
 * Ownership: owned exclusively by NEA-4:6.
 */

import {
  SecurityGatewayManifestId,
  SecurityGatewayManifestPlatform,
  SecurityGatewayManifestVersion,
} from "./securityGatewayManifest.ts";
import { SecurityGatewayPlatformNamespaceObject } from "./securityGatewayPlatformNamespace.ts";
import {
  SecurityGatewayPlatformBoundaries,
  SecurityGatewayPlatformOwnership,
} from "./securityGatewayPlatformOwnership.ts";
import { SecurityGatewayPlatformReadinessDeclaration } from "./securityGatewayPlatformReadiness.ts";

const manifest = SecurityGatewayManifestPlatform;
const ns = SecurityGatewayPlatformNamespaceObject;

/** Canonical immutable platform metadata. */
export const SecurityGatewayPlatformMetadata = Object.freeze({
  metadataId: "NEA-4:6/SecurityGatewayPlatformMetadata",
  sourcePhase: "NEA-4:6" as const,
  platformVersion: "1.0.0" as const,
  architectureVersion: "NEA-4.0.0" as const,
  namespace: "nexora.nea.security-gateway.platform" as const,
  status: "Platform" as const,
  readiness: SecurityGatewayPlatformReadinessDeclaration.readiness,
  compositionMode: "CanonicalReferenceOnly" as const,
  upstreamManifestId: SecurityGatewayManifestId,
  upstreamManifestVersion: SecurityGatewayManifestVersion,
  phaseComposition: ns.composition,
  composedPhaseCount: ns.composedPhaseCount,
  namespaceSectionCount: ns.sectionCount,
  architectureStatus:
    SecurityGatewayPlatformReadinessDeclaration.architectureStatus,
  ownership: SecurityGatewayPlatformOwnership,
  compatibility: Object.freeze({
    compatibilityId: "NEA-4:6/Compatibility",
    requiresManifest: SecurityGatewayManifestId,
    requiresValidation: manifest.identity.validationId,
    compositionMode: "CanonicalReferenceOnly" as const,
    allowsReconstruction: false as const,
    allowsDuplication: false as const,
    metadataOnly: true as const,
  }),
  phaseReferenceCount: manifest.inventory.phaseReferenceCount,
  inventoryEntryCount: manifest.inventory.inventoryEntryCount,
  totalArchitectureCount: manifest.inventory.totalArchitectureCount,
  ownershipCount: SecurityGatewayPlatformOwnership.ownsCount,
  nonOwnershipCount: SecurityGatewayPlatformOwnership.doesNotOwnCount,
  prohibitedSurfaceCount:
    SecurityGatewayPlatformBoundaries.prohibitedSurfaceCount,
  countsHardcoded: false as const,
  countsReconstructed: false as const,
  duplicatesUpstreamArchitecture: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
