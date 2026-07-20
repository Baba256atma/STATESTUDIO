/**
 * NEA-1:7 — Executive Gateway Certification Summary.
 *
 * Immutable summary helpers for Certification consumers.
 * Counts are derived exclusively from canonical Platform and Certification metadata.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by NEA-1:7.
 */

import { ExecutiveGatewayCertificationMetadata } from "./executiveGatewayCertificationMetadata.ts";
import {
  ExecutiveGatewayCertificationBoundaries,
  ExecutiveGatewayCertificationOwnership,
} from "./executiveGatewayCertificationOwnership.ts";
import { ExecutiveGatewayPlatformId } from "./executiveGatewayPlatform.ts";
import type { ExecutiveGatewayCertificationSummary } from "./executiveGatewayCertificationTypes.ts";

/** Certification identity constants used by summary composition. */
export const EXECUTIVE_GATEWAY_CERTIFICATION_SUMMARY_IDENTITY = Object.freeze({
  certificationId: "NEA-1:7/ExecutiveGatewayCertification" as const,
  name: "Executive Gateway Certification" as const,
  version: "1.0.0" as const,
  namespace: "nexora.nea.executive-gateway.certification" as const,
  publicExportCount: 8 as const,
  sectionCount: 9 as const,
});

/**
 * Build deterministic frozen Certification summary.
 * Derived exclusively from canonical Certification collections.
 */
export function buildExecutiveGatewayCertificationSummary(): ExecutiveGatewayCertificationSummary {
  const identity = EXECUTIVE_GATEWAY_CERTIFICATION_SUMMARY_IDENTITY;
  const meta = ExecutiveGatewayCertificationMetadata;
  return Object.freeze({
    certificationId: identity.certificationId,
    version: identity.version,
    name: identity.name,
    namespace: identity.namespace,
    layer: "NEA" as const,
    phase: "NEA-1:7" as const,
    status: "Certification" as const,
    readiness: meta.readiness,
    platformId: ExecutiveGatewayPlatformId,
    gateCount: meta.gateSummary.gateCount,
    passedGateCount: meta.gateSummary.passedGateCount,
    failedGateCount: meta.gateSummary.failedGateCount,
    complianceCount: meta.complianceCount,
    ownershipCount: ExecutiveGatewayCertificationOwnership.ownsCount,
    nonOwnershipCount: ExecutiveGatewayCertificationOwnership.doesNotOwnCount,
    prohibitedSurfaceCount:
      ExecutiveGatewayCertificationBoundaries.prohibitedSurfaceCount,
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
export const ExecutiveGatewayCertificationSummaryCatalog = Object.freeze({
  catalogId: "NEA-1:7/CertificationSummaryCatalog",
  sourcePhase: "NEA-1:7" as const,
  buildSummary: buildExecutiveGatewayCertificationSummary,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
