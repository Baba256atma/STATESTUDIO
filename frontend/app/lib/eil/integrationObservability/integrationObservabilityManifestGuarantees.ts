/**
 * EIL-6:5 — Integration Observability Manifest Guarantees.
 *
 * Exactly sixteen immutable architectural guarantees.
 * Metadata-only. No runtime enforcement.
 *
 * Ownership: owned exclusively by EIL-6:5.
 */

import { IntegrationObservabilityValidationCanonicalId } from "./integrationObservabilityValidation.ts";

/** Closed guarantee key vocabulary. */
export type ObservabilityManifestGuaranteeKey =
  | "CanonicalIdentityGuaranteed"
  | "NamespaceGuaranteed"
  | "DependencyIntegrityGuaranteed"
  | "ValidationComplete"
  | "InventoryDerived"
  | "ImmutableMetadata"
  | "DeterministicOrdering"
  | "StablePublicSurface"
  | "RuntimeIndependence"
  | "TypeSafety"
  | "ExportIntegrity"
  | "ArchitectureConsistency"
  | "ReadinessIntegrity"
  | "ValidationPassGuaranteed"
  | "ManifestCompleteness"
  | "PlatformReadiness";

/** Immutable guarantee descriptor. */
export interface IntegrationObservabilityManifestGuarantee {
  readonly guaranteeId: `EIL-6:5/Guarantee/${ObservabilityManifestGuaranteeKey}`;
  readonly canonicalKey: ObservabilityManifestGuaranteeKey;
  readonly canonicalName: string;
  readonly description: string;
  readonly order: number;
  readonly namespace: "nexora.eil.integration-observability.manifest";
  readonly sourceValidationId: typeof IntegrationObservabilityValidationCanonicalId;
  readonly executesRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

const guarantee = (
  key: ObservabilityManifestGuaranteeKey,
  canonicalName: string,
  description: string,
  order: number,
): IntegrationObservabilityManifestGuarantee =>
  Object.freeze({
    guaranteeId: `EIL-6:5/Guarantee/${key}` as const,
    canonicalKey: key,
    canonicalName,
    description,
    order,
    namespace: "nexora.eil.integration-observability.manifest" as const,
    sourceValidationId: IntegrationObservabilityValidationCanonicalId,
    executesRuntime: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

/**
 * Exactly sixteen architectural guarantees in deterministic order.
 */
export const IntegrationObservabilityManifestGuarantees: readonly IntegrationObservabilityManifestGuarantee[] =
  Object.freeze([
    guarantee(
      "CanonicalIdentityGuaranteed",
      "Canonical Identity Guaranteed",
      "Canonical Validation and Manifest identity metadata remain consistent.",
      1,
    ),
    guarantee(
      "NamespaceGuaranteed",
      "Namespace Guaranteed",
      "Canonical Observability namespaces remain architecturally consistent.",
      2,
    ),
    guarantee(
      "DependencyIntegrityGuaranteed",
      "Dependency Integrity Guaranteed",
      "Manifest depends exclusively on Validation; Validation depends on Model.",
      3,
    ),
    guarantee(
      "ValidationComplete",
      "Validation Complete",
      "Validation categories, rules, and gates are architecturally complete.",
      4,
    ),
    guarantee(
      "InventoryDerived",
      "Inventory Derived",
      "Manifest inventory references are derived exclusively from Validation.",
      5,
    ),
    guarantee(
      "ImmutableMetadata",
      "Immutable Metadata",
      "Published architectural metadata remains frozen and immutable.",
      6,
    ),
    guarantee(
      "DeterministicOrdering",
      "Deterministic Ordering",
      "Validation and Manifest collections preserve deterministic ordering.",
      7,
    ),
    guarantee(
      "StablePublicSurface",
      "Stable Public Surface",
      "Package public surface remains the sole supported consumer entry.",
      8,
    ),
    guarantee(
      "RuntimeIndependence",
      "Runtime Independence",
      "Architecture remains free of observability runtime engines.",
      9,
    ),
    guarantee(
      "TypeSafety",
      "Type Safety",
      "Strict TypeScript architectural integrity is preserved.",
      10,
    ),
    guarantee(
      "ExportIntegrity",
      "Export Integrity",
      "Declared Manifest export surface remains architecturally intact.",
      11,
    ),
    guarantee(
      "ArchitectureConsistency",
      "Architecture Consistency",
      "Foundation through Validation ladder consistency is preserved.",
      12,
    ),
    guarantee(
      "ReadinessIntegrity",
      "Readiness Integrity",
      "Readiness transitions remain canonical and non-skipping.",
      13,
    ),
    guarantee(
      "ValidationPassGuaranteed",
      "Validation Pass Guaranteed",
      "Validation aggregate result remains declared Pass.",
      14,
    ),
    guarantee(
      "ManifestCompleteness",
      "Manifest Completeness",
      "Manifest identity, guarantees, compatibility, dependencies, and exports are complete.",
      15,
    ),
    guarantee(
      "PlatformReadiness",
      "Platform Readiness",
      "Manifest readiness declares ReadyForPlatform.",
      16,
    ),
  ]);
