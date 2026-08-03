/** EX-3:8 immutable architectural Freeze locks. */

import { ExecutiveTimelineExperienceCertification } from "./executiveTimelineExperienceCertification.ts";
import type { ExecutiveTimelineExperienceFreezeLock } from "./executiveTimelineExperienceFreezeTypes.ts";

const lock = (
  name: ExecutiveTimelineExperienceFreezeLock["name"],
  order: number,
  statement: string,
): ExecutiveTimelineExperienceFreezeLock =>
  Object.freeze({
    lockId: `EX-3:8/Lock/${name}`,
    name,
    order,
    statement,
    outcome: "Locked",
    failClosed: true,
    metadataOnly: true,
    deterministic: true,
    immutable: true,
  });

export const ExecutiveTimelineExperienceFreezeLocks = Object.freeze([
  lock(
    "IdentityLock",
    1,
    "Certification identity remains EX-3:7/ExecutiveTimelineExperienceCertification.",
  ),
  lock(
    "NamespaceLock",
    2,
    "Certification namespace remains nexora.ex.executive.timeline.experience.certification.",
  ),
  lock(
    "UpstreamLock",
    3,
    "Freeze binds only the exact EX-3:7 Certification aggregate reference.",
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
    "CertificationLock",
    6,
    "Certification result remains Certified with sixteen Satisfied criteria.",
  ),
  lock(
    "ContractLock",
    7,
    "Certification contract catalogue remains complete and immutable.",
  ),
  lock(
    "AuthorizationLock",
    8,
    "Authorization remains metadata-only with no Freeze-to-Public-Index expansion.",
  ),
  lock(
    "BoundaryLock",
    9,
    "Certification dependency boundaries remain Platform-only at runtime.",
  ),
  lock(
    "AggregateLock",
    10,
    "Certification aggregate remains frozen and mutually consistent.",
  ),
  lock(
    "ReadinessLock",
    11,
    "Certification readiness remains ReadyForFreeze.",
  ),
  lock(
    "FreezeIntegrityLock",
    12,
    "Freeze eight-file package integrity remains sealed and fail-closed.",
  ),
] as const satisfies readonly ExecutiveTimelineExperienceFreezeLock[]);

export const ExecutiveTimelineExperienceFreezeLockCount = 12 as const;

export const ExecutiveTimelineExperienceFreezeLockedCertification =
  ExecutiveTimelineExperienceCertification;

export const ExecutiveTimelineExperienceFreezeLockSeal = Object.freeze({
  sealId: "EX-3:8/ExecutiveTimelineExperienceFreezeLockSeal" as const,
  lockedCertification: ExecutiveTimelineExperienceFreezeLockedCertification,
  lockedCertificationIdentity:
    ExecutiveTimelineExperienceCertification.identity.id,
  lockedCertificationReadiness:
    ExecutiveTimelineExperienceCertification.readiness,
  lockedCertificationStatus: ExecutiveTimelineExperienceCertification.status,
  lockCount: ExecutiveTimelineExperienceFreezeLockCount,
  allLocked: true as const,
  failClosed: true as const,
  mutationAllowed: false as const,
  metadataOnly: true as const,
  deterministic: true as const,
  immutable: true as const,
});
