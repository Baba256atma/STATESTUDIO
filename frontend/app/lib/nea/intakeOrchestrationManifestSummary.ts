/**
 * NEA-7:5 — Intake Orchestration Manifest Summary.
 *
 * Immutable summary helpers for Manifest consumers.
 * Counts are derived exclusively from canonical metadata collections.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by NEA-7:5.
 */

import { IntakeOrchestrationManifestInventoryCatalog } from "./intakeOrchestrationManifestInventory.ts";
import {
  IntakeOrchestrationManifestBoundaries,
  IntakeOrchestrationManifestOwnership,
} from "./intakeOrchestrationManifestOwnership.ts";
import { IntakeOrchestrationManifestReadinessDeclaration } from "./intakeOrchestrationManifestReadiness.ts";
import type { IntakeOrchestrationManifestSummary } from "./intakeOrchestrationManifestTypes.ts";
import { IntakeOrchestrationValidationId } from "./intakeOrchestrationValidation.ts";

/** Manifest identity constants used by summary composition. */
export const INTAKE_ORCHESTRATION_MANIFEST_SUMMARY_IDENTITY = Object.freeze({
  manifestId: "NEA-7:5/IntakeOrchestrationManifest" as const,
  name: "Intake Orchestration Manifest" as const,
  version: "1.0.0" as const,
  namespace: "nexora.nea.intake-orchestration.manifest" as const,
  publicExportCount: 8 as const,
  sectionCount: 9 as const,
});

/**
 * Build deterministic frozen Manifest summary.
 * Derived exclusively from canonical Manifest collections.
 */
export function buildIntakeOrchestrationManifestSummary(): IntakeOrchestrationManifestSummary {
  const identity = INTAKE_ORCHESTRATION_MANIFEST_SUMMARY_IDENTITY;
  const inventory = IntakeOrchestrationManifestInventoryCatalog;
  return Object.freeze({
    manifestId: identity.manifestId,
    version: identity.version,
    name: identity.name,
    namespace: identity.namespace,
    layer: "NEA" as const,
    phase: "NEA-7:5" as const,
    status: "Manifest" as const,
    readiness: IntakeOrchestrationManifestReadinessDeclaration.readiness,
    validationId: IntakeOrchestrationValidationId,
    phaseReferenceCount: inventory.phaseReferenceCount,
    inventoryEntryCount: inventory.inventoryEntryCount,
    totalArchitectureCount: inventory.totalArchitectureCount,
    ownershipCount: IntakeOrchestrationManifestOwnership.ownsCount,
    nonOwnershipCount: IntakeOrchestrationManifestOwnership.doesNotOwnCount,
    prohibitedSurfaceCount:
      IntakeOrchestrationManifestBoundaries.prohibitedSurfaceCount,
    publicExportCount: identity.publicExportCount,
    sectionCount: identity.sectionCount,
    nextPhase: IntakeOrchestrationManifestReadinessDeclaration.nextPhase,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
}

/** Frozen summary snapshot for catalog consumers. */
export const IntakeOrchestrationManifestSummaryCatalog = Object.freeze({
  catalogId: "NEA-7:5/ManifestSummaryCatalog",
  sourcePhase: "NEA-7:5" as const,
  architectureSummary: Object.freeze({
    phaseReferenceCount:
      IntakeOrchestrationManifestInventoryCatalog.phaseReferenceCount,
    compositionMode: "CanonicalReferenceOnly" as const,
  }),
  inventorySummary: Object.freeze({
    inventoryEntryCount:
      IntakeOrchestrationManifestInventoryCatalog.inventoryEntryCount,
    totalArchitectureCount:
      IntakeOrchestrationManifestInventoryCatalog.totalArchitectureCount,
  }),
  canonicalDependencySummary: Object.freeze({
    countingRule: IntakeOrchestrationManifestInventoryCatalog.countingRule,
    validationId: IntakeOrchestrationValidationId,
  }),
  readinessSummary: Object.freeze({
    readiness: IntakeOrchestrationManifestReadinessDeclaration.readiness,
    nextPhase: IntakeOrchestrationManifestReadinessDeclaration.nextPhase,
  }),
  buildSummary: buildIntakeOrchestrationManifestSummary,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
