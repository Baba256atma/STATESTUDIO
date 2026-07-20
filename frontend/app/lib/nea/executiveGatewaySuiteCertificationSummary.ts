/**
 * NEA-8:7 — Executive Gateway Suite Certification Summary.
 *
 * Immutable summary helpers for Certification consumers.
 * Counts are derived exclusively from canonical Platform and Certification metadata.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by NEA-8:7.
 */

import { ExecutiveGatewaySuiteCertificationMetadata } from "./executiveGatewaySuiteCertificationMetadata.ts";
import {
  ExecutiveGatewaySuiteCertificationBoundaries,
  ExecutiveGatewaySuiteCertificationOwnership,
} from "./executiveGatewaySuiteCertificationOwnership.ts";
import { ExecutiveGatewaySuitePlatformId } from "./executiveGatewaySuitePlatform.ts";
import type { ExecutiveGatewaySuiteCertificationSummary } from "./executiveGatewaySuiteCertificationTypes.ts";

/** Certification identity constants used by summary composition. */
export const EXECUTIVE_GATEWAY_SUITE_CERTIFICATION_SUMMARY_IDENTITY =
  Object.freeze({
    certificationId: "NEA-8:7/ExecutiveGatewaySuiteCertification" as const,
    name: "Executive Gateway Suite Certification" as const,
    version: "1.0.0" as const,
    namespace: "nexora.nea.executive-gateway-suite.certification" as const,
    publicExportCount: 8 as const,
    sectionCount: 9 as const,
  });

/**
 * Build deterministic frozen Certification summary.
 * Derived exclusively from canonical Certification collections and Platform.
 */
export function buildExecutiveGatewaySuiteCertificationSummary(): ExecutiveGatewaySuiteCertificationSummary {
  const identity = EXECUTIVE_GATEWAY_SUITE_CERTIFICATION_SUMMARY_IDENTITY;
  const meta = ExecutiveGatewaySuiteCertificationMetadata;
  return Object.freeze({
    certificationId: identity.certificationId,
    version: identity.version,
    name: identity.name,
    namespace: identity.namespace,
    layer: "NEA" as const,
    phase: "NEA-8:7" as const,
    status: "Certification" as const,
    readiness: meta.readiness,
    platformId: ExecutiveGatewaySuitePlatformId,
    suiteName: "Executive Gateway Suite" as const,
    architectureVersion: meta.architectureVersion,
    gateCount: meta.gateSummary.gateCount,
    passedGateCount: meta.gateSummary.passedGateCount,
    failedGateCount: meta.gateSummary.failedGateCount,
    complianceCount: meta.complianceCount,
    composedPhaseCount: meta.architectureSummary.composedPhaseCount,
    suiteComponentCount: meta.architectureSummary.suiteComponentCount,
    inventoryEntryCount: meta.inventoryEntryCount,
    totalArchitectureCount: meta.totalArchitectureCount,
    publicApiInventoryTotal: meta.publicApiInventoryTotal,
    namespaceSectionCount: meta.architectureSummary.namespaceSectionCount,
    ownershipCount: ExecutiveGatewaySuiteCertificationOwnership.ownsCount,
    nonOwnershipCount:
      ExecutiveGatewaySuiteCertificationOwnership.doesNotOwnCount,
    prohibitedSurfaceCount:
      ExecutiveGatewaySuiteCertificationBoundaries.prohibitedSurfaceCount,
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
export const ExecutiveGatewaySuiteCertificationSummaryCatalog = Object.freeze({
  catalogId: "NEA-8:7/CertificationSummaryCatalog",
  sourcePhase: "NEA-8:7" as const,
  buildSummary: buildExecutiveGatewaySuiteCertificationSummary,
  gateSummary: ExecutiveGatewaySuiteCertificationMetadata.gateSummary,
  complianceSummary:
    ExecutiveGatewaySuiteCertificationMetadata.complianceSummary,
  architectureSummary:
    ExecutiveGatewaySuiteCertificationMetadata.architectureSummary,
  inventorySummary: ExecutiveGatewaySuiteCertificationMetadata.inventorySummary,
  consumerSummary: ExecutiveGatewaySuiteCertificationMetadata.consumerSummary,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
