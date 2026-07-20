/**
 * NEA-3:7 — Session & Conversation Certification Metadata.
 *
 * Immutable certification metadata including status, gates, and readiness.
 * Counts are derived exclusively from canonical certification collections.
 *
 * Ownership: owned exclusively by NEA-3:7.
 */

import { SessionConversationCertificationComplianceCatalog } from "./sessionConversationCertificationCompliance.ts";
import {
  SessionConversationCertificationAllGatesPass,
  SessionConversationCertificationGateCatalog,
} from "./sessionConversationCertificationGates.ts";
import {
  SessionConversationCertificationBoundaries,
  SessionConversationCertificationOwnership,
} from "./sessionConversationCertificationOwnership.ts";
import {
  SessionConversationPlatformId,
  SessionConversationPlatformVersion,
} from "./sessionConversationPlatform.ts";

/** Canonical readiness value. */
export const SessionConversationCertificationReadinessValue =
  "ReadyForFreeze" as const;

/** Canonical immutable certification metadata. */
export const SessionConversationCertificationMetadata = Object.freeze({
  metadataId: "NEA-3:7/SessionConversationCertificationMetadata",
  sourcePhase: "NEA-3:7" as const,
  certificationStatus: "Certification" as const,
  certificationVersion: "1.0.0" as const,
  certifiedPlatformId: SessionConversationPlatformId,
  certifiedPlatformVersion: SessionConversationPlatformVersion,
  readiness: SessionConversationCertificationReadinessValue,
  nextPhase: "NEA-3:8 — Session & Conversation Freeze",
  gateSummary: Object.freeze({
    gateCount: SessionConversationCertificationGateCatalog.gateCount,
    passedGateCount:
      SessionConversationCertificationGateCatalog.passedGateCount,
    failedGateCount:
      SessionConversationCertificationGateCatalog.failedGateCount,
    allGatesPass: SessionConversationCertificationAllGatesPass,
  }),
  complianceCount:
    SessionConversationCertificationComplianceCatalog.complianceCount,
  allCompliant: SessionConversationCertificationComplianceCatalog.allCompliant,
  ownershipCount: SessionConversationCertificationOwnership.ownsCount,
  nonOwnershipCount: SessionConversationCertificationOwnership.doesNotOwnCount,
  prohibitedSurfaceCount:
    SessionConversationCertificationBoundaries.prohibitedSurfaceCount,
  certificationOutcome:
    SessionConversationCertificationAllGatesPass &&
    SessionConversationCertificationComplianceCatalog.allCompliant
      ? ("Pass" as const)
      : ("Fail" as const),
  countsHardcoded: false as const,
  countsReconstructed: false as const,
  duplicatesPlatformArchitecture: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
