/**
 * NEA-2:8 — Channel Connectors Freeze Compatibility.
 *
 * Immutable compatibility declarations for the frozen Channel Connectors.
 * Declarative only. No runtime evaluation.
 *
 * Ownership: owned exclusively by NEA-2:8.
 */

import { ChannelConnectorCertificationId } from "./channelConnectorCertification.ts";
import type {
  ChannelConnectorFreezeCompatibilityDeclaration,
  ChannelConnectorFreezeCompatibilityId,
} from "./channelConnectorFreezeTypes.ts";

const compatibility = (
  compatibilityId: ChannelConnectorFreezeCompatibilityId,
  compatibilityName: string,
  description: string,
  order: number,
): ChannelConnectorFreezeCompatibilityDeclaration =>
  Object.freeze({
    compatibilityId,
    compatibilityName,
    description,
    compatible: true as const,
    certificationReference: `${ChannelConnectorCertificationId}/${compatibilityId}`,
    executesRuntime: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

/** Canonical compatibility declarations — exactly nine. */
export const ChannelConnectorFreezeCompatibilityDeclarations: readonly ChannelConnectorFreezeCompatibilityDeclaration[] =
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
      "ConnectorIdentityCompatibility",
      "Connector Identity Compatibility",
      "Connector identity registry remains stable and metadata-only for consumers.",
      4,
    ),
    compatibility(
      "PublicApiCompatibility",
      "Public API Compatibility",
      "Eight-export public APIs remain stable across Foundation through Certification.",
      5,
    ),
    compatibility(
      "InventoryCompatibility",
      "Inventory Compatibility",
      "Inventory counts remain Certification-derived and non-reconstructed.",
      6,
    ),
    compatibility(
      "VersionCompatibility",
      "Version Compatibility",
      "Version 1.0.0 freeze baseline is forward-compatible for additive Public Index.",
      7,
    ),
    compatibility(
      "DependencyCompatibility",
      "Dependency Compatibility",
      "Dependency direction remains Certification → Platform → Manifest → Validation → Model → Registry → Foundation.",
      8,
    ),
    compatibility(
      "CertificationCompatibility",
      "Certification Compatibility",
      "Certification Pass outcome and ReadyForFreeze readiness remain the freeze baseline.",
      9,
    ),
  ]);

/** Canonical immutable compatibility catalog. */
export const ChannelConnectorFreezeCompatibilityCatalog = Object.freeze({
  catalogId: "NEA-2:8/FreezeCompatibilityCatalog",
  sourcePhase: "NEA-2:8" as const,
  certificationId: ChannelConnectorCertificationId,
  declarations: ChannelConnectorFreezeCompatibilityDeclarations,
  compatibilityCount:
    ChannelConnectorFreezeCompatibilityDeclarations.length,
  allCompatible: ChannelConnectorFreezeCompatibilityDeclarations.every(
    (item) => item.compatible === true,
  ),
  executesRuntime: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
