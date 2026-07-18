/**
 * DKL-6:7 — Knowledge Repository Certification Gates.
 *
 * Exactly fifteen certification gates, eighteen CertifiedPreserved boundaries,
 * and twenty Guaranteed guarantees. All gates resolve to Pass.
 *
 * Ownership: owned exclusively by DKL-6:7.
 */

import { KnowledgeRepositoryCertificationCriteria } from "./knowledgeRepositoryCertificationCriteria.ts";
import { KnowledgeRepositoryFoundationId } from "./knowledgeRepositoryFoundation.ts";
import { KnowledgeRepositoryManifestId } from "./knowledgeRepositoryManifest.ts";
import { KnowledgeRepositoryModelId } from "./knowledgeRepositoryModel.ts";
import {
  KnowledgeRepositoryPlatform,
  KnowledgeRepositoryPlatformId,
} from "./knowledgeRepositoryPlatform.ts";
import { KnowledgeRepositoryRegistryId } from "./knowledgeRepositoryRegistry.ts";
import { KnowledgeRepositoryValidationId } from "./knowledgeRepositoryValidation.ts";
import type {
  KnowledgeRepositoryCertificationBoundary,
  KnowledgeRepositoryCertificationGate,
  KnowledgeRepositoryCertificationGuarantee,
} from "./knowledgeRepositoryCertificationTypes.ts";

const CERTIFICATION_ID = "DKL-6:7/KnowledgeRepositoryCertification" as const;

const C = Object.freeze({
  platformIdentity: "DKL-6:7/Criterion/CanonicalPlatformIdentityCriterion",
  orderedSections: "DKL-6:7/Criterion/OrderedPlatformSectionCriterion",
  canonicalReferences: "DKL-6:7/Criterion/CanonicalPhaseReferenceCriterion",
  foundation: "DKL-6:7/Criterion/FoundationCompletenessCriterion",
  registry: "DKL-6:7/Criterion/RegistryCompletenessCriterion",
  model: "DKL-6:7/Criterion/ModelCompletenessCriterion",
  validation: "DKL-6:7/Criterion/ValidationCompletenessCriterion",
  manifest: "DKL-6:7/Criterion/ManifestCompletenessCriterion",
  platform: "DKL-6:7/Criterion/PlatformCompletenessCriterion",
  ownership: "DKL-6:7/Criterion/OwnershipIntegrityCriterion",
  boundary: "DKL-6:7/Criterion/BoundaryIntegrityCriterion",
  dependency: "DKL-6:7/Criterion/DependencyIntegrityCriterion",
  technology: "DKL-6:7/Criterion/TechnologyNeutralityCriterion",
  immutability: "DKL-6:7/Criterion/ImmutabilityCriterion",
  runtime: "DKL-6:7/Criterion/RuntimeProhibitionCriterion",
  freeze: "DKL-6:7/Criterion/FreezeReadinessCriterion",
});

const E = Object.freeze({
  foundationIdentity: "DKL-6:7/Evidence/FoundationIdentityEvidence",
  foundationInventory: "DKL-6:7/Evidence/FoundationInventoryEvidence",
  registryIdentity: "DKL-6:7/Evidence/RegistryIdentityEvidence",
  registryInventory: "DKL-6:7/Evidence/RegistryInventoryEvidence",
  modelIdentity: "DKL-6:7/Evidence/ModelIdentityEvidence",
  modelInventory: "DKL-6:7/Evidence/ModelInventoryEvidence",
  validationIdentity: "DKL-6:7/Evidence/ValidationIdentityEvidence",
  validationPass: "DKL-6:7/Evidence/ValidationPassEvidence",
  manifestIdentity: "DKL-6:7/Evidence/ManifestIdentityEvidence",
  manifestCompleteness: "DKL-6:7/Evidence/ManifestCompletenessEvidence",
  platformIdentity: "DKL-6:7/Evidence/PlatformIdentityEvidence",
  platformComposition: "DKL-6:7/Evidence/PlatformCompositionEvidence",
  platformReadiness: "DKL-6:7/Evidence/PlatformReadinessEvidence",
  boundary: "DKL-6:7/Evidence/BoundaryPreservationEvidence",
  immutability: "DKL-6:7/Evidence/ImmutabilityEvidence",
  runtime: "DKL-6:7/Evidence/RuntimeProhibitionEvidence",
});

