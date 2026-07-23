/**
 * EIL-8:7 — Executive Integration Suite Certification Criteria.
 *
 * Exactly eighteen immutable certification criteria.
 * Declarative metadata only. No certification execution.
 *
 * Ownership: owned exclusively by EIL-8:7.
 */

import { ExecutiveIntegrationSuitePlatformCanonicalId } from "./executiveIntegrationSuitePlatform.ts";

/** Closed certification-criterion key vocabulary. */
export type SuiteCertificationCriterionKey =
  | "CanonicalIdentityCertified"
  | "NamespaceCertified"
  | "DependencyIntegrityCertified"
  | "FoundationCompositionCertified"
  | "RegistryCompositionCertified"
  | "ModelCompositionCertified"
  | "ValidationCompositionCertified"
  | "ManifestCompositionCertified"
  | "PlatformCompositionCertified"
  | "MetadataIntegrityCertified"
  | "InventoryIntegrityCertified"
  | "CompatibilityCertified"
  | "ExportSurfaceCertified"
  | "TypeIntegrityCertified"
  | "ArchitectureIntegrityCertified"
  | "RuntimeIndependenceCertified"
  | "PlatformReadinessCertified"
  | "FreezeReadinessCertified";

/** Immutable certification criterion descriptor. */
export interface ExecutiveIntegrationSuiteCertificationCriterion {
  readonly criterionId: `EIL-8:7/Criterion/${SuiteCertificationCriterionKey}`;
  readonly canonicalKey: SuiteCertificationCriterionKey;
  readonly canonicalName: string;
  readonly description: string;
  readonly order: number;
  readonly namespace: "nexora.eil.executive-integration-suite.certification";
  readonly sourcePlatformId: typeof ExecutiveIntegrationSuitePlatformCanonicalId;
  readonly executesRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

const criterion = (
  key: SuiteCertificationCriterionKey,
  canonicalName: string,
  description: string,
  order: number,
): ExecutiveIntegrationSuiteCertificationCriterion =>
  Object.freeze({
    criterionId: `EIL-8:7/Criterion/${key}` as const,
    canonicalKey: key,
    canonicalName,
    description,
    order,
    namespace: "nexora.eil.executive-integration-suite.certification" as const,
    sourcePlatformId: ExecutiveIntegrationSuitePlatformCanonicalId,
    executesRuntime: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

/**
 * Exactly eighteen certification criteria in deterministic order.
 */
export const ExecutiveIntegrationSuiteCertificationCriteria: readonly ExecutiveIntegrationSuiteCertificationCriterion[] =
  Object.freeze([
    criterion(
      "CanonicalIdentityCertified",
      "Canonical Identity Certified",
      "Platform and Certification canonical identity metadata are certified.",
      1,
    ),
    criterion(
      "NamespaceCertified",
      "Namespace Certified",
      "Canonical Suite namespaces are certified.",
      2,
    ),
    criterion(
      "DependencyIntegrityCertified",
      "Dependency Integrity Certified",
      "Platform Manifest-only dependency integrity is certified.",
      3,
    ),
    criterion(
      "FoundationCompositionCertified",
      "Foundation Composition Certified",
      "Foundation composition reference integrity is certified.",
      4,
    ),
    criterion(
      "RegistryCompositionCertified",
      "Registry Composition Certified",
      "Registry composition reference integrity is certified.",
      5,
    ),
    criterion(
      "ModelCompositionCertified",
      "Model Composition Certified",
      "Model composition reference integrity is certified.",
      6,
    ),
    criterion(
      "ValidationCompositionCertified",
      "Validation Composition Certified",
      "Validation composition reference integrity is certified.",
      7,
    ),
    criterion(
      "ManifestCompositionCertified",
      "Manifest Composition Certified",
      "Manifest composition reference integrity is certified.",
      8,
    ),
    criterion(
      "PlatformCompositionCertified",
      "Platform Composition Certified",
      "Platform composition aggregate integrity is certified.",
      9,
    ),
    criterion(
      "MetadataIntegrityCertified",
      "Metadata Integrity Certified",
      "Metadata-only architectural integrity is certified.",
      10,
    ),
    criterion(
      "InventoryIntegrityCertified",
      "Inventory Integrity Certified",
      "Platform-derived inventory integrity is certified without redefinition.",
      11,
    ),
    criterion(
      "CompatibilityCertified",
      "Compatibility Certified",
      "Platform compatibility declarations are certified.",
      12,
    ),
    criterion(
      "ExportSurfaceCertified",
      "Export Surface Certified",
      "Package export surface integrity is certified.",
      13,
    ),
    criterion(
      "TypeIntegrityCertified",
      "Type Integrity Certified",
      "Strict TypeScript architectural integrity is certified.",
      14,
    ),
    criterion(
      "ArchitectureIntegrityCertified",
      "Architecture Integrity Certified",
      "Canonical EIL-8 architecture integrity is certified.",
      15,
    ),
    criterion(
      "RuntimeIndependenceCertified",
      "Runtime Independence Certified",
      "Runtime-free Suite independence is certified.",
      16,
    ),
    criterion(
      "PlatformReadinessCertified",
      "Platform Readiness Certified",
      "Platform ReadyForCertification readiness is certified.",
      17,
    ),
    criterion(
      "FreezeReadinessCertified",
      "Freeze Readiness Certified",
      "Certification ReadyForFreeze readiness is certified.",
      18,
    ),
  ]);
