/**
 * DKL-9:7 — Data Knowledge Suite Certification Gates.
 *
 * Exactly thirteen immutable certification gates.
 * Outcomes derived from criterion outcomes only.
 *
 * Ownership: owned exclusively by DKL-9:7.
 */

import {
  DataKnowledgeSuiteCertificationAllCriteriaPass,
  DataKnowledgeSuiteCertificationCriteria,
} from "./dataKnowledgeSuiteCertificationCriteria.ts";
import type {
  DataKnowledgeSuiteCertificationGate,
  DataKnowledgeSuiteCertificationGateName,
  DataKnowledgeSuiteCertificationOutcome,
} from "./dataKnowledgeSuiteCertificationTypes.ts";

const gate = (
  order: number,
  name: DataKnowledgeSuiteCertificationGateName,
  requiredCriterionIds: readonly string[],
  options: { readinessResult?: "ReadyForFreeze" } = {},
): DataKnowledgeSuiteCertificationGate => {
  const required = Object.freeze([...requiredCriterionIds]);
  const allPass = required.every((criterionId) => {
    const found = DataKnowledgeSuiteCertificationCriteria.find(
      (item) => item.id === criterionId,
    );
    return found?.outcome === "Pass";
  });
  return Object.freeze({
    id: `DKL-9:7/Gate/${name}`,
    name,
    requiredCriterionIds: required,
    blocking: true as const,
    outcome: (allPass ? "Pass" : "Fail") as DataKnowledgeSuiteCertificationOutcome,
    status: "Active" as const,
    ...(options.readinessResult
      ? { readinessResult: options.readinessResult }
      : {}),
    sourcePhase: "DKL-9:7" as const,
    executesExternalBehavior: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });
};

/** Exactly thirteen certification gates. */
export const DataKnowledgeSuiteCertificationGates: readonly DataKnowledgeSuiteCertificationGate[] =
  Object.freeze([
    gate(1, "IdentityGate", Object.freeze(["DKL-9:7/Criterion/IdentityCertified"])),
    gate(
      2,
      "DependencyGate",
      Object.freeze(["DKL-9:7/Criterion/DependencyCertified"]),
    ),
    gate(
      3,
      "PlatformIntegrityGate",
      Object.freeze([
        "DKL-9:7/Criterion/PlatformIntegrityCertified",
        "DKL-9:7/Criterion/PublicSurfaceCertified",
      ]),
    ),
    gate(
      4,
      "CapabilityCatalogGate",
      Object.freeze(["DKL-9:7/Criterion/CapabilityCatalogCertified"]),
    ),
    gate(
      5,
      "OwnershipBoundaryGate",
      Object.freeze([
        "DKL-9:7/Criterion/OwnershipCertified",
        "DKL-9:7/Criterion/BoundariesCertified",
      ]),
    ),
    gate(
      6,
      "CompatibilityGate",
      Object.freeze(["DKL-9:7/Criterion/CompatibilityCertified"]),
    ),
    gate(
      7,
      "GuaranteesGate",
      Object.freeze(["DKL-9:7/Criterion/GuaranteesCertified"]),
    ),
    gate(
      8,
      "ReferenceIntegrityGate",
      Object.freeze([
        "DKL-9:7/Criterion/ManifestReferenceCertified",
        "DKL-9:7/Criterion/ValidationReferenceCertified",
        "DKL-9:7/Criterion/ModelReferenceCertified",
        "DKL-9:7/Criterion/RegistryReferenceCertified",
        "DKL-9:7/Criterion/FoundationReferenceCertified",
      ]),
    ),
    gate(
      9,
      "CanonicalInventoryGate",
      Object.freeze([
        "DKL-9:7/Criterion/CanonicalInventoryCertified",
        "DKL-9:7/Criterion/InventoryConsistencyCertified",
      ]),
    ),
    gate(
      10,
      "PlatformMetadataGate",
      Object.freeze(["DKL-9:7/Criterion/PlatformMetadataCertified"]),
    ),
    gate(
      11,
      "ImmutabilityGate",
      Object.freeze([
        "DKL-9:7/Criterion/PlatformIntegrityCertified",
        "DKL-9:7/Criterion/CanonicalInventoryCertified",
      ]),
    ),
    gate(
      12,
      "RuntimeProhibitionGate",
      Object.freeze(["DKL-9:7/Criterion/FreezeReadinessCertified"]),
    ),
    gate(
      13,
      "FreezeReadinessGate",
      Object.freeze(["DKL-9:7/Criterion/FreezeReadinessCertified"]),
      { readinessResult: "ReadyForFreeze" },
    ),
  ]);

export const DataKnowledgeSuiteCertificationGateCount =
  DataKnowledgeSuiteCertificationGates.length;

export const DataKnowledgeSuiteCertificationAllGatesPass =
  DataKnowledgeSuiteCertificationGates.every(
    (item) => item.outcome === "Pass",
  ) && DataKnowledgeSuiteCertificationAllCriteriaPass;

export const DataKnowledgeSuiteCertificationFreezeReadinessGate =
  DataKnowledgeSuiteCertificationGates.find(
    (item) => item.name === "FreezeReadinessGate",
  );
