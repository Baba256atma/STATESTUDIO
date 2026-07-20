/**
 * NEA-8:7 — Executive Gateway Suite Certification Compliance.
 *
 * Immutable architectural compliance declarations for the Executive Gateway Suite.
 * Declarative only. No runtime evaluation.
 *
 * Ownership: owned exclusively by NEA-8:7.
 */

import {
  ExecutiveGatewaySuitePlatform,
  ExecutiveGatewaySuitePlatformId,
} from "./executiveGatewaySuitePlatform.ts";
import type { ExecutiveGatewaySuiteComplianceDeclaration } from "./executiveGatewaySuiteCertificationTypes.ts";

const platform = ExecutiveGatewaySuitePlatform;

const compliance = (
  key: string,
  complianceName: string,
  description: string,
  order: number,
): ExecutiveGatewaySuiteComplianceDeclaration =>
  Object.freeze({
    complianceId: `NEA-8:7/Compliance/${key}`,
    complianceName,
    description,
    compliant: true as const,
    platformReference: `${ExecutiveGatewaySuitePlatformId}/${key}`,
    executesRuntime: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

/** Exactly ten compliance declarations — all Compliant. */
export const ExecutiveGatewaySuiteCertificationComplianceDeclarations: readonly ExecutiveGatewaySuiteComplianceDeclaration[] =
  Object.freeze([
    compliance(
      "PhaseChain",
      "Phase Chain",
      "NEA-8:1 through NEA-8:6 phase chain is composed through Platform namespace.",
      1,
    ),
    compliance(
      "CanonicalReferences",
      "Canonical References",
      "All upstream surfaces are referenced; none are reconstructed.",
      2,
    ),
    compliance(
      "SuiteComposition",
      "Suite Composition",
      "Seven released NEA platforms are composed by canonical reference through Platform.",
      3,
    ),
    compliance(
      "ComponentIdentities",
      "Component Identities",
      "Component identities remain aligned to NEA-1 through NEA-7 through Platform namespace.",
      4,
    ),
    compliance(
      "Ownership",
      "Ownership",
      "Ownership remains unique; Certification does not claim Platform or earlier phases.",
      5,
    ),
    compliance(
      "Inventory",
      "Inventory",
      "Inventories are published by Manifest and derived through Platform without reconstruction.",
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
export const ExecutiveGatewaySuiteCertificationComplianceCatalog = Object.freeze({
  catalogId: "NEA-8:7/ComplianceCatalog",
  sourcePhase: "NEA-8:7" as const,
  platformId: ExecutiveGatewaySuitePlatformId,
  declarations: ExecutiveGatewaySuiteCertificationComplianceDeclarations,
  complianceCount:
    ExecutiveGatewaySuiteCertificationComplianceDeclarations.length,
  allCompliant:
    ExecutiveGatewaySuiteCertificationComplianceDeclarations.every(
      (item) => item.compliant === true,
    ),
  platformManifestOnly: platform.dependency.manifestOnly,
  platformImmutable: platform.immutable,
  executesRuntime: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
