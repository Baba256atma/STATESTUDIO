/**
 * DKL-7:8 — Knowledge Services Freeze Extensions.
 *
 * Exactly eight immutable extension policies and Public Index preparation.
 * No Public Index implementation.
 *
 * Ownership: owned exclusively by DKL-7:8.
 */

import { KnowledgeServicesFreezeBaselineMatches } from "./knowledgeServicesFreezeBaselines.ts";
import { KnowledgeServicesFreezeCompatibility } from "./knowledgeServicesFreezeCompatibility.ts";
import { KnowledgeServicesFreezeAllLocksActive } from "./knowledgeServicesFreezeLocks.ts";
import { KnowledgeServicesFreezeComponents } from "./knowledgeServicesFreezeRegistry.ts";
import type {
  KnowledgeServicesFreezeExtensionPolicy,
  KnowledgeServicesPublicIndexReadinessDeclaration,
} from "./knowledgeServicesFreezeTypes.ts";

const extension = (
  key: string,
  subject: string,
  allowedChange: string,
  prohibitedChange: string,
  changeClass: "Additive" | "Versioned",
  order: number,
): KnowledgeServicesFreezeExtensionPolicy =>
  Object.freeze({
    extensionId: `DKL-7:8/Extension/${key}`,
    subject,
    allowedChange,
    prohibitedChange,
    backwardCompatibilityRequirement: true as const,
    certificationRequirement: true as const,
    reFreezeRequirement: true as const,
    versioningRequirement: true as const,
    ownershipPreservation: true as const,
    boundaryPreservation: true as const,
    runtimeAuthorization: "None" as const,
    changeClass,
    deterministicOrder: order,
  });

/** Exactly eight extension policies. */
export const KnowledgeServicesFreezeExtensions: readonly KnowledgeServicesFreezeExtensionPolicy[] =
  Object.freeze([
    extension(
      "AdditiveServiceMetadata",
      "Additive service metadata extension",
      "Add additive service metadata without removing frozen services",
      "Delete service; change canonical service IDs; add mutation modes",
      "Additive",
      1,
    ),
    extension(
      "AdditiveCapabilityMetadata",
      "Additive capability metadata extension",
      "Add additive capability metadata without removing frozen capabilities",
      "Delete capability; change canonical capability IDs",
      "Additive",
      2,
    ),
    extension(
      "AdditiveContractMetadata",
      "Additive contract metadata extension",
      "Add additive contract metadata without removing frozen contracts",
      "Delete contract; weaken read-only contract semantics",
      "Additive",
      3,
    ),
    extension(
      "AdditiveModelMetadata",
      "Additive model metadata extension",
      "Add additive model metadata while preserving inventory baseline 79",
      "Reduce model inventory; introduce runtime execution models",
      "Additive",
      4,
    ),
    extension(
      "AdditiveValidationEvidence",
      "Additive validation evidence extension",
      "Add additive validation evidence without regressing Pass state",
      "Change 48 Pass / 0 Fail without versioned re-certification",
      "Additive",
      5,
    ),
    extension(
      "AdditiveCompatibilityDeclaration",
      "Additive compatibility declaration extension",
      "Add Compatible declarations that preserve consumer paths",
      "Authorize direct Engine or Advisor consumption before Public Index",
      "Additive",
      6,
    ),
    extension(
      "VersionedArchitecture",
      "Versioned architecture extension",
      "Introduce versioned architecture revisions after re-certify and re-freeze",
      "Unversioned breaking changes to frozen baselines",
      "Versioned",
      7,
    ),
    extension(
      "PublicIndexSafe",
      "Public Index-safe extension",
      "Prepare additive Public Index metadata without releasing consumers",
      "Claim Released, ReadyForConsumer, or implement Public Index here",
      "Additive",
      8,
    ),
  ]);

const allComponentsFrozen =
  KnowledgeServicesFreezeComponents.length === 8 &&
  KnowledgeServicesFreezeComponents.every(
    (item) =>
      item.certifiedStatus === "Certified" &&
      item.freezeStatus === "Frozen" &&
      item.protectionStatus === "Protected",
  );

const allCompatibilityCompatible =
  KnowledgeServicesFreezeCompatibility.length === 18 &&
  KnowledgeServicesFreezeCompatibility.every(
    (item) =>
      item.status === "Compatible" &&
      item.freezeStatus === "Frozen" &&
      item.runtimeAuthorization === "None",
  );

const allExtensionPoliciesSafe = KnowledgeServicesFreezeExtensions.every(
  (item) =>
    item.backwardCompatibilityRequirement &&
    item.certificationRequirement &&
    item.reFreezeRequirement &&
    item.versioningRequirement &&
    item.ownershipPreservation &&
    item.boundaryPreservation &&
    item.runtimeAuthorization === "None" &&
    (item.changeClass === "Additive" || item.changeClass === "Versioned"),
);

/** Immutable Public Index preparation — does not implement Public Index. */
export const KnowledgeServicesFreezePublicIndexPreparation: KnowledgeServicesPublicIndexReadinessDeclaration =
  Object.freeze({
    readinessId: "DKL-7:8/PublicIndexPreparation",
    freezeStatus: "Frozen",
    certificationStatus: "Certified",
    certificationResult: "Pass",
    allComponentsFrozen: allComponentsFrozen as true,
    allLocksActive: KnowledgeServicesFreezeAllLocksActive as true,
    allBaselinesMatch: KnowledgeServicesFreezeBaselineMatches as true,
    allCompatibilityCompatible: allCompatibilityCompatible as true,
    allExtensionPoliciesSafe: allExtensionPoliciesSafe as true,
    mutationModesRemainZero: true,
    runtimeBehaviorRemainsAbsent: true,
    canonicalChainIntact: true,
    publicReleaseSurfaceCanBeCreated: true,
    readiness: "ReadyForPublicIndex",
    released: false,
    readyForConsumer: false,
    stablePublicApi: false,
    publicNamespaceComplete: false,
    publicIndexImplemented: false,
    metadataOnly: true,
  });
