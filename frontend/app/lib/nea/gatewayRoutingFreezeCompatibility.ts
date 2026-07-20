/**
 * NEA-5:8 — Gateway Routing Freeze Compatibility.
 *
 * Immutable compatibility declarations for frozen Gateway Routing.
 * Declarative only. No runtime evaluation.
 *
 * Ownership: owned exclusively by NEA-5:8.
 */

import { GatewayRoutingCertificationId } from "./gatewayRoutingCertification.ts";
import type {
  GatewayRoutingFreezeCompatibilityDeclaration,
  GatewayRoutingFreezeCompatibilityId,
} from "./gatewayRoutingFreezeTypes.ts";

const compatibility = (
  compatibilityId: GatewayRoutingFreezeCompatibilityId,
  compatibilityName: string,
  description: string,
  order: number,
): GatewayRoutingFreezeCompatibilityDeclaration =>
  Object.freeze({
    compatibilityId,
    compatibilityName,
    description,
    compatible: true as const,
    certificationReference: `${GatewayRoutingCertificationId}/${compatibilityId}`,
    executesRuntime: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

/** Canonical compatibility declarations — exactly ten. */
export const GatewayRoutingFreezeCompatibilityDeclarations: readonly GatewayRoutingFreezeCompatibilityDeclaration[] =
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
      "RouteIdentityCompatibility",
      "Route Identity Compatibility",
      "Route identity registry remains stable and metadata-only for consumers.",
      4,
    ),
    compatibility(
      "RouteDefinitionCompatibility",
      "Route Definition Compatibility",
      "Route Definition domain model remains stable and metadata-only for consumers.",
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
      "Dependency direction remains Certification → Platform → Manifest → Validation → Model → Registry → Foundation.",
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
export const GatewayRoutingFreezeCompatibilityCatalog = Object.freeze({
  catalogId: "NEA-5:8/FreezeCompatibilityCatalog",
  sourcePhase: "NEA-5:8" as const,
  certificationId: GatewayRoutingCertificationId,
  declarations: GatewayRoutingFreezeCompatibilityDeclarations,
  compatibilityCount:
    GatewayRoutingFreezeCompatibilityDeclarations.length,
  allCompatible: GatewayRoutingFreezeCompatibilityDeclarations.every(
    (item) => item.compatible === true,
  ),
  executesRuntime: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
