/**
 * EIL-3:6 — Integration Routing Platform Guarantees.
 *
 * Immutable platform guarantee declarations.
 * Descriptive only — no runtime enforcement.
 *
 * Ownership: owned exclusively by EIL-3:6.
 */

import type {
  RoutingPlatformGuarantee,
  RoutingPlatformGuaranteeKey,
} from "./integrationRoutingPlatformTypes.ts";

const guarantee = (
  key: RoutingPlatformGuaranteeKey,
  canonicalName: string,
  description: string,
  ordinal: number,
): RoutingPlatformGuarantee =>
  Object.freeze({
    guaranteeId: `EIL-3:6/Guarantee/${key}` as const,
    key,
    canonicalName,
    description,
    ownership: "EIL-3:6" as const,
    ordinal,
    tags: Object.freeze(["guarantee", key.toLowerCase()]),
    runtimeEnforced: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

/**
 * Exactly twelve platform guarantees.
 */
export const IntegrationRoutingPlatformGuarantees: readonly RoutingPlatformGuarantee[] =
  Object.freeze([
    guarantee(
      "CanonicalComposition",
      "Canonical composition",
      "Platform composition references upstream artifacts without duplication.",
      1,
    ),
    guarantee(
      "DeterministicIdentity",
      "Deterministic identity",
      "Platform identity remains canonical, immutable, and stable.",
      2,
    ),
    guarantee(
      "ImmutableMetadata",
      "Immutable metadata",
      "All platform metadata collections are deeply immutable.",
      3,
    ),
    guarantee(
      "InventoryIntegrity",
      "Inventory integrity",
      "Platform inventory is derived exclusively from Manifest collections.",
      4,
    ),
    guarantee(
      "DependencyIntegrity",
      "Dependency integrity",
      "Sole upstream dependency remains the Manifest aggregate entry point.",
      5,
    ),
    guarantee(
      "CompatibilityIntegrity",
      "Compatibility integrity",
      "Compatibility declarations remain complete and descriptive only.",
      6,
    ),
    guarantee(
      "NamespaceIntegrity",
      "Namespace integrity",
      "Namespace remains nexora.eil.integration-routing.platform without collision.",
      7,
    ),
    guarantee(
      "ArchitecturalCompleteness",
      "Architectural completeness",
      "Foundation through Manifest lineage is fully composed.",
      8,
    ),
    guarantee(
      "MetadataOnlyArchitecture",
      "Metadata-only architecture",
      "Platform remains free of routing engine, networking, and service behavior.",
      9,
    ),
    guarantee(
      "AggregateEntryPointIntegrity",
      "Aggregate entry point integrity",
      "IntegrationRoutingPlatform is the sole canonical Platform consumer entry point.",
      10,
    ),
    guarantee(
      "ReadinessIntegrity",
      "Readiness integrity",
      "Readiness remains ReadyForCertification without runtime claims.",
      11,
    ),
    guarantee(
      "ReleaseConsistency",
      "Release consistency",
      "Version and release lineage remain consistent across EIL-3 phases.",
      12,
    ),
  ]);
