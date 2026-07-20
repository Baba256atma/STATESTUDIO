/**
 * NEA-2:7 — Channel Connectors Certification Summary.
 *
 * Immutable summary helpers for Certification consumers.
 * Counts are derived exclusively from canonical Platform and Certification metadata.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by NEA-2:7.
 */

import { ChannelConnectorCertificationMetadata } from "./channelConnectorCertificationMetadata.ts";
import {
  ChannelConnectorCertificationBoundaries,
  ChannelConnectorCertificationOwnership,
} from "./channelConnectorCertificationOwnership.ts";
import { ChannelConnectorPlatformId } from "./channelConnectorPlatform.ts";
import type { ChannelConnectorCertificationSummary } from "./channelConnectorCertificationTypes.ts";

/** Certification identity constants used by summary composition. */
export const CHANNEL_CONNECTOR_CERTIFICATION_SUMMARY_IDENTITY = Object.freeze({
  certificationId: "NEA-2:7/ChannelConnectorCertification" as const,
  name: "Channel Connectors Certification" as const,
  version: "1.0.0" as const,
  namespace: "nexora.nea.channel-connectors.certification" as const,
  publicExportCount: 8 as const,
  sectionCount: 9 as const,
});

/**
 * Build deterministic frozen Certification summary.
 * Derived exclusively from canonical Certification collections.
 */
export function buildChannelConnectorCertificationSummary(): ChannelConnectorCertificationSummary {
  const identity = CHANNEL_CONNECTOR_CERTIFICATION_SUMMARY_IDENTITY;
  const meta = ChannelConnectorCertificationMetadata;
  return Object.freeze({
    certificationId: identity.certificationId,
    version: identity.version,
    name: identity.name,
    namespace: identity.namespace,
    layer: "NEA" as const,
    phase: "NEA-2:7" as const,
    status: "Certification" as const,
    readiness: meta.readiness,
    platformId: ChannelConnectorPlatformId,
    gateCount: meta.gateSummary.gateCount,
    passedGateCount: meta.gateSummary.passedGateCount,
    failedGateCount: meta.gateSummary.failedGateCount,
    complianceCount: meta.complianceCount,
    ownershipCount: ChannelConnectorCertificationOwnership.ownsCount,
    nonOwnershipCount: ChannelConnectorCertificationOwnership.doesNotOwnCount,
    prohibitedSurfaceCount:
      ChannelConnectorCertificationBoundaries.prohibitedSurfaceCount,
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
export const ChannelConnectorCertificationSummaryCatalog = Object.freeze({
  catalogId: "NEA-2:7/CertificationSummaryCatalog",
  sourcePhase: "NEA-2:7" as const,
  buildSummary: buildChannelConnectorCertificationSummary,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
