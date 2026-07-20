/**
 * NEA-7:7 — Intake Orchestration Certification Compliance.
 *
 * Immutable architectural compliance declarations for Intake Orchestration.
 * Declarative only. No runtime evaluation.
 *
 * Ownership: owned exclusively by NEA-7:7.
 */

import {
  IntakeOrchestrationPlatform,
  IntakeOrchestrationPlatformId,
} from "./intakeOrchestrationPlatform.ts";
import type { IntakeOrchestrationComplianceDeclaration } from "./intakeOrchestrationCertificationTypes.ts";

const platform = IntakeOrchestrationPlatform;

const compliance = (
  key: string,
  complianceName: string,
  description: string,
  order: number,
): IntakeOrchestrationComplianceDeclaration =>
  Object.freeze({
    complianceId: `NEA-7:7/Compliance/${key}`,
    complianceName,
    description,
    compliant: true as const,
    platformReference: `${IntakeOrchestrationPlatformId}/${key}`,
    executesRuntime: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

/** Exactly ten compliance declarations. */
export const IntakeOrchestrationCertificationComplianceDeclarations: readonly IntakeOrchestrationComplianceDeclaration[] =
  Object.freeze([
    compliance(
      "PhaseChain",
      "Phase Chain",
      "NEA-7:1 through NEA-7:6 phase chain is composed through Platform namespace.",
      1,
    ),
    compliance(
      "CanonicalReferences",
      "Canonical References",
      "All upstream surfaces are referenced; none are reconstructed.",
      2,
    ),
    compliance(
      "ExecutiveIntakePackageContract",
      "Executive Intake Package Contract",
      "Canonical Executive Intake Package contract is certified through Foundation.",
      3,
    ),
    compliance(
      "RegistryOwnership",
      "Registry Ownership",
      "Registry ownership remains unique; Certification does not claim registry collections.",
      4,
    ),
    compliance(
      "ModelComposition",
      "Model Composition",
      "Model composition is certified through Platform namespace model references.",
      5,
    ),
    compliance(
      "InventoryPublication",
      "Inventory Publication",
      "Inventories are published by Manifest and derived without reconstruction.",
      6,
    ),
    compliance(
      "NamespaceComposition",
      "Namespace Composition",
      "Platform namespace includes foundation, registry, model, validation, manifest, and platform.",
      7,
    ),
    compliance(
      "PublicSurface",
      "Public Surface",
      "Each phase exposes a controlled eight-export public surface.",
      8,
    ),
    compliance(
      "Immutability",
      "Immutability",
      "Platform and upstream surfaces declare immutable metadata-only architecture.",
      9,
    ),
    compliance(
      "DependencyDirection",
      "Dependency Direction",
      "Dependency direction is Certification → Platform → Manifest → Validation → Model → Registry → Foundation.",
      10,
    ),
  ]);

/** Canonical immutable compliance catalog. */
export const IntakeOrchestrationCertificationComplianceCatalog = Object.freeze({
  catalogId: "NEA-7:7/ComplianceCatalog",
  sourcePhase: "NEA-7:7" as const,
  platformId: IntakeOrchestrationPlatformId,
  declarations: IntakeOrchestrationCertificationComplianceDeclarations,
  complianceCount:
    IntakeOrchestrationCertificationComplianceDeclarations.length,
  allCompliant: IntakeOrchestrationCertificationComplianceDeclarations.every(
    (item) => item.compliant === true,
  ),
  platformManifestOnly: platform.dependency.manifestOnly,
  platformImmutable: platform.immutable,
  executesRuntime: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