const boundary = (
  id: string,
  name: string,
  description: string,
): KnowledgeRepositoryCertificationBoundary =>
  Object.freeze({
    id,
    name,
    description,
    status: "CertifiedPreserved" as const,
    owner: "DKL-6" as const,
    enforcementType: "Architectural" as const,
    runtimeBehavior: "None" as const,
  });

const guarantee = (
  id: string,
  name: string,
  description: string,
  evidenceReferences: readonly string[],
): KnowledgeRepositoryCertificationGuarantee =>
  Object.freeze({
    id,
    name,
    description,
    evidenceReferences: Object.freeze([...evidenceReferences]),
    status: "Guaranteed" as const,
    owner: "DKL-6" as const,
    runtimeBehavior: "None" as const,
  });

const gate = (
  id: string,
  name: string,
  criterionReferences: readonly string[],
  evidenceReferences: readonly string[],
): KnowledgeRepositoryCertificationGate => {
  const matched = KnowledgeRepositoryCertificationCriteria.filter((item) =>
    criterionReferences.includes(item.id),
  );
  const passedCriterionCount = matched.filter((item) => item.status === "Pass")
    .length;
  const failedCriterionCount = matched.filter((item) => item.status === "Fail")
    .length;
  return Object.freeze({
    id,
    name,
    criterionReferences: Object.freeze([...criterionReferences]),
    evidenceReferences: Object.freeze([...evidenceReferences]),
    passedCriterionCount,
    failedCriterionCount,
    status: failedCriterionCount === 0 ? ("Pass" as const) : ("Fail" as const),
    owner: "DKL-6" as const,
    runtimeBehavior: "None" as const,
  });
};

/** Exactly eighteen CertifiedPreserved boundary certifications. */
export const KnowledgeRepositoryCertificationBoundaries: readonly KnowledgeRepositoryCertificationBoundary[] =
  Object.freeze(
    KnowledgeRepositoryPlatform.boundaries.map((item) =>
      boundary(
        `DKL-6:7/Boundary/${item.name}`,
        item.name,
        `Certified preservation of platform boundary ${item.name}.`,
      ),
    ),
  );

