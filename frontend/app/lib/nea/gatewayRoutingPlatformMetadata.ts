/**
 * NEA-5:6 — Gateway Routing Platform Metadata.
 *
 * Immutable platform metadata including version, composition, readiness,
 * ownership, and compatibility declarations.
 * Counts are derived exclusively from canonical Manifest references.
 *
 * Ownership: owned exclusively by NEA-5:6.
 */

import {
  GatewayRoutingManifestId,
  GatewayRoutingManifestPlatform,
  GatewayRoutingManifestVersion,
} from "./gatewayRoutingManifest.ts";
import { GatewayRoutingPlatformNamespaceObject } from "./gatewayRoutingPlatformNamespace.ts";
import {
  GatewayRoutingPlatformBoundaries,
  GatewayRoutingPlatformOwnership,
} from "./gatewayRoutingPlatformOwnership.ts";
import { GatewayRoutingPlatformReadinessDeclaration } from "./gatewayRoutingPlatformReadiness.ts";

const manifest = GatewayRoutingManifestPlatform;
const ns = GatewayRoutingPlatformNamespaceObject;

/** Canonical immutable platform metadata. */
export const GatewayRoutingPlatformMetadata = Object.freeze({
  metadataId: "NEA-5:6/GatewayRoutingPlatformMetadata",
  sourcePhase: "NEA-5:6" as const,
  platformVersion: "1.0.0" as const,
  architectureVersion: "NEA-5.0.0" as const,
  namespace: "nexora.nea.gateway-routing.platform" as const,
  status: "Platform" as const,
  readiness: GatewayRoutingPlatformReadinessDeclaration.readiness,
  compositionMode: "CanonicalReferenceOnly" as const,
  upstreamManifestId: GatewayRoutingManifestId,
  upstreamManifestVersion: GatewayRoutingManifestVersion,
  consumerEntryPoint: "gatewayRoutingPlatform.ts" as const,
  phaseComposition: ns.composition,
  composedPhaseCount: ns.composedPhaseCount,
  namespaceSectionCount: ns.sectionCount,
  architectureStatus:
    GatewayRoutingPlatformReadinessDeclaration.architectureStatus,
  ownership: GatewayRoutingPlatformOwnership,
  compatibility: Object.freeze({
    compatibilityId: "NEA-5:6/Compatibility",
    requiresManifest: GatewayRoutingManifestId,
    requiresValidation: manifest.identity.validationId,
    compositionMode: "CanonicalReferenceOnly" as const,
    allowsReconstruction: false as const,
    allowsDuplication: false as const,
    metadataOnly: true as const,
  }),
  phaseReferenceCount: manifest.inventory.phaseReferenceCount,
  inventoryEntryCount: manifest.inventory.inventoryEntryCount,
  totalArchitectureCount: manifest.inventory.totalArchitectureCount,
  ownershipCount: GatewayRoutingPlatformOwnership.ownsCount,
  nonOwnershipCount: GatewayRoutingPlatformOwnership.doesNotOwnCount,
  prohibitedSurfaceCount:
    GatewayRoutingPlatformBoundaries.prohibitedSurfaceCount,
  countsHardcoded: false as const,
  countsReconstructed: false as const,
  duplicatesUpstreamArchitecture: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
