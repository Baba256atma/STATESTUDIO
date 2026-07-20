/**
 * NEA-5:7 — Gateway Routing Certification Summary.
 *
 * Immutable summary helpers for Certification consumers.
 * Counts are derived exclusively from canonical Platform and Certification metadata.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by NEA-5:7.
 */

import { GatewayRoutingCertificationMetadata } from "./gatewayRoutingCertificationMetadata.ts";
import {
  GatewayRoutingCertificationBoundaries,
  GatewayRoutingCertificationOwnership,
} from "./gatewayRoutingCertificationOwnership.ts";
import { GatewayRoutingPlatformId } from "./gatewayRoutingPlatform.ts";
import type { GatewayRoutingCertificationSummary } from "./gatewayRoutingCertificationTypes.ts";

/** Certification identity constants used by summary composition. */
export const GATEWAY_ROUTING_CERTIFICATION_SUMMARY_IDENTITY = Object.freeze({
  certificationId: "NEA-5:7/GatewayRoutingCertification" as const,
  name: "Gateway Routing Certification" as const,
  version: "1.0.0" as const,
  namespace: "nexora.nea.gateway-routing.certification" as const,
  publicExportCount: 8 as const,
  sectionCount: 9 as const,
});

/**
 * Build deterministic frozen Certification summary.
 * Derived exclusively from canonical Certification collections.
 */
export function buildGatewayRoutingCertificationSummary(): GatewayRoutingCertificationSummary {
  const identity = GATEWAY_ROUTING_CERTIFICATION_SUMMARY_IDENTITY;
  const meta = GatewayRoutingCertificationMetadata;
  return Object.freeze({
    certificationId: identity.certificationId,
    version: identity.version,
    name: identity.name,
    namespace: identity.namespace,
    layer: "NEA" as const,
    phase: "NEA-5:7" as const,
    status: "Certification" as const,
    readiness: meta.readiness,
    platformId: GatewayRoutingPlatformId,
    gateCount: meta.gateSummary.gateCount,
    passedGateCount: meta.gateSummary.passedGateCount,
    failedGateCount: meta.gateSummary.failedGateCount,
    complianceCount: meta.complianceCount,
    ownershipCount: GatewayRoutingCertificationOwnership.ownsCount,
    nonOwnershipCount: GatewayRoutingCertificationOwnership.doesNotOwnCount,
    prohibitedSurfaceCount:
      GatewayRoutingCertificationBoundaries.prohibitedSurfaceCount,
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
export const GatewayRoutingCertificationSummaryCatalog = Object.freeze({
  catalogId: "NEA-5:7/CertificationSummaryCatalog",
  sourcePhase: "NEA-5:7" as const,
  buildSummary: buildGatewayRoutingCertificationSummary,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
