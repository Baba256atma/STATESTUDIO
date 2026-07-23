/**
 * EIL-9:8 — Executive Integration Layer Freeze Locks.
 *
 * Exactly sixteen immutable architectural locks.
 * Declarative metadata only. No runtime lock enforcement.
 *
 * Ownership: owned exclusively by EIL-9:8.
 */

import { ExecutiveIntegrationLayerCertificationCanonicalId } from "./executiveIntegrationLayerCertification.ts";
import { ExecutiveIntegrationLayerFreezeLockId } from "./executiveIntegrationLayerFreezeIdentity.ts";

/** Closed architectural-lock key vocabulary. */
export type LayerFreezeLockKey =
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
export interface ExecutiveIntegrationLayerFreezeLock {
  readonly lockRecordId: `EIL-9:8/Lock/${LayerFreezeLockKey}`;
  readonly canonicalKey: LayerFreezeLockKey;
  readonly canonicalName: string;
  readonly description: string;
  readonly order: number;
  readonly platformLockId: typeof ExecutiveIntegrationLayerFreezeLockId;
  readonly namespace: "nexora.eil.executive-integration-layer.freeze";
  readonly sourceCertificationId: typeof ExecutiveIntegrationLayerCertificationCanonicalId;
  readonly executesRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

const lock = (
  key: LayerFreezeLockKey,
  canonicalName: string,
  description: string,
  order: number,
): ExecutiveIntegrationLayerFreezeLock =>
  Object.freeze({
    lockRecordId: `EIL-9:8/Lock/${key}` as const,
    canonicalKey: key,
    canonicalName,
    description,
    order,
    platformLockId: ExecutiveIntegrationLayerFreezeLockId,
    namespace: "nexora.eil.executive-integration-layer.freeze" as const,
    sourceCertificationId: ExecutiveIntegrationLayerCertificationCanonicalId,
    executesRuntime: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

/**
 * Exactly sixteen architectural locks in deterministic order.
 */
export const ExecutiveIntegrationLayerFreezeLocks: readonly ExecutiveIntegrationLayerFreezeLock[] =
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
      "Locks canonical Executive Integration Layer namespaces.",
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
      "Locks runtime-free Layer independence.",
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
