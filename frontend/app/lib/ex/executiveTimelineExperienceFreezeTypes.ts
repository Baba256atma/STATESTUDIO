/** EX-3:8 closed metadata-only Freeze types. */

export type ExecutiveTimelineExperienceFreezeLifecycleState =
  | "Draft"
  | "Prepared"
  | "Validated"
  | "Frozen"
  | "ReadyForPublicIndex";

export type ExecutiveTimelineExperienceFreezeLockOutcome =
  | "Locked"
  | "Unlocked"
  | "NotEvaluated";

export type ExecutiveTimelineExperienceFreezeLockName =
  | "IdentityLock"
  | "NamespaceLock"
  | "UpstreamLock"
  | "MetadataLock"
  | "LifecycleLock"
  | "CertificationLock"
  | "ContractLock"
  | "AuthorizationLock"
  | "BoundaryLock"
  | "AggregateLock"
  | "ReadinessLock"
  | "FreezeIntegrityLock";

export type ExecutiveTimelineExperienceFreezeContractName =
  | "Upstream"
  | "Freeze"
  | "Metadata"
  | "Boundary"
  | "Authorization"
  | "Lifecycle"
  | "Integrity"
  | "Readiness"
  | "Publication"
  | "Aggregate";

export interface ExecutiveTimelineExperienceFreezeLock {
  readonly lockId: `EX-3:8/Lock/${ExecutiveTimelineExperienceFreezeLockName}`;
  readonly name: ExecutiveTimelineExperienceFreezeLockName;
  readonly order: number;
  readonly statement: string;
  readonly outcome: "Locked";
  readonly failClosed: true;
  readonly metadataOnly: true;
  readonly deterministic: true;
  readonly immutable: true;
}

export interface ExecutiveTimelineExperienceFreezeContract {
  readonly contractId:
    `EX-3:8/Contract/${ExecutiveTimelineExperienceFreezeContractName}`;
  readonly name: ExecutiveTimelineExperienceFreezeContractName;
  readonly order: number;
  readonly subject: string;
  readonly descriptiveOnly: true;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface ExecutiveTimelineExperienceFreezeSummary {
  readonly identity: "EX-3:8/ExecutiveTimelineExperienceFreeze";
  readonly namespace: "nexora.ex.executive.timeline.experience.freeze";
  readonly version: "1.0.0";
  readonly status: "Frozen";
  readonly readiness: "ReadyForPublicIndex";
  readonly previousPhase: "EX-3:7 — Executive Timeline Experience Certification";
  readonly nextPhase: "EX-3:9 — Executive Timeline Experience Public Index";
  readonly upstreamDependency: "EX-3:7/ExecutiveTimelineExperienceCertification";
  readonly lockCount: 12;
  readonly contractCount: 10;
  readonly metadataOnly: true;
  readonly deterministic: true;
  readonly sideEffectFree: true;
  readonly sealed: true;
  readonly publicIndexCreated: false;
  readonly publicIndexAuthorized: false;
}
