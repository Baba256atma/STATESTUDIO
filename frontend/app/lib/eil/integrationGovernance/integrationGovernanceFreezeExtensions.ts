/**
 * EIL-7:8 — Integration Governance Freeze Extensions.
 *
 * Exactly eight immutable extension declarations.
 * Declares constraints for future extensions. No extension implementation.
 *
 * Ownership: owned exclusively by EIL-7:8.
 */

import { IntegrationGovernanceCertificationCanonicalId } from "./integrationGovernanceCertification.ts";
import { IntegrationGovernanceFreezeLockId } from "./integrationGovernanceFreezeIdentity.ts";

/** Closed extension-declaration key vocabulary. */
export type GovernanceFreezeExtensionKey =
  | "PreserveFrozenContract"
  | "NoFrozenMetadataMutation"
  | "BackwardCompatibleOnly"
  | "CanonicalArchitecturePreserved"
  | "NoRuntimeIntroduction"
  | "InventoryDerivationPreserved"
  | "PackageEntryPreserved"
  | "LockIdPreserved";

/** Immutable extension declaration descriptor. */
export interface IntegrationGovernanceFreezeExtensionDeclaration {
  readonly extensionId: `EIL-7:8/Extension/${GovernanceFreezeExtensionKey}`;
  readonly canonicalKey: GovernanceFreezeExtensionKey;
  readonly canonicalName: string;
  readonly description: string;
  readonly order: number;
  readonly preservesFrozenContract: true;
  readonly cannotModifyFrozenMetadata: true;
  readonly mustRemainBackwardCompatible: true;
  readonly mustNotViolateCanonicalArchitecture: true;
  readonly platformLockId: typeof IntegrationGovernanceFreezeLockId;
  readonly namespace: "nexora.eil.integration-governance.freeze";
  readonly sourceCertificationId: typeof IntegrationGovernanceCertificationCanonicalId;
  readonly implementsExtension: false;
  readonly executesRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

const extension = (
  key: GovernanceFreezeExtensionKey,
  canonicalName: string,
  description: string,
  order: number,
): IntegrationGovernanceFreezeExtensionDeclaration =>
  Object.freeze({
    extensionId: `EIL-7:8/Extension/${key}` as const,
    canonicalKey: key,
    canonicalName,
    description,
    order,
    preservesFrozenContract: true as const,
    cannotModifyFrozenMetadata: true as const,
    mustRemainBackwardCompatible: true as const,
    mustNotViolateCanonicalArchitecture: true as const,
    platformLockId: IntegrationGovernanceFreezeLockId,
    namespace: "nexora.eil.integration-governance.freeze" as const,
    sourceCertificationId: IntegrationGovernanceCertificationCanonicalId,
    implementsExtension: false as const,
    executesRuntime: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

/**
 * Exactly eight extension declarations in deterministic order.
 */
export const IntegrationGovernanceFreezeExtensions: readonly IntegrationGovernanceFreezeExtensionDeclaration[] =
  Object.freeze([
    extension(
      "PreserveFrozenContract",
      "Preserve Frozen Contract",
      "Future extensions must preserve the frozen Integration Governance contract.",
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
      "Future extensions must not violate the canonical EIL-7 architecture.",
      4,
    ),
    extension(
      "NoRuntimeIntroduction",
      "No Runtime Introduction",
      "Future extensions must not introduce governance runtime engines into the freeze baseline.",
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
      "Future extensions must preserve EIL-7-INTEGRATION-GOVERNANCE-LOCKED.",
      8,
    ),
  ]);
