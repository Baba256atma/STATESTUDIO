/**
 * NEA-2:7 — Channel Connectors Certification Metadata.
 *
 * Immutable certification metadata including status, gates, and readiness.
 * Counts are derived exclusively from canonical certification collections.
 *
 * Ownership: owned exclusively by NEA-2:7.
 */

import { ChannelConnectorCertificationComplianceCatalog } from "./channelConnectorCertificationCompliance.ts";
import {
  ChannelConnectorCertificationAllGatesPass,
  ChannelConnectorCertificationGateCatalog,
} from "./channelConnectorCertificationGates.ts";
import {
  ChannelConnectorCertificationBoundaries,
  ChannelConnectorCertificationOwnership,
} from "./channelConnectorCertificationOwnership.ts";
import {
  ChannelConnectorPlatformId,
  ChannelConnectorPlatformVersion,
} from "./channelConnectorPlatform.ts";

/** Canonical readiness value. */
export const ChannelConnectorCertificationReadinessValue =
  "ReadyForFreeze" as const;

/** Canonical immutable certification metadata. */
export const ChannelConnectorCertificationMetadata = Object.freeze({
  metadataId: "NEA-2:7/ChannelConnectorCertificationMetadata",
  sourcePhase: "NEA-2:7" as const,
  certificationStatus: "Certification" as const,
  certificationVersion: "1.0.0" as const,
  certifiedPlatformId: ChannelConnectorPlatformId,
  certifiedPlatformVersion: ChannelConnectorPlatformVersion,
  readiness: ChannelConnectorCertificationReadinessValue,
  nextPhase: "NEA-2:8 — Channel Connectors Freeze",
  gateSummary: Object.freeze({
    gateCount: ChannelConnectorCertificationGateCatalog.gateCount,
    passedGateCount: ChannelConnectorCertificationGateCatalog.passedGateCount,
    failedGateCount: ChannelConnectorCertificationGateCatalog.failedGateCount,
    allGatesPass: ChannelConnectorCertificationAllGatesPass,
  }),
  complianceCount:
    ChannelConnectorCertificationComplianceCatalog.complianceCount,
  allCompliant: ChannelConnectorCertificationComplianceCatalog.allCompliant,
  ownershipCount: ChannelConnectorCertificationOwnership.ownsCount,
  nonOwnershipCount: ChannelConnectorCertificationOwnership.doesNotOwnCount,
  prohibitedSurfaceCount:
    ChannelConnectorCertificationBoundaries.prohibitedSurfaceCount,
  certificationOutcome:
    ChannelConnectorCertificationAllGatesPass &&
    ChannelConnectorCertificationComplianceCatalog.allCompliant
      ? ("Pass" as const)
      : ("Fail" as const),
  countsHardcoded: false as const,
  countsReconstructed: false as const,
  duplicatesPlatformArchitecture: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
