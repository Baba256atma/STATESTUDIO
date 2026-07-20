/**
 * NEA-4:8 — Security Gateway Freeze Compatibility.
 *
 * Immutable compatibility declarations for frozen Security Gateway.
 * Declarative only. No runtime evaluation.
 *
 * Ownership: owned exclusively by NEA-4:8.
 */

import { SecurityGatewayCertificationId } from "./securityGatewayCertification.ts";
import type {
  SecurityGatewayFreezeCompatibilityDeclaration,
  SecurityGatewayFreezeCompatibilityId,
} from "./securityGatewayFreezeTypes.ts";

const compatibility = (
  compatibilityId: SecurityGatewayFreezeCompatibilityId,
  compatibilityName: string,
  description: string,
  order: number,
): SecurityGatewayFreezeCompatibilityDeclaration =>
  Object.freeze({
    compatibilityId,
    compatibilityName,
    description,
    compatible: true as const,
    certificationReference: `${SecurityGatewayCertificationId}/${compatibilityId}`,
    executesRuntime: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

/** Canonical compatibility declarations — exactly ten. */
export const SecurityGatewayFreezeCompatibilityDeclarations: readonly SecurityGatewayFreezeCompatibilityDeclaration[] =
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
      "SecurityIdentityCompatibility",
      "Security Identity Compatibility",
      "Security identity registry remains stable and metadata-only for consumers.",
      4,
    ),
    compatibility(
      "SecurityPolicyCompatibility",
      "Security Policy Compatibility",
      "Security policy registry remains stable and metadata-only for consumers.",
      5,
    ),
    compatibility(
      "PermissionCompatibility",
      "Permission Compatibility",
      "Permission registry remains stable without permission evaluation behavior.",
      6,
    ),
    compatibility(
      "PublicApiCompatibility",
      "Public API Compatibility",
      "Eight-export public APIs remain stable across Foundation through Certification.",
      7,
    ),
    compatibility(
      "InventoryCompatibility",
      "Inventory Compatibility",
      "Inventory counts remain Certification-derived and non-reconstructed.",
      8,
    ),
    compatibility(
      "VersionCompatibility",
      "Version Compatibility",
      "Version 1.0.0 freeze baseline is forward-compatible for additive Public Index.",
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
export const SecurityGatewayFreezeCompatibilityCatalog = Object.freeze({
  catalogId: "NEA-4:8/FreezeCompatibilityCatalog",
  sourcePhase: "NEA-4:8" as const,
  certificationId: SecurityGatewayCertificationId,
  declarations: SecurityGatewayFreezeCompatibilityDeclarations,
  compatibilityCount:
    SecurityGatewayFreezeCompatibilityDeclarations.length,
  allCompatible: SecurityGatewayFreezeCompatibilityDeclarations.every(
    (item) => item.compatible === true,
  ),
  executesRuntime: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
