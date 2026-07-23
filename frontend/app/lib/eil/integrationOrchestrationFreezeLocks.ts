/**
 * EIL-4:8 — Integration Orchestration Freeze Locks.
 *
 * Immutable declarative freeze locks for the certified Integration Orchestration Platform.
 * Includes exactly one canonical platform lock plus architectural locks.
 * Locks describe protection only. No runtime enforcement.
 *
 * Ownership: owned exclusively by EIL-4:8.
 */

import {
  IntegrationOrchestrationCertificationIdentity,
  IntegrationOrchestrationCertificationPlatform,
} from "./integrationOrchestrationCertification.ts";
import type {
  IntegrationOrchestrationFreezeLock,
  OrchestrationFreezeArchitecturalLockKey,
  OrchestrationFreezeLockScope,
} from "./integrationOrchestrationFreezeTypes.ts";

const certification = IntegrationOrchestrationCertificationPlatform;

const lock = (
  key: string,
  lockName: string,
  description: string,
  scope: OrchestrationFreezeLockScope,
  sourceReference: string,
  ordinal: number,
  tags: readonly string[],
  isCanonicalPlatformLock: boolean,
): IntegrationOrchestrationFreezeLock =>
  Object.freeze({
    lockId: `EIL-4:8/Lock/${key}` as const,
    canonicalKey: key,
    lockName,
    description,
    scope,
    sourceReference,
    namespace: "nexora.eil.integration-orchestration.freeze",
    version: "1.0.0",
    certificationReference:
      IntegrationOrchestrationCertificationIdentity.canonicalId,
    platformReference: "EIL-4:6/IntegrationOrchestrationPlatform",
    releaseState: "FrozenBaseline" as const,
    ownership: "EIL-4:8" as const,
    ordinal,
    tags: Object.freeze([...tags]),
    isCanonicalPlatformLock,
    runtimeEnforced: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

/**
 * Exactly one canonical platform lock.
 * Identifier: EIL-4-INTEGRATION-ORCHESTRATION-LOCKED
 */
export const IntegrationOrchestrationFreezeCanonicalPlatformLock: IntegrationOrchestrationFreezeLock =
  lock(
    "EIL-4-INTEGRATION-ORCHESTRATION-LOCKED",
    "EIL-4 Integration Orchestration Locked",
    `Canonical permanent lock for the certified EIL-4 Integration Orchestration Platform baseline (${certification.platformIdentity.canonicalId}).`,
    "Canonical",
    "EIL-4:7/IntegrationOrchestrationCertification/platformIdentity",
    1,
    Object.freeze(["canonical", "platform-lock"]),
    true,
  );

const architectural = (
  key: OrchestrationFreezeArchitecturalLockKey,
  lockName: string,
  description: string,
  sourceReference: string,
  ordinal: number,
): IntegrationOrchestrationFreezeLock =>
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
export const IntegrationOrchestrationFreezeArchitecturalLocks: readonly IntegrationOrchestrationFreezeLock[] =
  Object.freeze([
    architectural(
      "Identity",
      "Identity",
      "Canonical identities across EIL-4 are permanently frozen.",
      "EIL-4:7/IntegrationOrchestrationCertification/identity",
      2,
    ),
    architectural(
      "Namespace",
      "Namespace",
      "nexora.eil.integration-orchestration.* namespaces are permanently frozen.",
      "EIL-4:7/IntegrationOrchestrationCertification/identity/namespace",
      3,
    ),
    architectural(
      "Version",
      "Version",
      "Semantic version 1.0.0 lineage is permanently frozen.",
      "EIL-4:7/IntegrationOrchestrationCertification/identity/version",
      4,
    ),
    architectural(
      "Dependency",
      "Dependency",
      "Aggregate dependency direction is permanently frozen.",
      "EIL-4:7/IntegrationOrchestrationCertification/dependency",
      5,
    ),
    architectural(
      "Inventory",
      "Inventory",
      "Derived inventories are permanently frozen.",
      "EIL-4:7/IntegrationOrchestrationCertification/inventory",
      6,
    ),
    architectural(
      "Compatibility",
      "Compatibility",
      "Compatibility declarations are permanently frozen.",
      "EIL-4:7/IntegrationOrchestrationCertification/compliance",
      7,
    ),
    architectural(
      "Platform",
      "Platform",
      "Platform composition and guarantees are permanently frozen.",
      "EIL-4:7/IntegrationOrchestrationCertification/platformIdentity",
      8,
    ),
    architectural(
      "Certification",
      "Certification",
      "Certification criteria, gates, and compliance are permanently frozen.",
      "EIL-4:7/IntegrationOrchestrationCertification/criteria",
      9,
    ),
    architectural(
      "Metadata",
      "Metadata",
      "Metadata-only architecture declarations are permanently frozen.",
      "EIL-4:7/IntegrationOrchestrationCertification/metadataOnly",
      10,
    ),
    architectural(
      "PublicSurface",
      "Public Surface",
      "Aggregate public export surfaces are permanently frozen.",
      "EIL-4:7/IntegrationOrchestrationCertification/summary",
      11,
    ),
    architectural(
      "DeterministicOrdering",
      "Deterministic Ordering",
      "Explicit ordinal ordering is permanently frozen.",
      "EIL-4:7/IntegrationOrchestrationCertification/collections",
      12,
    ),
    architectural(
      "Readiness",
      "Readiness",
      "ReadyForPublicIndex readiness declaration is permanently frozen.",
      "EIL-4:7/IntegrationOrchestrationCertification/readiness",
      13,
    ),
  ]);

/**
 * Complete freeze lock collection:
 * exactly one canonical platform lock + twelve architectural locks.
 */
export const IntegrationOrchestrationFreezeLocks: readonly IntegrationOrchestrationFreezeLock[] =
  Object.freeze([
    IntegrationOrchestrationFreezeCanonicalPlatformLock,
    ...IntegrationOrchestrationFreezeArchitecturalLocks,
  ]);
