/**
 * EIL-6:5 — Integration Observability Manifest Compatibility.
 *
 * Exactly twelve immutable compatibility declarations.
 * Metadata-only. No runtime compatibility logic.
 *
 * Ownership: owned exclusively by EIL-6:5.
 */

import { IntegrationObservabilityValidationCanonicalId } from "./integrationObservabilityValidation.ts";

/** Closed compatibility key vocabulary. */
export type ObservabilityManifestCompatibilityKey =
  | "FoundationCompatible"
  | "RegistryCompatible"
  | "ModelCompatible"
  | "ValidationCompatible"
  | "FuturePlatformCompatible"
  | "CertificationCompatible"
  | "FreezeCompatible"
  | "PublicIndexCompatible"
  | "TypeScriptCompatible"
  | "ESLintCompatible"
  | "MetadataCompatible"
  | "CanonicalArchitectureCompatible";

/** Immutable compatibility descriptor. */
export interface IntegrationObservabilityManifestCompatibilityDeclaration {
  readonly compatibilityId: `EIL-6:5/Compatibility/${ObservabilityManifestCompatibilityKey}`;
  readonly canonicalKey: ObservabilityManifestCompatibilityKey;
  readonly canonicalName: string;
  readonly description: string;
  readonly order: number;
  readonly namespace: "nexora.eil.integration-observability.manifest";
  readonly sourceValidationId: typeof IntegrationObservabilityValidationCanonicalId;
  readonly executesRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

const compatibility = (
  key: ObservabilityManifestCompatibilityKey,
  canonicalName: string,
  description: string,
  order: number,
): IntegrationObservabilityManifestCompatibilityDeclaration =>
  Object.freeze({
    compatibilityId: `EIL-6:5/Compatibility/${key}` as const,
    canonicalKey: key,
    canonicalName,
    description,
    order,
    namespace: "nexora.eil.integration-observability.manifest" as const,
    sourceValidationId: IntegrationObservabilityValidationCanonicalId,
    executesRuntime: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

/**
 * Exactly twelve compatibility declarations in deterministic order.
 */
export const IntegrationObservabilityManifestCompatibility: readonly IntegrationObservabilityManifestCompatibilityDeclaration[] =
  Object.freeze([
    compatibility(
      "FoundationCompatible",
      "Foundation Compatible",
      "Compatible with EIL-6:1 Integration Observability Foundation architecture.",
      1,
    ),
    compatibility(
      "RegistryCompatible",
      "Registry Compatible",
      "Compatible with EIL-6:2 Integration Observability Registry architecture.",
      2,
    ),
    compatibility(
      "ModelCompatible",
      "Model Compatible",
      "Compatible with EIL-6:3 Integration Observability Model architecture.",
      3,
    ),
    compatibility(
      "ValidationCompatible",
      "Validation Compatible",
      "Compatible with EIL-6:4 Integration Observability Validation architecture.",
      4,
    ),
    compatibility(
      "FuturePlatformCompatible",
      "Future Platform Compatible",
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
      "Compatible with the canonical EIL Integration Observability ladder.",
      12,
    ),
  ]);
