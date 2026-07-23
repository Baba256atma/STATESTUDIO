/**
 * EIL-3:8 — Integration Routing Freeze Locks.
 *
 * Immutable declarative freeze locks for the certified Integration Routing Platform.
 * Includes exactly one canonical platform lock plus architectural locks.
 * Locks describe protection only. No runtime enforcement.
 *
 * Ownership: owned exclusively by EIL-3:8.
 */

import {
  IntegrationRoutingCertificationIdentity,
  IntegrationRoutingCertificationPlatform,
} from "./integrationRoutingCertification.ts";
import type {
  RoutingFreezeArchitecturalLockKey,
  RoutingFreezeLock,
  RoutingFreezeLockScope,
} from "./integrationRoutingFreezeTypes.ts";

const certification = IntegrationRoutingCertificationPlatform;

const lock = (
  key: string,
  lockName: string,
  description: string,
  scope: RoutingFreezeLockScope,
  sourceReference: string,
  ordinal: number,
  tags: readonly string[],
  isCanonicalPlatformLock: boolean,
): RoutingFreezeLock =>
  Object.freeze({
    lockId: `EIL-3:8/Lock/${key}` as const,
    canonicalKey: key,
    lockName,
    description,
    scope,
    sourceReference,
    namespace: "nexora.eil.integration-routing.freeze",
    version: "1.0.0",
    certificationReference: IntegrationRoutingCertificationIdentity.canonicalId,
    platformReference: "EIL-3:6/IntegrationRoutingPlatform",
    releaseState: "FrozenBaseline" as const,
    ownership: "EIL-3:8" as const,
    ordinal,
    tags: Object.freeze([...tags]),
    isCanonicalPlatformLock,
    runtimeEnforced: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

/**
 * Exactly one canonical platform lock.
 * Identifier: EIL-3-INTEGRATION-ROUTING-LOCKED
 */
export const IntegrationRoutingFreezeCanonicalPlatformLock: RoutingFreezeLock =
  lock(
    "EIL-3-INTEGRATION-ROUTING-LOCKED",
    "EIL-3 Integration Routing Locked",
    `Canonical permanent lock for the certified EIL-3 Integration Routing Platform baseline (${certification.platformIdentity.canonicalId}).`,
    "Canonical",
    "EIL-3:7/IntegrationRoutingCertification/platformIdentity",
    1,
    Object.freeze(["canonical", "platform-lock"]),
    true,
  );

const architectural = (
  key: RoutingFreezeArchitecturalLockKey,
  lockName: string,
  description: string,
  sourceReference: string,
  ordinal: number,
): RoutingFreezeLock =>
  lock(
    key,
    lockName,
    description,
    key,
    sourceReference,
    ordinal,
    Object.freeze(["architectural-lock", key.toLowerCase()]),
    false,
  );

/**
 * Exactly twelve architectural freeze locks.
 */
export const IntegrationRoutingFreezeArchitecturalLocks: readonly RoutingFreezeLock[] =
  Object.freeze([
    architectural(
      "Identity",
      "Identity",
      "Canonical identities across EIL-3 are permanently frozen.",
      "EIL-3:7/IntegrationRoutingCertification/identity",
      2,
    ),
    architectural(
      "Namespace",
      "Namespace",
      "nexora.eil.integration-routing.* namespaces are permanently frozen.",
      "EIL-3:7/IntegrationRoutingCertification/identity/namespace",
      3,
    ),
    architectural(
      "Version",
      "Version",
      "Semantic version 1.0.0 lineage is permanently frozen.",
      "EIL-3:7/IntegrationRoutingCertification/identity/version",
      4,
    ),
    architectural(
      "Dependency",
      "Dependency",
      "Aggregate dependency direction is permanently frozen.",
      "EIL-3:7/IntegrationRoutingCertification/dependency",
      5,
    ),
    architectural(
      "Inventory",
      "Inventory",
      "Derived inventories are permanently frozen.",
      "EIL-3:7/IntegrationRoutingCertification/inventory",
      6,
    ),
    architectural(
      "Compatibility",
      "Compatibility",
      "Compatibility declarations are permanently frozen.",
      "EIL-3:7/IntegrationRoutingCertification/compliance",
      7,
    ),
    architectural(
      "Platform",
      "Platform",
      "Platform composition and guarantees are permanently frozen.",
      "EIL-3:7/IntegrationRoutingCertification/platformIdentity",
      8,
    ),
    architectural(
      "Certification",
      "Certification",
      "Certification criteria, gates, and compliance are permanently frozen.",
      "EIL-3:7/IntegrationRoutingCertification/criteria",
      9,
    ),
    architectural(
      "Metadata",
      "Metadata",
      "Metadata-only architecture declarations are permanently frozen.",
      "EIL-3:7/IntegrationRoutingCertification/metadataOnly",
      10,
    ),
    architectural(
      "PublicSurface",
      "Public Surface",
      "Aggregate public export surfaces are permanently frozen.",
      "EIL-3:7/IntegrationRoutingCertification/summary",
      11,
    ),
    architectural(
      "DeterministicOrdering",
      "Deterministic Ordering",
      "Explicit ordinal ordering is permanently frozen.",
      "EIL-3:7/IntegrationRoutingCertification/collections",
      12,
    ),
    architectural(
      "Readiness",
      "Readiness",
      "ReadyForPublicIndex readiness declaration is permanently frozen.",
      "EIL-3:7/IntegrationRoutingCertification/readiness",
      13,
    ),
  ]);

/**
 * Complete freeze lock collection:
 * exactly one canonical platform lock + twelve architectural locks.
 */
export const IntegrationRoutingFreezeLocks: readonly RoutingFreezeLock[] =
  Object.freeze([
    IntegrationRoutingFreezeCanonicalPlatformLock,
    ...IntegrationRoutingFreezeArchitecturalLocks,
  ]);
