/**
 * NEA-6:7 — Message Normalization Certification Summary.
 *
 * Immutable summary helpers for Certification consumers.
 * Counts are derived exclusively from canonical Platform and Certification metadata.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by NEA-6:7.
 */

import { MessageNormalizationCertificationMetadata } from "./messageNormalizationCertificationMetadata.ts";
import {
  MessageNormalizationCertificationBoundaries,
  MessageNormalizationCertificationOwnership,
} from "./messageNormalizationCertificationOwnership.ts";
import { MessageNormalizationPlatformId } from "./messageNormalizationPlatform.ts";
import type { MessageNormalizationCertificationSummary } from "./messageNormalizationCertificationTypes.ts";

/** Certification identity constants used by summary composition. */
export const MESSAGE_NORMALIZATION_CERTIFICATION_SUMMARY_IDENTITY =
  Object.freeze({
    certificationId: "NEA-6:7/MessageNormalizationCertification" as const,
    name: "Message Normalization Certification" as const,
    version: "1.0.0" as const,
    namespace: "nexora.nea.message-normalization.certification" as const,
    publicExportCount: 8 as const,
    sectionCount: 9 as const,
  });

/**
 * Build deterministic frozen Certification summary.
 * Derived exclusively from canonical Certification collections.
 */
export function buildMessageNormalizationCertificationSummary(): MessageNormalizationCertificationSummary {
  const identity = MESSAGE_NORMALIZATION_CERTIFICATION_SUMMARY_IDENTITY;
  const meta = MessageNormalizationCertificationMetadata;
  return Object.freeze({
    certificationId: identity.certificationId,
    version: identity.version,
    name: identity.name,
    namespace: identity.namespace,
    layer: "NEA" as const,
    phase: "NEA-6:7" as const,
    status: "Certification" as const,
    readiness: meta.readiness,
    platformId: MessageNormalizationPlatformId,
    gateCount: meta.gateSummary.gateCount,
    passedGateCount: meta.gateSummary.passedGateCount,
    failedGateCount: meta.gateSummary.failedGateCount,
    complianceCount: meta.complianceCount,
    ownershipCount: MessageNormalizationCertificationOwnership.ownsCount,
    nonOwnershipCount: MessageNormalizationCertificationOwnership.doesNotOwnCount,
    prohibitedSurfaceCount:
      MessageNormalizationCertificationBoundaries.prohibitedSurfaceCount,
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
export const MessageNormalizationCertificationSummaryCatalog = Object.freeze({
  catalogId: "NEA-6:7/CertificationSummaryCatalog",
  sourcePhase: "NEA-6:7" as const,
  buildSummary: buildMessageNormalizationCertificationSummary,
  gateSummary: MessageNormalizationCertificationMetadata.gateSummary,
  complianceSummary: MessageNormalizationCertificationMetadata.complianceSummary,
  architectureSummary:
    MessageNormalizationCertificationMetadata.architectureSummary,
  consumerSummary: MessageNormalizationCertificationMetadata.consumerSummary,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
