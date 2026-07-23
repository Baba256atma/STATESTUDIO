/**
 * EIL-7:6 — Integration Governance Platform Capabilities.
 *
 * Exactly eighteen immutable platform capabilities.
 * Metadata-only. No runtime capability execution.
 *
 * Ownership: owned exclusively by EIL-7:6.
 */

import { IntegrationGovernanceManifestCanonicalId } from "./integrationGovernanceManifest.ts";

/** Closed platform-capability key vocabulary. */
export type GovernancePlatformCapabilityKey =
  | "FoundationComposition"
  | "RegistryComposition"
  | "ModelComposition"
  | "ValidationComposition"
  | "ManifestComposition"
  | "MetadataPublication"
  | "CanonicalIdentity"
  | "DependencyIntegrity"
  | "ValidationIntegrity"
  | "ReadinessPublication"
  | "ExportStability"
  | "CompatibilityPublication"
  | "PlatformConsistency"
  | "InventoryIntegrity"
  | "TypeIntegrity"
  | "ArchitectureIntegrity"
  | "PlatformPackaging"
  | "CertificationReadiness";

/** Immutable platform capability descriptor. */
export interface IntegrationGovernancePlatformCapability {
  readonly capabilityId: `EIL-7:6/Capability/${GovernancePlatformCapabilityKey}`;
  readonly canonicalKey: GovernancePlatformCapabilityKey;
  readonly canonicalName: string;
  readonly description: string;
  readonly order: number;
  readonly namespace: "nexora.eil.integration-governance.platform";
  readonly sourceManifestId: typeof IntegrationGovernanceManifestCanonicalId;
  readonly executesRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

const capability = (
  key: GovernancePlatformCapabilityKey,
  canonicalName: string,
  description: string,
  order: number,
): IntegrationGovernancePlatformCapability =>
  Object.freeze({
    capabilityId: `EIL-7:6/Capability/${key}` as const,
    canonicalKey: key,
    canonicalName,
    description,
    order,
    namespace: "nexora.eil.integration-governance.platform" as const,
    sourceManifestId: IntegrationGovernanceManifestCanonicalId,
    executesRuntime: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

/**
 * Exactly eighteen platform capabilities in deterministic order.
 */
export const IntegrationGovernancePlatformCapabilities: readonly IntegrationGovernancePlatformCapability[] =
  Object.freeze([
    capability(
      "FoundationComposition",
      "Foundation Composition",
      "Composes Foundation architectural metadata by reference.",
      1,
    ),
    capability(
      "RegistryComposition",
      "Registry Composition",
      "Composes Registry architectural metadata by reference.",
      2,
    ),
    capability(
      "ModelComposition",
      "Model Composition",
      "Composes Model architectural metadata by reference.",
      3,
    ),
    capability(
      "ValidationComposition",
      "Validation Composition",
      "Composes Validation architectural metadata by reference.",
      4,
    ),
    capability(
      "ManifestComposition",
      "Manifest Composition",
      "Composes Manifest architectural metadata by reference.",
      5,
    ),
    capability(
      "MetadataPublication",
      "Metadata Publication",
      "Publishes immutable Platform metadata packaging.",
      6,
    ),
    capability(
      "CanonicalIdentity",
      "Canonical Identity",
      "Publishes canonical Platform identity metadata.",
      7,
    ),
    capability(
      "DependencyIntegrity",
      "Dependency Integrity",
      "Publishes Manifest-only dependency integrity metadata.",
      8,
    ),
    capability(
      "ValidationIntegrity",
      "Validation Integrity",
      "Preserves Validation Pass integrity through Manifest.",
      9,
    ),
    capability(
      "ReadinessPublication",
      "Readiness Publication",
      "Publishes ReadyForCertification readiness metadata.",
      10,
    ),
    capability(
      "ExportStability",
      "Export Stability",
      "Publishes stable package export surface metadata.",
      11,
    ),
    capability(
      "CompatibilityPublication",
      "Compatibility Publication",
      "Publishes Platform compatibility declarations.",
      12,
    ),
    capability(
      "PlatformConsistency",
      "Platform Consistency",
      "Preserves composition consistency across the ladder.",
      13,
    ),
    capability(
      "InventoryIntegrity",
      "Inventory Integrity",
      "Preserves Manifest-derived inventory integrity without redefinition.",
      14,
    ),
    capability(
      "TypeIntegrity",
      "Type Integrity",
      "Preserves strict TypeScript architectural integrity.",
      15,
    ),
    capability(
      "ArchitectureIntegrity",
      "Architecture Integrity",
      "Preserves canonical EIL-7 architecture integrity.",
      16,
    ),
    capability(
      "PlatformPackaging",
      "Platform Packaging",
      "Packages Foundation through Manifest into one Platform aggregate.",
      17,
    ),
    capability(
      "CertificationReadiness",
      "Certification Readiness",
      "Declares architectural readiness for Certification.",
      18,
    ),
  ]);
