/**
 * EIL-2:8 — Integration Connector Freeze Locks.
 *
 * Immutable declarative freeze locks for the certified Integration Connector Platform.
 * Includes exactly one canonical platform lock plus architectural locks.
 * Locks describe protection only. No runtime enforcement.
 *
 * Ownership: owned exclusively by EIL-2:8.
 */

import {
  IntegrationConnectorCertificationIdentity,
  IntegrationConnectorCertificationPlatform,
} from "./integrationConnectorCertification.ts";
import type {
  IntegrationConnectorFreezeArchitecturalLockKey,
  IntegrationConnectorFreezeLock,
} from "./integrationConnectorFreezeTypes.ts";

const certification = IntegrationConnectorCertificationPlatform;

const lock = (
  key: string,
  lockName: string,
  description: string,
  ordinal: number,
  tags: readonly string[],
  isCanonicalPlatformLock: boolean,
): IntegrationConnectorFreezeLock =>
  Object.freeze({
    lockId: `EIL-2:8/Lock/${key}` as const,
    canonicalKey: key,
    lockName,
    namespace: "nexora.eil.integration-connector.freeze",
    version: "1.0.0",
    certificationReference: IntegrationConnectorCertificationIdentity.canonicalId,
    platformReference: "EIL-2:6/IntegrationConnectorPlatform",
    releaseState: "FrozenBaseline" as const,
    description,
    ownership: "EIL-2:8" as const,
    ordinal,
    tags: Object.freeze([...tags]),
    isCanonicalPlatformLock,
    runtimeEnforced: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

/**
 * Exactly one canonical platform lock.
 * Identifier: EIL-2-INTEGRATION-CONNECTOR-LOCKED
 */
export const IntegrationConnectorFreezeCanonicalPlatformLock: IntegrationConnectorFreezeLock =
  lock(
    "EIL-2-INTEGRATION-CONNECTOR-LOCKED",
    "EIL-2 Integration Connector Locked",
    `Canonical permanent lock for the certified EIL-2 Integration Connector Platform baseline (${certification.platformIdentity.canonicalId}).`,
    1,
    Object.freeze(["canonical", "platform-lock"]),
    true,
  );

const architectural = (
  key: IntegrationConnectorFreezeArchitecturalLockKey,
  lockName: string,
  description: string,
  ordinal: number,
): IntegrationConnectorFreezeLock =>
  lock(
    key,
    lockName,
    description,
    ordinal,
    Object.freeze(["architectural-lock", key.toLowerCase()]),
    false,
  );

/**
 * Exactly twelve architectural freeze locks.
 */
export const IntegrationConnectorFreezeArchitecturalLocks: readonly IntegrationConnectorFreezeLock[] =
  Object.freeze([
    architectural(
      "IdentityLock",
      "Identity Lock",
      "Canonical identities across EIL-2 are permanently frozen.",
      2,
    ),
    architectural(
      "NamespaceLock",
      "Namespace Lock",
      "nexora.eil.integration-connector.* namespaces are permanently frozen.",
      3,
    ),
    architectural(
      "VersionLock",
      "Version Lock",
      "Semantic version 1.0.0 lineage is permanently frozen.",
      4,
    ),
    architectural(
      "DependencyLock",
      "Dependency Lock",
      "Aggregate dependency direction is permanently frozen.",
      5,
    ),
    architectural(
      "InventoryLock",
      "Inventory Lock",
      "Derived inventories are permanently frozen.",
      6,
    ),
    architectural(
      "CompatibilityLock",
      "Compatibility Lock",
      "Compatibility declarations are permanently frozen.",
      7,
    ),
    architectural(
      "PlatformLock",
      "Platform Lock",
      "Platform composition and guarantees are permanently frozen.",
      8,
    ),
    architectural(
      "CertificationLock",
      "Certification Lock",
      "Certification criteria, gates, and compliance are permanently frozen.",
      9,
    ),
    architectural(
      "MetadataLock",
      "Metadata Lock",
      "Metadata-only architecture declarations are permanently frozen.",
      10,
    ),
    architectural(
      "PublicSurfaceLock",
      "Public Surface Lock",
      "Aggregate public export surfaces are permanently frozen.",
      11,
    ),
    architectural(
      "DeterministicOrderingLock",
      "Deterministic Ordering Lock",
      "Explicit ordinal ordering is permanently frozen.",
      12,
    ),
    architectural(
      "ReadinessLock",
      "Readiness Lock",
      "ReadyForPublicIndex readiness declaration is permanently frozen.",
      13,
    ),
  ]);

/**
 * Complete freeze lock collection:
 * exactly one canonical platform lock + twelve architectural locks.
 */
export const IntegrationConnectorFreezeLocks: readonly IntegrationConnectorFreezeLock[] =
  Object.freeze([
    IntegrationConnectorFreezeCanonicalPlatformLock,
    ...IntegrationConnectorFreezeArchitecturalLocks,
  ]);
