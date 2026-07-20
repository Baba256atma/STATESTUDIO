/**
 * NEA-1:7 — Executive Gateway Certification Metadata.
 *
 * Immutable certification metadata including status, gates, and readiness.
 * Counts are derived exclusively from canonical certification collections.
 *
 * Ownership: owned exclusively by NEA-1:7.
 */

import { ExecutiveGatewayCertificationComplianceCatalog } from "./executiveGatewayCertificationCompliance.ts";
import {
  ExecutiveGatewayCertificationAllGatesPass,
  ExecutiveGatewayCertificationGateCatalog,
} from "./executiveGatewayCertificationGates.ts";
import {
  ExecutiveGatewayCertificationBoundaries,
  ExecutiveGatewayCertificationOwnership,
} from "./executiveGatewayCertificationOwnership.ts";
import {
  ExecutiveGatewayPlatformId,
  ExecutiveGatewayPlatformVersion,
} from "./executiveGatewayPlatform.ts";

/** Canonical readiness value. */
export const ExecutiveGatewayCertificationReadinessValue =
  "ReadyForFreeze" as const;

/** Canonical immutable certification metadata. */
export const ExecutiveGatewayCertificationMetadata = Object.freeze({
  metadataId: "NEA-1:7/ExecutiveGatewayCertificationMetadata",
  sourcePhase: "NEA-1:7" as const,
  certificationStatus: "Certification" as const,
  certificationVersion: "1.0.0" as const,
  certifiedPlatformId: ExecutiveGatewayPlatformId,
  certifiedPlatformVersion: ExecutiveGatewayPlatformVersion,
  readiness: ExecutiveGatewayCertificationReadinessValue,
  nextPhase: "NEA-1:8 — Executive Gateway Freeze",
  gateSummary: Object.freeze({
    gateCount: ExecutiveGatewayCertificationGateCatalog.gateCount,
    passedGateCount: ExecutiveGatewayCertificationGateCatalog.passedGateCount,
    failedGateCount: ExecutiveGatewayCertificationGateCatalog.failedGateCount,
    allGatesPass: ExecutiveGatewayCertificationAllGatesPass,
  }),
  complianceCount:
    ExecutiveGatewayCertificationComplianceCatalog.complianceCount,
  allCompliant: ExecutiveGatewayCertificationComplianceCatalog.allCompliant,
  ownershipCount: ExecutiveGatewayCertificationOwnership.ownsCount,
  nonOwnershipCount: ExecutiveGatewayCertificationOwnership.doesNotOwnCount,
  prohibitedSurfaceCount:
    ExecutiveGatewayCertificationBoundaries.prohibitedSurfaceCount,
  certificationOutcome:
    ExecutiveGatewayCertificationAllGatesPass &&
    ExecutiveGatewayCertificationComplianceCatalog.allCompliant
      ? ("Pass" as const)
      : ("Fail" as const),
  countsHardcoded: false as const,
  countsReconstructed: false as const,
  duplicatesPlatformArchitecture: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
