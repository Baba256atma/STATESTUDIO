/** EX-3:7 closed metadata-only Certification types. */

export type ExecutiveTimelineExperienceCertificationLifecycleState =
  | "Draft"
  | "Prepared"
  | "Review"
  | "Certified"
  | "ReadyForFreeze";

export type ExecutiveTimelineExperienceCertificationCriterionOutcome =
  | "Satisfied"
  | "Unsatisfied"
  | "NotEvaluated";

export type ExecutiveTimelineExperienceCertificationCriterionName =
  | "IdentityIntegrity"
  | "NamespaceIntegrity"
  | "PlatformDependencyIntegrity"
  | "CapabilityBindingCompleteness"
  | "ContractCompleteness"
  | "MetadataIntegrity"
  | "LifecycleIntegrity"
  | "ConsumerBindingIntegrity"
  | "EligibilityIntegrity"
  | "ReadinessIntegrity"
  | "AggregateIntegrity"
  | "ArchitecturalBoundaryIntegrity"
  | "DeterministicBehavior"
  | "TypeScriptVerification"
  | "ESLintVerification"
  | "PlatformVerification";

export type ExecutiveTimelineExperienceCertificationContractName =
  | "Upstream"
  | "Certification"
  | "Metadata"
  | "Boundary"
  | "Authorization"
  | "Evidence"
  | "Lifecycle"
  | "Readiness"
  | "Integrity"
  | "Aggregate";

export interface ExecutiveTimelineExperienceCertificationCriterion {
  readonly criterionId:
    `EX-3:7/Criterion/${ExecutiveTimelineExperienceCertificationCriterionName}`;
  readonly name: ExecutiveTimelineExperienceCertificationCriterionName;
  readonly order: number;
  readonly statement: string;
  readonly outcome: "Satisfied";
  readonly descriptiveOnly: true;
  readonly executable: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface ExecutiveTimelineExperienceCertificationContract {
  readonly contractId:
    `EX-3:7/Contract/${ExecutiveTimelineExperienceCertificationContractName}`;
  readonly name: ExecutiveTimelineExperienceCertificationContractName;
  readonly order: number;
  readonly subject: string;
  readonly descriptiveOnly: true;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface ExecutiveTimelineExperienceCertificationSummary {
  readonly identity: "EX-3:7/ExecutiveTimelineExperienceCertification";
  readonly namespace: "nexora.ex.executive.timeline.experience.certification";
  readonly version: "1.0.0";
  readonly status: "Certified";
  readonly readiness: "ReadyForFreeze";
  readonly previousPhase: "EX-3:6 — Executive Timeline Experience Platform";
  readonly nextPhase: "EX-3:8 — Executive Timeline Experience Freeze";
  readonly upstreamDependency: "EX-3:6/ExecutiveTimelineExperiencePlatform";
  readonly criteriaCount: 16;
  readonly contractCount: 10;
  readonly metadataOnly: true;
  readonly deterministic: true;
  readonly sideEffectFree: true;
  readonly freezeCreated: false;
  readonly freezeAuthorized: false;
}
