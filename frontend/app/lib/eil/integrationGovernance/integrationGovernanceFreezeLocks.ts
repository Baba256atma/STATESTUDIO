/**
 * EIL-7:8 — Integration Governance Freeze Locks.
 *
 * Exactly sixteen immutable architectural locks.
 * Declarative metadata only. No runtime lock enforcement.
 *
 * Ownership: owned exclusively by EIL-7:8.
 */

import { IntegrationGovernanceCertificationCanonicalId } from "./integrationGovernanceCertification.ts";
import { IntegrationGovernanceFreezeLockId } from "./integrationGovernanceFreezeIdentity.ts";

/** Closed architectural-lock key vocabulary. */
export type GovernanceFreezeLockKey =
  | "CanonicalIdentity"
  | "Namespace"
  | "DependencyChain"
  | "FoundationIntegrity"
  | "RegistryIntegrity"
  | "ModelIntegrity"
  | "ValidationIntegrity"
  | "ManifestIntegrity"
  | "PlatformIntegrity"
  | "CertificationIntegrity"
  | "MetadataImmutability"
  | "InventoryIntegrity"
  | "ExportIntegrity"
  | "RuntimeIndependence"
  | "FreezeIntegrity"
  | "PublicIndexReadiness";

/** Immutable architectural lock descriptor. */
export interface IntegrationGovernanceFreezeLock {
  readonly lockRecordId: `EIL-7:8/Lock/${GovernanceFreezeLockKey}`;
  readonly canonicalKey: GovernanceFreezeLockKey;
  readonly canonicalName: string;
  readonly description: string;
  readonly order: number;
  readonly platformLockId: typeof IntegrationGovernanceFreezeLockId;
  readonly namespace: "nexora.eil.integration-governance.freeze";
  readonly sourceCertificationId: typeof IntegrationGovernanceCertificationCanonicalId;
  readonly executesRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

const lock = (
  key: GovernanceFreezeLockKey,
  canonicalName: string,
  description: string,
  order: number,
): IntegrationGovernanceFreezeLock =>
  Object.freeze({
    lockRecordId: `EIL-7:8/Lock/${key}` as const,
    canonicalKey: key,
    canonicalName,
    description,
    order,
    platformLockId: IntegrationGovernanceFreezeLockId,
    namespace: "nexora.eil.integration-governance.freeze" as const,
    sourceCertificationId: IntegrationGovernanceCertificationCanonicalId,
    executesRuntime: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

/**
 * Exactly sixteen architectural locks in deterministic order.
 */
export const IntegrationGovernanceFreezeLocks: readonly IntegrationGovernanceFreezeLock[] =
  Object.freeze([
    lock(
      "CanonicalIdentity",
      "Canonical Identity",
      "Locks canonical Certification and Freeze identity metadata.",
      1,
    ),
    lock(
      "Namespace",
      "Namespace",
      "Locks canonical Integration Governance namespaces.",
      2,
    ),
    lock(
      "DependencyChain",
      "Dependency Chain",
      "Locks Certification-only Freeze dependency chain integrity.",
      3,
    ),
    lock(
      "FoundationIntegrity",
      "Foundation Integrity",
      "Locks Foundation composition integrity by reference.",
      4,
    ),
    lock(
      "RegistryIntegrity",
      "Registry Integrity",
      "Locks Registry composition integrity by reference.",
      5,
    ),
    lock(
      "ModelIntegrity",
      "Model Integrity",
      "Locks Model composition integrity by reference.",
      6,
    ),
    lock(
      "ValidationIntegrity",
      "Validation Integrity",
      "Locks Validation composition and Pass integrity by reference.",
      7,
    ),
    lock(
      "ManifestIntegrity",
      "Manifest Integrity",
      "Locks Manifest composition integrity by reference.",
      8,
    ),
    lock(
      "PlatformIntegrity",
      "Platform Integrity",
      "Locks Platform composition integrity by reference.",
      9,
    ),
    lock(
      "CertificationIntegrity",
      "Certification Integrity",
      "Locks Certification aggregate Pass integrity.",
      10,
    ),
    lock(
      "MetadataImmutability",
      "Metadata Immutability",
      "Locks metadata-only immutability guarantees.",
      11,
    ),
    lock(
      "InventoryIntegrity",
      "Inventory Integrity",
      "Locks Certification-derived inventory integrity without redefinition.",
      12,
    ),
    lock(
      "ExportIntegrity",
      "Export Integrity",
      "Locks package export surface integrity.",
      13,
    ),
    lock(
      "RuntimeIndependence",
      "Runtime Independence",
      "Locks runtime-free governance independence.",
      14,
    ),
    lock(
      "FreezeIntegrity",
      "Freeze Integrity",
      "Locks Freeze baseline and lock identifier integrity.",
      15,
    ),
    lock(
      "PublicIndexReadiness",
      "Public Index Readiness",
      "Locks ReadyForPublicIndex readiness declaration.",
      16,
    ),
  ]);
