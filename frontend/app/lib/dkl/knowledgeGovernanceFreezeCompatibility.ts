/**
 * DKL-8:8 — Knowledge Governance Freeze Compatibility.
 *
 * Exactly twelve frozen compatibility declarations and fifteen Freeze guarantees.
 *
 * Ownership: owned exclusively by DKL-8:8.
 */

import { KnowledgeGovernanceCertificationPlatform } from "./knowledgeGovernanceCertification.ts";
import type {
  KnowledgeGovernanceFreezeCompatibilityDeclaration,
  KnowledgeGovernanceFreezeGuarantee,
} from "./knowledgeGovernanceFreezeTypes.ts";

const certification = KnowledgeGovernanceCertificationPlatform;

const compatibility = (
  order: number,
  name: string,
  sourceReference: string,
): KnowledgeGovernanceFreezeCompatibilityDeclaration =>
  Object.freeze({
    id: `DKL-8:8/Compatibility/${name}`,
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
  key: string,
  statement: string,
): KnowledgeGovernanceFreezeGuarantee =>
  Object.freeze({
    id: `DKL-8:8/Guarantee/${key}`,
    statement,
    status: true as const,
    deterministicOrder: order,
    metadataOnly: true as const,
  });

/** Exactly twelve Freeze compatibility declarations. */
export const KnowledgeGovernanceFreezeCompatibility: readonly KnowledgeGovernanceFreezeCompatibilityDeclaration[] =
  Object.freeze([
    compatibility(1, "IdentityCompatibility", "Freeze.certification.identity"),
    compatibility(2, "DependencyCompatibility", "Freeze.certification.dependency"),
    compatibility(3, "FoundationCompatibility", "Freeze.certification.foundation"),
    compatibility(4, "RegistryCompatibility", "Freeze.certification.registry"),
    compatibility(5, "ModelCompatibility", "Freeze.certification.model"),
    compatibility(6, "ValidationCompatibility", "Freeze.certification.validation"),
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
    compatibility(11, "InventoryCompatibility", "Freeze.certification.inventory"),
    compatibility(12, "BoundaryCompatibility", "Freeze.certification.boundaries"),
  ]);

/** Exactly fifteen Freeze guarantees. */
export const KnowledgeGovernanceFreezeGuarantees: readonly KnowledgeGovernanceFreezeGuarantee[] =
  Object.freeze([
    guarantee(
      1,
      "CertifiedArchitecturePreserved",
      "Certified architecture remains preserved by Certification reference.",
    ),
    guarantee(
      2,
      "CanonicalReferencesPreserved",
      "Full upstream chain remains preserved by canonical reference.",
    ),
    guarantee(
      3,
      "CanonicalInventoryPreserved",
      "Canonical Inventory Rule remains satisfied through Certification.",
    ),
    guarantee(
      4,
      "PublicSurfaceFrozen",
      "Certification and Freeze eight-export public surfaces remain protected.",
    ),
    guarantee(
      5,
      "DependencyChainFrozen",
      "Sole Certification dependency chain remains frozen.",
    ),
    guarantee(
      6,
      "OwnershipFrozen",
      "Ownership declarations remain preserved and frozen.",
    ),
    guarantee(
      7,
      "BoundariesFrozen",
      "Boundary declarations remain preserved and frozen.",
    ),
    guarantee(
      8,
      "CompatibilityFrozen",
      "Compatibility declarations remain Compatible, Frozen, and Protected.",
    ),
    guarantee(
      9,
      "ImmutabilityGuaranteed",
      "Freeze platform and Freeze-owned collections remain immutable.",
    ),
    guarantee(
      10,
      "DeterminismGuaranteed",
      "Freeze summaries and inventories remain deterministic.",
    ),
    guarantee(
      11,
      "RuntimeNeutralityGuaranteed",
      "Freeze introduces no runtime behaviour.",
    ),
    guarantee(
      12,
      "NoReconstructionGuaranteed",
      "Freeze does not reconstruct prior-phase inventories.",
    ),
    guarantee(
      13,
      "NoDuplicationGuaranteed",
      "Freeze does not duplicate upstream collections.",
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
