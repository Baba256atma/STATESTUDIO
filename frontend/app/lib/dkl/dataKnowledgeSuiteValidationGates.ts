/**
 * DKL-9:4 — Data Knowledge Suite Validation Gates.
 *
 * Exactly 16 readiness gates. Final ManifestReadinessGate yields ReadyForManifest.
 *
 * Ownership: owned exclusively by DKL-9:4.
 */

import { DataKnowledgeSuiteValidationRules } from "./dataKnowledgeSuiteValidationRules.ts";
import type {
  DataKnowledgeSuiteValidationGate,
  DataKnowledgeSuiteValidationGateName,
  DataKnowledgeSuiteValidationOutcome,
} from "./dataKnowledgeSuiteValidationTypes.ts";

const gate = (
  name: DataKnowledgeSuiteValidationGateName,
  requiredRuleIds: readonly string[],
  deterministicOrder: number,
  options: { blocking?: boolean; readinessResult?: "ReadyForManifest" } = {},
): DataKnowledgeSuiteValidationGate => {
  const required = Object.freeze([...requiredRuleIds]);
  const allPass = required.every((ruleId) => {
    const found = DataKnowledgeSuiteValidationRules.find(
      (rule) => rule.id === ruleId,
    );
    return found?.outcome === "Pass";
  });
  return Object.freeze({
    id: `DKL-9:4/Gate/${name}`,
    name,
    requiredRuleIds: required,
    status: "Active" as const,
    outcome: (allPass ? "Pass" : "Fail") as DataKnowledgeSuiteValidationOutcome,
    blocking: options.blocking ?? true,
    ...(options.readinessResult
      ? { readinessResult: options.readinessResult }
      : {}),
    sourcePhase: "DKL-9:4" as const,
    executesExternalBehavior: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder,
  });
};

/** Exactly sixteen Suite validation gates. */
export const DataKnowledgeSuiteValidationGates: readonly DataKnowledgeSuiteValidationGate[] =
  Object.freeze([
    gate(
      "IdentityGate",
      Object.freeze([
        "DKS-V-ID-001",
        "DKS-V-ID-002",
        "DKS-V-ID-003",
        "DKS-V-ID-004",
      ]),
      1,
    ),
    gate(
      "DependencyGate",
      Object.freeze([
        "DKS-V-DEP-001",
        "DKS-V-DEP-002",
        "DKS-V-DEP-003",
        "DKS-V-DEP-004",
      ]),
      2,
    ),
    gate(
      "CompositionGate",
      Object.freeze([
        "DKS-V-CMP-001",
        "DKS-V-CMP-002",
        "DKS-V-CMP-003",
        "DKS-V-CMP-004",
      ]),
      3,
    ),
    gate(
      "CapabilityCatalogGate",
      Object.freeze([
        "DKS-V-CAP-001",
        "DKS-V-CAP-002",
        "DKS-V-CAP-003",
        "DKS-V-CAP-004",
      ]),
      4,
    ),
    gate(
      "ReferenceIntegrityGate",
      Object.freeze([
        "DKS-V-REF-001",
        "DKS-V-REF-002",
        "DKS-V-REF-003",
        "DKS-V-REF-004",
      ]),
      5,
    ),
    gate(
      "PlatformGate",
      Object.freeze([
        "DKS-V-PLT-001",
        "DKS-V-PLT-002",
        "DKS-V-PLT-003",
        "DKS-V-PLT-004",
      ]),
      6,
    ),
    gate(
      "ApiRegistryGate",
      Object.freeze([
        "DKS-V-API-001",
        "DKS-V-API-002",
        "DKS-V-API-003",
        "DKS-V-API-004",
      ]),
      7,
    ),
    gate(
      "OwnershipGate",
      Object.freeze([
        "DKS-V-OWN-001",
        "DKS-V-OWN-002",
        "DKS-V-OWN-003",
        "DKS-V-OWN-004",
      ]),
      8,
    ),
    gate(
      "BoundaryGate",
      Object.freeze([
        "DKS-V-BND-001",
        "DKS-V-BND-002",
        "DKS-V-BND-003",
        "DKS-V-BND-004",
      ]),
      9,
    ),
    gate(
      "InventoryGate",
      Object.freeze([
        "DKS-V-INV-001",
        "DKS-V-INV-002",
        "DKS-V-INV-003",
        "DKS-V-INV-004",
      ]),
      10,
    ),
    gate(
      "ReadinessGate",
      Object.freeze(["DKS-V-RDY-001", "DKS-V-RDY-002"]),
      11,
    ),
    gate(
      "CompatibilityGate",
      Object.freeze(["DKS-V-ORD-001", "DKS-V-ORD-002", "DKS-V-CAP-003"]),
      12,
    ),
    gate(
      "DeterminismGate",
      Object.freeze(["DKS-V-ORD-003", "DKS-V-RDY-004"]),
      13,
    ),
    gate(
      "ImmutabilityGate",
      Object.freeze(["DKS-V-RDY-003", "DKS-V-RDY-004"]),
      14,
    ),
    gate(
      "CanonicalInventoryGate",
      Object.freeze([
        "DKS-V-INV-001",
        "DKS-V-INV-002",
        "DKS-V-INV-003",
        "DKS-V-INV-004",
        "DKS-V-REF-004",
      ]),
      15,
    ),
    gate(
      "ManifestReadinessGate",
      Object.freeze([
        "DKS-V-ID-001",
        "DKS-V-DEP-001",
        "DKS-V-CAP-001",
        "DKS-V-CAP-003",
        "DKS-V-ORD-002",
        "DKS-V-PLT-002",
        "DKS-V-API-002",
        "DKS-V-OWN-002",
        "DKS-V-BND-002",
        "DKS-V-INV-003",
        "DKS-V-RDY-001",
        "DKS-V-RDY-002",
        "DKS-V-RDY-003",
        "DKS-V-RDY-004",
      ]),
      16,
      { readinessResult: "ReadyForManifest" },
    ),
  ]);

export const DATA_KNOWLEDGE_SUITE_VALIDATION_GATE_COUNT =
  DataKnowledgeSuiteValidationGates.length;

export const DataKnowledgeSuiteValidationAllGatesPass =
  DataKnowledgeSuiteValidationGates.every((item) => item.outcome === "Pass");

export const DataKnowledgeSuiteManifestReadinessGate =
  DataKnowledgeSuiteValidationGates.find(
    (item) => item.name === "ManifestReadinessGate",
  );
