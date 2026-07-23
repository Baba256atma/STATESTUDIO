/**
 * EIL-9:5 — Executive Integration Layer Manifest Compatibility.
 *
 * Exactly twelve immutable compatibility declarations.
 * Metadata-only. No runtime compatibility logic.
 *
 * Ownership: owned exclusively by EIL-9:5.
 */

import { ExecutiveIntegrationLayerValidationCanonicalId } from "./executiveIntegrationLayerValidation.ts";

/** Closed compatibility key vocabulary. */
export type LayerManifestCompatibilityKey =
  | "FoundationCompatible"
  | "RegistryCompatible"
  | "ModelCompatible"
  | "ValidationCompatible"
  | "PlatformCompatible"
  | "CertificationCompatible"
  | "FreezeCompatible"
  | "PublicIndexCompatible"
  | "TypeScriptCompatible"
  | "ESLintCompatible"
  | "MetadataCompatible"
  | "CanonicalArchitectureCompatible";

/** Immutable compatibility descriptor. */
export interface ExecutiveIntegrationLayerManifestCompatibilityDeclaration {
  readonly compatibilityId: `EIL-9:5/Compatibility/${LayerManifestCompatibilityKey}`;
  readonly canonicalKey: LayerManifestCompatibilityKey;
  readonly canonicalName: string;
  readonly description: string;
  readonly order: number;
  readonly namespace: "nexora.eil.executive-integration-layer.manifest";
  readonly sourceValidationId: typeof ExecutiveIntegrationLayerValidationCanonicalId;
  readonly executesRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

const compatibility = (
  key: LayerManifestCompatibilityKey,
  canonicalName: string,
  description: string,
  order: number,
): ExecutiveIntegrationLayerManifestCompatibilityDeclaration =>
  Object.freeze({
    compatibilityId: `EIL-9:5/Compatibility/${key}` as const,
    canonicalKey: key,
    canonicalName,
    description,
    order,
    namespace: "nexora.eil.executive-integration-layer.manifest" as const,
    sourceValidationId: ExecutiveIntegrationLayerValidationCanonicalId,
    executesRuntime: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

/**
 * Exactly twelve compatibility declarations in deterministic order.
 */
export const ExecutiveIntegrationLayerManifestCompatibility: readonly ExecutiveIntegrationLayerManifestCompatibilityDeclaration[] =
  Object.freeze([
    compatibility(
      "FoundationCompatible",
      "Foundation Compatible",
      "Compatible with EIL-9:1 Executive Integration Layer Foundation architecture.",
      1,
    ),
    compatibility(
      "RegistryCompatible",
      "Registry Compatible",
      "Compatible with EIL-9:2 Executive Integration Layer Registry architecture.",
      2,
    ),
    compatibility(
      "ModelCompatible",
      "Model Compatible",
      "Compatible with EIL-9:3 Executive Integration Layer Model architecture.",
      3,
    ),
    compatibility(
      "ValidationCompatible",
      "Validation Compatible",
      "Compatible with EIL-9:4 Executive Integration Layer Validation architecture.",
      4,
    ),
    compatibility(
      "PlatformCompatible",
      "Platform Compatible",
      "Architecturally compatible with forthcoming Platform phase publication.",
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
