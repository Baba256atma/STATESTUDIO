/**
 * EIL-6:6 — Integration Observability Platform Compatibility.
 *
 * Exactly twelve immutable compatibility declarations.
 * Metadata-only. No runtime compatibility logic.
 *
 * Ownership: owned exclusively by EIL-6:6.
 */

import { IntegrationObservabilityManifestCanonicalId } from "./integrationObservabilityManifest.ts";

/** Closed compatibility key vocabulary. */
export type ObservabilityPlatformCompatibilityKey =
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
export interface IntegrationObservabilityPlatformCompatibilityDeclaration {
  readonly compatibilityId: `EIL-6:6/Compatibility/${ObservabilityPlatformCompatibilityKey}`;
  readonly canonicalKey: ObservabilityPlatformCompatibilityKey;
  readonly canonicalName: string;
  readonly description: string;
  readonly order: number;
  readonly namespace: "nexora.eil.integration-observability.platform";
  readonly sourceManifestId: typeof IntegrationObservabilityManifestCanonicalId;
  readonly executesRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

const compatibility = (
  key: ObservabilityPlatformCompatibilityKey,
  canonicalName: string,
  description: string,
  order: number,
): IntegrationObservabilityPlatformCompatibilityDeclaration =>
  Object.freeze({
    compatibilityId: `EIL-6:6/Compatibility/${key}` as const,
    canonicalKey: key,
    canonicalName,
    description,
    order,
    namespace: "nexora.eil.integration-observability.platform" as const,
    sourceManifestId: IntegrationObservabilityManifestCanonicalId,
    executesRuntime: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

/**
 * Exactly twelve compatibility declarations in deterministic order.
 */
export const IntegrationObservabilityPlatformCompatibility: readonly IntegrationObservabilityPlatformCompatibilityDeclaration[] =
  Object.freeze([
    compatibility(
      "FoundationCompatible",
      "Foundation Compatible",
      "Compatible with EIL-6:1 Integration Observability Foundation.",
      1,
    ),
    compatibility(
      "RegistryCompatible",
      "Registry Compatible",
      "Compatible with EIL-6:2 Integration Observability Registry.",
      2,
    ),
    compatibility(
      "ModelCompatible",
      "Model Compatible",
      "Compatible with EIL-6:3 Integration Observability Model.",
      3,
    ),
    compatibility(
      "ValidationCompatible",
      "Validation Compatible",
      "Compatible with EIL-6:4 Integration Observability Validation.",
      4,
    ),
    compatibility(
      "ManifestCompatible",
      "Manifest Compatible",
      "Compatible with EIL-6:5 Integration Observability Manifest.",
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
      "Compatible with the canonical EIL Integration Observability ladder.",
      12,
    ),
  ]);
