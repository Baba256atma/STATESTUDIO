/**
 * NEA-7:5 — Intake Orchestration Manifest Metadata.
 *
 * Immutable manifest metadata envelope.
 * Counts are derived exclusively from canonical inventory collections.
 *
 * Ownership: owned exclusively by NEA-7:5.
 */

import { IntakeOrchestrationManifestInventoryCatalog } from "./intakeOrchestrationManifestInventory.ts";
import {
  IntakeOrchestrationManifestBoundaries,
  IntakeOrchestrationManifestOwnership,
} from "./intakeOrchestrationManifestOwnership.ts";
import { IntakeOrchestrationManifestReadinessDeclaration } from "./intakeOrchestrationManifestReadiness.ts";
import {
  IntakeOrchestrationValidationId,
  IntakeOrchestrationValidationVersion,
} from "./intakeOrchestrationValidation.ts";

/** Canonical immutable manifest metadata. */
export const IntakeOrchestrationManifestMetadata = Object.freeze({
  metadataId: "NEA-7:5/IntakeOrchestrationManifestMetadata",
  sourcePhase: "NEA-7:5" as const,
  architectureVersion: "NEA-7.0.0" as const,
  manifestVersion: "1.0.0" as const,
  namespace: "nexora.nea.intake-orchestration.manifest" as const,
  phase: "NEA-7:5" as const,
  status: "Manifest" as const,
  readiness: IntakeOrchestrationManifestReadinessDeclaration.readiness,
  compositionMode: "CanonicalReferenceOnly" as const,
  upstreamValidationId: IntakeOrchestrationValidationId,
  upstreamValidationVersion: IntakeOrchestrationValidationVersion,
  upstreamPhaseReferences:
    IntakeOrchestrationManifestInventoryCatalog.phaseReferences,
  inventoryStatus: "DerivedFromCanonicalCollections" as const,
  readinessStatus: IntakeOrchestrationManifestReadinessDeclaration.readiness,
  dependencyChain:
    "NEA-7:5 → NEA-7:4 Validation → NEA-7:3 Model → NEA-7:2 Registry → NEA-7:1 Foundation",
  inventorySummary: Object.freeze({
    inventoryEntryCount:
      IntakeOrchestrationManifestInventoryCatalog.inventoryEntryCount,
    totalArchitectureCount:
      IntakeOrchestrationManifestInventoryCatalog.totalArchitectureCount,
    phaseReferenceCount:
      IntakeOrchestrationManifestInventoryCatalog.phaseReferenceCount,
  }),
  ownershipSummary: Object.freeze({
    ownsCount: IntakeOrchestrationManifestOwnership.ownsCount,
    doesNotOwnCount: IntakeOrchestrationManifestOwnership.doesNotOwnCount,
    prohibitedSurfaceCount:
      IntakeOrchestrationManifestBoundaries.prohibitedSurfaceCount,
  }),
  inventory: IntakeOrchestrationManifestInventoryCatalog,
  phaseReferenceCount:
    IntakeOrchestrationManifestInventoryCatalog.phaseReferenceCount,
  inventoryEntryCount:
    IntakeOrchestrationManifestInventoryCatalog.inventoryEntryCount,
  totalArchitectureCount:
    IntakeOrchestrationManifestInventoryCatalog.totalArchitectureCount,
  ownershipCount: IntakeOrchestrationManifestOwnership.ownsCount,
  nonOwnershipCount: IntakeOrchestrationManifestOwnership.doesNotOwnCount,
  prohibitedSurfaceCount:
    IntakeOrchestrationManifestBoundaries.prohibitedSurfaceCount,
  countsHardcoded: false as const,
  countsReconstructed: false as const,
  duplicatesUpstreamCollections: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
