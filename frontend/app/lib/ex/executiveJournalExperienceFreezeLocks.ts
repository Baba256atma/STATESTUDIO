import { ExecutiveJournalExperienceCertification } from "./executiveJournalExperienceCertification.ts";
import type { ExecutiveJournalExperienceFreezeLock } from "./executiveJournalExperienceFreezeTypes.ts";

const lock = (
  name:
    | "IdentityLock"
    | "NamespaceLock"
    | "UpstreamLock"
    | "MetadataLock"
    | "LifecycleLock"
    | "ContractsLock"
    | "CertificationLock"
    | "AuthorizationLock"
    | "BoundaryLock"
    | "ReadinessLock"
    | "AggregateLock"
    | "FreezeIntegrityLock",
  order: number,
  statement: string,
): ExecutiveJournalExperienceFreezeLock =>
  Object.freeze({
    lockId: `EX-2:8/Lock/${name}`,
    name,
    order,
    statement,
    outcome: "Locked" as const,
    failClosed: true as const,
    metadataOnly: true as const,
    deterministic: true as const,
    immutable: true as const,
  });

/**
 * Immutable architectural locks. Outcomes are metadata declarations sealed
 * against the exact ReadyForFreeze Certification aggregate.
 */
export const ExecutiveJournalExperienceFreezeLocks = Object.freeze([
  lock(
    "IdentityLock",
    1,
    "Certification identity remains EX-2:7/ExecutiveJournalExperienceCertification.",
  ),
  lock(
    "NamespaceLock",
    2,
    "Certification namespace remains nexora.ex.executive.journal.experience.certification.",
  ),
  lock(
    "UpstreamLock",
    3,
    "Freeze binds only the exact EX-2:7 Certification aggregate reference.",
  ),
  lock(
    "MetadataLock",
    4,
    "Certification metadata, criteria, evidence, and decisions remain sealed.",
  ),
  lock(
    "LifecycleLock",
    5,
    "Certification lifecycle remains terminal at ReadyForFreeze.",
  ),
  lock(
    "ContractsLock",
    6,
    "Certification contract catalogue remains complete and immutable.",
  ),
  lock(
    "CertificationLock",
    7,
    "Certification result remains Certified with sixteen Satisfied criteria.",
  ),
  lock(
    "AuthorizationLock",
    8,
    "Authorization remains AD-EX2-14 Accepted with no expansion.",
  ),
  lock(
    "BoundaryLock",
    9,
    "Certification dependency boundaries remain Platform-only at runtime.",
  ),
  lock(
    "ReadinessLock",
    10,
    "Certification readiness remains ReadyForFreeze.",
  ),
  lock(
    "AggregateLock",
    11,
    "Certification aggregate remains frozen and mutually consistent.",
  ),
  lock(
    "FreezeIntegrityLock",
    12,
    "Freeze eight-file package integrity remains sealed and fail-closed.",
  ),
] as const);

export const ExecutiveJournalExperienceFreezeLockByName = Object.freeze({
  identity: ExecutiveJournalExperienceFreezeLocks[0],
  namespace: ExecutiveJournalExperienceFreezeLocks[1],
  upstream: ExecutiveJournalExperienceFreezeLocks[2],
  metadata: ExecutiveJournalExperienceFreezeLocks[3],
  lifecycle: ExecutiveJournalExperienceFreezeLocks[4],
  contracts: ExecutiveJournalExperienceFreezeLocks[5],
  certification: ExecutiveJournalExperienceFreezeLocks[6],
  authorization: ExecutiveJournalExperienceFreezeLocks[7],
  boundary: ExecutiveJournalExperienceFreezeLocks[8],
  readiness: ExecutiveJournalExperienceFreezeLocks[9],
  aggregate: ExecutiveJournalExperienceFreezeLocks[10],
  freezeIntegrity: ExecutiveJournalExperienceFreezeLocks[11],
});

/** Exact upstream certification sealed by the lock catalogue. */
export const ExecutiveJournalExperienceFreezeLockedCertification =
  ExecutiveJournalExperienceCertification;

export const ExecutiveJournalExperienceFreezeLockSeal = Object.freeze({
  sealId: "EX-2:8/ExecutiveJournalExperienceFreezeLockSeal" as const,
  lockedCertification: ExecutiveJournalExperienceFreezeLockedCertification,
  lockedCertificationIdentity: ExecutiveJournalExperienceCertification.identity.id,
  lockedCertificationReadiness: ExecutiveJournalExperienceCertification.readiness,
  lockedCertificationStatus: ExecutiveJournalExperienceCertification.status,
  lockCount: 12 as const,
  allLocked: true as const,
  failClosed: true as const,
  mutationAllowed: false as const,
  metadataOnly: true as const,
  deterministic: true as const,
  immutable: true as const,
});
