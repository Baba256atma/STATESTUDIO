/**
 * NEA-3:7 — Session & Conversation Certification Summary.
 *
 * Immutable summary helpers for Certification consumers.
 * Counts are derived exclusively from canonical Platform and Certification metadata.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by NEA-3:7.
 */

import { SessionConversationCertificationMetadata } from "./sessionConversationCertificationMetadata.ts";
import {
  SessionConversationCertificationBoundaries,
  SessionConversationCertificationOwnership,
} from "./sessionConversationCertificationOwnership.ts";
import { SessionConversationPlatformId } from "./sessionConversationPlatform.ts";
import type { SessionConversationCertificationSummary } from "./sessionConversationCertificationTypes.ts";

/** Certification identity constants used by summary composition. */
export const SESSION_CONVERSATION_CERTIFICATION_SUMMARY_IDENTITY =
  Object.freeze({
    certificationId: "NEA-3:7/SessionConversationCertification" as const,
    name: "Session & Conversation Certification" as const,
    version: "1.0.0" as const,
    namespace: "nexora.nea.session-conversation.certification" as const,
    publicExportCount: 8 as const,
    sectionCount: 9 as const,
  });

/**
 * Build deterministic frozen Certification summary.
 * Derived exclusively from canonical Certification collections.
 */
export function buildSessionConversationCertificationSummary(): SessionConversationCertificationSummary {
  const identity = SESSION_CONVERSATION_CERTIFICATION_SUMMARY_IDENTITY;
  const meta = SessionConversationCertificationMetadata;
  return Object.freeze({
    certificationId: identity.certificationId,
    version: identity.version,
    name: identity.name,
    namespace: identity.namespace,
    layer: "NEA" as const,
    phase: "NEA-3:7" as const,
    status: "Certification" as const,
    readiness: meta.readiness,
    platformId: SessionConversationPlatformId,
    gateCount: meta.gateSummary.gateCount,
    passedGateCount: meta.gateSummary.passedGateCount,
    failedGateCount: meta.gateSummary.failedGateCount,
    complianceCount: meta.complianceCount,
    ownershipCount: SessionConversationCertificationOwnership.ownsCount,
    nonOwnershipCount: SessionConversationCertificationOwnership.doesNotOwnCount,
    prohibitedSurfaceCount:
      SessionConversationCertificationBoundaries.prohibitedSurfaceCount,
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
export const SessionConversationCertificationSummaryCatalog = Object.freeze({
  catalogId: "NEA-3:7/CertificationSummaryCatalog",
  sourcePhase: "NEA-3:7" as const,
  buildSummary: buildSessionConversationCertificationSummary,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
