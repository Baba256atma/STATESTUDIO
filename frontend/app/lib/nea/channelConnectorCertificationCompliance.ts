/**
 * NEA-2:7 — Channel Connectors Certification Compliance.
 *
 * Immutable architectural compliance declarations for Channel Connectors.
 * Declarative only. No runtime evaluation.
 *
 * Ownership: owned exclusively by NEA-2:7.
 */

import {
  ChannelConnectorPlatform,
  ChannelConnectorPlatformId,
} from "./channelConnectorPlatform.ts";
import type { ChannelConnectorComplianceDeclaration } from "./channelConnectorCertificationTypes.ts";

const platform = ChannelConnectorPlatform;

const compliance = (
  key: string,
  complianceName: string,
  description: string,
  order: number,
): ChannelConnectorComplianceDeclaration =>
  Object.freeze({
    complianceId: `NEA-2:7/Compliance/${key}`,
    complianceName,
    description,
    compliant: true as const,
    platformReference: `${ChannelConnectorPlatformId}/${key}`,
    executesRuntime: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

/** Canonical compliance declarations. */
export const ChannelConnectorCertificationComplianceDeclarations: readonly ChannelConnectorComplianceDeclaration[] =
  Object.freeze([
    compliance(
      "PhaseChain",
      "Phase Chain",
      "NEA-2:1 through NEA-2:6 phase chain is composed through Platform namespace.",
      1,
    ),
    compliance(
      "CanonicalReferences",
      "Canonical References",
      "All upstream surfaces are referenced; none are reconstructed.",
      2,
    ),
    compliance(
      "ConnectorIdentityRegistry",
      "Connector Identity Registry",
      "Connector identities are certified through the Registry collections surface.",
      3,
    ),
    compliance(
      "Ownership",
      "Ownership",
      "Ownership remains unique per phase; Platform does not claim upstream ownership.",
      4,
    ),
    compliance(
      "Inventories",
      "Inventories",
      "Inventories are derived from canonical collections without hardcoding.",
      5,
    ),
    compliance(
      "NamespaceComposition",
      "Namespace Composition",
      "Platform namespace includes foundation, registry, model, validation, manifest, and platform.",
      6,
    ),
    compliance(
      "PublicSurface",
      "Public Surface",
      "Each phase exposes a controlled eight-export public surface.",
      7,
    ),
    compliance(
      "Immutability",
      "Immutability",
      "Platform and upstream surfaces declare immutable metadata-only architecture.",
      8,
    ),
    compliance(
      "DependencyDirection",
      "Dependency Direction",
      "Dependency direction is Platform → Manifest → Validation → Model → Registry → Foundation.",
      9,
    ),
  ]);

/** Canonical immutable compliance catalog. */
export const ChannelConnectorCertificationComplianceCatalog = Object.freeze({
  catalogId: "NEA-2:7/ComplianceCatalog",
  sourcePhase: "NEA-2:7" as const,
  platformId: ChannelConnectorPlatformId,
  declarations: ChannelConnectorCertificationComplianceDeclarations,
  complianceCount:
    ChannelConnectorCertificationComplianceDeclarations.length,
  allCompliant: ChannelConnectorCertificationComplianceDeclarations.every(
    (item) => item.compliant === true,
  ),
  platformManifestOnly: platform.dependency.manifestOnly,
  platformImmutable: platform.immutable,
  executesRuntime: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
