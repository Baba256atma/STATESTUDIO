/**
 * EIL-7:5 — Integration Governance Manifest Guarantees.
 *
 * Exactly sixteen immutable architectural guarantees.
 * Metadata-only. No runtime enforcement.
 *
 * Ownership: owned exclusively by EIL-7:5.
 */

import { IntegrationGovernanceValidationCanonicalId } from "./integrationGovernanceValidation.ts";

/** Closed guarantee key vocabulary. */
export type GovernanceManifestGuaranteeKey =
  | "CanonicalIdentity"
  | "NamespaceIntegrity"
  | "DependencyIntegrity"
  | "ValidationCompleteness"
  | "InventoryIntegrity"
  | "MetadataImmutability"
  | "DeterministicOrdering"
  | "ExportIntegrity"
  | "RuntimeIndependence"
  | "TypeIntegrity"
  | "CompatibilityIntegrity"
  | "ArchitectureIntegrity"
  | "GovernanceIntegrity"
  | "ValidationPass"
  | "ManifestCompleteness"
  | "PlatformReadiness";

/** Immutable guarantee descriptor. */
export interface IntegrationGovernanceManifestGuarantee {
  readonly guaranteeId: `EIL-7:5/Guarantee/${GovernanceManifestGuaranteeKey}`;
  readonly canonicalKey: GovernanceManifestGuaranteeKey;
  readonly canonicalName: string;
  readonly description: string;
  readonly order: number;
  readonly namespace: "nexora.eil.integration-governance.manifest";
  readonly sourceValidationId: typeof IntegrationGovernanceValidationCanonicalId;
  readonly executesRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

const guarantee = (
  key: GovernanceManifestGuaranteeKey,
  canonicalName: string,
  description: string,
  order: number,
): IntegrationGovernanceManifestGuarantee =>
  Object.freeze({
    guaranteeId: `EIL-7:5/Guarantee/${key}` as const,
    canonicalKey: key,
    canonicalName,
    description,
    order,
    namespace: "nexora.eil.integration-governance.manifest" as const,
    sourceValidationId: IntegrationGovernanceValidationCanonicalId,
    executesRuntime: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

/**
 * Exactly sixteen architectural guarantees in deterministic order.
 */
export const IntegrationGovernanceManifestGuarantees: readonly IntegrationGovernanceManifestGuarantee[] =
  Object.freeze([
    guarantee(
      "CanonicalIdentity",
      "Canonical Identity",
      "Canonical Validation and Manifest identity metadata remain consistent.",
      1,
    ),
    guarantee(
      "NamespaceIntegrity",
      "Namespace Integrity",
      "Canonical Governance namespaces remain architecturally consistent.",
      2,
    ),
    guarantee(
      "DependencyIntegrity",
      "Dependency Integrity",
      "Manifest depends exclusively on Validation; Validation depends on Model.",
      3,
    ),
    guarantee(
      "ValidationCompleteness",
      "Validation Completeness",
      "Validation categories, rules, and gates are architecturally complete.",
      4,
    ),
    guarantee(
      "InventoryIntegrity",
      "Inventory Integrity",
      "Manifest inventory references are derived exclusively from Validation.",
      5,
    ),
    guarantee(
      "MetadataImmutability",
      "Metadata Immutability",
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
      "ExportIntegrity",
      "Export Integrity",
      "Declared Manifest export surface remains architecturally intact.",
      8,
    ),
    guarantee(
      "RuntimeIndependence",
      "Runtime Independence",
      "Architecture remains free of governance runtime engines.",
      9,
    ),
    guarantee(
      "TypeIntegrity",
      "Type Integrity",
      "Strict TypeScript architectural integrity is preserved.",
      10,
    ),
    guarantee(
      "CompatibilityIntegrity",
      "Compatibility Integrity",
      "Compatibility declarations remain architecturally consistent.",
      11,
    ),
    guarantee(
      "ArchitectureIntegrity",
      "Architecture Integrity",
      "Foundation through Validation ladder consistency is preserved.",
      12,
    ),
    guarantee(
      "GovernanceIntegrity",
      "Governance Integrity",
      "Governance metadata integrity remains certified by Validation Pass.",
      13,
    ),
    guarantee(
      "ValidationPass",
      "Validation Pass",
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
