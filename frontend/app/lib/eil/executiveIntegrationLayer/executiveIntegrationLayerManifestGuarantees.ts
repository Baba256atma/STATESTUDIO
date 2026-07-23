/**
 * EIL-9:5 — Executive Integration Layer Manifest Guarantees.
 *
 * Exactly sixteen immutable architectural guarantees.
 * Metadata-only. No runtime enforcement.
 *
 * Ownership: owned exclusively by EIL-9:5.
 */

import { ExecutiveIntegrationLayerValidationCanonicalId } from "./executiveIntegrationLayerValidation.ts";

/** Closed guarantee key vocabulary. */
export type LayerManifestGuaranteeKey =
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
  | "LayerCompositionIntegrity"
  | "ValidationPass"
  | "ManifestCompleteness"
  | "PlatformReadiness";

/** Immutable guarantee descriptor. */
export interface ExecutiveIntegrationLayerManifestGuarantee {
  readonly guaranteeId: `EIL-9:5/Guarantee/${LayerManifestGuaranteeKey}`;
  readonly canonicalKey: LayerManifestGuaranteeKey;
  readonly canonicalName: string;
  readonly description: string;
  readonly order: number;
  readonly namespace: "nexora.eil.executive-integration-layer.manifest";
  readonly sourceValidationId: typeof ExecutiveIntegrationLayerValidationCanonicalId;
  readonly executesRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

const guarantee = (
  key: LayerManifestGuaranteeKey,
  canonicalName: string,
  description: string,
  order: number,
): ExecutiveIntegrationLayerManifestGuarantee =>
  Object.freeze({
    guaranteeId: `EIL-9:5/Guarantee/${key}` as const,
    canonicalKey: key,
    canonicalName,
    description,
    order,
    namespace: "nexora.eil.executive-integration-layer.manifest" as const,
    sourceValidationId: ExecutiveIntegrationLayerValidationCanonicalId,
    executesRuntime: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

/**
 * Exactly sixteen architectural guarantees in deterministic order.
 */
export const ExecutiveIntegrationLayerManifestGuarantees: readonly ExecutiveIntegrationLayerManifestGuarantee[] =
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
      "Canonical Layer namespaces remain architecturally consistent.",
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
      "Architecture remains free of integration runtime engines.",
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
      "LayerCompositionIntegrity",
      "Layer Composition Integrity",
      "Layer Suite composition integrity remains certified by Validation Pass.",
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
