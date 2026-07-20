/**
 * NEA-4:7 — Security Gateway Certification Summary.
 *
 * Immutable summary helpers for Certification consumers.
 * Counts are derived exclusively from canonical Platform and Certification metadata.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by NEA-4:7.
 */

import { SecurityGatewayCertificationMetadata } from "./securityGatewayCertificationMetadata.ts";
import {
  SecurityGatewayCertificationBoundaries,
  SecurityGatewayCertificationOwnership,
} from "./securityGatewayCertificationOwnership.ts";
import { SecurityGatewayPlatformId } from "./securityGatewayPlatform.ts";
import type { SecurityGatewayCertificationSummary } from "./securityGatewayCertificationTypes.ts";

/** Certification identity constants used by summary composition. */
export const SECURITY_GATEWAY_CERTIFICATION_SUMMARY_IDENTITY = Object.freeze({
  certificationId: "NEA-4:7/SecurityGatewayCertification" as const,
  name: "Security Gateway Certification" as const,
  version: "1.0.0" as const,
  namespace: "nexora.nea.security-gateway.certification" as const,
  publicExportCount: 8 as const,
  sectionCount: 9 as const,
});

/**
 * Build deterministic frozen Certification summary.
 * Derived exclusively from canonical Certification collections.
 */
export function buildSecurityGatewayCertificationSummary(): SecurityGatewayCertificationSummary {
  const identity = SECURITY_GATEWAY_CERTIFICATION_SUMMARY_IDENTITY;
  const meta = SecurityGatewayCertificationMetadata;
  return Object.freeze({
    certificationId: identity.certificationId,
    version: identity.version,
    name: identity.name,
    namespace: identity.namespace,
    layer: "NEA" as const,
    phase: "NEA-4:7" as const,
    status: "Certification" as const,
    readiness: meta.readiness,
    platformId: SecurityGatewayPlatformId,
    gateCount: meta.gateSummary.gateCount,
    passedGateCount: meta.gateSummary.passedGateCount,
    failedGateCount: meta.gateSummary.failedGateCount,
    complianceCount: meta.complianceCount,
    ownershipCount: SecurityGatewayCertificationOwnership.ownsCount,
    nonOwnershipCount: SecurityGatewayCertificationOwnership.doesNotOwnCount,
    prohibitedSurfaceCount:
      SecurityGatewayCertificationBoundaries.prohibitedSurfaceCount,
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
export const SecurityGatewayCertificationSummaryCatalog = Object.freeze({
  catalogId: "NEA-4:7/CertificationSummaryCatalog",
  sourcePhase: "NEA-4:7" as const,
  buildSummary: buildSecurityGatewayCertificationSummary,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
