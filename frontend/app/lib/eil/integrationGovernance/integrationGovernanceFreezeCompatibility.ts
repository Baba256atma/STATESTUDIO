/**
 * EIL-7:8 — Integration Governance Freeze Compatibility.
 *
 * Exactly eight immutable compatibility declarations.
 * Metadata-only. No runtime compatibility logic.
 *
 * Ownership: owned exclusively by EIL-7:8.
 */

import { IntegrationGovernanceCertificationCanonicalId } from "./integrationGovernanceCertification.ts";

/** Closed compatibility key vocabulary. */
export type GovernanceFreezeCompatibilityKey =
  | "FoundationCompatible"
  | "RegistryCompatible"
  | "ModelCompatible"
  | "ValidationCompatible"
  | "ManifestCompatible"
  | "PlatformCompatible"
  | "CertificationCompatible"
  | "PublicIndexCompatible";

/** Immutable compatibility descriptor. */
export interface IntegrationGovernanceFreezeCompatibilityDeclaration {
  readonly compatibilityId: `EIL-7:8/Compatibility/${GovernanceFreezeCompatibilityKey}`;
  readonly canonicalKey: GovernanceFreezeCompatibilityKey;
  readonly canonicalName: string;
  readonly description: string;
  readonly order: number;
  readonly namespace: "nexora.eil.integration-governance.freeze";
  readonly sourceCertificationId: typeof IntegrationGovernanceCertificationCanonicalId;
  readonly executesRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

const compatibility = (
  key: GovernanceFreezeCompatibilityKey,
  canonicalName: string,
  description: string,
  order: number,
): IntegrationGovernanceFreezeCompatibilityDeclaration =>
  Object.freeze({
    compatibilityId: `EIL-7:8/Compatibility/${key}` as const,
    canonicalKey: key,
    canonicalName,
    description,
    order,
    namespace: "nexora.eil.integration-governance.freeze" as const,
    sourceCertificationId: IntegrationGovernanceCertificationCanonicalId,
    executesRuntime: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

/**
 * Exactly eight compatibility declarations in deterministic order.
 */
export const IntegrationGovernanceFreezeCompatibility: readonly IntegrationGovernanceFreezeCompatibilityDeclaration[] =
  Object.freeze([
    compatibility(
      "FoundationCompatible",
      "Foundation Compatible",
      "Compatible with frozen EIL-7:1 Foundation architecture.",
      1,
    ),
    compatibility(
      "RegistryCompatible",
      "Registry Compatible",
      "Compatible with frozen EIL-7:2 Registry architecture.",
      2,
    ),
    compatibility(
      "ModelCompatible",
      "Model Compatible",
      "Compatible with frozen EIL-7:3 Model architecture.",
      3,
    ),
    compatibility(
      "ValidationCompatible",
      "Validation Compatible",
      "Compatible with frozen EIL-7:4 Validation architecture.",
      4,
    ),
    compatibility(
      "ManifestCompatible",
      "Manifest Compatible",
      "Compatible with frozen EIL-7:5 Manifest architecture.",
      5,
    ),
    compatibility(
      "PlatformCompatible",
      "Platform Compatible",
      "Compatible with frozen EIL-7:6 Platform architecture.",
      6,
    ),
    compatibility(
      "CertificationCompatible",
      "Certification Compatible",
      "Compatible with frozen EIL-7:7 Certification architecture.",
      7,
    ),
    compatibility(
      "PublicIndexCompatible",
      "Public Index Compatible",
      "Architecturally compatible with forthcoming Public Index publication.",
      8,
    ),
  ]);
