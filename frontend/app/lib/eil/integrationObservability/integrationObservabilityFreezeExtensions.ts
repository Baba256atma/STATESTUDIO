/**
 * EIL-6:8 — Integration Observability Freeze Extensions.
 *
 * Exactly eight immutable extension declarations.
 * Declares constraints for future extensions. No extension implementation.
 *
 * Ownership: owned exclusively by EIL-6:8.
 */

import { IntegrationObservabilityCertificationCanonicalId } from "./integrationObservabilityCertification.ts";
import { IntegrationObservabilityFreezeLockId } from "./integrationObservabilityFreezeIdentity.ts";

/** Closed extension-declaration key vocabulary. */
export type ObservabilityFreezeExtensionKey =
  | "PreserveFrozenContract"
  | "NoFrozenMetadataMutation"
  | "BackwardCompatibleOnly"
  | "CanonicalArchitecturePreserved"
  | "NoRuntimeIntroduction"
  | "InventoryDerivationPreserved"
  | "PackageEntryPreserved"
  | "LockIdPreserved";

/** Immutable extension declaration descriptor. */
export interface IntegrationObservabilityFreezeExtensionDeclaration {
  readonly extensionId: `EIL-6:8/Extension/${ObservabilityFreezeExtensionKey}`;
  readonly canonicalKey: ObservabilityFreezeExtensionKey;
  readonly canonicalName: string;
  readonly description: string;
  readonly order: number;
  readonly preservesFrozenContract: true;
  readonly cannotModifyFrozenMetadata: true;
  readonly mustRemainBackwardCompatible: true;
  readonly mustNotViolateCanonicalArchitecture: true;
  readonly platformLockId: typeof IntegrationObservabilityFreezeLockId;
  readonly namespace: "nexora.eil.integration-observability.freeze";
  readonly sourceCertificationId: typeof IntegrationObservabilityCertificationCanonicalId;
  readonly implementsExtension: false;
  readonly executesRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

const extension = (
  key: ObservabilityFreezeExtensionKey,
  canonicalName: string,
  description: string,
  order: number,
): IntegrationObservabilityFreezeExtensionDeclaration =>
  Object.freeze({
    extensionId: `EIL-6:8/Extension/${key}` as const,
    canonicalKey: key,
    canonicalName,
    description,
    order,
    preservesFrozenContract: true as const,
    cannotModifyFrozenMetadata: true as const,
    mustRemainBackwardCompatible: true as const,
    mustNotViolateCanonicalArchitecture: true as const,
    platformLockId: IntegrationObservabilityFreezeLockId,
    namespace: "nexora.eil.integration-observability.freeze" as const,
    sourceCertificationId: IntegrationObservabilityCertificationCanonicalId,
    implementsExtension: false as const,
    executesRuntime: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

/**
 * Exactly eight extension declarations in deterministic order.
 */
export const IntegrationObservabilityFreezeExtensions: readonly IntegrationObservabilityFreezeExtensionDeclaration[] =
  Object.freeze([
    extension(
      "PreserveFrozenContract",
      "Preserve Frozen Contract",
      "Future extensions must preserve the frozen Integration Observability contract.",
      1,
    ),
    extension(
      "NoFrozenMetadataMutation",
      "No Frozen Metadata Mutation",
      "Future extensions cannot modify frozen architectural metadata.",
      2,
    ),
    extension(
      "BackwardCompatibleOnly",
      "Backward Compatible Only",
      "Future extensions must remain backward compatible with the frozen baseline.",
      3,
    ),
    extension(
      "CanonicalArchitecturePreserved",
      "Canonical Architecture Preserved",
      "Future extensions must not violate the canonical EIL-6 architecture.",
      4,
    ),
    extension(
      "NoRuntimeIntroduction",
      "No Runtime Introduction",
      "Future extensions must not introduce observability runtime engines into the freeze baseline.",
      5,
    ),
    extension(
      "InventoryDerivationPreserved",
      "Inventory Derivation Preserved",
      "Future extensions must preserve Certification-derived inventory rules.",
      6,
    ),
    extension(
      "PackageEntryPreserved",
      "Package Entry Preserved",
      "Future extensions must preserve the sole package entry surface.",
      7,
    ),
    extension(
      "LockIdPreserved",
      "Lock ID Preserved",
      "Future extensions must preserve EIL-6-INTEGRATION-OBSERVABILITY-LOCKED.",
      8,
    ),
  ]);
