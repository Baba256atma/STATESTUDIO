/**
 * EIL-9:8 — Executive Integration Layer Freeze Compatibility.
 *
 * Exactly eight immutable compatibility declarations.
 * Metadata-only. No runtime compatibility logic.
 *
 * Ownership: owned exclusively by EIL-9:8.
 */

import { ExecutiveIntegrationLayerCertificationCanonicalId } from "./executiveIntegrationLayerCertification.ts";

/** Closed compatibility key vocabulary. */
export type LayerFreezeCompatibilityKey =
  | "FoundationCompatible"
  | "RegistryCompatible"
  | "ModelCompatible"
  | "ValidationCompatible"
  | "ManifestCompatible"
  | "PlatformCompatible"
  | "CertificationCompatible"
  | "PublicIndexCompatible";

/** Immutable compatibility descriptor. */
export interface ExecutiveIntegrationLayerFreezeCompatibilityDeclaration {
  readonly compatibilityId: `EIL-9:8/Compatibility/${LayerFreezeCompatibilityKey}`;
  readonly canonicalKey: LayerFreezeCompatibilityKey;
  readonly canonicalName: string;
  readonly description: string;
  readonly order: number;
  readonly namespace: "nexora.eil.executive-integration-layer.freeze";
  readonly sourceCertificationId: typeof ExecutiveIntegrationLayerCertificationCanonicalId;
  readonly executesRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

const compatibility = (
  key: LayerFreezeCompatibilityKey,
  canonicalName: string,
  description: string,
  order: number,
): ExecutiveIntegrationLayerFreezeCompatibilityDeclaration =>
  Object.freeze({
    compatibilityId: `EIL-9:8/Compatibility/${key}` as const,
    canonicalKey: key,
    canonicalName,
    description,
    order,
    namespace: "nexora.eil.executive-integration-layer.freeze" as const,
    sourceCertificationId: ExecutiveIntegrationLayerCertificationCanonicalId,
    executesRuntime: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

/**
 * Exactly eight compatibility declarations in deterministic order.
 */
export const ExecutiveIntegrationLayerFreezeCompatibility: readonly ExecutiveIntegrationLayerFreezeCompatibilityDeclaration[] =
  Object.freeze([
    compatibility(
      "FoundationCompatible",
      "Foundation Compatible",
      "Compatible with frozen EIL-9:1 Foundation architecture.",
      1,
    ),
    compatibility(
      "RegistryCompatible",
      "Registry Compatible",
      "Compatible with frozen EIL-9:2 Registry architecture.",
      2,
    ),
    compatibility(
      "ModelCompatible",
      "Model Compatible",
      "Compatible with frozen EIL-9:3 Model architecture.",
      3,
    ),
    compatibility(
      "ValidationCompatible",
      "Validation Compatible",
      "Compatible with frozen EIL-9:4 Validation architecture.",
      4,
    ),
    compatibility(
      "ManifestCompatible",
      "Manifest Compatible",
      "Compatible with frozen EIL-9:5 Manifest architecture.",
      5,
    ),
    compatibility(
      "PlatformCompatible",
      "Platform Compatible",
      "Compatible with frozen EIL-9:6 Platform architecture.",
      6,
    ),
    compatibility(
      "CertificationCompatible",
      "Certification Compatible",
      "Compatible with frozen EIL-9:7 Certification architecture.",
      7,
    ),
    compatibility(
      "PublicIndexCompatible",
      "Public Index Compatible",
      "Architecturally compatible with forthcoming Public Index publication.",
      8,
    ),
  ]);
