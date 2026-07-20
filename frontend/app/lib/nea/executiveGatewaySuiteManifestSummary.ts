/**
 * NEA-8:5 — Executive Gateway Suite Manifest Summary.
 *
 * Immutable summary helpers for Manifest consumers.
 * Counts are derived exclusively from canonical metadata collections.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by NEA-8:5.
 */

import { ExecutiveGatewaySuiteManifestInventoryCatalog } from "./executiveGatewaySuiteManifestInventory.ts";
import {
  ExecutiveGatewaySuiteManifestBoundaries,
  ExecutiveGatewaySuiteManifestOwnership,
} from "./executiveGatewaySuiteManifestOwnership.ts";
import { ExecutiveGatewaySuiteManifestReadinessDeclaration } from "./executiveGatewaySuiteManifestReadiness.ts";
import type { ExecutiveGatewaySuiteManifestSummary } from "./executiveGatewaySuiteManifestTypes.ts";
import { ExecutiveGatewaySuiteValidationId } from "./executiveGatewaySuiteValidation.ts";

/** Manifest identity constants used by summary composition. */
export const EXECUTIVE_GATEWAY_SUITE_MANIFEST_SUMMARY_IDENTITY = Object.freeze({
  manifestId: "NEA-8:5/ExecutiveGatewaySuiteManifest" as const,
  name: "Executive Gateway Suite Manifest" as const,
  version: "1.0.0" as const,
  namespace: "nexora.nea.executive-gateway-suite.manifest" as const,
  publicExportCount: 8 as const,
  sectionCount: 9 as const,
});

/**
 * Build deterministic frozen Manifest summary.
 * Derived exclusively from canonical Manifest collections and Validation.
 */
export function buildExecutiveGatewaySuiteManifestSummary(): ExecutiveGatewaySuiteManifestSummary {
  const identity = EXECUTIVE_GATEWAY_SUITE_MANIFEST_SUMMARY_IDENTITY;
  const inventory = ExecutiveGatewaySuiteManifestInventoryCatalog;
  return Object.freeze({
    manifestId: identity.manifestId,
    version: identity.version,
    name: identity.name,
    namespace: identity.namespace,
    layer: "NEA" as const,
    phase: "NEA-8:5" as const,
    status: "Manifest" as const,
    readiness: ExecutiveGatewaySuiteManifestReadinessDeclaration.readiness,
    validationId: ExecutiveGatewaySuiteValidationId,
    suiteName: "Executive Gateway Suite" as const,
    phaseReferenceCount: inventory.phaseReferenceCount,
    inventoryEntryCount: inventory.inventoryEntryCount,
    totalArchitectureCount: inventory.totalArchitectureCount,
    publicApiInventoryTotal: inventory.publicApiInventoryTotal,
    ownershipCount: ExecutiveGatewaySuiteManifestOwnership.ownsCount,
    nonOwnershipCount: ExecutiveGatewaySuiteManifestOwnership.doesNotOwnCount,
    prohibitedSurfaceCount:
      ExecutiveGatewaySuiteManifestBoundaries.prohibitedSurfaceCount,
    publicExportCount: identity.publicExportCount,
    sectionCount: identity.sectionCount,
    nextPhase: ExecutiveGatewaySuiteManifestReadinessDeclaration.nextPhase,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
}

/** Frozen summary snapshot for catalog consumers. */
export const ExecutiveGatewaySuiteManifestSummaryCatalog = Object.freeze({
  catalogId: "NEA-8:5/ManifestSummaryCatalog",
  sourcePhase: "NEA-8:5" as const,
  architectureSummary: Object.freeze({
    phaseReferenceCount:
      ExecutiveGatewaySuiteManifestInventoryCatalog.phaseReferenceCount,
    compositionMode: "CanonicalReferenceOnly" as const,
  }),
  inventorySummary: Object.freeze({
    inventoryEntryCount:
      ExecutiveGatewaySuiteManifestInventoryCatalog.inventoryEntryCount,
    totalArchitectureCount:
      ExecutiveGatewaySuiteManifestInventoryCatalog.totalArchitectureCount,
    publicApiInventoryTotal:
      ExecutiveGatewaySuiteManifestInventoryCatalog.publicApiInventoryTotal,
  }),
  canonicalDependencySummary: Object.freeze({
    countingRule: ExecutiveGatewaySuiteManifestInventoryCatalog.countingRule,
    validationId: ExecutiveGatewaySuiteValidationId,
  }),
  readinessSummary: Object.freeze({
    readiness: ExecutiveGatewaySuiteManifestReadinessDeclaration.readiness,
    nextPhase: ExecutiveGatewaySuiteManifestReadinessDeclaration.nextPhase,
  }),
  buildSummary: buildExecutiveGatewaySuiteManifestSummary,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
