/**
 * NEA-8:8 — Executive Gateway Suite Freeze Compatibility.
 *
 * Immutable compatibility declarations for frozen Executive Gateway Suite.
 * Declarative only. No runtime evaluation.
 *
 * Ownership: owned exclusively by NEA-8:8.
 */

import { ExecutiveGatewaySuiteCertificationId } from "./executiveGatewaySuiteCertification.ts";
import type {
  ExecutiveGatewaySuiteFreezeCompatibilityDeclaration,
  ExecutiveGatewaySuiteFreezeCompatibilityId,
} from "./executiveGatewaySuiteFreezeTypes.ts";

const compatibility = (
  compatibilityId: ExecutiveGatewaySuiteFreezeCompatibilityId,
  compatibilityName: string,
  description: string,
  order: number,
): ExecutiveGatewaySuiteFreezeCompatibilityDeclaration =>
  Object.freeze({
    compatibilityId,
    compatibilityName,
    description,
    compatible: true as const,
    certificationReference: `${ExecutiveGatewaySuiteCertificationId}/${compatibilityId}`,
    executesRuntime: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

/** Canonical compatibility declarations — exactly ten. */
export const ExecutiveGatewaySuiteFreezeCompatibilityDeclarations: readonly ExecutiveGatewaySuiteFreezeCompatibilityDeclaration[] =
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
      "SuiteCompositionCompatibility",
      "Suite Composition Compatibility",
      "Seven-component suite composition remains stable and metadata-only for consumers.",
      4,
    ),
    compatibility(
      "ComponentIdentityCompatibility",
      "Component Identity Compatibility",
      "Component identities for NEA-1 through NEA-7 remain stable for consumers.",
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
export const ExecutiveGatewaySuiteFreezeCompatibilityCatalog = Object.freeze({
  catalogId: "NEA-8:8/FreezeCompatibilityCatalog",
  sourcePhase: "NEA-8:8" as const,
  certificationId: ExecutiveGatewaySuiteCertificationId,
  declarations: ExecutiveGatewaySuiteFreezeCompatibilityDeclarations,
  compatibilityCount:
    ExecutiveGatewaySuiteFreezeCompatibilityDeclarations.length,
  allCompatible: ExecutiveGatewaySuiteFreezeCompatibilityDeclarations.every(
    (item) => item.compatible === true,
  ),
  executesRuntime: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
