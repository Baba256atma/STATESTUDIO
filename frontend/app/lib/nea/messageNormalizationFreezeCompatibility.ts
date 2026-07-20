/**
 * NEA-6:8 — Message Normalization Freeze Compatibility.
 *
 * Immutable compatibility declarations for frozen Message Normalization.
 * Declarative only. No runtime evaluation.
 *
 * Ownership: owned exclusively by NEA-6:8.
 */

import { MessageNormalizationCertificationId } from "./messageNormalizationCertification.ts";
import type {
  MessageNormalizationFreezeCompatibilityDeclaration,
  MessageNormalizationFreezeCompatibilityId,
} from "./messageNormalizationFreezeTypes.ts";

const compatibility = (
  compatibilityId: MessageNormalizationFreezeCompatibilityId,
  compatibilityName: string,
  description: string,
  order: number,
): MessageNormalizationFreezeCompatibilityDeclaration =>
  Object.freeze({
    compatibilityId,
    compatibilityName,
    description,
    compatible: true as const,
    certificationReference: `${MessageNormalizationCertificationId}/${compatibilityId}`,
    executesRuntime: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

/** Canonical compatibility declarations — exactly ten. */
export const MessageNormalizationFreezeCompatibilityDeclarations: readonly MessageNormalizationFreezeCompatibilityDeclaration[] =
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
      "ExecutiveMessageCompatibility",
      "Executive Message Compatibility",
      "Canonical Executive Message contract remains stable and metadata-only for consumers.",
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
export const MessageNormalizationFreezeCompatibilityCatalog = Object.freeze({
  catalogId: "NEA-6:8/FreezeCompatibilityCatalog",
  sourcePhase: "NEA-6:8" as const,
  certificationId: MessageNormalizationCertificationId,
  declarations: MessageNormalizationFreezeCompatibilityDeclarations,
  compatibilityCount:
    MessageNormalizationFreezeCompatibilityDeclarations.length,
  allCompatible: MessageNormalizationFreezeCompatibilityDeclarations.every(
    (item) => item.compatible === true,
  ),
  executesRuntime: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
