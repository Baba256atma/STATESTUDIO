/**
 * EIL-7:6 — Integration Governance Platform Compatibility.
 *
 * Exactly twelve immutable compatibility declarations.
 * Metadata-only. No runtime compatibility logic.
 *
 * Ownership: owned exclusively by EIL-7:6.
 */

import { IntegrationGovernanceManifestCanonicalId } from "./integrationGovernanceManifest.ts";

/** Closed compatibility key vocabulary. */
export type GovernancePlatformCompatibilityKey =
  | "FoundationCompatible"
  | "RegistryCompatible"
  | "ModelCompatible"
  | "ValidationCompatible"
  | "ManifestCompatible"
  | "CertificationCompatible"
  | "FreezeCompatible"
  | "PublicIndexCompatible"
  | "TypeScriptCompatible"
  | "ESLintCompatible"
  | "MetadataCompatible"
  | "CanonicalArchitectureCompatible";

/** Immutable compatibility descriptor. */
export interface IntegrationGovernancePlatformCompatibilityDeclaration {
  readonly compatibilityId: `EIL-7:6/Compatibility/${GovernancePlatformCompatibilityKey}`;
  readonly canonicalKey: GovernancePlatformCompatibilityKey;
  readonly canonicalName: string;
  readonly description: string;
  readonly order: number;
  readonly namespace: "nexora.eil.integration-governance.platform";
  readonly sourceManifestId: typeof IntegrationGovernanceManifestCanonicalId;
  readonly executesRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

const compatibility = (
  key: GovernancePlatformCompatibilityKey,
  canonicalName: string,
  description: string,
  order: number,
): IntegrationGovernancePlatformCompatibilityDeclaration =>
  Object.freeze({
    compatibilityId: `EIL-7:6/Compatibility/${key}` as const,
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
 * Exactly twelve compatibility declarations in deterministic order.
 */
export const IntegrationGovernancePlatformCompatibility: readonly IntegrationGovernancePlatformCompatibilityDeclaration[] =
  Object.freeze([
    compatibility(
      "FoundationCompatible",
      "Foundation Compatible",
      "Compatible with EIL-7:1 Integration Governance Foundation.",
      1,
    ),
    compatibility(
      "RegistryCompatible",
      "Registry Compatible",
      "Compatible with EIL-7:2 Integration Governance Registry.",
      2,
    ),
    compatibility(
      "ModelCompatible",
      "Model Compatible",
      "Compatible with EIL-7:3 Integration Governance Model.",
      3,
    ),
    compatibility(
      "ValidationCompatible",
      "Validation Compatible",
      "Compatible with EIL-7:4 Integration Governance Validation.",
      4,
    ),
    compatibility(
      "ManifestCompatible",
      "Manifest Compatible",
      "Compatible with EIL-7:5 Integration Governance Manifest.",
      5,
    ),
    compatibility(
      "CertificationCompatible",
      "Certification Compatible",
      "Architecturally compatible with forthcoming Certification phase.",
      6,
    ),
    compatibility(
      "FreezeCompatible",
      "Freeze Compatible",
      "Architecturally compatible with forthcoming Freeze phase.",
      7,
    ),
    compatibility(
      "PublicIndexCompatible",
      "Public Index Compatible",
      "Architecturally compatible with forthcoming Public Index phase.",
      8,
    ),
    compatibility(
      "TypeScriptCompatible",
      "TypeScript Compatible",
      "Compatible with strict TypeScript architectural compilation.",
      9,
    ),
    compatibility(
      "ESLintCompatible",
      "ESLint Compatible",
      "Compatible with package ESLint architectural linting.",
      10,
    ),
    compatibility(
      "MetadataCompatible",
      "Metadata Compatible",
      "Compatible with metadata-only architectural publication rules.",
      11,
    ),
    compatibility(
      "CanonicalArchitectureCompatible",
      "Canonical Architecture Compatible",
      "Compatible with the canonical EIL Integration Governance ladder.",
      12,
    ),
  ]);