/** Exactly twenty certification guarantees. */
export const KnowledgeRepositoryCertificationGuarantees: readonly KnowledgeRepositoryCertificationGuarantee[] =
  Object.freeze([
    guarantee(
      "DKL-6:7/Guarantee/CanonicalCertificationIdentityGuarantee",
      "CanonicalCertificationIdentityGuarantee",
      "Certification identity is canonical and stable.",
      Object.freeze([CERTIFICATION_ID]),
    ),
    guarantee(
      "DKL-6:7/Guarantee/CertificationScopeGuarantee",
      "CertificationScopeGuarantee",
      "Certification scope covers foundation through certification.",
      Object.freeze([CERTIFICATION_ID]),
    ),
    guarantee(
      "DKL-6:7/Guarantee/PlatformIdentityGuarantee",
      "PlatformIdentityGuarantee",
      "Platform identity remains canonical.",
      Object.freeze([KnowledgeRepositoryPlatformId]),
    ),
    guarantee(
      "DKL-6:7/Guarantee/PlatformCompositionGuarantee",
      "PlatformCompositionGuarantee",
      "Platform composition of completed phases is certified.",
      Object.freeze([KnowledgeRepositoryPlatformId]),
    ),
    guarantee(
      "DKL-6:7/Guarantee/FoundationIntegrityGuarantee",
      "FoundationIntegrityGuarantee",
      "Foundation integrity is certified.",
      Object.freeze([KnowledgeRepositoryFoundationId]),
    ),
    guarantee(
      "DKL-6:7/Guarantee/RegistryIntegrityGuarantee",
      "RegistryIntegrityGuarantee",
      "Registry integrity is certified.",
      Object.freeze([KnowledgeRepositoryRegistryId]),
    ),
    guarantee(
      "DKL-6:7/Guarantee/ModelIntegrityGuarantee",
      "ModelIntegrityGuarantee",
      "Model integrity is certified.",
      Object.freeze([KnowledgeRepositoryModelId]),
    ),
    guarantee(
      "DKL-6:7/Guarantee/ValidationIntegrityGuarantee",
      "ValidationIntegrityGuarantee",
      "Validation integrity is certified.",
      Object.freeze([KnowledgeRepositoryValidationId]),
    ),
    guarantee(
      "DKL-6:7/Guarantee/ManifestIntegrityGuarantee",
      "ManifestIntegrityGuarantee",
      "Manifest integrity is certified.",
      Object.freeze([KnowledgeRepositoryManifestId]),
    ),
    guarantee(
      "DKL-6:7/Guarantee/PlatformIntegrityGuarantee",
      "PlatformIntegrityGuarantee",
      "Platform integrity is certified.",
      Object.freeze([KnowledgeRepositoryPlatformId]),
    ),
    guarantee(
      "DKL-6:7/Guarantee/OwnershipIntegrityGuarantee",
      "OwnershipIntegrityGuarantee",
      "Ownership integrity is certified.",
      Object.freeze([KnowledgeRepositoryManifestId]),
    ),
    guarantee(
      "DKL-6:7/Guarantee/BoundaryIntegrityGuarantee",
      "BoundaryIntegrityGuarantee",
      "Boundary integrity is certified.",
      Object.freeze([KnowledgeRepositoryPlatformId]),
    ),
    guarantee(
      "DKL-6:7/Guarantee/DependencyIntegrityGuarantee",
      "DependencyIntegrityGuarantee",
      "Dependency integrity is certified.",
      Object.freeze([KnowledgeRepositoryPlatformId]),
    ),
    guarantee(
      "DKL-6:7/Guarantee/TraceabilityIntegrityGuarantee",
      "TraceabilityIntegrityGuarantee",
      "Traceability integrity is certified.",
      Object.freeze([KnowledgeRepositoryModelId]),
    ),
    guarantee(
      "DKL-6:7/Guarantee/CompatibilityGuarantee",
      "CompatibilityGuarantee",
      "Compatibility certifications are complete.",
      Object.freeze([CERTIFICATION_ID, KnowledgeRepositoryPlatformId]),
    ),
    guarantee(
      "DKL-6:7/Guarantee/ImmutabilityGuarantee",
      "ImmutabilityGuarantee",
      "Immutability of certified aggregates is guaranteed.",
      Object.freeze([KnowledgeRepositoryPlatformId, CERTIFICATION_ID]),
    ),
    guarantee(
      "DKL-6:7/Guarantee/DeterminismGuarantee",
      "DeterminismGuarantee",
      "Deterministic certification summaries and counts are guaranteed.",
      Object.freeze([CERTIFICATION_ID]),
    ),
    guarantee(
      "DKL-6:7/Guarantee/TechnologyNeutralityGuarantee",
      "TechnologyNeutralityGuarantee",
      "Storage-technology neutrality is certified.",
      Object.freeze([KnowledgeRepositoryPlatformId]),
    ),
    guarantee(
      "DKL-6:7/Guarantee/RuntimeProhibitionGuarantee",
      "RuntimeProhibitionGuarantee",
      "Runtime prohibition is certified.",
      Object.freeze([KnowledgeRepositoryPlatformId]),
    ),
    guarantee(
      "DKL-6:7/Guarantee/FreezeReadinessGuarantee",
      "FreezeReadinessGuarantee",
      "Architecture is ready for DKL-6:8 Freeze.",
      Object.freeze([CERTIFICATION_ID, KnowledgeRepositoryPlatformId]),
    ),
  ]);

