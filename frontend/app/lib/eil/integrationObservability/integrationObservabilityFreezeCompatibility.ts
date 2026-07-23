/**
 * EIL-6:8 — Integration Observability Freeze Compatibility.
 *
 * Exactly eight immutable compatibility declarations.
 * Metadata-only. No runtime compatibility logic.
 *
 * Ownership: owned exclusively by EIL-6:8.
 */

import { IntegrationObservabilityCertificationCanonicalId } from "./integrationObservabilityCertification.ts";

/** Closed compatibility key vocabulary. */
export type ObservabilityFreezeCompatibilityKey =
  | "FoundationCompatible"
  | "RegistryCompatible"
  | "ModelCompatible"
  | "ValidationCompatible"
  | "ManifestCompatible"
  | "PlatformCompatible"
  | "CertificationCompatible"
  | "PublicIndexCompatible";

/** Immutable compatibility descriptor. */
export interface IntegrationObservabilityFreezeCompatibilityDeclaration {
  readonly compatibilityId: `EIL-6:8/Compatibility/${ObservabilityFreezeCompatibilityKey}`;
  readonly canonicalKey: ObservabilityFreezeCompatibilityKey;
  readonly canonicalName: string;
  readonly description: string;
  readonly order: number;
  readonly namespace: "nexora.eil.integration-observability.freeze";
  readonly sourceCertificationId: typeof IntegrationObservabilityCertificationCanonicalId;
  readonly executesRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

const compatibility = (
  key: ObservabilityFreezeCompatibilityKey,
  canonicalName: string,
  description: string,
  order: number,
): IntegrationObservabilityFreezeCompatibilityDeclaration =>
  Object.freeze({
    compatibilityId: `EIL-6:8/Compatibility/${key}` as const,
    canonicalKey: key,
    canonicalName,
    description,
    order,
    namespace: "nexora.eil.integration-observability.freeze" as const,
    sourceCertificationId: IntegrationObservabilityCertificationCanonicalId,
    executesRuntime: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

/**
 * Exactly eight compatibility declarations in deterministic order.
 */
export const IntegrationObservabilityFreezeCompatibility: readonly IntegrationObservabilityFreezeCompatibilityDeclaration[] =
  Object.freeze([
    compatibility(
      "FoundationCompatible",
      "Foundation Compatible",
      "Compatible with frozen EIL-6:1 Foundation architecture.",
      1,
    ),
    compatibility(
      "RegistryCompatible",
      "Registry Compatible",
      "Compatible with frozen EIL-6:2 Registry architecture.",
      2,
    ),
    compatibility(
      "ModelCompatible",
      "Model Compatible",
      "Compatible with frozen EIL-6:3 Model architecture.",
      3,
    ),
    compatibility(
      "ValidationCompatible",
      "Validation Compatible",
      "Compatible with frozen EIL-6:4 Validation architecture.",
      4,
    ),
    compatibility(
      "ManifestCompatible",
      "Manifest Compatible",
      "Compatible with frozen EIL-6:5 Manifest architecture.",
      5,
    ),
    compatibility(
      "PlatformCompatible",
      "Platform Compatible",
      "Compatible with frozen EIL-6:6 Platform architecture.",
      6,
    ),
    compatibility(
      "CertificationCompatible",
      "Certification Compatible",
      "Compatible with frozen EIL-6:7 Certification architecture.",
      7,
    ),
    compatibility(
      "PublicIndexCompatible",
      "Public Index Compatible",
      "Architecturally compatible with forthcoming Public Index publication.",
      8,
    ),
  ]);
