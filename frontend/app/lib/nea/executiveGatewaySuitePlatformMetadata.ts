/**
 * NEA-8:6 — Executive Gateway Suite Platform Metadata.
 *
 * Immutable platform metadata including version, composition, readiness,
 * ownership, and compatibility declarations.
 * Counts are derived exclusively from canonical Manifest references.
 *
 * Ownership: owned exclusively by NEA-8:6.
 */

import {
  ExecutiveGatewaySuiteManifestId,
  ExecutiveGatewaySuiteManifestPlatform,
  ExecutiveGatewaySuiteManifestVersion,
} from "./executiveGatewaySuiteManifest.ts";
import { ExecutiveGatewaySuitePlatformNamespaceObject } from "./executiveGatewaySuitePlatformNamespace.ts";
import {
  ExecutiveGatewaySuitePlatformBoundaries,
  ExecutiveGatewaySuitePlatformOwnership,
} from "./executiveGatewaySuitePlatformOwnership.ts";
import { ExecutiveGatewaySuitePlatformReadinessDeclaration } from "./executiveGatewaySuitePlatformReadiness.ts";

const manifest = ExecutiveGatewaySuiteManifestPlatform;
const ns = ExecutiveGatewaySuitePlatformNamespaceObject;

/** Canonical immutable platform metadata. */
export const ExecutiveGatewaySuitePlatformMetadata = Object.freeze({
  metadataId: "NEA-8:6/ExecutiveGatewaySuitePlatformMetadata",
  sourcePhase: "NEA-8:6" as const,
  platformVersion: "1.0.0" as const,
  architectureVersion: "NEA-8.0.0" as const,
  inventoryVersion: "1.0.0" as const,
  namespaceVersion: "1.0.0" as const,
  namespace: "nexora.nea.executive-gateway-suite.platform" as const,
  status: "Platform" as const,
  readiness: ExecutiveGatewaySuitePlatformReadinessDeclaration.readiness,
  consumerReadiness: ExecutiveGatewaySuitePlatformReadinessDeclaration.readiness,
  downstreamReadiness:
    ExecutiveGatewaySuitePlatformReadinessDeclaration.readiness,
  compositionMode: "CanonicalReferenceOnly" as const,
  canonicalReferenceMode: "ManifestOnly" as const,
  dependencyChain:
    "NEA-8:6 → NEA-8:5 Manifest → NEA-8:4 Validation → NEA-8:3 Model → NEA-8:2 Registry → NEA-8:1 Foundation",
  upstreamManifestId: ExecutiveGatewaySuiteManifestId,
  upstreamManifestVersion: ExecutiveGatewaySuiteManifestVersion,
  consumerEntryPoint: "executiveGatewaySuitePlatform.ts" as const,
  phaseComposition: ns.composition,
  composedPhaseCount: ns.composedPhaseCount,
  namespaceSectionCount: ns.sectionCount,
  suiteComponentCount: ns.suiteComponentCount,
  architectureStatus:
    ExecutiveGatewaySuitePlatformReadinessDeclaration.architectureStatus,
  ownership: ExecutiveGatewaySuitePlatformOwnership,
  inventorySummary: Object.freeze({
    phaseReferenceCount: manifest.inventory.phaseReferenceCount,
    inventoryEntryCount: manifest.inventory.inventoryEntryCount,
    totalArchitectureCount: manifest.inventory.totalArchitectureCount,
    publicApiInventoryTotal: manifest.inventory.publicApiInventoryTotal,
    suiteComponentCount: ns.suiteComponentCount,
  }),
  ownershipSummary: Object.freeze({
    ownsCount: ExecutiveGatewaySuitePlatformOwnership.ownsCount,
    doesNotOwnCount: ExecutiveGatewaySuitePlatformOwnership.doesNotOwnCount,
    prohibitedSurfaceCount:
      ExecutiveGatewaySuitePlatformBoundaries.prohibitedSurfaceCount,
  }),
  compatibility: Object.freeze({
    compatibilityId: "NEA-8:6/Compatibility",
    requiresManifest: ExecutiveGatewaySuiteManifestId,
    requiresValidation: manifest.identity.validationId,
    compositionMode: "CanonicalReferenceOnly" as const,
    canonicalReferenceMode: "ManifestOnly" as const,
    allowsReconstruction: false as const,
    allowsDuplication: false as const,
    metadataOnly: true as const,
  }),
  phaseReferenceCount: manifest.inventory.phaseReferenceCount,
  inventoryEntryCount: manifest.inventory.inventoryEntryCount,
  totalArchitectureCount: manifest.inventory.totalArchitectureCount,
  publicApiInventoryTotal: manifest.inventory.publicApiInventoryTotal,
  ownershipCount: ExecutiveGatewaySuitePlatformOwnership.ownsCount,
  nonOwnershipCount: ExecutiveGatewaySuitePlatformOwnership.doesNotOwnCount,
  prohibitedSurfaceCount:
    ExecutiveGatewaySuitePlatformBoundaries.prohibitedSurfaceCount,
  runtimeBehavior: false as const,
  implementsRuntimeGateway: false as const,
  invokesDKL: false as const,
  countsHardcoded: false as const,
  countsReconstructed: false as const,
  duplicatesUpstreamArchitecture: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
