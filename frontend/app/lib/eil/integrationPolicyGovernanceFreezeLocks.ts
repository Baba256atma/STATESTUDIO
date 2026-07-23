/**
 * EIL-5:8 — Integration Policy & Governance Freeze Locks.
 *
 * Immutable declarative freeze locks for the certified Integration Policy & Governance Platform.
 * Includes exactly one canonical platform lock plus architectural locks.
 * Locks describe protection only. No runtime enforcement.
 *
 * Ownership: owned exclusively by EIL-5:8.
 */

import {
  IntegrationPolicyGovernanceCertificationIdentity,
  IntegrationPolicyGovernanceCertificationPlatform,
} from "./integrationPolicyGovernanceCertification.ts";
import type {
  IntegrationPolicyGovernanceFreezeLock,
  PolicyGovernanceFreezeArchitecturalLockKey,
  PolicyGovernanceFreezeLockScope,
} from "./integrationPolicyGovernanceFreezeTypes.ts";

const certification = IntegrationPolicyGovernanceCertificationPlatform;

const lock = (
  key: string,
  lockName: string,
  description: string,
  scope: PolicyGovernanceFreezeLockScope,
  sourceReference: string,
  ordinal: number,
  tags: readonly string[],
  isCanonicalPlatformLock: boolean,
): IntegrationPolicyGovernanceFreezeLock =>
  Object.freeze({
    lockId: `EIL-5:8/Lock/${key}` as const,
    canonicalKey: key,
    lockName,
    description,
    scope,
    sourceReference,
    namespace: "nexora.eil.integration-policy-governance.freeze",
    version: "1.0.0",
    certificationReference:
      IntegrationPolicyGovernanceCertificationIdentity.canonicalId,
    platformReference: "EIL-5:6/IntegrationPolicyGovernancePlatform",
    releaseState: "FrozenBaseline" as const,
    ownership: "EIL-5:8" as const,
    ordinal,
    tags: Object.freeze([...tags]),
    isCanonicalPlatformLock,
    runtimeEnforced: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

/**
 * Exactly one canonical platform lock.
 * Identifier: EIL-5-INTEGRATION-POLICY-GOVERNANCE-LOCKED
 */
export const IntegrationPolicyGovernanceFreezeCanonicalPlatformLock: IntegrationPolicyGovernanceFreezeLock =
  lock(
    "EIL-5-INTEGRATION-POLICY-GOVERNANCE-LOCKED",
    "EIL-5 Integration Policy & Governance Locked",
    `Canonical permanent lock for the certified EIL-5 Integration Policy & Governance Platform baseline (${certification.platformIdentity.canonicalId}).`,
    "Canonical",
    "EIL-5:7/IntegrationPolicyGovernanceCertification/platformIdentity",
    1,
    Object.freeze(["canonical", "platform-lock"]),
    true,
  );

const architectural = (
  key: PolicyGovernanceFreezeArchitecturalLockKey,
  lockName: string,
  description: string,
  sourceReference: string,
  ordinal: number,
): IntegrationPolicyGovernanceFreezeLock =>
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
export const IntegrationPolicyGovernanceFreezeArchitecturalLocks: readonly IntegrationPolicyGovernanceFreezeLock[] =
  Object.freeze([
    architectural(
      "Identity",
      "Identity",
      "Canonical identities across EIL-5 are permanently frozen.",
      "EIL-5:7/IntegrationPolicyGovernanceCertification/identity",
      2,
    ),
    architectural(
      "Namespace",
      "Namespace",
      "nexora.eil.integration-policy-governance.* namespaces are permanently frozen.",
      "EIL-5:7/IntegrationPolicyGovernanceCertification/identity/namespace",
      3,
    ),
    architectural(
      "Version",
      "Version",
      "Semantic version 1.0.0 lineage is permanently frozen.",
      "EIL-5:7/IntegrationPolicyGovernanceCertification/identity/version",
      4,
    ),
    architectural(
      "Dependency",
      "Dependency",
      "Aggregate dependency direction is permanently frozen.",
      "EIL-5:7/IntegrationPolicyGovernanceCertification/dependency",
      5,
    ),
    architectural(
      "Inventory",
      "Inventory",
      "Derived inventories are permanently frozen.",
      "EIL-5:7/IntegrationPolicyGovernanceCertification/inventory",
      6,
    ),
    architectural(
      "Compatibility",
      "Compatibility",
      "Compatibility declarations are permanently frozen.",
      "EIL-5:7/IntegrationPolicyGovernanceCertification/compliance",
      7,
    ),
    architectural(
      "Platform",
      "Platform",
      "Platform composition and guarantees are permanently frozen.",
      "EIL-5:7/IntegrationPolicyGovernanceCertification/platformIdentity",
      8,
    ),
    architectural(
      "Certification",
      "Certification",
      "Certification criteria, gates, and compliance are permanently frozen.",
      "EIL-5:7/IntegrationPolicyGovernanceCertification/criteria",
      9,
    ),
    architectural(
      "Metadata",
      "Metadata",
      "Metadata-only architecture declarations are permanently frozen.",
      "EIL-5:7/IntegrationPolicyGovernanceCertification/metadataOnly",
      10,
    ),
    architectural(
      "PublicSurface",
      "Public Surface",
      "Aggregate public export surfaces are permanently frozen.",
      "EIL-5:7/IntegrationPolicyGovernanceCertification/summary",
      11,
    ),
    architectural(
      "DeterministicOrdering",
      "Deterministic Ordering",
      "Explicit ordinal ordering is permanently frozen.",
      "EIL-5:7/IntegrationPolicyGovernanceCertification/collections",
      12,
    ),
    architectural(
      "Readiness",
      "Readiness",
      "ReadyForPublicIndex readiness declaration is permanently frozen.",
      "EIL-5:7/IntegrationPolicyGovernanceCertification/readiness",
      13,
    ),
  ]);

/**
 * Complete freeze lock collection:
 * exactly one canonical platform lock + twelve architectural locks.
 */
export const IntegrationPolicyGovernanceFreezeLocks: readonly IntegrationPolicyGovernanceFreezeLock[] =
  Object.freeze([
    IntegrationPolicyGovernanceFreezeCanonicalPlatformLock,
    ...IntegrationPolicyGovernanceFreezeArchitecturalLocks,
  ]);
