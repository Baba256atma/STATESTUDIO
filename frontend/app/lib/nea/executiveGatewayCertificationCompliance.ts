/**
 * NEA-1:7 — Executive Gateway Certification Compliance.
 *
 * Immutable architectural compliance declarations for the Executive Gateway.
 * Declarative only. No runtime evaluation.
 *
 * Ownership: owned exclusively by NEA-1:7.
 */

import {
  ExecutiveGatewayPlatform,
  ExecutiveGatewayPlatformId,
} from "./executiveGatewayPlatform.ts";
import type { ExecutiveGatewayComplianceDeclaration } from "./executiveGatewayCertificationTypes.ts";

const platform = ExecutiveGatewayPlatform;

const compliance = (
  key: string,
  complianceName: string,
  description: string,
  order: number,
): ExecutiveGatewayComplianceDeclaration =>
  Object.freeze({
    complianceId: `NEA-1:7/Compliance/${key}`,
    complianceName,
    description,
    compliant: true as const,
    platformReference: `${ExecutiveGatewayPlatformId}/${key}`,
    executesRuntime: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

/** Canonical compliance declarations. */
export const ExecutiveGatewayCertificationComplianceDeclarations: readonly ExecutiveGatewayComplianceDeclaration[] =
  Object.freeze([
    compliance(
      "PhaseChain",
      "Phase Chain",
      "NEA-1:1 through NEA-1:6 phase chain is composed through Platform namespace.",
      1,
    ),
    compliance(
      "CanonicalReferences",
      "Canonical References",
      "All upstream surfaces are referenced; none are reconstructed.",
      2,
    ),
    compliance(
      "Ownership",
      "Ownership",
      "Ownership remains unique per phase; Platform does not claim upstream ownership.",
      3,
    ),
    compliance(
      "Inventories",
      "Inventories",
      "Inventories are derived from canonical collections without hardcoding.",
      4,
    ),
    compliance(
      "NamespaceComposition",
      "Namespace Composition",
      "Platform namespace includes foundation, registry, model, validation, manifest, and platform.",
      5,
    ),
    compliance(
      "PublicSurface",
      "Public Surface",
      "Each phase exposes a controlled eight-export public surface.",
      6,
    ),
    compliance(
      "Immutability",
      "Immutability",
      "Platform and upstream surfaces declare immutable metadata-only architecture.",
      7,
    ),
    compliance(
      "DependencyDirection",
      "Dependency Direction",
      "Dependency direction is Platform → Manifest → Validation → Model → Registry → Foundation.",
      8,
    ),
  ]);

/** Canonical immutable compliance catalog. */
export const ExecutiveGatewayCertificationComplianceCatalog = Object.freeze({
  catalogId: "NEA-1:7/ComplianceCatalog",
  sourcePhase: "NEA-1:7" as const,
  platformId: ExecutiveGatewayPlatformId,
  declarations: ExecutiveGatewayCertificationComplianceDeclarations,
  complianceCount: ExecutiveGatewayCertificationComplianceDeclarations.length,
  allCompliant: ExecutiveGatewayCertificationComplianceDeclarations.every(
    (item) => item.compliant === true,
  ),
  platformManifestOnly: platform.dependency.manifestOnly,
  platformImmutable: platform.immutable,
  executesRuntime: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
