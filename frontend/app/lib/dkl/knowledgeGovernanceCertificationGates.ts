/**
 * DKL-8:7 — Knowledge Governance Certification Gates.
 *
 * Exactly thirteen immutable certification gates.
 * Outcomes derived from criterion outcomes only.
 *
 * Ownership: owned exclusively by DKL-8:7.
 */

import {
  KnowledgeGovernanceCertificationAllCriteriaPass,
  KnowledgeGovernanceCertificationCriteria,
} from "./knowledgeGovernanceCertificationCriteria.ts";
import type {
  KnowledgeGovernanceCertificationGate,
  KnowledgeGovernanceCertificationGateName,
  KnowledgeGovernanceCertificationOutcome,
} from "./knowledgeGovernanceCertificationTypes.ts";

const gate = (
  order: number,
  name: KnowledgeGovernanceCertificationGateName,
  requiredCriterionIds: readonly string[],
): KnowledgeGovernanceCertificationGate => {
  const required = Object.freeze([...requiredCriterionIds]);
  const allPass = required.every((criterionId) => {
    const found = KnowledgeGovernanceCertificationCriteria.find(
      (item) => item.id === criterionId,
    );
    return found?.outcome === "Pass";
  });
  return Object.freeze({
    id: `DKL-8:7/Gate/${name}`,
    name,
    requiredCriterionIds: required,
    blocking: true as const,
    outcome: (allPass ? "Pass" : "Fail") as KnowledgeGovernanceCertificationOutcome,
    status: "Active" as const,
    sourcePhase: "DKL-8:7" as const,
    executesExternalBehavior: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });
};

/** Exactly thirteen certification gates. */
export const KnowledgeGovernanceCertificationGates: readonly KnowledgeGovernanceCertificationGate[] =
  Object.freeze([
    gate(1, "PlatformIdentityGate", Object.freeze(["DKL-8:7/Criterion/IdentityCertified"])),
    gate(
      2,
      "DependencyIntegrityGate",
      Object.freeze(["DKL-8:7/Criterion/DependencyCertified"]),
    ),
    gate(
      3,
      "ArchitectureChainGate",
      Object.freeze(["DKL-8:7/Criterion/ArchitectureChainCertified"]),
    ),
    gate(
      4,
      "PublicSurfaceGate",
      Object.freeze([
        "DKL-8:7/Criterion/PublicSurfaceCertified",
        "DKL-8:7/Criterion/ApiRegistryCertified",
      ]),
    ),
    gate(
      5,
      "ReferenceIntegrityGate",
      Object.freeze([
        "DKL-8:7/Criterion/ManifestReferenceCertified",
        "DKL-8:7/Criterion/ValidationReferenceCertified",
        "DKL-8:7/Criterion/ModelReferenceCertified",
        "DKL-8:7/Criterion/RegistryReferenceCertified",
        "DKL-8:7/Criterion/FoundationReferenceCertified",
      ]),
    ),
    gate(
      6,
      "CanonicalInventoryGate",
      Object.freeze(["DKL-8:7/Criterion/CanonicalInventoryCertified"]),
    ),
    gate(
      7,
      "InventoryConsistencyGate",
      Object.freeze(["DKL-8:7/Criterion/InventoryConsistencyCertified"]),
    ),
    gate(
      8,
      "OwnershipBoundaryGate",
      Object.freeze([
        "DKL-8:7/Criterion/OwnershipCertified",
        "DKL-8:7/Criterion/BoundariesCertified",
      ]),
    ),
    gate(
      9,
      "CompatibilityGate",
      Object.freeze([
        "DKL-8:7/Criterion/IdentityCertified",
        "DKL-8:7/Criterion/CanonicalInventoryCertified",
      ]),
    ),
    gate(
      10,
      "ImmutabilityGate",
      Object.freeze(["DKL-8:7/Criterion/ImmutabilityCertified"]),
    ),
    gate(
      11,
      "DeterminismGate",
      Object.freeze(["DKL-8:7/Criterion/DeterminismCertified"]),
    ),
    gate(
      12,
      "RuntimeProhibitionGate",
      Object.freeze(["DKL-8:7/Criterion/RuntimeProhibitionsCertified"]),
    ),
    gate(
      13,
      "FreezeReadinessGate",
      Object.freeze(["DKL-8:7/Criterion/FreezeReadinessCertified"]),
    ),
  ]);

export const KnowledgeGovernanceCertificationGateCount =
  KnowledgeGovernanceCertificationGates.length;

export const KnowledgeGovernanceCertificationAllGatesPass =
  KnowledgeGovernanceCertificationGates.every(
    (item) => item.outcome === "Pass",
  ) && KnowledgeGovernanceCertificationAllCriteriaPass;

export const KnowledgeGovernanceCertificationFreezeReadinessGate =
  KnowledgeGovernanceCertificationGates.find(
    (item) => item.name === "FreezeReadinessGate",
  );
