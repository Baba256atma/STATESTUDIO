/**
 * NEA-7:8 — Intake Orchestration Freeze Compatibility.
 *
 * Immutable compatibility declarations for frozen Intake Orchestration.
 * Declarative only. No runtime evaluation.
 *
 * Ownership: owned exclusively by NEA-7:8.
 */

import { IntakeOrchestrationCertificationId } from "./intakeOrchestrationCertification.ts";
import type {
  IntakeOrchestrationFreezeCompatibilityDeclaration,
  IntakeOrchestrationFreezeCompatibilityId,
} from "./intakeOrchestrationFreezeTypes.ts";

const compatibility = (
  compatibilityId: IntakeOrchestrationFreezeCompatibilityId,
  compatibilityName: string,
  description: string,
  order: number,
): IntakeOrchestrationFreezeCompatibilityDeclaration =>
  Object.freeze({
    compatibilityId,
    compatibilityName,
    description,
    compatible: true as const,
    certificationReference: `${IntakeOrchestrationCertificationId}/${compatibilityId}`,
    executesRuntime: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

/** Canonical compatibility declarations — exactly ten. */
export const IntakeOrchestrationFreezeCompatibilityDeclarations: readonly IntakeOrchestrationFreezeCompatibilityDeclaration[] =
  Object.freeze([
    compatibility(
      "PlatformCompatibility",
      "Platform Compatibility",
      "Frozen Platform composition remains the sole certified composition surface.",
      1,
    ),
    compatibility(
      "NamespaceCompatibility",
      "Namespace Compatibility",
      "Platform namespace sections remain compatible for Public Index consumers.",
      2,
    ),
    compatibility(
      "ConsumerCompatibility",
      "Consumer Compatibility",
      "Consumers may rely only on frozen public surfaces without mutating priors.",
      3,
    ),
    compatibility(
      "ExecutiveIntakePackageCompatibility",
      "Executive Intake Package Compatibility",
      "Canonical Executive Intake Package contract remains stable and metadata-only for consumers.",
      4,
    ),
    compatibility(
      "RegistryCompatibility",
      "Registry Compatibility",
      "Registry collections remain stable and metadata-only for consumers.",
      5,
    ),
    compatibility(
      "PublicApiCompatibility",
      "Public API Compatibility",
      "Eight-export public APIs remain stable across Foundation through Certification.",
      6,
    ),
    compatibility(
      "InventoryCompatibility",
      "Inventory Compatibility",
      "Inventory counts remain Certification-derived and non-reconstructed.",
      7,
    ),
    compatibility(
      "VersionCompatibility",
      "Version Compatibility",
      "Version 1.0.0 freeze baseline is forward-compatible for additive Public Index.",
      8,
    ),
    compatibility(
      "DependencyCompatibility",
      "Dependency Compatibility",
      "Dependency direction remains Freeze → Certification → Platform → Manifest → Validation → Model → Registry → Foundation.",
      9,
    ),
    compatibility(
      "CertificationCompatibility",
      "Certification Compatibility",
      "Certification Pass outcome and ReadyForFreeze readiness remain the freeze baseline.",
      10,
    ),
  ]);

/** Canonical immutable compatibility catalog. */
export const IntakeOrchestrationFreezeCompatibilityCatalog = Object.freeze({
  catalogId: "NEA-7:8/FreezeCompatibilityCatalog",
  sourcePhase: "NEA-7:8" as const,
  certificationId: IntakeOrchestrationCertificationId,
  declarations: IntakeOrchestrationFreezeCompatibilityDeclarations,
  compatibilityCount:
    IntakeOrchestrationFreezeCompatibilityDeclarations.length,
  allCompatible: IntakeOrchestrationFreezeCompatibilityDeclarations.every(
    (item) => item.compatible === true,
  ),
  executesRuntime: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
