/**
 * EIL-8:8 — Executive Integration Suite Freeze Compatibility.
 *
 * Exactly eight immutable compatibility declarations.
 * Metadata-only. No runtime compatibility logic.
 *
 * Ownership: owned exclusively by EIL-8:8.
 */

import { ExecutiveIntegrationSuiteCertificationCanonicalId } from "./executiveIntegrationSuiteCertification.ts";

/** Closed compatibility key vocabulary. */
export type SuiteFreezeCompatibilityKey =
  | "FoundationCompatible"
  | "RegistryCompatible"
  | "ModelCompatible"
  | "ValidationCompatible"
  | "ManifestCompatible"
  | "PlatformCompatible"
  | "CertificationCompatible"
  | "PublicIndexCompatible";

/** Immutable compatibility descriptor. */
export interface ExecutiveIntegrationSuiteFreezeCompatibilityDeclaration {
  readonly compatibilityId: `EIL-8:8/Compatibility/${SuiteFreezeCompatibilityKey}`;
  readonly canonicalKey: SuiteFreezeCompatibilityKey;
  readonly canonicalName: string;
  readonly description: string;
  readonly order: number;
  readonly namespace: "nexora.eil.executive-integration-suite.freeze";
  readonly sourceCertificationId: typeof ExecutiveIntegrationSuiteCertificationCanonicalId;
  readonly executesRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

const compatibility = (
  key: SuiteFreezeCompatibilityKey,
  canonicalName: string,
  description: string,
  order: number,
): ExecutiveIntegrationSuiteFreezeCompatibilityDeclaration =>
  Object.freeze({
    compatibilityId: `EIL-8:8/Compatibility/${key}` as const,
    canonicalKey: key,
    canonicalName,
    description,
    order,
    namespace: "nexora.eil.executive-integration-suite.freeze" as const,
    sourceCertificationId: ExecutiveIntegrationSuiteCertificationCanonicalId,
    executesRuntime: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

/**
 * Exactly eight compatibility declarations in deterministic order.
 */
export const ExecutiveIntegrationSuiteFreezeCompatibility: readonly ExecutiveIntegrationSuiteFreezeCompatibilityDeclaration[] =
  Object.freeze([
    compatibility(
      "FoundationCompatible",
      "Foundation Compatible",
      "Compatible with frozen EIL-8:1 Foundation architecture.",
      1,
    ),
    compatibility(
      "RegistryCompatible",
      "Registry Compatible",
      "Compatible with frozen EIL-8:2 Registry architecture.",
      2,
    ),
    compatibility(
      "ModelCompatible",
      "Model Compatible",
      "Compatible with frozen EIL-8:3 Model architecture.",
      3,
    ),
    compatibility(
      "ValidationCompatible",
      "Validation Compatible",
      "Compatible with frozen EIL-8:4 Validation architecture.",
      4,
    ),
    compatibility(
      "ManifestCompatible",
      "Manifest Compatible",
      "Compatible with frozen EIL-8:5 Manifest architecture.",
      5,
    ),
    compatibility(
      "PlatformCompatible",
      "Platform Compatible",
      "Compatible with frozen EIL-8:6 Platform architecture.",
      6,
    ),
    compatibility(
      "CertificationCompatible",
      "Certification Compatible",
      "Compatible with frozen EIL-8:7 Certification architecture.",
      7,
    ),
    compatibility(
      "PublicIndexCompatible",
      "Public Index Compatible",
      "Architecturally compatible with forthcoming Public Index publication.",
      8,
    ),
  ]);
