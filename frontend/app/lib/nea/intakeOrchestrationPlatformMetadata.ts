/**
 * NEA-7:6 — Intake Orchestration Platform Metadata.
 *
 * Immutable platform metadata including version, composition, readiness,
 * ownership, and compatibility declarations.
 * Counts are derived exclusively from canonical Manifest references.
 *
 * Ownership: owned exclusively by NEA-7:6.
 */

import {
  IntakeOrchestrationManifestId,
  IntakeOrchestrationManifestPlatform,
  IntakeOrchestrationManifestVersion,
} from "./intakeOrchestrationManifest.ts";
import { IntakeOrchestrationPlatformNamespaceObject } from "./intakeOrchestrationPlatformNamespace.ts";
import {
  IntakeOrchestrationPlatformBoundaries,
  IntakeOrchestrationPlatformOwnership,
} from "./intakeOrchestrationPlatformOwnership.ts";
import { IntakeOrchestrationPlatformReadinessDeclaration } from "./intakeOrchestrationPlatformReadiness.ts";

const manifest = IntakeOrchestrationManifestPlatform;
const ns = IntakeOrchestrationPlatformNamespaceObject;

/** Canonical immutable platform metadata. */
export const IntakeOrchestrationPlatformMetadata = Object.freeze({
  metadataId: "NEA-7:6/IntakeOrchestrationPlatformMetadata",
  sourcePhase: "NEA-7:6" as const,
  platformVersion: "1.0.0" as const,
  architectureVersion: "NEA-7.0.0" as const,
  namespaceVersion: "1.0.0" as const,
  namespace: "nexora.nea.intake-orchestration.platform" as const,
  status: "Platform" as const,
  readiness: IntakeOrchestrationPlatformReadinessDeclaration.readiness,
  consumerReadiness: IntakeOrchestrationPlatformReadinessDeclaration.readiness,
  downstreamReadiness: IntakeOrchestrationPlatformReadinessDeclaration.readiness,
  compositionMode: "CanonicalReferenceOnly" as const,
  dependencyChain:
    "NEA-7:6 → NEA-7:5 Manifest → NEA-7:4 Validation → NEA-7:3 Model → NEA-7:2 Registry → NEA-7:1 Foundation",
  upstreamManifestId: IntakeOrchestrationManifestId,
  upstreamManifestVersion: IntakeOrchestrationManifestVersion,
  consumerEntryPoint: "intakeOrchestrationPlatform.ts" as const,
  phaseComposition: ns.composition,
  composedPhaseCount: ns.composedPhaseCount,
  namespaceSectionCount: ns.sectionCount,
  architectureStatus:
    IntakeOrchestrationPlatformReadinessDeclaration.architectureStatus,
  ownership: IntakeOrchestrationPlatformOwnership,
  inventorySummary: Object.freeze({
    phaseReferenceCount: manifest.inventory.phaseReferenceCount,
    inventoryEntryCount: manifest.inventory.inventoryEntryCount,
    totalArchitectureCount: manifest.inventory.totalArchitectureCount,
  }),
  ownershipSummary: Object.freeze({
    ownsCount: IntakeOrchestrationPlatformOwnership.ownsCount,
    doesNotOwnCount: IntakeOrchestrationPlatformOwnership.doesNotOwnCount,
    prohibitedSurfaceCount:
      IntakeOrchestrationPlatformBoundaries.prohibitedSurfaceCount,
  }),
  compatibility: Object.freeze({
    compatibilityId: "NEA-7:6/Compatibility",
    requiresManifest: IntakeOrchestrationManifestId,
    requiresValidation: manifest.identity.validationId,
    compositionMode: "CanonicalReferenceOnly" as const,
    allowsReconstruction: false as const,
    allowsDuplication: false as const,
    metadataOnly: true as const,
  }),
  phaseReferenceCount: manifest.inventory.phaseReferenceCount,
  inventoryEntryCount: manifest.inventory.inventoryEntryCount,
  totalArchitectureCount: manifest.inventory.totalArchitectureCount,
  ownershipCount: IntakeOrchestrationPlatformOwnership.ownsCount,
  nonOwnershipCount: IntakeOrchestrationPlatformOwnership.doesNotOwnCount,
  prohibitedSurfaceCount:
    IntakeOrchestrationPlatformBoundaries.prohibitedSurfaceCount,
  runtimeBehavior: false as const,
  runtimeOrchestration: false as const,
  assemblesRuntimePackage: false as const,
  invokesDKL: false as const,
  countsHardcoded: false as const,
  countsReconstructed: false as const,
  duplicatesUpstreamArchitecture: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
