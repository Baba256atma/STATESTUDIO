/**
 * NEA-5:7 — Gateway Routing Certification Metadata.
 *
 * Immutable certification metadata including status, gates, and readiness.
 * Counts are derived exclusively from canonical certification collections.
 *
 * Ownership: owned exclusively by NEA-5:7.
 */

import { GatewayRoutingCertificationComplianceCatalog } from "./gatewayRoutingCertificationCompliance.ts";
import {
  GatewayRoutingCertificationAllGatesPass,
  GatewayRoutingCertificationGateCatalog,
} from "./gatewayRoutingCertificationGates.ts";
import {
  GatewayRoutingCertificationBoundaries,
  GatewayRoutingCertificationOwnership,
} from "./gatewayRoutingCertificationOwnership.ts";
import {
  GatewayRoutingPlatform,
  GatewayRoutingPlatformId,
  GatewayRoutingPlatformVersion,
} from "./gatewayRoutingPlatform.ts";

/** Canonical readiness value. */
export const GatewayRoutingCertificationReadinessValue =
  "ReadyForFreeze" as const;

/** Canonical immutable certification metadata. */
export const GatewayRoutingCertificationMetadata = Object.freeze({
  metadataId: "NEA-5:7/GatewayRoutingCertificationMetadata",
  sourcePhase: "NEA-5:7" as const,
  certificationVersion: "1.0.0" as const,
  certificationNamespace: "nexora.nea.gateway-routing.certification" as const,
  certificationStatus: "Certification" as const,
  architectureVersion: GatewayRoutingPlatform.metadata.architectureVersion,
  certifiedPlatformId: GatewayRoutingPlatformId,
  certifiedPlatformVersion: GatewayRoutingPlatformVersion,
  platformReference: GatewayRoutingPlatformId,
  readiness: GatewayRoutingCertificationReadinessValue,
  nextPhase: "NEA-5:8 — Gateway Routing Freeze",
  gateSummary: Object.freeze({
    gateCount: GatewayRoutingCertificationGateCatalog.gateCount,
    passedGateCount:
      GatewayRoutingCertificationGateCatalog.passedGateCount,
    failedGateCount:
      GatewayRoutingCertificationGateCatalog.failedGateCount,
    allGatesPass: GatewayRoutingCertificationAllGatesPass,
  }),
  complianceCount:
    GatewayRoutingCertificationComplianceCatalog.complianceCount,
  allCompliant: GatewayRoutingCertificationComplianceCatalog.allCompliant,
  ownershipCount: GatewayRoutingCertificationOwnership.ownsCount,
  nonOwnershipCount: GatewayRoutingCertificationOwnership.doesNotOwnCount,
  prohibitedSurfaceCount:
    GatewayRoutingCertificationBoundaries.prohibitedSurfaceCount,
  inventoryEntryCount: GatewayRoutingPlatform.metadata.inventoryEntryCount,
  totalArchitectureCount:
    GatewayRoutingPlatform.metadata.totalArchitectureCount,
  phaseReferenceCount: GatewayRoutingPlatform.metadata.phaseReferenceCount,
  certificationOutcome:
    GatewayRoutingCertificationAllGatesPass &&
    GatewayRoutingCertificationComplianceCatalog.allCompliant
      ? ("Pass" as const)
      : ("Fail" as const),
  countsHardcoded: false as const,
  countsReconstructed: false as const,
  duplicatesPlatformArchitecture: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
