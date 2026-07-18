/**
 * DKL-9:8 — Data Knowledge Suite Freeze Compatibility.
 *
 * Exactly twelve frozen compatibility declarations and fifteen Freeze guarantees.
 *
 * Ownership: owned exclusively by DKL-9:8.
 */

import { DataKnowledgeSuiteCertificationPlatform } from "./dataKnowledgeSuiteCertification.ts";
import type {
  DataKnowledgeSuiteFreezeCompatibilityDeclaration,
  DataKnowledgeSuiteFreezeGuarantee,
} from "./dataKnowledgeSuiteFreezeTypes.ts";

const certification = DataKnowledgeSuiteCertificationPlatform;

const compatibility = (
  order: number,
  name: string,
  sourceReference: string,
): DataKnowledgeSuiteFreezeCompatibilityDeclaration =>
  Object.freeze({
    id: `DKL-9:8/Compatibility/${name}`,
    name,
    compatible: true as const,
    frozen: true as const,
    protected: true as const,
    breakingChangePolicy: "MajorVersionRequired" as const,
    sourceReference,
    deterministicOrder: order,
    metadataOnly: true as const,
  });

const guarantee = (
  order: number,
  name: string,
  statement: string,
): DataKnowledgeSuiteFreezeGuarantee =>
  Object.freeze({
    id: `DKL-9:8/Guarantee/${name}`,
    name,
    statement,
    status: "Satisfied" as const,
    deterministicOrder: order,
    metadataOnly: true as const,
  });

/** Exactly twelve Freeze compatibility declarations. */
export const DataKnowledgeSuiteFreezeCompatibility: readonly DataKnowledgeSuiteFreezeCompatibilityDeclaration[] =
  Object.freeze([
    compatibility(1, "IdentityCompatibility", "Freeze.certification.identity"),
    compatibility(
      2,
      "DependencyCompatibility",
      "Freeze.certification.dependency",
    ),
    compatibility(
      3,
      "FoundationCompatibility",
      "Freeze.certification.foundation",
    ),
    compatibility(4, "RegistryCompatibility", "Freeze.certification.registry"),
    compatibility(5, "ModelCompatibility", "Freeze.certification.model"),
    compatibility(
      6,
      "ValidationCompatibility",
      "Freeze.certification.validation",
    ),
    compatibility(7, "ManifestCompatibility", "Freeze.certification.manifest"),
    compatibility(8, "PlatformCompatibility", "Freeze.certification.platform"),
    compatibility(
      9,
      "CertificationCompatibility",
      "Freeze.certification.certificationResult",
    ),
    compatibility(
      10,
      "PublicSurfaceCompatibility",
      "Freeze.certification.platform.apiRegistry",
    ),
    compatibility(
      11,
      "InventoryCompatibility",
      "Freeze.certification.inventory",
    ),
    compatibility(
      12,
      "BoundaryCompatibility",
      "Freeze.certification.boundaries",
    ),
  ]);

/** Exactly fifteen Freeze guarantees — all Satisfied. */
export const DataKnowledgeSuiteFreezeGuarantees: readonly DataKnowledgeSuiteFreezeGuarantee[] =
  Object.freeze([
    guarantee(
      1,
      "CertifiedArchitecturePreserved",
      "Certified architecture remains preserved by Certification reference.",
    ),
    guarantee(
      2,
      "CanonicalReferences",
      "Full upstream chain remains preserved by canonical reference.",
    ),
    guarantee(
      3,
      "CanonicalInventory",
      "Canonical Inventory Rule remains satisfied through Certification.",
    ),
    guarantee(
      4,
      "ImmutableMetadata",
      "Freeze platform and Freeze-owned collections remain immutable metadata.",
    ),
    guarantee(
      5,
      "DeterministicResults",
      "Freeze summaries and inventories remain deterministic.",
    ),
    guarantee(6, "NoRuntime", "Freeze introduces no runtime behaviour."),
    guarantee(
      7,
      "NoReconstruction",
      "Freeze does not reconstruct prior-phase inventories.",
    ),
    guarantee(
      8,
      "NoDuplicateMetadata",
      "Freeze does not duplicate upstream collections.",
    ),
    guarantee(
      9,
      "PublicSurfaceFrozen",
      "Certification and Freeze eight-export public surfaces remain protected.",
    ),
    guarantee(
      10,
      "DependencyChainFrozen",
      "Sole Certification dependency chain remains frozen.",
    ),
    guarantee(
      11,
      "OwnershipFrozen",
      "Ownership declarations remain preserved and frozen.",
    ),
    guarantee(
      12,
      "BoundariesFrozen",
      "Boundary declarations remain preserved and frozen.",
    ),
    guarantee(
      13,
      "CompatibilityFrozen",
      "Compatibility declarations remain Compatible, Frozen, and Protected.",
    ),
    guarantee(
      14,
      "AdditiveExtensionOnly",
      "Future extensions remain additive-only under extension locks.",
    ),
    guarantee(
      15,
      "ReadyForPublicIndex",
      `Certification outcome ${certification.certificationOutcome} remains Pass and ReadyForPublicIndex.`,
    ),
  ]);