/** Exactly fifteen certification gates — all Pass. */
export const KnowledgeRepositoryCertificationGates: readonly KnowledgeRepositoryCertificationGate[] =
  Object.freeze([
    gate(
      "DKL-6:7/Gate/CertificationIdentityGate",
      "CertificationIdentityGate",
      Object.freeze([C.platformIdentity]),
      Object.freeze([E.platformIdentity]),
    ),
    gate(
      "DKL-6:7/Gate/CertificationScopeGate",
      "CertificationScopeGate",
      Object.freeze([C.orderedSections, C.canonicalReferences]),
      Object.freeze([E.platformComposition]),
    ),
    gate(
      "DKL-6:7/Gate/FoundationCertificationGate",
      "FoundationCertificationGate",
      Object.freeze([C.foundation]),
      Object.freeze([E.foundationIdentity, E.foundationInventory]),
    ),
    gate(
      "DKL-6:7/Gate/RegistryCertificationGate",
      "RegistryCertificationGate",
      Object.freeze([C.registry]),
      Object.freeze([E.registryIdentity, E.registryInventory]),
    ),
    gate(
      "DKL-6:7/Gate/ModelCertificationGate",
      "ModelCertificationGate",
      Object.freeze([C.model]),
      Object.freeze([E.modelIdentity, E.modelInventory]),
    ),
    gate(
      "DKL-6:7/Gate/ValidationCertificationGate",
      "ValidationCertificationGate",
      Object.freeze([C.validation]),
      Object.freeze([E.validationIdentity, E.validationPass]),
    ),
    gate(
      "DKL-6:7/Gate/ManifestCertificationGate",
      "ManifestCertificationGate",
      Object.freeze([C.manifest]),
      Object.freeze([E.manifestIdentity, E.manifestCompleteness]),
    ),
    gate(
      "DKL-6:7/Gate/PlatformCertificationGate",
      "PlatformCertificationGate",
      Object.freeze([C.platform]),
      Object.freeze([
        E.platformIdentity,
        E.platformComposition,
        E.platformReadiness,
      ]),
    ),
    gate(
      "DKL-6:7/Gate/OwnershipCertificationGate",
      "OwnershipCertificationGate",
      Object.freeze([C.ownership]),
      Object.freeze([E.manifestCompleteness]),
    ),
    gate(
      "DKL-6:7/Gate/BoundaryCertificationGate",
      "BoundaryCertificationGate",
      Object.freeze([C.boundary]),
      Object.freeze([E.boundary]),
    ),
    gate(
      "DKL-6:7/Gate/DependencyCertificationGate",
      "DependencyCertificationGate",
      Object.freeze([C.dependency]),
      Object.freeze([E.platformComposition]),
    ),
    gate(
      "DKL-6:7/Gate/CompatibilityCertificationGate",
      "CompatibilityCertificationGate",
      Object.freeze([C.technology]),
      Object.freeze([E.platformComposition]),
    ),
    gate(
      "DKL-6:7/Gate/ImmutabilityCertificationGate",
      "ImmutabilityCertificationGate",
      Object.freeze([C.immutability]),
      Object.freeze([E.immutability]),
    ),
    gate(
      "DKL-6:7/Gate/RuntimeProhibitionCertificationGate",
      "RuntimeProhibitionCertificationGate",
      Object.freeze([C.runtime]),
      Object.freeze([E.runtime]),
    ),
    gate(
      "DKL-6:7/Gate/FreezeReadinessGate",
      "FreezeReadinessGate",
      Object.freeze([C.freeze]),
      Object.freeze([E.platformReadiness, E.runtime]),
    ),
  ]);

export const KnowledgeRepositoryCertificationGateManifest = Object.freeze({
  gates: KnowledgeRepositoryCertificationGates,
  gateCount: KnowledgeRepositoryCertificationGates.length,
  passedGateCount: KnowledgeRepositoryCertificationGates.filter(
    (item) => item.status === "Pass",
  ).length,
  failedGateCount: KnowledgeRepositoryCertificationGates.filter(
    (item) => item.status === "Fail",
  ).length,
  boundaries: KnowledgeRepositoryCertificationBoundaries,
  boundaryCount: KnowledgeRepositoryCertificationBoundaries.length,
  guarantees: KnowledgeRepositoryCertificationGuarantees,
  guaranteeCount: KnowledgeRepositoryCertificationGuarantees.length,
  metadataOnly: true as const,
  immutable: true as const,
});
