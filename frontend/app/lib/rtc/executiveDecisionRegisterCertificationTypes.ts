/**
 * RTC-3:9 — Executive Decision Register Certification & Release Readiness Types.
 *
 * Closed certification result, gate, evidence, and manifest vocabularies.
 * Evaluation only — never authorizes consumption, integration, or deployment.
 *
 * Ownership: owned exclusively by RTC-3:9.
 */

import type { ExecutiveDecisionRegisterAssuranceResultKind } from "./executiveDecisionRegisterAssuranceTypes.ts";

/** Certification status. */
export type ExecutiveDecisionRegisterCertificationStatus = "Certification";

/** Phase readiness — not consumption authorization. */
export type ExecutiveDecisionRegisterCertificationReadiness =
  "ReadyForConsumer";

/** Closed certification-result vocabulary. */
export type ExecutiveDecisionRegisterCertificationResultKind =
  | "NotReady"
  | "ReadyForAuthorization";

/** Closed gate-result vocabulary. */
export type ExecutiveDecisionRegisterCertificationGateResultKind =
  | "Pass"
  | "Fail"
  | "NotEvaluated";

/**
 * Closed gate-criticality vocabulary.
 * Blocking: Pass required for ReadyForAuthorization.
 * Disclosure: result recorded truthfully; does not block when AD-RTC3-09 permits.
 */
export type ExecutiveDecisionRegisterCertificationGateCriticality =
  | "Blocking"
  | "Disclosure";

/** Closed mandatory gate IDs. */
export type ExecutiveDecisionRegisterCertificationGateId =
  | "G-01"
  | "G-02"
  | "G-03"
  | "G-04"
  | "G-05"
  | "G-06"
  | "G-07"
  | "G-08"
  | "G-09"
  | "G-10"
  | "G-11"
  | "G-12"
  | "G-13"
  | "G-14"
  | "G-15"
  | "G-16"
  | "G-17"
  | "G-18"
  | "G-19"
  | "G-20"
  | "G-21"
  | "G-22"
  | "G-23"
  | "G-24";

/** Closed verification evidence kinds. */
export type ExecutiveDecisionRegisterCertificationEvidenceKind =
  | "TestSuiteEvidence"
  | "TypeScriptEvidence"
  | "EslintEvidence"
  | "DependencyBoundaryEvidence"
  | "UpstreamReferenceEvidence"
  | "CoverageCompletenessEvidence"
  | "AiProhibitionEvidence"
  | "ControlPreservationEvidence"
  | "OpenIssueEvidence"
  | "ArchitectureDecisionEvidence"
  | "SideEffectBoundaryEvidence"
  | "NoNextPhaseEvidence"
  | "FullProjectTypeScriptEvidence"
  | "AssuranceResultEvidence";

/** Full-project TypeScript classification. */
export type ExecutiveDecisionRegisterFullProjectTypeScriptClassification =
  | "Pass"
  | "Fail"
  | "NotEvaluatedRunnerCrash"
  | "NotEvaluatedEvidenceMissing";

