/**
 * EIL-8:8 — Executive Integration Suite Freeze Extensions.
 *
 * Exactly eight immutable extension declarations.
 * Declares constraints for future extensions. No extension implementation.
 *
 * Ownership: owned exclusively by EIL-8:8.
 */

import { ExecutiveIntegrationSuiteCertificationCanonicalId } from "./executiveIntegrationSuiteCertification.ts";
import { ExecutiveIntegrationSuiteFreezeLockId } from "./executiveIntegrationSuiteFreezeIdentity.ts";

/** Closed extension-declaration key vocabulary. */
export type SuiteFreezeExtensionKey =
  | "PreserveFrozenContract"
  | "NoFrozenMetadataMutation"
  | "BackwardCompatibleOnly"
  | "CanonicalArchitecturePreserved"
  | "NoRuntimeIntroduction"
  | "InventoryDerivationPreserved"
  | "PackageEntryPreserved"
  | "LockIdPreserved";

/** Immutable extension declaration descriptor. */
export interface ExecutiveIntegrationSuiteFreezeExtensionDeclaration {
  readonly extensionId: `EIL-8:8/Extension/${SuiteFreezeExtensionKey}`;
  readonly canonicalKey: SuiteFreezeExtensionKey;
  readonly canonicalName: string;
  readonly description: string;
  readonly order: number;
  readonly preservesFrozenContract: true;
  readonly cannotModifyFrozenMetadata: true;
  readonly mustRemainBackwardCompatible: true;
  readonly mustNotViolateCanonicalArchitecture: true;
  readonly platformLockId: typeof ExecutiveIntegrationSuiteFreezeLockId;
  readonly namespace: "nexora.eil.executive-integration-suite.freeze";
  readonly sourceCertificationId: typeof ExecutiveIntegrationSuiteCertificationCanonicalId;
  readonly implementsExtension: false;
  readonly executesRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

const extension = (
  key: SuiteFreezeExtensionKey,
  canonicalName: string,
  description: string,
  order: number,
): ExecutiveIntegrationSuiteFreezeExtensionDeclaration =>
  Object.freeze({
    extensionId: `EIL-8:8/Extension/${key}` as const,
    canonicalKey: key,
    canonicalName,
    description,
    order,
    preservesFrozenContract: true as const,
    cannotModifyFrozenMetadata: true as const,
    mustRemainBackwardCompatible: true as const,
    mustNotViolateCanonicalArchitecture: true as const,
    platformLockId: ExecutiveIntegrationSuiteFreezeLockId,
    namespace: "nexora.eil.executive-integration-suite.freeze" as const,
    sourceCertificationId: ExecutiveIntegrationSuiteCertificationCanonicalId,
    implementsExtension: false as const,
    executesRuntime: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

/**
 * Exactly eight extension declarations in deterministic order.
 */
export const ExecutiveIntegrationSuiteFreezeExtensions: readonly ExecutiveIntegrationSuiteFreezeExtensionDeclaration[] =
  Object.freeze([
    extension(
      "PreserveFrozenContract",
      "Preserve Frozen Contract",
      "Future extensions must preserve the frozen Executive Integration Suite contract.",
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
      "Future extensions must not violate the canonical EIL-8 architecture.",
      4,
    ),
    extension(
      "NoRuntimeIntroduction",
      "No Runtime Introduction",
      "Future extensions must not introduce integration runtime into the freeze baseline.",
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
      "Future extensions must preserve EIL-8-EXECUTIVE-INTEGRATION-SUITE-LOCKED.",
      8,
    ),
  ]);
