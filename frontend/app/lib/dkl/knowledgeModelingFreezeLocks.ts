/**
 * DKL-4:8 — Knowledge Modeling Freeze Locks.
 *
 * Explicit immutable locks protecting certified DKL-4 architecture.
 * Metadata only — locks describe protection; they do not enforce at runtime.
 *
 * Ownership: owned exclusively by DKL-4:8.
 */

import type { FreezeLockEntry } from "./knowledgeModelingFreezeTypes.ts";

const OWNER = "DKL-4 Knowledge Modeling Freeze";

const lock = (
  id: string,
  name: string,
  target: string,
  targetPhase: string,
  lockType: string,
  evidence: string,
): FreezeLockEntry =>
  Object.freeze({
    id,
    name,
    target,
    targetPhase,
    lockType,
    protectionLevel: "Permanent" as const,
    breakingChangePolicy: "Forbidden" as const,
    additiveChangePolicy: "Controlled" as const,
    ownership: OWNER,
    status: "Locked" as const,
    evidence,
    unlockPolicy: "Forbidden" as const,
    deterministic: true as const,
    immutable: true as const,
  });

const LOCKS: readonly FreezeLockEntry[] = Object.freeze([
  lock(
    "LOCK-FND-CONTRACT",
    "Foundation contract lock",
    "Foundation contracts and identity",
    "DKL-4:1",
    "ContractLock",
    "certifiedPlatform.foundation.identity",
  ),
  lock(
    "LOCK-REG-IDENTITY",
    "Registry identity lock",
    "Registry identity and namespace",
    "DKL-4:2",
    "IdentityLock",
    "certifiedPlatform.registry.identity",
  ),
  lock(
    "LOCK-REG-CATEGORY",
    "Registry category lock",
    "18 registry category collections",
    "DKL-4:2",
    "CategoryLock",
    "certifiedPlatform.registry.summary.registryCategoryCount",
  ),
  lock(
    "LOCK-BO-CATEGORY",
    "Business Object category lock",
    "26 Business Object categories",
    "DKL-4:2",
    "CategoryLock",
    "certifiedPlatform.registry.collections.businessObjectTypes",
  ),
  lock(
    "LOCK-REL-CATEGORY",
    "Relationship category lock",
    "20 relationship categories",
    "DKL-4:2",
    "CategoryLock",
    "certifiedPlatform.registry.collections.relationshipTypes",
  ),
  lock(
    "LOCK-CANONICAL-MODEL",
    "Canonical model lock",
    "20 canonical model kinds",
    "DKL-4:3",
    "ModelLock",
    "certifiedPlatform.model.catalog.modelKinds",
  ),
  lock(
    "LOCK-VAL-CATEGORY",
    "Validation category lock",
    "8 validation categories",
    "DKL-4:4",
    "CategoryLock",
    "certifiedPlatform.validation.categories",
  ),
  lock(
    "LOCK-VAL-RULE",
    "Validation rule lock",
    "24 validation rules",
    "DKL-4:4",
    "RuleLock",
    "certifiedPlatform.validation.rules",
  ),
  lock(
    "LOCK-MNF-INVENTORY",
    "Manifest inventory lock",
    "Manifest inventory categories",
    "DKL-4:5",
    "InventoryLock",
    "certifiedPlatform.manifest.inventory",
  ),
  lock(
    "LOCK-PLT-SECTION",
    "Platform section lock",
    "6 Platform primary sections",
    "DKL-4:6",
    "SectionLock",
    "certifiedPlatform.sections",
  ),
  lock(
    "LOCK-PLT-ORDER",
    "Platform ordering lock",
    "Platform section order",
    "DKL-4:6",
    "OrderingLock",
    "certifiedPlatform.sectionOrder",
  ),
  lock(
    "LOCK-CERT-GATE",
    "Certification gate lock",
    "50 Certification gates",
    "DKL-4:7",
    "GateLock",
    "certification.gates",
  ),
  lock(
    "LOCK-CERT-EVIDENCE",
    "Certification evidence lock",
    "50 Certification evidence records",
    "DKL-4:7",
    "EvidenceLock",
    "certification.evidence.records",
  ),
  lock(
    "LOCK-OWNERSHIP",
    "Ownership boundary lock",
    "Ownership owns/doesNotOwn boundaries",
    "DKL-4:6",
    "OwnershipLock",
    "certifiedPlatform.metadata.ownership",
  ),
  lock(
    "LOCK-DEPENDENCY",
    "Dependency boundary lock",
    "Public-entry-point-only dependencies",
    "DKL-4:6",
    "DependencyLock",
    "certifiedPlatform.dependencies",
  ),
  lock(
    "LOCK-COMPATIBILITY",
    "Compatibility declaration lock",
    "Compatibility declarations",
    "DKL-4:7",
    "CompatibilityLock",
    "certification.compatibility",
  ),
  lock(
    "LOCK-EXTENSION",
    "Extension policy lock",
    "Additive extension policies",
    "DKL-4:6",
    "ExtensionLock",
    "certifiedPlatform.extensions",
  ),
  lock(
    "LOCK-PUBLIC-API",
    "Public API surface lock",
    "56 public APIs through Certification (7×8)",
    "DKL-4:7",
    "PublicApiLock",
    "7 phases × 8 public APIs",
  ),
  lock(
    "LOCK-RUNTIME",
    "Runtime prohibition lock",
    "Runtime behavior prohibitions",
    "DKL-4:6",
    "RuntimeLock",
    "certifiedPlatform.metadata.guarantees.noRuntimeBehavior",
  ),
  lock(
    "LOCK-METADATA",
    "Metadata-only guarantee lock",
    "Metadata-only architecture guarantees",
    "DKL-4:6",
    "MetadataLock",
    "certifiedPlatform.metadataOnly",
  ),
]);

/** Canonical immutable Freeze locks. */
export const KnowledgeModelingFreezeLocks = Object.freeze({
  locksId: "DKL-4:8/FreezeLocks",
  sourcePhase: "DKL-4:8" as const,
  owner: OWNER,
  locks: LOCKS,
  lockCount: LOCKS.length,
  lockIds: Object.freeze(LOCKS.map((l) => l.id)),
  lockedLockCount: LOCKS.length,
  allLocked: true,
  unlockForbidden: true,
  breakingChangeForbidden: true,
  additiveChangeControlled: true,
  metadataOnly: true,
  freezeOnly: true,
  immutable: true,
  deterministic: true,
});
