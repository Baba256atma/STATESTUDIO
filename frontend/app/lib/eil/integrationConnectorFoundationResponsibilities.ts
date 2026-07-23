/**
 * EIL-2:1 — Integration Connector Foundation Responsibilities.
 *
 * Declared architectural responsibilities for the Integration Connector Platform.
 * Metadata only — no runtime execution.
 *
 * Ownership: owned exclusively by EIL-2:1.
 */

import type {
  IntegrationConnectorResponsibility,
  IntegrationConnectorResponsibilityId,
} from "./integrationConnectorFoundationTypes.ts";

const responsibility = (
  responsibilityId: IntegrationConnectorResponsibilityId,
  responsibilityName: string,
  description: string,
  order: number,
): IntegrationConnectorResponsibility =>
  Object.freeze({
    responsibilityId,
    responsibilityName,
    description,
    ownedByEil2: true as const,
    executesRuntime: false as const,
    performsBusinessLogic: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

/**
 * Exactly eight declared Integration Connector Foundation responsibilities.
 */
export const IntegrationConnectorFoundationResponsibilities: readonly IntegrationConnectorResponsibility[] =
  Object.freeze([
    responsibility(
      "PreserveConnectorIdentity",
      "Preserve connector identity",
      "Preserve canonical connector identities across EIL-2 without mutation.",
      1,
    ),
    responsibility(
      "PreservePlatformBoundaries",
      "Preserve platform boundaries",
      "Preserve Nexora platform boundaries when declaring connector metadata.",
      2,
    ),
    responsibility(
      "ExposeConnectorMetadata",
      "Expose connector metadata",
      "Expose canonical connector categories, contracts, and terminology for downstream phases.",
      3,
    ),
    responsibility(
      "MaintainCompatibility",
      "Maintain compatibility",
      "Maintain declarative compatibility rules for connector definitions.",
      4,
    ),
    responsibility(
      "MaintainDeterministicInventories",
      "Maintain deterministic inventories",
      "Maintain deterministic inventories derived from canonical connector collections.",
      5,
    ),
    responsibility(
      "PreserveDependencyDirection",
      "Preserve dependency direction",
      "Preserve approved dependency direction without circular connector ownership.",
      6,
    ),
    responsibility(
      "SupportFutureRuntimePlatforms",
      "Support future runtime platforms",
      "Support future connector runtime platforms by freezing metadata without implementing them.",
      7,
    ),
    responsibility(
      "MaintainArchitecturalConsistency",
      "Maintain architectural consistency",
      "Maintain architectural consistency of connector metadata across the EIL-2 ladder.",
      8,
    ),
  ]);

/** Canonical immutable responsibilities catalog. */
export const IntegrationConnectorFoundationResponsibilityCatalog =
  Object.freeze({
    catalogId: "EIL-2:1/IntegrationConnectorFoundationResponsibilities",
    sourcePhase: "EIL-2:1" as const,
    responsibilities: IntegrationConnectorFoundationResponsibilities,
    responsibilityCount:
      IntegrationConnectorFoundationResponsibilities.length,
    executesRuntime: false as const,
    performsBusinessLogic: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
