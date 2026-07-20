/**
 * NEA-1:8 — Executive Gateway Freeze Compatibility.
 *
 * Immutable compatibility declarations for the frozen Executive Gateway.
 * Declarative only. No runtime evaluation.
 *
 * Ownership: owned exclusively by NEA-1:8.
 */

import { ExecutiveGatewayCertificationId } from "./executiveGatewayCertification.ts";
import type {
  ExecutiveGatewayFreezeCompatibilityDeclaration,
  ExecutiveGatewayFreezeCompatibilityId,
} from "./executiveGatewayFreezeTypes.ts";

const compatibility = (
  compatibilityId: ExecutiveGatewayFreezeCompatibilityId,
  compatibilityName: string,
  description: string,
  order: number,
): ExecutiveGatewayFreezeCompatibilityDeclaration =>
  Object.freeze({
    compatibilityId,
    compatibilityName,
    description,
    compatible: true as const,
    certificationReference: `${ExecutiveGatewayCertificationId}/${compatibilityId}`,
    executesRuntime: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

/** Canonical compatibility declarations — exactly eight. */
export const ExecutiveGatewayFreezeCompatibilityDeclarations: readonly ExecutiveGatewayFreezeCompatibilityDeclaration[] =
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
      "PublicApiCompatibility",
      "Public API Compatibility",
      "Eight-export public APIs remain stable across Foundation through Certification.",
      4,
    ),
    compatibility(
      "InventoryCompatibility",
      "Inventory Compatibility",
      "Inventory counts remain Certification-derived and non-reconstructed.",
      5,
    ),
    compatibility(
      "VersionCompatibility",
      "Version Compatibility",
      "Version 1.0.0 freeze baseline is forward-compatible for additive Public Index.",
      6,
    ),
    compatibility(
      "DependencyCompatibility",
      "Dependency Compatibility",
      "Dependency direction remains Certification → Platform → Manifest → Validation → Model → Registry → Foundation.",
      7,
    ),
    compatibility(
      "CertificationCompatibility",
      "Certification Compatibility",
      "Certification Pass outcome and ReadyForFreeze readiness remain the freeze baseline.",
      8,
    ),
  ]);

/** Canonical immutable compatibility catalog. */
export const ExecutiveGatewayFreezeCompatibilityCatalog = Object.freeze({
  catalogId: "NEA-1:8/FreezeCompatibilityCatalog",
  sourcePhase: "NEA-1:8" as const,
  certificationId: ExecutiveGatewayCertificationId,
  declarations: ExecutiveGatewayFreezeCompatibilityDeclarations,
  compatibilityCount:
    ExecutiveGatewayFreezeCompatibilityDeclarations.length,
  allCompatible: ExecutiveGatewayFreezeCompatibilityDeclarations.every(
    (item) => item.compatible === true,
  ),
  executesRuntime: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