/** Immutable per-gate evidence descriptor. */
export interface ExecutiveDecisionRegisterCertificationGateEvidence {
  readonly evidenceId: string;
  readonly evidenceKind: ExecutiveDecisionRegisterCertificationEvidenceKind;
  readonly evidenceSource: string;
  readonly commandOrInspection: string;
  readonly scope: string;
  readonly diagnosticsCount: number;
  readonly rtc3DiagnosticsCount: number;
  readonly notes: string;
  readonly evaluationTimestampDescriptor: string | null;
  readonly passed: boolean | null;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Test-suite evidence row. */
export interface ExecutiveDecisionRegisterCertificationTestSuiteEvidence {
  readonly suiteId: string;
  readonly present: boolean;
  readonly passed: boolean;
  readonly testCount: number;
  readonly passCount: number;
  readonly failCount: number;
}

/** TypeScript evidence row. */
export interface ExecutiveDecisionRegisterCertificationTypeScriptEvidence {
  readonly scopedSourcesAndTestsPassed: boolean | null;
  readonly productionSourcesPassed: boolean | null;
  readonly fullProjectCommand: string | null;
  readonly fullProjectExitCode: number | null;
  readonly fullProjectCompleted: boolean | null;
  readonly fullProjectDiagnosticsCount: number | null;
  readonly fullProjectRtc3DiagnosticsCount: number | null;
  readonly fullProjectRunnerCrash: boolean;
  readonly fullProjectClassification:
    | ExecutiveDecisionRegisterFullProjectTypeScriptClassification
    | null;
}

/** Immutable certification evidence package — caller supplied. */
export interface ExecutiveDecisionRegisterCertificationEvidencePackage {
  readonly packageId: string;
  readonly evidenceDigest: string;
  readonly assuranceResultKind: ExecutiveDecisionRegisterAssuranceResultKind | null;
  readonly assuranceIdentity: string | null;
  readonly assuranceAggregateExactReference: boolean | null;
  readonly assuranceErrorOrCriticalFindings: number | null;
  readonly assuranceIndeterminateUnresolved: boolean | null;
  readonly assuranceCoverageComplete: boolean | null;
  readonly testSuites: readonly ExecutiveDecisionRegisterCertificationTestSuiteEvidence[];
  readonly typeScript: ExecutiveDecisionRegisterCertificationTypeScriptEvidence;
  readonly eslintExitCode: number | null;
  readonly eslintErrorCount: number | null;
  readonly eslintWarningCount: number | null;
  readonly dependencyBoundaryOk: boolean | null;
  readonly upstreamReferencesExact: boolean | null;
  readonly coverageTablesComplete: boolean | null;
  readonly aiProhibitionsPreserved: boolean | null;
  readonly controlsPreserved: boolean | null;
  readonly openIssuesUnresolvedUnchanged: boolean | null;
  readonly architectureDecisionsPreserved: boolean | null;
  readonly sideEffectFlagsFalse: boolean | null;
  readonly noRtc310Files: boolean | null;
  readonly noInventedNextPhase: boolean | null;
  readonly gateEvidence: Readonly<
    Record<
      ExecutiveDecisionRegisterCertificationGateId,
      ExecutiveDecisionRegisterCertificationGateEvidence
    >
  >;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly containsPayload: false;
}

/** Ordered gate evaluation result. */
export interface ExecutiveDecisionRegisterCertificationGateResult {
  readonly gateId: ExecutiveDecisionRegisterCertificationGateId;
  readonly gateName: string;
  readonly order: number;
  readonly criticality: ExecutiveDecisionRegisterCertificationGateCriticality;
  readonly result: ExecutiveDecisionRegisterCertificationGateResultKind;
  readonly evidenceId: string;
  readonly evidenceKind: ExecutiveDecisionRegisterCertificationEvidenceKind | "MissingEvidence";
  readonly evidenceSource: string;
  readonly commandOrInspection: string;
  readonly scope: string;
  readonly diagnosticsCount: number;
  readonly rtc3DiagnosticsCount: number;
  readonly notes: string;
  readonly evaluationTimestampDescriptor: string | null;
  readonly reasonCode: string;
  readonly message: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Architecture decision record for RTC-3:9 (AD-RTC3-09). */
export interface ExecutiveDecisionRegisterCertificationArchitectureDecision {
  readonly decisionId: "AD-RTC3-09";
  readonly title: "Permit RTC-3 Scoped TypeScript Certification with Full-Project Disclosure";
  readonly status: "Accepted";
  readonly decision: string;
  readonly rationale: string;
  readonly consequences: readonly string[];
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Immutable certification manifest. */
export interface ExecutiveDecisionRegisterCertificationManifest {
  readonly certificationId: "RTC-3:9/ExecutiveDecisionRegisterCertification";
  readonly namespace: "nexora.rtc.executive.decision.register.certification";
  readonly status: ExecutiveDecisionRegisterCertificationStatus;
  readonly readiness: ExecutiveDecisionRegisterCertificationReadiness;
  readonly upstreamAssuranceIdentity: "RTC-3:8/ExecutiveDecisionRegisterAssurance";
  readonly certificationResult: ExecutiveDecisionRegisterCertificationResultKind;
  readonly gateResults: readonly ExecutiveDecisionRegisterCertificationGateResult[];
  readonly totalGateCount: number;
  readonly blockingGateCount: number;
  readonly blockingPassedCount: number;
  readonly blockingFailedCount: number;
  readonly blockingNotEvaluatedCount: number;
  readonly disclosureGateCount: number;
  readonly disclosurePassedCount: number;
  readonly disclosureFailedCount: number;
  readonly disclosureNotEvaluatedCount: number;
  readonly passedGateCount: number;
  readonly failedGateCount: number;
  readonly notEvaluatedGateCount: number;
  readonly rtc3PhaseTestResults: readonly ExecutiveDecisionRegisterCertificationTestSuiteEvidence[];
  readonly rtc2RegressionResults: readonly ExecutiveDecisionRegisterCertificationTestSuiteEvidence[];
  readonly rtc1RegressionResults: readonly ExecutiveDecisionRegisterCertificationTestSuiteEvidence[];
  readonly scopedTypeScriptResult: "Pass" | "Fail" | "NotEvaluated";
  readonly productionTypeScriptResult: "Pass" | "Fail" | "NotEvaluated";
  readonly fullProjectTypeScriptResult: "Pass" | "Fail" | "NotEvaluated";
  readonly fullProjectClassification:
    | ExecutiveDecisionRegisterFullProjectTypeScriptClassification
    | "NotEvaluatedEvidenceMissing";
  readonly fullProjectDiagnosticsCount: number | null;
  readonly fullProjectRtc3DiagnosticsCount: number | null;
  readonly repositoryWideTypeScriptHealth: "not certified";
  readonly rtc3ScopedTypeScriptHealth: "certified" | "not certified";
  readonly eslintResult: "Pass" | "Fail" | "NotEvaluated";
  readonly dependencyBoundaryResult: "Pass" | "Fail" | "NotEvaluated";
  readonly architectureDecisionIds: readonly [
    "AD-RTC3-06",
    "AD-RTC3-07",
    "AD-RTC3-08",
    "AD-RTC3-09",
  ];
  readonly phaseDecisionIds: readonly string[];
  readonly openIssueIds: readonly [
    "OI-01",
    "OI-02",
    "OI-03",
    "OI-04",
    "OI-05",
    "OI-06",
  ];
  readonly humanAuthorizationRequired: true;
  readonly authorizationRecorded: false;
  readonly consumptionAuthorized: false;
  readonly integrationAuthorized: false;
  readonly deploymentAuthorized: false;
  readonly publicIndexAuthorized: false;
  readonly rtc310CreationAuthorized: false;
  readonly nextPhaseDecisionRequired: true;
  readonly terminalDecisionMarker: "nextPhaseDecisionRequired";
  readonly evidenceDigest: string;
  readonly summary: string;
  readonly inventedTimestamp: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

/** Discriminated certification result. */
export type ExecutiveDecisionRegisterCertificationResult =
  | {
      readonly kind: "NotReady";
      readonly reasonCode: string;
      readonly reason: string;
      readonly packageId: string;
      readonly gateResults: readonly ExecutiveDecisionRegisterCertificationGateResult[];
      readonly manifest: ExecutiveDecisionRegisterCertificationManifest;
      readonly metadataOnly: true;
      readonly immutable: true;
      readonly deterministic: true;
      readonly authorizesConsumption: false;
      readonly authorizesIntegration: false;
      readonly authorizesDeployment: false;
    }
  | {
      readonly kind: "ReadyForAuthorization";
      readonly reasonCode: "CERT-READY-FOR-AUTHORIZATION";
      readonly reason: string;
      readonly packageId: string;
      readonly gateResults: readonly ExecutiveDecisionRegisterCertificationGateResult[];
      readonly manifest: ExecutiveDecisionRegisterCertificationManifest;
      readonly metadataOnly: true;
      readonly immutable: true;
      readonly deterministic: true;
      readonly requiresHumanAuthorization: true;
      readonly authorizesConsumption: false;
      readonly authorizesIntegration: false;
      readonly authorizesDeployment: false;
    };

export interface ExecutiveDecisionRegisterCertificationIdentityDescriptor {
  readonly id: "RTC-3:9/ExecutiveDecisionRegisterCertification";
  readonly name: "Executive Decision Register Certification & Release Readiness";
  readonly phaseId: "RTC-3:9";
  readonly version: "1.0.0";
  readonly namespace: "nexora.rtc.executive.decision.register.certification";
  readonly status: ExecutiveDecisionRegisterCertificationStatus;
  readonly readiness: ExecutiveDecisionRegisterCertificationReadiness;
  readonly layer: "Runtime Layer";
  readonly architecture: "NPA-T vNext";
  readonly domain: "Executive Decision Register";
  readonly sourceAssurance: "RTC-3:8/ExecutiveDecisionRegisterAssurance";
  readonly upstream: "RTC-3:8 — Executive Decision Register Reconciliation & Assurance";
  readonly previousPhase: "RTC-3:8 — Executive Decision Register Reconciliation & Assurance";
  readonly nextPhaseDecisionRequired: true;
  readonly description: string;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface ExecutiveDecisionRegisterCertificationSummary {
  readonly certificationId: "RTC-3:9/ExecutiveDecisionRegisterCertification";
  readonly version: "1.0.0";
  readonly name: "Executive Decision Register Certification & Release Readiness";
  readonly namespace: "nexora.rtc.executive.decision.register.certification";
  readonly status: ExecutiveDecisionRegisterCertificationStatus;
  readonly readiness: ExecutiveDecisionRegisterCertificationReadiness;
  readonly gateCount: number;
  readonly openIssueCount: number;
  readonly decisionCount: number;
  readonly sourceAssurance: "RTC-3:8/ExecutiveDecisionRegisterAssurance";
  readonly previousPhase: "RTC-3:8 — Executive Decision Register Reconciliation & Assurance";
  readonly nextPhaseDecisionRequired: true;
  readonly architectureDecisionIds: readonly [
    "AD-RTC3-06",
    "AD-RTC3-07",
    "AD-RTC3-08",
    "AD-RTC3-09",
  ];
  readonly humanAuthorizationRequired: true;
  readonly authorizationRecorded: false;
  readonly consumptionAuthorized: false;
  readonly integrationAuthorized: false;
  readonly deploymentAuthorized: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}
