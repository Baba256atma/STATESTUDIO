/**
 * EIL-8:6 — Executive Integration Suite Platform Compatibility.
 *
 * Exactly twelve immutable compatibility declarations.
 * Metadata-only. No runtime compatibility logic.
 *
 * Ownership: owned exclusively by EIL-8:6.
 */

import { ExecutiveIntegrationSuiteManifestCanonicalId } from "./executiveIntegrationSuiteManifest.ts";

/** Closed compatibility key vocabulary. */
export type SuitePlatformCompatibilityKey =
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
export interface ExecutiveIntegrationSuitePlatformCompatibilityDeclaration {
  readonly compatibilityId: `EIL-8:6/Compatibility/${SuitePlatformCompatibilityKey}`;
  readonly canonicalKey: SuitePlatformCompatibilityKey;
  readonly canonicalName: string;
  readonly description: string;
  readonly order: number;
  readonly namespace: "nexora.eil.executive-integration-suite.platform";
  readonly sourceManifestId: typeof ExecutiveIntegrationSuiteManifestCanonicalId;
  readonly executesRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

const compatibility = (
  key: SuitePlatformCompatibilityKey,
  canonicalName: string,
  description: string,
  order: number,
): ExecutiveIntegrationSuitePlatformCompatibilityDeclaration =>
  Object.freeze({
    compatibilityId: `EIL-8:6/Compatibility/${key}` as const,
    canonicalKey: key,
    canonicalName,
    description,
    order,
    namespace: "nexora.eil.executive-integration-suite.platform" as const,
    sourceManifestId: ExecutiveIntegrationSuiteManifestCanonicalId,
    executesRuntime: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

/**
 * Exactly twelve compatibility declarations in deterministic order.
 */
export const ExecutiveIntegrationSuitePlatformCompatibility: readonly ExecutiveIntegrationSuitePlatformCompatibilityDeclaration[] =
  Object.freeze([
    compatibility(
      "FoundationCompatible",
      "Foundation Compatible",
      "Compatible with EIL-8:1 Executive Integration Suite Foundation.",
      1,
    ),
    compatibility(
      "RegistryCompatible",
      "Registry Compatible",
      "Compatible with EIL-8:2 Executive Integration Suite Registry.",
      2,
    ),
    compatibility(
      "ModelCompatible",
      "Model Compatible",
      "Compatible with EIL-8:3 Executive Integration Suite Model.",
      3,
    ),
    compatibility(
      "ValidationCompatible",
      "Validation Compatible",
      "Compatible with EIL-8:4 Executive Integration Suite Validation.",
      4,
    ),
    compatibility(
      "ManifestCompatible",
      "Manifest Compatible",
      "Compatible with EIL-8:5 Executive Integration Suite Manifest.",
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
      "Compatible with the canonical EIL Executive Integration Suite ladder.",
      12,
    ),
  ]);
