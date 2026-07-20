/**
 * NEA-4:7 — Security Gateway Certification Metadata.
 *
 * Immutable certification metadata including status, gates, and readiness.
 * Counts are derived exclusively from canonical certification collections.
 *
 * Ownership: owned exclusively by NEA-4:7.
 */

import { SecurityGatewayCertificationComplianceCatalog } from "./securityGatewayCertificationCompliance.ts";
import {
  SecurityGatewayCertificationAllGatesPass,
  SecurityGatewayCertificationGateCatalog,
} from "./securityGatewayCertificationGates.ts";
import {
  SecurityGatewayCertificationBoundaries,
  SecurityGatewayCertificationOwnership,
} from "./securityGatewayCertificationOwnership.ts";
import {
  SecurityGatewayPlatform,
  SecurityGatewayPlatformId,
  SecurityGatewayPlatformVersion,
} from "./securityGatewayPlatform.ts";

/** Canonical readiness value. */
export const SecurityGatewayCertificationReadinessValue =
  "ReadyForFreeze" as const;

/** Canonical immutable certification metadata. */
export const SecurityGatewayCertificationMetadata = Object.freeze({
  metadataId: "NEA-4:7/SecurityGatewayCertificationMetadata",
  sourcePhase: "NEA-4:7" as const,
  certificationVersion: "1.0.0" as const,
  certificationStatus: "Certification" as const,
  architectureVersion: SecurityGatewayPlatform.metadata.architectureVersion,
  certifiedPlatformId: SecurityGatewayPlatformId,
  certifiedPlatformVersion: SecurityGatewayPlatformVersion,
  platformReference: SecurityGatewayPlatformId,
  readiness: SecurityGatewayCertificationReadinessValue,
  nextPhase: "NEA-4:8 — Security Gateway Freeze",
  gateSummary: Object.freeze({
    gateCount: SecurityGatewayCertificationGateCatalog.gateCount,
    passedGateCount:
      SecurityGatewayCertificationGateCatalog.passedGateCount,
    failedGateCount:
      SecurityGatewayCertificationGateCatalog.failedGateCount,
    allGatesPass: SecurityGatewayCertificationAllGatesPass,
  }),
  complianceCount:
    SecurityGatewayCertificationComplianceCatalog.complianceCount,
  allCompliant: SecurityGatewayCertificationComplianceCatalog.allCompliant,
  ownershipCount: SecurityGatewayCertificationOwnership.ownsCount,
  nonOwnershipCount: SecurityGatewayCertificationOwnership.doesNotOwnCount,
  prohibitedSurfaceCount:
    SecurityGatewayCertificationBoundaries.prohibitedSurfaceCount,
  inventoryEntryCount: SecurityGatewayPlatform.metadata.inventoryEntryCount,
  totalArchitectureCount:
    SecurityGatewayPlatform.metadata.totalArchitectureCount,
  phaseReferenceCount: SecurityGatewayPlatform.metadata.phaseReferenceCount,
  certificationOutcome:
    SecurityGatewayCertificationAllGatesPass &&
    SecurityGatewayCertificationComplianceCatalog.allCompliant
      ? ("Pass" as const)
      : ("Fail" as const),
  countsHardcoded: false as const,
  countsReconstructed: false as const,
  duplicatesPlatformArchitecture: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
