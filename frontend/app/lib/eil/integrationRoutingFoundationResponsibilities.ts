/**
 * EIL-3:1 — Integration Routing Foundation Responsibilities.
 *
 * Declared architectural responsibilities for the Integration Routing Platform.
 * Metadata only — no runtime execution.
 *
 * Ownership: owned exclusively by EIL-3:1.
 */

import type {
  RoutingResponsibility,
  RoutingResponsibilityId,
} from "./integrationRoutingFoundationTypes.ts";

const responsibility = (
  responsibilityId: RoutingResponsibilityId,
  responsibilityName: string,
  description: string,
  order: number,
): RoutingResponsibility =>
  Object.freeze({
    responsibilityId,
    responsibilityName,
    description,
    ownedByEil3: true as const,
    executesRuntime: false as const,
    performsBusinessLogic: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

/**
 * Exactly eight declared Integration Routing Foundation responsibilities.
 */
export const IntegrationRoutingFoundationResponsibilities: readonly RoutingResponsibility[] =
  Object.freeze([
    responsibility(
      "PreserveRouteIdentity",
      "Preserve route identity",
      "Preserve canonical route identities across EIL-3 without mutation.",
      1,
    ),
    responsibility(
      "PreserveArchitecturalBoundaries",
      "Preserve architectural boundaries",
      "Preserve Nexora architectural boundaries when declaring routing metadata.",
      2,
    ),
    responsibility(
      "PublishRouteMetadata",
      "Publish route metadata",
      "Publish canonical routing categories, contracts, and terminology for downstream phases.",
      3,
    ),
    responsibility(
      "PreserveCompatibility",
      "Preserve compatibility",
      "Preserve declarative compatibility rules for route definitions.",
      4,
    ),
    responsibility(
      "PreserveDeterministicInventories",
      "Preserve deterministic inventories",
      "Preserve deterministic inventories derived from canonical routing collections.",
      5,
    ),
    responsibility(
      "PreserveDependencyDirection",
      "Preserve dependency direction",
      "Preserve approved dependency direction without circular route ownership.",
      6,
    ),
    responsibility(
      "SupportFutureRuntimePlatforms",
      "Support future runtime platforms",
      "Support future routing runtime platforms by freezing metadata without implementing them.",
      7,
    ),
    responsibility(
      "PreserveArchitecturalConsistency",
      "Preserve architectural consistency",
      "Preserve architectural consistency of routing metadata across the EIL-3 ladder.",
      8,
    ),
  ]);

/** Canonical immutable responsibilities catalog. */
export const IntegrationRoutingFoundationResponsibilityCatalog =
  Object.freeze({
    catalogId: "EIL-3:1/IntegrationRoutingFoundationResponsibilities",
    sourcePhase: "EIL-3:1" as const,
    responsibilities: IntegrationRoutingFoundationResponsibilities,
    responsibilityCount:
      IntegrationRoutingFoundationResponsibilities.length,
    executesRuntime: false as const,
    performsBusinessLogic: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
