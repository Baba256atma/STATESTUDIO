/** EX-2:7 closed metadata-only Certification types. */

export type ExecutiveJournalExperienceCertificationLifecycleState =
  | "Draft"
  | "Prepared"
  | "Review"
  | "Certified"
  | "ReadyForFreeze";

export type ExecutiveJournalExperienceCertificationCriterionOutcome =
  | "Satisfied"
  | "Unsatisfied"
  | "NotEvaluated";

export type ExecutiveJournalExperienceCertificationResultStatus =
  | "Pending"
  | "Failed"
  | "Certified";

export type ExecutiveJournalExperienceCertificationEvidenceKind =
  | "PlatformAggregate"
  | "ProductionBuild"
  | "TypeScript"
  | "TestVerification"
  | "RouteVerification"
  | "DependencyVerification"
  | "AuthorizationDecision";

export type ExecutiveJournalExperienceCertificationCriterionId =
  | "IdentityIntegrity"
  | "NamespaceIntegrity"
  | "PlatformDependencyVerification"
  | "MetadataCompleteness"
  | "ContractCompleteness"
  | "LifecycleValidity"
  | "VocabularyIntegrity"
  | "BoundaryVerification"
  | "ReadinessVerification"
  | "AuthorizationVerification"
  | "DeterministicBehavior"
  | "AggregateConsistency"
  | "PackageIntegrity"
  | "ProductionBuildVerification"
  | "TypeScriptVerification"
  | "RouteVerification";

export interface ExecutiveJournalExperienceCertificationCriterion {
  readonly criterionId: `EX-2:7/Criterion/${ExecutiveJournalExperienceCertificationCriterionId}`;
  readonly name: ExecutiveJournalExperienceCertificationCriterionId;
  readonly order: number;
  readonly statement: string;
  readonly outcome: ExecutiveJournalExperienceCertificationCriterionOutcome;
  readonly metadataOnly: true;
  readonly deterministic: true;
  readonly immutable: true;
}

export interface ExecutiveJournalExperienceCertificationContract {
  readonly contractId: `EX-2:7/Contract/${string}`;
  readonly order: number;
  readonly subject: string;
  readonly metadataOnly: true;
  readonly descriptiveOnly: true;
  readonly repairsInput: false;
  readonly mutatesInput: false;
  readonly runtimeEffects: false;
  readonly authorityCreation: false;
  readonly productionAuthorization: false;
  readonly freezeAuthorized: false;
  readonly immutable: true;
}

export interface ExecutiveJournalExperienceCertificationEvidenceRef {
  readonly evidenceId: `EX-2:7/Evidence/${string}`;
  readonly order: number;
  readonly kind: ExecutiveJournalExperienceCertificationEvidenceKind;
  readonly reference: string;
  readonly duplicatesUpstream: false;
  readonly readOnly: true;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface ExecutiveJournalExperienceCertificationSummary {
  readonly identity: "EX-2:7/ExecutiveJournalExperienceCertification";
  readonly namespace: "nexora.ex.executive.journal.experience.certification";
  readonly status: "Certified";
  readonly readiness: "ReadyForFreeze";
  readonly previousPhase: "EX-2:6 — Executive Journal Experience Platform";
  readonly nextPhase: "EX-2:8 — Executive Journal Experience Freeze";
  readonly criterionCount: 16;
  readonly contractCount: 10;
  readonly evidenceCount: 7;
  readonly decisionCount: 6;
  readonly lifecycleStateCount: 5;
  readonly authorizationDecisionId: "AD-EX2-14";
  readonly platformIdentity: "EX-2:6/ExecutiveJournalExperiencePlatform";
  readonly platformReadiness: "ReadyForCertification";
  readonly platformEligible: true;
  readonly metadataOnly: true;
  readonly deterministic: true;
  readonly sideEffectFree: true;
  readonly modifiesPlatform: false;
  readonly freezeCreated: false;
  readonly freezeAuthorized: false;
  readonly publicIndexCreated: false;
  readonly ciLintClassification: "CiStillBlockedByParkedReactCompilerDebt";
}
