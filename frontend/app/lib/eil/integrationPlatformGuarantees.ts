/**
 * EIL-1:6 — Integration Platform Guarantees.
 *
 * Immutable platform guarantee declarations.
 * Descriptive only — no runtime enforcement.
 *
 * Ownership: owned exclusively by EIL-1:6.
 */

import type {
  IntegrationPlatformGuarantee,
  IntegrationPlatformGuaranteeKey,
} from "./integrationPlatformTypes.ts";

const guarantee = (
  key: IntegrationPlatformGuaranteeKey,
  canonicalName: string,
  description: string,
  ordinal: number,
): IntegrationPlatformGuarantee =>
  Object.freeze({
    guaranteeId: `EIL-1:6/Guarantee/${key}` as const,
    key,
    canonicalName,
    description,
    ownership: "EIL-1:6" as const,
    ordinal,
    tags: Object.freeze(["guarantee", key.toLowerCase()]),
    runtimeEnforced: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

/**
 * Exactly twelve platform guarantees.
 */
export const IntegrationPlatformGuarantees: readonly IntegrationPlatformGuarantee[] =
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
      "Namespace remains nexora.eil.integration.platform without collision.",
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
      "Platform remains free of runtime, networking, and service behavior.",
      9,
    ),
    guarantee(
      "AggregateEntryPointIntegrity",
      "Aggregate entry point integrity",
      "IntegrationPlatform is the sole canonical Platform consumer entry point.",
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
      "Version and release lineage remain consistent across EIL-1 phases.",
      12,
    ),
  ]);
