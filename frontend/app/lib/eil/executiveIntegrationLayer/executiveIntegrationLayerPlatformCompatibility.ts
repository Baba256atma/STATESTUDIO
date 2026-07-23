/**
 * EIL-9:6 — Executive Integration Layer Platform Compatibility.
 *
 * Exactly twelve immutable compatibility declarations.
 * Metadata-only. No runtime compatibility logic.
 *
 * Ownership: owned exclusively by EIL-9:6.
 */

import { ExecutiveIntegrationLayerManifestCanonicalId } from "./executiveIntegrationLayerManifest.ts";

/** Closed compatibility key vocabulary. */
export type LayerPlatformCompatibilityKey =
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
export interface ExecutiveIntegrationLayerPlatformCompatibilityDeclaration {
  readonly compatibilityId: `EIL-9:6/Compatibility/${LayerPlatformCompatibilityKey}`;
  readonly canonicalKey: LayerPlatformCompatibilityKey;
  readonly canonicalName: string;
  readonly description: string;
  readonly order: number;
  readonly namespace: "nexora.eil.executive-integration-layer.platform";
  readonly sourceManifestId: typeof ExecutiveIntegrationLayerManifestCanonicalId;
  readonly executesRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

const compatibility = (
  key: LayerPlatformCompatibilityKey,
  canonicalName: string,
  description: string,
  order: number,
): ExecutiveIntegrationLayerPlatformCompatibilityDeclaration =>
  Object.freeze({
    compatibilityId: `EIL-9:6/Compatibility/${key}` as const,
    canonicalKey: key,
    canonicalName,
    description,
    order,
    namespace: "nexora.eil.executive-integration-layer.platform" as const,
    sourceManifestId: ExecutiveIntegrationLayerManifestCanonicalId,
    executesRuntime: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

/**
 * Exactly twelve compatibility declarations in deterministic order.
 */
export const ExecutiveIntegrationLayerPlatformCompatibility: readonly ExecutiveIntegrationLayerPlatformCompatibilityDeclaration[] =
  Object.freeze([
    compatibility(
      "FoundationCompatible",
      "Foundation Compatible",
      "Compatible with EIL-9:1 Executive Integration Layer Foundation.",
      1,
    ),
    compatibility(
      "RegistryCompatible",
      "Registry Compatible",
      "Compatible with EIL-9:2 Executive Integration Layer Registry.",
      2,
    ),
    compatibility(
      "ModelCompatible",
      "Model Compatible",
      "Compatible with EIL-9:3 Executive Integration Layer Model.",
      3,
    ),
    compatibility(
      "ValidationCompatible",
      "Validation Compatible",
      "Compatible with EIL-9:4 Executive Integration Layer Validation.",
      4,
    ),
    compatibility(
      "ManifestCompatible",
      "Manifest Compatible",
      "Compatible with EIL-9:5 Executive Integration Layer Manifest.",
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
      "Compatible with the canonical EIL Executive Integration Layer ladder.",
      12,
    ),
  ]);
