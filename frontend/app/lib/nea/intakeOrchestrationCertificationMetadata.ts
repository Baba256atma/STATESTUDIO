/**
 * NEA-7:7 — Intake Orchestration Certification Metadata.
 *
 * Immutable certification metadata including status, gates, and readiness.
 * Counts are derived exclusively from canonical certification collections.
 *
 * Ownership: owned exclusively by NEA-7:7.
 */

import { IntakeOrchestrationCertificationComplianceCatalog } from "./intakeOrchestrationCertificationCompliance.ts";
import {
  IntakeOrchestrationCertificationAllGatesPass,
  IntakeOrchestrationCertificationGateCatalog,
} from "./intakeOrchestrationCertificationGates.ts";
import {
  IntakeOrchestrationCertificationBoundaries,
  IntakeOrchestrationCertificationOwnership,
} from "./intakeOrchestrationCertificationOwnership.ts";
import {
  IntakeOrchestrationPlatform,
  IntakeOrchestrationPlatformId,
  IntakeOrchestrationPlatformVersion,
} from "./intakeOrchestrationPlatform.ts";

/** Canonical readiness value. */
export const IntakeOrchestrationCertificationReadinessValue =
  "ReadyForFreeze" as const;

/** Canonical immutable certification metadata. */
export const IntakeOrchestrationCertificationMetadata = Object.freeze({
  metadataId: "NEA-7:7/IntakeOrchestrationCertificationMetadata",
  sourcePhase: "NEA-7:7" as const,
  certificationVersion: "1.0.0" as const,
  certificationNamespace:
    "nexora.nea.intake-orchestration.certification" as const,
  certificationStatus: "Certification" as const,
  architectureVersion: IntakeOrchestrationPlatform.metadata.architectureVersion,
  certifiedPlatformId: IntakeOrchestrationPlatformId,
  certifiedPlatformVersion: IntakeOrchestrationPlatformVersion,
  certifiedArchitectureVersion:
    IntakeOrchestrationPlatform.metadata.architectureVersion,
  platformReference: IntakeOrchestrationPlatformId,
  dependencyChain:
    "NEA-7:7 → NEA-7:6 Platform → NEA-7:5 Manifest → NEA-7:4 Validation → NEA-7:3 Model → NEA-7:2 Registry → NEA-7:1 Foundation",
  readiness: IntakeOrchestrationCertificationReadinessValue,
  nextPhase: "NEA-7:8 — Intake Orchestration Freeze",
  gateSummary: Object.freeze({
    gateCount: IntakeOrchestrationCertificationGateCatalog.gateCount,
    passedGateCount:
      IntakeOrchestrationCertificationGateCatalog.passedGateCount,
    failedGateCount:
      IntakeOrchestrationCertificationGateCatalog.failedGateCount,
    allGatesPass: IntakeOrchestrationCertificationAllGatesPass,
  }),
  complianceSummary: Object.freeze({
    complianceCount:
      IntakeOrchestrationCertificationComplianceCatalog.complianceCount,
    allCompliant: IntakeOrchestrationCertificationComplianceCatalog.allCompliant,
  }),
  complianceCount:
    IntakeOrchestrationCertificationComplianceCatalog.complianceCount,
  allCompliant: IntakeOrchestrationCertificationComplianceCatalog.allCompliant,
  ownershipSummary: Object.freeze({
    ownsCount: IntakeOrchestrationCertificationOwnership.ownsCount,
    doesNotOwnCount: IntakeOrchestrationCertificationOwnership.doesNotOwnCount,
    prohibitedSurfaceCount:
      IntakeOrchestrationCertificationBoundaries.prohibitedSurfaceCount,
  }),
  ownershipCount: IntakeOrchestrationCertificationOwnership.ownsCount,
  nonOwnershipCount: IntakeOrchestrationCertificationOwnership.doesNotOwnCount,
  prohibitedSurfaceCount:
    IntakeOrchestrationCertificationBoundaries.prohibitedSurfaceCount,
  inventorySummary: Object.freeze({
    inventoryEntryCount:
      IntakeOrchestrationPlatform.metadata.inventoryEntryCount,
    totalArchitectureCount:
      IntakeOrchestrationPlatform.metadata.totalArchitectureCount,
    phaseReferenceCount:
      IntakeOrchestrationPlatform.metadata.phaseReferenceCount,
    composedPhaseCount:
      IntakeOrchestrationPlatform.metadata.composedPhaseCount,
    namespaceSectionCount:
      IntakeOrchestrationPlatform.metadata.namespaceSectionCount,
  }),
  inventoryEntryCount: IntakeOrchestrationPlatform.metadata.inventoryEntryCount,
  totalArchitectureCount:
    IntakeOrchestrationPlatform.metadata.totalArchitectureCount,
  phaseReferenceCount: IntakeOrchestrationPlatform.metadata.phaseReferenceCount,
  architectureSummary: Object.freeze({
    architectureVersion:
      IntakeOrchestrationPlatform.metadata.architectureVersion,
    composedPhaseCount:
      IntakeOrchestrationPlatform.metadata.composedPhaseCount,
    inventoryEntryCount:
      IntakeOrchestrationPlatform.metadata.inventoryEntryCount,
    totalArchitectureCount:
      IntakeOrchestrationPlatform.metadata.totalArchitectureCount,
    phaseReferenceCount:
      IntakeOrchestrationPlatform.metadata.phaseReferenceCount,
    namespaceSectionCount:
      IntakeOrchestrationPlatform.metadata.namespaceSectionCount,
  }),
  consumerSummary: Object.freeze({
    soleSupportedEntryPoint:
      IntakeOrchestrationPlatform.consumer.soleSupportedEntryPoint,
    consumerReady: IntakeOrchestrationPlatform.readiness.consumerReady,
    consumerAccessRule:
      IntakeOrchestrationPlatform.boundaries.consumerAccessRule,
  }),
  certificationOutcome:
    IntakeOrchestrationCertificationAllGatesPass &&
    IntakeOrchestrationCertificationComplianceCatalog.allCompliant
      ? ("Pass" as const)
      : ("Fail" as const),
  runtimeBehavior: false as const,
  runtimeCertification: false as const,
  executesValidation: false as const,
  assemblesRuntimePackage: false as const,
  invokesDKL: false as const,
  countsHardcoded: false as const,
  countsReconstructed: false as const,
  duplicatesPlatformArchitecture: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
