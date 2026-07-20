/**
 * NEA-6:7 — Message Normalization Certification Metadata.
 *
 * Immutable certification metadata including status, gates, and readiness.
 * Counts are derived exclusively from canonical certification collections.
 *
 * Ownership: owned exclusively by NEA-6:7.
 */

import { MessageNormalizationCertificationComplianceCatalog } from "./messageNormalizationCertificationCompliance.ts";
import {
  MessageNormalizationCertificationAllGatesPass,
  MessageNormalizationCertificationGateCatalog,
} from "./messageNormalizationCertificationGates.ts";
import {
  MessageNormalizationCertificationBoundaries,
  MessageNormalizationCertificationOwnership,
} from "./messageNormalizationCertificationOwnership.ts";
import {
  MessageNormalizationPlatform,
  MessageNormalizationPlatformId,
  MessageNormalizationPlatformVersion,
} from "./messageNormalizationPlatform.ts";

/** Canonical readiness value. */
export const MessageNormalizationCertificationReadinessValue =
  "ReadyForFreeze" as const;

/** Canonical immutable certification metadata. */
export const MessageNormalizationCertificationMetadata = Object.freeze({
  metadataId: "NEA-6:7/MessageNormalizationCertificationMetadata",
  sourcePhase: "NEA-6:7" as const,
  certificationVersion: "1.0.0" as const,
  certificationNamespace:
    "nexora.nea.message-normalization.certification" as const,
  certificationStatus: "Certification" as const,
  architectureVersion: MessageNormalizationPlatform.metadata.architectureVersion,
  certifiedPlatformId: MessageNormalizationPlatformId,
  certifiedPlatformVersion: MessageNormalizationPlatformVersion,
  certifiedArchitectureVersion:
    MessageNormalizationPlatform.metadata.architectureVersion,
  platformReference: MessageNormalizationPlatformId,
  readiness: MessageNormalizationCertificationReadinessValue,
  nextPhase: "NEA-6:8 — Message Normalization Freeze",
  gateSummary: Object.freeze({
    gateCount: MessageNormalizationCertificationGateCatalog.gateCount,
    passedGateCount:
      MessageNormalizationCertificationGateCatalog.passedGateCount,
    failedGateCount:
      MessageNormalizationCertificationGateCatalog.failedGateCount,
    allGatesPass: MessageNormalizationCertificationAllGatesPass,
  }),
  complianceSummary: Object.freeze({
    complianceCount:
      MessageNormalizationCertificationComplianceCatalog.complianceCount,
    allCompliant: MessageNormalizationCertificationComplianceCatalog.allCompliant,
  }),
  complianceCount:
    MessageNormalizationCertificationComplianceCatalog.complianceCount,
  allCompliant: MessageNormalizationCertificationComplianceCatalog.allCompliant,
  ownershipCount: MessageNormalizationCertificationOwnership.ownsCount,
  nonOwnershipCount: MessageNormalizationCertificationOwnership.doesNotOwnCount,
  prohibitedSurfaceCount:
    MessageNormalizationCertificationBoundaries.prohibitedSurfaceCount,
  inventoryEntryCount: MessageNormalizationPlatform.metadata.inventoryEntryCount,
  totalArchitectureCount:
    MessageNormalizationPlatform.metadata.totalArchitectureCount,
  phaseReferenceCount: MessageNormalizationPlatform.metadata.phaseReferenceCount,
  architectureSummary: Object.freeze({
    architectureVersion:
      MessageNormalizationPlatform.metadata.architectureVersion,
    composedPhaseCount:
      MessageNormalizationPlatform.metadata.composedPhaseCount,
    inventoryEntryCount:
      MessageNormalizationPlatform.metadata.inventoryEntryCount,
    totalArchitectureCount:
      MessageNormalizationPlatform.metadata.totalArchitectureCount,
    phaseReferenceCount:
      MessageNormalizationPlatform.metadata.phaseReferenceCount,
  }),
  consumerSummary: Object.freeze({
    soleSupportedEntryPoint:
      MessageNormalizationPlatform.consumer.soleSupportedEntryPoint,
    consumerReady: MessageNormalizationPlatform.readiness.consumerReady,
    consumerAccessRule:
      MessageNormalizationPlatform.boundaries.consumerAccessRule,
  }),
  certificationOutcome:
    MessageNormalizationCertificationAllGatesPass &&
    MessageNormalizationCertificationComplianceCatalog.allCompliant
      ? ("Pass" as const)
      : ("Fail" as const),
  countsHardcoded: false as const,
  countsReconstructed: false as const,
  duplicatesPlatformArchitecture: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
