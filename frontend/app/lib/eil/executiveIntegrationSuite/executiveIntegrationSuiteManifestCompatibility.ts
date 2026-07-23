/**
 * EIL-8:5 — Executive Integration Suite Manifest Compatibility.
 *
 * Exactly twelve immutable compatibility declarations.
 * Metadata-only. No runtime compatibility logic.
 *
 * Ownership: owned exclusively by EIL-8:5.
 */

import { ExecutiveIntegrationSuiteValidationCanonicalId } from "./executiveIntegrationSuiteValidation.ts";

/** Closed compatibility key vocabulary. */
export type SuiteManifestCompatibilityKey =
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
export interface ExecutiveIntegrationSuiteManifestCompatibilityDeclaration {
  readonly compatibilityId: `EIL-8:5/Compatibility/${SuiteManifestCompatibilityKey}`;
  readonly canonicalKey: SuiteManifestCompatibilityKey;
  readonly canonicalName: string;
  readonly description: string;
  readonly order: number;
  readonly namespace: "nexora.eil.executive-integration-suite.manifest";
  readonly sourceValidationId: typeof ExecutiveIntegrationSuiteValidationCanonicalId;
  readonly executesRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

const compatibility = (
  key: SuiteManifestCompatibilityKey,
  canonicalName: string,
  description: string,
  order: number,
): ExecutiveIntegrationSuiteManifestCompatibilityDeclaration =>
  Object.freeze({
    compatibilityId: `EIL-8:5/Compatibility/${key}` as const,
    canonicalKey: key,
    canonicalName,
    description,
    order,
    namespace: "nexora.eil.executive-integration-suite.manifest" as const,
    sourceValidationId: ExecutiveIntegrationSuiteValidationCanonicalId,
    executesRuntime: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

/**
 * Exactly twelve compatibility declarations in deterministic order.
 */
export const ExecutiveIntegrationSuiteManifestCompatibility: readonly ExecutiveIntegrationSuiteManifestCompatibilityDeclaration[] =
  Object.freeze([
    compatibility(
      "FoundationCompatible",
      "Foundation Compatible",
      "Compatible with EIL-8:1 Executive Integration Suite Foundation architecture.",
      1,
    ),
    compatibility(
      "RegistryCompatible",
      "Registry Compatible",
      "Compatible with EIL-8:2 Executive Integration Suite Registry architecture.",
      2,
    ),
    compatibility(
      "ModelCompatible",
      "Model Compatible",
      "Compatible with EIL-8:3 Executive Integration Suite Model architecture.",
      3,
    ),
    compatibility(
      "ValidationCompatible",
      "Validation Compatible",
      "Compatible with EIL-8:4 Executive Integration Suite Validation architecture.",
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
      "Compatible with the canonical EIL Executive Integration Suite ladder.",
      12,
    ),
  ]);
