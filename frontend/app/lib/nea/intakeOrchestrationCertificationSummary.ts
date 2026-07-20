/**
 * NEA-7:7 — Intake Orchestration Certification Summary.
 *
 * Immutable summary helpers for Certification consumers.
 * Counts are derived exclusively from canonical Platform and Certification metadata.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by NEA-7:7.
 */

import { IntakeOrchestrationCertificationMetadata } from "./intakeOrchestrationCertificationMetadata.ts";
import {
  IntakeOrchestrationCertificationBoundaries,
  IntakeOrchestrationCertificationOwnership,
} from "./intakeOrchestrationCertificationOwnership.ts";
import { IntakeOrchestrationPlatformId } from "./intakeOrchestrationPlatform.ts";
import type { IntakeOrchestrationCertificationSummary } from "./intakeOrchestrationCertificationTypes.ts";

/** Certification identity constants used by summary composition. */
export const INTAKE_ORCHESTRATION_CERTIFICATION_SUMMARY_IDENTITY =
  Object.freeze({
    certificationId: "NEA-7:7/IntakeOrchestrationCertification" as const,
    name: "Intake Orchestration Certification" as const,
    version: "1.0.0" as const,
    namespace: "nexora.nea.intake-orchestration.certification" as const,
    publicExportCount: 8 as const,
    sectionCount: 9 as const,
  });

/**
 * Build deterministic frozen Certification summary.
 * Derived exclusively from canonical Certification collections.
 */
export function buildIntakeOrchestrationCertificationSummary(): IntakeOrchestrationCertificationSummary {
  const identity = INTAKE_ORCHESTRATION_CERTIFICATION_SUMMARY_IDENTITY;
  const meta = IntakeOrchestrationCertificationMetadata;
  return Object.freeze({
    certificationId: identity.certificationId,
    version: identity.version,
    name: identity.name,
    namespace: identity.namespace,
    layer: "NEA" as const,
    phase: "NEA-7:7" as const,
    status: "Certification" as const,
    readiness: meta.readiness,
    platformId: IntakeOrchestrationPlatformId,
    architectureVersion: meta.architectureVersion,
    gateCount: meta.gateSummary.gateCount,
    passedGateCount: meta.gateSummary.passedGateCount,
    failedGateCount: meta.gateSummary.failedGateCount,
    complianceCount: meta.complianceCount,
    composedPhaseCount: meta.architectureSummary.composedPhaseCount,
    inventoryEntryCount: meta.inventoryEntryCount,
    totalArchitectureCount: meta.totalArchitectureCount,
    namespaceSectionCount: meta.architectureSummary.namespaceSectionCount,
    ownershipCount: IntakeOrchestrationCertificationOwnership.ownsCount,
    nonOwnershipCount: IntakeOrchestrationCertificationOwnership.doesNotOwnCount,
    prohibitedSurfaceCount:
      IntakeOrchestrationCertificationBoundaries.prohibitedSurfaceCount,
    publicExportCount: identity.publicExportCount,
    sectionCount: identity.sectionCount,
    certificationOutcome: meta.certificationOutcome,
    nextPhase: meta.nextPhase,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
}

/** Frozen summary catalog for composition consumers. */
export const IntakeOrchestrationCertificationSummaryCatalog = Object.freeze({
  catalogId: "NEA-7:7/CertificationSummaryCatalog",
  sourcePhase: "NEA-7:7" as const,
  buildSummary: buildIntakeOrchestrationCertificationSummary,
  gateSummary: IntakeOrchestrationCertificationMetadata.gateSummary,
  complianceSummary: IntakeOrchestrationCertificationMetadata.complianceSummary,
  architectureSummary:
    IntakeOrchestrationCertificationMetadata.architectureSummary,
  inventorySummary: IntakeOrchestrationCertificationMetadata.inventorySummary,
  consumerSummary: IntakeOrchestrationCertificationMetadata.consumerSummary,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
