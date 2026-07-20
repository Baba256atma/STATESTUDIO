/**
 * NEA-5:7 — Gateway Routing Certification Compliance.
 *
 * Immutable architectural compliance declarations for Gateway Routing.
 * Declarative only. No runtime evaluation.
 *
 * Ownership: owned exclusively by NEA-5:7.
 */

import {
  GatewayRoutingPlatform,
  GatewayRoutingPlatformId,
} from "./gatewayRoutingPlatform.ts";
import type { GatewayRoutingComplianceDeclaration } from "./gatewayRoutingCertificationTypes.ts";

const platform = GatewayRoutingPlatform;

const compliance = (
  key: string,
  complianceName: string,
  description: string,
  order: number,
): GatewayRoutingComplianceDeclaration =>
  Object.freeze({
    complianceId: `NEA-5:7/Compliance/${key}`,
    complianceName,
    description,
    compliant: true as const,
    platformReference: `${GatewayRoutingPlatformId}/${key}`,
    executesRuntime: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

/** Exactly ten compliance declarations. */
export const GatewayRoutingCertificationComplianceDeclarations: readonly GatewayRoutingComplianceDeclaration[] =
  Object.freeze([
    compliance(
      "PhaseChain",
      "Phase Chain",
      "NEA-5:1 through NEA-5:6 phase chain is composed through Platform namespace.",
      1,
    ),
    compliance(
      "CanonicalReferences",
      "Canonical References",
      "All upstream surfaces are referenced; none are reconstructed.",
      2,
    ),
    compliance(
      "RouteIdentity",
      "Route Identity",
      "Route identities are certified through the Registry collections surface.",
      3,
    ),
    compliance(
      "RouteDefinition",
      "Route Definition",
      "Route definitions are certified through the Model domain model surface.",
      4,
    ),
    compliance(
      "Ownership",
      "Ownership",
      "Ownership remains unique per phase; Platform does not claim upstream ownership.",
      5,
    ),
    compliance(
      "Inventories",
      "Inventories",
      "Inventories are derived from canonical collections without hardcoding.",
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
export const GatewayRoutingCertificationComplianceCatalog = Object.freeze({
  catalogId: "NEA-5:7/ComplianceCatalog",
  sourcePhase: "NEA-5:7" as const,
  platformId: GatewayRoutingPlatformId,
  declarations: GatewayRoutingCertificationComplianceDeclarations,
  complianceCount:
    GatewayRoutingCertificationComplianceDeclarations.length,
  allCompliant: GatewayRoutingCertificationComplianceDeclarations.every(
    (item) => item.compliant === true,
  ),
  platformManifestOnly: platform.dependency.manifestOnly,
  platformImmutable: platform.immutable,
  executesRuntime: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
